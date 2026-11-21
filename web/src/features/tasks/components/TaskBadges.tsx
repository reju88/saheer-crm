import { cn } from '@/shared/utils/cn'
import type { TaskPriority, TaskStatus } from '@/features/tasks/types/task'

const priorityClass: Record<TaskPriority, string> = {
  High: 'bg-rose-50 text-rose-700 ring-rose-200',
  Mid: 'bg-amber-50 text-amber-700 ring-amber-200',
  Low: 'bg-sky-50 text-sky-700 ring-sky-200',
}

const statusClass: Record<TaskStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  'In Progress': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Completed: 'bg-teal-50 text-teal-700 ring-teal-200',
  Cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
  'N/A': 'bg-orange-50 text-orange-700 ring-orange-200',
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', priorityClass[priority])}>
      {priority}
    </span>
  )
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', statusClass[status])}>
      {status}
    </span>
  )
}
