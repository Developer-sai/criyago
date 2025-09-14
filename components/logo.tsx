"use client"

import React from "react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "light" | "dark" | "gradient"
}

export function Logo({ className = "", size = "md", variant = "gradient" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl"
  }

  const variantClasses = {
    light: "text-white",
    dark: "text-gray-900",
    gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
  }

  return (
    <div className={`font-black ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      CriyaGo
    </div>
  )
}

// SVG Logo Component for more detailed usage
export function LogoSVG({ className = "", width = 120, height = 40 }: { className?: string; width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#be185d" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <text
        x="60"
        y="28"
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill="url(#logoGradient)"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CriyaGo
      </text>
    </svg>
  )
}

// Icon version for smaller spaces
export function LogoIcon({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#be185d" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#iconGradient)" />
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fontSize="12"
        fontWeight="900"
        fill="white"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        C
      </text>
    </svg>
  )
}