import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  total: number
  pageSize: number
}

function pageItems(page: number, pageCount: number): Array<number | '…'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  if (page <= 3) return [1, 2, 3, 4, '…', pageCount]
  if (page >= pageCount - 2) return [1, '…', pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, '…', page - 1, page, page + 1, '…', pageCount]
}

export function Pagination({ page, pageCount, onPageChange, total, pageSize }: PaginationProps) {
  const safeCount = Math.max(pageCount, 1)
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const items = pageItems(page, safeCount)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}</span>–
        <span className="font-semibold text-slate-700">{to}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <PageBtn
          ariaLabel="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </PageBtn>

        {items.map((item, i) =>
          item === '…' ? (
            <span key={`e-${i}`} className="grid size-8 place-items-center text-xs text-slate-400">
              …
            </span>
          ) : (
            <PageBtn
              key={item}
              ariaLabel={`Page ${item}`}
              active={item === page}
              onClick={() => onPageChange(item)}
            >
              {item}
            </PageBtn>
          ),
        )}

        <PageBtn
          ariaLabel="Next page"
          disabled={page >= safeCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </PageBtn>
      </div>
    </div>
  )
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
  ariaLabel,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-lg text-xs font-semibold transition',
        active
          ? 'bg-[var(--color-brand)] text-white shadow-sm shadow-pink-500/25'
          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-white',
      )}
    >
      {children}
    </button>
  )
}
