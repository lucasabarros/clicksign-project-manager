<script setup lang="ts">
import { SORT_OPTIONS, type SortOption } from '~/types/project'

defineProps<{
  modelValue: SortOption
}>()

defineEmits<{
  'update:modelValue': [value: SortOption]
}>()
</script>

<template>
  <BaseSelect
    :model-value="modelValue"
    :options="[...SORT_OPTIONS]"
    label="Ordenar projetos"
    @update:model-value="$emit('update:modelValue', $event as SortOption)"
  />
</template>
