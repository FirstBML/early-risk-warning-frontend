"use client"

import { CollateralVsDebtChart } from "./charts/collateral-vs-debt-chart"
import { HealthFactorDistribution } from "./charts/health-factor-distribution"
import { RiskCategoriesPie } from "./charts/risk-categories-pie"
import { LiquidationTrends } from "./charts/liquidation-trends"
import { AssetUtilization } from "./charts/asset-utilization"

export function ChartsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics & Visualizations</h2>
        <p className="text-muted-foreground">Comprehensive risk metrics and trends</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CollateralVsDebtChart />
        <HealthFactorDistribution />
        <RiskCategoriesPie />
        <LiquidationTrends />
      </div>

      <AssetUtilization />
    </div>
  )
}
