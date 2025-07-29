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
      <Sidebar />
      <RegionTabs activeRegion={activeRegion} onRegionChange={setActiveRegion} module="terminal" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <VirtualizedTerminalGrid activeRegion={activeRegion} />
        </main>
      </div>
    </div>
  )
}
