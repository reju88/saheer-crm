import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  ClipboardList,
  FileChartColumn,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Target,
  TrendingUp,
  Users,
  UserRound,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import { AppBreadcrumb } from '@/shared/components/AppBreadcrumb'
import { cn } from '@/shared/utils/cn'
import { useAuthStore } from '@/stores/auth-store'
import { useCrmStore } from '@/stores/crm-store'
import { useUiStore } from '@/stores/ui-store'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Target },
  { to: '/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/customers', label: 'Customers', icon: UserRound },
  { to: '/sales', label: 'Sales', icon: TrendingUp },
  { to: '/reports', label: 'Reports', icon: FileChartColumn },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function AppLayout() {
  const navigate = useNavigate()
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const notificationsOpen = useUiStore((s) => s.notificationsOpen)
  const setNotificationsOpen = useUiStore((s) => s.setNotificationsOpen)
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)
  const settings = useCrmStore((s) => s.settings)
  const notifications = useCrmStore((s) => s.notifications)
  const markNotificationRead = useCrmStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useCrmStore((s) => s.markAllNotificationsRead)
  const leads = useCrmStore((s) => s.leads)
  const customers = useCrmStore((s) => s.customers)
  const tasks = useCrmStore((s) => s.tasks)

  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const sidebarWidth = sidebarCollapsed ? 64 : 224
  const unread = notifications.filter((n) => !n.read).length
  const displayName = user?.name ?? 'Admin'
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const leadHits = leads
      .filter((l) => l.contactName.toLowerCase().includes(q) || l.businessMobile.includes(q))
      .slice(0, 4)
      .map((l) => ({ id: l.id, label: l.contactName, meta: `Lead · ${l.status}`, href: `/leads/${l.id}` }))
    const customerHits = customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.mobile.includes(q))
      .slice(0, 4)
      .map((c) => ({ id: c.id, label: c.name, meta: `Customer · ${c.company}`, href: `/customers/${c.id}` }))
    const taskHits = tasks
      .filter((t) => t.details.toLowerCase().includes(q) || t.underName.toLowerCase().includes(q))
      .slice(0, 3)
      .map((t) => ({ id: t.id, label: t.details, meta: `Task · ${t.assignee}`, href: '/tasks' }))
    return [...leadHits, ...customerHits, ...taskHits].slice(0, 10)
  }, [query, leads, customers, tasks])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false)
      if (!notifRef.current?.contains(e.target as Node)) setNotificationsOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [setNotificationsOpen])

  return (
    <div className="h-dvh overflow-hidden bg-[var(--color-bg)]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/5 bg-[var(--color-sidebar)] text-slate-100 transition-[width] duration-200',
          sidebarCollapsed ? 'w-16' : 'w-56',
        )}
      >
        <div className={cn('flex h-14 items-center border-b border-white/10', sidebarCollapsed ? 'justify-center px-2' : 'px-3')}>
          {sidebarCollapsed ? (
            <img src={logo} alt="CEZCON" className="h-7 w-7 rounded-md object-cover object-left" />
          ) : (
            <img src={logo} alt="CEZCON CRM" className="h-7 w-auto max-w-[168px] object-contain object-left" />
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                title={item.label}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                    sidebarCollapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-[var(--color-brand)] text-white shadow-sm shadow-pink-900/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                <Icon className="size-[18px] shrink-0 opacity-90" strokeWidth={1.85} />
                {!sidebarCollapsed ? <span className="truncate">{item.label}</span> : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-2">
          <button
            type="button"
            onClick={() => {
              clearSession()
              navigate('/login')
            }}
            title="Sign out"
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white',
              sidebarCollapsed && 'justify-center px-0',
            )}
          >
            <LogOut className="size-[18px] shrink-0" strokeWidth={1.85} />
            {!sidebarCollapsed ? <span>Sign out</span> : null}
          </button>
        </div>
      </aside>

      <div className="flex h-dvh flex-col transition-[padding] duration-200" style={{ paddingLeft: sidebarWidth }}>
        <header className="z-20 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md">
          <button
            type="button"
            onClick={toggleSidebar}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-4" strokeWidth={1.9} />
            ) : (
              <PanelLeftClose className="size-4" strokeWidth={1.9} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <AppBreadcrumb />
          </div>

          <div ref={searchRef} className="relative hidden w-full max-w-xs lg:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" strokeWidth={1.9} />
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm outline-none transition focus:border-[var(--color-accent)] focus:bg-white"
              placeholder="Search leads, customers…"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchOpen && results.length > 0 ? (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <ul className="max-h-72 overflow-auto py-1">
                  {results.map((r) => (
                    <li key={`${r.href}-${r.id}`}>
                      <button
                        type="button"
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-sky-50"
                        onClick={() => {
                          navigate(r.href)
                          setQuery('')
                          setSearchOpen(false)
                        }}
                      >
                        <span className="truncate text-sm font-medium text-slate-900">{r.label}</span>
                        <span className="text-[11px] text-slate-500">{r.meta}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell className="size-4" strokeWidth={1.9} />
              {unread > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brand)] px-1 text-[9px] leading-none font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-[var(--color-brand)] uppercase"
                    onClick={() => markAllNotificationsRead()}
                  >
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <li className="px-3 py-8 text-center text-sm text-slate-400">You're all caught up</li>
                  ) : (
                    notifications.map((n) => (
                      <li key={n.id} className={cn('border-b border-slate-50', !n.read && 'bg-cyan-50/40')}>
                        <button
                          type="button"
                          className="w-full px-3 py-2.5 text-left hover:bg-slate-50"
                          onClick={() => {
                            markNotificationRead(n.id)
                            setNotificationsOpen(false)
                            if (n.href) navigate(n.href)
                          }}
                        >
                          <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{n.at}</p>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}
          </div>

          <Link to="/settings" className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-800">{displayName}</p>
              <p className="text-[11px] text-slate-400">{settings.companyName}</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-[var(--color-brand)]/10 text-xs font-bold text-[var(--color-brand)]">
              {initials}
            </div>
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden p-4 md:p-6">
          <div className="h-full min-h-0 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
