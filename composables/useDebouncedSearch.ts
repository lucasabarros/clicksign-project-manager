import { onScopeDispose } from 'vue'

const DEFAULT_DELAY_MS = 1000

export function useDebouncedSearch(onCommit: (value: string) => void, delayMs = DEFAULT_DELAY_MS) {
  let timer: ReturnType<typeof setTimeout> | null = null

  function cancel() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function update(value: string) {
    cancel()
    timer = setTimeout(() => {
      timer = null
      onCommit(value)
    }, delayMs)
  }

  onScopeDispose(cancel)

  return { update, cancel }
}
