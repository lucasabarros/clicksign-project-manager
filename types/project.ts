export interface Project {
  id: string
  name: string
  client: string
  startDate: string
  endDate: string
  coverImage: string | null
  isFavorite: boolean
  createdAt: string
}

export type ProjectFormInput = Pick<
  Project,
  'name' | 'client' | 'startDate' | 'endDate' | 'coverImage'
>

export type SortOption = 'alphabetical' | 'recentlyStarted' | 'closestDeadline'

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'alphabetical', label: 'Ordem alfabética' },
  { value: 'recentlyStarted', label: 'Iniciados mais recentes' },
  { value: 'closestDeadline', label: 'Prazo mais próximo' },
]
