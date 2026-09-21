import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  key: string
  message: string
  variant: ToastVariant
}

export interface ShowToastOptions {
  key: string
  message: string
  variant?: ToastVariant
  duration?: number
}

const DEFAULT_DURATION_MS = 5000
const MAX_VISIBLE_TOASTS = 3

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function clearTimer(id: string) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }

  function scheduleDismiss(id: string, duration: number) {
    clearTimer(id)
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    )
  }

  function show(options: ShowToastOptions): string {
    const duration = options.duration ?? DEFAULT_DURATION_MS
    const existing = toasts.value.find((toast) => toast.key === options.key)

    if (existing) {
      scheduleDismiss(existing.id, duration)
      return existing.id
    }

    const id = crypto.randomUUID()
    const toast: Toast = {
      id,
      key: options.key,
      message: options.message,
      variant: options.variant ?? 'info',
    }

    const nextToasts = [...toasts.value, toast]
    if (nextToasts.length > MAX_VISIBLE_TOASTS) {
      const overflow = nextToasts.splice(0, nextToasts.length - MAX_VISIBLE_TOASTS)
      overflow.forEach((overflowToast) => clearTimer(overflowToast.id))
    }

    toasts.value = nextToasts
    scheduleDismiss(id, duration)
    return id
  }

  function dismiss(id: string) {
    clearTimer(id)
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function success(message: string, key: string = message): string {
    return show({ key, message, variant: 'success' })
  }

  function error(message: string, key: string = message): string {
    return show({ key, message, variant: 'error' })
  }

  return { toasts, show, dismiss, success, error }
})
