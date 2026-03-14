import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import CardSpritesBg from "@/components/CardSpritesBg"

export const metadata: Metadata = {
  title: "GradeVault — AI TCG Card Grading",
  description: "AI-powered TCG card grading platform. Instant, accurate, animated. Grade your cards, build your binder, join the community.",
  keywords: "TCG, card grading, AI grading, PSA, trading card grader, collector, card condition",
  openGraph: {
    title: "GradeVault — AI TCG Card Grading",
    description: "AI-powered TCG card grading. Instant. Accurate. Animated.",
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
        <CardSpritesBg />
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
