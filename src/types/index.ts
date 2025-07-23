// Base audit fields for all entities
export interface AuditFields {
  id: string
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string
}

// Client related types
export interface Client extends AuditFields {
  clientName: string
  primaryIndustry: string
  clientStatus: 'Active' | 'Inactive'
  parentCompany?: string
}

export interface ClientContact extends AuditFields {
  clientId: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  countryCode: string
  contactStatus: 'Active' | 'Inactive'
  role: 'Recruiter' | 'Hiring Manager' | 'Head of TA' | 'Head of HR'
}

// Job related types
export interface Job extends AuditFields {
  clientId: string
  jobTitle: string
  numberOfPositions: number
  sourcingStatus: 'Active' | 'On Hold' | 'Follow Up' | 'Inactive'
  experienceFrom: number
  experienceTo: number
  budgetInLPA: number
  clientPriority: string
  recruiterNotes?: string
}

// Candidate related types
export interface Candidate extends AuditFields {
  firstName: string
  lastName: string
  email: string
  mobile: string
  countryCode: string
  gender?: string
  sourcingChannel?: string
  resumeAttachment?: string
  url?: string
  tags?: string[]
  rating: 1 | 2 | 3 | 4 | 5
  profilePicture?: string
  education?: string
}

// Application related types
export interface Application extends AuditFields {
  candidateId: string
  jobId: string
  pipelinePriority?: number
  internalComments?: string
  datavrutiComments?: string
  totalYears: number
  currentJobTitle: string
  ctcInLPA: number
  ctcBreakup?: string
  ectcInLPA: number
  officialNoticePeriodInDays: 0 | 15 | 30 | 45 | 60 | 90
  noticePeriodNegotiable: 'Yes' | 'Maybe' | 'No'
  servingNoticePeriod: 'Yes' | 'No' | 'Already Served'
  offerInHand: 'Yes' | 'No' | 'Advanced Stages'
  currentOfferInLPA?: number
  lastWorkingDate?: string
  earliestJoiningDate?: string
  reasonForChange?: string
  relevantExpYears: number
  applicationStage: 0 | 1 | 2 | 3 | 4 // 0-Sourcing, 1-Screening, 2-Interviewing, 3-Offer, 4-Closure
  applicationStatus: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  likelihoodOfJoining: 'Low' | 'Medium' | 'High'
  dateOfJoining?: string
  reasonForRejectDrop?: string
  latestResumeAttachment?: string
  sourcedBy: string
  currentCompany: string
  currentLocation: string
  preferredLocations: string[]
}

// Lookup types
export interface Industry extends AuditFields {
  industryName: string
}

export interface Skill extends AuditFields {
  skillName: string
}

export interface Location extends AuditFields {
  city: string
  state: string
  country: string
}

export interface WorkplaceType extends AuditFields {
  workplaceTypeName: 'On-site' | 'Hybrid' | 'Remote'
}

export interface JobType extends AuditFields {
  jobTypeName: 'Permanent' | 'Contract To Hire' | 'Freelance / Contract' | 'Internship' | 'Part-time' | 'Volunteer'
}

export interface User extends AuditFields {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  countryCode: string
  employmentStatus: string
  role: 'Admin' | 'Recruiter'
  profilePicture?: string
}

export interface CurrentCompany extends AuditFields {
  currentCompanyName: string
}

// Application status labels
export const APPLICATION_STATUS_LABELS = {
  0: 'Recruiter',
  1: 'SPOC',
  2: 'Pipeline',
  3: 'Resume Shared',
  4: 'Resume Shortlisted',
  5: 'Ongoing',
  6: 'In-principle Offer',
  7: 'Offer Shared',
  8: 'Offer Accepted',
  9: 'Offer Declined',
  10: 'Offer Dropped',
  11: 'Joined',
  12: 'Early Exit'
}

// Application stage labels
export const APPLICATION_STAGE_LABELS = {
  0: 'Sourcing',
  1: 'Screening',
  2: 'Interviewing',
  3: 'Offer',
  4: 'Closure'
}