"use client"

import { useEffect, useState } from "react"
import { apiService, type LiquidationEvent } from "@/lib/api-service"
import { Card } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { formatUSD, formatNumber } from "@/lib/formatters"
import { truncateAddress } from "@/lib/utils-defi"
import { ExternalLink } from "lucide-react"

export function LiquidationHistoryTable() {
  const [liquidations, setLiquidations] = useState<LiquidationEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getLiquidationHistory()
        setLiquidations(result)
      } catch (error) {
        console.error("[v0] Failed to fetch liquidation history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const columns = [
    {
      header: "Timestamp",
      accessor: "timestamp",
      formatter: (value: string) => new Date(value).toLocaleString(),
    },
    {
      header: "Borrower",
      accessor: "borrower",
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
      header: "Collateral Asset",
      accessor: "collateralasset",
      formatter: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Collateral Seized",
      accessor: "collateralseizedusd",
      formatter: (value: number, row: any) => (
        <div>
          <div>{formatUSD(value)}</div>
          <div className="text-xs text-muted-foreground">{formatNumber(row.totalcollateralseized || 0, 6)} tokens</div>
        </div>
      ),
    },
    {
      header: "Debt Asset",
      accessor: "debtasset",
      formatter: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Debt Repaid",
      accessor: "debtrepaidusd",
      formatter: (value: number, row: any) => (
        <div>
          <div>{formatUSD(value)}</div>
          <div className="text-xs text-muted-foreground">{formatNumber(row.totaldebtnormalized || 0, 6)} tokens</div>
        </div>
      ),
    },
    {
      header: "Liquidator",
      accessor: "liquidator",
      formatter: (value: string) => (
        <span className="font-mono text-xs" title={value}>
          {truncateAddress(value)}
        </span>
      ),
    },
    {
      header: "Tx Hash",
      accessor: "transactionhash",
      formatter: (value: string) => (
        <a
          href={`https://etherscan.io/tx/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-mono text-xs">{truncateAddress(value, 4, 4)}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Liquidation History</h3>
        <p className="text-sm text-muted-foreground">Recent liquidation events</p>
      </div>

      <DataTable
        columns={columns}
        data={liquidations}
        loading={loading}
        itemsPerPage={50}
        exportFilename="liquidation-history"
      />
    </Card>
  )
}
