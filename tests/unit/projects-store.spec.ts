import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useProjectsStore } from '~/stores/projects'
import { useSearchStore } from '~/stores/search'
import { useToastStore } from '~/stores/toast'
import type { ProjectFormInput } from '~/types/project'

const STORAGE_KEY = 'clicksign-project-manager:projects'

function input(overrides: Partial<ProjectFormInput> = {}): ProjectFormInput {
  return {
    name: 'Projeto Teste',
    client: 'Clicksign',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    coverImage: null,
    ...overrides,
  }
}

beforeEach(() => {
  window.localStorage.clear()
  setActivePinia(createPinia())
})

describe('useProjectsStore — empty state precedence', () => {
  it('is "empty" whenever there are zero projects, even mid-search or with the favorites filter on', () => {
    const store = useProjectsStore()
    expect(store.emptyStateVariant).toBe('empty')

    store.favoritesOnly = true
    useSearchStore().setQuery('abc')
    expect(store.emptyStateVariant).toBe('empty')
  })

  it('is "search" when a search yields no results, even with the favorites filter also on', () => {
    const store = useProjectsStore()
    store.addProject(input({ name: 'Projeto Alfa' }))
    store.favoritesOnly = true
    useSearchStore().setQuery('não existe')

    expect(store.emptyStateVariant).toBe('search')
  })

  it('is "favorites" only when the favorites filter (not search) causes the empty result', () => {
    const store = useProjectsStore()
    store.addProject(input({ name: 'Projeto Alfa' }))
    store.favoritesOnly = true

    expect(store.emptyStateVariant).toBe('favorites')
  })

  it('is "none" once there is at least one visible project', () => {
    const store = useProjectsStore()
    store.addProject(input())

    expect(store.emptyStateVariant).toBe('none')
  })
})

describe('useProjectsStore — CRUD', () => {
  it('creates, updates and removes a project, persisting each time', () => {
    const store = useProjectsStore()
    const project = store.addProject(input({ name: 'Original' }))
    expect(store.totalCount).toBe(1)

    store.updateProject(project.id, input({ name: 'Atualizado' }))
    expect(store.getById(project.id)?.name).toBe('Atualizado')

    store.removeProject(project.id)
    expect(store.totalCount).toBe(0)

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(persisted).toEqual([])
  })

  it('toggles favorite state without affecting other fields', () => {
    const store = useProjectsStore()
    const project = store.addProject(input())

    store.toggleFavorite(project.id)
    expect(store.getById(project.id)?.isFavorite).toBe(true)

    store.toggleFavorite(project.id)
    expect(store.getById(project.id)?.isFavorite).toBe(false)
  })

  it('the counter always reflects the total, regardless of active filters', () => {
    const store = useProjectsStore()
    store.addProject(input({ name: 'Um' }))
    store.addProject(input({ name: 'Dois' }))

    store.favoritesOnly = true
    expect(store.totalCount).toBe(2)
  })
})

describe('useProjectsStore — hydrate', () => {
  it('emits a single aggregated toast when some saved records are discarded, not one per record', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'broken-1' }, { id: 'broken-2' }]),
    )

    useProjectsStore().hydrate()

    const toasts = useToastStore().toasts
    const discardToasts = toasts.filter((toast) => toast.key === 'projects-load-discarded')
    expect(discardToasts).toHaveLength(1)
    expect(discardToasts[0]?.message).toContain('2 projetos')
  })
})
