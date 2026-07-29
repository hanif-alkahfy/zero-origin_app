"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function Home() {
  const [showAlert, setShowAlert] = useState(false)
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

  const handleGoToGenerator = () => {
    const key = sessionStorage.getItem("originKey")
    if (key) {
      window.location.href = "/generator"
    } else {
      setShowAlert(true)
    }
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
          <Link href="/setup">
            <Button variant="mono" size="lg" className="w-full">
              Create Origin Key
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full" onClick={handleGoToGenerator}>
            Go to Generator
          </Button>
        </div>
      </main>

      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Origin Key Found</DialogTitle>
            <DialogDescription>
              You need to set up an Origin Key first before using the password generator.
              Your Origin Key is the master secret that generates all your passwords.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link href="/setup">
              <Button variant="mono" onClick={() => setShowAlert(false)}>
                Create Origin Key
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
