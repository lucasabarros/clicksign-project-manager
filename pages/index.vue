<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import { useSearchStore } from '~/stores/search'

const projectsStore = useProjectsStore()
const searchStore = useSearchStore()

const deleteTargetId = ref<string | null>(null)
const isDeleteModalOpen = ref(false)

const deleteTargetName = computed(() => projectsStore.getById(deleteTargetId.value ?? '')?.name ?? '')

function onRequestDelete(id: string) {
  deleteTargetId.value = id
  isDeleteModalOpen.value = true
}

function onConfirmDelete() {
  if (deleteTargetId.value) {
    projectsStore.removeProject(deleteTargetId.value)
  }
  isDeleteModalOpen.value = false
  deleteTargetId.value = null
}

function clearSearch() {
  searchStore.clearQuery()
}
</script>

<template>
  <main class="projects-page">
    <AppBreadcrumb v-if="searchStore.query" title="Resultado da busca" @back="clearSearch" />
    <ProjectsToolbar v-else />

    <ProjectEmptyState
      v-if="projectsStore.emptyStateVariant !== 'none'"
      :variant="projectsStore.emptyStateVariant"
    />
    <ProjectGrid v-else :projects="projectsStore.visibleProjects" @request-delete="onRequestDelete" />

    <ConfirmDeleteModal v-model="isDeleteModalOpen" :project-name="deleteTargetName" @confirm="onConfirmDelete" />
  </main>
</template>

<style scoped lang="scss">
.projects-page {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--size-topbar-height));
  padding: var(--page-padding-block) var(--page-padding-inline);
}
</style>
