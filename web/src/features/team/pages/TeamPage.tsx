import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Pencil, Plus, Trash2, UserCheck, UserMinus, UserX, Users } from 'lucide-react'
import { MemberDrawer } from '@/features/team/components/MemberDrawer'
import { useCrmStore, type TeamMember } from '@/stores/crm-store'
import { askConfirm } from '@/stores/ui-store'
import { cn } from '@/shared/utils/cn'

const statusTone: Record<TeamMember['status'], string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Away: 'bg-amber-50 text-amber-700 ring-amber-100',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
}
const roleTone: Record<TeamMember['role'], string> = {
  Admin: 'bg-pink-50 text-pink-700 ring-pink-100',
  Manager: 'bg-violet-50 text-violet-700 ring-violet-100',
  'Sales Executive': 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  Employee: 'bg-slate-100 text-slate-600 ring-slate-200',
}
const badge = 'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1'

export function TeamPage() {
  const navigate = useNavigate()
  const team = useCrmStore((s) => s.team)
  const leads = useCrmStore((s) => s.leads)
  const tasks = useCrmStore((s) => s.tasks)
  const deleteMember = useCrmStore((s) => s.deleteMember)
  const [drawer, setDrawer] = useState<{ open: boolean; member: TeamMember | null }>({ open: false, member: null })

  const by = (s: TeamMember['status']) => team.filter((m) => m.status === s).length
  const tiles = [
    { label: 'Total', value: team.length, icon: Users, tone: 'bg-slate-900' },
    { label: 'Active', value: by('Active'), icon: UserCheck, tone: 'bg-emerald-500' },
    { label: 'Away', value: by('Away'), icon: UserMinus, tone: 'bg-amber-500' },
    { label: 'Inactive', value: by('Inactive'), icon: UserX, tone: 'bg-slate-400' },
  ]

  const remove = async (m: TeamMember) => {
    const ok = await askConfirm({
      title: 'Remove team member',
      body: `Remove “${m.name}” from the team? This cannot be undone.`,
      confirmLabel: 'Remove',
      tone: 'danger',
    })
    if (ok) deleteMember(m.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900">Team</h1>
          <p className="mt-1 text-sm text-slate-500">Employees, roles, assignment, and workload.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Users className="size-4" /> Assign leads
          </button>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ClipboardList className="size-4" /> Assign tasks
          </button>
          <button
            type="button"
            onClick={() => setDrawer({ open: true, member: null })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(233,30,140,0.7)] hover:bg-[var(--color-brand-hover)]"
          >
            <Plus className="size-4" strokeWidth={2.2} /> New member
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <span className={cn('grid size-10 place-items-center rounded-xl text-white', t.tone)}>
              <t.icon className="size-5" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{t.label}</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">{t.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3 text-center">Leads</th>
                <th className="px-4 py-3 text-center">Tasks</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {team.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                    No team members yet.
                  </td>
                </tr>
              )}
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-full bg-cyan-50 text-[11px] font-bold text-cyan-700">
                        {m.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn(badge, roleTone[m.role])}>{m.role}</span></td>
                  <td className="px-4 py-3"><span className={cn(badge, statusTone[m.status])}>{m.status}</span></td>
                  <td className="px-4 py-3 text-slate-600">{m.phone || '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-800">{leads.filter((l) => l.owner === m.name).length}</td>
                  <td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-800">{tasks.filter((t) => t.assignee === m.name).length}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title="Edit"
                        aria-label={`Edit ${m.name}`}
                        onClick={() => setDrawer({ open: true, member: m })}
                        className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        aria-label={`Delete ${m.name}`}
                        onClick={() => remove(m)}
                        className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MemberDrawer open={drawer.open} member={drawer.member} onClose={() => setDrawer((d) => ({ ...d, open: false }))} />
    </div>
  )
}
