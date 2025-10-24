const BASE_URL = "https://easygoing-charm-production-707b.up.railway.app/api"

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class APIService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private pendingRequests: Map<string, Promise<any>> = new Map()

  async fetch<T>(endpoint: string, options: { cache?: boolean; cacheTime?: number } = {}): Promise<T> {
    const { cache = true, cacheTime = 60000 } = options
    const url = `${BASE_URL}${endpoint}`

    console.log("[v0] API Request:", endpoint)

    // Check cache
    if (cache && this.cache.has(url)) {
      const cached = this.cache.get(url)!
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data
      }
    }

    // Check for pending request (deduplication)
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url)!
    }

    // Make request
    const requestPromise = fetch(url)
      .then(async (response) => {
        console.log("[v0] API Response:", endpoint, "Status:", response.status)

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`[API] Endpoint not found: ${endpoint}`)
          } else {
            console.error(`[API] Error ${response.status} for ${endpoint}`)
          }
          throw new Error(`API Error: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log("[v0] API Data received:", endpoint, "Data:", data)

        // Cache the result
        if (cache) {
          this.cache.set(url, {
            data,
            timestamp: Date.now(),
          })
        }
        return data
      })
      .catch((error) => {
        console.error("[v0] API Error:", endpoint, error)
        throw error
      })
      .finally(() => {
        // Remove from pending requests
        this.pendingRequests.delete(url)
      })

    // Store pending request
    this.pendingRequests.set(url, requestPromise)
    return requestPromise
  }

  clearCache(endpoint?: string) {
    if (endpoint) {
      const url = `${BASE_URL}${endpoint}`
      this.cache.delete(url)
    } else {
      this.cache.clear()
    }
  }

  // API Methods
  async getHealth() {
    return this.fetch("/health")
  }

  async getReserves() {
    const result = await this.fetch("/reserves/rpc")
    return Array.isArray(result) ? result : result?.reserves || result?.data || []
  }

  async getReservesSummary() {
    return this.fetch("/reserves/rpc/summary")
  }

  async refreshData() {
    return this.fetch("/data/refresh", { cache: false })
  }

  async getPositions() {
    const result = await this.fetch("/positions")
    return Array.isArray(result) ? result : result?.positions || result?.data || []
  }

  async getRiskyPositions() {
    const result = await this.fetch("/positions/risky")
    return Array.isArray(result) ? result : result?.positions || result?.data || []
  }

  async getPositionsSummary() {
    return this.fetch("/positions_summary")
  }

  async getLiquidationHistory() {
    const result = await this.fetch("/liquidation-history")
    return Array.isArray(result) ? result : result?.history || result?.liquidations || result?.data || []
  }

  async getProtocolRiskSummary() {
    return this.fetch("/protocol_risk_summary")
  }

  async getAvailableChains() {
    return this.fetch("/chains/available")
  }

  async getProtocolHealth() {
    return this.fetch("/insights/protocol-health")
  }

  async customStressTest(data: any) {
    const url = `${BASE_URL}/stress-test/custom`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    return response.json()
  }

  async getBorrowerRiskSignals() {
    return this.fetch("/borrower_risk_signals")
  }

  async getReserveRiskMetrics() {
    return this.fetch("/reserve_risk_metrics")
  }

  async getLiquidationTrends() {
    const result = await this.fetch("/liquidation_trends")
    return Array.isArray(result) ? result : result?.trends || result?.data || []
  }

  async getCrossChainRiskComparison() {
    const result = await this.fetch("/crosschain_risk_comparison")
    return Array.isArray(result) ? result : result?.chains || result?.data || []
  }

  async getRiskAlertsFeed(severity?: string) {
    const endpoint = severity && severity !== "ALL" ? `/risk_alerts_feed?severity=${severity}` : "/risk_alerts_feed"
    const result = await this.fetch(endpoint)
    // Ensure we always return an array
    return Array.isArray(result) ? result : result?.alerts || result?.data || []
  }

  async debugRpcTest() {
    return this.fetch("/debug/rpc-test")
  }

  async getDataStatus() {
    return this.fetch("/data/status")
  }

  async getQuickStats() {
    return this.fetch("/data/quick-stats")
  }

  async getStartupStatus() {
    return this.fetch("/startup-status")
  }
}

// Create and export instance
const apiService = new APIService()
export { apiService }
