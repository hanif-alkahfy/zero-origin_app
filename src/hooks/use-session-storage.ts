"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const STORAGE_KEY = "originKey"

export function useSessionStorage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const key = sessionStorage.getItem(STORAGE_KEY)
    // Check for existing session on mount - this is intentional
    // eslint-disable-next-line
    setIsAuthenticated(!!key)
    // eslint-disable-next-line
    setIsLoading(false)
  }, [])

  const setOriginKey = useCallback((key: string) => {
    sessionStorage.setItem(STORAGE_KEY, key)
    setIsAuthenticated(true)
  }, [])

  const getOriginKey = useCallback((): string | null => {
    return sessionStorage.getItem(STORAGE_KEY)
  }, [])

  const removeOriginKey = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }, [])

  return {
    isAuthenticated,
    isLoading,
    setOriginKey,
    getOriginKey,
    removeOriginKey,
  }
}
