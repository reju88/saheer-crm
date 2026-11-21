import { useEffect, useState } from 'react'
import { useCrmStore, type DealStage } from '@/stores/crm-store'
import { Field, FormDrawer, inputClass } from '@/shared/components/FormDrawer'

export const dealStages: DealStage[] = ['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']

const stageProb: Record<DealStage, number> = { Qualified: 40, Proposal: 50, Negotiation: 65, Won: 100, Lost: 0 }

function toLabel(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const blank = { title: '', customerName: '', value: '', stage: 'Qualified' as DealStage, owner: '', closeDate: '', probability: '40' }

export function DealDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const team = useCrmStore((s) => s.team)
  const currency = useCrmStore((s) => s.settings.currency)
  const addDeal = useCrmStore((s) => s.addDeal)
  const [f, setF] = useState(blank)
  const set = (k: keyof typeof blank, v: string) => setF((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    if (open) setF({ ...blank, owner: team[0]?.name ?? '' })
  }, [open, team])

  const submit = () => {
    if (!f.title.trim() || !f.customerName.trim() || !f.closeDate) return
    addDeal({
      title: f.title.trim(),
      customerName: f.customerName.trim(),
      value: Math.max(0, Number(f.value) || 0),
      currency,
      stage: f.stage,
      owner: f.owner,
      closeDate: toLabel(f.closeDate),
      probability: Math.min(100, Math.max(0, Number(f.probability) || 0)),
    })
    onClose()
  }

  return (
    <FormDrawer open={open} title="New deal" subtitle="Add an opportunity to the pipeline." submitLabel="Create deal" onClose={onClose} onSubmit={submit}>
      <Field label="Title *" className="sm:col-span-2">
        <input className={inputClass} required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="SEO retainer — Acme" />
      </Field>
      <Field label="Customer name *" className="sm:col-span-2">
        <input className={inputClass} required value={f.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="Customer or company" />
      </Field>
      <Field label={`Value (${currency})`}>
        <input className={inputClass} type="number" min={0} value={f.value} onChange={(e) => set('value', e.target.value)} placeholder="25000" />
      </Field>
      <Field label="Stage">
        <select
          className={inputClass}
          value={f.stage}
          onChange={(e) => setF((p) => ({ ...p, stage: e.target.value as DealStage, probability: String(stageProb[e.target.value as DealStage]) }))}
        >
          {dealStages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="Owner">
        <select className={inputClass} value={f.owner} onChange={(e) => set('owner', e.target.value)}>
          {team.map((m) => (
            <option key={m.id}>{m.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Close date *">
        <input className={inputClass} type="date" required value={f.closeDate} onChange={(e) => set('closeDate', e.target.value)} />
      </Field>
      <Field label="Probability (%)" className="sm:col-span-2">
        <input className={inputClass} type="number" min={0} max={100} value={f.probability} onChange={(e) => set('probability', e.target.value)} />
      </Field>
    </FormDrawer>
  )
}

export { stageProb }
