import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PokemonSpritesBg from "@/components/PokemonSpritesBg"

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
      <body className="antialiased min-h-screen" style={{ background: '#0b0f1e', color: '#dfe7ff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <PokemonSpritesBg />
        <div className="relative z-10">
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
