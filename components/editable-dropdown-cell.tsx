"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditableDropdownCellProps {
  value: string
  onSave: (value: string) => void
  options: { value: string; label: string; color?: string }[]
  className?: string
  renderValue?: (value: string) => React.ReactNode
}

export function EditableDropdownCell({ value, onSave, options, className, renderValue }: EditableDropdownCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleSave = (newValue: string) => {
    onSave(newValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="w-full h-full px-3 py-2">
        <Select
          value={editValue}
          onValueChange={handleSave}
          onOpenChange={(open) => {
            if (!open) {
              handleCancel()
            }
          }}
        >
          <SelectTrigger className="w-full h-6 text-xs border-none shadow-none p-0 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div
      className={cn("px-3 py-2 text-sm cursor-cell hover:bg-blue-50 transition-colors h-full w-full", className)}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {renderValue ? renderValue(value) : value}
    </div>
  )
}
