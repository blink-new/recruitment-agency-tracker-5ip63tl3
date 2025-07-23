import { Candidate, Application, Job, Client, User, CurrentCompany } from '@/types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    mobile: '9876543210',
    countryCode: '+91',
    employmentStatus: 'Active',
    role: 'Admin',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    employeeId: 'EMP002',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@company.com',
    mobile: '9876543211',
    countryCode: '+91',
    employmentStatus: 'Active',
    role: 'Recruiter',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  }
]

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'client-1',
    clientName: 'TechCorp Solutions',
    primaryIndustry: 'Technology',
    clientStatus: 'Active',
    parentCompany: 'TechCorp Holdings',
    createdBy: 'user-1',
    createdOn: '2024-01-15T00:00:00Z',
    lastModifiedBy: 'user-1',
    lastModifiedOn: '2024-01-15T00:00:00Z'
  },
  {
    id: 'client-2',
    clientName: 'FinanceFirst Bank',
    primaryIndustry: 'Financial Services',
    clientStatus: 'Active',
    createdBy: 'user-1',
    createdOn: '2024-01-20T00:00:00Z',
    lastModifiedBy: 'user-1',
    lastModifiedOn: '2024-01-20T00:00:00Z'
  }
]

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    clientId: 'client-1',
    jobTitle: 'Senior Software Engineer',
    numberOfPositions: 2,
    sourcingStatus: 'Active',
    experienceFrom: 5,
    experienceTo: 8,
    budgetInLPA: 25,
    clientPriority: 'High',
    recruiterNotes: 'Looking for React/Node.js expertise',
    createdBy: 'user-2',
    createdOn: '2024-02-01T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-01T00:00:00Z'
  },
  {
    id: 'job-2',
    clientId: 'client-2',
    jobTitle: 'Product Manager',
    numberOfPositions: 1,
    sourcingStatus: 'Active',
    experienceFrom: 3,
    experienceTo: 6,
    budgetInLPA: 30,
    clientPriority: 'Medium',
    recruiterNotes: 'Fintech experience preferred',
    createdBy: 'user-2',
    createdOn: '2024-02-05T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-05T00:00:00Z'
  }
]

// Mock Current Companies
export const mockCurrentCompanies: CurrentCompany[] = [
  {
    id: 'company-1',
    currentCompanyName: 'Google',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  },
  {
    id: 'company-2',
    currentCompanyName: 'Microsoft',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  },
  {
    id: 'company-3',
    currentCompanyName: 'Amazon',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  },
  {
    id: 'company-4',
    currentCompanyName: 'Meta',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  },
  {
    id: 'company-5',
    currentCompanyName: 'Apple',
    createdBy: 'system',
    createdOn: '2024-01-01T00:00:00Z',
    lastModifiedBy: 'system',
    lastModifiedOn: '2024-01-01T00:00:00Z'
  }
]

