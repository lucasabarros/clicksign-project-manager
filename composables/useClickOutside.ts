import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useClickOutside(target: Ref<HTMLElement | null>, onOutsideClick: () => void) {
  function handlePointerDown(event: PointerEvent) {
    const element = target.value
    if (!element) return
    if (event.target instanceof Node && !element.contains(event.target)) {
      onOutsideClick()
    }
  }

  onMounted(() => {
    document.addEventListener('pointerdown', handlePointerDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handlePointerDown)
  })
}
