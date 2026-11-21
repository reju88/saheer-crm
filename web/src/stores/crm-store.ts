import { create } from 'zustand'
import { useUiStore } from '@/stores/ui-store'
import { demoCustomers } from '@/features/customers/data/demo-customers'
import type { Customer } from '@/features/customers/types/customer'
import { demoAttachments, demoLeads, demoNotes } from '@/features/leads/data/demo-leads'
import type { Lead, LeadAttachment, LeadNote, LeadRating, LeadStatus } from '@/features/leads/types/lead'
import { demoTasks } from '@/features/tasks/data/demo-tasks'
import type { Task, TaskBucket, TaskPriority, TaskStatus, TaskType } from '@/features/tasks/types/task'

export type DealStage = 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'

export type Deal = {
  id: string
  title: string
  customerName: string
  customerId?: string
  value: number
  currency: string
  stage: DealStage
  owner: string
  closeDate: string
  probability: number
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Sales Executive' | 'Employee'
  status: 'Active' | 'Away' | 'Inactive'
  phone: string
}

export type AppSettings = {
  companyName: string
  timezone: string
  currency: string
  leadAutoAssign: boolean
  taskReminders: boolean
  emailNotifications: boolean
}

export type AppNotification = {
  id: string
  title: string
  body: string
  at: string
  read: boolean
  href?: string
}

