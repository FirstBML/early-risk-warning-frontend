"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { apiService } from "@/lib/api-service"
import { formatUSD, formatPercentage } from "@/lib/formatters"

export function ReservesTable() {
  const [reserves, setReserves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getReserves()
        setReserves(result)
      } catch (error) {
        console.error("[v0] Failed to fetch reserves:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const columns = [
    {
      header: "Asset",
      accessor: "token_symbol",
      formatter: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      header: "Chain",
      accessor: "chain",
    },
    {
      header: "Supply APY",
      accessor: "supply_apy",
      formatter: (value: number) => formatPercentage(value || 0),
    },
    {
      header: "Borrow APY",
      accessor: "borrow_apy",
      formatter: (value: number) => formatPercentage(value || 0),
    },
    {
      header: "LTV",
      accessor: "ltv",
      formatter: (value: number) => formatPercentage((value || 0) * 100),
    },
    {
      header: "Liq. Threshold",
      accessor: "liquidation_threshold",
      formatter: (value: number) => formatPercentage((value || 0) * 100),
    },
    {
      header: "Liq. Bonus",
      accessor: "liquidation_bonus",
      formatter: (value: number) => formatPercentage(((value || 1) - 1) * 100),
    },
    {
      header: "Price",
      accessor: "price_usd",
      formatter: (value: number) => formatUSD(value || 0),
    },
    {
      header: "Status",
      accessor: "is_active",
      formatter: (value: boolean, row: any) => {
        if (!value) return <span className="text-muted-foreground">Inactive</span>
        if (row.is_frozen) return <span className="text-yellow-500">Frozen</span>
        return <span className="text-green-500">Active</span>
      },
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Reserve Metrics</h3>
        <p className="text-sm text-muted-foreground">Asset reserves across all chains</p>
      </div>

      <DataTable columns={columns} data={reserves} loading={loading} exportFilename="reserves" />
    </Card>
  )
}
