import { GetPositionsParams, Position, RiskSignal, Reserve } from '@/types/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://easygoing-charm-production-707b.up.railway.app/api';

interface ApiService {
  getPositions(params: GetPositionsParams): Promise<Position[]>;
  getBorrowerRiskSignals(address: string): Promise<{ signals: RiskSignal[] }>;
  getReserves(): Promise<Reserve[]>;
}

export const apiService: ApiService = {
  getPositions: async ({ borrowerAddress, limit = 100, offset = 0 }: GetPositionsParams): Promise<Position[]> => {
    const response = await fetch(
      `${API_BASE}/positions?borrower_address=${borrowerAddress}&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }
    return response.json();
  },
  
  getBorrowerRiskSignals: async (address: string): Promise<{ signals: RiskSignal[] }> => {
    const response = await fetch(`${API_BASE}/borrower/risk-signals?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch risk signals');
    }
    return response.json();
  },

  getReserves: async (): Promise<Reserve[]> => {
    const response = await fetch(`${API_BASE}/reserves`);
    if (!response.ok) {
      throw new Error('Failed to fetch reserves');
    }
    return response.json();
  }
};