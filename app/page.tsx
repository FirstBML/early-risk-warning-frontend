"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { NavigationBar } from "@/components/navigation-bar"
import { ProtocolOverview } from "@/components/protocol-overview"
import { ChartsSection } from "@/components/charts-section"
import { TablesSection } from "@/components/tables-section"
import { RiskAlertsPanel } from "@/components/risk-alerts-panel"
import { BorrowerProfileModal } from "@/components/borrower-profile-modal"

export default function DashboardPage() {
  const [selectedBorrower, setSelectedBorrower] = useState<{ address: string; chain: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBorrowerSelect = (address: string, chain: string) => {
    setSelectedBorrower({ address, chain })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBorrower(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar onBorrowerSelect={handleBorrowerSelect} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <ProtocolOverview />
        <ChartsSection />
        <TablesSection onBorrowerSelect={handleBorrowerSelect} />
        <RiskAlertsPanel onAlertClick={handleBorrowerSelect} />
      </main>

      {selectedBorrower && (
        <BorrowerProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          borrowerAddress={selectedBorrower.address}
          chain={selectedBorrower.chain}
        />
      )}
    </div>
  )
}
