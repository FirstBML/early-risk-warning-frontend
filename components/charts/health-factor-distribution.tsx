"use client"

import { useEffect, useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api-service"

export function HealthFactorDistribution() {
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

  const distribution = useMemo(() => {
    const ranges = [
      { label: "0-1.1", min: 0, max: 1.1, count: 0, color: "var(--color-risk-critical)" },
      { label: "1.1-1.3", min: 1.1, max: 1.3, count: 0, color: "var(--color-risk-high)" },
      { label: "1.3-1.5", min: 1.3, max: 1.5, count: 0, color: "var(--color-risk-medium)" },
      { label: "1.5-2.0", min: 1.5, max: 2.0, count: 0, color: "var(--color-risk-low)" },
      { label: "2.0+", min: 2.0, max: 1000, count: 0, color: "var(--color-risk-safe)" },
      { label: "∞", min: 1000, max: Number.POSITIVE_INFINITY, count: 0, color: "var(--color-risk-safe)" },
    ]

    positions.forEach((pos) => {
      const hf = pos.enhanced_health_factor || 0
      for (const range of ranges) {
        if (hf >= range.min && hf < range.max) {
          range.count++
          break
        }
      }
    })

    return ranges
  }, [positions])

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Health Factor Distribution</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" stroke="var(--color-foreground)" />
            <YAxis stroke="var(--color-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" name="Positions">
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
