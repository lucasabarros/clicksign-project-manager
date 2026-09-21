import { describe, expect, it } from 'vitest'
import { sortProjects } from '~/stores/projects'
import type { Project } from '~/types/project'

function buildProject(overrides: Partial<Project>): Project {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    name: 'Projeto',
    client: 'Clicksign',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    coverImage: null,
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('sortProjects — alphabetical', () => {
  it('orders case/accent-insensitively by name, pt-BR locale', () => {
    const projects = [
      buildProject({ id: '1', name: 'órion' }),
      buildProject({ id: '2', name: 'Azul' }),
      buildProject({ id: '3', name: 'banana' }),
    ]

    const sorted = sortProjects(projects, 'alphabetical')
    expect(sorted.map((p) => p.id)).toEqual(['2', '3', '1'])
  })

  it('breaks ties by createdAt when names are equal', () => {
    const projects = [
      buildProject({ id: 'later', name: 'Mesmo Nome', createdAt: '2024-02-01T00:00:00.000Z' }),
      buildProject({ id: 'earlier', name: 'Mesmo Nome', createdAt: '2024-01-01T00:00:00.000Z' }),
    ]

    const sorted = sortProjects(projects, 'alphabetical')
    expect(sorted.map((p) => p.id)).toEqual(['earlier', 'later'])
  })
})

describe('sortProjects — recentlyStarted', () => {
  it('orders by startDate descending', () => {
    const projects = [
      buildProject({ id: 'old', startDate: '2023-01-01' }),
      buildProject({ id: 'new', startDate: '2024-06-01' }),
      buildProject({ id: 'mid', startDate: '2024-01-01' }),
    ]

    const sorted = sortProjects(projects, 'recentlyStarted')
    expect(sorted.map((p) => p.id)).toEqual(['new', 'mid', 'old'])
  })
})

describe('sortProjects — closestDeadline', () => {
  const referenceDate = new Date(2024, 5, 15)

  it('shows upcoming deadlines before overdue ones', () => {
    const projects = [
      buildProject({ id: 'overdue', endDate: '2024-06-01' }),
      buildProject({ id: 'upcoming', endDate: '2024-07-01' }),
    ]

    const sorted = sortProjects(projects, 'closestDeadline', referenceDate)
    expect(sorted.map((p) => p.id)).toEqual(['upcoming', 'overdue'])
  })

  it('orders upcoming deadlines ascending (soonest first)', () => {
    const projects = [
      buildProject({ id: 'later', endDate: '2024-08-01' }),
      buildProject({ id: 'soonest', endDate: '2024-06-20' }),
    ]

    const sorted = sortProjects(projects, 'closestDeadline', referenceDate)
    expect(sorted.map((p) => p.id)).toEqual(['soonest', 'later'])
  })

  it('orders overdue deadlines with the most recently overdue first', () => {
    const projects = [
      buildProject({ id: 'longOverdue', endDate: '2024-01-01' }),
      buildProject({ id: 'recentlyOverdue', endDate: '2024-06-10' }),
    ]

    const sorted = sortProjects(projects, 'closestDeadline', referenceDate)
    expect(sorted.map((p) => p.id)).toEqual(['recentlyOverdue', 'longOverdue'])
  })

  it('treats a deadline of exactly today as not yet overdue', () => {
    const projects = [
      buildProject({ id: 'dueToday', endDate: '2024-06-15' }),
      buildProject({ id: 'overdue', endDate: '2024-06-14' }),
    ]

    const sorted = sortProjects(projects, 'closestDeadline', referenceDate)
    expect(sorted.map((p) => p.id)).toEqual(['dueToday', 'overdue'])
  })

  it('ignores the time-of-day component of the reference date', () => {
    const laterSameDayReference = new Date(2024, 5, 15, 23, 59)
    const projects = [buildProject({ id: 'dueToday', endDate: '2024-06-15' })]

    const sorted = sortProjects(projects, 'closestDeadline', laterSameDayReference)
    expect(sorted.map((p) => p.id)).toEqual(['dueToday'])
  })
})
