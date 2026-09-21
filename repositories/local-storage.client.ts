export type LocalStorageReadResult =
  | { status: 'found'; value: string }
  | { status: 'not-found' }
  | { status: 'error' }

export type LocalStorageWriteResult =
  | { status: 'success' }
  | { status: 'quota-exceeded' }
  | { status: 'error' }

function isStorageAvailable(): boolean {
  return import.meta.client && typeof window !== 'undefined' && !!window.localStorage
}

function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.code === 22 || error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  )
}

export function readLocalStorageItem(key: string): LocalStorageReadResult {
  if (!isStorageAvailable()) {
    return { status: 'error' }
  }

  try {
    const value = window.localStorage.getItem(key)
    return value === null ? { status: 'not-found' } : { status: 'found', value }
  } catch {
    return { status: 'error' }
  }
}

export function writeLocalStorageItem(key: string, value: string): LocalStorageWriteResult {
  if (!isStorageAvailable()) {
    return { status: 'error' }
  }

  try {
    window.localStorage.setItem(key, value)
    return { status: 'success' }
  } catch (error) {
    return { status: isQuotaExceededError(error) ? 'quota-exceeded' : 'error' }
  }
}
