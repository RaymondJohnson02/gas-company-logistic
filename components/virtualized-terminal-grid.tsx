"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useState, useMemo, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditableCell } from "@/components/editable-cell"
import { CalendarIcon, Plus, Save, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Product types
const PRODUCTS = [
  { key: "all", label: "All Products", color: "bg-gray-100" },
  { key: "pertalite", label: "Pertalite", color: "bg-blue-100" },
  { key: "pertamax", label: "Pertamax", color: "bg-green-100" },
  { key: "biosolar", label: "Biosolar", color: "bg-yellow-100" },
  { key: "dexlite", label: "Dexlite", color: "bg-purple-100" },
  { key: "pertamax-turbo", label: "Pertamax Turbo", color: "bg-red-100" },
  { key: "solar", label: "Solar", color: "bg-orange-100" },
]

// Region mapping - Updated with 2 new regions
const REGION_MAPPING = {
  all: "All Regions",
  "region-1": "Jakarta",
  "region-2": "Surabaya",
  "region-3": "Medan",
  "region-4": "Makassar",
  "region-5": "Balikpapan",
  "region-6": "Bandung",
  "region-7": "Palembang",
}

// Simulate large dataset with proper product names and regions - Updated with new regions
const generateLargeDataset = (size: number) => {
  const productNames = ["Pertalite", "Pertamax", "Biosolar", "Dexlite", "Pertamax Turbo", "Solar"]
  const regionNames = ["Jakarta", "Surabaya", "Medan", "Makassar", "Balikpapan", "Bandung", "Palembang"]

  return Array.from({ length: size }, (_, i) => {
    const date = new Date(2024, 0, 1)
    date.setDate(date.getDate() + (i % 365))

    return {
      id: i + 1,
      date: format(date, "yyyy-MM-dd"),
      terminal: `Terminal ${String.fromCharCode(65 + (i % 26))}`,
      product: productNames[i % productNames.length],
      openingStock: Math.floor(Math.random() * 10000),
      receipts: Math.floor(Math.random() * 5000),
      deliveries: Math.floor(Math.random() * 4000),
      closingStock: Math.floor(Math.random() * 8000),
      region: regionNames[i % regionNames.length],
      customer: `Customer ${i + 1}`,
      volume: Math.floor(Math.random() * 1000 * 100) / 100,
      unitPrice: Math.floor(Math.random() * 15000),
      totalValue: Math.floor(Math.random() * 15000000),
      status: ["Active", "Pending", "Completed"][i % 3],
    }
  })
}

const terminalColumns = [
  { key: "date", label: "Date", type: "text" as const, width: 120 },
  { key: "terminal", label: "Terminal", type: "text" as const, width: 120 },
  { key: "product", label: "Product", type: "text" as const, width: 140 },
  { key: "openingStock", label: "Opening Stock", type: "number" as const, width: 140 },
  { key: "receipts", label: "Receipts", type: "number" as const, width: 120 },
  { key: "deliveries", label: "Deliveries", type: "number" as const, width: 120 },
  { key: "closingStock", label: "Closing Stock", type: "number" as const, width: 140 },
  { key: "region", label: "Region", type: "text" as const, width: 120 },
  { key: "customer", label: "Customer", type: "text" as const, width: 120 },
  { key: "volume", label: "Volume (KL)", type: "number" as const, width: 120 },
  { key: "unitPrice", label: "Unit Price", type: "number" as const, width: 120 },
  { key: "totalValue", label: "Total Value", type: "number" as const, width: 140 },
  { key: "status", label: "Status", type: "text" as const, width: 120 },
]

// Create empty row template
const createEmptyRow = (id: number, product = "", region = "") => ({
  id,
  date: format(new Date(), "yyyy-MM-dd"),
  terminal: "",
  product: product,
  openingStock: 0,
  receipts: 0,
  deliveries: 0,
  closingStock: 0,
  region: region,
  customer: "",
  volume: 0,
  unitPrice: 0,
  totalValue: 0,
  status: "Active",
})

// Row component for virtualization
const VirtualRow = ({ index, style, data }: any) => {
  const { filteredData, handleCellUpdate, newRows, handleDeleteNewRow } = data
  const row = filteredData[index]
  const isNewRow = newRows.some((newRow: any) => newRow.id === row.id)

  return (
    <div
      style={style}
      className={`flex border-b border-gray-200 hover:bg-gray-50 ${
        isNewRow ? "bg-green-50 border-green-200" : index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      {/* Delete button for new rows */}
      {isNewRow && (
        <div className="w-10 flex items-center justify-center border-r border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteNewRow(row.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {terminalColumns.map((column) => (
        <div
          key={`${row.id}-${column.key}`}
          className="border-r border-gray-200 last:border-r-0 flex items-center"
          style={{ width: column.width, minWidth: column.width }}
        >
          {column.key === "region" && !isNewRow ? (
            <div className="px-3 py-2 text-sm text-center w-full">
              <Badge variant="outline">{row[column.key]}</Badge>
            </div>
          ) : column.key === "status" && !isNewRow ? (
            <div className="px-3 py-2 text-sm text-center w-full">
              <Badge
                variant={
                  row[column.key] === "Active" ? "default" : row[column.key] === "Pending" ? "secondary" : "outline"
                }
              >
                {row[column.key]}
              </Badge>
            </div>
          ) : column.key === "product" ? (
            <div className="px-3 py-2 text-sm text-center w-full">
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  row[column.key] === "Pertalite" && "bg-blue-100 text-blue-800",
                  row[column.key] === "Pertamax" && "bg-green-100 text-green-800",
                  row[column.key] === "Biosolar" && "bg-yellow-100 text-yellow-800",
                  row[column.key] === "Dexlite" && "bg-purple-100 text-purple-800",
                  row[column.key] === "Pertamax Turbo" && "bg-red-100 text-red-800",
                  row[column.key] === "Solar" && "bg-orange-100 text-orange-800",
                )}
              >
                {row[column.key]}
              </Badge>
            </div>
          ) : (
            <EditableCell
              value={row[column.key]}
              onSave={(value) => handleCellUpdate(row.id, column.key, value)}
              type={column.type}
              className="text-center w-full"
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Product Tab Content Component
const ProductTabContent = ({
  product,
  activeRegion,
  data,
  newRows,
  searchTerm,
  startDate,
  endDate,
  handleCellUpdate,
  handleDeleteNewRow,
  handleAddNewRow,
}: any) => {
  // Filter data for specific product and region
  const filteredData = useMemo(() => {
    const allData = [...data, ...newRows]
    return allData.filter((row) => {
      // Product filter
      const matchesProduct = product === "all" || row.product.toLowerCase().replace(/\s+/g, "-") === product

      // Region filter
      const matchesRegion =
        activeRegion === "all" || row.region === REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING]

      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        Object.values(row).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))

      // Date range filter
      const rowDate = new Date(row.date)
      const matchesDateRange = (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate)

      return matchesProduct && matchesRegion && matchesSearch && matchesDateRange
    })
  }, [data, newRows, product, activeRegion, searchTerm, startDate, endDate])

  const totalWidth = terminalColumns.reduce((sum, col) => sum + col.width, 0) + (newRows.length > 0 ? 40 : 0)

  return (
    <div className="space-y-4">
      {/* Add New Row for specific product and region */}
      <div className="flex items-center justify-between">
        <Button onClick={() => handleAddNewRow(product, activeRegion)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New {product === "all" ? "Row" : PRODUCTS.find((p) => p.key === product)?.label + " Row"}
          {activeRegion !== "all" && (
            <span className="ml-1">- {REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING]}</span>
          )}
        </Button>

        <div className="text-sm text-gray-600">
          {filteredData.length.toLocaleString()} records
          {product !== "all" && (
            <span className="ml-2 text-blue-600">({PRODUCTS.find((p) => p.key === product)?.label})</span>
          )}
          {activeRegion !== "all" && (
            <span className="ml-2 text-purple-600">
              ({REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING]})
            </span>
          )}
        </div>
      </div>

      {/* Data Grid */}
      <Card className="w-full">
        <CardContent className="p-0">
          <div className="w-full">
            {/* Fixed Header */}
            <div className="bg-slate-700 text-white sticky top-0 z-10 overflow-x-auto">
              <div className="flex" style={{ minWidth: totalWidth }}>
                {newRows.length > 0 && (
                  <div className="w-10 px-2 py-3 text-xs font-medium uppercase tracking-wider bg-slate-700 text-center border-r border-slate-600 flex-shrink-0">
                    Del
                  </div>
                )}
                {terminalColumns.map((column) => (
                  <div
                    key={column.key}
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wider bg-slate-700 text-center border-r border-slate-600 last:border-r-0 flex-shrink-0"
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    {column.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Virtualized Rows */}
            {filteredData.length > 0 ? (
              <div className="overflow-auto">
                <List
                  height={450}
                  itemCount={filteredData.length}
                  itemSize={40}
                  itemData={{
                    filteredData,
                    handleCellUpdate,
                    newRows,
                    handleDeleteNewRow,
                  }}
                  width="100%"
                >
                  {VirtualRow}
                </List>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                No {product === "all" ? "" : PRODUCTS.find((p) => p.key === product)?.label} data found matching your
                filters
                {activeRegion !== "all" && (
                  <span className="ml-1">in {REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING]}</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface VirtualizedTerminalGridProps {
  activeRegion: string
}

export function VirtualizedTerminalGrid({ activeRegion }: VirtualizedTerminalGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [data, setData] = useState(() => generateLargeDataset(100000))
  const [newRows, setNewRows] = useState<any[]>([])
  const [nextId, setNextId] = useState(100001)
  const [activeTab, setActiveTab] = useState("all")

  const handleCellUpdate = useCallback(
    (rowId: number, field: string, value: string) => {
      // Check if it's a new row
      const isNewRow = newRows.some((row) => row.id === rowId)

      if (isNewRow) {
        setNewRows((prev) =>
          prev.map((row) => {
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
                updatedRow[field] = Number.parseFloat(value) || 0
              } else {
                updatedRow[field] = value
              }
              return updatedRow
            }
            return row
          }),
        )
      } else {
        // Update existing data
        setData((prev) =>
          prev.map((row) => {
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
                updatedRow[field] = Number.parseFloat(value) || 0
              } else {
                updatedRow[field] = value
              }
              return updatedRow
            }
            return row
          }),
        )
      }
    },
    [newRows],
  )

  const handleAddNewRow = (productKey = "all", regionKey = "all") => {
    let productName = ""
    if (productKey !== "all") {
      const product = PRODUCTS.find((p) => p.key === productKey)
      productName = product?.label || ""
    }

    let regionName = ""
    if (regionKey !== "all") {
      regionName = REGION_MAPPING[regionKey as keyof typeof REGION_MAPPING] || ""
    }

    const newRow = createEmptyRow(nextId, productName, regionName)
    setNewRows((prev) => [...prev, newRow])
    setNextId((prev) => prev + 1)
  }

  const handleDeleteNewRow = (rowId: number) => {
    setNewRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  const handleSaveNewRows = () => {
    if (newRows.length > 0) {
      setData((prev) => [...prev, ...newRows])
      setNewRows([])
      console.log("Saved new rows:", newRows)
    }
  }

  const handleCancelNewRows = () => {
    setNewRows([])
  }

  // Get counts for each product tab (filtered by active region)
  const getProductCount = (productKey: string) => {
    const allData = [...data, ...newRows]
    let filtered = allData

    // Filter by region first
    if (activeRegion !== "all") {
      filtered = filtered.filter((row) => row.region === REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING])
    }

    // Then filter by product
    if (productKey === "all") return filtered.length
    return filtered.filter((row) => row.product.toLowerCase().replace(/\s+/g, "-") === productKey).length
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header with Region Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900">
          Terminal Operations - {REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING]}
        </h2>
        <p className="text-sm text-blue-700">
          {activeRegion === "all"
            ? "Viewing data from all regions nationwide"
            : `Viewing data specifically for ${REGION_MAPPING[activeRegion as keyof typeof REGION_MAPPING]} region`}
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Start Date Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[200px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[200px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters */}
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              onClick={() => {
                setStartDate(undefined)
                setEndDate(undefined)
              }}
              className="mt-6"
            >
              Clear Dates
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>
      </div>

      {/* New Rows Management */}
      {newRows.length > 0 && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-800">
              {newRows.length} new row{newRows.length > 1 ? "s" : ""} added
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSaveNewRows} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-1" />
              Save All ({newRows.length})
            </Button>
            <Button onClick={handleCancelNewRows} size="sm" variant="outline">
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 gap-1 h-10 p-1 mb-4">
          {PRODUCTS.map((product) => (
            <TabsTrigger
              key={product.key}
              value={product.key}
              className="text-xs font-medium px-3 py-1 h-8 data-[state=active]:bg-white flex items-center justify-center"
            >
              <span className="truncate mr-2">{product.label}</span>
              <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {getProductCount(product.key).toLocaleString()}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {PRODUCTS.map((product) => (
          <TabsContent key={product.key} value={product.key} className="mt-0">
            <ProductTabContent
              product={product.key}
              activeRegion={activeRegion}
              data={data}
              newRows={newRows}
              searchTerm={searchTerm}
              startDate={startDate}
              endDate={endDate}
              handleCellUpdate={handleCellUpdate}
              handleDeleteNewRow={handleDeleteNewRow}
              handleAddNewRow={handleAddNewRow}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
