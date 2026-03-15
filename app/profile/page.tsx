'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import GradeBadge from '@/components/GradeBadge'
import AuthModal from '@/components/AuthModal'

type Profile = {
  username: string
  email: string
  avatar: string | null
  created_at: string
}

type CardRow = {
  id: string
  card_name: string
  front_image_url: string
  created_at: string
  grades: {
    overall: number
    centering: number
    corners: number
    edges: number
    surface: number
  } | null
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cards, setCards] = useState<CardRow[]>([])
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Edit username
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameSuccess, setUsernameSuccess] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    Promise.all([
      supabase
        .from('users')
        .select('username, email, avatar, created_at')
        .eq('id', user.id)
        .single(),
      supabase
        .from('cards')
        .select('id, card_name, front_image_url, created_at, grades(overall, centering, corners, edges, surface)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(24),
    ]).then(([profileRes, cardsRes]) => {
      setProfile(profileRes.data ?? null)
      if (profileRes.data) setNewUsername(profileRes.data.username)
      setCards((cardsRes.data as CardRow[]) ?? [])
      setLoading(false)
    })
  }, [user])

  const saveUsername = async () => {
    if (!user || !newUsername.trim()) return
    setUsernameLoading(true)
    setUsernameError(null)
    setUsernameSuccess(false)
    try {
      const username = newUsername.trim().replace(/[^a-zA-Z0-9_]/g, '_')
      const { error } = await supabase.from('users').upsert(
        { id: user.id, username, email: user.email! },
        { onConflict: 'id' },
      )
      if (error) {
        if (error.message.includes('unique') || error.message.includes('duplicate')) {
          setUsernameError('That username is already taken.')
        } else {
          setUsernameError(error.message)
        }
        return
      }
      setProfile((p) => p ? { ...p, username } : null)
      setEditingUsername(false)
      setUsernameSuccess(true)
      setTimeout(() => setUsernameSuccess(false), 3000)
    } finally {
      setUsernameLoading(false)
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
          <div className="text-5xl mb-5">👤</div>
          <h1 className="text-3xl font-black mb-3">Your Profile</h1>
          <p className="text-gray-400 mb-8">Sign in to view your profile and grade history.</p>
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

  const avatarLetter = (profile?.username ?? user.email ?? '?')[0].toUpperCase()
  const gradeList = cards.map((c) => c.grades?.overall ?? 0).filter((g) => g > 0)
  const avgGrade = gradeList.length > 0 ? (gradeList.reduce((s, g) => s + g, 0) / gradeList.length).toFixed(1) : '—'
  const bestGrade = gradeList.length > 0 ? Math.max(...gradeList) : null

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile header */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)', color: '#0b0f1e' }}
            >
              {avatarLetter}
            </div>
            <div>
              <div className="font-bold text-xl">{profile?.username ?? 'No username set'}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              {profile?.created_at && (
                <div className="text-xs text-gray-600 mt-0.5">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Username edit */}
          {editingUsername ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Username</label>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="your_username"
                  maxLength={30}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">Letters, numbers, and underscores only.</p>
              </div>
              {usernameError && (
                <div className="px-3 py-2 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
                  {usernameError}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={saveUsername}
                  disabled={usernameLoading}
                  className="px-5 py-2 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {usernameLoading ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingUsername(false); setUsernameError(null) }}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {usernameSuccess && (
                <span className="text-green-400 text-sm">Username updated!</span>
              )}
              <button
                onClick={() => setEditingUsername(true)}
                className="px-4 py-2 text-sm border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                Edit Username
              </button>
              <Link
                href="/account"
                className="px-4 py-2 text-sm border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                Manage Subscription
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Cards Graded', value: cards.length },
              { label: 'Avg Grade', value: avgGrade },
              { label: 'Gem Mint (9+)', value: gradeList.filter((g) => g >= 9).length },
              { label: 'Best Grade', value: bestGrade ?? '—' },
            ].map((s) => (
              <div key={s.label} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-[#ffd700]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Grade history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl">Grade History</h2>
            <Link href="/binder" className="text-sm text-[#e63946] hover:text-[#c1121f] transition-colors">
              View full binder →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-16 bg-[#141414] border border-[#1e1e1e] rounded-2xl text-gray-500">
              <div className="text-4xl mb-3">🎴</div>
              <p className="mb-3">No grades yet.</p>
              <Link href="/grade" className="text-sm text-[#e63946] hover:text-[#c1121f] transition-colors">
                Grade your first card →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-16 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {card.front_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.front_image_url} alt={card.card_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">🎴</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{card.card_name}</div>
                    {card.grades && (
                      <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                        <span>C: {card.grades.centering.toFixed(1)}</span>
                        <span>Co: {card.grades.corners.toFixed(1)}</span>
                        <span>E: {card.grades.edges.toFixed(1)}</span>
                        <span>S: {card.grades.surface.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mt-0.5">
                      {new Date(card.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {card.grades && <GradeBadge grade={card.grades.overall} size="md" />}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
