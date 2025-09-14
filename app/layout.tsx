import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { InstallPrompt } from "@/components/install-prompt"
import { AuthProvider } from "@/components/auth-provider"
import { Suspense } from "react"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Criyago - Comprehensive Wellness Platform",
  description:
    "Your daily wellness companion for maintaining a balanced lifestyle. Track activities, set goals, get reminders, and enjoy engaging wellness games.",
  generator: "v0.app",
  keywords:
    "wellness, health tracking, habit tracker, activity monitoring, goal setting, reminders, wellness games, balanced lifestyle, health companion",
  authors: [{ name: "Criyago Team" }],
  metadataBase: new URL("https://criyago.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Criyago - Ultimate Boredom Buster & Social Games Hub",
    description:
      "The ultimate social gaming hub for youth and millennials. Play Truth or Dare, Ludo King, 8 Ball Pool, and more with friends! Access multiple game platforms instantly.",
    type: "website",
    siteName: "Criyago",
    url: "https://criyago.vercel.app",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Criyago - Social Gaming Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Criyago - Ultimate Boredom Buster & Social Games Hub",
    description:
      "The ultimate social gaming hub for youth and millennials. Play Truth or Dare, Ludo King, 8 Ball Pool, and more with friends!",
    images: ["/og-image.jpg"],
    creator: "@criyago",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Criyago",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Criyago" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Criyago",
              description: "The ultimate social gaming hub for youth and millennials",
              url: "https://criyago.vercel.app",
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.7",
                ratingCount: "1250",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
            <InstallPrompt />
          </Suspense>
          <Toaster richColors position="top-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}