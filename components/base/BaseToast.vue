<script setup lang="ts">
import type { Toast } from '~/stores/toast'

defineProps<{
  toast: Toast
}>()

defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <div class="base-toast" :class="`base-toast--${toast.variant}`">
    <p class="base-toast__message">{{ toast.message }}</p>
    <BaseButton
      icon-only
      label="Fechar notificação"
      variant="plain"
      size="sm"
      class="base-toast__close"
      @click="$emit('dismiss')"
    >
      <AppIcon name="close" size="sm" />
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
.base-toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  min-width: 260px;
  max-width: 360px;
  padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-modal);
  background-color: var(--color-topbar);
  color: var(--color-white);
  border-left: 4px solid var(--color-accent);
}

.base-toast--success {
  border-left-color: #2e9e5b;
}

.base-toast--error {
  border-left-color: var(--color-error);
}

.base-toast__message {
  flex: 1;
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.base-toast__close {
  color: var(--color-white);
  flex-shrink: 0;
}
</style>
