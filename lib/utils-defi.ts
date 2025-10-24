// Address Utilities
export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return ""
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy:", error)
    return false
  }
}

// Time Utilities
export function getRelativeTime(timestamp: string | Date): string {
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
  return new Date(timestamp).toLocaleDateString()
}

// Data Transformation Utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  const result: Record<string, T[]> = {}

  for (const item of array) {
    const group = String(item[key])
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
  }

  return result
}

// DeFi-specific Utilities
export function formatUSD(value: number | null | undefined): string {
  if (value === null || value === undefined) return "$0.00"

  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  } else {
    return `$${value.toFixed(2)}`
  }
}

export function formatPercentage(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return "0%"
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return "0"
  return value.toFixed(decimals)
}

export function getRiskColor(healthFactor: number | null | undefined): string {
  if (!healthFactor) return "gray"

  if (healthFactor < 1.05) return "red"
  if (healthFactor < 1.1) return "orange"
  if (healthFactor < 1.3) return "yellow"
  if (healthFactor < 1.5) return "blue"
  return "green"
}

export function getRiskLevel(healthFactor: number | null | undefined): string {
  if (!healthFactor) return "UNKNOWN"

  if (healthFactor < 1.05) return "CRITICAL"
  if (healthFactor < 1.1) return "HIGH"
  if (healthFactor < 1.3) return "MEDIUM"
  if (healthFactor < 1.5) return "LOW"
  return "SAFE"
}

interface Position {
  totaldebtusd?: number
  totalDebtUSD?: number
  lowesthealthfactor?: number
  lowestHealthFactor?: number
  healthFactor?: number
}

export function determinePositionType(position: Position | null | undefined): string {
  if (!position) return "UNKNOWN"

  const totalDebt = position.totaldebtusd || position.totalDebtUSD || 0
  const healthFactor = position.lowesthealthfactor || position.lowestHealthFactor || position.healthFactor || 0

  if (totalDebt === 0) {
    return "SUPPLY_ONLY"
  }

  if (healthFactor > 1000) {
    return "OVER_COLLATERALIZED"
  }

  if (healthFactor < 1.05) {
    return "AT_RISK"
  }

  if (healthFactor < 1.3) {
    return "MODERATE"
  }

  return "HEALTHY"
}

export function exportToCSV(data: Record<string, any>[], filename: string): void {
  if (!data || data.length === 0) {
    console.warn("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const csvRows: string[] = []

  csvRows.push(headers.join(","))

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      const escaped = String(value).replace(/"/g, '""')

      if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
        return `"${escaped}"`
      }

      return escaped
    })

    csvRows.push(values.join(","))
  }

  const csvContent = csvRows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
