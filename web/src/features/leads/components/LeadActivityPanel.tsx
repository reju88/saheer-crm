import { useMemo, useRef, useState } from 'react'
import { FileText, ListTodo, Paperclip, Plus, Upload } from 'lucide-react'
import { PriorityBadge, TaskStatusBadge } from '@/features/tasks/components/TaskBadges'
import type { LeadNote } from '@/features/leads/types/lead'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'
import { useAuthStore } from '@/stores/auth-store'

type Tab = 'notes' | 'tasks' | 'files'

type LeadActivityPanelProps = {
  leadId: string
  leadName: string
  onAddTask?: () => void
}

const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'files', label: 'Files', icon: Paperclip },
]

export function LeadActivityPanel({ leadId, leadName, onAddTask }: LeadActivityPanelProps) {
  const [tab, setTab] = useState<Tab>('notes')
  const notes = useCrmStore((s) => s.notes[leadId] ?? [])
  const files = useCrmStore((s) => s.attachments[leadId] ?? [])
  const tasks = useCrmStore((s) => s.tasks)
  const leadTasks = useMemo(
    () => tasks.filter((t) => t.underId === leadId || t.underName === leadName),
    [tasks, leadId, leadName],
  )

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_10px_30px_-22px_rgba(10,22,40,0.45)]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 pt-4 pb-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold text-slate-900">Activity</h2>
          <p className="text-xs text-slate-500">Notes, tasks, and files for this lead</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map((t) => {
            const Icon = t.icon
            const count = t.id === 'notes' ? notes.length : t.id === 'tasks' ? leadTasks.length : files.length
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
                )}
              >
                <Icon className="size-3.5" strokeWidth={2} />
                {t.label}
                <span
                  className={cn(
                    'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold',
                    active ? 'bg-[var(--color-accent)] text-white' : 'bg-slate-200 text-slate-600',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        {tab === 'notes' ? <NotesTab leadId={leadId} notes={notes} /> : null}
        {tab === 'tasks' ? <TasksTab tasks={leadTasks} onAddTask={onAddTask} /> : null}
        {tab === 'files' ? <FilesTab leadId={leadId} files={files} /> : null}
      </div>
    </section>
  )
}

function NotesTab({ leadId, notes }: { leadId: string; notes: LeadNote[] }) {
  const [draft, setDraft] = useState('')
  const [composing, setComposing] = useState(false)
  const addNote = useCrmStore((s) => s.addNote)
  const user = useAuthStore((s) => s.user)

  const submit = () => {
    const body = draft.trim()
    if (!body) return
    addNote(leadId, body, user?.name ?? 'Admin')
    setDraft('')
    setComposing(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <EmptyState title="No notes yet" hint="Capture call outcomes and next steps." />
        ) : (
          notes.map((note) => (
            <article key={note.id} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-cyan-50 text-[10px] font-bold text-cyan-700">
                    {note.author
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{note.author}</p>
                </div>
                <p className="text-xs text-slate-400">{note.createdAt}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{note.body}</p>
            </article>
          ))
        )}
      </div>

      {composing ? (
        <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <textarea
            autoFocus
            className="min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-cyan-500/10"
            placeholder="Write a note…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
            }}
          />
          <div className="mt-2.5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setComposing(false)
                setDraft('')
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] disabled:opacity-40"
            >
              <Plus className="size-3.5" strokeWidth={2.2} />
              Save note
            </button>
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 justify-end">
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)]"
          >
            <Plus className="size-3.5" strokeWidth={2.2} />
            Add note
          </button>
        </div>
      )}
    </div>
  )
}

function TasksTab({
  tasks,
  onAddTask,
}: {
  tasks: ReturnType<typeof useCrmStore.getState>['tasks']
  onAddTask?: () => void
}) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        hint="Schedule a call, meeting, or follow-up against this lead."
        action="Add task"
        onAction={onAddTask}
      />
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ul className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {tasks.map((t) => (
          <li key={t.id} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{t.details}</p>
              <div className="flex gap-1.5">
                <PriorityBadge priority={t.priority} />
                <TaskStatusBadge status={t.status} />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {t.type} · {t.assignee} · {t.dueDate} {t.dueTime}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex shrink-0 justify-end">
        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)]"
        >
          <Plus className="size-3.5" strokeWidth={2.2} />
          Add task
        </button>
      </div>
    </div>
  )
}

function FilesTab({
  leadId,
  files,
}: {
  leadId: string
  files: { id: string; name: string; size: string; uploadedBy: string; uploadedAt: string }[]
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const addAttachment = useCrmStore((s) => s.addAttachment)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <input
        ref={fileRef}
        type="file"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const kb = Math.max(1, Math.round(file.size / 1024))
          addAttachment(leadId, file.name, kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`)
          e.target.value = ''
        }}
      />

      {files.length === 0 ? (
        <EmptyState
          title="No files uploaded"
          hint="Attach proposals, briefs, or contracts here."
          action="Upload file"
          onAction={() => fileRef.current?.click()}
        />
      ) : (
        <>
          <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
                  <FileText className="size-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{f.name}</p>
                  <p className="text-xs text-slate-500">
                    {f.size} · {f.uploadedBy} · {f.uploadedAt}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 justify-end">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)]"
            >
              <Upload className="size-3.5" strokeWidth={2.2} />
              Upload file
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function EmptyState({
  title,
  hint,
  action,
  onAction,
}: {
  title: string
  hint: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-slate-500">{hint}</p>
      {action ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Plus className="size-3.5" strokeWidth={2.2} />
          {action}
        </button>
      ) : null}
    </div>
  )
}
