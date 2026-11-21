export type LeadRating = 'Hot' | 'Warm' | 'Cold'
export type LeadStatus = 'Open' | 'Pending' | 'Follow-up' | 'Converted' | 'Lost'

export type Lead = {
  id: string
  contactName: string
  businessMobile: string
  leadDate: string
  owner: string
  createdBy: string
  createdAt: string
  lastActivityBy: string
  lastActivityAt: string
  source: string
  opportunity: string
  rating: LeadRating
  status: LeadStatus
  comments: string
}

export type LeadNote = {
  id: string
  author: string
  body: string
  createdAt: string
}

export type LeadAttachment = {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
}
