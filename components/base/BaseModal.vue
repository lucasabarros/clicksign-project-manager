<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const titleId = useId()
let previouslyFocusedElement: HTMLElement | null = null

function openDialog() {
  previouslyFocusedElement = document.activeElement as HTMLElement | null
  dialogRef.value?.showModal()
  document.body.style.overflow = 'hidden'
}

function handleClose() {
  document.body.style.overflow = ''
  emit('update:modelValue', false)
  previouslyFocusedElement?.focus()
  previouslyFocusedElement = null
}

function onDialogClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    dialogRef.value?.close()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      openDialog()
    } else {
      dialogRef.value?.close()
    }
  },
)

onMounted(() => {
  if (props.modelValue) openDialog()
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <dialog ref="dialogRef" class="base-modal" :aria-labelledby="titleId" @close="handleClose" @click="onDialogClick">
    <div class="base-modal__overlay">
      <slot name="overlay" />
    </div>
    <div class="base-modal__surface">
      <div class="base-modal__content">
        <slot :title-id="titleId" />
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-modal {
  padding: 0;
  border: none;
  background: transparent;
  width: min(90vw, 582px);
  max-width: 100%;

  &::backdrop {
    background-color: rgba(24, 24, 24, 0.9);
  }
}

.base-modal__overlay {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.base-modal__surface {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-modal);
}

.base-modal__content {
  padding: var(--space-8) var(--space-6);
}

@include breakpoint(sm) {
  .base-modal__content {
    padding: var(--space-8);
  }
}
</style>
