import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "PokeWise — AI Pokémon Card Grading",
  description: "AI-powered Pokémon card grading platform. Instant, accurate, animated. Grade your cards, build your binder, join the community.",
  keywords: "pokemon, card grading, AI grading, PSA, pokemon cards, collector",
  openGraph: {
    title: "PokeWise — AI Pokémon Card Grading",
    description: "AI-powered Pokémon card grading. Instant. Accurate. Animated.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
