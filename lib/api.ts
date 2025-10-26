import { 
  GetPositionsParams,
  Position,
  RiskSignal,
  ApiResponse,
  CrossChainRiskData,
  Reserve,
  LiquidationTrendsResponse
} from '@/types/api';

interface ApiService {
  getPositions(params: GetPositionsParams): Promise<Position[]>;
  getBorrowerRiskSignals(address: string): Promise<{ signals: RiskSignal[] }>;
  getCrossChainRiskComparison(): Promise<CrossChainRiskData[]>;
  getReserves(): Promise<Reserve[]>;
  getLiquidationTrends(): Promise<LiquidationTrendsResponse>;
  refreshData(): Promise<ApiResponse>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://easygoing-charm-production-707b.up.railway.app/api';

export const apiService: ApiService = {
  getPositions: async ({ borrowerAddress, limit = 100, offset = 0 }: GetPositionsParams) => {
    const response = await fetch(
      `${API_BASE}/positions?borrower_address=${borrowerAddress}&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }
    return response.json();
  },

  getBorrowerRiskSignals: async (address: string) => {
    const response = await fetch(`${API_BASE}/borrower/risk-signals?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch risk signals');
    }
    return response.json();
  },

  getCrossChainRiskComparison: async (): Promise<CrossChainRiskData[]> => {
    const response = await fetch(`${API_BASE}/cross-chain/risk-comparison`);
    if (!response.ok) {
      throw new Error('Failed to fetch cross-chain risk comparison');
    }
    return response.json();
  },

  refreshData: async () => {
    try {
      const response = await fetch(`${API_BASE}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh data');
      }
      
      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  getReserves: async (): Promise<Reserve[]> => {
    const response = await fetch(`${API_BASE}/reserves`);
    if (!response.ok) {
      throw new Error('Failed to fetch reserves');
    }
    return response.json();
  },

  getLiquidationTrends: async (): Promise<LiquidationTrendsResponse> => {
    const response = await fetch(`${API_BASE}/liquidations/trends`);
    if (!response.ok) {
      throw new Error('Failed to fetch liquidation trends');
    }
    return response.json();
  }
};