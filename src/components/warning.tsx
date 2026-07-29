"use client"

import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

interface WarningProps {
  message: string
  description?: string
  className?: string
}

function Warning({ message, description, className }: WarningProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border border-yellow-600/50 bg-yellow-950/30 p-4 text-yellow-200",
        className
      )}
      role="alert"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold font-mono text-sm">{message}</p>
        {description && (
          <p className="text-xs text-yellow-200/80 font-mono">{description}</p>
        )}
      </div>
    </div>
  )
}

export { Warning }
