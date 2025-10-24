"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { apiService } from "@/lib/api-service"
import { formatUSD, formatHealthFactor, getRiskCategory } from "@/lib/formatters"
import { truncateAddress, determinePositionType } from "@/lib/utils-defi"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RiskyPositionsTable() {
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState("1.5")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getRiskyPositions(Number.parseFloat(threshold))
        setPositions(result.positions || result)
      } catch (error) {
        console.error("[v0] Failed to fetch risky positions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [threshold])

  const columns = [
    {
      header: "Borrower",
      accessor: "borrower_address",
      formatter: (value: string) => (
        <span className="font-mono text-xs" title={value}>
          {truncateAddress(value)}
        </span>
      ),
    },
    {
      header: "Chain",
      accessor: "chain",
    },
    {
      header: "Token",
      accessor: "token_symbol",
      formatter: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Health Factor",
      accessor: "health_factor",
      formatter: (value: number) => {
        const category = getRiskCategory(value)
        return (
          <span className="font-mono font-semibold" style={{ color: `var(--color-risk-${category.toLowerCase()})` }}>
            {formatHealthFactor(value)}
          </span>
        )
      },
    },
    {
      header: "Collateral",
      accessor: "collateral_usd",
      formatter: (value: number) => formatUSD(value),
    },
    {
      header: "Debt",
      accessor: "debt_usd",
      formatter: (value: number) => formatUSD(value),
    },
    {
      header: "Risk Category",
      accessor: "risk_category",
      formatter: (value: string, row: any) => {
        const category = value || getRiskCategory(row.health_factor)
        return (
          <Badge
            variant="outline"
            style={{
              borderColor: `var(--color-risk-${category.toLowerCase()})`,
              color: `var(--color-risk-${category.toLowerCase()})`,
            }}
          >
            {category}
          </Badge>
        )
      },
    },
    {
      header: "Position Type",
      accessor: "position_type",
      formatter: (value: string, row: any) => {
        const type = value || determinePositionType(row)
        return <Badge variant={type === "Collateral Only" ? "secondary" : "default"}>{type}</Badge>
      },
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Risky Positions</h3>
          <p className="text-sm text-muted-foreground">Positions below health factor threshold</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Threshold:</span>
          <Select value={threshold} onValueChange={setThreshold}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.1">1.1</SelectItem>
              <SelectItem value="1.3">1.3</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="2.0">2.0</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} data={positions} loading={loading} exportFilename="risky-positions" />
    </Card>
  )
}
