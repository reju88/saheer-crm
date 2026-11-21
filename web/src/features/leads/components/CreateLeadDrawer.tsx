import { useEffect, type ReactNode } from 'react'
import {
  Building2,
  CalendarDays,
  CircleDot,
  Flame,
  Globe2,
  Phone,
  Sparkles,
  UserRound,
  UserPlus,
  X,
} from 'lucide-react'
import type { LeadRating, LeadStatus } from '@/features/leads/types/lead'
import { useCrmStore } from '@/stores/crm-store'

type CreateLeadDrawerProps = {
  open: boolean
  onClose: () => void
}

export function CreateLeadDrawer({ open, onClose }: CreateLeadDrawerProps) {
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
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-fuchsia-600 text-white shadow-lg shadow-pink-500/30">
                <UserPlus className="size-5" strokeWidth={2} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
                    New lead
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cyan-700 uppercase ring-1 ring-cyan-100">
                    <Sparkles className="size-3" strokeWidth={2} />
                    Quick create
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Capture contact, ownership, and qualification in one place.
                </p>
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

          <ol className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
            <StepBadge n={1} label="Contact" active />
            <StepBadge n={2} label="Assign" />
            <StepBadge n={3} label="Qualify" />
          </ol>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            useCrmStore.getState().addLead({
              contactName: String(fd.get('contactName') ?? ''),
              businessMobile: String(fd.get('mobile') ?? ''),
              leadDate: String(fd.get('leadDate') ?? ''),
              owner: String(fd.get('owner') ?? 'Pravesh'),
              source: String(fd.get('source') ?? 'Website'),
              opportunity: String(fd.get('opportunity') ?? ''),
              rating: String(fd.get('rating') ?? 'Warm') as LeadRating,
              status: String(fd.get('status') ?? 'Open') as LeadStatus,
              comments: String(fd.get('comments') ?? ''),
            })
            onClose()
          }}
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-2 rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 py-2.5 text-xs text-cyan-800">
              <Sparkles className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
              <p>
                Saving creates the lead and assigns it to the selected owner. You can add tasks and notes from the
                lead detail page next.
              </p>
            </div>

            <Section title="Contact details" hint="Who should your team reach out to?">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact name" required className="sm:col-span-2">
                  <IconInput icon={UserRound}>
                    <input className={controlClass} name="contactName" placeholder="Full name" required />
                  </IconInput>
                </Field>
                <Field label="Business mobile" required className="sm:col-span-2">
                  <IconInput icon={Phone}>
                    <input className={controlClass} name="mobile" placeholder="+971…" type="tel" required />
                  </IconInput>
                </Field>
              </div>
            </Section>

            <Section title="Ownership" hint="When the lead arrived and who owns it.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Lead date" required>
                  <IconInput icon={CalendarDays}>
                    <input className={controlClass} name="leadDate" type="date" required />
                  </IconInput>
                </Field>
                <Field label="Lead owner" required>
                  <IconInput icon={UserRound}>
                    <select className={controlClass} name="owner" defaultValue="Pravesh" required>
                      <option>Pravesh</option>
                      <option>Sara M.</option>
                      <option>Daniel K.</option>
                      <option>Fatima H.</option>
                    </select>
                  </IconInput>
                </Field>
              </div>
            </Section>

            <Section title="Opportunity & source" hint="What they need and where they came from.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business opportunity" required>
                  <IconInput icon={Building2}>
                    <select className={controlClass} name="opportunity" defaultValue="Digital Marketing" required>
                      <option>Digital Marketing</option>
                      <option>SEO Package</option>
                      <option>Brand Campaign</option>
                      <option>Website Redesign</option>
                      <option>Social Ads</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Lead source" required>
                  <IconInput icon={Globe2}>
                    <select className={controlClass} name="source" defaultValue="Website" required>
                      <option>Website</option>
                      <option>Social Media</option>
                      <option>Referral</option>
                      <option>Campaign</option>
                      <option>Walk-in</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Rating" required>
                  <IconInput icon={Flame}>
                    <select className={controlClass} name="rating" defaultValue="Warm" required>
                      <option>Hot</option>
                      <option>Warm</option>
                      <option>Cold</option>
                    </select>
                  </IconInput>
                </Field>
                <Field label="Status" required>
                  <IconInput icon={CircleDot}>
                    <select className={controlClass} name="status" defaultValue="Open" required>
                      <option>Open</option>
                      <option>Pending</option>
                      <option>Follow-up</option>
                      <option>Converted</option>
                      <option>Lost</option>
                    </select>
                  </IconInput>
                </Field>
              </div>
            </Section>

            <Section title="Notes" hint="Optional context for the next follow-up.">
              <Field label="Comments">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1 transition focus-within:border-[var(--color-accent)] focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10">
                  <textarea
                    className={`${controlClass} min-h-24 resize-y py-2.5`}
                    name="comments"
                    placeholder="Call outcome, budget, timeline…"
                  />
                </div>
              </Field>
            </Section>
          </div>

          <div className="shrink-0 border-t border-slate-200/80 bg-white px-6 py-4">
            <div className="flex gap-3">
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
                Save lead
              </button>
            </div>
          </div>
        </form>
      </aside>
    </>
  )
}

const controlClass =
  'w-full border-0 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400'

function StepBadge({ n, label, active }: { n: number; label: string; active?: boolean }) {
  return (
    <li
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ${
        active
          ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)] ring-[var(--color-brand)]/20'
          : 'bg-slate-50 text-slate-500 ring-slate-200'
      }`}
    >
      <span
        className={`grid size-4 place-items-center rounded-full text-[10px] font-bold ${
          active ? 'bg-[var(--color-brand)] text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {n}
      </span>
      {label}
    </li>
  )
}

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
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

function IconInput({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-[var(--color-accent)] focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10">
      <Icon className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
      {children}
    </div>
  )
}
