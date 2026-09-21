<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant: 'empty' | 'search' | 'favorites'
}>()

const content = computed(() => {
  switch (props.variant) {
    case 'search':
      return {
        title: 'Nenhum projeto encontrado',
        description: 'Tente buscar por outro termo.',
        showCta: false,
      }
    case 'favorites':
      return {
        title: 'Nenhum projeto favorito',
        description: 'Você ainda não favoritou nenhum projeto.',
        showCta: false,
      }
    default:
      return {
        title: 'Nenhum projeto',
        description: 'Clique no botão abaixo para criar o primeiro e gerenciá-lo.',
        showCta: true,
      }
  }
})
</script>

<template>
  <div class="project-empty-state" :class="`project-empty-state--${variant}`">
    <p class="project-empty-state__title">{{ content.title }}</p>
    <p class="project-empty-state__description">{{ content.description }}</p>
    <BaseButton v-if="content.showCta" @click="navigateTo('/projects/new')">
      <template #icon>
        <AppIcon name="plus-circle" size="lg" />
      </template>
      Novo projeto
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.project-empty-state {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  padding: var(--space-6);
  text-align: center;

  &--empty {
    background-color: var(--color-white);
    border-radius: var(--radius-sm);
  }
}

.project-empty-state__title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.project-empty-state__description {
  margin: 0;
  max-width: 28rem;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}
</style>
