"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { isValidAddress } from "@/lib/utils-defi"
import { useToast } from "@/hooks/use-toast"

interface NavigationBarProps {
  onBorrowerSelect: (address: string, chain: string) => void
}

export function NavigationBar({ onBorrowerSelect }: NavigationBarProps) {
  const [searchValue, setSearchValue] = useState("")
  const { toast } = useToast()

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a borrower address",
        variant: "destructive",
      })
      return
    }

    if (!isValidAddress(searchValue.trim())) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Ethereum address (0x...)",
        variant: "destructive",
      })
      return
    }

    onBorrowerSelect(searchValue.trim(), "ethereum")
    setSearchValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="border-b bg-card">
      <div className="container py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="flex gap-2">
              <Input
                placeholder="Search borrower address (0x...)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono text-sm"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
