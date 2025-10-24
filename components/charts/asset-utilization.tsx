"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { apiService } from "@/lib/api-service"
import { formatPercentage } from "@/lib/formatters"

export function AssetUtilization() {
  const [reserves, setReserves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getReserves()
        const withUtilization = result.map((r: any) => ({
          ...r,
          utilization: r.borrow_apy / (r.supply_apy + r.borrow_apy + 0.01) || 0,
        }))
        const sorted = withUtilization.sort((a: any, b: any) => b.utilization - a.utilization).slice(0, 10)
        setReserves(sorted)
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

  const getUtilizationColor = (rate: number) => {
    if (rate >= 0.85) return "var(--color-risk-critical)"
    if (rate >= 0.7) return "var(--color-risk-medium)"
    return "var(--color-risk-safe)"
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Asset Utilization (Top 10)</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {reserves.map((reserve, index) => {
            const utilization = reserve.utilization || 0
            const percentage = utilization * 100

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{reserve.token_symbol}</span>
                  <span className="text-muted-foreground">{formatPercentage(percentage)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: getUtilizationColor(utilization),
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Supply APY: {formatPercentage(reserve.supply_apy || 0)}</span>
                  <span>Borrow APY: {formatPercentage(reserve.borrow_apy || 0)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
