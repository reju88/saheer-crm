import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  ClipboardList,
  Target,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useCrmStore } from '@/stores/crm-store'
import { cn } from '@/shared/utils/cn'

const aed = (n: number) => `AED ${Math.round(n).toLocaleString('en-US')}`

const leadTone: Record<string, string> = {
  Open: 'bg-cyan-500',
  Pending: 'bg-amber-500',
  'Follow-up': 'bg-sky-400',
  Converted: 'bg-emerald-500',
  Lost: 'bg-slate-400',
}

const taskTone: Record<string, string> = {
  Pending: 'bg-amber-500',
  'In Progress': 'bg-cyan-500',
  Completed: 'bg-emerald-500',
  Cancelled: 'bg-slate-400',
  'N/A': 'bg-orange-400',
}

const dealTone: Record<string, string> = {
  Qualified: 'from-sky-400 to-sky-600',
  Proposal: 'from-amber-400 to-orange-500',
  Negotiation: 'from-[var(--color-brand)] to-fuchsia-600',
  Won: 'from-emerald-400 to-teal-600',
  Lost: 'from-slate-300 to-slate-500',
}

const customerTone: Record<string, string> = {
  Active: 'bg-emerald-500',
  Inactive: 'bg-slate-400',
  'At risk': 'bg-amber-500',
}

