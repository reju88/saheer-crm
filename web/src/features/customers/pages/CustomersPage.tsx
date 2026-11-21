import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  CircleDot,
  PauseCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { CreateCustomerDrawer } from '@/features/customers/components/CreateCustomerDrawer'
import { CustomerStatusBadge, CustomerTierBadge } from '@/features/customers/components/CustomerBadges'
import type { CustomerStatus, CustomerTier } from '@/features/customers/types/customer'
import { Pagination } from '@/shared/components/Pagination'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'
import { askConfirm } from '@/stores/ui-store'

type SummaryKey = 'all' | 'active' | 'at_risk' | 'inactive' | 'premium'

const PAGE_SIZE = 6

export function CustomersPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | CustomerStatus>('all')
  const [tier, setTier] = useState<'all' | CustomerTier>('all')
  const [owner, setOwner] = useState('all')
  const [summary, setSummary] = useState<SummaryKey>('all')
  const [page, setPage] = useState(1)

  const demoCustomers = useCrmStore((s) => s.customers)
  const deleteCustomer = useCrmStore((s) => s.deleteCustomer)

  const owners = useMemo(() => [...new Set(demoCustomers.map((c) => c.owner))], [demoCustomers])

  const counts = useMemo(
    () => ({
      all: demoCustomers.length,
      active: demoCustomers.filter((c) => c.status === 'Active').length,
      at_risk: demoCustomers.filter((c) => c.status === 'At risk').length,
      inactive: demoCustomers.filter((c) => c.status === 'Inactive').length,
      premium: demoCustomers.filter((c) => c.tier === 'Premium' || c.tier === 'Enterprise').length,
    }),
    [demoCustomers],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return demoCustomers.filter((c) => {
      if (summary === 'active' && c.status !== 'Active') return false
      if (summary === 'at_risk' && c.status !== 'At risk') return false
      if (summary === 'inactive' && c.status !== 'Inactive') return false
      if (summary === 'premium' && c.tier !== 'Premium' && c.tier !== 'Enterprise') return false
      if (status !== 'all' && c.status !== status) return false
      if (tier !== 'all' && c.tier !== tier) return false
      if (owner !== 'all' && c.owner !== owner) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.mobile.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
      )
    })
  }, [demoCustomers, query, status, tier, owner, summary])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, status, tier, owner, summary])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-slate-500">Converted accounts, ownership, and commercial health.</p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(0,15,159,0.7)] hover:bg-[var(--color-brand-hover)]"
        >
          <Plus className="size-4" strokeWidth={2.2} />
          New customer
        </button>
      </div>

      <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryTile active={summary === 'all'} label="Total" value={counts.all} hint="All accounts" icon={Users} tone="slate" onClick={() => setSummary('all')} />
        <SummaryTile active={summary === 'active'} label="Active" value={counts.active} hint="Healthy accounts" icon={UserCheck} tone="cyan" onClick={() => setSummary('active')} />
        <SummaryTile active={summary === 'at_risk'} label="At risk" value={counts.at_risk} hint="Needs attention" icon={AlertTriangle} tone="amber" onClick={() => setSummary('at_risk')} />
        <SummaryTile active={summary === 'inactive'} label="Inactive" value={counts.inactive} hint="Paused / closed" icon={PauseCircle} tone="violet" onClick={() => setSummary('inactive')} />
        <SummaryTile active={summary === 'premium'} label="Premium+" value={counts.premium} hint="Premium & enterprise" icon={Building2} tone="rose" onClick={() => setSummary('premium')} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)]">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="relative w-full sm:max-w-[220px] sm:w-[220px]">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-sm outline-none focus:border-[var(--color-accent)] focus:bg-white"
              placeholder="Search…"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <FilterSelect icon={CircleDot} label="Status" value={status} onChange={(v) => setStatus(v as 'all' | CustomerStatus)}>
              <option value="all">All status</option>
              <option value="Active">Active</option>
              <option value="At risk">At risk</option>
              <option value="Inactive">Inactive</option>
            </FilterSelect>
            <FilterSelect icon={Building2} label="Tier" value={tier} onChange={(v) => setTier(v as 'all' | CustomerTier)}>
              <option value="all">All tiers</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </FilterSelect>
            <FilterSelect icon={UserRound} label="Owner" value={owner} onChange={setOwner}>
              <option value="all">All owners</option>
              {owners.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-bold tracking-wide text-slate-500 uppercase shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <tr>
                <th className="px-4 py-3 font-bold">Customer</th>
                <th className="px-4 py-3 font-bold">Owner</th>
                <th className="px-4 py-3 font-bold">Industry</th>
                <th className="px-4 py-3 font-bold">Deal value</th>
                <th className="px-4 py-3 font-bold">Tier</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Converted</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-slate-500">
                    No customers match your search or filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((c) => (
                  <tr key={c.id} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link to={`/customers/${c.id}`} className="group block">
                        <span className="font-semibold text-slate-900 group-hover:text-[var(--color-brand)]">{c.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {c.company} · {c.mobile}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.owner}</td>
                    <td className="px-4 py-3 text-slate-600">{c.industry}</td>
                    <td className="px-4 py-3 font-medium tabular-nums text-slate-800">{c.dealValue}</td>
                    <td className="px-4 py-3">
                      <CustomerTierBadge tier={c.tier} />
                    </td>
                    <td className="px-4 py-3">
                      <CustomerStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.convertedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/customers/${c.id}`}
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                          aria-label={`Open ${c.name}`}
                          title="Open"
                        >
                          <Pencil className="size-3.5" strokeWidth={2} />
                        </Link>
                        <button
                          type="button"
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${c.name}`}
                          title="Delete"
                          onClick={async () => {
                            const ok = await askConfirm({
                              title: 'Delete customer',
                              body: `Delete “${c.name}”? This cannot be undone.`,
                              confirmLabel: 'Delete',
                              tone: 'danger',
                            })
                            if (ok) deleteCustomer(c.id)
                          }}
                        >
                          <Trash2 className="size-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageCount={pageCount}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </div>

      <CreateCustomerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

function FilterSelect({
  icon: Icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: LucideIcon
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  const active = value !== 'all'

  return (
    <label className="relative inline-flex min-w-0 flex-1 items-center sm:min-w-[140px] sm:flex-none">
      <span className="pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2 text-slate-400">
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full appearance-none rounded-xl border bg-white py-2 pr-8 pl-8 text-sm font-medium shadow-sm outline-none transition',
          active
            ? 'border-[var(--color-brand)]/40 text-slate-900 ring-2 ring-[var(--color-brand)]/10'
            : 'border-slate-200 text-slate-700 hover:border-slate-300',
          'focus:border-[var(--color-accent)] focus:ring-2 focus:ring-cyan-500/15',
        )}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400"
        strokeWidth={2.2}
      />
    </label>
  )
}

function SummaryTile({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  active,
  onClick,
}: {
  label: string
  value: number
  hint: string
  icon: typeof Users
  tone: 'slate' | 'rose' | 'cyan' | 'amber' | 'violet'
  active: boolean
  onClick: () => void
}) {
  const iconWrap = {
    slate: 'bg-slate-900 text-white shadow-slate-900/20',
    rose: 'bg-gradient-to-br from-rose-500 to-[var(--color-brand)] text-white shadow-rose-500/30',
    cyan: 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-cyan-500/30',
    amber: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30',
    violet: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-violet-500/30',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group rounded-2xl border bg-white p-4 text-left shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(10,22,40,0.5)]',
        active ? 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]/15' : 'border-slate-200/90',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl shadow-lg transition group-hover:scale-105',
            iconWrap[tone],
          )}
        >
          <Icon className="size-5" strokeWidth={2.1} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">{label}</p>
          <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
        </div>
        <p className="font-[family-name:var(--font-display)] text-[22px] font-semibold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
      </div>
    </button>
  )
}
