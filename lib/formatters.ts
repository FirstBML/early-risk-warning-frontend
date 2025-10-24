// USD Currency Formatting
export const formatUSD = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return "$0.00"
  if (value === 0) return "$0.00"

  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } else if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } else {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value)
  }
}

// Percentage Formatting
export const formatPercentage = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return "0.00%"
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

// Health Factor Formatting
export const formatHealthFactor = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A"
  if (value === Number.POSITIVE_INFINITY || value > 1000) return "∞"
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value)
}

// Generic Number Formatting
export const formatNumber = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return "0"
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// Get risk category from health factor
export const getRiskCategory = (healthFactor: number): string => {
  if (healthFactor === Number.POSITIVE_INFINITY || healthFactor > 1000) return "SAFE"
  if (healthFactor >= 2.0) return "SAFE"
  if (healthFactor >= 1.5) return "LOWRISK"
  if (healthFactor >= 1.3) return "MEDIUMRISK"
  if (healthFactor >= 1.1) return "HIGHRISK"
  if (healthFactor >= 1.05) return "CRITICAL"
  return "LIQUIDATIONIMMINENT"
}

// Get risk color
export const getRiskColor = (category: string): string => {
  const colors: Record<string, string> = {
    SAFE: "var(--color-risk-safe)",
    LOWRISK: "var(--color-risk-low)",
    MEDIUMRISK: "var(--color-risk-medium)",
    HIGHRISK: "var(--color-risk-high)",
    CRITICAL: "var(--color-risk-critical)",
    LIQUIDATIONIMMINENT: "var(--color-risk-imminent)",
  }
  return colors[category] || colors.SAFE
}
