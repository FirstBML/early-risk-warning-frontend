"use client"

import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatUSD, formatPercentage, formatHealthFactor, formatNumber } from "@/lib/formatters"

interface KPICardProps {
  title: string
  value: number | string
  type?: "text" | "usd" | "percentage" | "healthfactor" | "number"
  icon?: LucideIcon
  trend?: {
    direction: "up" | "down"
    value: string
  }
  subtext?: string
  loading?: boolean
  className?: string
}

export function KPICard({
  title,
  value,
  type = "text",
  icon: Icon,
  trend,
  subtext,
  loading = false,
  className = "",
}: KPICardProps) {
  const formattedValue = (() => {
    if (loading) return "..."
    if (typeof value === "string") return value

    switch (type) {
      case "usd":
        return formatUSD(value)
      case "percentage":
        return formatPercentage(value)
      case "healthfactor":
        return formatHealthFactor(value)
      case "number":
        return formatNumber(value)
      default:
        return value
    }
  })()

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{formattedValue}</h3>
            {trend && (
              <span
                className={`text-sm font-medium ${trend.direction === "up" ? "text-risk-safe" : "text-risk-critical"}`}
              >
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-muted p-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </Card>
  )
}
