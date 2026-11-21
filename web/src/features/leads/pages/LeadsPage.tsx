import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  CircleDot,
  Flame,
  FolderOpen,
  Hourglass,
  MessageSquare,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { CreateLeadDrawer } from '@/features/leads/components/CreateLeadDrawer'
import { LeadExtrasDrawer } from '@/features/leads/components/LeadExtrasDrawer'
import { RatingBadge, StatusBadge } from '@/features/leads/components/LeadBadges'
import type { Lead, LeadRating, LeadStatus } from '@/features/leads/types/lead'
import { Pagination } from '@/shared/components/Pagination'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'
import { askConfirm } from '@/stores/ui-store'

type SummaryKey = 'all' | 'hot' | 'open' | 'pending' | 'followup'

const PAGE_SIZE = 5

export function LeadsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [extrasLead, setExtrasLead] = useState<Lead | null>(null)
  const [extrasTab, setExtrasTab] = useState<'comments' | 'attachments'>('comments')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | LeadStatus>('all')
  const [rating, setRating] = useState<'all' | LeadRating>('all')
  const [owner, setOwner] = useState('all')
  const [summary, setSummary] = useState<SummaryKey>('all')
  const [page, setPage] = useState(1)

  const openExtras = (lead: Lead, tab: 'comments' | 'attachments') => {
    setExtrasTab(tab)
    setExtrasLead(lead)
  }

  const leads = useCrmStore((s) => s.leads)
  const notes = useCrmStore((s) => s.notes)
  const attachments = useCrmStore((s) => s.attachments)
  const deleteLead = useCrmStore((s) => s.deleteLead)

  const owners = useMemo(() => [...new Set(leads.map((l) => l.owner))], [leads])

  const counts = useMemo(
    () => ({
      all: leads.length,
      hot: leads.filter((l) => l.rating === 'Hot').length,
      open: leads.filter((l) => l.status === 'Open').length,
      pending: leads.filter((l) => l.status === 'Pending').length,
      followup: leads.filter((l) => l.status === 'Follow-up').length,
    }),
    [leads],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((lead) => {
      if (summary === 'hot' && lead.rating !== 'Hot') return false
      if (summary === 'open' && lead.status !== 'Open') return false
      if (summary === 'pending' && lead.status !== 'Pending') return false
      if (summary === 'followup' && lead.status !== 'Follow-up') return false
      if (status !== 'all' && lead.status !== status) return false
      if (rating !== 'all' && lead.rating !== rating) return false
      if (owner !== 'all' && lead.owner !== owner) return false
      if (!q) return true
      return (
        lead.contactName.toLowerCase().includes(q) ||
        lead.businessMobile.toLowerCase().includes(q) ||
        lead.opportunity.toLowerCase().includes(q) ||
        lead.owner.toLowerCase().includes(q)
      )
    })
  }, [leads, query, status, rating, owner, summary])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, status, rating, owner, summary])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">Track pipeline health and jump into lead records.</p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(0,15,159,0.7)] hover:bg-[var(--color-brand-hover)]"
        >
          <Plus className="size-4" strokeWidth={2.2} />
          New lead
        </button>
      </div>

      <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryTile active={summary === 'all'} label="Total leads" value={counts.all} hint="All pipeline" icon={Users} tone="slate" onClick={() => setSummary('all')} />
        <SummaryTile active={summary === 'hot'} label="Hot leads" value={counts.hot} hint="High priority" icon={Flame} tone="rose" onClick={() => setSummary('hot')} />
        <SummaryTile active={summary === 'open'} label="Open" value={counts.open} hint="Not started" icon={FolderOpen} tone="cyan" onClick={() => setSummary('open')} />
        <SummaryTile active={summary === 'pending'} label="Pending" value={counts.pending} hint="Awaiting action" icon={Hourglass} tone="amber" onClick={() => setSummary('pending')} />
        <SummaryTile active={summary === 'followup'} label="Follow-up" value={counts.followup} hint="Needs contact" icon={RefreshCw} tone="violet" onClick={() => setSummary('followup')} />
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
            <FilterSelect icon={CircleDot} label="Status" value={status} onChange={(v) => setStatus(v as 'all' | LeadStatus)}>
              <option value="all">All status</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </FilterSelect>
            <FilterSelect icon={Flame} label="Rating" value={rating} onChange={(v) => setRating(v as 'all' | LeadRating)}>
              <option value="all">All rating</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
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
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-bold tracking-wide text-slate-500 uppercase shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <tr>
                <th className="px-4 py-3 font-bold">Contact</th>
                <th className="px-4 py-3 font-bold">Owner</th>
                <th className="px-4 py-3 font-bold">Opportunity</th>
                <th className="px-4 py-3 font-bold">Source</th>
                <th className="px-4 py-3 font-bold">Rating</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Lead date</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-slate-500">
                    No leads match your search or filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link to={`/leads/${lead.id}`} className="group block">
                        <span className="font-semibold text-slate-900 group-hover:text-[var(--color-brand)]">
                          {lead.contactName}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">{lead.businessMobile}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.owner}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.opportunity}</td>
                    <td className="px-4 py-3 text-slate-500">{lead.source}</td>
                    <td className="px-4 py-3">
                      <RatingBadge rating={lead.rating} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{lead.leadDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <RowIconBtn
                          label={`Comments for ${lead.contactName}`}
                          title="Comments"
                          count={(notes[lead.id]?.length ?? 0) + (lead.comments.trim() ? 1 : 0)}
                          onClick={() => openExtras(lead, 'comments')}
                          tone="amber"
                        >
                          <MessageSquare className="size-3.5" strokeWidth={2} />
                        </RowIconBtn>
                        <RowIconBtn
                          label={`Attachments for ${lead.contactName}`}
                          title="Attachments"
                          count={attachments[lead.id]?.length ?? 0}
                          onClick={() => openExtras(lead, 'attachments')}
                          tone="cyan"
                        >
                          <Paperclip className="size-3.5" strokeWidth={2} />
                        </RowIconBtn>
                        <Link
                          to={`/leads/${lead.id}`}
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                          aria-label={`Edit ${lead.contactName}`}
                          title="Edit"
                        >
                          <Pencil className="size-3.5" strokeWidth={2} />
                        </Link>
                        <button
                          type="button"
                          className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Delete ${lead.contactName}`}
                          title="Delete"
                          onClick={async () => {
                            const ok = await askConfirm({
                              title: 'Delete lead',
                              body: `Delete “${lead.contactName}”? This cannot be undone.`,
                              confirmLabel: 'Delete',
                              tone: 'danger',
                            })
                            if (ok) deleteLead(lead.id)
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

      <CreateLeadDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <LeadExtrasDrawer
        lead={extrasLead}
        initialTab={extrasTab}
        onClose={() => setExtrasLead(null)}
      />
    </div>
  )
}

function RowIconBtn({
  children,
  label,
  title,
  count,
  onClick,
  tone,
}: {
  children: ReactNode
  label: string
  title: string
  count: number
  onClick: () => void
  tone: 'amber' | 'cyan'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={title}
      className={cn(
        'relative grid size-8 place-items-center rounded-lg border bg-white transition',
        tone === 'amber'
          ? 'border-slate-200 text-slate-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700'
          : 'border-slate-200 text-slate-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700',
      )}
    >
      {children}
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] leading-none font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
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
