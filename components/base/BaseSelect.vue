<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
  options: SelectOption[]
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(0)
const baseId = useId()
const listboxId = `${baseId}-listbox`

const selectedIndex = computed(() => {
  const index = props.options.findIndex((option) => option.value === props.modelValue)
  return index === -1 ? 0 : index
})

const selectedLabel = computed(
  () => props.options.find((option) => option.value === props.modelValue)?.label ?? '',
)

function optionId(index: number) {
  return `${baseId}-option-${index}`
}

const activeOptionId = computed(() => (isOpen.value ? optionId(activeIndex.value) : undefined))

function open() {
  if (isOpen.value) return
  activeIndex.value = selectedIndex.value
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggleOpen() {
  if (isOpen.value) close()
  else open()
}

function selectOption(index: number) {
  const option = props.options[index]
  if (option) {
    emit('update:modelValue', option.value)
  }
  close()
  nextTick(() => triggerRef.value?.focus())
}

const { onKeydown } = useListboxKeyboard({
  itemCount: () => props.options.length,
  isOpen: () => isOpen.value,
  open,
  close,
  activeIndex,
  onSelect: selectOption,
})

useClickOutside(rootRef, () => {
  if (isOpen.value) close()
})
</script>

<template>
  <div ref="rootRef" class="base-select">
    <button
      ref="triggerRef"
      type="button"
      class="base-select__trigger"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId"
      :aria-label="label"
      @click="toggleOpen"
      @keydown="onKeydown"
    >
      <span class="base-select__value">{{ selectedLabel }}</span>
      <AppIcon name="chevron-down" size="sm" class="base-select__chevron" />
    </button>

    <ul
      v-show="isOpen"
      :id="listboxId"
      class="base-select__listbox"
      role="listbox"
      :aria-label="label"
    >
      <li
        v-for="(option, index) in options"
        :id="optionId(index)"
        :key="option.value"
        role="option"
        :aria-selected="option.value === modelValue"
        class="base-select__option"
        :class="{
          'base-select__option--active': index === activeIndex,
          'base-select__option--selected': option.value === modelValue,
        }"
        @click="selectOption(index)"
        @mouseenter="activeIndex = index"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-select {
  position: relative;
}

.base-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  min-width: 200px;
  height: var(--size-input-height);
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--color-text-secondary);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  color: var(--color-topbar);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  cursor: pointer;

  @include focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }
}

.base-select__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-select__listbox {
  position: absolute;
  z-index: var(--z-dropdown);
  top: calc(100% + var(--space-2));
  right: 0;
  min-width: 100%;
  margin: 0;
  padding: var(--space-2) 0;
  list-style: none;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dropdown);
}

.base-select__option {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-topbar);
  cursor: pointer;
  white-space: nowrap;
}

.base-select__option--active {
  background-color: color-mix(in srgb, var(--color-accent) 12%, white);
}

.base-select__option--selected {
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
}
</style>
