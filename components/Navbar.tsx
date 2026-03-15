'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import AuthModal from '@/components/AuthModal'

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
  const { user, loading, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    setSigningOut(false)
  }

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <>
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

          {/* Desktop auth area */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold select-none"
                    style={{
                      background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)',
                      color: '#0b0f1e',
                    }}
                    title={user.email ?? ''}
                  >
                    {avatarLetter}
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#9fb0ff',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = '#dfe7ff'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = '#9fb0ff'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    {signingOut ? 'Signing out…' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#9fb0ff',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = '#dfe7ff'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = '#9fb0ff'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    Sign In
                  </button>
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
              )
            )}
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

            {!loading && (
              user ? (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: 'rgba(124,198,255,0.06)', border: '1px solid rgba(124,198,255,0.1)' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)', color: '#0b0f1e' }}
                  >
                    {avatarLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ color: '#9fb0ff' }}>{user.email}</p>
                  </div>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    className="text-xs font-medium"
                    style={{ color: '#7cc6ff' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    onClick={() => { setShowAuth(true); setMenuOpen(false) }}
                    className="px-4 py-3 text-sm font-medium rounded-lg text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9fb0ff' }}
                  >
                    Sign In / Sign Up
                  </button>
                  <Link
                    href="/grade"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-sm font-semibold rounded-lg text-center"
                    style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)', color: '#0b0f1e' }}
                  >
                    Grade Free
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
