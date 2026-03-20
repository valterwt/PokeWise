'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export type CookiePreferences = {
  necessary: true       // always true, cannot be disabled
  functional: boolean   // remembers preferences, binder state
  analytics: boolean    // usage analytics (if added in future)
  marketing: boolean    // no marketing cookies currently used
}

const STORAGE_KEY = 'gradevault_cookie_consent_v1'

export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const existing = getCookieConsent()
    if (!existing) setVisible(true)
  }, [])

  const save = (choices: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choices))
    setVisible(false)
  }

  const acceptAll = () => save({ necessary: true, functional: true, analytics: true, marketing: true })
  const acceptNecessary = () => save({ necessary: true, functional: false, analytics: false, marketing: false })
  const saveCustom = () => save(prefs)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:pb-6"
        >
          <div
            className="max-w-4xl mx-auto rounded-2xl p-5 md:p-6 shadow-2xl"
            style={{
              background: '#0e1223',
              border: '1px solid rgba(124,198,255,0.2)',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
            }}
          >
            {!showCustomize ? (
              /* Default banner */
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">🍪</span>
                    <h2 className="font-bold text-sm text-white">We use cookies</h2>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#9fb0ff' }}>
                    GradeVault uses essential cookies to keep you signed in and remember your settings. We would also
                    like to set optional cookies to improve your experience. You can change your preferences at any
                    time via our{' '}
                    <Link href="/cookies" className="underline hover:text-white transition-colors" style={{ color: '#7cc6ff' }}>
                      Cookie Policy
                    </Link>
                    . We process your data in accordance with our{' '}
                    <Link href="/privacy" className="underline hover:text-white transition-colors" style={{ color: '#7cc6ff' }}>
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowCustomize(true)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#9fb0ff',
                    }}
                  >
                    Customise
                  </button>
                  <button
                    onClick={acceptNecessary}
                    className="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#dfe7ff',
                    }}
                  >
                    Necessary only
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)',
                      color: '#0b0f1e',
                    }}
                  >
                    Accept all
                  </button>
                </div>
              </div>
            ) : (
              /* Customise panel */
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="text-xs transition-colors"
                    style={{ color: '#9fb0ff' }}
                  >
                    ← Back
                  </button>
                  <h2 className="font-bold text-sm text-white">Cookie preferences</h2>
                </div>

                <div className="space-y-3 mb-5">
                  {([
                    {
                      key: 'necessary' as const,
                      label: 'Strictly necessary',
                      desc: 'Authentication, session management, security. Cannot be disabled.',
                      locked: true,
                    },
                    {
                      key: 'functional' as const,
                      label: 'Functional',
                      desc: 'Remembers your binder layout, display preferences, and UI settings.',
                      locked: false,
                    },
                    {
                      key: 'analytics' as const,
                      label: 'Analytics',
                      desc: 'Helps us understand how visitors use GradeVault so we can improve it. No personal data is sold.',
                      locked: false,
                    },
                    {
                      key: 'marketing' as const,
                      label: 'Marketing',
                      desc: 'Currently not used. Reserved for future promotional features.',
                      locked: false,
                    },
                  ] as const).map((cat) => (
                    <div
                      key={cat.key}
                      className="flex items-start justify-between gap-4 rounded-xl p-3"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-white">{cat.label}</span>
                          {cat.locked && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(124,198,255,0.1)', color: '#7cc6ff' }}>
                              Always on
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed" style={{ color: '#9fb0ff' }}>{cat.desc}</p>
                      </div>
                      <button
                        disabled={cat.locked}
                        onClick={() => !cat.locked && setPrefs({ ...prefs, [cat.key]: !prefs[cat.key] })}
                        className={`flex-shrink-0 mt-0.5 w-10 h-5 rounded-full transition-all ${cat.locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        style={{
                          background: prefs[cat.key] ? 'linear-gradient(135deg, #7cc6ff, #a78bfa)' : 'rgba(255,255,255,0.1)',
                        }}
                        role="switch"
                        aria-checked={prefs[cat.key]}
                        aria-label={`Toggle ${cat.label}`}
                      >
                        <span
                          className="block w-4 h-4 rounded-full bg-white shadow transition-transform mx-auto"
                          style={{ transform: prefs[cat.key] ? 'translateX(5px)' : 'translateX(-5px)' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={acceptNecessary}
                    className="px-4 py-2 text-xs font-semibold rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9fb0ff' }}
                  >
                    Necessary only
                  </button>
                  <button
                    onClick={saveCustom}
                    className="px-4 py-2 text-xs font-semibold rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)', color: '#0b0f1e' }}
                  >
                    Save preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
