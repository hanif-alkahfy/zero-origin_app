"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const CLIPBOARD_TIMEOUT_MS = 30000

export function useClipboard() {
  const [status, setStatus] = useState<"idle" | "copied" | "cleared">("idle")
  const [countdown, setCountdown] = useState<number>(0)
  const timeoutRef = useRef<number | null>(null)
  const countdownRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }, [])

  const startCountdown = useCallback(() => {
    let secondsLeft = CLIPBOARD_TIMEOUT_MS / 1000
    setCountdown(secondsLeft)

    countdownRef.current = window.setInterval(() => {
      secondsLeft -= 1
      setCountdown(secondsLeft)
      if (secondsLeft <= 0) {
        clearInterval(countdownRef.current!)
        countdownRef.current = null
      }
    }, 1000)
  }, [])

  const copy = useCallback(async (text: string) => {
    clearTimers()

    try {
      await navigator.clipboard.writeText(text)
      setStatus("copied")
      startCountdown()

      timeoutRef.current = window.setTimeout(async () => {
        await navigator.clipboard.writeText("")
        setStatus("cleared")
        setCountdown(0)
      }, CLIPBOARD_TIMEOUT_MS)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [clearTimers, startCountdown])

  const clear = useCallback(async () => {
    clearTimers()
    try {
      await navigator.clipboard.writeText("")
      setStatus("cleared")
      setCountdown(0)
    } catch (err) {
      console.error("Failed to clear clipboard:", err)
    }
  }, [clearTimers])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  return {
    status,
    countdown,
    copy,
    clear,
  }
}
