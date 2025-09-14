"use client"

import { HeroSection } from "@/components/hero-section"
import { GameCard } from "@/components/game-card"
import { FloatingShapes } from "@/components/floating-shapes"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"

const gameCategories = {
  "Classic & Party": [
    {
      title: "Truth or Dare",
      description: "The ultimate party game that brings friends closer with hilarious truths and daring challenges!",
      category: "Party Game",
      players: "3-10 players",
      duration: "15-30 min",
      rating: 4.8,
      imageUrl: "/truth-or-dare-party-game-colorful-fun-friends-circ.jpg",
      gameUrls: ["https://truthordareplay.com/", "https://psycatgames.com/app/truth-or-dare/"],
      featured: true,
    },
    {
      title: "Would You Rather",
      description: "Make impossible choices and discover what your friends really think in this mind-bending game!",
      category: "Party Game",
      players: "2-8 players",
      duration: "10-20 min",
      rating: 4.6,
      imageUrl: "/would-you-rather-choice-game-colorful-decision-mak.jpg",
      gameUrls: [
        "https://wouldyourather.app/s/ref07",
        "https://wouldurather.io/",
        "https://crowdparty.app/game/would-you-rather",
      ],
    },
    {
      title: "Never Have I Ever",
      description: "Share secrets and learn surprising facts about your friends in this revealing party classic!",
      category: "Party Game",
      players: "3-12 players",
      duration: "20-40 min",
      rating: 4.7,
      imageUrl: "/never-have-i-ever-party-game-friends-secrets-color.jpg",
      gameUrls: ["https://neverhaveiever.online/", "https://psycatgames.com/app/never-have-i-ever/"],
    },
    {
      title: "Most Likely To",
      description: "Vote on who's most likely to do crazy things and laugh at the hilarious results!",
      category: "Party Game",
      players: "4-10 players",
      duration: "15-25 min",
      rating: 4.5,
      imageUrl: "/most-likely-to-voting-game-fun-colorful-friends.jpg",
      gameUrls: ["https://psycatgames.com/app/most-likely-to/"],
    },
    {
      title: "Quick Draw",
      description: "Google's AI-powered drawing game that challenges your artistic skills in just 20 seconds!",
      category: "Creative",
      players: "1 player",
      duration: "2-5 min",
      rating: 4.7,
      imageUrl: "/quick-draw-google-ai-drawing-game-colorful-artisti.jpg",
      gameUrls: ["https://quickdraw.withgoogle.com/"],
    },
  ],
  "Board & Casual": [
    {
      title: "Ludo King",
      description: "The classic board game reimagined for the digital age with friends and family fun!",
      category: "Board Game",
      players: "2-4 players",
      duration: "20-30 min",
      rating: 4.9,
      imageUrl: "/ludo-king-board-game-colorful-dice-family-fun.jpg",
      gameUrls: ["https://ludoking.com/play/", "https://www.crazygames.com/game/ludo-king"],
      featured: true,
    },
    {
      title: "Snake and Ladder",
      description: "Climb ladders and avoid snakes in this timeless game of luck and strategy!",
      category: "Board Game",
      players: "2-4 players",
      duration: "15-25 min",
      rating: 4.4,
      imageUrl: "/snake-and-ladder-board-game-classic-colorful-snake.jpg",
      gameUrls: [
        "https://www.crazygames.com/game/snakes-and-ladders",
        "https://poki.com/en/g/snakes-and-ladders",
        "https://gamesnacks.com/games/snakesandladders",
      ],
    },
    {
      title: "Checkers",
      description: "Master the art of strategy in this classic game of tactical thinking!",
      category: "Strategy",
      players: "2 players",
      duration: "15-30 min",
      rating: 4.3,
      imageUrl: "/checkers-strategy-board-game-red-black-pieces.jpg",
      gameUrls: ["https://www.247checkers.com/", "https://cardgames.io/checkers/", "https://checkers.online/play"],
    },
    {
      title: "UNO Online",
      description: "The beloved card game that brings out everyone's competitive side!",
      category: "Card Game",
      players: "2-8 players",
      duration: "10-20 min",
      rating: 4.7,
      imageUrl: "/uno-card-game-colorful-cards-red-blue-yellow-green.jpg",
      gameUrls: [
        "https://www.crazygames.com/game/uno-online",
        "https://unoonline.co/",
        "https://unoonline.io/#google_vignette",
      ],
    },
    {
      title: "Chess",
      description:
        "Master the ultimate strategy game! Challenge your mind with the timeless battle of kings and queens.",
      category: "Strategy",
      players: "2 players",
      duration: "15-60 min",
      rating: 4.9,
      imageUrl: "/chess-strategy-board-game-black-white-pieces-checkmate.jpg",
      gameUrls: ["https://www.chess.com/play", "https://poki.com/en/g/master-chess"],
      featured: true,
    },
    {
      title: "Carrom",
      description: "Flick and strike! Master this exciting board game that combines skill, strategy and precision.",
      category: "Board Game",
      players: "2-4 players",
      duration: "20-30 min",
      rating: 4.6,
      imageUrl: "/carrom-board-game-wooden-striker-coins-family-fun.jpg",
      gameUrls: ["https://gamesnacks.com/games/carromclash#goog_fullscreen_ad", "https://poki.com/en/g/carrom-rush"],
    },
    {
      title: "Tic Tac Toe",
      description: "The classic strategy game of X's and O's! Challenge friends or test your skills against AI in this timeless puzzle.",
      category: "Strategy",
      players: "2 players",
      duration: "2-5 min",
      rating: 4.5,
      imageUrl: "/tic-tac-toe-icon.svg",
      gameUrls: ["https://www.crazygames.com/game/tic-tac-toe", "https://poki.com/en/g/tic-tac-toe-3"],
      featured: true,
    },
    {
      title: "Monopoly",
      description: "Build your empire and bankrupt your friends in the world's most famous board game!",
      category: "Strategy",
      players: "2-6 players",
      duration: "60-120 min",
      rating: 4.6,
      imageUrl: "/monopoly-board-game-property-trading-colorful-mone.jpg",
      gameUrls: [
        "https://www.marmaladegamestudio.com/games/monopoly/",
        "https://richup.io/",
        "https://www.gameflare.com/online-game/monopoly-online/",
      ],
    },
  ],
  "Sports & Skill": [
    {
      title: "8 Ball Pool",
      description: "Show off your pool skills in the most realistic online billiards experience!",
      category: "Sports",
      players: "1-2 players",
      duration: "5-15 min",
      rating: 4.8,
      imageUrl: "/8-ball-pool-billiards-game-realistic-green-table-c.jpg",
      gameUrls: ["https://8ballpool.com/en/game"],
      featured: true,
    },
    {
      title: "Ping Pong",
      description: "Fast-paced table tennis action that tests your reflexes and precision!",
      category: "Sports",
      players: "1-2 players",
      duration: "5-10 min",
      rating: 4.5,
      imageUrl: "/ping-pong-table-tennis-game-orange-ball-blue-table.jpg",
      gameUrls: [
        "https://poki.com/en/g/ping-pong-html5",
        "https://gamesnacks.com/games/tabletennis",
        "https://www.crazygames.com/game/table-tennis-world-tour",
      ],
    },
    {
      title: "Air Hockey",
      description: "Lightning-fast puck action in this thrilling arcade-style sports game!",
      category: "Sports",
      players: "1-2 players",
      duration: "3-8 min",
      rating: 4.4,
      imageUrl: "/air-hockey-arcade-game-fast-paced-blue-table-red-p.jpg",
      gameUrls: ["https://www.cbc.ca/kids/games/all/air-hockey", "https://www.crazygames.com/game/air-hockey-cup"],
    },
    {
      title: "Bowling",
      description: "Strike! Spare! Perfect your technique in this classic alley sport!",
      category: "Sports",
      players: "1-4 players",
      duration: "10-20 min",
      rating: 4.3,
      imageUrl: "/bowling-game-strikes-spares-alley-colorful-pins-ba.jpg",
      gameUrls: [
        "https://poki.com/en/bowling",
        "https://www.crazygames.com/game/classic-bowling",
        "https://www.cbc.ca/kids/games/all/classic-bowling",
      ],
    },
    {
      title: "Darts",
      description: "Aim for the bullseye and prove your precision in this classic pub game!",
      category: "Skill",
      players: "1-4 players",
      duration: "10-20 min",
      rating: 4.2,
      imageUrl: "/darts-game-precision-target-bullseye-colorful-dart.jpg",
      gameUrls: [
        "https://www.coolmathgames.com/0-darts",
        "https://www.crazygames.com/game/darts-club",
        "https://poki.com/en/g/darts-pro",
      ],
    },
  ],
  "Quick & Fun": [
    {
      title: "Spin the Bottle",
      description: "The classic party icebreaker that creates unforgettable moments!",
      category: "Icebreaker",
      players: "4-12 players",
      duration: "10-30 min",
      rating: 4.3,
      imageUrl: "/spin-bottle-party-game-colorful-circle-friends-fun.jpg",
      gameUrls: ["https://spinthebottle.app/", "https://psycatgames.com/app/spin-the-bottle/"],
    },
    {
      title: "Guess the Emoji",
      description: "Decode emoji puzzles and test your pop culture knowledge!",
      category: "Puzzle",
      players: "1+ players",
      duration: "5-15 min",
      rating: 4.6,
      imageUrl: "/guess-emoji-puzzle-game-colorful-symbols-brain-tea.jpg",
      gameUrls: [
        "https://psycatgames.com/app/guess-the-emoji/",
        "https://www.crazygames.com/game/emoji-puzzle",
        "https://poki.com/en/g/guess-the-emojis",
      ],
    },
    {
      title: "What If",
      description: "Explore hypothetical scenarios and spark interesting conversations!",
      category: "Discussion",
      players: "2+ players",
      duration: "10-25 min",
      rating: 4.4,
      imageUrl: "/what-if-question-game-thought-bubble-colorful-disc.jpg",
      gameUrls: ["https://psycatgames.com/app/what-if/"],
    },
  ],
}

export default function HomePage() {
  // Remove category filtering - show all games
  const allGames = Object.values(gameCategories).flat()

  return (
    <main className="min-h-screen">
      <FloatingShapes />

      <HeroSection />

      <section
        id="games-section"
        className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              <Heart className="w-4 h-4 mr-2" />
              Handpicked Games
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-balance bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Choose Your Adventure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From party classics to competitive challenges, find the perfect game for any mood or occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allGames.map((game, index) => (
              <div key={`${game.title}-${index}`} className="animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <GameCard {...game} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}