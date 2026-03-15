'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const FREE_LIMIT = parseInt(process.env.NEXT_PUBLIC_FREE_GRADES_LIMIT ?? '3', 10)

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: '$0',
    period: 'forever',
    highlight: false,
    badge: null,
    description: `Create a free account and get ${FREE_LIMIT} AI grades — no credit card required. See exactly how your cards score before upgrading.`,
    features: [
      `${FREE_LIMIT} AI grades on signup`,
      'Full grade breakdown',
      'Pack-opening reveal',
      'Community leaderboards',
    ],
    cta: 'Create Free Account',
    href: '/grade',
  },
  {
    id: 'pack' as const,
    name: 'Grader Pack',
    price: '$4.99',
    period: 'one-time',
    highlight: false,
    badge: 'Best Value',
    description: 'Got a small collection to assess? Buy 25 grades once and use them whenever — no subscription, no expiry.',
    features: [
      '25 AI grades',
      'Full grade breakdown',
      'Pack-opening reveal',
      'Binder storage',
      'Priority queue',
    ],
    cta: 'Buy 25 Grades',
    href: null,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    highlight: true,
    badge: 'Most Popular',
    description: 'Grade your entire collection without limits. Built for collectors who want the full picture, every card, every time.',
    features: [
      'Unlimited AI grades',
      'Full grade breakdown',
      'Pack-opening reveal',
      'Binder storage',
      'Priority queue',
      'Early access to new features',
    ],
    cta: 'Go Pro',
    href: null,
  },
]

function PricingContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<'pack' | 'pro' | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    if (searchParams.get('success')) {
      const plan = searchParams.get('plan')
      setToast({
        type: 'success',
        msg: plan === 'pro'
          ? 'Welcome to Pro! Unlimited grades are now active.'
          : '25 grades added to your account. Happy grading!',
      })
    }
    if (searchParams.get('canceled')) {
      setToast({ type: 'error', msg: 'Checkout canceled — no charge was made.' })
    }
  }, [searchParams])

  const handleCheckout = async (plan: 'pack' | 'pro') => {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      window.location.href = data.url
    } catch (err) {
      setToast({
        type: 'error',
        msg: err instanceof Error ? err.message : 'Checkout failed. Please try again.',
      })
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen px-4 py-20">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg border ${
            toast.type === 'success'
              ? 'bg-green-500/20 border-green-500/40 text-green-300'
              : 'bg-red-500/20 border-red-500/40 text-red-300'
          }`}
        >
          {toast.msg}
          <button className="ml-4 opacity-60 hover:opacity-100" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/20 text-[#e63946] text-sm font-medium px-4 py-2 rounded-full mb-6">
            ⚡ Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#dfe7ff] mb-4">
            Grade more. Collect smarter.
          </h1>
          <p className="text-[#9fb0ff] text-lg max-w-xl mx-auto">
            Create a free account to get started — no credit card required. Upgrade when you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-[2px] transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#7cc6ff] via-[#a78bfa] to-[#7cc6ff]'
                  : 'bg-[#1e2540]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#7cc6ff] text-[#0b0f1e] text-xs font-black rounded-full uppercase tracking-wider whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div
                className="rounded-[14px] p-7 h-full flex flex-col"
                style={{ background: plan.highlight ? '#0f1628' : '#111828' }}
              >
                <div className="mb-6">
                  <div className="text-sm font-bold text-[#9fb0ff] uppercase tracking-widest mb-2">{plan.name}</div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-black text-[#dfe7ff]">{plan.price}</span>
                    <span className="text-[#9fb0ff] text-sm mb-1">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-[#9fb0ff]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#dfe7ff]">
                      <span className="text-[#7cc6ff] flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.href ? (
                  <a
                    href={plan.href}
                    className="w-full py-3 rounded-xl font-bold text-center text-sm transition-all bg-white/5 hover:bg-white/10 border border-white/10 text-[#dfe7ff]"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.id as 'pack' | 'pro')}
                    disabled={loading === plan.id}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-[#7cc6ff] to-[#a78bfa] text-[#0b0f1e] hover:opacity-90'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-[#dfe7ff]'
                    }`}
                  >
                    {loading === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Redirecting…
                      </span>
                    ) : plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#9fb0ff]/50 mt-10">
          Payments are processed securely by Stripe. Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  )
}
