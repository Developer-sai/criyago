"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Service worker registered successfully:", registration.scope)
        })
        .catch((error) => {
          console.log("[SW] Service worker registration failed:", error)
          // Silently fail - PWA features won't be available but app still works
        })
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-sm animate-bounce-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Install Criyago</h4>
            <p className="text-sm text-muted-foreground mb-3">Get the full experience with our PWA!</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleInstall}>
                <Download className="w-4 h-4 mr-1" />
                Install
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPrompt(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}