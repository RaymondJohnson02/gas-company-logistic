"use client"

import { useState } from "react"
import { Home, BarChart3, Truck, Factory, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Home, label: "Dashboard", active: false },
  { icon: MapPin, label: "Terminal", active: true },
  { icon: Factory, label: "Refinery", active: false },
  { icon: Truck, label: "Transportation", active: false },
  { icon: BarChart3, label: "Reports", active: false },
]

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Terminal")

  return (
    <div className="w-16 h-full bg-slate-800 flex flex-col items-center py-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = item.label === activeItem

        return (
          <button
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-slate-700",
            )}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        )
      })}
    </div>
  )
}
