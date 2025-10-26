"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api"
import { CrossChainRiskData } from "@/types/api"
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
import { formatUSD } from "@/lib/formatters"

interface ChartData {
  chain: string;
  collateral: number;
  debt: number;
}

export function CollateralVsDebtChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getCrossChainRiskComparison()
        const chartData = result.map((item: CrossChainRiskData) => ({
          chain: item.chain,
          collateral: item.total_collateral_usd,
          debt: item.total_debt_usd
        }))
        setData(chartData)
      } catch (error) {
        console.error("Failed to fetch cross-chain data:", error)
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
              formatter={(value: number) => [formatUSD(value), ""]}
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
