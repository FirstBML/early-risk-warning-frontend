"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api"
import { LiquidationTrendsResponse, ChainDistribution } from "@/types/api"
import { formatUSD } from "@/lib/formatters"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

export function LiquidationTrends() {
  const [data, setData] = useState<ChainDistribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getLiquidationTrends()
        setData(result.chain_distribution)
      } catch (error) {
        console.error("Failed to fetch liquidation trends:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Liquidation Distribution by Chain</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="chain" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatUSD(value)} />
            <Tooltip formatter={(value: number) => [formatUSD(value), ""]} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill="var(--color-risk-medium)" name="Count" />
            <Bar yAxisId="right" dataKey="volume" fill="var(--color-risk-high)" name="Volume" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
