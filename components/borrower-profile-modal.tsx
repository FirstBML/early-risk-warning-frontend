"use client"

import { useEffect, useState } from "react"
import { Copy, TrendingDown, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HealthGauge } from "./health-gauge"
import { KPICard } from "./kpi-card"
import { apiService } from "@/lib/api-service"
import { formatUSD, formatHealthFactor, getRiskCategory } from "@/lib/formatters"
import { truncateAddress, copyToClipboard } from "@/lib/utils-defi"
import { useToast } from "@/hooks/use-toast"

interface BorrowerProfileModalProps {
  address: string | null
  open: boolean
  onClose: () => void
}

export function BorrowerProfileModal({ address, open, onClose }: BorrowerProfileModalProps) {
  const [positions, setPositions] = useState<any[]>([])
  const [riskSignals, setRiskSignals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!address || !open) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const [positionsData, signalsData] = await Promise.all([
          apiService.getPositions({ borroweraddress: address }),
          apiService.getBorrowerRiskSignals(address),
        ])
        setPositions(positionsData)
        setRiskSignals(signalsData)
      } catch (error) {
        console.error("[v0] Failed to fetch borrower data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [address, open])

  const handleCopy = async () => {
    if (address) {
      const success = await copyToClipboard(address)
      if (success) {
        toast({
          title: "Copied!",
          description: "Address copied to clipboard",
        })
      }
    }
  }

  const totalCollateral = positions.reduce((sum, pos) => sum + (pos.totalcollateralusd || 0), 0)
  const totalDebt = positions.reduce((sum, pos) => sum + (pos.totaldebtusd || 0), 0)
  const netPosition = totalCollateral - totalDebt
  const lowestHealthFactor = Math.min(
    ...positions.map((pos) => pos.healthfactor || pos.lowesthealthfactor || Number.POSITIVE_INFINITY),
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>Borrower Profile</span>
              {address && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{truncateAddress(address)}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading borrower data...</div>
        ) : (
          <div className="space-y-6">
            {/* Health Gauge */}
            <div className="flex justify-center rounded-lg border bg-card p-6">
              <HealthGauge value={lowestHealthFactor} title="Lowest Health Factor" size="medium" />
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard title="Total Collateral" value={totalCollateral} type="usd" />
              <KPICard title="Total Debt" value={totalDebt} type="usd" />
              <KPICard
                title="Net Position"
                value={netPosition}
                type="usd"
                icon={netPosition >= 0 ? TrendingUp : TrendingDown}
              />
              <KPICard
                title="Position Type"
                value={totalDebt === 0 ? "Collateral Only" : "Active Borrowing"}
                type="text"
              />
            </div>

            {/* Risk Signals */}
            {riskSignals.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Risk Signals</h4>
                {riskSignals.map((signal, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border p-4"
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: `var(--color-risk-${signal.severity?.toLowerCase() || "medium"})`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: `var(--color-risk-${signal.severity?.toLowerCase() || "medium"})`,
                              color: `var(--color-risk-${signal.severity?.toLowerCase() || "medium"})`,
                            }}
                          >
                            {signal.severity || "MEDIUM"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{signal.signaltype}</span>
                        </div>
                        <p className="text-sm">{signal.message}</p>
                        {signal.recommendedaction && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Recommended:</span> {signal.recommendedaction}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Position Details */}
            <div className="space-y-3">
              <h4 className="font-semibold">Position Details</h4>
              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Asset</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Chain</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Collateral</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Debt</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Health Factor</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos, idx) => {
                        const hf = pos.healthfactor || pos.lowesthealthfactor || 0
                        const category = getRiskCategory(hf)
                        return (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="px-4 py-3 text-sm font-medium">{pos.tokensymbol || pos.asset}</td>
                            <td className="px-4 py-3 text-sm">{pos.chain}</td>
                            <td className="px-4 py-3 text-sm">{formatUSD(pos.totalcollateralusd || 0)}</td>
                            <td className="px-4 py-3 text-sm">{formatUSD(pos.totaldebtusd || 0)}</td>
                            <td
                              className="px-4 py-3 text-sm font-mono"
                              style={{ color: `var(--color-risk-${category.toLowerCase()})` }}
                            >
                              {formatHealthFactor(hf)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge
                                variant="outline"
                                style={{
                                  borderColor: `var(--color-risk-${category.toLowerCase()})`,
                                  color: `var(--color-risk-${category.toLowerCase()})`,
                                }}
                              >
                                {category}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
