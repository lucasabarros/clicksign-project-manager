<script setup lang="ts">
import type { Project } from '~/types/project'

defineProps<{
  projects: Project[]
}>()

defineEmits<{
  'request-delete': [id: string]
}>()

const EAGER_COUNT = 5
</script>

<template>
  <div class="project-grid">
    <ProjectCard
      v-for="(project, index) in projects"
      :key="project.id"
      :project="project"
      :eager="index < EAGER_COUNT"
      @request-delete="$emit('request-delete', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.project-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@include breakpoint(sm) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include breakpoint(lg) {
  .project-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>
