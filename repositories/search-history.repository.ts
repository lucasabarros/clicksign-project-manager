import { readLocalStorageItem, writeLocalStorageItem } from './local-storage.client'

const STORAGE_KEY = 'clicksign-project-manager:search-history'
export const MAX_SEARCH_HISTORY_ITEMS = 5

export type SearchHistoryLoadErrorReason = 'unavailable' | 'corrupted'

export interface LoadSearchHistoryResult {
  entries: string[]
  error: SearchHistoryLoadErrorReason | null
}

export interface SaveSearchHistoryResult {
  success: boolean
  quotaExceeded: boolean
}

export interface SearchHistoryRepository {
  load(): LoadSearchHistoryResult
  save(entries: string[]): SaveSearchHistoryResult
}

function sanitizeSearchHistory(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .slice(0, MAX_SEARCH_HISTORY_ITEMS)
}

export function createLocalStorageSearchHistoryRepository(): SearchHistoryRepository {
  return {
    load(): LoadSearchHistoryResult {
      const result = readLocalStorageItem(STORAGE_KEY)

      if (result.status === 'not-found') {
        return { entries: [], error: null }
      }
      if (result.status === 'error') {
        return { entries: [], error: 'unavailable' }
      }

      try {
        const parsed: unknown = JSON.parse(result.value)
        return { entries: sanitizeSearchHistory(parsed), error: null }
      } catch {
        return { entries: [], error: 'corrupted' }
      }
    },

    save(entries: string[]): SaveSearchHistoryResult {
      const result = writeLocalStorageItem(
        STORAGE_KEY,
        JSON.stringify(entries.slice(0, MAX_SEARCH_HISTORY_ITEMS)),
      )
      return {
        success: result.status === 'success',
        quotaExceeded: result.status === 'quota-exceeded',
      }
    },
  }
}
