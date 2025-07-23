import { useState, useMemo } from 'react'
import { mockApplications, mockCandidates, mockJobs } from '@/data/mockData'
import { Application, APPLICATION_STATUS_LABELS, APPLICATION_STAGE_LABELS } from '@/types'
import SpreadsheetGrid, { Column } from '@/components/SpreadsheetGrid'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

const NOTICE_PERIOD_OPTIONS = ['0', '15', '30', '45', '60', '90']
const YES_NO_MAYBE_OPTIONS = ['Yes', 'No', 'Maybe']
const YES_NO_OPTIONS = ['Yes', 'No']
const SERVING_NOTICE_OPTIONS = ['Yes', 'No', 'Already Served']
const OFFER_IN_HAND_OPTIONS = ['Yes', 'No', 'Advanced Stages']
const LIKELIHOOD_OPTIONS = ['Low', 'Medium', 'High']

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { toast } = useToast()

  // Create lookup maps for display
  const candidateMap = useMemo(() => {
    return mockCandidates.reduce((acc, candidate) => {
      acc[candidate.id] = `${candidate.firstName} ${candidate.lastName}`
      return acc
    }, {} as Record<string, string>)
  }, [])

  const jobMap = useMemo(() => {
    return mockJobs.reduce((acc, job) => {
      acc[job.id] = job.jobTitle
      return acc
    }, {} as Record<string, string>)
  }, [])

  const getStatusBadgeColor = (status: number) => {
    if (status >= 8 && status <= 11) return 'bg-green-100 text-green-800'
    if (status >= 5 && status <= 7) return 'bg-blue-100 text-blue-800'
    if (status >= 2 && status <= 4) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStageBadgeColor = (stage: number) => {
    const colors = {
      0: 'bg-gray-100 text-gray-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-purple-100 text-purple-800',
      4: 'bg-green-100 text-green-800'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const columns: Column[] = [
    {
      key: 'candidateId',
      label: 'Candidate',
      width: 150,
      sortable: true,
      render: (value) => candidateMap[value] || 'Unknown'
    },
    {
      key: 'jobId',
      label: 'Job',
      width: 180,
      sortable: true,
      render: (value) => jobMap[value] || 'Unknown'
    },
    {
      key: 'pipelinePriority',
      label: 'Priority',
      width: 80,
      type: 'number'
    },
    {
      key: 'totalYears',
      label: 'Total Exp',
      width: 90,
      type: 'number',
      render: (value) => `${value} yrs`
    },
    {
      key: 'currentJobTitle',
      label: 'Current Role',
      width: 150,
      type: 'text'
    },
    {
      key: 'ctcInLPA',
      label: 'Current CTC',
      width: 100,
      type: 'number',
      render: (value) => `${value} LPA`
    },
    {
      key: 'ectcInLPA',
      label: 'Expected CTC',
      width: 110,
      type: 'number',
      render: (value) => `${value} LPA`
    },
    {
      key: 'officialNoticePeriodInDays',
      label: 'Notice Period',
      width: 110,
      type: 'select',
      options: NOTICE_PERIOD_OPTIONS,
      render: (value) => `${value} days`
    },
    {
      key: 'noticePeriodNegotiable',
      label: 'NP Negotiable',
      width: 110,
      type: 'select',
      options: YES_NO_MAYBE_OPTIONS
    },
    {
      key: 'servingNoticePeriod',
      label: 'Serving NP',
      width: 100,
      type: 'select',
      options: SERVING_NOTICE_OPTIONS
    },
    {
      key: 'offerInHand',
      label: 'Offer in Hand',
      width: 110,
      type: 'select',
      options: OFFER_IN_HAND_OPTIONS
    },
    {
      key: 'currentOfferInLPA',
      label: 'Current Offer',
      width: 110,
      type: 'number',
      render: (value) => value ? `${value} LPA` : '-'
    },
    {
      key: 'applicationStage',
      label: 'Stage',
      width: 120,
      render: (value) => (
        <Badge className={getStageBadgeColor(value)}>
          {APPLICATION_STAGE_LABELS[value as keyof typeof APPLICATION_STAGE_LABELS]}
        </Badge>
      )
    },
    {
      key: 'applicationStatus',
      label: 'Status',
      width: 140,
      render: (value) => (
        <Badge className={getStatusBadgeColor(value)}>
          {APPLICATION_STATUS_LABELS[value as keyof typeof APPLICATION_STATUS_LABELS]}
        </Badge>
      )
    },
    {
      key: 'likelihoodOfJoining',
      label: 'Likelihood',
      width: 100,
      type: 'select',
      options: LIKELIHOOD_OPTIONS,
      render: (value) => {
        const colors = {
          'High': 'bg-green-100 text-green-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-red-100 text-red-800'
        }
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        )
      }
    },
    {
      key: 'currentCompany',
      label: 'Current Company',
      width: 140,
      type: 'text'
    },
    {
      key: 'currentLocation',
      label: 'Location',
      width: 120,
      type: 'text'
    },
    {
      key: 'createdOn',
      label: 'Applied On',
      width: 110,
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  const filteredAndSortedData = useMemo(() => {
    const filtered = applications.filter((application) => {
      const candidateName = candidateMap[application.candidateId] || ''
      const jobTitle = jobMap[application.jobId] || ''
      const searchText = searchValue.toLowerCase()
      
      return (
        candidateName.toLowerCase().includes(searchText) ||
        jobTitle.toLowerCase().includes(searchText) ||
        application.currentJobTitle.toLowerCase().includes(searchText) ||
        application.currentCompany.toLowerCase().includes(searchText) ||
        application.currentLocation.toLowerCase().includes(searchText)
      )
    })

    if (sortColumn) {
      filtered.sort((a, b) => {
        let aValue = a[sortColumn as keyof Application]
        let bValue = b[sortColumn as keyof Application]
        
        // Handle candidate and job lookups for sorting
        if (sortColumn === 'candidateId') {
          aValue = candidateMap[a.candidateId]
          bValue = candidateMap[b.candidateId]
        } else if (sortColumn === 'jobId') {
          aValue = jobMap[a.jobId]
          bValue = jobMap[b.jobId]
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [applications, searchValue, sortColumn, sortDirection, candidateMap, jobMap])

  const handleRowSelect = (rowId: string, selected: boolean) => {
    setSelectedRows(prev => 
      selected 
        ? [...prev, rowId]
        : prev.filter(id => id !== rowId)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? filteredAndSortedData.map(row => row.id) : [])
  }

  const handleCellEdit = (rowId: string, columnKey: string, value: any) => {
    setApplications(prev => 
      prev.map(application => 
        application.id === rowId 
          ? { ...application, [columnKey]: value, lastModifiedOn: new Date().toISOString() }
          : application
      )
    )
    toast({
      title: "Cell updated",
      description: "The application information has been updated successfully.",
    })
  }

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortColumn(columnKey)
    setSortDirection(direction)
  }

  const handleAddRow = () => {
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      candidateId: mockCandidates[0]?.id || '',
      jobId: mockJobs[0]?.id || '',
      totalYears: 0,
      currentJobTitle: '',
      ctcInLPA: 0,
      ectcInLPA: 0,
      officialNoticePeriodInDays: 30,
      noticePeriodNegotiable: 'Maybe',
      servingNoticePeriod: 'No',
      offerInHand: 'No',
      relevantExpYears: 0,
      applicationStage: 0,
      applicationStatus: 0,
      likelihoodOfJoining: 'Medium',
      sourcedBy: 'user-2',
      currentCompany: '',
      currentLocation: '',
      preferredLocations: [],
      createdBy: 'user-2',
      createdOn: new Date().toISOString(),
      lastModifiedBy: 'user-2',
      lastModifiedOn: new Date().toISOString()
    }
    setApplications(prev => [newApplication, ...prev])
    toast({
      title: "New application added",
      description: "A new application row has been created. Click on cells to edit.",
    })
  }

  const getSelectedApplications = () => {
    return applications.filter(application => selectedRows.includes(application.id))
  }

  const handleCopyAsText = () => {
    const selectedApplications = getSelectedApplications()
    const textContent = selectedApplications.map(app => {
      const candidateName = candidateMap[app.candidateId] || 'Unknown'
      const jobTitle = jobMap[app.jobId] || 'Unknown'
      
      return `<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${candidateName} - ${jobTitle}</h3>
        <p><strong>Current Role:</strong> ${app.currentJobTitle} at ${app.currentCompany}</p>
        <p><strong>Experience:</strong> ${app.totalYears} years total, ${app.relevantExpYears} years relevant</p>
        <p><strong>CTC:</strong> Current ${app.ctcInLPA} LPA, Expected ${app.ectcInLPA} LPA</p>
        <p><strong>Notice Period:</strong> ${app.officialNoticePeriodInDays} days (${app.noticePeriodNegotiable} negotiable)</p>
        <p><strong>Location:</strong> ${app.currentLocation}</p>
        <p><strong>Status:</strong> ${APPLICATION_STATUS_LABELS[app.applicationStatus as keyof typeof APPLICATION_STATUS_LABELS]}</p>
        <p><strong>Likelihood:</strong> ${app.likelihoodOfJoining}</p>
      </div>`
    }).join('')

    navigator.clipboard.writeText(textContent)
    toast({
      title: "Copied as text",
      description: `${selectedApplications.length} applications copied in HTML format.`,
    })
  }

  const handleCopyAsSpreadsheet = () => {
    const selectedApplications = getSelectedApplications()
    const headers = [
      'Candidate', 'Job', 'Current Role', 'Company', 'Total Exp', 'Current CTC', 
      'Expected CTC', 'Notice Period', 'Location', 'Status', 'Likelihood'
    ]
    const rows = selectedApplications.map(app => [
      candidateMap[app.candidateId] || 'Unknown',
      jobMap[app.jobId] || 'Unknown',
      app.currentJobTitle,
      app.currentCompany,
      `${app.totalYears} yrs`,
      `${app.ctcInLPA} LPA`,
      `${app.ectcInLPA} LPA`,
      `${app.officialNoticePeriodInDays} days`,
      app.currentLocation,
      APPLICATION_STATUS_LABELS[app.applicationStatus as keyof typeof APPLICATION_STATUS_LABELS],
      app.likelihoodOfJoining
    ])

    const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n')
    navigator.clipboard.writeText(tsvContent)
    toast({
      title: "Copied as spreadsheet",
      description: `${selectedApplications.length} applications copied in spreadsheet format.`,
    })
  }

  const handleExportToXLS = () => {
    const selectedApplications = getSelectedApplications()
    toast({
      title: "Export to XLS",
      description: `Would export ${selectedApplications.length} applications to Excel file.`,
    })
  }

  return (
    <div className="h-full">
      <SpreadsheetGrid
        data={filteredAndSortedData}
        columns={columns}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={handleSelectAll}
        onCellEdit={handleCellEdit}
        onSort={handleSort}
        onAddRow={handleAddRow}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        title="Applications"
        exportOptions={{
          onCopyAsText: handleCopyAsText,
          onCopyAsSpreadsheet: handleCopyAsSpreadsheet,
          onExportToXLS: handleExportToXLS
        }}
      />
    </div>
  )
}