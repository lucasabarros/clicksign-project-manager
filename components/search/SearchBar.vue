<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useSearchStore } from '~/stores/search'

const searchStore = useSearchStore()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const inputValue = ref('')

const { update: scheduleCommit, cancel: cancelScheduledCommit } = useDebouncedSearch((value) => {
  searchStore.setQuery(value)
})

function openSearch() {
  isOpen.value = true
  inputValue.value = searchStore.query
  nextTick(() => inputRef.value?.focus())
}

function closeSearch() {
  searchStore.commitSearch(inputValue.value)
  isOpen.value = false
}

function clearSearch() {
  cancelScheduledCommit()
  inputValue.value = ''
  searchStore.clearQuery()
  nextTick(() => inputRef.value?.focus())
}

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  inputValue.value = value

  if (value.trim().length === 0) {
    cancelScheduledCommit()
    searchStore.clearQuery()
    return
  }

  scheduleCommit(value)
}

function onSelectHistory(term: string) {
  cancelScheduledCommit()
  inputValue.value = term
  searchStore.applyHistoryEntry(term)
}

function onRemoveHistory(term: string) {
  searchStore.removeFromHistory(term)
}

watch(
  () => searchStore.query,
  (query) => {
    if (!query) inputValue.value = ''
  },
)

useClickOutside(rootRef, () => {
  if (isOpen.value) closeSearch()
})
</script>

<template>
  <div ref="rootRef" class="search-bar">
    <BaseButton
      v-if="!isOpen"
      icon-only
      label="Buscar projetos"
      variant="plain"
      size="sm"
      class="search-bar__trigger"
      @click="openSearch"
    >
      <AppIcon name="search" size="sm" />
    </BaseButton>

    <div v-else class="search-bar__overlay">
      <div class="search-bar__field">
        <AppIcon name="search" size="md" class="search-bar__field-icon" />
        <input
          ref="inputRef"
          :value="inputValue"
          type="search"
          class="search-bar__input"
          placeholder="Digite o nome do projeto..."
          aria-label="Buscar projetos pelo nome"
          @input="onInput"
          @keydown.escape="closeSearch"
        >
        <BaseButton
          v-if="inputValue"
          icon-only
          label="Limpar busca"
          variant="plain"
          size="sm"
          class="search-bar__clear"
          @click="clearSearch"
        >
          <AppIcon name="close" size="sm" />
        </BaseButton>
      </div>

      <SearchHistoryList
        v-if="!inputValue && searchStore.history.length > 0"
        :history="searchStore.history"
        @select="onSelectHistory"
        @remove="onRemoveHistory"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  position: relative;
}

.search-bar__trigger {
  color: var(--color-white);
}

.search-bar__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-dropdown);
}

.search-bar__field {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--size-topbar-height);
  padding: 0 var(--space-6);
}

.search-bar__field-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.search-bar__clear {
  color: var(--color-text-secondary);
}

.search-bar__input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: var(--color-topbar);
  background: transparent;

  &::placeholder {
    color: var(--color-placeholder);
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
}
</style>
