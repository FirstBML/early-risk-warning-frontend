"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api-service"
import { formatUSD } from "@/lib/formatters"

export function LiquidationTrends() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getLiquidationTrends()
        const chartData =
          result.chain_distribution?.map((item: any) => ({
            chain: item.chain,
            count: item.count,
            percentage: item.percentage,
          })) || []
        setData({ ...result, chartData })
      } catch (error) {
        console.error("[v0] Failed to fetch liquidation trends:", error)
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
      <h3 className="text-lg font-semibold mb-4">Liquidation Trends (Last 7 Days)</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
      ) : data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">24h Liquidations</p>
              <p className="text-2xl font-bold">{data.liquidations_24h || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">7d Liquidations</p>
              <p className="text-2xl font-bold">{data.liquidations_7d || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">7d Volume</p>
              <p className="text-2xl font-bold">{formatUSD(data.liquidation_volume_usd_7d || 0)}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="chain" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="var(--color-chart-1)" name="Count" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </Card>
  )
}
