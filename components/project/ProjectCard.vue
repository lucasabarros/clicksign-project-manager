<script setup lang="ts">
import { computed } from 'vue'
import { formatDatePtBr } from '~/utils/date'
import { useProjectsStore } from '~/stores/projects'
import { useSearchStore } from '~/stores/search'
import type { Project } from '~/types/project'

const props = defineProps<{
  project: Project
  eager?: boolean
}>()

const emit = defineEmits<{
  'request-delete': [id: string]
}>()

const projectsStore = useProjectsStore()
const searchStore = useSearchStore()

const startDateLabel = computed(() => formatDatePtBr(props.project.startDate))
const endDateLabel = computed(() => formatDatePtBr(props.project.endDate))

function onToggleFavorite() {
  projectsStore.toggleFavorite(props.project.id)
}

function onEdit() {
  navigateTo(`/projects/${props.project.id}/edit`)
}

function onDelete() {
  emit('request-delete', props.project.id)
}
</script>

<template>
  <article class="project-card">
    <div class="project-card__cover">
      <img
        v-if="project.coverImage"
        :src="project.coverImage"
        alt=""
        class="project-card__cover-image"
        :loading="eager ? 'eager' : 'lazy'"
        width="346"
        height="231"
      >
      <div v-else class="project-card__cover-placeholder">
        <AppIcon name="image-placeholder" :size="56" />
      </div>

      <div class="project-card__actions">
        <BaseButton
          icon-only
          :label="project.isFavorite ? 'Desfavoritar projeto' : 'Favoritar projeto'"
          variant="plain"
          size="sm"
          :pressed="project.isFavorite"
          class="project-card__favorite"
          @click="onToggleFavorite"
        >
          <AppIcon :name="project.isFavorite ? 'star-filled' : 'star'" :size="20" />
        </BaseButton>
        <ProjectOptionsMenu @edit="onEdit" @delete="onDelete" />
      </div>
    </div>

    <div class="project-card__body">
      <div class="project-card__info">
        <h3 class="project-card__name">
          <HighlightText :text="project.name" :query="searchStore.query" />
        </h3>

        <p class="project-card__client">
          <strong>Cliente:</strong> {{ project.client }}
        </p>
      </div>

      <hr class="project-card__divider">

      <div class="project-card__dates">
        <p class="project-card__date">
          <AppIcon name="calendar-day" size="lg" />
          <span>{{ startDateLabel }}</span>
        </p>
        <p class="project-card__date">
          <AppIcon name="calendar-check" size="lg" />
          <span>{{ endDateLabel }}</span>
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.project-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-white);
  border: var(--border-width) solid var(--color-border);
}

.project-card__cover {
  position: relative;
  aspect-ratio: 346 / 231;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
}

.project-card__cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-card__cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  opacity: 0.85;
}

.project-card__actions {
  position: absolute;
  bottom: var(--space-4);
  right: var(--space-4);
  display: flex;
  gap: var(--space-4);
}

.project-card__favorite {
  color: var(--color-white);
}

.project-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-6);
}

.project-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.project-card__dates {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.project-card__name {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.project-card__client {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.project-card__divider {
  border: none;
  border-top: var(--border-width) solid var(--color-border);
  margin: var(--space-1) 0;
}

.project-card__date {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}
</style>
