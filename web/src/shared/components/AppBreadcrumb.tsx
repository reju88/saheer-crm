import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCrmStore } from '@/stores/crm-store'

const labels: Record<string, string> = {
  '': 'Dashboard',
  leads: 'Leads',
  tasks: 'Tasks',
  customers: 'Customers',
  sales: 'Sales',
  reports: 'Reports',
  team: 'Team',
  settings: 'Settings',
  login: 'Sign In',
}

export function AppBreadcrumb() {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)
  const section = parts[0] ?? ''
  const sectionLabel = labels[section] ?? section

  const leads = useCrmStore((s) => s.leads)
  const customers = useCrmStore((s) => s.customers)
  const leadId = section === 'leads' ? parts[1] : undefined
  const lead = leadId ? leads.find((l) => l.id === leadId) : undefined
  const customerId = section === 'customers' ? parts[1] : undefined
  const customer = customerId ? customers.find((c) => c.id === customerId) : undefined
  const detailName = lead?.contactName ?? customer?.name
  const listPath = lead ? '/leads' : customer ? '/customers' : null

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Home"
      >
        <Home className="size-3.5" strokeWidth={2} />
      </Link>
      <ChevronRight className="size-3.5 shrink-0 text-slate-300" strokeWidth={2} />
      {detailName && listPath ? (
        <>
          <Link to={listPath} className="truncate font-medium text-slate-500 hover:text-slate-800">
            {sectionLabel}
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-slate-300" strokeWidth={2} />
          <span className="truncate font-medium text-slate-800">{detailName}</span>
        </>
      ) : (
        <span className="truncate font-medium text-slate-800">{sectionLabel || 'Dashboard'}</span>
      )}
    </nav>
  )
}
