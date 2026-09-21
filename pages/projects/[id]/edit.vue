<script setup lang="ts">
import { computed } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import type { ProjectFormInput } from '~/types/project'

const route = useRoute()
const projectsStore = useProjectsStore()

const projectId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const project = computed(() => projectsStore.getById(projectId.value))

if (!project.value) {
  useToast().error('Projeto não encontrado.', 'project-not-found')
  navigateTo('/')
}

function onSubmit(input: ProjectFormInput) {
  if (!project.value) return
  projectsStore.updateProject(project.value.id, input)
  navigateTo('/')
}
</script>

<template>
  <main v-if="project" class="edit-project-page">
    <AppBreadcrumb title="Editar projeto" @back="navigateTo('/')" />
    <ProjectForm
      :initial-value="{
        name: project.name,
        client: project.client,
        startDate: project.startDate,
        endDate: project.endDate,
        coverImage: project.coverImage,
      }"
      submit-label="Salvar projeto"
      @submit="onSubmit"
    />
  </main>
</template>

<style scoped lang="scss">
.edit-project-page {
  padding: var(--page-padding-block) var(--page-padding-inline);
}
</style>
