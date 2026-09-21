<script setup lang="ts">
defineProps<{
  history: string[]
}>()

defineEmits<{
  select: [term: string]
  remove: [term: string]
}>()
</script>

<template>
  <ul class="search-history-list">
    <li v-for="term in history" :key="term" class="search-history-list__item">
      <button type="button" class="search-history-list__select" @click="$emit('select', term)">
        <AppIcon name="history" size="md" />
        <span>{{ term }}</span>
      </button>
      <BaseButton
        icon-only
        :label="`Remover '${term}' do histórico de buscas`"
        variant="plain"
        size="sm"
        class="search-history-list__remove"
        @click="$emit('remove', term)"
      >
        <AppIcon name="close" size="sm" />
      </BaseButton>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.search-history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: var(--border-width) solid var(--color-border);
}

.search-history-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  border-bottom: var(--border-width) solid var(--color-border);
}

.search-history-list__select {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex: 1;
  min-height: var(--size-touch-target);
  padding: var(--space-4) 0;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  text-align: left;
  cursor: pointer;
}

.search-history-list__select:hover {
  color: var(--color-accent);
}

.search-history-list__remove {
  color: var(--color-text-secondary);
}
</style>
