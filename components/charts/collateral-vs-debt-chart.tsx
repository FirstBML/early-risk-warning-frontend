"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api-service"
import { formatUSD } from "@/lib/formatters"

export function CollateralVsDebtChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getCrossChainRiskComparison()
        const chartData = result.map((item: any) => ({
          chain: item.chain,
          collateral: item.total_collateral_usd,
          debt: item.total_debt_usd,
        }))
        setData(chartData)
      } catch (error) {
        console.error("[v0] Failed to fetch cross-chain data:", error)
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
      <h3 className="text-lg font-semibold mb-4">Collateral vs Debt by Chain</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="chain" stroke="var(--color-foreground)" />
            <YAxis stroke="var(--color-foreground)" tickFormatter={(value) => formatUSD(value, 0)} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              formatter={(value: any) => formatUSD(value)}
            />
            <Legend />
            <Bar dataKey="collateral" fill="var(--color-risk-safe)" name="Collateral" />
            <Bar dataKey="debt" fill="var(--color-risk-high)" name="Debt" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
