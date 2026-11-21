import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardList,
  Clock3,
  Flag,
  Info,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { CreateTaskDrawer } from '@/features/leads/components/CreateTaskDrawer'
import { AssignTaskDrawer } from '@/features/tasks/components/AssignTaskDrawer'
import { PriorityBadge, TaskStatusBadge } from '@/features/tasks/components/TaskBadges'
import type { Task, TaskBucket, TaskType } from '@/features/tasks/types/task'
import { Pagination } from '@/shared/components/Pagination'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'
import { askConfirm } from '@/stores/ui-store'

const PAGE_SIZE_OPTIONS = [5, 10, 15]

const buckets: {
  key: TaskBucket
  label: string
  tone: string
  icon: LucideIcon
}[] = [
  { key: 'today', label: 'Today', tone: 'orange', icon: CalendarDays },
  { key: 'pending', label: 'Pending', tone: 'amber', icon: Clock3 },
  { key: 'in_progress', label: 'In Progress', tone: 'emerald', icon: CircleDot },
  { key: 'overdue', label: 'Overdue', tone: 'rose', icon: AlertTriangle },
  { key: 'upcoming', label: 'Upcoming', tone: 'sky', icon: Flag },
  { key: 'completed', label: 'Completed', tone: 'teal', icon: CheckCircle2 },
  { key: 'meeting', label: 'Meeting', tone: 'brand', icon: Users },
]

const typeTabs: Array<'all' | TaskType> = ['all', 'Followup', 'Call', 'Meeting']

