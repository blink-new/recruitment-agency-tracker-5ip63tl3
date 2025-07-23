import { useState, useMemo } from 'react'
import { mockCandidates } from '@/data/mockData'
import { Candidate } from '@/types'
import SpreadsheetGrid, { Column } from '@/components/SpreadsheetGrid'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

  const columns: Column[] = [
    {
      key: 'firstName',
      label: 'First Name',
      width: 120,
      sortable: true,
      type: 'text'
    },
    {
      key: 'lastName',
      label: 'Last Name',
      width: 120,
      sortable: true,
      type: 'text'
    },
    {
      key: 'email',
      label: 'Email',
      width: 200,
      sortable: true,
      type: 'email'
    },
    {
      key: 'mobile',
      label: 'Phone',
      width: 130,
      type: 'phone',
      render: (value, row) => `${row.countryCode} ${value}`
    },
    {
      key: 'gender',
      label: 'Gender',
      width: 100,
      type: 'select',
      options: GENDERS
    },
    {
      key: 'sourcingChannel',
      label: 'Sourcing Channel',
      width: 140,
      type: 'select',
      options: SOURCING_CHANNELS
    },
    {
      key: 'rating',
      label: 'Rating',
      width: 120,
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
      type: 'text'
    },
    {
      key: 'createdOn',
      label: 'Created On',
      width: 120,
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

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

  const getSelectedCandidates = () => {
    return candidates.filter(candidate => selectedRows.includes(candidate.id))
  }

  const handleCopyAsText = () => {
    const selectedCandidates = getSelectedCandidates()
    const textContent = selectedCandidates.map(candidate => {
      return `<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${candidate.firstName} ${candidate.lastName}</h3>
        <p><strong>Email:</strong> ${candidate.email}</p>
        <p><strong>Phone:</strong> ${candidate.countryCode} ${candidate.mobile}</p>
        <p><strong>Gender:</strong> ${candidate.gender || 'Not specified'}</p>
        <p><strong>Sourcing Channel:</strong> ${candidate.sourcingChannel || 'Not specified'}</p>
        <p><strong>Education:</strong> ${candidate.education || 'Not specified'}</p>
        <p><strong>Rating:</strong> ${'★'.repeat(candidate.rating)}${'☆'.repeat(5 - candidate.rating)}</p>
      </div>`
    }).join('')

    navigator.clipboard.writeText(textContent)
    toast({
      title: "Copied as text",
      description: `${selectedCandidates.length} candidates copied in HTML format.`,
    })
  }

  const handleCopyAsSpreadsheet = () => {
    const selectedCandidates = getSelectedCandidates()
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Sourcing Channel', 'Education', 'Rating']
    const rows = selectedCandidates.map(candidate => [
      candidate.firstName,
      candidate.lastName,
      candidate.email,
      `${candidate.countryCode} ${candidate.mobile}`,
      candidate.gender || '',
      candidate.sourcingChannel || '',
      candidate.education || '',
      candidate.rating.toString()
    ])

    const tsvContent = [headers, ...rows].map(row => row.join('\t')).join('\n')
    navigator.clipboard.writeText(tsvContent)
    toast({
      title: "Copied as spreadsheet",
      description: `${selectedCandidates.length} candidates copied in spreadsheet format.`,
    })
  }

  const handleExportToXLS = () => {
    const selectedCandidates = getSelectedCandidates()
    // In a real app, you would use a library like xlsx to generate the file
    toast({
      title: "Export to XLS",
      description: `Would export ${selectedCandidates.length} candidates to Excel file.`,
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
        exportOptions={{
          onCopyAsText: handleCopyAsText,
          onCopyAsSpreadsheet: handleCopyAsSpreadsheet,
          onExportToXLS: handleExportToXLS
        }}
      />
    </div>
  )
}