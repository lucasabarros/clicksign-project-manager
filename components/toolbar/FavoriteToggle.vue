<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputId = useId()
</script>

<template>
  <div class="favorite-toggle">
    <input
      :id="inputId"
      type="checkbox"
      class="favorite-toggle__input"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <label :for="inputId" class="favorite-toggle__label">
      <span class="favorite-toggle__track" aria-hidden="true" />
      <span class="favorite-toggle__text">Apenas Favoritos</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.favorite-toggle {
  display: inline-flex;
  align-items: center;
}

.favorite-toggle__input {
  @include visually-hidden;
}

.favorite-toggle__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--color-topbar);
  min-height: var(--size-touch-target);
}

.favorite-toggle__track {
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  background-color: var(--color-text-secondary);
  transition: background-color var(--transition-fast);

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--color-white);
    transition: transform var(--transition-fast);
  }
}

.favorite-toggle__input:checked + .favorite-toggle__label .favorite-toggle__track {
  background-color: var(--color-secondary);

  &::after {
    transform: translateX(18px);
  }
}

.favorite-toggle__input:focus-visible + .favorite-toggle__label .favorite-toggle__track {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
