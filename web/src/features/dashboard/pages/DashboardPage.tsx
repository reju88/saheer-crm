import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, Users } from 'lucide-react'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { useCrmStore } from '@/stores/crm-store'

const statusOrder = ['Open', 'Pending', 'Follow-up', 'Converted', 'Lost'] as const
const statusColor: Record<(typeof statusOrder)[number], string> = {
  Open: 'bg-cyan-500',
  Pending: 'bg-amber-500',
  'Follow-up': 'bg-sky-400',
  Converted: 'bg-emerald-500',
  Lost: 'bg-slate-400',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const leads = useCrmStore((s) => s.leads)
  const tasks = useCrmStore((s) => s.tasks)
  const customers = useCrmStore((s) => s.customers)
  const deals = useCrmStore((s) => s.deals)
  const team = useCrmStore((s) => s.team)
  const settings = useCrmStore((s) => s.settings)

  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(statusOrder.map((s) => [s, 0])) as Record<(typeof statusOrder)[number], number>
    for (const l of leads) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1

    const sources = new Map<string, number>()
    for (const l of leads) sources.set(l.source, (sources.get(l.source) ?? 0) + 1)
    const sourceRows = [...sources.entries()]
      .map(([label, count]) => ({ label, count, pct: leads.length ? Math.round((count / leads.length) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)

    const load = new Map<string, number>()
    for (const l of leads) {
      if (l.status === 'Open' || l.status === 'Pending' || l.status === 'Follow-up') {
        load.set(l.owner, (load.get(l.owner) ?? 0) + 1)
      }
    }
    const maxLoad = Math.max(1, ...load.values())
    const loadRows = [...load.entries()]
      .map(([name, count]) => ({ name, count, w: `${Math.round((count / maxLoad) * 100)}%` }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const maxStatus = Math.max(1, ...Object.values(byStatus))
    const pipeline = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost').reduce((s, d) => s + d.value, 0)
    const won = deals.filter((d) => d.stage === 'Won').reduce((s, d) => s + d.value, 0)
    const converted = byStatus.Converted
    const convRate = leads.length ? Math.round((converted / leads.length) * 100) : 0

    return {
      byStatus,
      maxStatus,
      sourceRows,
      loadRows,
      pipeline,
      won,
      convRate,
      pendingTasks: tasks.filter((t) => t.status === 'Pending').length,
      todayTasks: tasks.filter((t) => t.bucket === 'today').length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
      hot: leads.filter((l) => l.rating === 'Hot').length,
      recent: [...leads].slice(0, 5),
    }
  }, [leads, tasks, deals])

  const fmt = (n: number) =>
    `${settings.currency} ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`

  return (
    <div className="space-y-6">
      <div className="animate-fade flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live snapshot for {settings.companyName} · {team.filter((m) => m.status === 'Active').length} active team
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Users className="size-4" strokeWidth={2} />
            Leads
          </button>
          <button
            type="button"
            onClick={() => navigate('/sales')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <TrendingUp className="size-4" strokeWidth={2} />
            Pipeline
          </button>
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(233,30,140,0.7)] hover:bg-[var(--color-brand-hover)]"
          >
            <Plus className="size-4" strokeWidth={2.2} />
            New lead
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total leads" value={String(leads.length)} tone="accent" delay={0.05} onClick={() => navigate('/leads')} />
        <StatCard label="Hot leads" value={String(stats.hot)} hint="High priority" delay={0.1} onClick={() => navigate('/leads')} />
        <StatCard label="Open" value={String(stats.byStatus.Open)} delay={0.15} onClick={() => navigate('/leads')} />
        <StatCard label="Pending" value={String(stats.byStatus.Pending)} tone="warn" delay={0.2} onClick={() => navigate('/leads')} />
        <StatCard
          label="Converted"
          value={String(stats.byStatus.Converted)}
          hint={`${stats.convRate}% of leads`}
          tone="success"
          delay={0.25}
          onClick={() => navigate('/customers')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section
          className="animate-rise rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] lg:col-span-5"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">Lead status</h2>
              <p className="mt-1 text-xs text-slate-500">Live pipeline distribution</p>
            </div>
            <button type="button" className="text-xs font-semibold text-[var(--color-accent)] hover:underline" onClick={() => navigate('/reports')}>
              Reports
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {statusOrder.map((label, i) => {
              const value = stats.byStatus[label]
              const width = `${Math.round((value / stats.maxStatus) * 100)}%`
              return (
                <li key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-slate-600">{label}</span>
                    <span className="tabular-nums text-slate-900">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`animate-bar h-full rounded-full ${statusColor[label]}`}
                      style={{ width, animationDelay: `${0.25 + i * 0.06}s` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section
          className="animate-rise rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] lg:col-span-4"
          style={{ animationDelay: '0.28s' }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">Lead sources</h2>
          <p className="mt-1 text-xs text-slate-500">Share of current leads</p>
          <div className="mt-6 flex items-center gap-6">
            <div className="relative grid size-28 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600">
              <div className="grid size-16 place-items-center rounded-full bg-white text-center">
                <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">
                  {stats.convRate}%
                </span>
                <span className="text-[10px] text-slate-500">conv.</span>
              </div>
            </div>
            <ul className="flex-1 space-y-2">
              {stats.sourceRows.map((s) => (
                <li key={s.label} className="flex justify-between text-xs">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-semibold tabular-nums text-slate-900">{s.pct}%</span>
                </li>
              ))}
              {stats.sourceRows.length === 0 ? <li className="text-xs text-slate-400">No source data</li> : null}
            </ul>
          </div>
        </section>

        <section className="animate-rise grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1" style={{ animationDelay: '0.32s' }}>
          <StatCard label="Customers" value={String(customers.length)} tone="brand" onClick={() => navigate('/customers')} />
          <StatCard label="Today's tasks" value={String(stats.todayTasks)} tone="warn" onClick={() => navigate('/tasks')} />
          <StatCard label="Pending tasks" value={String(stats.pendingTasks)} onClick={() => navigate('/tasks')} />
          <StatCard label="Completed tasks" value={String(stats.completedTasks)} tone="success" onClick={() => navigate('/tasks')} />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section
          className="animate-rise rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] lg:col-span-1"
          style={{ animationDelay: '0.34s' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">Sales pipeline</h2>
            <button type="button" className="text-xs font-semibold text-[var(--color-accent)] hover:underline" onClick={() => navigate('/sales')}>
              Open
            </button>
          </div>
          <p className="mt-4 text-[11px] font-bold tracking-wide text-slate-500 uppercase">Open value</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">{fmt(stats.pipeline)}</p>
          <p className="mt-3 text-[11px] font-bold tracking-wide text-slate-500 uppercase">Won</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">{fmt(stats.won)}</p>
          <p className="mt-3 text-xs text-slate-500">{deals.length} deals in CRM</p>
        </section>

        <section
          className="animate-rise rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] lg:col-span-1"
          style={{ animationDelay: '0.36s' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">Recent leads</h2>
            <button type="button" className="text-xs font-semibold text-[var(--color-accent)] hover:underline" onClick={() => navigate('/leads')}>
              View all
            </button>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {stats.recent.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/leads/${row.id}`)}
                  className="flex w-full items-center justify-between py-3 text-left hover:bg-slate-50/80"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{row.contactName}</p>
                    <p className="text-xs text-slate-500">
                      {row.rating} · {row.status}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{row.owner}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="animate-rise rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] lg:col-span-1"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">Team load</h2>
              <p className="mt-1 text-xs text-slate-500">Open + pending + follow-up</p>
            </div>
            <button type="button" className="text-xs font-semibold text-[var(--color-accent)] hover:underline" onClick={() => navigate('/team')}>
              Team
            </button>
          </div>
          <ul className="mt-5 space-y-3">
            {stats.loadRows.map((row, i) => (
              <li key={row.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-slate-600">{row.name}</span>
                  <span className="tabular-nums font-semibold text-slate-900">{row.count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="animate-bar h-full rounded-full bg-[var(--color-brand)]"
                    style={{ width: row.w, animationDelay: `${0.45 + i * 0.05}s` }}
                  />
                </div>
              </li>
            ))}
            {stats.loadRows.length === 0 ? <li className="text-xs text-slate-400">No open leads</li> : null}
          </ul>
        </section>
      </div>
    </div>
  )
}
