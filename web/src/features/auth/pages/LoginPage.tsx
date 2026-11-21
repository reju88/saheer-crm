import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, TrendingUp, UserRound, Users } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useAuthStore } from '@/stores/auth-store'
import { useCrmStore } from '@/stores/crm-store'
import { cn } from '@/shared/utils/cn'

const features = [
  'Sales Pipeline & Forecasting',
  'Sales Target & Performance',
  'Team Collaboration & Automation',
  'Business Intelligence Reports & KPI',
]

const barHeights = [38, 58, 45, 72, 52, 90, 64, 78]

export function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const customers = useCrmStore((s) => s.customers)
  const leads = useCrmStore((s) => s.leads)
  const deals = useCrmStore((s) => s.deals)

  const stats = useMemo(() => {
    const openLeads = leads.filter((l) => l.status === 'Open').length
    const converted = leads.filter((l) => l.status === 'Converted').length
    const convRate = leads.length ? Math.round((converted / leads.length) * 100) : 0
    const pipeline = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost').reduce((a, d) => a + d.value, 0)
    const openShare = leads.length ? Math.round((openLeads / leads.length) * 100) : 0
    return { openLeads, convRate, pipeline, openShare }
  }, [leads, deals])

  const pipelineLabel =
    stats.pipeline >= 1000
      ? `${(stats.pipeline / 1000).toFixed(1).replace(/\.0$/, '')}K`
      : String(stats.pipeline)

  return (
    <div className="flex h-dvh w-full flex-col lg:flex-row">
      <section className="relative hidden w-[56%] shrink-0 overflow-hidden text-white lg:flex">
        <div className="absolute inset-0 bg-[#071422]" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(14,143,155,0.4)_0%,transparent_42%,rgba(233,30,140,0.22)_100%)]" />
        <div className="animate-glow absolute -left-24 top-1/4 size-[420px] rounded-full bg-cyan-500/25 blur-3xl" />
        <div
          className="animate-glow absolute -right-16 bottom-10 size-[320px] rounded-full bg-[var(--color-brand)]/25 blur-3xl"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-10 py-10 xl:px-16">
          <div className="w-full max-w-xl">
            <img
              src={logo}
              alt="CEZCON CRM"
              className="animate-fade mx-auto h-11 w-auto object-contain"
            />

            <div className="animate-rise mt-10 text-center" style={{ animationDelay: '0.08s' }}>
              <h1 className="font-[family-name:var(--font-display)] text-[2.55rem] font-semibold leading-[1.12] tracking-tight xl:text-[3rem]">
                Grow Faster.
                <br />
                Close More Deals.
              </h1>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-300">
                Your business advisor for leads, tasks, and customer conversion.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-2.5">
              {features.map((title, i) => (
                <li
                  key={title}
                  className="animate-rise flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
                  style={{ animationDelay: `${0.14 + i * 0.05}s` }}
                >
                  <span className="size-2 shrink-0 rounded-full bg-[var(--color-brand)] shadow-[0_0_10px_rgba(233,30,140,0.7)]" />
                  <span className="text-left text-[13px] font-medium leading-snug text-white">{title}</span>
                </li>
              ))}
            </ul>

            <div className="animate-rise mt-8 space-y-3" style={{ animationDelay: '0.35s' }}>
              <div className="grid grid-cols-3 gap-3">
                <MetricCard
                  label="Total customers"
                  value={String(customers.length)}
                  hint="Live CRM data"
                  hintTone="success"
                  delay={0.4}
                />
                <MetricCard
                  label="Conversion"
                  value={`${stats.convRate}%`}
                  delay={0.48}
                  ring={stats.convRate}
                />
                <MetricCard
                  label="Open leads"
                  value={String(stats.openLeads)}
                  bar={stats.openShare}
                  delay={0.56}
                />
              </div>

              <div
                className="animate-rise rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md"
                style={{ animationDelay: '0.62s' }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <TrendingUp className="size-4 text-cyan-300" strokeWidth={2} />
                    Sales pipeline
                  </span>
                  <span className="rounded-full bg-cyan-400/15 px-2.5 py-0.5 text-xs font-bold text-cyan-200">
                    AED {pipelineLabel}
                  </span>
                </div>
                <div className="mx-auto flex h-16 w-full max-w-md items-end justify-center gap-2">
                  {barHeights.map((h, i) => (
                    <div
                      key={i}
                      className="animate-bar-up w-7 rounded-t-md bg-gradient-to-t from-[var(--color-brand)] to-cyan-300 shadow-[0_0_12px_rgba(14,143,155,0.25)] sm:w-8"
                      style={{ height: `${h}%`, animationDelay: `${0.7 + i * 0.05}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-dvh flex-1 items-center justify-center bg-[#eef2f7] px-6 py-10 lg:min-h-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(233,30,140,0.06),transparent_50%)]" />

        <div className="animate-rise relative w-full max-w-[400px]" style={{ animationDelay: '0.12s' }}>
          <div className="mb-6 flex justify-center lg:hidden">
            <div className="rounded-2xl bg-[#071422] px-5 py-3">
              <img src={logo} alt="CEZCON CRM" className="h-10 w-auto object-contain" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-[0_30px_80px_-40px_rgba(7,20,34,0.55)]">
            <div className="mb-7 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">Sign In</p>
              <p className="mt-1 text-sm text-slate-500">Access your CEZCON CRM workspace</p>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                const username = String(fd.get('username') ?? 'Admin')
                setSession(
                  {
                    id: 'u1',
                    name: username || 'Admin',
                    email: 'admin@cezcon.ae',
                    role: 'admin',
                  },
                  'demo-token',
                )
                navigate('/')
              }}
            >
              <label className="block space-y-1.5">
                <span className="text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">Username</span>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-[#f7f9fc] px-3 transition focus-within:border-[var(--color-brand)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--color-brand)]/10">
                  <UserRound className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                  <input
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Enter username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    defaultValue="Admin"
                    required
                  />
                </div>
              </label>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-[11px] font-bold tracking-[0.1em] text-slate-500 uppercase">
                    Password
                  </label>
                  <button type="button" className="text-xs font-semibold text-[var(--color-brand)] hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-[#f7f9fc] px-3 transition focus-within:border-[var(--color-brand)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--color-brand)]/10">
                  <Lock className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                  <input
                    id="login-password"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Enter password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 text-sm text-slate-600">
                <input type="checkbox" className="size-4 rounded border-slate-300 accent-[var(--color-brand)]" />
                Keep me logged in
              </label>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(233,30,140,0.75)] transition hover:scale-[1.01] hover:bg-[var(--color-brand-hover)] active:scale-[0.99]"
              >
                Sign In
                <span aria-hidden>→</span>
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            <a href="mailto:sales@cezcon.com" className="font-medium text-slate-700 hover:text-[var(--color-brand)]">
              sales@cezcon.com
            </a>
            <span className="mx-2 text-slate-300">|</span>
            <a href="tel:+971545819182" className="font-medium text-slate-700 hover:text-[var(--color-brand)]">
              +971 54 581 9182
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  hint,
  hintTone,
  ring,
  bar,
  delay,
}: {
  label: string
  value: string
  hint?: string
  hintTone?: 'success'
  ring?: number
  bar?: number
  delay: number
}) {
  return (
    <div
      className="animate-rise rounded-2xl bg-white p-4 text-center text-slate-900 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.45)]"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">{label}</p>
      {ring != null ? (
        <div className="mt-2.5 flex flex-col items-center gap-2">
          <div
            className="relative grid size-12 place-items-center rounded-full"
            style={{ background: `conic-gradient(#e91e8c 0 ${ring}%, #e5e7eb ${ring}% 100%)` }}
          >
            <div className="grid size-8 place-items-center rounded-full bg-white">
              <Users className="size-3.5 text-[var(--color-brand)]" strokeWidth={2.2} />
            </div>
          </div>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums">{value}</p>
        </div>
      ) : (
        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums">{value}</p>
      )}
      {hint ? (
        <p className={cn('mt-1 text-[11px] font-semibold', hintTone === 'success' ? 'text-emerald-600' : 'text-slate-500')}>
          {hint}
        </p>
      ) : null}
      {bar != null ? (
        <div className="mx-auto mt-2.5 h-1.5 w-full max-w-[5.5rem] overflow-hidden rounded-full bg-slate-100">
          <div
            className="animate-bar h-full rounded-full bg-cyan-500"
            style={{ width: `${Math.min(100, Math.max(8, bar))}%`, animationDelay: `${delay + 0.2}s` }}
          />
        </div>
      ) : null}
    </div>
  )
}