export function ReportsPage() {
  const navigate = useNavigate()
  const leads = useCrmStore((s) => s.leads)
  const tasks = useCrmStore((s) => s.tasks)
  const deals = useCrmStore((s) => s.deals)
  const customers = useCrmStore((s) => s.customers)
  const team = useCrmStore((s) => s.team)

  const data = useMemo(() => {
    const leadStatuses = ['Open', 'Pending', 'Follow-up', 'Converted', 'Lost'] as const
    const leadRows = leadStatuses.map((s) => ({ label: s, value: leads.filter((l) => l.status === s).length }))
    const leadTotal = Math.max(1, leads.length)

    const taskStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled', 'N/A'] as const
    const taskRows = taskStatuses.map((s) => ({ label: s, value: tasks.filter((t) => t.status === s).length }))
    const taskMax = Math.max(1, ...taskRows.map((r) => r.value))

    const stages = ['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] as const
    const dealRows = stages.map((s) => ({
      label: s,
      value: deals.filter((d) => d.stage === s).reduce((a, d) => a + d.value, 0),
      count: deals.filter((d) => d.stage === s).length,
    }))
    const dealMax = Math.max(1, ...dealRows.map((r) => r.value))

    const custStatuses = ['Active', 'Inactive', 'At risk'] as const
    const customerRows = custStatuses.map((s) => ({
      label: s,
      value: customers.filter((c) => c.status === s).length,
    }))
    const custTotal = Math.max(1, customers.length)

    const loadRows = team.map((m) => {
      const leadCount = leads.filter((l) => l.owner === m.name).length
      const taskCount = tasks.filter((t) => t.assignee === m.name).length
      return {
        id: m.id,
        name: m.name,
        role: m.role,
        status: m.status,
        leads: leadCount,
        tasks: taskCount,
        total: leadCount + taskCount,
      }
    })
    const loadMax = Math.max(1, ...loadRows.map((r) => r.total))

    const pipeline = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost').reduce((a, d) => a + d.value, 0)
    const won = deals.filter((d) => d.stage === 'Won').reduce((a, d) => a + d.value, 0)
    const converted = leadRows.find((r) => r.label === 'Converted')?.value ?? 0
    const convRate = Math.round((converted / leadTotal) * 100)

    return {
      leadRows,
      leadTotal,
      taskRows,
      taskMax,
      dealRows,
      dealMax,
      customerRows,
      custTotal,
      loadRows,
      loadMax,
      pipeline,
      won,
      convRate,
    }
  }, [leads, tasks, deals, customers, team])

  return (
    <div className="flex h-full min-h-full flex-col gap-5">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">Live analytics from your CRM workspace.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm">
          <span className="font-semibold text-emerald-800">{data.convRate}% conversion</span>
          <span className="mx-2 text-emerald-300">·</span>
          <span className="text-emerald-700">{aed(data.won)} won</span>
        </div>
      </div>

      <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricTile icon={Target} label="Leads" value={String(leads.length)} hint="Pipeline records" tone="cyan" onClick={() => navigate('/leads')} />
        <MetricTile icon={ClipboardList} label="Tasks" value={String(tasks.length)} hint="Follow-ups & calls" tone="amber" onClick={() => navigate('/tasks')} />
        <MetricTile icon={UserRound} label="Customers" value={String(customers.length)} hint="Converted accounts" tone="brand" onClick={() => navigate('/customers')} />
        <MetricTile icon={TrendingUp} label="Open pipeline" value={aed(data.pipeline)} hint="Active deal value" tone="violet" onClick={() => navigate('/sales')} />
        <MetricTile icon={Users} label="Team" value={String(team.length)} hint="People in CRM" tone="slate" onClick={() => navigate('/team')} />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-12">
        {/* Lead mix */}
        <section className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] xl:col-span-4">
          <Header title="Lead mix" subtitle="Status breakdown" onOpen={() => navigate('/leads')} />
          <div className="mt-5 flex flex-1 flex-col gap-5 sm:flex-row sm:items-center xl:flex-col 2xl:flex-row">
            <Donut
              segments={data.leadRows.map((r) => ({
                value: r.value,
                color: donutColor(r.label),
              }))}
              center={`${data.convRate}%`}
              caption="converted"
            />
            <ul className="min-w-0 flex-1 space-y-2.5">
              {data.leadRows.map((r) => (
                <li key={r.label} className="flex items-center gap-2.5 text-sm">
                  <span className={cn('size-2.5 shrink-0 rounded-full', leadTone[r.label])} />
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{r.label}</span>
                  <span className="font-semibold tabular-nums text-slate-900">{r.value}</span>
                  <span className="w-10 text-right text-xs tabular-nums text-slate-400">
                    {Math.round((r.value / data.leadTotal) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tasks */}
        <section className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] xl:col-span-4">
          <Header title="Task status" subtitle="Workload by state" onOpen={() => navigate('/tasks')} />
          <ul className="mt-5 flex flex-1 flex-col justify-center gap-3.5">
            {data.taskRows.map((r) => (
              <li key={r.label}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-700">{r.label}</span>
                  <span className="font-semibold tabular-nums text-slate-900">{r.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn('h-full rounded-full transition-all', taskTone[r.label])}
                    style={{ width: `${(r.value / data.taskMax) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Customers */}
        <section className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] xl:col-span-4">
          <Header title="Customers" subtitle="Account health" onOpen={() => navigate('/customers')} />
          <div className="mt-5 grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3">
            {data.customerRows.map((r) => (
              <div
                key={r.label}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/80 px-2 py-4 text-center"
              >
                <span className={cn('mb-2 size-2.5 rounded-full', customerTone[r.label])} />
                <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-slate-900">
                  {r.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{r.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {Math.round((r.value / data.custTotal) * 100)}%
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="mt-4 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
          >
            Open customers
          </button>
        </section>

        {/* Deal pipeline columns */}
        <section className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] xl:col-span-7">
          <Header title="Deal value by stage" subtitle="Pipeline composition" onOpen={() => navigate('/sales')} />
          <div className="mt-6 flex flex-1 items-end gap-3 sm:gap-4">
            {data.dealRows.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => navigate('/sales')}
                className="group flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <span className="text-[11px] font-bold tabular-nums text-slate-700">
                  {r.value > 0 ? `${Math.round(r.value / 1000)}k` : '0'}
                </span>
                <div className="flex h-36 w-full items-end justify-center rounded-xl bg-slate-50 px-1.5 py-2 sm:h-44">
                  <div
                    className={cn(
                      'w-full max-w-[48px] rounded-lg bg-gradient-to-t shadow-sm transition group-hover:scale-[1.03]',
                      dealTone[r.label],
                    )}
                    style={{ height: `${Math.max(r.value > 0 ? 8 : 0, (r.value / data.dealMax) * 100)}%` }}
                  />
                </div>
                <span className="truncate text-[11px] font-semibold text-slate-600">{r.label}</span>
                <span className="text-[10px] text-slate-400">{r.count} deals</span>
              </button>
            ))}
          </div>
        </section>

        {/* Won vs open */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] xl:col-span-5">
          <Header title="Revenue snapshot" subtitle="Won vs open pipeline" onOpen={() => navigate('/sales')} />
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Open pipeline</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-slate-900">
                {aed(data.pipeline)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Won</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-emerald-600">
                {aed(data.won)}
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                style={{
                  width: `${Math.round((data.won / Math.max(1, data.won + data.pipeline)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {Math.round((data.won / Math.max(1, data.won + data.pipeline)) * 100)}% of tracked value is closed-won
            </p>
          </div>
        </section>

        {/* Team load — full grid */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] xl:col-span-12">
          <Header title="Team load" subtitle="Leads owned + tasks assigned" onOpen={() => navigate('/team')} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {data.loadRows.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate('/team')}
                className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 text-left transition hover:border-cyan-200 hover:bg-cyan-50/50"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-full bg-white text-[11px] font-bold text-cyan-700 ring-1 ring-slate-200">
                    {m.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{m.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{m.role}</p>
                  </div>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
                  <div
                    className="h-full rounded-full bg-[var(--color-brand)]"
                    style={{ width: `${(m.total / data.loadMax) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] font-medium text-slate-600">
                  <span className="tabular-nums text-slate-900">{m.leads}</span> leads
                  <span className="mx-1 text-slate-300">·</span>
                  <span className="tabular-nums text-slate-900">{m.tasks}</span> tasks
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function MetricTile({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  onClick,
}: {
  icon: LucideIcon
  label: string
  value: string
  hint: string
  tone: 'cyan' | 'amber' | 'brand' | 'violet' | 'slate'
  onClick: () => void
}) {
  const wrap = {
    cyan: 'from-cyan-500 to-teal-600 shadow-cyan-500/25',
    amber: 'from-amber-400 to-orange-500 shadow-amber-500/25',
    brand: 'from-[var(--color-brand)] to-fuchsia-600 shadow-pink-500/25',
    violet: 'from-violet-500 to-indigo-600 shadow-violet-500/25',
    slate: 'from-slate-700 to-slate-900 shadow-slate-900/20',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(10,22,40,0.5)]"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105',
            wrap[tone],
          )}
        >
          <Icon className="size-4" strokeWidth={2.1} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">{label}</p>
          <p className="mt-1 truncate font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>
        </div>
      </div>
    </button>
  )
}

function Header({ title, subtitle, onOpen }: { title: string; subtitle: string; onOpen: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
        aria-label={`Open ${title}`}
      >
        <ArrowUpRight className="size-3.5" strokeWidth={2.2} />
      </button>
    </div>
  )
}

function Donut({
  segments,
  center,
  caption,
}: {
  segments: { value: number; color: string }[]
  center: string
  caption: string
}) {
  const total = Math.max(1, segments.reduce((a, s) => a + s.value, 0))
  let cursor = 0
  const stops = segments
    .map((s) => {
      const start = cursor
      const end = cursor + (s.value / total) * 100
      cursor = end
      return `${s.color} ${start}% ${end}%`
    })
    .join(', ')

  return (
    <div
      className="relative mx-auto grid size-32 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${stops})` }}
    >
      <div className="grid size-[4.75rem] place-items-center rounded-full bg-white text-center shadow-inner">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">{center}</span>
        <span className="text-[10px] text-slate-500">{caption}</span>
      </div>
    </div>
  )
}

function donutColor(label: string) {
  const map: Record<string, string> = {
    Open: '#06b6d4',
    Pending: '#f59e0b',
    'Follow-up': '#38bdf8',
    Converted: '#10b981',
    Lost: '#94a3b8',
  }
  return map[label] ?? '#94a3b8'
}
