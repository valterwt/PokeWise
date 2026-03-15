'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import AuthModal from '@/components/AuthModal'

type Credits = {
  free_grades_used: number
  paid_credits: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: 'none' | 'active' | 'cancelled'
}

const FREE_LIMIT = parseInt(process.env.NEXT_PUBLIC_FREE_GRADES_LIMIT ?? '3', 10)

function PlanBadge({ status }: { status: Credits['subscription_status'] }) {
  if (status === 'active') return <span className="px-3 py-1 text-xs font-bold bg-[#ffd700]/20 text-[#ffd700] rounded-full border border-[#ffd700]/30">PRO</span>
  if (status === 'cancelled') return <span className="px-3 py-1 text-xs font-bold bg-gray-500/20 text-gray-400 rounded-full border border-gray-500/30">CANCELLED</span>
  return <span className="px-3 py-1 text-xs font-bold bg-white/10 text-gray-300 rounded-full border border-white/10">FREE</span>
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loadingCredits, setLoadingCredits] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoadingCredits(true)
    supabase
      .from('user_credits')
      .select('free_grades_used, paid_credits, stripe_customer_id, stripe_subscription_id, subscription_status')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setCredits(data ?? {
          free_grades_used: 0,
          paid_credits: 0,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          subscription_status: 'none',
        })
        setLoadingCredits(false)
      })
  }, [user])

  const openBillingPortal = async () => {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Portal failed')
      window.location.href = data.url
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : 'Error opening portal')
      setPortalLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="text-5xl mb-5">⚙️</div>
          <h1 className="text-3xl font-black mb-3">Account</h1>
          <p className="text-gray-400 mb-8">Sign in to manage your subscription and account settings.</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl transition-colors"
          >
            Sign In / Sign Up
          </button>
        </div>
      </>
    )
  }

  const isPro = credits?.subscription_status === 'active'
  const freeLeft = Math.max(0, FREE_LIMIT - (credits?.free_grades_used ?? 0))

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black mb-1">Account</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Current Plan */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Current Plan</h2>
            {credits && <PlanBadge status={credits.subscription_status} />}
          </div>

          {loadingCredits ? (
            <div className="h-8 w-32 bg-[#1e1e1e] rounded animate-pulse" />
          ) : (
            <>
              {isPro ? (
                <p className="text-gray-400 text-sm">You have <span className="text-white font-semibold">unlimited grades</span> with your Pro subscription.</p>
              ) : (
                <p className="text-gray-400 text-sm">
                  Free plan — <span className="text-white font-semibold">{freeLeft} free grade{freeLeft !== 1 ? 's' : ''}</span> remaining.
                  {credits && credits.paid_credits > 0 && (
                    <span> Plus <span className="text-[#ffd700] font-semibold">{credits.paid_credits} paid credit{credits.paid_credits !== 1 ? 's' : ''}</span>.</span>
                  )}
                </p>
              )}
            </>
          )}
        </div>

        {/* Usage */}
        {!loadingCredits && credits && (
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Usage</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-[#ffd700]">{credits.free_grades_used}</div>
                <div className="text-xs text-gray-500 mt-1">Free Grades Used</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-[#ffd700]">{credits.paid_credits}</div>
                <div className="text-xs text-gray-500 mt-1">Paid Credits Left</div>
              </div>
            </div>
          </div>
        )}

        {/* Billing */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Billing</h2>

          {portalError && (
            <div className="mb-4 px-4 py-2 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
              {portalError}
            </div>
          )}

          {isPro && credits?.stripe_customer_id ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Manage your subscription, update payment methods, or download invoices through the Stripe billing portal.</p>
              <button
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="w-full py-3 bg-[#ffd700] hover:bg-[#e6c200] disabled:opacity-50 text-black font-bold rounded-xl transition-colors text-sm"
              >
                {portalLoading ? 'Opening portal…' : 'Manage Subscription / Billing Portal'}
              </button>
              <p className="text-xs text-gray-600 text-center">Cancel anytime — takes effect at the end of your billing period.</p>
            </div>
          ) : credits?.subscription_status === 'cancelled' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Your Pro subscription has been cancelled. Resubscribe to get unlimited grades.</p>
              <Link
                href="/pricing"
                className="block w-full py-3 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl transition-colors text-sm text-center"
              >
                Resubscribe
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Upgrade to Pro for unlimited grades, or grab a one-time credit pack.</p>
              <Link
                href="/pricing"
                className="block w-full py-3 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl transition-colors text-sm text-center"
              >
                View Plans
              </Link>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Account</h2>
          <div className="space-y-2">
            <Link href="/profile" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#1a1a1a] transition-colors group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Edit Profile / Grade History</span>
              <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
            </Link>
            <Link href="/binder" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#1a1a1a] transition-colors group">
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">My Binder</span>
              <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#1a1a1a] transition-colors group text-left"
            >
              <span className="text-sm text-red-500/70 group-hover:text-red-500 transition-colors">Sign Out</span>
              <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
