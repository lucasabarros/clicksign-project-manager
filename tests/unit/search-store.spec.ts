import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSearchStore } from '~/stores/search'

beforeEach(() => {
  window.localStorage.clear()
  setActivePinia(createPinia())
})

describe('useSearchStore — setQuery', () => {
  it('does not trigger a search below the 3-character minimum, even after trim', () => {
    const store = useSearchStore()
    store.setQuery('  ab  ')
    expect(store.query).toBe('')
  })

  it('trims before checking the minimum length', () => {
    const store = useSearchStore()
    store.setQuery('  abc  ')
    expect(store.query).toBe('abc')
  })

  it('does not add to history — only commitSearch/clearQuery do', () => {
    const store = useSearchStore()
    store.setQuery('projeto')
    expect(store.history).toEqual([])
  })
})

describe('useSearchStore — commitSearch', () => {
  it('does not add a term below the 3-character minimum to history', () => {
    const store = useSearchStore()
    store.commitSearch('  ab  ')
    expect(store.history).toEqual([])
  })

  it('adds a valid term to history, even one with no matching projects', () => {
    const store = useSearchStore()
    store.commitSearch('testeee')
    expect(store.history).toEqual(['testeee'])
  })

  it('moves a case-insensitive duplicate of an older entry to the front', () => {
    const store = useSearchStore()
    store.commitSearch('Projeto Um')
    store.commitSearch('projeto dois')
    store.commitSearch('PROJETO UM')

    expect(store.history).toEqual(['PROJETO UM', 'projeto dois'])
  })

  it('does not re-save when the term matches the most recent entry', () => {
    const store = useSearchStore()
    store.commitSearch('projeto')
    store.commitSearch('PROJETO')

    expect(store.history).toEqual(['projeto'])
  })

  it('caps history at 5 entries', () => {
    const store = useSearchStore()
    for (const term of ['um', 'dois', 'tres', 'quatro', 'cinco', 'seis']) {
      store.commitSearch(term)
    }
    expect(store.history).toHaveLength(5)
    expect(store.history).toEqual(['seis', 'cinco', 'quatro', 'tres', 'dois'])
  })
})

describe('useSearchStore — clearQuery', () => {
  it('commits the active query to history before clearing it', () => {
    const store = useSearchStore()
    store.setQuery('testeee')
    store.clearQuery()

    expect(store.query).toBe('')
    expect(store.history).toEqual(['testeee'])
  })

  it('does not add an entry when there is no active query', () => {
    const store = useSearchStore()
    store.clearQuery()
    expect(store.history).toEqual([])
  })

  it('does not re-save when the active query already is the most recent history entry', () => {
    const store = useSearchStore()
    store.commitSearch('projeto')
    store.setQuery('projeto')
    store.clearQuery()

    expect(store.history).toEqual(['projeto'])
  })
})

describe('useSearchStore — removeFromHistory', () => {
  it('removes a single entry from history', () => {
    const store = useSearchStore()
    store.commitSearch('um')
    store.commitSearch('dois')
    store.removeFromHistory('um')

    expect(store.history).toEqual(['dois'])
  })
})
