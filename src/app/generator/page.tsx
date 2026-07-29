"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useSessionStorage } from "@/hooks/use-session-storage"

export default function GeneratorPage() {
  const { getOriginKey, removeOriginKey, isAuthenticated, isLoading } = useSessionStorage()
  
  const [originKey, setOriginKey] = useState<string>("")
  const [site, setSite] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isLoading) return
    
    if (!isAuthenticated) {
      return
    }
    
    const key = getOriginKey()
    if (key) {
      setOriginKey(key)
    }
  }, [isLoading, isAuthenticated, getOriginKey])

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-6">
          <Skeleton className="h-8 w-64" />
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated || !originKey) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <p className="text-muted-foreground mb-4">No Origin Key found.</p>
        <Link href="/setup">
          <Button variant="mono">Set Up Origin Key</Button>
        </Link>
      </div>
    )
  }

  const generatePassword = async () => {
    if (!site.trim() || !username.trim()) {
      setError("Site and Username are required")
      return
    }
    setError("")
    setCopied(false)
    setIsGenerating(true)

    try {
      const { generatePassword: generate } = await import("@/lib/crypto")
      const result = await generate({
        originKey,
        site: site.trim(),
        username: username.trim().toLowerCase(),
      })
      setPassword(result)
    } catch (err) {
      setError("Failed to generate password")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClearOriginKey = () => {
    removeOriginKey()
    window.location.href = "/"
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <main className="w-full max-w-[600px] flex flex-col items-center text-center gap-6">
        <h1 className="text-2xl font-bold tracking-tight">GENERATE PASSWORD</h1>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="site" className="text-sm font-medium">
              Site
            </label>
            <Input
              id="site"
              type="text"
              placeholder="github.com"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="user@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-mono"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-left">{error}</p>
          )}

          <Button variant="mono" size="lg" className="w-full mt-2" onClick={generatePassword} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Password"
            )}
          </Button>
        </div>

        {password && (
          <div className="w-full flex flex-col gap-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm font-medium">Generated Password</label>
              <div className="relative">
                <div className="p-3 pr-10 bg-card border border-border rounded-md font-mono text-sm break-all">
                  {showPassword ? password : "•".repeat(password.length)}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button variant="mono" className="w-full" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        )}

        <div className="w-full pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClearOriginKey}>
            Clear Origin Key
          </Button>
        </div>

        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Home
        </Link>
      </main>
    </div>
  )
}
