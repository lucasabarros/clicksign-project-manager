<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'primary-light' | 'secondary' | 'plain' | 'surface'
    size?: 'md' | 'sm'
    type?: 'button' | 'submit'
    iconOnly?: boolean
    label?: string
    pressed?: boolean
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    iconOnly: false,
    label: undefined,
    pressed: undefined,
    loading: false,
    disabled: false,
    block: false,
  },
)

const buttonRef = ref<HTMLButtonElement | null>(null)

defineExpose({
  focus: () => buttonRef.value?.focus(),
})
</script>

<template>
  <button
    ref="buttonRef"
    :type="type"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      {
        'base-button--icon-only': iconOnly,
        'base-button--block': block,
      },
    ]"
    :aria-label="iconOnly ? label : undefined"
    :aria-pressed="iconOnly ? pressed : undefined"
    :aria-busy="loading || undefined"
    :disabled="disabled || loading"
  >
    <slot v-if="iconOnly" />
    <template v-else>
      <BaseSpinner v-if="loading" :size="16" class="base-button__spinner" />
      <span v-else-if="$slots.icon" class="base-button__icon">
        <slot name="icon" />
      </span>
      <span class="base-button__label"><slot /></span>
    </template>
  </button>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-pill);
  border: var(--border-width) solid transparent;
  font-family: var(--font-family-base);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast);

  @include focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.base-button--md {
  height: var(--size-button-height);
  min-height: var(--size-touch-target);
  padding: 0 var(--space-6);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.base-button--sm {
  height: var(--size-input-height);
  padding: 0 var(--space-4);
  font-size: var(--font-size-base);
}

.base-button--icon-only {
  padding: 0;

  &.base-button--md {
    width: var(--size-touch-target);
    height: var(--size-touch-target);
    min-height: 0;
  }

  &.base-button--sm {
    width: var(--size-icon-button-sm);
    height: var(--size-icon-button-sm);
  }
}

:where(.base-button--icon-only) {
  color: inherit;
}

.base-button--primary {
  background-color: var(--color-accent);
  color: var(--color-white);

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent) 85%, black);
  }

  &:active:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent) 75%, black);
  }
}

.base-button--primary-light {
  background-color: var(--color-accent-light);
  color: var(--color-white);

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent-light) 85%, black);
  }

  &:active:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent-light) 75%, black);
  }
}

.base-button--secondary {
  background-color: var(--color-white);
  border-color: var(--color-accent);
  color: var(--color-accent);

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent) 8%, white);
  }

  &:active:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent) 16%, white);
  }
}

.base-button--plain {
  background: transparent;

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent) 12%, transparent);
  }
}

.base-button--surface {
  background-color: var(--color-white);
  box-shadow: var(--shadow-dropdown);

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-accent) 10%, white);
  }
}

.base-button--block {
  width: 100%;
}

.base-button__icon,
.base-button__spinner {
  display: inline-flex;
}
</style>
