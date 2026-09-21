<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="toast-container" role="region" aria-label="Notificações" aria-live="polite">
    <TransitionGroup name="toast-container__item" tag="div" class="toast-container__list">
      <BaseToast
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @dismiss="dismiss(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.toast-container {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  left: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
}

@include breakpoint(sm) {
  .toast-container {
    left: auto;
  }
}

.toast-container__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;

  @include breakpoint(sm) {
    width: auto;
  }
}

.toast-container__list > * {
  pointer-events: auto;
}

.toast-container__item-enter-active,
.toast-container__item-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.toast-container__item-enter-from,
.toast-container__item-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@include reduced-motion {
  .toast-container__item-enter-active,
  .toast-container__item-leave-active {
    transition: none;
  }
}
</style>
