"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function PinPage() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    // Check sessionStorage instead of cookie
    const hasSession = sessionStorage.getItem('pin-auth')
    if (hasSession) {
      window.location.href = "/"
    }
  }, [])

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [remainingTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (remainingTime > 0) {
      setError(`Too many attempts. Wait ${remainingTime} seconds.`)
      return
    }

    if (pin.length !== 6) {
      setError("PIN must be 6 digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      })

      const data = await res.json()

      if (res.ok) {
        // Store in sessionStorage (deleted when tab closes)
        sessionStorage.setItem('pin-auth', 'true')
        window.location.href = "/"
      } else {
        if (data.retryAfter) {
          setRemainingTime(data.retryAfter)
          setError(`Too many attempts. Wait ${data.retryAfter} seconds.`)
        } else {
          setError(data.error || "Invalid PIN")
        }
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Enter PIN</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              placeholder="000000"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              disabled={remainingTime > 0}
            />
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              variant="mono" 
              className="w-full"
              disabled={isLoading || remainingTime > 0 || pin.length !== 6}
            >
              {isLoading ? "Verifying..." : remainingTime > 0 ? `Wait ${remainingTime}s` : "Unlock"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
