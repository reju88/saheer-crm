import { cn } from '@/shared/utils/cn'
import type { LeadRating, LeadStatus } from '@/features/leads/types/lead'

const ratingClass: Record<LeadRating, string> = {
  Hot: 'bg-rose-50 text-rose-700 ring-rose-200',
  Warm: 'bg-amber-50 text-amber-700 ring-amber-200',
  Cold: 'bg-sky-50 text-sky-700 ring-sky-200',
}

const statusClass: Record<LeadStatus, string> = {
  Open: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
  Pending: 'bg-orange-50 text-orange-700 ring-orange-200',
  'Follow-up': 'bg-violet-50 text-violet-700 ring-violet-200',
  Converted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Lost: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export function RatingBadge({ rating }: { rating: LeadRating }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', ratingClass[rating])}>
      {rating}
    </span>
  )
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', statusClass[status])}>
      {status}
    </span>
  )
}
