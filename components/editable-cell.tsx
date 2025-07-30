"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableCellProps {
  value: string | number
  onSave: (value: string) => void
  type?: "text" | "number"
  className?: string
}

export function EditableCell({ value, onSave, type = "text", className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(value.toString())
  }

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setEditValue(value.toString())
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        type={type}
        className="w-full h-full px-3 py-2 text-sm bg-transparent border-none outline-none focus:ring-0 text-center"
        style={{
          margin: 0,
          boxShadow: "none",
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }}
      />
    )
  }

  return (
    <div
      className={cn("px-3 py-2 text-sm cursor-cell hover:bg-blue-50 transition-colors h-full w-full", className)}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {type === "number" && typeof value === "number" ? value.toLocaleString("en-US") : value}
    </div>
  )
}
