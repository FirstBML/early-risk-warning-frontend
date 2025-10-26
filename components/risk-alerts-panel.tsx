"use client"

import { useEffect, useState } from "react"
import { X, AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiService, type RiskAlert } from "@/lib/api-service"
import { truncateAddress } from "@/lib/utils-defi"
import { useRelativeTime } from "@/hooks/use-relative-time"

function AlertCard({
  alert,
  onDismiss,
  onClick,
}: {
  alert: RiskAlert
  onDismiss: () => void
  onClick: () => void
}) {
  const relativeTime = useRelativeTime(alert.timestamp)

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case "CRITICAL":
      case "HIGH":
        return <AlertTriangle className="h-4 w-4" />
      case "MEDIUM":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityColor = () => {
    switch (alert.severity) {
      case "CRITICAL":
        return "var(--color-risk-critical)"
      case "HIGH":
        return "var(--color-risk-high)"
      case "MEDIUM":
        return "var(--color-risk-medium)"
      default:
        return "var(--color-risk-low)"
    }
  }

  return (
    <div
      className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      style={{ borderLeftWidth: "4px", borderLeftColor: getSeverityColor() }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1">
          <div style={{ color: getSeverityColor() }}>{getSeverityIcon()}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                style={{
                  borderColor: getSeverityColor(),
                  color: getSeverityColor(),
                }}
              >
                {alert.severity}
              </Badge>
              <span className="text-xs text-muted-foreground" title={new Date(alert.timestamp).toLocaleString()}>
                {relativeTime}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{alert.message}</p>
            {(alert.borroweraddress || alert.borrower_address) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Borrower:</span>
                <span className="font-mono">
                  {truncateAddress(alert.borroweraddress || alert.borrower_address || '')}
                </span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function RiskAlertsPanel({ onBorrowerClick }: { onBorrowerClick?: (address: string) => void }) {
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [severityFilter, setSeverityFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const result = await apiService.getRiskAlertsFeed(severityFilter === "ALL" ? undefined : severityFilter)
        setAlerts(result)
      } catch (error) {
        console.error("[v0] Failed to fetch alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [severityFilter])

  const visibleAlerts = alerts.filter((alert) => !dismissedIds.has(alert.id))

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id))
  }

  const handleAlertClick = (alert: RiskAlert) => {
    const address = alert.borroweraddress || alert.borrower_address
    if (address && onBorrowerClick) {
      onBorrowerClick(address)
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Risk Alerts</h3>
          <Badge variant="secondary">{visibleAlerts.length}</Badge>
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading alerts...</div>
        ) : visibleAlerts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No alerts to display</div>
        ) : (
          visibleAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id || `alert-${index}-${alert.timestamp}`}
              alert={alert}
              onDismiss={() => handleDismiss(alert.id)}
              onClick={() => handleAlertClick(alert)}
            />
          ))
        )}
      </div>
    </Card>
  )
}