import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  FileText,
  ListTodo,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react'
import { CreateTaskDrawer } from '@/features/leads/components/CreateTaskDrawer'
import { CustomerStatusBadge, CustomerTierBadge } from '@/features/customers/components/CustomerBadges'
import { demoCustomerActivities, demoCustomerDocuments } from '@/features/customers/data/demo-customers'
import { useCrmStore } from '@/stores/crm-store'
import { askConfirm, askPrompt, useUiStore } from '@/stores/ui-store'

type Tab = 'overview' | 'activity' | 'documents'

export function CustomerDetailPage() {
  const { customerId = 'c1' } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [taskOpen, setTaskOpen] = useState(false)
  const customers = useCrmStore((s) => s.customers)
  const deleteCustomer = useCrmStore((s) => s.deleteCustomer)
  const pushToast = useUiStore((s) => s.pushToast)
  const customer = customers.find((c) => c.id === customerId) ?? customers[0]
  const activities = customer ? (demoCustomerActivities[customer.id] ?? []) : []
  const documents = customer ? (demoCustomerDocuments[customer.id] ?? []) : []
  const whatsappHref = `https://wa.me/${(customer?.mobile ?? '').replace(/\D/g, '')}`

  if (!customer) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Customer not found.{' '}
        <Link to="/customers" className="font-semibold text-[var(--color-brand)]">
          Back to customers
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/customers"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Back to customers
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {customer.name}
            </h1>
            <CustomerTierBadge tier={customer.tier} />
            <CustomerStatusBadge status={customer.status} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5" strokeWidth={2} />
              {customer.company}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" strokeWidth={2} />
              {customer.mobile}
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
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton icon={ListTodo} label="Add task" onClick={() => setTaskOpen(true)} />
          <ActionButton
            icon={Pencil}
            label="Edit"
            onClick={async () => {
              const next = await askPrompt({
                title: 'Update deal value',
                body: `Set the deal value for “${customer.name}”.`,
                defaultValue: customer.dealValue,
                confirmLabel: 'Save',
              })
              if (next) {
                useCrmStore.getState().updateCustomer(customer.id, { dealValue: next })
                pushToast({ title: 'Customer updated', body: 'Deal value saved.' })
              }
            }}
          />
          <ActionButton
            icon={Trash2}
            label="Delete"
            tone="danger"
            onClick={async () => {
              const ok = await askConfirm({
                title: 'Delete customer',
                body: `Delete “${customer.name}”? This cannot be undone.`,
                confirmLabel: 'Delete',
                tone: 'danger',
              })
              if (!ok) return
              deleteCustomer(customer.id)
              navigate('/customers')
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {(
          [
            ['overview', 'Overview'],
            ['activity', `Activity (${activities.length})`],
            ['documents', `Documents (${documents.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition ${
              tab === id
                ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)] md:p-6">
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">
            Customer profile
          </h2>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Owner">{customer.owner}</Field>
            <Field label="Industry">{customer.industry}</Field>
            <Field label="Deal value">{customer.dealValue}</Field>
            <Field label="Converted">{customer.convertedAt}</Field>
            <Field label="Last activity">{customer.lastActivityAt}</Field>
            <Field label="City">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" strokeWidth={2} />
                {customer.city}
              </span>
            </Field>
            <Field label="Email">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" strokeWidth={2} />
                {customer.email}
              </span>
            </Field>
            {customer.sourceLeadId ? (
              <Field label="Source lead">
                <Link to={`/leads/${customer.sourceLeadId}`} className="font-medium text-[var(--color-brand)] hover:underline">
                  View original lead
                </Link>
              </Field>
            ) : null}
            <Field label="Notes">
              <span className="font-normal text-slate-600">{customer.notes || '—'}</span>
            </Field>
          </dl>
        </section>
      ) : null}

      {tab === 'activity' ? (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6">
          {activities.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
                  <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-white text-cyan-700 ring-1 ring-slate-200">
                    <ListTodo className="size-3.5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{a.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {a.by} · {a.at}
                    </p>
                  </div>
                  <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-500 uppercase ring-1 ring-slate-200">
                    {a.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {tab === 'documents' ? (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6">
          {documents.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No documents uploaded.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {documents.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
                    <FileText className="size-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-500">
                      {d.size} · {d.uploadedBy} · {d.uploadedAt}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <CreateTaskDrawer open={taskOpen} onClose={() => setTaskOpen(false)} leadName={customer.name} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{children}</dd>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  tone = 'neutral',
  onClick,
}: {
  icon: typeof Pencil
  label: string
  tone?: 'neutral' | 'danger'
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        tone === 'danger'
          ? 'border-rose-200 bg-white text-rose-600 hover:bg-rose-50'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {label}
    </button>
  )
}
