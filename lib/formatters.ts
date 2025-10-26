export function formatUSD(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

export function formatPercentage(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  
  const percentage = value > 1 ? value : value * 100
  return `${percentage.toFixed(decimals)}%`
}

export function formatNumber(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return value.toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })
}

export function formatHealthFactor(hf: number | null | undefined): string {
  if (!hf || hf >= 999) return '∞'
  return hf.toFixed(3)
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Invalid Date'
  }
}

export function getRiskCategory(healthFactor: number | null | undefined): string {
  if (!healthFactor || healthFactor >= 999) return 'SAFE'
  
  if (healthFactor < 1.0) return 'LIQUIDATION_IMMINENT'
  if (healthFactor < 1.1) return 'CRITICAL'
  if (healthFactor < 1.3) return 'HIGH_RISK'
  if (healthFactor < 1.5) return 'MEDIUM_RISK'
  if (healthFactor < 2.0) return 'LOW_RISK'
  return 'SAFE'
}

export function getRiskColor(category: string): string {
  const colors: Record<string, string> = {
    'LIQUIDATION_IMMINENT': '#dc2626',
    'CRITICAL': '#dc2626',
    'HIGH_RISK': '#ea580c',
    'MEDIUM_RISK': '#f59e0b',
    'LOW_RISK': '#3b82f6',
    'SAFE': '#10b981',
  }
  return colors[category] || '#6b7280'
}

export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}