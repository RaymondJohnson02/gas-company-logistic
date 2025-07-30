"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RegionTabs } from "@/components/region-tabs"
import { VirtualizedTerminalGrid } from "@/components/virtualized-terminal-grid"

export default function HomePage() {
  const [activeRegion, setActiveRegion] = useState("all")

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Header - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <Header />
      </div>

      {/* Content Area Below Header */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 z-20 h-full" style={{ top: "4rem" }}>
          <Sidebar />
        </div>

        {/* Fixed Region Tabs */}
        <div className="fixed left-16 z-10 h-full" style={{ top: "4rem" }}>
          <RegionTabs activeRegion={activeRegion} onRegionChange={setActiveRegion} module="terminal" />
        </div>

        {/* Main Content Area with proper left margin */}
        <div className="flex-1 ml-64 overflow-hidden">
          <main className="p-6 overflow-y-auto overflow-x-hidden" style={{ height: "calc(100vh - 4rem)" }}>
            <VirtualizedTerminalGrid activeRegion={activeRegion} />
          </main>
        </div>
      </div>
    </div>
  )
}