export function TasksPage() {
  const [bucket, setBucket] = useState<TaskBucket>('today')
  const [typeTab, setTypeTab] = useState<'all' | TaskType>('all')
  const [query, setQuery] = useState('')
  const [assignee, setAssignee] = useState('all')
  const [taskType, setTaskType] = useState('all')
  const [createdBy, setCreatedBy] = useState('all')
  const [sortBy, setSortBy] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)

  const demoTasks = useCrmStore((s) => s.tasks)
  const deleteTask = useCrmStore((s) => s.deleteTask)

  const assignees = useMemo(() => [...new Set(demoTasks.map((t) => t.assignee))], [demoTasks])
  const creators = useMemo(() => [...new Set(demoTasks.map((t) => t.createdBy))], [demoTasks])

  const counts = useMemo(() => {
    const map = Object.fromEntries(buckets.map((b) => [b.key, 0])) as Record<TaskBucket, number>
    for (const t of demoTasks) map[t.bucket] += 1
    map.pending = demoTasks.filter((t) => t.status === 'Pending' || t.bucket === 'pending').length
    map.in_progress = demoTasks.filter((t) => t.status === 'In Progress' || t.bucket === 'in_progress').length
    map.completed = demoTasks.filter((t) => t.status === 'Completed' || t.bucket === 'completed').length
    map.meeting = demoTasks.filter((t) => t.type === 'Meeting' || t.bucket === 'meeting').length
    return map
  }, [demoTasks])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return demoTasks.filter((task) => {
      if (bucket === 'today' && task.bucket !== 'today') return false
      if (bucket === 'overdue' && task.bucket !== 'overdue') return false
      if (bucket === 'upcoming' && task.bucket !== 'upcoming') return false
      if (bucket === 'pending' && task.status !== 'Pending' && task.bucket !== 'pending') return false
      if (bucket === 'in_progress' && task.status !== 'In Progress' && task.bucket !== 'in_progress') return false
      if (bucket === 'completed' && task.status !== 'Completed' && task.bucket !== 'completed') return false
      if (bucket === 'meeting' && task.type !== 'Meeting' && task.bucket !== 'meeting') return false
      if (typeTab !== 'all' && task.type !== typeTab) return false
      if (assignee !== 'all' && task.assignee !== assignee) return false
      if (taskType !== 'all' && task.type !== taskType) return false
      if (createdBy !== 'all' && task.createdBy !== createdBy) return false
      if (sortBy === 'high' && task.priority !== 'High') return false
      if (!q) return true
      return (
        task.details.toLowerCase().includes(q) ||
        task.underName.toLowerCase().includes(q) ||
        task.assignee.toLowerCase().includes(q) ||
        task.type.toLowerCase().includes(q)
      )
    })
  }, [demoTasks, bucket, typeTab, query, assignee, taskType, createdBy, sortBy])

  const typeCounts = useMemo(() => {
    const base = filtered
    return {
      Followup: base.filter((t) => t.type === 'Followup').length,
      Call: base.filter((t) => t.type === 'Call').length,
      Meeting: base.filter((t) => t.type === 'Meeting').length,
    }
  }, [filtered])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [bucket, typeTab, query, assignee, taskType, createdBy, sortBy, pageSize])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const title =
    bucket === 'today'
      ? 'Tasks today'
      : bucket === 'in_progress'
        ? 'Tasks in progress'
        : `${buckets.find((b) => b.key === bucket)?.label ?? 'Tasks'}`

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500">Track follow-ups, calls, and meetings across your pipeline.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAssignOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Users className="size-4" strokeWidth={2} />
            Assign task
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingTask(null)
              setDrawerOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(233,30,140,0.7)] hover:bg-[var(--color-brand-hover)]"
          >
            <Plus className="size-4" strokeWidth={2.2} />
            Task
          </button>
        </div>
      </div>

      <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {buckets.map((b) => (
          <BucketChip
            key={b.key}
            active={bucket === b.key}
            label={b.label}
            count={counts[b.key]}
            icon={b.icon}
            tone={b.tone}
            onClick={() => setBucket(b.key)}
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)]">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50/40 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-cyan-600 text-white shadow-sm shadow-cyan-600/30">
                  <SlidersHorizontal className="size-3.5" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Filters</p>
                  <p className="text-[10px] text-slate-500">Refine the task list</p>
                </div>
              </div>
              {sortBy !== 'all' || assignee !== 'all' || taskType !== 'all' || createdBy !== 'all' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('all')
                    setAssignee('all')
                    setTaskType('all')
                    setCreatedBy('all')
                  }}
                  className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-bold tracking-wide text-[var(--color-brand)] uppercase hover:bg-[var(--color-brand)]/10"
                >
                  <X className="size-3" strokeWidth={2.5} />
                  Clear
                </button>
              ) : null}
            </div>

            <div className="space-y-3 p-3.5">
              <SideFilter
                icon={ArrowUpDown}
                label="Sort by"
                value={sortBy}
                onChange={setSortBy}
                active={sortBy !== 'all'}
              >
                <option value="all">All tasks</option>
                <option value="high">High priority</option>
              </SideFilter>

              <SideFilter
                icon={UserRound}
                label="Assignee"
                value={assignee}
                onChange={setAssignee}
                active={assignee !== 'all'}
              >
                <option value="all">All owners</option>
                {assignees.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </SideFilter>

              <SideFilter
                icon={ClipboardList}
                label="Task type"
                value={taskType}
                onChange={setTaskType}
                active={taskType !== 'all'}
              >
                <option value="all">All types</option>
                <option>Call</option>
                <option>Followup</option>
                <option>Mail</option>
                <option>Meeting</option>
                <option>Other</option>
                <option>Payment Collection</option>
              </SideFilter>

              <SideFilter
                icon={Users}
                label="Created by"
                value={createdBy}
                onChange={setCreatedBy}
                active={createdBy !== 'all'}
              >
                <option value="all">All creators</option>
                {creators.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SideFilter>
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)]">
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
            <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">{title}</h2>

            <label className="ml-2 flex items-center gap-2 text-xs text-slate-500">
              Shows
              <select
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              rows
            </label>

            <div className="relative ml-auto w-full max-w-[220px]">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-sm outline-none focus:border-[var(--color-accent)] focus:bg-white"
                placeholder="Search task…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-100 px-4 py-2.5">
            {typeTabs.map((tab) => {
              const label =
                tab === 'all'
                  ? `All (${filtered.length})`
                  : `${tab} (${typeCounts[tab as keyof typeof typeCounts] ?? 0})`
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTypeTab(tab)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                    typeTab === tab
                      ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-bold tracking-wide text-slate-500 uppercase shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                <tr>
                  <th className="px-4 py-3 font-bold">Sl.no</th>
                  <th className="px-4 py-3 font-bold">Assignee</th>
                  <th className="px-4 py-3 font-bold">Task details</th>
                  <th className="px-4 py-3 font-bold">Task under</th>
                  <th className="px-4 py-3 font-bold">Type</th>
                  <th className="px-4 py-3 font-bold">Due time</th>
                  <th className="px-4 py-3 font-bold">Priority</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-sm text-slate-500">
                      No tasks match your filters.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((task, i) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      index={(page - 1) * pageSize + i + 1}
                      onEdit={() => {
                        setEditingTask(task)
                        setDrawerOpen(true)
                      }}
                      onDelete={async () => {
                        const ok = await askConfirm({
                          title: 'Delete task',
                          body: `Delete “${task.details.slice(0, 60)}”? This cannot be undone.`,
                          confirmLabel: 'Delete',
                          tone: 'danger',
                        })
                        if (ok) deleteTask(task.id)
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
          />
        </div>
      </div>

      <CreateTaskDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingTask(null)
        }}
        leadName={editingTask?.underName ?? 'General'}
        leadId={editingTask?.underId}
        task={editingTask}
      />
      <AssignTaskDrawer open={assignOpen} onClose={() => setAssignOpen(false)} />
    </div>
  )
}

function TaskRow({
  task,
  index,
  onEdit,
  onDelete,
}: {
  task: Task
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-4 py-3 tabular-nums text-slate-500">{index}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-cyan-50 text-[10px] font-bold text-cyan-700">
            {task.assignee
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)}
          </span>
          <span className="font-medium text-slate-800">{task.assignee}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex max-w-xs items-start gap-1.5">
          <span className="line-clamp-2 text-slate-700">{task.details}</span>
          <Info className="mt-0.5 size-3.5 shrink-0 text-sky-500" strokeWidth={2} />
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Flag className="size-3.5 text-[var(--color-brand)]" strokeWidth={2} />
          {task.underId ? (
            <Link to={`/leads/${task.underId}`} className="font-medium text-slate-800 hover:text-[var(--color-brand)]">
              {task.underName}
            </Link>
          ) : (
            <span className="font-medium text-slate-800">{task.underName}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-slate-600">{task.type}</td>
      <td className="px-4 py-3">
        <div className="text-slate-700">{task.dueTime}</div>
        <div className="text-xs text-slate-400">{task.dueDate}</div>
      </td>
      <td className="px-4 py-3">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-4 py-3">
        <TaskStatusBadge status={task.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            title="Edit"
            aria-label={`Edit ${task.details}`}
          >
            <Pencil className="size-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
            aria-label={`Delete ${task.details}`}
          >
            <Trash2 className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function BucketChip({
  label,
  count,
  icon: Icon,
  tone,
  active,
  onClick,
}: {
  label: string
  count: number
  icon: LucideIcon
  tone: string
  active: boolean
  onClick: () => void
}) {
  const badge: Record<string, string> = {
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    teal: 'bg-teal-500',
    brand: 'bg-[var(--color-brand)]',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left shadow-sm transition hover:-translate-y-0.5',
        active ? 'border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]/15' : 'border-slate-200/90',
      )}
    >
      <Icon className="size-4 text-slate-400" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">{label}</span>
      <span
        className={cn(
          'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] leading-none font-bold text-white',
          badge[tone],
        )}
      >
        {count}
      </span>
    </button>
  )
}

function SideFilter({
  icon: Icon,
  label,
  value,
  onChange,
  active,
  children,
}: {
  icon: LucideIcon
  label: string
  value: string
  onChange: (value: string) => void
  active: boolean
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase">{label}</span>
      <span className="relative block">
        <span
          className={cn(
            'pointer-events-none absolute top-1/2 left-2.5 z-10 -translate-y-1/2',
            active ? 'text-cyan-600' : 'text-slate-400',
          )}
        >
          <Icon className="size-3.5" strokeWidth={2} />
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full appearance-none rounded-xl border bg-slate-50 py-2.5 pr-8 pl-8 text-sm font-medium outline-none transition',
            active
              ? 'border-cyan-300 bg-cyan-50/60 text-slate-900 ring-2 ring-cyan-500/10'
              : 'border-slate-200 text-slate-700 hover:border-slate-300',
            'focus:border-[var(--color-accent)] focus:bg-white focus:ring-2 focus:ring-cyan-500/15',
          )}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400"
          strokeWidth={2.2}
        />
      </span>
    </label>
  )
}
