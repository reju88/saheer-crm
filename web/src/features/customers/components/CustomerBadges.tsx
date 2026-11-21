import { cn } from '@/shared/utils/cn'
import type { CustomerStatus, CustomerTier } from '@/features/customers/types/customer'

const statusClass: Record<CustomerStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
  'At risk': 'bg-amber-50 text-amber-700 ring-amber-200',
}

const tierClass: Record<CustomerTier, string> = {
  Standard: 'bg-sky-50 text-sky-700 ring-sky-200',
  Premium: 'bg-violet-50 text-violet-700 ring-violet-200',
  Enterprise: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', statusClass[status])}>
      {status}
    </span>
  )
}

export function CustomerTierBadge({ tier }: { tier: CustomerTier }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', tierClass[tier])}>
      {tier}
    </span>
  )
}
