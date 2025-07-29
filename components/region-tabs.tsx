"use client"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const REGIONS = [
  { key: "all", label: "All Regions", shortLabel: "All" },
  { key: "region-1", label: "Region 1 - Jakarta", shortLabel: "Region 1" },
  { key: "region-2", label: "Region 2 - Surabaya", shortLabel: "Region 2" },
  { key: "region-3", label: "Region 3 - Medan", shortLabel: "Region 3" },
  { key: "region-4", label: "Region 4 - Makassar", shortLabel: "Region 4" },
  { key: "region-5", label: "Region 5 - Balikpapan", shortLabel: "Region 5" },
  { key: "region-6", label: "Region 6 - Bandung", shortLabel: "Region 6" },
  { key: "region-7", label: "Region 7 - Palembang", shortLabel: "Region 7" },
]

interface RegionTabsProps {
  activeRegion: string
  onRegionChange: (region: string) => void
  module: string
}

export function RegionTabs({ activeRegion, onRegionChange, module }: RegionTabsProps) {
  return (
    <div className="w-48 h-full bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-800 capitalize">{module} Regions</span>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex-1 py-2 overflow-y-auto">
        {REGIONS.map((region) => (
          <button
            key={region.key}
            onClick={() => onRegionChange(region.key)}
            className={cn(
              "w-full px-4 py-3 text-left text-sm transition-colors border-r-2 hover:bg-gray-200",
              activeRegion === region.key
                ? "bg-blue-50 text-blue-700 border-blue-500 font-medium"
                : "text-gray-700 border-transparent",
            )}
            title={region.label}
          >
            <div className="truncate">{region.shortLabel}</div>
            {region.key !== "all" && (
              <div className="text-xs text-gray-500 truncate mt-0.5">{region.label.split(" - ")[1]}</div>
            )}
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0">
        <div>Active: {REGIONS.find((r) => r.key === activeRegion)?.shortLabel}</div>
      </div>
    </div>
  )
}
