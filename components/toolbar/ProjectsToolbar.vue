<script setup lang="ts">
import { useProjectsStore } from '~/stores/projects'

const projectsStore = useProjectsStore()
</script>

<template>
  <div v-if="projectsStore.totalCount > 0" class="projects-toolbar">
    <div class="projects-toolbar__title-group">
      <h1 class="projects-toolbar__title">Projetos</h1>
      <span class="projects-toolbar__count">({{ projectsStore.totalCount }})</span>
    </div>

    <div class="projects-toolbar__controls">
      <FavoriteToggle v-model="projectsStore.favoritesOnly" />
      <SortSelect v-model="projectsStore.sortOption" />
      <BaseButton @click="navigateTo('/projects/new')">
        <template #icon>
          <AppIcon name="plus-circle" size="lg" />
        </template>
        Novo projeto
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.projects-toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.projects-toolbar__title-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.projects-toolbar__title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.projects-toolbar__count {
  font-size: var(--font-size-md);
  color: var(--color-accent);
}

.projects-toolbar__controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.projects-toolbar__controls :deep(.base-button) {
  width: 100%;
}

@include breakpoint(md) {
  .projects-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .projects-toolbar__controls {
    flex-direction: row;
    align-items: center;
  }

  .projects-toolbar__controls :deep(.base-button) {
    width: auto;
  }
}
</style>
