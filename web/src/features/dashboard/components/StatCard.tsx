import { cn } from '@/shared/utils/cn'

type StatCardProps = {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'accent' | 'success' | 'warn' | 'brand'
  className?: string
  delay?: number
  onClick?: () => void
}

const toneClass: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'border-slate-200/90',
  accent: 'border-cyan-200 bg-gradient-to-br from-white to-cyan-50/60',
  success: 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50',
  warn: 'border-amber-200 bg-gradient-to-br from-white to-amber-50/50',
  brand: 'border-pink-200 bg-gradient-to-br from-white to-pink-50/40',
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'default',
  className,
  delay = 0,
  onClick,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'animate-rise rounded-2xl border bg-white p-4 text-left shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(10,22,40,0.5)]',
        toneClass[tone],
        className,
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs font-medium text-[var(--color-success)]">{hint}</p> : null}
    </button>
  )
}
