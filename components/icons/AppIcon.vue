<script setup lang="ts">
import { computed, type Component } from 'vue'
import IconSearch from '~/assets/icons/search.svg?component'
import IconStar from '~/assets/icons/star.svg?component'
import IconStarFilled from '~/assets/icons/star-filled.svg?component'
import IconMenuDots from '~/assets/icons/menu-dots.svg?component'
import IconCalendarDay from '~/assets/icons/calendar-day.svg?component'
import IconCalendarCheck from '~/assets/icons/calendar-check.svg?component'
import IconChevronDown from '~/assets/icons/chevron-down.svg?component'
import IconPlusCircle from '~/assets/icons/plus-circle.svg?component'
import IconUpload from '~/assets/icons/upload.svg?component'
import IconArrowLeft from '~/assets/icons/arrow-left.svg?component'
import IconEdit from '~/assets/icons/edit.svg?component'
import IconTrash from '~/assets/icons/trash.svg?component'
import IconClose from '~/assets/icons/close.svg?component'
import IconHistory from '~/assets/icons/history.svg?component'
import IconImagePlaceholder from '~/assets/icons/image-placeholder.svg?component'

const icons = {
  search: IconSearch,
  star: IconStar,
  'star-filled': IconStarFilled,
  'menu-dots': IconMenuDots,
  'calendar-day': IconCalendarDay,
  'calendar-check': IconCalendarCheck,
  'chevron-down': IconChevronDown,
  'plus-circle': IconPlusCircle,
  upload: IconUpload,
  'arrow-left': IconArrowLeft,
  edit: IconEdit,
  trash: IconTrash,
  close: IconClose,
  history: IconHistory,
  'image-placeholder': IconImagePlaceholder,
} as const satisfies Record<string, Component>

export type IconName = keyof typeof icons

export type IconSize = 'sm' | 'md' | 'lg'

const ICON_SIZES: Record<IconSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
}

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: IconSize | number
  }>(),
  { size: 'md' },
)

const resolvedSize = computed(() => (typeof props.size === 'number' ? props.size : ICON_SIZES[props.size]))
</script>

<template>
  <component :is="icons[name]" :width="resolvedSize" :height="resolvedSize" class="app-icon" />
</template>

<style scoped>
.app-icon {
  display: block;
  flex-shrink: 0;
}
</style>
