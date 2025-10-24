const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://easygoing-charm-production-707b.up.railway.app/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  status?: string
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async fetchWithErrorHandling<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data: T = await response.json()
      return data
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error)
      throw error
    }
  }

  // Protocol Overview
  async getQuickStats() {
    return this.fetchWithErrorHandling<any>('/data/quick-stats')
  }

  async getProtocolRiskSummary() {
    return this.fetchWithErrorHandling<any>('/protocol_risk_summary')
  }

  async getProtocolHealth() {
    return this.fetchWithErrorHandling<any>('/insights/protocol-health')
  }

  // Positions
  async getPositions(limit = 100, riskCategory?: string) {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if (riskCategory) params.append('risk_category', riskCategory)
    
    const data = await this.fetchWithErrorHandling<any>(`/positions?${params}`)
    return Array.isArray(data) ? data : []
  }

  async getRiskyPositions(threshold = 1.5, page = 1, pageSize = 100) {
    const params = new URLSearchParams()
    params.append('threshold_hf', threshold.toString())
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    
    return this.fetchWithErrorHandling<any>(`/positions/risky?${params}`)
  }

  async getPositionsSummary(page = 1, pageSize = 100) {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('page_size', pageSize.toString())
    
    return this.fetchWithErrorHandling<any>(`/positions_summary?${params}`)
  }

  // Reserves
  async getReserves(chains?: string, activeOnly = true, limit = 100) {
    const params = new URLSearchParams()
    if (chains) params.append('chains', chains)
    params.append('active_only', activeOnly.toString())
    params.append('limit', limit.toString())
    
    const data = await this.fetchWithErrorHandling<any>(`/reserves/rpc?${params}`)
    return data.reserves || []
  }

  async getReserveSummary() {
    return this.fetchWithErrorHandling<any>('/reserves/rpc/summary')
  }

  // Liquidations
  async getLiquidationHistory(limit = 100, chain?: string) {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if (chain) params.append('chain', chain)
    
    const data = await this.fetchWithErrorHandling<any>(`/liquidation-history?${params}`)
    return Array.isArray(data) ? data : []
  }

  async getLiquidationTrends(days = 7, chains?: string) {
    const params = new URLSearchParams()
    params.append('days', days.toString())
    if (chains) params.append('chains', chains)
    
    return this.fetchWithErrorHandling<any>(`/liquidation_trends?${params}`)
  }

  // Risk Analysis
  async getRiskAlertsFeed(severity?: string, limit = 100) {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if (severity) params.append('severity', severity)
    
    const data = await this.fetchWithErrorHandling<any>(`/risk_alerts_feed?${params}`)
    return data.alerts || []
  }

  async getBorrowerRiskSignals(threshold = 1.5, limit = 50) {
    const params = new URLSearchParams()
    params.append('threshold', threshold.toString())
    params.append('limit', limit.toString())
    
    const data = await this.fetchWithErrorHandling<any>(`/borrower_risk_signals?${params}`)
    return data.signals || []
  }

  async getReserveRiskMetrics(chains?: string, minLtv?: number) {
    const params = new URLSearchParams()
    if (chains) params.append('chains', chains)
    if (minLtv) params.append('min_ltv', minLtv.toString())
    
    const data = await this.fetchWithErrorHandling<any>(`/reserve_risk_metrics?${params}`)
    return data.metrics || []
  }

  // Cross-Chain
  async getCrossChainRiskComparison() {
    const data = await this.fetchWithErrorHandling<any>('/crosschain_risk_comparison')
    return data.comparison || []
  }

  async getAvailableChains() {
    return this.fetchWithErrorHandling<any>('/chains/available')
  }

  // Data Refresh
  async refreshData(options: {
    refresh_reserves?: boolean
    refresh_positions?: boolean
    refresh_liquidations?: boolean
    prices_only?: boolean
    chains?: string[]
  }) {
    const params = new URLSearchParams()
    if (options.refresh_reserves) params.append('refresh_reserves', 'true')
    if (options.refresh_positions) params.append('refresh_positions', 'true')
    if (options.refresh_liquidations) params.append('refresh_liquidations', 'true')
    if (options.prices_only) params.append('prices_only', 'true')
    if (options.chains) params.append('chains', options.chains.join(','))
    
    return this.fetchWithErrorHandling<any>(`/data/refresh?${params}`, { method: 'POST' })
  }

  // Health Check
  async getHealth() {
    return this.fetchWithErrorHandling<any>('/health')
  }
}

export const apiService = new ApiService(API_BASE_URL)