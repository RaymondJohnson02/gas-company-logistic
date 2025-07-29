"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RegionTabs } from "@/components/region-tabs"
import { VirtualizedTerminalGrid } from "@/components/virtualized-terminal-grid"

export default function HomePage() {
  const [activeRegion, setActiveRegion] = useState("all")

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 z-30 h-full">
        <Sidebar />
      </div>

      {/* Fixed Region Tabs */}
      <div className="fixed left-16 top-0 z-20 h-full">
        <RegionTabs activeRegion={activeRegion} onRegionChange={setActiveRegion} module="terminal" />
      </div>

      {/* Main Content Area with proper left margin */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-10 bg-white border-b border-gray-200" style={{ left: "16rem" }}>
          <Header />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-6 pt-20 overflow-y-auto">
          <VirtualizedTerminalGrid activeRegion={activeRegion} />
        </main>
      </div>
    </div>
  )
}
