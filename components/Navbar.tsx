'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/grade', label: 'Grade a Card' },
  { href: '/binder', label: 'My Binder' },
  { href: '/leaderboards', label: 'Leaderboards' },
  { href: '/newsletter', label: 'Restoration' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: 'rgba(11,15,30,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">⚡</span>
          <span style={{ color: '#dfe7ff' }}>Grade</span>
          <span style={{ color: '#7cc6ff' }}>Vault</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                pathname === link.href
                  ? { background: 'rgba(124,198,255,0.12)', color: '#7cc6ff' }
                  : { color: '#9fb0ff' }
              }
              onMouseEnter={e => {
                if (pathname !== link.href) {
                  (e.currentTarget as HTMLElement).style.color = '#dfe7ff'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (pathname !== link.href) {
                  (e.currentTarget as HTMLElement).style.color = '#9fb0ff'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/grade"
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)',
              color: '#0b0f1e',
              boxShadow: '0 0 20px rgba(124,198,255,0.3)',
            }}
          >
            Grade Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{ color: '#9fb0ff' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-3 flex flex-col gap-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(11,15,30,0.97)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={
                pathname === link.href
                  ? { background: 'rgba(124,198,255,0.12)', color: '#7cc6ff' }
                  : { color: '#9fb0ff' }
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/grade"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-4 py-3 text-sm font-semibold rounded-lg text-center"
            style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)', color: '#0b0f1e' }}
          >
            Grade Free
          </Link>
        </div>
      )}
    </nav>
  )
}
