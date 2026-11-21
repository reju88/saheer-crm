export type TaskType = 'Call' | 'Followup' | 'Mail' | 'Meeting' | 'Other' | 'Payment Collection'
export type TaskPriority = 'Low' | 'Mid' | 'High'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'N/A'

export type TaskBucket = 'today' | 'pending' | 'in_progress' | 'overdue' | 'upcoming' | 'completed' | 'meeting'

export type Task = {
  id: string
  assignee: string
  details: string
  underName: string
  underId?: string
  type: TaskType
  dueDate: string
  dueTime: string
  priority: TaskPriority
  status: TaskStatus
  createdBy: string
  bucket: TaskBucket
}
