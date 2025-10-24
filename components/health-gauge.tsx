"use client"

import { useMemo } from "react"
import { formatHealthFactor } from "@/lib/formatters"
import { getRiskCategory } from "@/lib/formatters"

interface HealthGaugeProps {
  value: number
  title?: string
  size?: "small" | "medium" | "large"
  showZones?: boolean
}

export function HealthGauge({ value, title = "Health Factor", size = "large", showZones = true }: HealthGaugeProps) {
  const isInfinite = value === Number.POSITIVE_INFINITY || value > 1000
  const displayValue = isInfinite ? "∞" : formatHealthFactor(value)

  const riskLevel = useMemo(() => getRiskCategory(value), [value])

  const gaugePercentage = useMemo(() => {
    if (isInfinite) return 100
    if (value >= 3) return 100
    return Math.min((value / 3) * 100, 100)
  }, [value, isInfinite])

  const needleRotation = (gaugePercentage / 100) * 180 - 90

  const sizeClasses = {
    small: "w-48 h-32",
    medium: "w-64 h-40",
    large: "w-80 h-48",
  }

  return (
    <div className={`flex flex-col items-center ${sizeClasses[size]}`}>
      <div className="relative w-full">
        <svg viewBox="0 0 200 120" className="w-full">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Critical zone */}
          <path
            d="M 20 100 A 80 80 0 0 1 50 50"
            fill="none"
            stroke="var(--color-risk-critical)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* High risk zone */}
          <path
            d="M 50 50 A 80 80 0 0 1 80 25"
            fill="none"
            stroke="var(--color-risk-high)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Medium risk zone */}
          <path
            d="M 80 25 A 80 80 0 0 1 120 25"
            fill="none"
            stroke="var(--color-risk-medium)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Low risk zone */}
          <path
            d="M 120 25 A 80 80 0 0 1 150 50"
            fill="none"
            stroke="var(--color-risk-low)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Safe zone */}
          <path
            d="M 150 50 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--color-risk-safe)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${needleRotation} 100 100)`}
            className="transition-transform duration-1000 ease-out"
          />

          {/* Center circle */}
          <circle cx="100" cy="100" r="8" fill="currentColor" />
        </svg>
      </div>

      <div className="mt-4 text-center">
        <div
          className="text-4xl font-bold"
          style={{
            color: `var(--color-risk-${riskLevel.toLowerCase()})`,
          }}
        >
          {displayValue}
        </div>
        <div className="mt-1 text-sm font-medium text-muted-foreground">{title}</div>
      </div>

      {showZones && (
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-risk-critical)" }} />
            Critical (&lt;1.1)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-risk-high)" }} />
            High (1.1-1.3)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-risk-medium)" }} />
            Medium (1.3-1.5)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-risk-low)" }} />
            Low (1.5-2.0)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-risk-safe)" }} />
            Safe (≥2.0)
          </span>
        </div>
      )}
    </div>
  )
}
