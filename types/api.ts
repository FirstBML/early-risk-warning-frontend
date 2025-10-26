export interface GetPositionsParams {
  borrowerAddress: string;
  limit?: number;
  offset?: number;
}

export interface Position {
  id: number;
  borrower_address: string;
  healthfactor?: number;
  chain: string;
  token_symbol: string;  // Changed from tokensymbol
  totalcollateralusd: number;
  totaldebtusd: number;
  lowesthealthfactor?: number;
}

export interface RiskSignal {
  id: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  signalType: string;  // Changed from signaltype
  message: string;
  timestamp: string;
  recommendedAction?: string;  // Changed from recommendedaction
}

export interface Reserve {
  token_symbol: string;
  supply_apy: number;
  borrow_apy: number;
  total_supply: number;
  total_borrow: number;
  utilization?: number;
}

export interface CrossChainRiskData {
  chain: string;
  total_collateral_usd: number;
  total_debt_usd: number;
  health_factor?: number;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
}