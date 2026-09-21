import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createLocalStorageSearchHistoryRepository,
  MAX_SEARCH_HISTORY_ITEMS,
} from '~/repositories/search-history.repository'
import { useToastStore } from './toast'

export const MIN_SEARCH_QUERY_LENGTH = 3

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const history = ref<string[]>([])

  const repository = createLocalStorageSearchHistoryRepository()
  let hydrated = false

  function hydrate() {
    if (hydrated) return
    hydrated = true

    const result = repository.load()
    history.value = result.entries

    if (result.error) {
      const toast = useToastStore()
      toast.error(
        result.error === 'unavailable'
          ? 'Não foi possível carregar seu histórico de buscas salvo.'
          : 'O histórico de buscas salvo estava corrompido e foi reiniciado.',
        `search-history-load-${result.error}`,
      )
    }
  }

  function persistHistory() {
    const result = repository.save(history.value)
    if (!result.success) {
      const toast = useToastStore()
      toast.error(
        result.quotaExceeded
          ? 'Não foi possível salvar seu histórico de buscas: armazenamento local cheio.'
          : 'Não foi possível salvar seu histórico de buscas.',
        'search-history-save-error',
      )
    }
  }

  function addToHistory(term: string) {
    const normalized = term.toLocaleLowerCase('pt-BR')
    if (history.value[0]?.toLocaleLowerCase('pt-BR') === normalized) return

    const withoutDuplicate = history.value.filter(
      (entry) => entry.toLocaleLowerCase('pt-BR') !== normalized,
    )
    history.value = [term, ...withoutDuplicate].slice(0, MAX_SEARCH_HISTORY_ITEMS)
    persistHistory()
  }

  function setQuery(rawValue: string) {
    const trimmed = rawValue.trim()
    query.value = trimmed.length < MIN_SEARCH_QUERY_LENGTH ? '' : trimmed
  }

  function commitSearch(rawValue: string) {
    const trimmed = rawValue.trim()
    if (trimmed.length < MIN_SEARCH_QUERY_LENGTH) return
    addToHistory(trimmed)
  }

  function clearQuery() {
    if (query.value) {
      addToHistory(query.value)
    }
    query.value = ''
  }

  function applyHistoryEntry(term: string) {
    query.value = term
    addToHistory(term)
  }

  function removeFromHistory(term: string) {
    history.value = history.value.filter((entry) => entry !== term)
    persistHistory()
  }

  return {
    query,
    history,
    hydrate,
    setQuery,
    commitSearch,
    clearQuery,
    applyHistoryEntry,
    removeFromHistory,
  }
})
