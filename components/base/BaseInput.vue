<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { IconName } from '~/components/icons/AppIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    id?: string
    required?: boolean
    hint?: string
    error?: string
    placeholder?: string
    type?: string
    icon?: IconName
    min?: string
    max?: string
    disabled?: boolean
  }>(),
  {
    id: undefined,
    required: false,
    hint: undefined,
    error: undefined,
    placeholder: undefined,
    type: 'text',
    icon: undefined,
    min: undefined,
    max: undefined,
    disabled: false,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() => `${inputId.value}-description`)
const hasDescription = computed(() => Boolean(props.error || props.hint))

const inputRef = ref<HTMLInputElement | null>(null)

function openPickerOnClick() {
  if (props.type !== 'date') return

  try {
    inputRef.value?.showPicker()
  } catch (error) {
    void error
  }
}

defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>

<template>
  <div class="base-input">
    <div class="base-input__label-row">
      <label :for="inputId" class="base-input__label" :class="{ 'base-input__label--error': error }">
        {{ label }}
      </label>
      <span v-if="required" class="base-input__hint-tag" :class="{ 'base-input__hint-tag--error': error }">
        (Obrigatório)
      </span>
    </div>

    <div class="base-input__control">
      <input
        :id="inputId"
        ref="inputRef"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :disabled="disabled"
        :aria-invalid="Boolean(error) || undefined"
        :aria-describedby="hasDescription ? descriptionId : undefined"
        class="base-input__field"
        :class="{ 'base-input__field--error': error, 'base-input__field--with-icon': icon }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @click="openPickerOnClick"
      >
      <AppIcon v-if="icon" :name="icon" size="lg" class="base-input__icon" />
    </div>

    <p v-if="error" :id="descriptionId" class="base-input__message base-input__message--error">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="descriptionId" class="base-input__message">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-input {
  display: flex;
  flex-direction: column;
}

.base-input__label-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.base-input__label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-accent);
}

.base-input__label--error {
  color: var(--color-error-strong);
}

.base-input__hint-tag {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.base-input__hint-tag--error {
  color: var(--color-error);
}

.base-input__control {
  position: relative;
}

.base-input__field {
  width: 100%;
  height: var(--size-input-height);
  padding: 0 var(--space-3);
  border: var(--border-width) solid var(--color-text-secondary);
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  color: var(--color-topbar);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);

  @include focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }

  &:disabled {
    background-color: color-mix(in srgb, var(--color-border) 30%, white);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--color-placeholder);
  }
}

.base-input__field--error {
  border-color: var(--color-error);
}

.base-input__field[type='date'] {
  cursor: pointer;
}

.base-input__field--with-icon {
  padding-right: calc(var(--space-3) * 2 + 20px);

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
}

.base-input__icon {
  position: absolute;
  top: 50%;
  right: var(--space-3);
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.base-input__message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-2) 0 0;
}

.base-input__message--error {
  color: var(--color-error);
}
</style>
