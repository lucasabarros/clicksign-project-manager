import { useProjectsStore } from '~/stores/projects'
import { useSearchStore } from '~/stores/search'

export default defineNuxtPlugin(() => {
  useSearchStore().hydrate()
  useProjectsStore().hydrate()
})
