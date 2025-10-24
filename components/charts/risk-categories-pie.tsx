"use client"

import { useEffect, useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api-service"
import { getRiskCategory, getRiskColor } from "@/lib/formatters"

export function RiskCategoriesPie() {
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getPositions()
        setPositions(result)
      } catch (error) {
        console.error("[v0] Failed to fetch positions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const chartData = useMemo(() => {
    const categories: Record<string, number> = {}

    positions.forEach((pos) => {
      const category = pos.risk_category || getRiskCategory(pos.enhanced_health_factor || 0)
      categories[category] = (categories[category] || 0) + 1
    })

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      color: getRiskColor(name),
    }))
  }, [positions])

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Position Risk Categories</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
