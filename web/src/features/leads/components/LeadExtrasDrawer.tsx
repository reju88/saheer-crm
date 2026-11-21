import { useEffect, useState } from 'react'
import { Download, FileText, MessageSquare, Paperclip, X } from 'lucide-react'
import type { Lead } from '@/features/leads/types/lead'
import { cn } from '@/shared/utils/cn'
import { useCrmStore } from '@/stores/crm-store'

type Tab = 'comments' | 'attachments'

type LeadExtrasDrawerProps = {
  lead: Lead | null
  initialTab?: Tab
  onClose: () => void
}

export function LeadExtrasDrawer({ lead, initialTab = 'comments', onClose }: LeadExtrasDrawerProps) {
  const open = Boolean(lead)
  const [tab, setTab] = useState<Tab>(initialTab)

  useEffect(() => {
    if (lead) setTab(initialTab)
  }, [lead, initialTab])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const storeNotes = useCrmStore((s) => s.notes)
  const storeFiles = useCrmStore((s) => s.attachments)
  const notes = lead ? (storeNotes[lead.id] ?? []) : []
  const files = lead ? (storeFiles[lead.id] ?? []) : []
  const leadComment = lead?.comments?.trim()

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
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white shadow-[-24px_0_60px_-28px_rgba(10,22,40,0.55)] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="relative border-b border-slate-100 px-5 py-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-cyan-400" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-900">
                Comments & files
              </h2>
              <p className="mt-0.5 truncate text-sm text-slate-500">{lead?.contactName ?? '—'}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              aria-label="Close"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-4 flex gap-1 rounded-lg bg-slate-100 p-1">
            <TabBtn
              active={tab === 'comments'}
              icon={MessageSquare}
              label={`Comments (${notes.length + (leadComment ? 1 : 0)})`}
              onClick={() => setTab('comments')}
            />
            <TabBtn
              active={tab === 'attachments'}
              icon={Paperclip}
              label={`Files (${files.length})`}
              onClick={() => setTab('attachments')}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {tab === 'comments' ? (
            <div className="space-y-3">
              {leadComment ? (
                <article className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                  <p className="text-[11px] font-bold tracking-wide text-amber-700 uppercase">Lead comment</p>
                  <p className="mt-1 text-sm text-slate-700">{leadComment}</p>
                </article>
              ) : null}
              {notes.length === 0 && !leadComment ? (
                <Empty text="No comments yet for this lead." />
              ) : (
                notes.map((note) => (
                  <article key={note.id} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">{note.author}</p>
                      <p className="text-xs text-slate-400">{note.createdAt}</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{note.body}</p>
                  </article>
                ))
              )}
            </div>
          ) : files.length === 0 ? (
            <Empty text="No attachments uploaded for this lead." />
          ) : (
            <ul className="space-y-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-cyan-700 ring-1 ring-slate-200">
                    <FileText className="size-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {file.size} · {file.uploadedBy} · {file.uploadedAt}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-white hover:text-cyan-700"
                    title="Download"
                    aria-label={`Download ${file.name}`}
                  >
                    <Download className="size-3.5" strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}

function TabBtn({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: typeof MessageSquare
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition',
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {label}
    </button>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
      {text}
    </div>
  )
}
