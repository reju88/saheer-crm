import { useState, type ReactNode } from 'react'
import { KeyRound, Save, ShieldCheck } from 'lucide-react'
import { Field, inputClass } from '@/shared/components/FormDrawer'
import { useCrmStore, type AppSettings } from '@/stores/crm-store'
import { useUiStore } from '@/stores/ui-store'
import { cn } from '@/shared/utils/cn'

const timezones = ['Asia/Dubai', 'Asia/Kolkata', 'Asia/Riyadh', 'Europe/London', 'America/New_York']
const currencies = ['AED', 'USD', 'EUR', 'GBP', 'INR', 'SAR']
const toggles: { key: 'leadAutoAssign' | 'taskReminders' | 'emailNotifications'; label: string; hint: string }[] = [
  { key: 'leadAutoAssign', label: 'Lead auto-assign', hint: 'Distribute new leads across active sales executives.' },
  { key: 'taskReminders', label: 'Task reminders', hint: 'Remind assignees before tasks are due.' },
  { key: 'emailNotifications', label: 'Email notifications', hint: 'Send activity updates to team inboxes.' },
]

export function SettingsPage() {
  const settings = useCrmStore((s) => s.settings)
  const updateSettings = useCrmStore((s) => s.updateSettings)
  const pushToast = useUiStore((s) => s.pushToast)
  const [form, setForm] = useState<AppSettings>(settings)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  const changePassword = () => {
    if (pw.next !== pw.confirm) return pushToast({ title: 'Passwords do not match' })
    pushToast({ title: 'Password updated' })
    setPw({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Company preferences, notifications, and your account.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <form
          className="space-y-4 lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault()
            updateSettings(form)
          }}
        >
          <Card title="Company">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" className="sm:col-span-2">
                <input className={inputClass} required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </Field>
              <Field label="Timezone">
                <select className={inputClass} value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
                  {timezones.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Currency">
                <select className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  {currencies.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Card>

          <Card title="Automation & notifications">
            <div className="divide-y divide-slate-100">
              {toggles.map((t) => (
                <div key={t.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.label}</p>
                    <p className="text-xs text-slate-500">{t.hint}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form[t.key]}
                    aria-label={t.label}
                    onClick={() => setForm({ ...form, [t.key]: !form[t.key] })}
                    className={cn('relative h-6 w-11 shrink-0 rounded-full transition', form[t.key] ? 'bg-[var(--color-brand)]' : 'bg-slate-300')}
                  >
                    <span className={cn('absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition', form[t.key] && 'translate-x-5')} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(0,15,159,0.75)] hover:bg-[var(--color-brand-hover)]"
          >
            <Save className="size-4" /> Save settings
          </button>
        </form>

        <div className="space-y-4">
          <Card title="Profile">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-[var(--color-brand)] font-[family-name:var(--font-display)] text-lg font-semibold text-white">A</span>
              <div>
                <p className="font-semibold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">Starline</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-0.5 text-[11px] font-semibold text-pink-700 ring-1 ring-pink-100">
                <ShieldCheck className="size-3" /> Admin
              </span>
            </div>
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              changePassword()
            }}
          >
            <Card title="Change password">
              <div className="space-y-3">
                {(['current', 'next', 'confirm'] as const).map((k) => (
                  <Field key={k} label={k === 'current' ? 'Current password' : k === 'next' ? 'New password' : 'Confirm password'}>
                    <input className={inputClass} type="password" required minLength={k === 'current' ? 1 : 6} value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />
                  </Field>
                ))}
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                  <KeyRound className="size-4" /> Update password
                </button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}
