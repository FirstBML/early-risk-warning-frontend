"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportToCSV } from "@/lib/utils-defi"

interface Column {
  header: string
  accessor: string
  formatter?: (value: any, row: any) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
  loading?: boolean
  itemsPerPage?: number
  exportFilename?: string
}

export function DataTable({
  columns,
  data,
  onRowClick,
  loading = false,
  itemsPerPage = 20,
  exportFilename = "data",
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const safeData = useMemo(() => {
    return Array.isArray(data) ? data : []
  }, [data])

  const sortedData = useMemo(() => {
    if (!sortConfig) return safeData

    return [...safeData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === "asc" ? comparison : -comparison
    })
  }, [safeData, sortConfig])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedData.slice(start, start + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleExport = () => {
    exportToCSV(sortedData, exportFilename)
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (safeData.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-8 text-center text-muted-foreground">No data available</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className={`px-4 py-3 text-left text-sm font-medium ${
                      column.sortable !== false ? "cursor-pointer hover:bg-muted" : ""
                    }`}
                    onClick={() => column.sortable !== false && requestSort(column.accessor)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable !== false && sortConfig?.key === column.accessor && (
                        <span>
                          {sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b last:border-0 ${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.accessor} className="px-4 py-3 text-sm">
                      {column.formatter ? column.formatter(row[column.accessor], row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)}{" "}
            of {sortedData.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
