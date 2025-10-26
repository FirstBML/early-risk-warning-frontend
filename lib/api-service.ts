// lib/api-service.ts - COMPLETE VERSION WITH ALL ENDPOINTS

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// ============================================================
// INTERFACES
// ============================================================

export interface Position {
  borrower_address: string
  chain: string
  token_symbol: string
  token_address?: string
  collateral_amount?: number
  debt_amount?: number
  collateral_usd: number
  debt_usd: number
  enhanced_health_factor: number
  health_factor?: number
  risk_category?: string
  last_updated?: string
}

export interface RiskSignal {
  borrower_address: string
  chain: string
  current_health_factor: number
  borrower_ltv: number
  liquidation_threshold: number
  urgency: string
  collateral_usd: number
  debt_usd: number
  primary_collateral: string
  risk_category: string
  distance_to_liquidation: number
}

export interface ProtocolRiskSummary {
  total_collateral_usd: number
  total_debt_usd: number
  protocol_ltv: number
  average_health_factor: number | null
  at_risk_value_usd: number
  at_risk_percentage: number
  chains_analyzed: string[]
  timestamp: string
}

export interface RiskAlert {
  id: string
  severity: string
  type: string
  message: string
  borrower?: string
  borrower_address?: string
  borroweraddress?: string
  chain?: string
  token?: string
  health_factor?: number
  collateral_usd?: number
  action_required?: string
  timestamp: string
}

export interface LiquidationEvent {
  id: number
  liquidation_date: string
  chain: string
  borrower?: string
  collateral_symbol: string
  debt_symbol: string
  collateral_seized_usd: number
  debt_repaid_usd?: number | string
  total_collateral_seized?: number
  total_debt_normalized?: number
}

export interface Reserve {
  chain: string
  token_symbol: string
  token_address: string
  ltv: number
  liquidation_threshold: number
  liquidation_bonus: number
  is_active: boolean
  is_frozen: boolean
  borrowing_enabled: boolean
  price_usd: number
  supply_apy?: number
  borrow_apy?: number
  query_time: string
}

export interface QuickStats {
  positions: number
  total_collateral_usd: number
  at_risk_positions: number
  critical_positions: number
  timestamp: string
}

export interface ChainComparison {
  chain: string
  average_health_factor: number
  debt_collateral_ratio: number
  total_positions: number
  total_collateral_usd: number
  total_debt_usd: number
  liquidations_7d: number
  top_collateral_tokens: string[]
  safety_score: number
}

export interface ProtocolHealth {
  timestamp: string
  chains_analyzed: string[]
  reserve_insights: {
    total_reserves: number
    high_apy_reserves: number
    frozen_reserves: number
    avg_supply_apy: number
    avg_borrow_apy: number
    high_ltv_reserves: number
    tokens_with_prices: number
    price_coverage: number
  }
  position_insights: {
    total_positions: number
    risky_positions: number
    critical_positions: number
    total_collateral_usd: number
    total_debt_usd: number
    protocol_ltv: number
    avg_health_factor: number
    risk_distribution: Record<string, number>
  }
  liquidation_insights: {
    liquidations_30d: number
    total_liquidated_usd: number
    avg_liquidation_size: number
    liquidation_rate_per_day: number
    top_liquidated_assets: Record<string, number>
  }
  health_score: {
    score: number
    status: string
    color: string
    description: string
  }
  alerts: Array<{
    severity: string
    type: string
    message: string
    action: string
  }>
}

export interface LiquidationTrends {
  period_days: number
  liquidations_24h: number
  liquidations_7d: number
  liquidation_volume_usd_24h: number
  liquidation_volume_usd_7d: number
  daily_average_7d: number
  trend: string
  top_liquidated_assets: Array<{
    asset: string
    count: number
  }>
  chain_distribution: Array<{
    chain: string
    count: number
    percentage: number
  }>
}

export interface ReserveRiskMetric {
  token_symbol: string
  token_address: string
  chain: string
  utilization_rate: number
  ltv: number
  liquidation_threshold: number
  liquidation_bonus: number
  is_frozen: boolean
  borrowing_enabled: boolean
  price_usd: number
  total_exposure_usd: number
  position_count: number
  top_borrower_exposure: number
  risk_score: number
  risk_level: string
}

interface GetPositionsParams {
  borrowerAddress?: string
  limit?: number
  offset?: number
  riskCategory?: string
  groupByBorrower?: boolean
}

// ============================================================
// API SERVICE
// ============================================================

