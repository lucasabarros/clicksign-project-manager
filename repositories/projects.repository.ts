import { readLocalStorageItem, writeLocalStorageItem } from './local-storage.client'
import { isValidCalendarDate, isValidIsoDateTime } from '~/utils/date'
import type { Project } from '~/types/project'

const STORAGE_KEY = 'clicksign-project-manager:projects'

export type ProjectsLoadErrorReason = 'unavailable' | 'corrupted'

export interface LoadProjectsResult {
  projects: Project[]
  error: ProjectsLoadErrorReason | null
  discardedCount: number
}

export interface SaveProjectsResult {
  success: boolean
  quotaExceeded: boolean
}

export interface ProjectsRepository {
  load(): LoadProjectsResult
  save(projects: Project[]): SaveProjectsResult
}

function isValidProjectRecord(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>

  return (
    typeof record.id === 'string' &&
    record.id.length > 0 &&
    typeof record.name === 'string' &&
    record.name.length > 0 &&
    typeof record.client === 'string' &&
    record.client.length > 0 &&
    typeof record.startDate === 'string' &&
    isValidCalendarDate(record.startDate) &&
    typeof record.endDate === 'string' &&
    isValidCalendarDate(record.endDate) &&
    (record.coverImage === null || typeof record.coverImage === 'string') &&
    typeof record.isFavorite === 'boolean' &&
    typeof record.createdAt === 'string' &&
    isValidIsoDateTime(record.createdAt)
  )
}

function sanitizeProjects(raw: unknown): { projects: Project[]; discardedCount: number } {
  if (!Array.isArray(raw)) return { projects: [], discardedCount: 0 }

  const projects: Project[] = []
  let discardedCount = 0

  for (const item of raw) {
    if (isValidProjectRecord(item)) {
      projects.push(item)
    } else {
      discardedCount += 1
    }
  }

  return { projects, discardedCount }
}

export function createLocalStorageProjectsRepository(): ProjectsRepository {
  return {
    load(): LoadProjectsResult {
      const result = readLocalStorageItem(STORAGE_KEY)

      if (result.status === 'not-found') {
        return { projects: [], error: null, discardedCount: 0 }
      }
      if (result.status === 'error') {
        return { projects: [], error: 'unavailable', discardedCount: 0 }
      }

      try {
        const parsed: unknown = JSON.parse(result.value)
        const { projects, discardedCount } = sanitizeProjects(parsed)
        return { projects, error: null, discardedCount }
      } catch {
        return { projects: [], error: 'corrupted', discardedCount: 0 }
      }
    },

    save(projects: Project[]): SaveProjectsResult {
      const result = writeLocalStorageItem(STORAGE_KEY, JSON.stringify(projects))
      return {
        success: result.status === 'success',
        quotaExceeded: result.status === 'quota-exceeded',
      }
    },
  }
}
