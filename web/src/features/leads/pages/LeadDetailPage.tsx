import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Globe2,
  ListTodo,
  MessageCircle,
  Pencil,
  Phone,
  Trash2,
  UserCheck,
  UserPlus,
  UserRound,
} from 'lucide-react'
import { CreateTaskDrawer } from '@/features/leads/components/CreateTaskDrawer'
import { LeadActivityPanel } from '@/features/leads/components/LeadActivityPanel'
import { RatingBadge, StatusBadge } from '@/features/leads/components/LeadBadges'
import { useCrmStore } from '@/stores/crm-store'
import { askConfirm, askPrompt, useUiStore } from '@/stores/ui-store'

export function LeadDetailPage() {
  const { leadId = '1' } = useParams()
  const navigate = useNavigate()
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false)
  const leads = useCrmStore((s) => s.leads)
  const convertLead = useCrmStore((s) => s.convertLead)
  const deleteLead = useCrmStore((s) => s.deleteLead)
  const updateLead = useCrmStore((s) => s.updateLead)
  const pushToast = useUiStore((s) => s.pushToast)
  const lead = leads.find((l) => l.id === leadId) ?? leads[0]
  const whatsappHref = `https://wa.me/${(lead?.businessMobile ?? '').replace(/\D/g, '')}`

  if (!lead) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Lead not found.{' '}
        <Link to="/leads" className="font-semibold text-[var(--color-brand)]">
          Back to leads
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/leads"
            className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Back to leads
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900">
              {lead.contactName}
            </h1>
            <RatingBadge rating={lead.rating} />
            <StatusBadge status={lead.status} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" strokeWidth={2} />
              {lead.businessMobile}
            </span>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700"
            >
              <MessageCircle className="size-3.5" strokeWidth={2} />
              WhatsApp
            </a>
            <span className="text-slate-300">·</span>
            <span>{lead.opportunity}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton icon={ListTodo} label="Add task" tone="neutral" onClick={() => setTaskDrawerOpen(true)} />
          <ActionButton
            icon={Pencil}
            label="Edit"
            tone="neutral"
            onClick={async () => {
              const next = await askPrompt({
                title: 'Edit comments',
                body: 'Update the lead comments / next-step note.',
                defaultValue: lead.comments,
                confirmLabel: 'Save',
              })
              if (next != null) {
                updateLead(lead.id, { comments: next })
                pushToast({ title: 'Lead updated', body: 'Comments saved.' })
              }
            }}
          />
          <ActionButton
            icon={UserPlus}
            label="Assign"
            tone="neutral"
            onClick={async () => {
              const next = await askPrompt({
                title: 'Assign lead',
                body: `Who should own “${lead.contactName}”?`,
                defaultValue: lead.owner,
                confirmLabel: 'Assign',
              })
              if (next) {
                updateLead(lead.id, { owner: next })
                pushToast({ title: 'Lead assigned', body: `${lead.contactName} → ${next}` })
              }
            }}
          />
          <ActionButton
            icon={UserCheck}
            label="Convert"
            tone="success"
            onClick={async () => {
              const ok = await askConfirm({
                title: 'Convert to customer',
                body: `Convert “${lead.contactName}” to a customer? A customer record and deal will be created.`,
                confirmLabel: 'Convert',
                tone: 'brand',
              })
              if (!ok) return
              const customerId = convertLead(lead.id)
              if (customerId) navigate(`/customers/${customerId}`)
            }}
          />
          <ActionButton
            icon={Trash2}
            label="Delete"
            tone="danger"
            onClick={async () => {
              const ok = await askConfirm({
                title: 'Delete lead',
                body: `Delete “${lead.contactName}”? This cannot be undone.`,
                confirmLabel: 'Delete',
                tone: 'danger',
              })
              if (!ok) return
              deleteLead(lead.id)
              navigate('/leads')
            }}
          />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,30%)]">
        <div className="min-h-0 min-w-0">
          <LeadActivityPanel
            leadId={lead.id}
            leadName={lead.contactName}
            onAddTask={() => setTaskDrawerOpen(true)}
          />
        </div>

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)]">
          <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50/40 px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">
                Lead details
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold tracking-wide text-cyan-700 uppercase ring-1 ring-cyan-100">
                <CalendarDays className="size-3" strokeWidth={2} />
                Profile
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/25">
                {lead.contactName
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{lead.contactName}</p>
                <p className="truncate text-xs text-slate-500">{lead.opportunity}</p>
              </div>
            </div>

            <dl className="space-y-3.5">
              <SideField icon={UserRound} label="Owner">
                {lead.owner}
              </SideField>
              <SideField icon={CalendarDays} label="Lead date">
                {lead.leadDate}
              </SideField>
              <SideField icon={Globe2} label="Source">
                {lead.source}
              </SideField>
              <SideField icon={Building2} label="Opportunity">
                {lead.opportunity}
              </SideField>
              <SideField icon={Phone} label="Mobile">
                <span className="inline-flex items-center gap-2">
                  <span className="truncate">{lead.businessMobile}</span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-6 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="size-3" strokeWidth={2} />
                  </a>
                </span>
              </SideField>
              <SideField label="Rating">
                <RatingBadge rating={lead.rating} />
              </SideField>
              <SideField label="Status">
                <StatusBadge status={lead.status} />
              </SideField>
              <SideField label="Created by">
                {lead.createdBy}
                <span className="mt-0.5 block text-xs font-normal text-slate-400">{lead.createdAt}</span>
              </SideField>
              <SideField label="Last activity">
                {lead.lastActivityBy}
                <span className="mt-0.5 block text-xs font-normal text-slate-400">{lead.lastActivityAt}</span>
              </SideField>
              <SideField label="Comments">
                <span className={lead.comments ? 'font-normal text-slate-600' : 'font-normal text-slate-400'}>
                  {lead.comments || 'No comments'}
                </span>
              </SideField>
            </dl>
          </div>
        </aside>
      </div>

      <CreateTaskDrawer
        open={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        leadName={lead.contactName}
        leadId={lead.id}
      />
    </div>
  )
}

function SideField({
  label,
  children,
  icon: Icon,
}: {
  label: string
  children: ReactNode
  icon?: typeof UserRound
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold tracking-[0.08em] text-slate-400 uppercase">{label}</dt>
      <dd className="mt-1 flex items-start gap-2 text-sm font-medium text-slate-900">
        {Icon ? <Icon className="mt-0.5 size-3.5 shrink-0 text-slate-400" strokeWidth={2} /> : null}
        <div className="min-w-0">{children}</div>
      </dd>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: typeof Pencil
  label: string
  tone: 'neutral' | 'success' | 'danger'
  onClick?: () => void
}) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      : tone === 'danger'
        ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm transition ${toneClass}`}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {label}
    </button>
  )
}
