import { useEffect, type ReactNode } from 'react'
import {
  BadgeCheck,
  Building2,
  CircleDot,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserPlus,
  UserRound,
  Wallet,
  X,
} from 'lucide-react'
import type { CustomerStatus, CustomerTier } from '@/features/customers/types/customer'
import { useCrmStore } from '@/stores/crm-store'

type CreateCustomerDrawerProps = {
  open: boolean
  onClose: () => void
}

export function CreateCustomerDrawer({ open, onClose }: CreateCustomerDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer overlay"
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-xl flex-col overflow-hidden bg-[#f7f9fc] shadow-[-24px_0_60px_-28px_rgba(10,22,40,0.55)] transition-transform duration-300 sm:max-w-2xl ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="relative overflow-hidden border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-cyan-400" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                <UserPlus className="size-5" strokeWidth={2} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
                    New customer
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cyan-700 uppercase ring-1 ring-cyan-100">
                    <Sparkles className="size-3" strokeWidth={2} />
                    Quick create
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">Add a converted account with ownership and deal value.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            useCrmStore.getState().addCustomer({
              name: String(fd.get('name') ?? ''),
              company: String(fd.get('company') ?? ''),
              mobile: String(fd.get('mobile') ?? ''),
              email: String(fd.get('email') ?? ''),
              owner: String(fd.get('owner') ?? 'Pravesh'),
              status: String(fd.get('status') ?? 'Active') as CustomerStatus,
              tier: String(fd.get('tier') ?? 'Standard') as CustomerTier,
              industry: String(fd.get('industry') ?? 'Other'),
              dealValue: String(fd.get('dealValue') ?? 'AED 0'),
              city: String(fd.get('city') ?? 'Dubai'),
              notes: String(fd.get('notes') ?? ''),
            })
            onClose()
          }}
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
            <Section title="Contact" hint="Primary person and company.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact name" required className="sm:col-span-2">
                  <IconInput icon={UserRound}>
                    <input className={controlClass} name="name" placeholder="Full name" required />
                  </IconInput>
                </Field>
                <Field label="Company" required className="sm:col-span-2">
                  <IconInput icon={Building2}>
                    <input className={controlClass} name="company" placeholder="Company name" required />
                  </IconInput>
                </Field>
                <Field label="Mobile" required>
                  <IconInput icon={Phone}>
                    <input className={controlClass} name="mobile" type="tel" placeholder="+971…" required />
                  </IconInput>
                </Field>
                <Field label="Email">
                  <IconInput icon={Mail}>
                    <input className={controlClass} name="email" type="email" placeholder="name@company.com" />
                  </IconInput>
                </Field>
                <Field label="City" className="sm:col-span-2">
                  <IconInput icon={MapPin}>
                    <input className={controlClass} name="city" placeholder="Dubai" />
                  </IconInput>
                </Field>
              </div>
            </Section>

            <Section title="Account" hint="Owner, status, and commercial value.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Owner" required>
                  <IconInput icon={UserRound}>
                    <select className={controlClass} name="owner" defaultValue="Pravesh" required>
                      <option>Pravesh</option>
                      <option>Sara M.</option>
                      <option>Daniel K.</option>
                      <option>Fatima H.</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Status" required>
                  <IconInput icon={CircleDot}>
                    <select className={controlClass} name="status" defaultValue="Active" required>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>At risk</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Tier">
                  <IconInput icon={BadgeCheck}>
                    <select className={controlClass} name="tier" defaultValue="Standard">
                      <option>Standard</option>
                      <option>Premium</option>
                      <option>Enterprise</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Industry">
                  <IconInput icon={Building2}>
                    <select className={controlClass} name="industry" defaultValue="Retail">
                      <option>Retail</option>
                      <option>Healthcare</option>
                      <option>Logistics</option>
                      <option>Design</option>
                      <option>F&B</option>
                      <option>Real Estate</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Deal value" className="sm:col-span-2">
                  <IconInput icon={Wallet}>
                    <input className={controlClass} name="dealValue" placeholder="AED 25,000" />
                  </IconInput>
                </Field>
              </div>
            </Section>

            <Section title="Notes" hint="Optional context for the account team.">
              <Field label="Notes">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1 transition focus-within:border-[var(--color-accent)] focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10">
                  <textarea
                    className={`${controlClass} min-h-24 resize-y py-2.5`}
                    name="notes"
                    placeholder="Contract terms, preferences…"
                  />
                </div>
              </Field>
            </Section>
          </div>

          <div className="flex shrink-0 gap-3 border-t border-slate-200/80 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(0,15,159,0.75)] transition hover:bg-[var(--color-brand-hover)]"
            >
              <UserPlus className="size-4" strokeWidth={2.2} />
              Save customer
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}

const controlClass =
  'w-full border-0 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400'

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <label className={`block space-y-1.5 ${className ?? ''}`}>
      <span className="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">
        {label}
        {required ? <span className="text-[var(--color-brand)]"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

function IconInput({ icon: Icon, children }: { icon: typeof UserRound; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-[var(--color-accent)] focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10">
      <Icon className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
      {children}
    </div>
  )
}
