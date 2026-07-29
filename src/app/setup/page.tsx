"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/password-input"
import { Warning } from "@/components/warning"
import { Skeleton } from "@/components/ui/skeleton"
import { useSessionStorage } from "@/hooks/use-session-storage"

type StrengthLevel = "weak" | "medium" | "strong"

function getPasswordStrength(password: string): StrengthLevel {
  if (password.length < 8) return "weak"
  
  let score = 0
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  
  if (score >= 5) return "strong"
  if (score >= 3) return "medium"
  return "weak"
}

function StrengthIndicator({ strength }: { strength: StrengthLevel }) {
  const colors = {
    weak: "bg-destructive",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  }
  
  const labels = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
  }
  
  const widths = {
    weak: "33%",
    medium: "66%",
    strong: "100%",
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[strength]} transition-all`}
          style={{ width: widths[strength] }}
        />
      </div>
      <span className={`text-xs ${
        strength === "weak" ? "text-destructive" :
        strength === "medium" ? "text-yellow-500" :
        "text-green-500"
      }`}>
        {labels[strength]}
      </span>
    </div>
  )
}

export default function SetupPage() {
  const { isAuthenticated, isLoading, setOriginKey } = useSessionStorage()
  const [mounted, setMounted] = useState(false)
  const [originKey, setOriginKeyState] = useState("")
  const [confirmKey, setConfirmKey] = useState("")
  const [error, setError] = useState("")
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-6">
          <Skeleton className="h-8 w-64" />
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </main>
      </div>
    )
  }

  const strength = getPasswordStrength(originKey)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (originKey.length < 8) {
      setError("Origin Key must be at least 8 characters")
      return
    }

    if (originKey !== confirmKey) {
      setError("Origin Key does not match")
      return
    }

    setShowWarning(true)
  }

  const handleConfirm = () => {
    setOriginKey(originKey)
    window.location.href = "/generator"
  }

  if (showWarning) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-6">
          <Warning
            message="Your Origin Key is the source of all credentials."
            description="If lost, passwords cannot be recovered. There is no backup, no recovery, no reset."
          />

          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <Button variant="mono" size="lg" className="w-full" onClick={handleConfirm}>
              I Understand - Continue
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setShowWarning(false)}
            >
              Go Back
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-6">
        <h1 className="text-2xl font-bold tracking-tight">CREATE YOUR ORIGIN KEY</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="originKey" className="text-sm font-medium">
              Origin Key
            </label>
            <PasswordInput
              id="originKey"
              placeholder="Enter your Origin Key"
              value={originKey}
              onChange={(e) => setOriginKeyState(e.target.value)}
            />
            {originKey && <StrengthIndicator strength={strength} />}
            <span className="text-xs text-muted-foreground">Minimum 8 characters</span>
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="confirmKey" className="text-sm font-medium">
              Confirm Origin Key
            </label>
            <PasswordInput
              id="confirmKey"
              placeholder="Confirm your Origin Key"
              value={confirmKey}
              onChange={(e) => setConfirmKey(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" variant="mono" size="lg" className="w-full mt-2">
            Continue
          </Button>
        </form>

        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Home
        </Link>
      </main>
    </div>
  )
}