type CrmState = {
  leads: Lead[]
  tasks: Task[]
  customers: Customer[]
  deals: Deal[]
  team: TeamMember[]
  notes: Record<string, LeadNote[]>
  attachments: Record<string, LeadAttachment[]>
  settings: AppSettings
  notifications: AppNotification[]

  addLead: (input: Omit<Lead, 'id' | 'createdAt' | 'lastActivityAt' | 'lastActivityBy' | 'createdBy'> & { createdBy?: string }) => string
  updateLead: (id: string, patch: Partial<Lead>) => void
  deleteLead: (id: string) => void
  convertLead: (id: string) => string | null
  addNote: (leadId: string, body: string, author?: string) => string
  addAttachment: (leadId: string, name: string, size?: string) => string

  addTask: (input: Omit<Task, 'id'>) => string
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  assignTask: (id: string, assignee: string, note?: string) => void

  addCustomer: (input: Omit<Customer, 'id' | 'convertedAt' | 'lastActivityAt'> & { convertedAt?: string }) => string
  updateCustomer: (id: string, patch: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  addDeal: (input: Omit<Deal, 'id'>) => string
  updateDeal: (id: string, patch: Partial<Deal>) => void
  deleteDeal: (id: string) => void

  addMember: (input: Omit<TeamMember, 'id'>) => string
  updateMember: (id: string, patch: Partial<TeamMember>) => void
  deleteMember: (id: string) => void

  updateSettings: (patch: Partial<AppSettings>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  pushNotification: (n: Omit<AppNotification, 'id' | 'at' | 'read'>) => void
}

const seedDeals: Deal[] = [
  { id: 'd1', title: 'SEO retainer — Malapuram', customerName: 'Mr. Saheer Malapuram', customerId: 'c1', value: 48000, currency: 'AED', stage: 'Negotiation', owner: 'Pravesh', closeDate: '30 Nov 2026', probability: 70 },
  { id: 'd2', title: 'Brand campaign — Rahman Clinics', customerName: 'Aisha Rahman', customerId: 'c2', value: 120000, currency: 'AED', stage: 'Proposal', owner: 'Sara M.', closeDate: '15 Dec 2026', probability: 55 },
  { id: 'd3', title: 'Website redesign — Nair Interiors', customerName: 'Priya Nair', customerId: 'c4', value: 65000, currency: 'AED', stage: 'Won', owner: 'Fatima H.', closeDate: '10 Oct 2026', probability: 100 },
  { id: 'd4', title: 'Ads package — Cole Fitness', customerName: 'James Cole', customerId: 'c5', value: 9800, currency: 'AED', stage: 'Lost', owner: 'Pravesh', closeDate: '01 Aug 2026', probability: 0 },
  { id: 'd5', title: 'Events retainer — Haddad', customerName: 'Lina Haddad', customerId: 'c6', value: 54000, currency: 'AED', stage: 'Qualified', owner: 'Sara M.', closeDate: '20 Dec 2026', probability: 40 },
  { id: 'd6', title: 'Multi-brand suite — Mansour', customerName: 'Khalid Mansour', customerId: 'c12', value: 320000, currency: 'AED', stage: 'Negotiation', owner: 'Fatima H.', closeDate: '28 Dec 2026', probability: 65 },
  { id: 'd7', title: 'Social ads — Menon Foods', customerName: 'Ravi Menon', customerId: 'c7', value: 18200, currency: 'AED', stage: 'Proposal', owner: 'Daniel K.', closeDate: '05 Dec 2026', probability: 50 },
]

const seedTeam: TeamMember[] = [
  { id: 'm1', name: 'Pravesh', email: 'pravesh@cezcon.ae', role: 'Manager', status: 'Active', phone: '+971 50 100 2001' },
  { id: 'm2', name: 'Sara M.', email: 'sara@cezcon.ae', role: 'Sales Executive', status: 'Active', phone: '+971 50 100 2002' },
  { id: 'm3', name: 'Daniel K.', email: 'daniel@cezcon.ae', role: 'Sales Executive', status: 'Active', phone: '+971 50 100 2003' },
  { id: 'm4', name: 'Fatima H.', email: 'fatima@cezcon.ae', role: 'Sales Executive', status: 'Away', phone: '+971 50 100 2004' },
  { id: 'm5', name: 'Liam P.', email: 'liam@cezcon.ae', role: 'Employee', status: 'Active', phone: '+971 50 100 2005' },
  { id: 'm6', name: 'Admin', email: 'admin@cezcon.ae', role: 'Admin', status: 'Active', phone: '+971 50 100 2000' },
]

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

function nowLabel() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function toastNotify(
  get: () => CrmState,
  set: (partial: Partial<CrmState> | ((s: CrmState) => Partial<CrmState>)) => void,
  title: string,
  body: string,
  href?: string,
) {
  const n: AppNotification = { id: uid('n'), title, body, at: nowLabel(), read: false, href }
  set({ notifications: [n, ...get().notifications].slice(0, 40) })
  useUiStore.getState().pushToast({ title, body })
}

export const useCrmStore = create<CrmState>((set, get) => ({
  leads: demoLeads,
  tasks: demoTasks,
  customers: demoCustomers,
  deals: seedDeals,
  team: seedTeam,
  notes: { ...demoNotes },
  attachments: { ...demoAttachments },
  settings: {
    companyName: 'CEZCON',
    timezone: 'Asia/Dubai',
    currency: 'AED',
    leadAutoAssign: true,
    taskReminders: true,
    emailNotifications: true,
  },
  notifications: [
    { id: 'n0', title: 'Overdue tasks', body: 'You have overdue follow-ups to clear.', at: 'Today', read: false, href: '/tasks' },
    { id: 'n1', title: 'New lead assigned', body: 'Aisha Rahman was assigned to Sara M.', at: '1h ago', read: false, href: '/leads' },
  ],

  addLead: (input) => {
    const id = uid('lead')
    const stamp = nowLabel()
    const lead: Lead = {
      ...input,
      id,
      createdBy: input.createdBy ?? 'Admin',
      createdAt: stamp,
      lastActivityBy: input.createdBy ?? 'Admin',
      lastActivityAt: stamp,
    }
    set((s) => ({ leads: [lead, ...s.leads] }))
    toastNotify(get, set, 'Lead created', `${lead.contactName} added to pipeline.`, `/leads/${id}`)
    return id
  },

  updateLead: (id, patch) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === id ? { ...l, ...patch, lastActivityAt: nowLabel(), lastActivityBy: 'Admin' } : l,
      ),
    }))
  },

  deleteLead: (id) => {
    const lead = get().leads.find((l) => l.id === id)
    set((s) => ({ leads: s.leads.filter((l) => l.id !== id) }))
    if (lead) toastNotify(get, set, 'Lead deleted', `${lead.contactName} removed.`)
  },

  convertLead: (id) => {
    const lead = get().leads.find((l) => l.id === id)
    if (!lead) return null
    const customerId = uid('c')
    const customer: Customer = {
      id: customerId,
      name: lead.contactName,
      company: lead.opportunity,
      mobile: lead.businessMobile,
      email: '',
      owner: lead.owner,
      status: 'Active',
      tier: lead.rating === 'Hot' ? 'Premium' : 'Standard',
      industry: 'Other',
      dealValue: 'AED 0',
      convertedAt: nowLabel().split(',')[0] ?? nowLabel(),
      lastActivityAt: nowLabel().split(',')[0] ?? nowLabel(),
      sourceLeadId: lead.id,
      city: 'Dubai',
      notes: lead.comments,
    }
    set((s) => ({
      customers: [customer, ...s.customers],
      leads: s.leads.map((l) => (l.id === id ? { ...l, status: 'Converted' as LeadStatus } : l)),
      deals: [
        {
          id: uid('d'),
          title: `${lead.opportunity} — ${lead.contactName}`,
          customerName: lead.contactName,
          customerId,
          value: 0,
          currency: 'AED',
          stage: 'Qualified',
          owner: lead.owner,
          closeDate: '30 Dec 2026',
          probability: 40,
        },
        ...s.deals,
      ],
    }))
    toastNotify(get, set, 'Lead converted', `${lead.contactName} is now a customer.`, `/customers/${customerId}`)
    return customerId
  },

  addNote: (leadId, body, author = 'Admin') => {
    const id = uid('note')
    const note: LeadNote = { id, author, body: body.trim(), createdAt: nowLabel() }
    set((s) => ({
      notes: { ...s.notes, [leadId]: [note, ...(s.notes[leadId] ?? [])] },
      leads: s.leads.map((l) =>
        l.id === leadId ? { ...l, lastActivityAt: note.createdAt, lastActivityBy: author } : l,
      ),
    }))
    toastNotify(get, set, 'Note added', body.slice(0, 60), `/leads/${leadId}`)
    return id
  },

  addAttachment: (leadId, name, size = '—') => {
    const id = uid('file')
    const file: LeadAttachment = {
      id,
      name,
      size,
      uploadedBy: 'Admin',
      uploadedAt: nowLabel().split(',')[0] ?? nowLabel(),
    }
    set((s) => ({
      attachments: { ...s.attachments, [leadId]: [file, ...(s.attachments[leadId] ?? [])] },
    }))
    toastNotify(get, set, 'File attached', name, `/leads/${leadId}`)
    return id
  },

  addTask: (input) => {
    const id = uid('t')
    set((s) => ({ tasks: [{ ...input, id }, ...s.tasks] }))
    toastNotify(get, set, 'Task created', input.details, '/tasks')
    return id
  },

  updateTask: (id, patch) => {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
    toastNotify(get, set, 'Task updated', 'Changes saved.', '/tasks')
  },

  deleteTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    toastNotify(get, set, 'Task deleted', 'Task removed from the list.')
  },

  assignTask: (id, assignee, note) => {
    const task = get().tasks.find((t) => t.id === id)
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, assignee } : t)),
    }))
    if (task) {
      toastNotify(
        get,
        set,
        'Task assigned',
        `${task.details.slice(0, 48)} → ${assignee}${note ? ` · ${note}` : ''}`,
        '/tasks',
      )
    }
  },

  addCustomer: (input) => {
    const id = uid('c')
    const day = nowLabel().split(',')[0] ?? nowLabel()
    const customer: Customer = {
      ...input,
      id,
      convertedAt: input.convertedAt ?? day,
      lastActivityAt: day,
    }
    set((s) => ({ customers: [customer, ...s.customers] }))
    toastNotify(get, set, 'Customer created', `${customer.name} added.`, `/customers/${id}`)
    return id
  },

  updateCustomer: (id, patch) => {
    set((s) => ({ customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  },

  deleteCustomer: (id) => {
    const c = get().customers.find((x) => x.id === id)
    set((s) => ({ customers: s.customers.filter((x) => x.id !== id) }))
    if (c) toastNotify(get, set, 'Customer deleted', `${c.name} removed.`)
  },

  addDeal: (input) => {
    const id = uid('d')
    set((s) => ({ deals: [{ ...input, id }, ...s.deals] }))
    toastNotify(get, set, 'Deal created', input.title, '/sales')
    return id
  },

  updateDeal: (id, patch) => {
    set((s) => ({ deals: s.deals.map((d) => (d.id === id ? { ...d, ...patch } : d)) }))
    if (patch.stage) {
      const d = get().deals.find((x) => x.id === id)
      if (d) toastNotify(get, set, 'Deal updated', `${d.title} → ${patch.stage}`, '/sales')
    }
  },

  deleteDeal: (id) => {
    set((s) => ({ deals: s.deals.filter((d) => d.id !== id) }))
  },

  addMember: (input) => {
    const id = uid('m')
    set((s) => ({ team: [...s.team, { ...input, id }] }))
    toastNotify(get, set, 'Team member added', `${input.name} joined the team.`, '/team')
    return id
  },

  updateMember: (id, patch) => {
    set((s) => ({ team: s.team.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  },

  deleteMember: (id) => {
    set((s) => ({ team: s.team.filter((m) => m.id !== id) }))
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }))
    toastNotify(get, set, 'Settings saved', 'Company preferences updated.', '/settings')
  },

  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  },

  markAllNotificationsRead: () => {
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }))
  },

  pushNotification: (n) => {
    toastNotify(get, set, n.title, n.body, n.href)
  },
}))

export type { LeadRating, LeadStatus, TaskBucket, TaskPriority, TaskStatus, TaskType }
