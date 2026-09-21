<script setup lang="ts">
import { computed } from 'vue'
import LogoMark from '~/assets/icons/logo-mark.svg?component'

const route = useRoute()

const showSearch = computed(() => !route.path.startsWith('/projects/'))
</script>

<template>
  <header class="app-topbar">
    <NuxtLink to="/" class="app-topbar__brand">
      <LogoMark class="app-topbar__mark" />
      <span class="app-topbar__title">
        <span>Gerenciador</span>
        <span>de Projetos</span>
      </span>
    </NuxtLink>

    <SearchBar v-if="showSearch" />
  </header>
</template>

<style scoped lang="scss">
.app-topbar {
  position: relative;
  z-index: var(--z-dropdown);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  height: var(--size-topbar-height);
  padding: 0 var(--page-padding-inline);
  background-color: var(--color-topbar);
  box-shadow: var(--shadow-topbar);
}

.app-topbar__brand {
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}

.app-topbar :deep(.search-bar) {
  grid-column: 3;
  justify-self: end;
}

.app-topbar__mark {
  flex-shrink: 0;
  width: auto;
  height: calc(var(--size-topbar-height) - var(--space-1) * 2);
}

.app-topbar__title {
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-logo);
  font-size: var(--font-size-lg);
  line-height: 1.2;
  color: var(--color-white);
}
</style>
