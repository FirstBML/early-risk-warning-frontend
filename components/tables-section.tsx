"use client"

import { RiskyPositionsTable } from "./tables/risky-positions-table"
import { ReservesTable } from "./tables/reserves-table"
import { LiquidationHistoryTable } from "./tables/liquidation-history-table"

export function TablesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Data Tables</h2>
        <p className="text-muted-foreground">Detailed position and reserve information</p>
      </div>

      <RiskyPositionsTable />
      <ReservesTable />
      <LiquidationHistoryTable />
    </div>
  )
}
