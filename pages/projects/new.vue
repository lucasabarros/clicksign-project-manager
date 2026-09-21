<script setup lang="ts">
import { useProjectsStore } from '~/stores/projects'
import type { ProjectFormInput } from '~/types/project'

const projectsStore = useProjectsStore()

function onSubmit(input: ProjectFormInput) {
  projectsStore.addProject(input)
  navigateTo('/')
}
</script>

<template>
  <main class="new-project-page">
    <AppBreadcrumb title="Novo projeto" @back="navigateTo('/')" />
    <ProjectForm submit-label="Salvar projeto" @submit="onSubmit" />
  </main>
</template>

<style scoped lang="scss">
.new-project-page {
  padding: var(--page-padding-block) var(--page-padding-inline);
}
</style>
