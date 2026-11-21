import { useEffect, useState } from 'react'
import { useCrmStore, type TeamMember } from '@/stores/crm-store'
import { Field, FormDrawer, inputClass } from '@/shared/components/FormDrawer'

export const roles: TeamMember['role'][] = ['Admin', 'Manager', 'Sales Executive', 'Employee']
export const statuses: TeamMember['status'][] = ['Active', 'Away', 'Inactive']

const blank: Omit<TeamMember, 'id'> = { name: '', email: '', role: 'Sales Executive', phone: '', status: 'Active' }

/** `member` set = edit mode, otherwise create. */
export function MemberDrawer({ open, member, onClose }: { open: boolean; member?: TeamMember | null; onClose: () => void }) {
  const addMember = useCrmStore((s) => s.addMember)
  const updateMember = useCrmStore((s) => s.updateMember)
  const [f, setF] = useState(blank)
  const set = <K extends keyof typeof blank>(k: K, v: (typeof blank)[K]) => setF((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    if (open) setF(member ? { name: member.name, email: member.email, role: member.role, phone: member.phone, status: member.status } : blank)
  }, [open, member])

  const submit = () => {
    if (!f.name.trim() || !f.email.trim()) return
    const data = { ...f, name: f.name.trim(), email: f.email.trim() }
    if (member) updateMember(member.id, data)
    else addMember(data)
    onClose()
  }

  return (
    <FormDrawer
      open={open}
      title={member ? 'Edit member' : 'New member'}
      subtitle={member ? 'Update role, status, and contact details.' : 'Invite someone to the team.'}
      submitLabel={member ? 'Save changes' : 'Add member'}
      onClose={onClose}
      onSubmit={submit}
    >
      <Field label="Name *" className="sm:col-span-2">
        <input className={inputClass} required value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
      </Field>
      <Field label="Email *">
        <input className={inputClass} type="email" required value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="name@cezcon.ae" />
      </Field>
      <Field label="Phone">
        <input className={inputClass} type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+971…" />
      </Field>
      <Field label="Role">
        <select className={inputClass} value={f.role} onChange={(e) => set('role', e.target.value as TeamMember['role'])}>
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </Field>
      <Field label="Status">
        <select className={inputClass} value={f.status} onChange={(e) => set('status', e.target.value as TeamMember['status'])}>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
    </FormDrawer>
  )
}
