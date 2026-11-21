import { useEffect, type FormEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-cyan-500/10'

export function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block space-y-1.5 ${className ?? ''}`}>
      <span className="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

type Props = {
  open: boolean
  title: string
  subtitle: string
  submitLabel: string
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
}

export function FormDrawer({ open, title, subtitle, submitLabel, onClose, onSubmit, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer overlay"
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-xl flex-col overflow-hidden bg-[#f7f9fc] shadow-[-24px_0_60px_-28px_rgba(10,22,40,0.55)] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative border-b border-slate-200/80 bg-white px-6 py-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-cyan-400" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:grid-cols-2">
              {children}
            </div>
          </div>
          <div className="flex shrink-0 gap-3 border-t border-slate-200/80 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.4] rounded-xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(233,30,140,0.75)] hover:bg-[var(--color-brand-hover)]"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}
