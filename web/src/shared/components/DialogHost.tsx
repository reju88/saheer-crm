import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, HelpCircle, X } from 'lucide-react'
import { useUiStore, type ConfirmDialog, type PromptDialog } from '@/stores/ui-store'
import { cn } from '@/shared/utils/cn'

export function DialogHost() {
  const dialog = useUiStore((s) => s.dialog)
  if (!dialog) return null
  return dialog.kind === 'confirm' ? <ConfirmView dialog={dialog} /> : <PromptView dialog={dialog} />
}

function ConfirmView({ dialog }: { dialog: ConfirmDialog }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const tone = dialog.tone ?? 'brand'

  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dialog.resolve(false)
      if (e.key === 'Enter') dialog.resolve(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog])

  const confirmClass =
    tone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
      : tone === 'neutral'
        ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-800/20'
        : 'bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] shadow-pink-500/25'

  return (
    <Shell onDismiss={() => dialog.resolve(false)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-lg',
            tone === 'danger'
              ? 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-500/30'
              : 'bg-gradient-to-br from-cyan-500 to-teal-600 shadow-cyan-500/30',
          )}
        >
          <AlertTriangle className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">{dialog.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{dialog.body}</p>
        </div>
        <button
          type="button"
          onClick={() => dialog.resolve(false)}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-6 flex gap-2.5">
        <button
          ref={cancelRef}
          type="button"
          onClick={() => dialog.resolve(false)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {dialog.cancelLabel ?? 'Cancel'}
        </button>
        <button
          type="button"
          onClick={() => dialog.resolve(true)}
          className={cn(
            'flex-[1.2] rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition',
            confirmClass,
          )}
        >
          {dialog.confirmLabel ?? 'Confirm'}
        </button>
      </div>
    </Shell>
  )
}

function PromptView({ dialog }: { dialog: PromptDialog }) {
  const [value, setValue] = useState(dialog.defaultValue ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dialog.resolve(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog])

  return (
    <Shell onDismiss={() => dialog.resolve(null)}>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30">
          <HelpCircle className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">{dialog.title}</h2>
          {dialog.body ? <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{dialog.body}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => dialog.resolve(null)}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault()
          const trimmed = value.trim()
          dialog.resolve(trimmed ? trimmed : null)
        }}
      >
        <input
          ref={inputRef}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={() => dialog.resolve(null)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {dialog.cancelLabel ?? 'Cancel'}
          </button>
          <button
            type="submit"
            className="flex-[1.2] rounded-xl bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:bg-[var(--color-brand-hover)]"
          >
            {dialog.confirmLabel ?? 'Save'}
          </button>
        </div>
      </form>
    </Shell>
  )
}

function Shell({ children, onDismiss }: { children: ReactNode; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" aria-label="Dismiss dialog" className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onDismiss} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_24px_60px_-20px_rgba(10,22,40,0.45)]"
      >
        {children}
      </div>
    </div>
  )
}
