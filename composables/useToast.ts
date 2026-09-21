import { useToastStore } from '~/stores/toast'

export function useToast() {
  const store = useToastStore()

  return {
    toasts: store.toasts,
    show: store.show,
    dismiss: store.dismiss,
    success: store.success,
    error: store.error,
  }
}
