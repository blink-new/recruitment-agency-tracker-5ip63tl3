import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  ArrowUpDown, 
  Eye, 
  Copy, 
  FileSpreadsheet, 
  Download,
  MoreHorizontal,
  Plus,
  GripVertical
} from 'lucide-react'

export interface Column {
  key: string
  label: string
  width?: number
  sortable?: boolean
  type?: 'text' | 'number' | 'select' | 'date' | 'email' | 'phone'
  options?: string[]
  render?: (value: any, row: any) => React.ReactNode
  visible?: boolean
}

interface SpreadsheetGridProps {
  data: any[]
  columns: Column[]
  selectedRows: string[]
  onRowSelect: (rowId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onCellEdit: (rowId: string, columnKey: string, value: any) => void
  onSort: (columnKey: string, direction: 'asc' | 'desc') => void
  onAddRow: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  title: string
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void
  onColumnReorder: (columns: Column[]) => void
  exportOptions: {
    onCopyAsText: (visibleColumns: Column[]) => void
    onCopyAsSpreadsheet: (visibleColumns: Column[]) => void
    onExportToXLS: (visibleColumns: Column[]) => void
  }
}

export default function SpreadsheetGrid({
  data,
  columns,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onCellEdit,
  onSort,
  onAddRow,
  searchValue,
  onSearchChange,
  title,
  onColumnVisibilityChange,
  onColumnReorder,
  exportOptions
}: SpreadsheetGridProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length
  
  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible !== false)
  
  // Column drag and drop handlers
  const handleColumnDragStart = (columnKey: string) => {
    setDraggedColumn(columnKey)
  }
  
  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleColumnDrop = (targetColumnKey: string) => {
    if (!draggedColumn || draggedColumn === targetColumnKey) return
    
    const newColumns = [...columns]
    const draggedIndex = newColumns.findIndex(col => col.key === draggedColumn)
    const targetIndex = newColumns.findIndex(col => col.key === targetColumnKey)
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedCol] = newColumns.splice(draggedIndex, 1)
      newColumns.splice(targetIndex, 0, draggedCol)
      onColumnReorder(newColumns)
    }
    
    setDraggedColumn(null)
  }

  const handleCellClick = useCallback((rowId: string, columnKey: string, currentValue: any) => {
    setEditingCell({ rowId, columnKey })
    setEditValue(currentValue?.toString() || '')
  }, [])

  const handleCellSave = useCallback(() => {
    if (editingCell) {
      onCellEdit(editingCell.rowId, editingCell.columnKey, editValue)
      setEditingCell(null)
      setEditValue('')
    }
  }, [editingCell, editValue, onCellEdit])

  const handleCellCancel = useCallback(() => {
    setEditingCell(null)
    setEditValue('')
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave()
    } else if (e.key === 'Escape') {
      handleCellCancel()
    }
  }, [handleCellSave, handleCellCancel])

  const handleSort = useCallback((columnKey: string) => {
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(columnKey)
    setSortDirection(newDirection)
    onSort(columnKey, newDirection)
  }, [sortColumn, sortDirection, onSort])

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const renderCell = (row: any, column: Column) => {
    const value = row[column.key]
    const isEditing = editingCell?.rowId === row.id && editingCell?.columnKey === column.key

    if (isEditing) {
      if (column.type === 'select' && column.options) {
        return (
          <Select
            value={editValue}
            onValueChange={(newValue) => {
              setEditValue(newValue)
              onCellEdit(row.id, column.key, newValue)
              setEditingCell(null)
            }}
          >
            <SelectTrigger className="h-8 border-2 border-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {column.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      return (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleCellSave}
          onKeyDown={handleKeyDown}
          className="h-8 border-2 border-blue-500"
          type={column.type === 'number' ? 'number' : 'text'}
        />
      )
    }

    return (
      <div
        className="px-3 py-2 cursor-pointer hover:bg-gray-50 min-h-[32px] flex items-center"
        onClick={() => handleCellClick(row.id, column.key, value)}
      >
        {column.render ? column.render(value, row) : (value?.toString() || '')}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Column Visibility */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Column Visibility</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-move"
                      draggable
                      onDragStart={() => handleColumnDragStart(column.key)}
                      onDragOver={handleColumnDragOver}
                      onDrop={() => handleColumnDrop(column.key)}
                    >
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <Checkbox
                        checked={column.visible !== false}
                        onCheckedChange={(checked) => 
                          onColumnVisibilityChange(column.key, !!checked)
                        }
                      />
                      <span className="text-sm flex-1">{column.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportOptions.onCopyAsText(visibleColumns)}
            disabled={selectedRows.length === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy As Text
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportOptions.onCopyAsSpreadsheet(visibleColumns)}
            disabled={selectedRows.length === 0}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Copy As Spreadsheet
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportOptions.onExportToXLS(visibleColumns)}
            disabled={selectedRows.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export to XLS
          </Button>

          <Button onClick={onAddRow} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add {title.slice(0, -1)}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="w-12 p-3 border-b border-gray-200">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                />
              </th>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "p-3 text-left text-sm font-medium text-gray-900 border-b border-gray-200",
                    column.sortable && "cursor-pointer hover:bg-gray-100"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12 p-3 border-b border-gray-200">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-gray-100 hover:bg-gray-50",
                  selectedRows.includes(row.id) && "bg-blue-50"
                )}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={(checked) => onRowSelect(row.id, !!checked)}
                  />
                </td>
                {visibleColumns.map((column) => (
                  <td
                    key={column.key}
                    className="border-b border-gray-100"
                    style={{ width: column.width }}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          {selectedRows.length > 0 ? (
            `${selectedRows.length} of ${data.length} selected`
          ) : (
            `${data.length} total records`
          )}
        </div>
      </div>
    </div>
  )
}