"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Gamepad2, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToGames = () => {
    document.getElementById("games-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 overflow-hidden">
      {/* Navigation Header */}
      <nav className="relative z-20 w-full px-4 py-6">
        <div className="container mx-auto flex items-center justify-center">
          <Logo size="lg" className="drop-shadow-lg" />
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="container mx-auto px-4 text-center z-10">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge
            className="mb-6 border-0 shadow-lg font-semibold"
            style={{
              backgroundColor: "rgb(126, 34, 206)",
              color: "white",
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Ultimate Gaming Experience
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
            CRIYAGO
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-balance font-semibold">
            Ultimate Boredom Buster & Social Games Hub
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto text-pretty">
            Dive into the most addictive collection of social games. From classic party games to competitive challenges
            - your next gaming adventure starts here!
          </p>

          <div className="flex justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={scrollToGames}
              className="text-lg px-8 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold !text-white"
              style={{
                background: "linear-gradient(to right, rgb(126, 34, 206), rgb(190, 24, 93)) !important",
                color: "rgb(255, 255, 255) !important",
                border: "none",
              }}
            >
              <Gamepad2 className="w-6 h-6 mr-2" />
              Start Playing Now
            </Button>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}