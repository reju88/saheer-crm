export type CustomerStatus = 'Active' | 'Inactive' | 'At risk'
export type CustomerTier = 'Standard' | 'Premium' | 'Enterprise'

export type Customer = {
  id: string
  name: string
  company: string
  mobile: string
  email: string
  owner: string
  status: CustomerStatus
  tier: CustomerTier
  industry: string
  dealValue: string
  convertedAt: string
  lastActivityAt: string
  sourceLeadId?: string
  city: string
  notes: string
}

export type CustomerActivity = {
  id: string
  type: 'call' | 'meeting' | 'note' | 'task' | 'document'
  title: string
  by: string
  at: string
}

export type CustomerDocument = {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
}
