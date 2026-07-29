"use client"

import { useEffect } from "react"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const path = window.location.pathname
    
    // Skip /pin route
    if (path === "/pin") return

    // Check sessionStorage for auth
    const hasSession = sessionStorage.getItem('pin-auth')
    if (!hasSession) {
      window.location.href = "/pin"
    }
  }, [])

  return <>{children}</>
}
