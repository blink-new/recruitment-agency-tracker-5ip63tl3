import { useState, useMemo } from 'react'
import { mockCandidates } from '@/data/mockData'
import { Candidate } from '@/types'
import SpreadsheetGrid, { Column } from '@/components/SpreadsheetGrid'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'

const SOURCING_CHANNELS = [
  'LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Company Website', 'Job Portal'
]

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { toast } = useToast()

  // Column configuration with visibility management
  const [columns, setColumns] = useState<Column[]>([
    {
      key: 'firstName',
      label: 'First Name',
      width: 120,
      sortable: true,
      type: 'text',
      visible: true
    },
    {
      key: 'lastName',
      label: 'Last Name',
      width: 120,
      sortable: true,
      type: 'text',
      visible: true
    },
    {
      key: 'email',
      label: 'Email',
      width: 200,
      sortable: true,
      type: 'email',
      visible: true
    },
    {
      key: 'mobile',
      label: 'Mobile',
      width: 130,
      type: 'phone',
      visible: true,
      render: (value, row) => `${row.countryCode} ${value}`
    },
    {
      key: 'gender',
      label: 'Gender',
      width: 100,
      type: 'select',
      options: GENDERS,
      visible: true
    },
    {
      key: 'sourcingChannel',
      label: 'Sourcing Channel',
      width: 140,
      type: 'select',
      options: SOURCING_CHANNELS,
      visible: true
    },
    {
      key: 'rating',
      label: 'Rating',
      width: 120,
      visible: true,
      render: (value) => (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )
    },
    {
      key: 'education',
      label: 'Education',
      width: 180,
      type: 'text',
      visible: true
    },
    {
      key: 'url',
      label: 'URL',
      width: 200,
      type: 'text',
      visible: false
    },
    {
      key: 'tags',
      label: 'Tags',
      width: 150,
      type: 'text',
      visible: false,
      render: (value) => value ? (
        <div className="flex flex-wrap gap-1">
          {(Array.isArray(value) ? value : [value]).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null
    },
    {
      key: 'resumeAttachment',
      label: 'Resume',
      width: 100,
      visible: false,
      render: (value) => value ? (
        <Badge variant="outline">Attached</Badge>
      ) : (
        <Badge variant="secondary">None</Badge>
      )
    },
    {
      key: 'profilePicture',
      label: 'Profile Picture',
      width: 120,
      visible: false,
      render: (value) => value ? (
        <Badge variant="outline">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
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
    const filtered = candidates.filter((candidate) =>
      Object.values(candidate).some((value) =>
        value?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    )

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof Candidate]
        const bValue = b[sortColumn as keyof Candidate]
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [candidates, searchValue, sortColumn, sortDirection])

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
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === rowId 
          ? { ...candidate, [columnKey]: value, lastModifiedOn: new Date().toISOString() }
          : candidate
      )
    )
    toast({
      title: "Cell updated",
      description: "The candidate information has been updated successfully.",
    })
  }

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortColumn(columnKey)
    setSortDirection(direction)
  }

  const handleAddRow = () => {
    const newCandidate: Candidate = {
      id: `candidate-${Date.now()}`,
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      countryCode: '+91',
      rating: 3,
      createdBy: 'user-2',
      createdOn: new Date().toISOString(),
      lastModifiedBy: 'user-2',
      lastModifiedOn: new Date().toISOString()
    }
    setCandidates(prev => [newCandidate, ...prev])
    toast({
      title: "New candidate added",
      description: "A new candidate row has been created. Click on cells to edit.",
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

  const getSelectedCandidates = () => {
    return candidates.filter(candidate => selectedRows.includes(candidate.id))
  }

  const handleCopyAsText = async (visibleColumns: Column[]) => {
    const selectedCandidates = getSelectedCandidates()
    
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select candidates to copy.",
        variant: "destructive"
      })
      return
    }
    
    // Create simple, clean text format that looks professional in emails
    const textContent = selectedCandidates.map((candidate, index) => {
      const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim()
      const phone = `${candidate.countryCode} ${candidate.mobile}`.trim()
      
      return `${index + 1}. ${fullName}
Phone: ${phone}
Email: ${candidate.email || ''}
Education: ${candidate.education || 'Not specified'}
Sourcing Channel: ${candidate.sourcingChannel || 'Not specified'}
Rating: ${candidate.rating}/5`
    }).join('\n\n')

    // Add header text
    const fullContent = `Dear Client,

Please find below the candidate details:

${textContent}`

    try {
      await navigator.clipboard.writeText(fullContent)
      toast({
        title: "Copied as text",
        description: `${selectedCandidates.length} candidates copied in text format for email.`,
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
    const selectedCandidates = getSelectedCandidates()
    
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select candidates to export.",
        variant: "destructive"
      })
      return
    }

    // Create HTML table headers based on visible columns
    const headers = visibleColumns.map(col => 
      `<th style="border: 1px solid #ccc; padding: 8px; text-align: left; background-color: #f5f5f5;">${col.label}</th>`
    ).join('')

    // Create HTML table rows based on visible columns
    const tableRows = selectedCandidates.map(candidate => {
      const cells = visibleColumns.map(col => {
        let value = candidate[col.key as keyof Candidate]
        
        // Handle special rendering
        if (col.key === 'mobile') {
          value = `${candidate.countryCode} ${candidate.mobile}`
        } else if (col.key === 'rating') {
          value = `${value}/5`
        } else if (col.key === 'createdOn' || col.key === 'lastModifiedOn') {
          value = new Date(value as string).toLocaleDateString()
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
        description: `${selectedCandidates.length} candidates copied as HTML table. Paste into email.`,
      })
    } catch (error) {
      // Fallback for browsers that don't support ClipboardItem
      try {
        await navigator.clipboard.writeText(htmlTable)
        toast({
          title: "Copied as spreadsheet",
          description: `${selectedCandidates.length} candidates copied. Paste into email.`,
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
    const selectedCandidates = getSelectedCandidates()
    
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select candidates to export.",
        variant: "destructive"
      })
      return
    }

    // Prepare data for Excel export based on visible columns
    const exportData = selectedCandidates.map(candidate => {
      const row: any = {}
      
      visibleColumns.forEach(col => {
        let value = candidate[col.key as keyof Candidate]
        
        // Handle special formatting
        if (col.key === 'mobile') {
          value = `${candidate.countryCode} ${candidate.mobile}`
        } else if (col.key === 'rating') {
          value = `${value}/5`
        } else if (col.key === 'createdOn' || col.key === 'lastModifiedOn') {
          value = new Date(value as string).toLocaleDateString()
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
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `candidates-export-${timestamp}.xlsx`

    // Save file
    XLSX.writeFile(wb, filename)

    toast({
      title: "Export successful",
      description: `${selectedCandidates.length} candidates exported to ${filename}`,
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
        title="Candidates"
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