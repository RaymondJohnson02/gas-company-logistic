"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditableCell } from "@/components/editable-cell"
import { Save, Download, FileText } from "lucide-react"

// Mock data structure for terminal operations
const terminalColumns = [
  { key: "date", label: "Date", type: "text" as const },
  { key: "terminal", label: "Terminal", type: "text" as const },
  { key: "product", label: "Product", type: "text" as const },
  { key: "openingStock", label: "Opening Stock", type: "number" as const },
  { key: "receipts", label: "Receipts", type: "number" as const },
  { key: "deliveries", label: "Deliveries", type: "number" as const },
  { key: "closingStock", label: "Closing Stock", type: "number" as const },
  { key: "region", label: "Region", type: "text" as const },
  { key: "customer", label: "Customer", type: "text" as const },
  { key: "volume", label: "Volume (KL)", type: "number" as const },
  { key: "unitPrice", label: "Unit Price", type: "number" as const },
  { key: "totalValue", label: "Total Value", type: "number" as const },
  { key: "status", label: "Status", type: "text" as const },
]

const initialData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  date: `2024-01-${String(i + 1).padStart(2, "0")}`,
  terminal: `Terminal ${String.fromCharCode(65 + (i % 5))}`,
  product: ["Premium", "Pertamax", "Solar", "Kerosene"][i % 4],
  openingStock: Math.floor(Math.random() * 10000),
  receipts: Math.floor(Math.random() * 5000),
  deliveries: Math.floor(Math.random() * 4000),
  closingStock: Math.floor(Math.random() * 8000),
  region: ["Jakarta", "Surabaya", "Medan", "Makassar", "Balikpapan"][i % 5],
  customer: `Customer ${i + 1}`,
  volume: Math.floor(Math.random() * 1000 * 100) / 100,
  unitPrice: Math.floor(Math.random() * 15000),
  totalValue: Math.floor(Math.random() * 15000000),
  status: ["Active", "Pending", "Completed"][i % 3],
}))

export function TerminalGrid() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState(initialData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const filteredData = data.filter((row) => {
    const matchesRegion = selectedRegion === "all" || row.region === selectedRegion
    const matchesSearch =
      searchTerm === "" ||
      Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesRegion && matchesSearch
  })

  const handleCellUpdate = (rowId: number, field: string, value: string) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row.id === rowId) {
          const updatedRow = { ...row }
          if (
            field === "openingStock" ||
            field === "receipts" ||
            field === "deliveries" ||
            field === "closingStock" ||
            field === "volume" ||
            field === "unitPrice" ||
            field === "totalValue"
          ) {
            updatedRow[field as keyof typeof row] = Number.parseFloat(value) || 0
          } else {
            updatedRow[field as keyof typeof row] = value as any
          }
          return updatedRow
        }
        return row
      }),
    )
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    // Here you would typically save to your backend/database
    console.log("Saving data:", data)
    setHasUnsavedChanges(false)
    // Show success message
  }

  const getStatusBadge = (status: string) => {
    const variant = status === "Active" ? "default" : status === "Pending" ? "secondary" : "outline"
    return <Badge variant={variant}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Terminal Operations</h1>
          <p className="text-gray-600">Track terminal logistics and inventory - Double-click cells to edit</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions (National)</SelectItem>
              <SelectItem value="Jakarta">Jakarta</SelectItem>
              <SelectItem value="Surabaya">Surabaya</SelectItem>
              <SelectItem value="Medan">Medan</SelectItem>
              <SelectItem value="Makassar">Makassar</SelectItem>
              <SelectItem value="Balikpapan">Balikpapan</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Terminals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Volume (KL)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredData.reduce((sum, row) => sum + row.volume, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value (IDR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filteredData.reduce((sum, row) => sum + row.totalValue, 0) / 1000000000).toFixed(1)}B
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
            </div>
            <Button onClick={handleSave} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              Save Now
            </Button>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Terminal Data Grid</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="bg-slate-700 text-white sticky top-0 z-10">
                <div className="grid grid-cols-13 gap-px">
                  {terminalColumns.map((column) => (
                    <div
                      key={column.key}
                      className="px-3 py-3 text-xs font-medium uppercase tracking-wider bg-slate-700 text-center"
                      style={{ minWidth: "120px" }}
                    >
                      {column.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Body */}
              <div className="bg-white">
                {filteredData.map((row, rowIndex) => (
                  <div
                    key={row.id}
                    className={`grid grid-cols-13 gap-px border-b border-gray-200 hover:bg-gray-50 ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {terminalColumns.map((column) => (
                      <div
                        key={`${row.id}-${column.key}`}
                        className="border-r border-gray-200 last:border-r-0 min-h-[40px] flex items-center"
                        style={{ minWidth: "120px" }}
                      >
                        {column.key === "region" ? (
                          <div className="px-3 py-2 text-sm text-center w-full">
                            <Badge variant="outline">{row[column.key as keyof typeof row]}</Badge>
                          </div>
                        ) : column.key === "status" ? (
                          <div className="px-3 py-2 text-sm text-center w-full">
                            {getStatusBadge(row[column.key as keyof typeof row] as string)}
                          </div>
                        ) : (
                          <EditableCell
                            value={row[column.key as keyof typeof row] as string | number}
                            onSave={(value) => handleCellUpdate(row.id, column.key, value)}
                            type={column.type}
                            className="text-center w-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleSave}
          className="bg-red-600 hover:bg-red-700 text-white px-8"
          disabled={!hasUnsavedChanges}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Data
        </Button>
        <Button variant="outline" className="px-8 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
        <Button variant="outline" className="px-8 bg-transparent">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  )
}
