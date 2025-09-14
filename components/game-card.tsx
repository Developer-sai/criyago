"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Clock, Star } from "lucide-react"
import { useState, useCallback } from "react"

interface GameCardProps {
  title: string
  description: string
  category: string
  players: string
  duration: string
  rating: number
  imageUrl: string
  gameUrls: string[]
  featured?: boolean
}

export function GameCard({
  title,
  description,
  category,
  players,
  duration,
  rating,
  imageUrl,
  gameUrls,
  featured = false,
}: GameCardProps) {
  const [showAllLinks, setShowAllLinks] = useState(false)

  const handlePlayNow = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  const toggleShowAllLinks = useCallback(() => {
    setShowAllLinks((prev) => !prev)
  }, [])

  const getDomainName = useCallback((url: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "")
      return domain.charAt(0).toUpperCase() + domain.slice(1)
    } catch {
      return "Play"
    }
  }, [])

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/20 border-2 ${
        featured
          ? "ring-2 ring-gradient-to-r ring-purple-500 border-purple-300"
          : "border-purple-200/50 hover:border-purple-300"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <Badge
            className="border-0 shadow-lg"
            style={{
              background: "linear-gradient(to right, rgb(234, 88, 12), rgb(219, 39, 119))",
              color: "white",
            }}
          >
            {category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge
              className="border-0 shadow-lg"
              style={{
                background: "linear-gradient(to right, rgb(245, 158, 11), rgb(234, 88, 12))",
                color: "white",
              }}
            >
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-balance bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-pretty">{description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
            <Users className="w-3 h-3 text-purple-600" />
            <span className="text-purple-700 dark:text-purple-300">{players}</span>
          </div>
          <div className="flex items-center gap-1 bg-pink-100 dark:bg-pink-900/30 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 text-pink-600" />
            <span className="text-pink-700 dark:text-pink-300">{duration}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-yellow-700 dark:text-yellow-300">{rating}</span>
          </div>
        </div>

        <div className="space-y-2">
          {gameUrls.length === 1 ? (
            <Button
              onClick={() => handlePlayNow(gameUrls[0])}
              className="w-full font-medium shadow-lg transition-all duration-300"
              style={{
                background: "linear-gradient(to right, rgb(126, 34, 206), rgb(190, 24, 93))",
                color: "rgb(255, 255, 255)",
              }}
            >
              Play Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handlePlayNow(gameUrls[0])}
                className="w-full font-medium shadow-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(to right, rgb(126, 34, 206), rgb(190, 24, 93))",
                  color: "rgb(255, 255, 255)",
                }}
              >
                Play Now - {getDomainName(gameUrls[0])}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>

              {gameUrls.length > 1 && (
                <>
                  {showAllLinks &&
                    gameUrls.slice(1).map((url, index) => (
                      <Button
                        key={index + 1}
                        onClick={() => handlePlayNow(url)}
                        variant="outline"
                        className="w-full transition-all duration-300"
                        style={{
                          backgroundColor: "rgb(248, 250, 252)",
                          borderColor: "rgb(126, 34, 206)",
                          color: "rgb(126, 34, 206)",
                        }}
                      >
                        Play on {getDomainName(url)}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    ))}

                  <Button
                    onClick={toggleShowAllLinks}
                    variant="ghost"
                    className="w-full text-xs transition-all duration-300"
                    style={{
                      color: "rgb(126, 34, 206)",
                      backgroundColor: "transparent",
                    }}
                  >
                    {showAllLinks ? "Show Less" : `+${gameUrls.length - 1} More Options`}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
