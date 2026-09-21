<script setup lang="ts">
const props = defineProps<{
  text: string
  query: string
}>()

const segments = useHighlightMatch(
  () => props.text,
  () => props.query,
)
</script>

<template>
  <span>
    <template v-for="(segment, index) in segments" :key="index">
      <mark v-if="segment.matched" class="highlight-text__mark">{{ segment.text }}</mark>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>

<style scoped>
.highlight-text__mark {
  background-color: var(--color-secondary);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}
</style>
