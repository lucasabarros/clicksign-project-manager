import type { Ref } from 'vue'

export interface UseListboxKeyboardOptions {
  itemCount: () => number
  isOpen: () => boolean
  open: () => void
  close: () => void
  activeIndex: Ref<number>
  onSelect: (index: number) => void
}

const OPEN_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Enter', ' '])

export function useListboxKeyboard(options: UseListboxKeyboardOptions) {
  function onKeydown(event: KeyboardEvent) {
    const count = options.itemCount()
    if (count === 0) return

    if (!options.isOpen()) {
      if (OPEN_KEYS.has(event.key)) {
        event.preventDefault()
        options.open()
        options.activeIndex.value = event.key === 'ArrowUp' ? count - 1 : 0
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        options.activeIndex.value = (options.activeIndex.value + 1) % count
        break
      case 'ArrowUp':
        event.preventDefault()
        options.activeIndex.value = (options.activeIndex.value - 1 + count) % count
        break
      case 'Home':
        event.preventDefault()
        options.activeIndex.value = 0
        break
      case 'End':
        event.preventDefault()
        options.activeIndex.value = count - 1
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        options.onSelect(options.activeIndex.value)
        break
      case 'Escape':
        event.preventDefault()
        options.close()
        break
      case 'Tab':
        options.close()
        break
    }
  }

  return { onKeydown }
}
