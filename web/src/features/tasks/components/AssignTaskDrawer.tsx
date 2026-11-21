import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Search, UserRound, Users, X } from 'lucide-react'
import { PriorityBadge, TaskStatusBadge } from '@/features/tasks/components/TaskBadges'
import type { Task } from '@/features/tasks/types/task'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'

const PEOPLE = ['Pravesh', 'Sara M.', 'Daniel K.', 'Fatima H.', 'Liam P.'] as const

type AssignTaskDrawerProps = {
  open: boolean
  onClose: () => void
}

export function AssignTaskDrawer({ open, onClose }: AssignTaskDrawerProps) {
  const [taskId, setTaskId] = useState('')
  const [assignee, setAssignee] = useState('')
  const [note, setNote] = useState('')
  const [taskOpen, setTaskOpen] = useState(false)
  const [taskQuery, setTaskQuery] = useState('')
  const taskWrapRef = useRef<HTMLDivElement>(null)

  const tasks = useCrmStore((s) => s.tasks)
  const assignTask = useCrmStore((s) => s.assignTask)
  const selected = useMemo(() => tasks.find((t) => t.id === taskId) ?? null, [tasks, taskId])

  const filteredTasks = useMemo(() => {
    const q = taskQuery.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter(
      (t) =>
        t.details.toLowerCase().includes(q) ||
        t.underName.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q),
    )
  }, [tasks, taskQuery])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (taskOpen) setTaskOpen(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, taskOpen])

  useEffect(() => {
    if (!taskOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!taskWrapRef.current?.contains(e.target as Node)) setTaskOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [taskOpen])

  useEffect(() => {
    if (!open) {
      setTaskId('')
      setAssignee('')
      setNote('')
      setTaskOpen(false)
      setTaskQuery('')
    }
  }, [open])

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
        <div className="relative overflow-hidden border-b border-slate-200/80 bg-white px-6 py-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-cyan-400" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                <Users className="size-5" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
                  Assign task
                </h2>
                <p className="mt-1 text-sm text-slate-500">Pick a task and hand it to a team member.</p>
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
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            if (!taskId) {
              setTaskOpen(true)
              return
            }
            if (!assignee) return
            assignTask(taskId, assignee, note.trim() || undefined)
            onClose()
          }}
        >
          <div
            className={cn(
              'min-h-0 flex-1 overscroll-contain px-6 py-5',
              taskOpen ? 'overflow-visible' : 'overflow-y-auto',
            )}
          >
            <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6">
              <Field label="Task" required>
                <div ref={taskWrapRef} className="relative z-20">
                  <input type="hidden" name="taskId" value={taskId} required />
                  <button
                    type="button"
                    onClick={() => setTaskOpen((v) => !v)}
                    className={cn(
                      boxClass,
                      'flex w-full items-center gap-2.5 px-3 py-2.5 text-left ring-1',
                      taskOpen ? 'border-cyan-400 bg-white ring-cyan-500/15' : 'ring-transparent',
                    )}
                  >
                    <Search className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                    <span className={cn('min-w-0 flex-1 truncate text-sm', selected ? 'font-medium text-slate-900' : 'text-slate-400')}>
                      {selected ? selected.details : 'Search & select task'}
                    </span>
                    <ChevronDown className={cn('size-4 shrink-0 text-slate-400 transition', taskOpen && 'rotate-180')} />
                  </button>

                  {taskOpen ? (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      <div className="border-b border-slate-100 p-2">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5">
                          <Search className="size-3.5 text-slate-400" strokeWidth={2} />
                          <input
                            autoFocus
                            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                            placeholder="Search by details, lead, assignee…"
                            value={taskQuery}
                            onChange={(e) => setTaskQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <ul className="max-h-64 overflow-y-auto py-1">
                        {filteredTasks.length === 0 ? (
                          <li className="px-3 py-2 text-sm text-slate-400">No matches</li>
                        ) : (
                          filteredTasks.map((t) => (
                            <li key={t.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setTaskId(t.id)
                                  setTaskOpen(false)
                                  setTaskQuery('')
                                  if (!assignee) setAssignee(t.assignee)
                                }}
                                className={cn(
                                  'flex w-full flex-col gap-1 px-3 py-2.5 text-left transition hover:bg-sky-50',
                                  taskId === t.id && 'bg-sky-100',
                                )}
                              >
                                <span className="line-clamp-1 text-sm font-medium text-slate-900">{t.details}</span>
                                <span className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                  <span>{t.underName}</span>
                                  <span>·</span>
                                  <span>{t.type}</span>
                                  <span>·</span>
                                  <span>Now: {t.assignee}</span>
                                </span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </Field>

              {selected ? <TaskPreview task={selected} /> : null}

              <Field label="Assign to" required>
                <div className={cn(boxClass, 'flex items-center gap-2.5 px-3')}>
                  <UserRound className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                  <select
                    className="w-full border-0 bg-transparent py-2.5 text-sm text-slate-900 outline-none"
                    name="assignee"
                    required
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                  >
                    <option value="" disabled>
                      Select owner
                    </option>
                    {PEOPLE.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Note">
                <div className={boxClass}>
                  <textarea
                    className="min-h-24 w-full resize-y border-0 bg-transparent px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    name="note"
                    placeholder="Optional message to the assignee…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </Field>
            </div>
          </div>

          <div className="flex shrink-0 gap-3 border-t border-slate-200/80 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(233,30,140,0.75)] transition hover:bg-[var(--color-brand-hover)]"
            >
              <Users className="size-4" strokeWidth={2.2} />
              Assign
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}

function TaskPreview({ task }: { task: Task }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
      <p className="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">Selected task</p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{task.details}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span>Under {task.underName}</span>
        <span className="text-slate-300">·</span>
        <span>
          {task.dueDate} · {task.dueTime}
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <PriorityBadge priority={task.priority} />
        <TaskStatusBadge status={task.status} />
        <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 ring-inset">
          {task.type}
        </span>
      </div>
    </div>
  )
}

const boxClass =
  'rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-[var(--color-accent)] focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-500/10'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="block space-y-1.5">
      <span className="text-[11px] font-bold tracking-[0.08em] text-slate-500 uppercase">
        {label}
        {required ? <span className="text-[var(--color-brand)]"> *</span> : null}
      </span>
      {children}
    </div>
  )
}