// Mock Candidates
export const mockCandidates: Candidate[] = [
  {
    id: 'candidate-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    mobile: '9876543210',
    countryCode: '+91',
    gender: 'Male',
    sourcingChannel: 'LinkedIn',
    rating: 4,
    education: 'B.Tech Computer Science',
    createdBy: 'user-2',
    createdOn: '2024-02-10T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-10T00:00:00Z'
  },
  {
    id: 'candidate-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    mobile: '9876543211',
    countryCode: '+91',
    gender: 'Female',
    sourcingChannel: 'Naukri',
    rating: 5,
    education: 'MBA + B.Tech',
    createdBy: 'user-2',
    createdOn: '2024-02-12T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-12T00:00:00Z'
  },
  {
    id: 'candidate-3',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@email.com',
    mobile: '9876543212',
    countryCode: '+91',
    gender: 'Male',
    sourcingChannel: 'Referral',
    rating: 3,
    education: 'M.Tech Software Engineering',
    createdBy: 'user-2',
    createdOn: '2024-02-14T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-14T00:00:00Z'
  },
  {
    id: 'candidate-4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    mobile: '9876543213',
    countryCode: '+91',
    gender: 'Female',
    sourcingChannel: 'Indeed',
    rating: 4,
    education: 'B.Tech Information Technology',
    createdBy: 'user-2',
    createdOn: '2024-02-16T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-16T00:00:00Z'
  },
  {
    id: 'candidate-5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    mobile: '9876543214',
    countryCode: '+91',
    gender: 'Male',
    sourcingChannel: 'LinkedIn',
    rating: 5,
    education: 'MS Computer Science',
    createdBy: 'user-2',
    createdOn: '2024-02-18T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-18T00:00:00Z'
  }
]

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    candidateId: 'candidate-1',
    jobId: 'job-1',
    pipelinePriority: 1,
    totalYears: 6,
    currentJobTitle: 'Software Engineer',
    ctcInLPA: 15,
    ectcInLPA: 20,
    officialNoticePeriodInDays: 30,
    noticePeriodNegotiable: 'Yes',
    servingNoticePeriod: 'No',
    offerInHand: 'No',
    relevantExpYears: 5,
    applicationStage: 2,
    applicationStatus: 5,
    likelihoodOfJoining: 'High',
    sourcedBy: 'user-2',
    currentCompany: 'Google',
    currentLocation: 'San Francisco',
    preferredLocations: ['San Francisco', 'New York'],
    createdBy: 'user-2',
    createdOn: '2024-02-15T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-20T00:00:00Z'
  },
  {
    id: 'app-2',
    candidateId: 'candidate-2',
    jobId: 'job-2',
    pipelinePriority: 2,
    totalYears: 4,
    currentJobTitle: 'Product Analyst',
    ctcInLPA: 12,
    ectcInLPA: 16,
    officialNoticePeriodInDays: 60,
    noticePeriodNegotiable: 'Maybe',
    servingNoticePeriod: 'No',
    offerInHand: 'Advanced Stages',
    relevantExpYears: 3,
    applicationStage: 1,
    applicationStatus: 3,
    likelihoodOfJoining: 'Medium',
    sourcedBy: 'user-2',
    currentCompany: 'Microsoft',
    currentLocation: 'New York',
    preferredLocations: ['New York', 'Boston'],
    createdBy: 'user-2',
    createdOn: '2024-02-16T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-18T00:00:00Z'
  },
  {
    id: 'app-3',
    candidateId: 'candidate-3',
    jobId: 'job-1',
    pipelinePriority: 3,
    totalYears: 8,
    currentJobTitle: 'Senior Developer',
    ctcInLPA: 18,
    ectcInLPA: 25,
    officialNoticePeriodInDays: 90,
    noticePeriodNegotiable: 'No',
    servingNoticePeriod: 'No',
    offerInHand: 'Yes',
    currentOfferInLPA: 22,
    relevantExpYears: 7,
    applicationStage: 3,
    applicationStatus: 6,
    likelihoodOfJoining: 'Low',
    sourcedBy: 'user-2',
    currentCompany: 'Amazon',
    currentLocation: 'Austin',
    preferredLocations: ['Austin', 'Dallas'],
    createdBy: 'user-2',
    createdOn: '2024-02-17T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-22T00:00:00Z'
  },
  {
    id: 'app-4',
    candidateId: 'candidate-4',
    jobId: 'job-1',
    pipelinePriority: 4,
    totalYears: 2,
    currentJobTitle: 'Junior Developer',
    ctcInLPA: 8,
    ectcInLPA: 12,
    officialNoticePeriodInDays: 15,
    noticePeriodNegotiable: 'Yes',
    servingNoticePeriod: 'Already Served',
    offerInHand: 'No',
    relevantExpYears: 1,
    applicationStage: 0,
    applicationStatus: 2,
    likelihoodOfJoining: 'High',
    sourcedBy: 'user-2',
    currentCompany: 'Meta',
    currentLocation: 'San Francisco',
    preferredLocations: ['San Francisco'],
    createdBy: 'user-2',
    createdOn: '2024-02-19T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-19T00:00:00Z'
  },
  {
    id: 'app-5',
    candidateId: 'candidate-5',
    jobId: 'job-1',
    pipelinePriority: 5,
    totalYears: 5,
    currentJobTitle: 'Full Stack Developer',
    ctcInLPA: 14,
    ectcInLPA: 22,
    officialNoticePeriodInDays: 30,
    noticePeriodNegotiable: 'Yes',
    servingNoticePeriod: 'No',
    offerInHand: 'No',
    relevantExpYears: 4,
    applicationStage: 1,
    applicationStatus: 4,
    likelihoodOfJoining: 'High',
    sourcedBy: 'user-2',
    currentCompany: 'Apple',
    currentLocation: 'New York',
    preferredLocations: ['New York', 'San Francisco'],
    createdBy: 'user-2',
    createdOn: '2024-02-20T00:00:00Z',
    lastModifiedBy: 'user-2',
    lastModifiedOn: '2024-02-21T00:00:00Z'
  }
]