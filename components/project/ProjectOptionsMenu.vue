<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'

const emit = defineEmits<{
  edit: []
  delete: []
}>()

interface MenuItem {
  key: string
  label: string
  icon: 'edit' | 'trash'
  action: () => void
}

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<{ focus: () => void } | null>(null)
const isOpen = ref(false)
const activeIndex = ref(0)
const baseId = useId()
const menuId = `${baseId}-menu`

const items: MenuItem[] = [
  { key: 'edit', label: 'Editar', icon: 'edit', action: () => emit('edit') },
  { key: 'delete', label: 'Remover', icon: 'trash', action: () => emit('delete') },
]

function open() {
  activeIndex.value = 0
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggleOpen() {
  if (isOpen.value) close()
  else open()
}

function activate(index: number) {
  items[index]?.action()
  close()
  nextTick(() => triggerRef.value?.focus())
}

const { onKeydown } = useListboxKeyboard({
  itemCount: () => items.length,
  isOpen: () => isOpen.value,
  open,
  close,
  activeIndex,
  onSelect: activate,
})

useClickOutside(rootRef, () => {
  if (isOpen.value) close()
})

function itemId(index: number) {
  return `${baseId}-item-${index}`
}
</script>

<template>
  <div ref="rootRef" class="project-options-menu">
    <BaseButton
      ref="triggerRef"
      icon-only
      label="Mais opções do projeto"
      variant="surface"
      size="sm"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      :aria-controls="menuId"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      <AppIcon name="menu-dots" size="sm" />
    </BaseButton>

    <ul v-show="isOpen" :id="menuId" role="menu" class="project-options-menu__list">
      <li
        v-for="(item, index) in items"
        :id="itemId(index)"
        :key="item.key"
        role="menuitem"
        class="project-options-menu__item"
        :class="{ 'project-options-menu__item--active': index === activeIndex }"
        @click="activate(index)"
        @mouseenter="activeIndex = index"
      >
        <AppIcon :name="item.icon" size="md" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.project-options-menu {
  position: relative;
}

.project-options-menu__list {
  position: absolute;
  z-index: var(--z-dropdown);
  top: calc(100% + var(--space-2));
  right: 0;
  margin: 0;
  padding: var(--space-2) 0;
  min-width: 160px;
  list-style: none;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dropdown);

  &::before {
    content: '';
    position: absolute;
    top: calc(-1 * var(--space-2));
    right: calc(var(--size-icon-button-sm) / 2 - 6px);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: var(--space-2) solid var(--color-white);
  }
}

.project-options-menu__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-accent);
  cursor: pointer;
  white-space: nowrap;
}

.project-options-menu__item--active {
  background-color: color-mix(in srgb, var(--color-accent) 10%, white);
}
</style>
