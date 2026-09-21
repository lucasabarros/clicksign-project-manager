<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits<{
  back: []
}>()
</script>

<template>
  <nav class="app-breadcrumb" aria-label="Navegação">
    <button type="button" class="app-breadcrumb__back" @click="$emit('back')">
      <AppIcon name="arrow-left" size="sm" />
      <span>Voltar</span>
    </button>
    <h1 class="app-breadcrumb__title">{{ title }}</h1>
  </nav>
</template>

<style scoped lang="scss">
.app-breadcrumb {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}

.app-breadcrumb__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  border: none;
  background: none;
  padding: 0;
  color: var(--color-accent);
  font-family: inherit;
  font-size: var(--font-size-base);
  text-decoration: none;
  cursor: pointer;
}

.app-breadcrumb__back:hover {
  text-decoration: underline;
}

.app-breadcrumb__title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}
</style>