export const apiService = {
  // ========== POSITIONS ==========
  async getPositions({ 
    borrowerAddress, 
    limit = 100, 
    offset = 0, 
    riskCategory,
    groupByBorrower = false 
  }: GetPositionsParams = {}): Promise<Position[]> {
    const url = new URL(`${API_BASE}/positions`)
    if (borrowerAddress) url.searchParams.set('borrower_address', borrowerAddress)
    url.searchParams.set('limit', limit.toString())
    if (offset) url.searchParams.set('offset', offset.toString())
    if (riskCategory) url.searchParams.set('risk_category', riskCategory)
    if (groupByBorrower) url.searchParams.set('group_by_borrower', 'true')

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch positions')
    
    const data = await response.json()
    return Array.isArray(data) ? data : data.positions || []
  },

  async getRiskyPositions(threshold = 1.5, page = 1, pageSize = 100): Promise<{ 
    positions: Position[]
    pagination: {
      page: number
      page_size: number
      total_items: number
      total_pages: number
      has_next: boolean
      has_prev: boolean
    }
  }> {
    const response = await fetch(
      `${API_BASE}/positions/risky?threshold_hf=${threshold}&page=${page}&page_size=${pageSize}`
    )
    if (!response.ok) throw new Error('Failed to fetch risky positions')
    return await response.json()
  },

  async getPositionsSummary(page = 1, pageSize = 100): Promise<{
    positions: Position[]
    page: number
    page_size: number
    total_positions: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }> {
    const response = await fetch(
      `${API_BASE}/positions_summary?page=${page}&page_size=${pageSize}`
    )
    if (!response.ok) throw new Error('Failed to fetch positions summary')
    return await response.json()
  },

  // ========== RESERVES ==========
  async getReserves(chains?: string, activeOnly = true, limit = 100): Promise<{
    count: number
    chain_filter: string[] | null
    reserves: Reserve[]
  }> {
    const url = new URL(`${API_BASE}/reserves/rpc`)
    if (chains) url.searchParams.set('chains', chains)
    url.searchParams.set('active_only', activeOnly.toString())
    url.searchParams.set('limit', limit.toString())

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch reserves')
    return await response.json()
  },

  async getReserveRiskMetrics(chains?: string): Promise<{
    reserves_analyzed: number
    high_risk_count: number
    metrics: ReserveRiskMetric[]
  }> {
    const url = new URL(`${API_BASE}/reserve_risk_metrics`)
    if (chains) url.searchParams.set('chains', chains)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch reserve risk metrics')
    return await response.json()
  },

  // ========== LIQUIDATIONS ==========
  async getLiquidationHistory(limit = 100, chain?: string): Promise<LiquidationEvent[]> {
    const url = new URL(`${API_BASE}/liquidation-history`)
    url.searchParams.set('limit', limit.toString())
    if (chain) url.searchParams.set('chain', chain)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch liquidation history')
    
    const data = await response.json()
    
    const liquidations = (Array.isArray(data) ? data : []).map((liq: any, index: number) => ({
      id: liq.id || index,
      liquidation_date: liq.liquidation_date,
      chain: liq.chain,
      borrower: liq.borrower,
      collateral_symbol: liq.collateral_symbol,
      debt_symbol: liq.debt_symbol,
      collateral_seized_usd: liq.collateral_seized_usd || liq.liquidated_collateral_usd || 0,
      debt_repaid_usd: liq.debt_repaid_usd || liq.liquidated_debt_usd || 'Avail Soon',
      total_collateral_seized: liq.total_collateral_seized,
      total_debt_normalized: liq.total_debt_normalized
    }))

    return liquidations
  },

  async getLiquidationTrends(days = 7, chains?: string): Promise<LiquidationTrends> {
    const url = new URL(`${API_BASE}/liquidation_trends`)
    url.searchParams.set('days', days.toString())
    if (chains) url.searchParams.set('chains', chains)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch liquidation trends')
    return await response.json()
  },

  // ========== RISK ANALYSIS ==========
  async getProtocolRiskSummary(chains?: string): Promise<ProtocolRiskSummary> {
    const url = new URL(`${API_BASE}/protocol_risk_summary`)
    if (chains) url.searchParams.set('chains', chains)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch protocol risk summary')
    return await response.json()
  },

  async getRiskAlertsFeed(severity?: string, limit = 100): Promise<RiskAlert[]> {
    const url = new URL(`${API_BASE}/risk_alerts_feed`)
    if (severity) url.searchParams.set('severity', severity)
    url.searchParams.set('limit', limit.toString())

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch risk alerts')
    
    const data = await response.json()
    
    const alerts = (data.alerts || []).map((alert: any, index: number) => ({
      id: alert.alert_id || `alert-${index}`,
      severity: alert.severity || 'MEDIUM',
      type: alert.type || 'GENERAL',
      message: alert.message || 'No message',
      borrower: alert.borrower,
      borrower_address: alert.borrower || alert.borrower_address,
      borroweraddress: alert.borrower || alert.borrower_address,
      chain: alert.chain,
      token: alert.token,
      health_factor: alert.health_factor,
      collateral_usd: alert.collateral_usd,
      action_required: alert.action_required,
      timestamp: alert.timestamp || new Date().toISOString()
    }))

    return alerts
  },

  async getBorrowerRiskSignals(threshold = 1.5, limit = 50): Promise<{ 
    threshold: number
    risky_borrowers_count: number
    signals: RiskSignal[]
  }> {
    const url = new URL(`${API_BASE}/borrower_risk_signals`)
    url.searchParams.set('threshold', threshold.toString())
    url.searchParams.set('limit', limit.toString())

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch risk signals')
    return await response.json()
  },

  async getRiskyBorrowersSummary(threshold = 1.5, chains?: string): Promise<{
    threshold: number
    total_risky_borrowers: number
    breakdown_by_chain: Record<string, {
      count: number
      critical_count: number
      total_at_risk_usd: number
    }>
  }> {
    const url = new URL(`${API_BASE}/protocol/risky-borrowers`)
    url.searchParams.set('threshold', threshold.toString())
    if (chains) url.searchParams.set('chains', chains)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch risky borrowers summary')
    return await response.json()
  },

  // ========== CROSS-CHAIN ==========
  async getCrossChainComparison(): Promise<{
    chains_analyzed: number
    supported_chains_only: boolean
    safest_chain: string | null
    riskiest_chain: string | null
    comparison: ChainComparison[]
  }> {
    const response = await fetch(`${API_BASE}/crosschain_risk_comparison`)
    if (!response.ok) throw new Error('Failed to fetch cross-chain comparison')
    return await response.json()
  },

  async getAvailableChains(): Promise<{
    chains: string[]
    count: number
    supported_only: boolean
    details: Array<{
      chain: string
      reserve_count: number
      position_count: number
      has_reserves: boolean
      has_positions: boolean
      last_reserve_update: string
    }>
  }> {
    const response = await fetch(`${API_BASE}/chains/available`)
    if (!response.ok) throw new Error('Failed to fetch available chains')
    return await response.json()
  },

  // ========== INSIGHTS ==========
  async getProtocolHealth(chains?: string): Promise<ProtocolHealth> {
    const url = new URL(`${API_BASE}/insights/protocol-health`)
    if (chains) url.searchParams.set('chains', chains)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch protocol health')
    return await response.json()
  },

  async getQuickStats(): Promise<QuickStats> {
    const response = await fetch(`${API_BASE}/data/quick-stats`)
    if (!response.ok) throw new Error('Failed to fetch quick stats')
    return await response.json()
  },

  // ========== PORTFOLIO (V2) ==========
  async getPortfolioFast(walletAddress: string, chains?: string[]): Promise<any> {
    const response = await fetch(`${API_BASE}/v2/portfolio/view-fast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        chains: chains || ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche']
      })
    })
    if (!response.ok) throw new Error('Failed to fetch portfolio')
    return await response.json()
  },

  async getPortfolioFull(walletAddress: string, chains?: string[]): Promise<any> {
    const response = await fetch(`${API_BASE}/v2/portfolio/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        chains: chains || ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche']
      })
    })
    if (!response.ok) throw new Error('Failed to fetch portfolio')
    return await response.json()
  },

  // ========== ADMIN (require password) ==========
  async refreshData(
    password: string,
    options: {
      refresh_reserves?: boolean
      refresh_positions?: boolean
      refresh_liquidations?: boolean
      prices_only?: boolean
      chains?: string[]
    }
  ): Promise<any> {
    const url = new URL(`${API_BASE}/data/refresh`)
    url.searchParams.set('password', password)
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value.toString())
      }
    })

    const response = await fetch(url.toString(), { method: 'POST' })
    if (!response.ok) throw new Error('Failed to refresh data')
    return await response.json()
  },

  async getCacheStats(password: string): Promise<any> {
    const response = await fetch(`${API_BASE}/v2/portfolio/cache/stats?password=${encodeURIComponent(password)}`)
    if (!response.ok) throw new Error('Failed to fetch cache stats')
    return await response.json()
  },

  async clearCache(password: string): Promise<any> {
    const response = await fetch(
      `${API_BASE}/admin/cache/clear?password=${encodeURIComponent(password)}`,
      { method: 'POST' }
    )
    if (!response.ok) throw new Error('Failed to clear cache')
    return await response.json()
  },

  async getAdminSettings(password: string): Promise<any> {
    const response = await fetch(`${API_BASE}/admin/settings?password=${encodeURIComponent(password)}`)
    if (!response.ok) throw new Error('Failed to fetch admin settings')
    return await response.json()
  }
}