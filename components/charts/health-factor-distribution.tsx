"use client"

import { useEffect, useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api"
import { Position } from "@/types/api"
import { getRiskCategory, getRiskColor } from "@/lib/formatters"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'

export function HealthFactorDistribution() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pass required parameters to getPositions
        const result = await apiService.getPositions({
          borrowerAddress: '',  // Get all positions
          limit: 1000,         // Get a large sample
          offset: 0
        })
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

  const distributionData = positions.reduce((acc: Record<string, number>, pos) => {
    const category = getRiskCategory(pos.healthfactor)
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(distributionData).map(([name, value]) => ({
    name,
    value
  }))

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Health Factor Distribution</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={getRiskColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
