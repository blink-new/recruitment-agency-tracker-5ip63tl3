import { useState, useMemo } from 'react'
import { mockApplications, mockCandidates, mockJobs } from '@/data/mockData'
import { Application, APPLICATION_STATUS_LABELS, APPLICATION_STAGE_LABELS } from '@/types'
import SpreadsheetGrid, { Column } from '@/components/SpreadsheetGrid'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'

const NOTICE_PERIOD_OPTIONS = ['0', '15', '30', '45', '60', '90']
const NOTICE_PERIOD_NEGOTIABLE_OPTIONS = ['Yes', 'Maybe', 'No']
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

  // Column configuration with visibility management
  const [columns, setColumns] = useState<Column[]>([
    {
      key: 'candidateName',
      label: 'Candidate Name',
      width: 150,
      sortable: true,
      visible: true,
      render: (_, row) => {
        const candidate = mockCandidates.find(c => c.id === row.candidateId)
        return candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'
      }
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      width: 180,
      sortable: true,
      visible: true,
      render: (_, row) => {
        const job = mockJobs.find(j => j.id === row.jobId)
        return job ? job.jobTitle : 'Unknown Job'
      }
    },
    {
      key: 'pipelinePriority',
      label: 'Pipeline Priority',
      width: 120,
      type: 'number',
      sortable: true,
      visible: true
    },
    {
      key: 'totalYears',
      label: 'Total Years',
      width: 100,
      type: 'number',
      sortable: true,
      visible: true
    },
    {
      key: 'currentJobTitle',
      label: 'Current Job Title',
      width: 180,
      type: 'text',
      visible: true
    },
    {
      key: 'ctcInLPA',
      label: 'CTC (LPA)',
      width: 100,
      type: 'number',
      sortable: true,
      visible: true,
      render: (value) => `₹${value} LPA`
    },
    {
      key: 'ectcInLPA',
      label: 'ECTC (LPA)',
      width: 100,
      type: 'number',
      sortable: true,
      visible: true,
      render: (value) => `₹${value} LPA`
    },
    {
      key: 'officialNoticePeriodInDays',
      label: 'Notice Period (Days)',
      width: 140,
      type: 'select',
      options: NOTICE_PERIOD_OPTIONS,
      visible: true,
      render: (value) => `${value} days`
    },
    {
      key: 'noticePeriodNegotiable',
      label: 'Notice Negotiable',
      width: 130,
      type: 'select',
      options: NOTICE_PERIOD_NEGOTIABLE_OPTIONS,
      visible: true,
      render: (value) => (
        <Badge variant={value === 'Yes' ? 'default' : value === 'Maybe' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'servingNoticePeriod',
      label: 'Serving Notice',
      width: 120,
      type: 'select',
      options: SERVING_NOTICE_OPTIONS,
      visible: true,
      render: (value) => (
        <Badge variant={value === 'Yes' ? 'destructive' : value === 'Already Served' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'offerInHand',
      label: 'Offer In Hand',
      width: 120,
      type: 'select',
      options: OFFER_IN_HAND_OPTIONS,
      visible: true,
      render: (value) => (
        <Badge variant={value === 'Yes' ? 'destructive' : value === 'Advanced Stages' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'applicationStage',
      label: 'Application Stage',
      width: 140,
      type: 'select',
      options: Object.keys(APPLICATION_STAGE_LABELS),
      visible: true,
      render: (value) => (
        <Badge variant="outline">
          {APPLICATION_STAGE_LABELS[value as keyof typeof APPLICATION_STAGE_LABELS]}
        </Badge>
      )
    },
    {
      key: 'applicationStatus',
      label: 'Application Status',
      width: 150,
      type: 'select',
      options: Object.keys(APPLICATION_STATUS_LABELS),
      visible: true,
      render: (value) => (
        <Badge variant="default">
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
      visible: true,
      render: (value) => (
        <Badge variant={value === 'High' ? 'default' : value === 'Medium' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'relevantExpYears',
      label: 'Relevant Exp',
      width: 120,
      type: 'number',
      visible: true,
      render: (value) => `${value} years`
    },
    {
      key: 'currentCompany',
      label: 'Current Company',
      width: 150,
      type: 'text',
      visible: false
    },
    {
      key: 'currentLocation',
      label: 'Current Location',
      width: 140,
      type: 'text',
      visible: false
    },
    {
      key: 'internalComments',
      label: 'Internal Comments',
      width: 200,
      type: 'text',
      visible: false
    },
    {
      key: 'datavrutiComments',
      label: 'Datavruti Comments',
      width: 200,
      type: 'text',
      visible: false
    },
    {
      key: 'ctcBreakup',
      label: 'CTC Breakup',
      width: 150,
      type: 'text',
      visible: false
    },
    {
      key: 'currentOfferInLPA',
      label: 'Current Offer (LPA)',
      width: 140,
      type: 'number',
      visible: false,
      render: (value) => value ? `₹${value} LPA` : 'N/A'
    },
    {
      key: 'lastWorkingDate',
      label: 'Last Working Date',
      width: 140,
      type: 'date',
      visible: false,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'earliestJoiningDate',
      label: 'Earliest Joining',
      width: 140,
      type: 'date',
      visible: false,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'reasonForChange',
      label: 'Reason For Change',
      width: 180,
      type: 'text',
      visible: false
    },
    {
      key: 'dateOfJoining',
      label: 'Date Of Joining',
      width: 140,
      type: 'date',
      visible: false,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'reasonForRejectDrop',
      label: 'Reason For Reject/Drop',
      width: 180,
      type: 'text',
      visible: false
    },
    {
      key: 'latestResumeAttachment',
      label: 'Latest Resume',
      width: 120,
      visible: false,
      render: (value) => value ? (
        <Badge variant="outline">Attached</Badge>
      ) : (
        <Badge variant="secondary">None</Badge>
      )
    },
    {
      key: 'createdOn',
      label: 'Created On',
      width: 120,
      sortable: true,
      visible: false,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ])

  const filteredAndSortedData = useMemo(() => {
    const filtered = applications.filter((application) =>
      Object.values(application).some((value) =>
        value?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    )

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof Application]
        const bValue = b[sortColumn as keyof Application]
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [applications, searchValue, sortColumn, sortDirection])

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
      candidateId: '',
      jobId: '',
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

  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    )
  }

  const handleColumnReorder = (newColumns: Column[]) => {
    setColumns(newColumns)
  }

  const getSelectedApplications = () => {
    return applications.filter(application => selectedRows.includes(application.id))
  }

  const handleCopyAsText = async (visibleColumns: Column[]) => {
    const selectedApplications = getSelectedApplications()
    
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select applications to copy.",
        variant: "destructive"
      })
      return
    }
    
    // Create simple, clean text format that looks professional in emails
    const textContent = selectedApplications.map((application, index) => {
      const candidate = mockCandidates.find(c => c.id === application.candidateId)
      const job = mockJobs.find(j => j.id === application.jobId)
      const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'
      
      return `${index + 1}. ${candidateName}
Job: ${job?.jobTitle || 'Unknown Job'}
Current Role: ${application.currentJobTitle}
Experience: ${application.totalYears} years (${application.relevantExpYears} relevant)
Current CTC: ₹${application.ctcInLPA} LPA
Expected CTC: ₹${application.ectcInLPA} LPA
Notice Period: ${application.officialNoticePeriodInDays} days (${application.noticePeriodNegotiable} negotiable)
Status: ${APPLICATION_STATUS_LABELS[application.applicationStatus as keyof typeof APPLICATION_STATUS_LABELS]}
Likelihood: ${application.likelihoodOfJoining}`
    }).join('\n\n')

    // Add header text
    const fullContent = `Dear Client,

Please find below the application details:

${textContent}`

    try {
      await navigator.clipboard.writeText(fullContent)
      toast({
        title: "Copied as text",
        description: `${selectedApplications.length} applications copied in text format for email.`,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCopyAsSpreadsheet = async (visibleColumns: Column[]) => {
    const selectedApplications = getSelectedApplications()
    
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select applications to export.",
        variant: "destructive"
      })
      return
    }

    // Create HTML table headers based on visible columns
    const headers = visibleColumns.map(col => 
      `<th style="border: 1px solid #ccc; padding: 8px; text-align: left; background-color: #f5f5f5;">${col.label}</th>`
    ).join('')

    // Create HTML table rows based on visible columns
    const tableRows = selectedApplications.map(application => {
      const cells = visibleColumns.map(col => {
        let value: any = application[col.key as keyof Application]
        
        // Handle special rendering
        if (col.key === 'candidateName') {
          const candidate = mockCandidates.find(c => c.id === application.candidateId)
          value = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'
        } else if (col.key === 'jobTitle') {
          const job = mockJobs.find(j => j.id === application.jobId)
          value = job ? job.jobTitle : 'Unknown Job'
        } else if (col.key === 'ctcInLPA' || col.key === 'ectcInLPA') {
          value = `₹${value} LPA`
        } else if (col.key === 'officialNoticePeriodInDays') {
          value = `${value} days`
        } else if (col.key === 'relevantExpYears') {
          value = `${value} years`
        } else if (col.key === 'applicationStage') {
          value = APPLICATION_STAGE_LABELS[value as keyof typeof APPLICATION_STAGE_LABELS]
        } else if (col.key === 'applicationStatus') {
          value = APPLICATION_STATUS_LABELS[value as keyof typeof APPLICATION_STATUS_LABELS]
        } else if (col.key === 'createdOn' || col.key === 'lastModifiedOn' || col.key === 'dateOfJoining' || col.key === 'lastWorkingDate' || col.key === 'earliestJoiningDate') {
          value = value ? new Date(value as string).toLocaleDateString() : 'N/A'
        } else if (Array.isArray(value)) {
          value = value.join(', ')
        }
        
        return `<td style="border: 1px solid #ccc; padding: 8px;">${value || ''}</td>`
      }).join('')
      
      return `<tr>${cells}</tr>`
    }).join('')

    // Create complete HTML table with proper styling for email clients
    const htmlTable = `<p>Dear Client,</p>
<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
  <thead>
    <tr>${headers}</tr>
  </thead>
  <tbody>
    ${tableRows}
  </tbody>
</table>`

    try {
      // Use ClipboardItem API for proper HTML copying
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlTable], { type: 'text/html' }),
        'text/plain': new Blob([htmlTable.replace(/<[^>]*>/g, '')], { type: 'text/plain' })
      })
      
      await navigator.clipboard.write([clipboardItem])
      
      toast({
        title: "Copied as spreadsheet",
        description: `${selectedApplications.length} applications copied as HTML table. Paste into email.`,
      })
    } catch (error) {
      // Fallback for browsers that don't support ClipboardItem
      try {
        await navigator.clipboard.writeText(htmlTable)
        toast({
          title: "Copied as spreadsheet",
          description: `${selectedApplications.length} applications copied. Paste into email.`,
        })
      } catch (fallbackError) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const handleExportToXLS = (visibleColumns: Column[]) => {
    const selectedApplications = getSelectedApplications()
    
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select applications to export.",
        variant: "destructive"
      })
      return
    }

    // Prepare data for Excel export based on visible columns
    const exportData = selectedApplications.map(application => {
      const row: any = {}
      
      visibleColumns.forEach(col => {
        let value: any = application[col.key as keyof Application]
        
        // Handle special formatting
        if (col.key === 'candidateName') {
          const candidate = mockCandidates.find(c => c.id === application.candidateId)
          value = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'
        } else if (col.key === 'jobTitle') {
          const job = mockJobs.find(j => j.id === application.jobId)
          value = job ? job.jobTitle : 'Unknown Job'
        } else if (col.key === 'ctcInLPA' || col.key === 'ectcInLPA') {
          value = `₹${value} LPA`
        } else if (col.key === 'officialNoticePeriodInDays') {
          value = `${value} days`
        } else if (col.key === 'relevantExpYears') {
          value = `${value} years`
        } else if (col.key === 'applicationStage') {
          value = APPLICATION_STAGE_LABELS[value as keyof typeof APPLICATION_STAGE_LABELS]
        } else if (col.key === 'applicationStatus') {
          value = APPLICATION_STATUS_LABELS[value as keyof typeof APPLICATION_STATUS_LABELS]
        } else if (col.key === 'createdOn' || col.key === 'lastModifiedOn' || col.key === 'dateOfJoining' || col.key === 'lastWorkingDate' || col.key === 'earliestJoiningDate') {
          value = value ? new Date(value as string).toLocaleDateString() : 'N/A'
        } else if (Array.isArray(value)) {
          value = value.join(', ')
        }
        
        row[col.label] = value || ''
      })
      
      return row
    })

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)

    // Set column widths based on visible columns
    const colWidths = visibleColumns.map(col => ({ wch: col.width ? col.width / 8 : 15 }))
    ws['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Applications')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `applications-export-${timestamp}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)

    toast({
      title: "Export successful",
      description: `${selectedApplications.length} applications exported to ${filename}`,
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
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onColumnReorder={handleColumnReorder}
        exportOptions={{
          onCopyAsText: handleCopyAsText,
          onCopyAsSpreadsheet: handleCopyAsSpreadsheet,
          onExportToXLS: handleExportToXLS
        }}
      />
    </div>
  )
}