"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { apiService } from "@/lib/api"
import { RefreshCw } from "lucide-react"

export function Header() {
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const result = await apiService.refreshData()
      if ('error' in result) {
        throw new Error(result.error)
      }
      toast({
        title: result.success ? "Data refreshed" : "Error",
        description: result.message || "Data has been updated",
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      console.error('Refresh failed:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">AAVE Risk Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
    </header>
  )
}
