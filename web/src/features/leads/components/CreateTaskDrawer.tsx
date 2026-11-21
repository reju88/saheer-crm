import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  CalendarDays,
  ChevronDown,
  CircleDot,
  ClipboardList,
  Clock3,
  FileUp,
  ListTodo,
  MapPin,
  Paperclip,
  Search,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'
import type { Task, TaskPriority, TaskStatus, TaskType } from '@/features/tasks/types/task'

type CreateTaskDrawerProps = {
  open: boolean
  onClose: () => void
  leadName?: string
  leadId?: string
  task?: Task | null
}

type Priority = 'Low' | 'Mid' | 'High'

const PEOPLE = ['Pravesh', 'Sara M.', 'Daniel K.', 'Fatima H.', 'Liam P.'] as const
const TASK_TYPES = ['Call', 'Followup', 'Mail', 'Meeting', 'Other', 'Payment Collection'] as const

export function CreateTaskDrawer({ open, onClose, leadName = 'General', leadId, task = null }: CreateTaskDrawerProps) {
  const isEdit = Boolean(task)
  const [priority, setPriority] = useState<Priority>('Low')
  const [fileName, setFileName] = useState<string | null>(null)
  const [participants, setParticipants] = useState<string[]>([])
  const [participantOpen, setParticipantOpen] = useState(false)
  const [taskType, setTaskType] = useState('')
  const [typeOpen, setTypeOpen] = useState(false)
  const [typeQuery, setTypeQuery] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const typeWrapRef = useRef<HTMLDivElement>(null)

  const filteredTypes = useMemo(() => {
    const q = typeQuery.trim().toLowerCase()
    if (!q) return [...TASK_TYPES]
    return TASK_TYPES.filter((t) => t.toLowerCase().includes(q))
  }, [typeQuery])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeOpen) setTypeOpen(false)
        else if (participantOpen) setParticipantOpen(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, typeOpen, participantOpen])

  useEffect(() => {
    if (!typeOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!typeWrapRef.current?.contains(e.target as Node)) setTypeOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [typeOpen])

  useEffect(() => {
    if (!open) {
      setPriority('Low')
      setFileName(null)
      setParticipants([])
      setParticipantOpen(false)
      setTaskType('')
      setTypeOpen(false)
      setTypeQuery('')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (task) {
      setPriority(task.priority)
      setTaskType(task.type)
    } else {
      setPriority('Low')
      setTaskType('')
    }
  }, [open, task])

  const toggleParticipant = (name: string) => {
    setParticipants((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]))
  }

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
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-4xl flex-col overflow-hidden bg-[#f7f9fc] shadow-[-24px_0_60px_-28px_rgba(10,22,40,0.55)] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="relative overflow-hidden border-b border-slate-200/80 bg-white px-6 py-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-cyan-400" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30">
                <ListTodo className="size-5" strokeWidth={2} />
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
                  {isEdit ? 'Edit task' : 'Add task'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Under <span className="font-semibold text-slate-700">{task?.underName ?? leadName}</span>
                </p>
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
          key={task?.id ?? 'create'}
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            if (!taskType) {
              setTypeOpen(true)
              return
            }
            const fd = new FormData(e.currentTarget)
            const dueDate = String(fd.get('dueDate') ?? '')
            const dueTimeRaw = String(fd.get('dueTime') ?? '')
            const payload = {
              assignee: String(fd.get('assignee') ?? 'Pravesh'),
              details: String(fd.get('details') ?? ''),
              type: taskType as TaskType,
              dueDate: dueDate || task?.dueDate || 'TBD',
              dueTime: dueTimeRaw || task?.dueTime || '—',
              priority: String(fd.get('priority') ?? priority) as TaskPriority,
              status: String(fd.get('status') ?? 'Pending') as TaskStatus,
            }
            if (task) {
              useCrmStore.getState().updateTask(task.id, payload)
            } else {
              useCrmStore.getState().addTask({
                ...payload,
                underName: leadName,
                underId: leadId,
                createdBy: 'Admin',
                bucket: 'today',
              })
            }
            onClose()
          }}
        >
          <div
            className={cn(
              'min-h-0 flex-1 overscroll-contain px-6 py-5',
              typeOpen || participantOpen ? 'overflow-visible' : 'overflow-y-auto',
            )}
          >
            <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6">
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                <div className="space-y-4">
                  <Field label="Assignee">
                    <IconInput icon={UserRound}>
                      <select className={controlClass} name="assignee" defaultValue={task?.assignee ?? 'Pravesh'}>
                        {PEOPLE.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </IconInput>
                  </Field>

                  <Field label="Type" required>
                    <div ref={typeWrapRef} className="relative z-20">
                      <input type="hidden" name="type" value={taskType} required />
                      <button
                        type="button"
                        onClick={() => {
                          setTypeOpen((v) => !v)
                          setParticipantOpen(false)
                        }}
                        className={cn(
                          boxClass,
                          'flex w-full items-center gap-2.5 px-3 py-2.5 text-left ring-1',
                          typeOpen ? 'border-cyan-400 bg-white ring-cyan-500/15' : 'ring-transparent',
                        )}
                      >
                        <ClipboardList className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                        <span className={cn('flex-1 text-sm', taskType ? 'font-medium text-slate-900' : 'text-slate-400')}>
                          {taskType || 'Select type'}
                        </span>
                        <ChevronDown className={cn('size-4 text-slate-400 transition', typeOpen && 'rotate-180')} />
                      </button>

                      {typeOpen ? (
                        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                          <div className="border-b border-slate-100 p-2">
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5">
                              <Search className="size-3.5 text-slate-400" strokeWidth={2} />
                              <input
                                autoFocus
                                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                                placeholder="Search type…"
                                value={typeQuery}
                                onChange={(e) => setTypeQuery(e.target.value)}
                              />
                            </div>
                          </div>
                          <ul className="max-h-52 overflow-y-auto py-1">
                            {filteredTypes.length === 0 ? (
                              <li className="px-3 py-2 text-sm text-slate-400">No matches</li>
                            ) : (
                              filteredTypes.map((t) => (
                                <li key={t}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTaskType(t)
                                      setTypeOpen(false)
                                      setTypeQuery('')
                                    }}
                                    className={cn(
                                      'flex w-full px-3 py-2 text-left text-sm transition hover:bg-sky-50 hover:text-sky-800',
                                      taskType === t && 'bg-sky-100 font-semibold text-sky-900',
                                    )}
                                  >
                                    {t}
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </Field>

                  <Field label="Task details" required>
                    <div className={boxClass}>
                      <textarea
                        className={`${controlClass} min-h-24 resize-y px-3.5 py-2.5`}
                        name="details"
                        placeholder="Describe the task…"
                        defaultValue={task?.details ?? ''}
                        required
                      />
                    </div>
                  </Field>

                  <Field label="Due date">
                    <div className="grid grid-cols-2 gap-2">
                      <IconInput icon={CalendarDays}>
                        {isEdit ? (
                          <input
                            className={controlClass}
                            name="dueDate"
                            type="text"
                            defaultValue={task?.dueDate ?? ''}
                            placeholder="21 Nov 2026"
                          />
                        ) : (
                          <input className={controlClass} name="dueDate" type="date" />
                        )}
                      </IconInput>
                      <IconInput icon={Clock3}>
                        {isEdit ? (
                          <input
                            className={controlClass}
                            name="dueTime"
                            type="text"
                            defaultValue={task?.dueTime ?? ''}
                            placeholder="04:30 PM"
                          />
                        ) : (
                          <input className={controlClass} name="dueTime" type="time" />
                        )}
                      </IconInput>
                    </div>
                  </Field>

                  <Field label="Location">
                    <IconInput icon={MapPin}>
                      <input className={controlClass} name="location" placeholder="Search location" autoComplete="off" />
                    </IconInput>
                  </Field>
                </div>

                <div className="space-y-4">
                  <Field label="Participants">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setParticipantOpen((v) => !v)}
                        className={cn(boxClass, 'flex w-full items-center gap-2.5 px-3 py-2.5 text-left')}
                      >
                        <Users className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                        <span className={cn('flex-1 truncate text-sm', participants.length ? 'text-slate-900' : 'text-slate-400')}>
                          {participants.length ? participants.join(', ') : 'None selected'}
                        </span>
                      </button>
                      {participantOpen ? (
                        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                          {PEOPLE.map((name) => (
                            <label
                              key={name}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <input
                                type="checkbox"
                                checked={participants.includes(name)}
                                onChange={() => toggleParticipant(name)}
                                className="size-3.5 accent-[var(--color-brand)]"
                              />
                              {name}
                            </label>
                          ))}
                        </div>
                      ) : null}
                      {participants.map((name) => (
                        <input key={name} type="hidden" name="participants" value={name} />
                      ))}
                    </div>
                  </Field>

                  <Field label="Priority">
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                      {(['Low', 'Mid', 'High'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setPriority(level)}
                          className={cn(
                            'flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition',
                            priority === level
                              ? level === 'High'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : level === 'Mid'
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'bg-sky-600 text-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-800',
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="priority" value={priority} />
                  </Field>

                  <Field label="Status">
                    <IconInput icon={CircleDot}>
                      <select className={controlClass} name="status" defaultValue={task?.status ?? 'Pending'}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                        <option>N/A</option>
                      </select>
                    </IconInput>
                  </Field>

                  <Field label="Comments">
                    <div className={boxClass}>
                      <textarea
                        className={`${controlClass} min-h-24 resize-y px-3.5 py-2.5`}
                        name="comments"
                        placeholder="Optional comments…"
                      />
                    </div>
                  </Field>
                </div>
              </div>

              <Field label="Attachment / upload file">
                <input
                  ref={fileRef}
                  className="sr-only"
                  id="task-attachment"
                  name="attachment"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      fileRef.current?.click()
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-cyan-400', 'bg-cyan-50')
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-50')
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-50')
                    const file = e.dataTransfer.files?.[0]
                    if (!file || !fileRef.current) return
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    fileRef.current.files = dt.files
                    setFileName(file.name)
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50/50"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200">
                    <Paperclip className="size-5" strokeWidth={2} />
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {fileName ? fileName : 'Upload file'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {fileName ? 'Click to replace file' : 'Drag & drop here, or click to browse'}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                    <FileUp className="size-3.5" strokeWidth={2} />
                    Choose file
                  </span>
                  <p className="text-[11px] text-slate-400">PDF, Word, Excel, image, or ZIP</p>
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
              <ListTodo className="size-4" strokeWidth={2.2} />
              {isEdit ? 'Save changes' : 'Submit'}
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}

const controlClass =
  'w-full border-0 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400'

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

function IconInput({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound
  children: ReactNode
}) {
  return (
    <div className={cn(boxClass, 'flex items-center gap-2.5 px-3')}>
      <Icon className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
      {children}
    </div>
  )
}
