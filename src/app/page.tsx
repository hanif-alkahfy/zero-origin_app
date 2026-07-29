"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-8">
          <Skeleton className="h-12 w-80" />
          <div className="w-full space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            ONE ORIGIN KEY.
            <br />
            INFINITE CREDENTIALS.
          </h1>
          <p className="text-muted-foreground text-sm">
            Generate unique passwords without storing them.
            <br />
            Your Origin Key is the only secret you need to remember.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <Button variant="mono" size="lg" className="w-full" onClick={() => window.location.href = "/generator"}>
            Generate Password
          </Button>
        </div>
      </main>
    </div>
  )
}
