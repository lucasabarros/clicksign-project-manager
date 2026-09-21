import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { createLocalStorageProjectsRepository } from '~/repositories/projects.repository'
import { compareDateStrings, parseLocalDate, startOfLocalDay } from '~/utils/date'
import { normalizeForSearch } from '~/utils/text'
import type { Project, ProjectFormInput, SortOption } from '~/types/project'
import { useSearchStore } from './search'
import { useToastStore } from './toast'

export type EmptyStateVariant = 'none' | 'empty' | 'search' | 'favorites'

function compareAlphabetical(a: Project, b: Project): number {
  return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
}

function isOverdue(endDate: string, today: Date): boolean {
  const end = parseLocalDate(endDate)
  return end !== null && end.getTime() < today.getTime()
}

function compareClosestDeadline(a: Project, b: Project, today: Date): number {
  const aOverdue = isOverdue(a.endDate, today)
  const bOverdue = isOverdue(b.endDate, today)

  if (aOverdue !== bOverdue) {
    return aOverdue ? 1 : -1
  }

  return aOverdue
    ? compareDateStrings(b.endDate, a.endDate)
    : compareDateStrings(a.endDate, b.endDate)
}

function withTieBreak(compare: (a: Project, b: Project) => number) {
  return (a: Project, b: Project): number => {
    const primary = compare(a, b)
    if (primary !== 0) return primary

    const byName = compareAlphabetical(a, b)
    if (byName !== 0) return byName

    return a.createdAt.localeCompare(b.createdAt)
  }
}

export function sortProjects(
  projects: Project[],
  option: SortOption,
  referenceDate: Date = new Date(),
): Project[] {
  const sorted = [...projects]

  if (option === 'alphabetical') {
    sorted.sort(withTieBreak(compareAlphabetical))
  } else if (option === 'recentlyStarted') {
    sorted.sort(withTieBreak((a, b) => compareDateStrings(b.startDate, a.startDate)))
  } else {
    const today = startOfLocalDay(referenceDate)
    sorted.sort(withTieBreak((a, b) => compareClosestDeadline(a, b, today)))
  }

  return sorted
}

export const useProjectsStore = defineStore('projects', () => {
  const searchStore = useSearchStore()

  const projects = ref<Project[]>([])
  const sortOption = ref<SortOption>('alphabetical')
  const favoritesOnly = ref(false)

  const repository = createLocalStorageProjectsRepository()
  let hydrated = false

  function hydrate() {
    if (hydrated) return
    hydrated = true

    const result = repository.load()
    projects.value = result.projects

    const toast = useToastStore()

    if (result.error) {
      toast.error(
        result.error === 'unavailable'
          ? 'Não foi possível carregar seus projetos salvos.'
          : 'Os dados de projetos salvos estavam corrompidos e foram reiniciados.',
        `projects-load-${result.error}`,
      )
    }

    if (result.discardedCount > 0) {
      const isSingular = result.discardedCount === 1
      toast.error(
        `${result.discardedCount} ${isSingular ? 'projeto salvo não pôde' : 'projetos salvos não puderam'} ser carregado${isSingular ? '' : 's'} e ${isSingular ? 'foi ignorado' : 'foram ignorados'}.`,
        'projects-load-discarded',
      )
    }
  }

  function persist(): boolean {
    const result = repository.save(projects.value)

    if (!result.success) {
      useToastStore().error(
        result.quotaExceeded
          ? 'Não foi possível salvar as alterações: armazenamento local cheio. Elas serão perdidas ao atualizar a página.'
          : 'Não foi possível salvar as alterações. Elas serão perdidas ao atualizar a página.',
        'projects-save-error',
      )
    }

    return result.success
  }

  function mutateAndPersist(mutate: () => void): boolean {
    mutate()
    return persist()
  }

  const totalCount = computed(() => projects.value.length)

  const favoriteFilteredProjects = computed(() =>
    favoritesOnly.value ? projects.value.filter((project) => project.isFavorite) : projects.value,
  )

  const searchFilteredProjects = computed(() => {
    const query = searchStore.query
    if (!query) return favoriteFilteredProjects.value

    const normalizedQuery = normalizeForSearch(query)
    return favoriteFilteredProjects.value.filter((project) =>
      normalizeForSearch(project.name).includes(normalizedQuery),
    )
  })

  const visibleProjects = computed(() => sortProjects(searchFilteredProjects.value, sortOption.value))

  const isSearchActive = computed(() => searchStore.query.length > 0)

  const emptyStateVariant = computed<EmptyStateVariant>(() => {
    if (totalCount.value === 0) return 'empty'
    if (visibleProjects.value.length > 0) return 'none'
    if (isSearchActive.value) return 'search'
    if (favoritesOnly.value) return 'favorites'
    return 'none'
  })

  function getById(id: string): Project | undefined {
    return projects.value.find((project) => project.id === id)
  }

  function addProject(input: ProjectFormInput): Project {
    const project: Project = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      client: input.client.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      coverImage: input.coverImage,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    }

    const success = mutateAndPersist(() => {
      projects.value = [...projects.value, project]
    })

    if (success) {
      useToastStore().success('Projeto criado com sucesso.', 'project-created')
    }

    return project
  }

  function updateProject(id: string, input: ProjectFormInput): boolean {
    if (!projects.value.some((project) => project.id === id)) return false

    const success = mutateAndPersist(() => {
      projects.value = projects.value.map((project) =>
        project.id === id
          ? {
              ...project,
              name: input.name.trim(),
              client: input.client.trim(),
              startDate: input.startDate,
              endDate: input.endDate,
              coverImage: input.coverImage,
            }
          : project,
      )
    })

    if (success) {
      useToastStore().success('Projeto atualizado com sucesso.', 'project-updated')
    }

    return true
  }

  function removeProject(id: string): void {
    if (!projects.value.some((project) => project.id === id)) return

    const success = mutateAndPersist(() => {
      projects.value = projects.value.filter((project) => project.id !== id)
    })

    if (success) {
      useToastStore().success('Projeto removido com sucesso.', 'project-removed')
    }
  }

  function toggleFavorite(id: string): void {
    if (!projects.value.some((project) => project.id === id)) return

    mutateAndPersist(() => {
      projects.value = projects.value.map((project) =>
        project.id === id ? { ...project, isFavorite: !project.isFavorite } : project,
      )
    })
  }

  return {
    projects,
    sortOption,
    favoritesOnly,
    totalCount,
    visibleProjects,
    emptyStateVariant,
    hydrate,
    getById,
    addProject,
    updateProject,
    removeProject,
    toggleFavorite,
  }
})
