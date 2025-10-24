"use client"

import { useEffect, useState } from "react"
import { Coins, FileText, BarChart3, Heart, AlertTriangle, Activity } from "lucide-react"
import { KPICard } from "./kpi-card"
import { HealthGauge } from "./health-gauge"
import { apiService } from "@/lib/api-service"

interface ProtocolData {
  total_collateral_usd: number
  total_debt_usd: number
  protocol_ltv: number
  average_health_factor: number
  at_risk_value_usd: number
  at_risk_percentage: number
}

export function ProtocolOverview() {
  const [data, setData] = useState<ProtocolData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getProtocolRiskSummary()
        console.log("[v0] Protocol data received:", result)
        setData(result)
      } catch (error) {
        console.error("[v0] Failed to fetch protocol data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [])

  const protocolHealthScore = data ? Math.min(100, Math.max(0, (data.average_health_factor / 3) * 100)) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Protocol Overview</h2>
        <p className="text-muted-foreground">Real-time metrics across all Aave markets</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Total Collateral"
          value={data?.total_collateral_usd || 0}
          type="usd"
          icon={Coins}
          loading={loading}
        />

        <KPICard title="Total Debt" value={data?.total_debt_usd || 0} type="usd" icon={FileText} loading={loading} />

        <KPICard
          title="Protocol LTV Ratio"
          value={data?.protocol_ltv ? data.protocol_ltv * 100 : 0}
          type="percentage"
          icon={BarChart3}
          loading={loading}
        />

        <KPICard
          title="Average Health Factor"
          value={data?.average_health_factor || 0}
          type="healthfactor"
          icon={Heart}
          loading={loading}
        />

        <KPICard
          title="At-Risk Value"
          value={data?.at_risk_value_usd || 0}
          type="usd"
          icon={AlertTriangle}
          subtext={data ? `${(data.at_risk_percentage * 100).toFixed(2)}% of total collateral` : undefined}
          loading={loading}
        />

        <KPICard
          title="Protocol Health Score"
          value={protocolHealthScore}
          type="number"
          icon={Activity}
          loading={loading}
        />
      </div>

      <div className="flex justify-center rounded-lg border bg-card p-8">
        <HealthGauge value={data?.average_health_factor || 0} title="Average Health Factor" />
      </div>
    </div>
  )
}
