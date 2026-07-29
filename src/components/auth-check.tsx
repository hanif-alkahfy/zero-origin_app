"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const path = window.location.pathname
    
    // Skip auth check for /pin route
    if (path === "/pin") {
      setIsLoading(false)
      return
    }

    const cookies = document.cookie
    if (!cookies.includes("pin-session=authenticated")) {
      router.replace("/pin")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Don't block /pin page
  if (window.location.pathname === "/pin") {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
