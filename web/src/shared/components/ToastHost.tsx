import { X } from 'lucide-react'
import { useUiStore } from '@/stores/ui-store'

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts)
  const dismissToast = useUiStore((s) => s.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/10"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{t.title}</p>
            {t.body ? <p className="mt-0.5 text-xs text-slate-500">{t.body}</p> : null}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            aria-label="Dismiss"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  )
}
