<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
  }>(),
  {
    size: 20,
  },
)
</script>

<template>
  <svg
    class="base-spinner"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    role="presentation"
    aria-hidden="true"
  >
    <circle class="base-spinner__track" cx="12" cy="12" r="10" stroke-width="3" />
    <path
      class="base-spinner__indicator"
      d="M22 12a10 10 0 0 0-10-10"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as *;

.base-spinner {
  animation: base-spinner-spin 0.8s linear infinite;
}

.base-spinner__track {
  stroke: currentColor;
  opacity: 0.25;
  fill: none;
}

.base-spinner__indicator {
  stroke: currentColor;
  fill: none;
}

@include reduced-motion {
  .base-spinner {
    animation-duration: 1.6s;
  }
}

@keyframes base-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
