import { useMemo, useState, type DragEvent } from 'react'
import { CalendarDays, GripVertical, Plus, Trash2, UserRound, Wallet } from 'lucide-react'
import { DealDrawer, dealStages, stageProb } from '@/features/sales/components/DealDrawer'
import { useCrmStore, type Deal, type DealStage } from '@/stores/crm-store'
import { askConfirm } from '@/stores/ui-store'
import { cn } from '@/shared/utils/cn'

const tone: Record<DealStage, { dot: string; drop: string }> = {
  Qualified: {
    dot: 'bg-sky-500',
    drop: 'border-sky-400 bg-sky-50/80 ring-sky-200',
  },
  Proposal: {
    dot: 'bg-amber-500',
    drop: 'border-amber-400 bg-amber-50/80 ring-amber-200',
  },
  Negotiation: {
    dot: 'bg-[var(--color-brand)]',
    drop: 'border-[var(--color-brand)] bg-pink-50/80 ring-pink-200',
  },
  Won: {
    dot: 'bg-emerald-500',
    drop: 'border-emerald-400 bg-emerald-50/80 ring-emerald-200',
  },
  Lost: {
    dot: 'bg-slate-400',
    drop: 'border-slate-400 bg-slate-100/80 ring-slate-300',
  },
}

const aed = (n: number, c = 'AED') => `${c} ${Math.round(n).toLocaleString('en-US')}`

export function SalesPage() {
  const deals = useCrmStore((s) => s.deals)
  const updateDeal = useCrmStore((s) => s.updateDeal)
  const deleteDeal = useCrmStore((s) => s.deleteDeal)
  const [open, setOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<DealStage | null>(null)

  const stats = useMemo(
    () =>
      dealStages.map((stage) => {
        const list = deals.filter((d) => d.stage === stage)
        return { stage, list, value: list.reduce((a, d) => a + d.value, 0) }
      }),
    [deals],
  )
  const pipeline = stats.filter((s) => !['Won', 'Lost'].includes(s.stage)).reduce((a, s) => a + s.value, 0)
  const won = stats.find((s) => s.stage === 'Won')?.value ?? 0

  const move = (d: Deal, stage: DealStage) => {
    if (d.stage === stage) return
    updateDeal(d.id, { stage, probability: stageProb[stage] })
  }
  const remove = async (d: Deal) => {
    const ok = await askConfirm({
      title: 'Delete deal',
      body: `Delete “${d.title}”? This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    })
    if (ok) deleteDeal(d.id)
  }

  const onDragStart = (e: DragEvent, deal: Deal) => {
    e.dataTransfer.setData('text/deal-id', deal.id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(deal.id)
  }

  const onDragEnd = () => {
    setDraggingId(null)
    setOverStage(null)
  }

  const onDragOverColumn = (e: DragEvent, stage: DealStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overStage !== stage) setOverStage(stage)
  }

  const onDropColumn = (e: DragEvent, stage: DealStage) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/deal-id')
    const deal = deals.find((d) => d.id === id)
    if (deal) move(deal, stage)
    setDraggingId(null)
    setOverStage(null)
  }

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-slate-900">
            Sales
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Drag deals between stages · pipeline, value, and closing tracking.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(233,30,140,0.7)] hover:bg-[var(--color-brand-hover)]"
        >
          <Plus className="size-4" strokeWidth={2.2} />
          New deal
        </button>
      </div>

      <div className="grid shrink-0 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm xl:col-span-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            <Wallet className="size-3.5" /> Open pipeline
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
            {aed(pipeline)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Won: {aed(won)}</p>
        </div>
        {stats.map((s) => (
          <div key={s.stage} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              <span className={cn('size-2 rounded-full', tone[s.stage].dot)} />
              {s.stage}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
              {s.list.length}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{aed(s.value)}</p>
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-x-auto pb-2 [grid-template-columns:repeat(5,minmax(240px,1fr))]">
        {stats.map((s) => {
          const isOver = overStage === s.stage
          return (
            <section
              key={s.stage}
              onDragOver={(e) => onDragOverColumn(e, s.stage)}
              onDragLeave={() => {
                if (overStage === s.stage) setOverStage(null)
              }}
              onDrop={(e) => onDropColumn(e, s.stage)}
              className={cn(
                'flex min-h-64 flex-col rounded-2xl border bg-slate-50/70 transition',
                isOver ? cn('ring-2', tone[s.stage].drop) : 'border-slate-200/90',
              )}
            >
              <header className="flex items-center justify-between gap-2 border-b border-slate-200/70 px-3.5 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className={cn('size-2 rounded-full', tone[s.stage].dot)} />
                  {s.stage}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  {s.list.length}
                </span>
              </header>

              <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5">
                {s.list.length === 0 ? (
                  <p
                    className={cn(
                      'rounded-xl border border-dashed py-10 text-center text-xs',
                      isOver ? 'border-current text-slate-600' : 'border-slate-200 text-slate-400',
                    )}
                  >
                    {isOver ? 'Drop deal here' : 'No deals · drop here'}
                  </p>
                ) : null}

                {s.list.map((d) => (
                  <article
                    key={d.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, d)}
                    onDragEnd={onDragEnd}
                    title="Drag to another stage"
                    className={cn(
                      'cursor-grab rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm transition hover:border-cyan-200 hover:shadow-md active:cursor-grabbing',
                      draggingId === d.id && 'scale-[0.98] opacity-40 ring-2 ring-cyan-300',
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500"
                        aria-hidden
                      >
                        <GripVertical className="size-4" strokeWidth={2.4} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">{d.title}</h3>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              remove(d)
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            title="Delete deal"
                            aria-label={`Delete ${d.title}`}
                            className="grid size-7 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="size-3.5" strokeWidth={2} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">{d.customerName}</p>
                        <p className="mt-2 font-[family-name:var(--font-display)] text-base font-semibold text-slate-900">
                          {aed(d.value, d.currency)}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn('h-full rounded-full', tone[d.stage].dot)}
                            style={{ width: `${d.probability}%` }}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <UserRound className="size-3" />
                            {d.owner}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3" />
                            {d.closeDate}
                          </span>
                          <span className="font-semibold">{d.probability}%</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <DealDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
