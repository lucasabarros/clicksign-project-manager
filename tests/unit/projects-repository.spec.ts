import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLocalStorageProjectsRepository } from '~/repositories/projects.repository'

const STORAGE_KEY = 'clicksign-project-manager:projects'

function validProjectRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 'p1',
    name: 'Projeto Válido',
    client: 'Clicksign',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    coverImage: null,
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('createLocalStorageProjectsRepository — load', () => {
  it('returns an empty list with no error when nothing is stored yet', () => {
    const repository = createLocalStorageProjectsRepository()
    const result = repository.load()

    expect(result).toEqual({ projects: [], error: null, discardedCount: 0 })
  })

  it('loads valid, previously saved projects', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([validProjectRecord()]))

    const result = createLocalStorageProjectsRepository().load()

    expect(result.error).toBeNull()
    expect(result.discardedCount).toBe(0)
    expect(result.projects).toHaveLength(1)
    expect(result.projects[0]?.id).toBe('p1')
  })

  it('reports corrupted JSON distinctly, without throwing', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not valid json')

    const result = createLocalStorageProjectsRepository().load()

    expect(result.error).toBe('corrupted')
    expect(result.projects).toEqual([])
  })

  it('discards structurally invalid records individually, keeping the valid ones', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        validProjectRecord({ id: 'good' }),
        { id: 'missing-fields' },
        validProjectRecord({ id: 'bad-date', startDate: '2024-02-30' }),
      ]),
    )

    const result = createLocalStorageProjectsRepository().load()

    expect(result.error).toBeNull()
    expect(result.discardedCount).toBe(2)
    expect(result.projects.map((p) => p.id)).toEqual(['good'])
  })

  it('rejects a record whose createdAt is not a valid ISO datetime', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([validProjectRecord({ createdAt: 'not-a-date' })]),
    )

    const result = createLocalStorageProjectsRepository().load()

    expect(result.discardedCount).toBe(1)
    expect(result.projects).toEqual([])
  })
})

describe('createLocalStorageProjectsRepository — save', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('persists successfully under normal conditions', () => {
    const result = createLocalStorageProjectsRepository().save([validProjectRecord() as never])
    expect(result).toEqual({ success: true, quotaExceeded: false })
  })

  it('reports a quota-exceeded write distinctly from a generic write error', () => {
    const quotaError = new DOMException('quota exceeded', 'QuotaExceededError')
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw quotaError
    })

    const result = createLocalStorageProjectsRepository().save([])

    expect(result).toEqual({ success: false, quotaExceeded: true })
  })
})
