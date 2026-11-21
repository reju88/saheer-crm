import { create } from 'zustand'

export type Toast = {
  id: string
  title: string
  body?: string
}

export type ConfirmDialog = {
  kind: 'confirm'
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'brand' | 'neutral'
  resolve: (ok: boolean) => void
}

export type PromptDialog = {
  kind: 'prompt'
  title: string
  body?: string
  defaultValue?: string
  confirmLabel?: string
  cancelLabel?: string
  resolve: (value: string | null) => void
}

export type AppDialog = ConfirmDialog | PromptDialog

type UiState = {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  toasts: Toast[]
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  notificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void
  dialog: AppDialog | null
  openDialog: (dialog: AppDialog) => void
  closeDialog: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toasts: [],
  pushToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3200)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  notificationsOpen: false,
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  dialog: null,
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
}))

export function askConfirm(opts: Omit<ConfirmDialog, 'kind' | 'resolve'>): Promise<boolean> {
  return new Promise((resolve) => {
    useUiStore.getState().openDialog({
      kind: 'confirm',
      ...opts,
      resolve: (ok) => {
        useUiStore.getState().closeDialog()
        resolve(ok)
      },
    })
  })
}

export function askPrompt(opts: Omit<PromptDialog, 'kind' | 'resolve'>): Promise<string | null> {
  return new Promise((resolve) => {
    useUiStore.getState().openDialog({
      kind: 'prompt',
      ...opts,
      resolve: (value) => {
        useUiStore.getState().closeDialog()
        resolve(value)
      },
    })
  })
}
