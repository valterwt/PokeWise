'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import GradeBadge from '@/components/GradeBadge'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

type GradeRow = {
  overall: number
  centering: number
  corners: number
  edges: number
  surface: number
  summary: string
  recommendation: string
}

type CardRow = {
  id: string
  card_name: string
  front_image_url: string
  back_image_url: string | null
  created_at: string
  // Supabase returns one-to-many as an array; we always take [0]
  grades: GradeRow[] | null
}

type SortOption = 'date_desc' | 'date_asc' | 'grade_desc' | 'grade_asc'

function gradeLabel(grade: number): string {
  if (grade >= 9.5) return 'Gem Mint'
  if (grade >= 9)   return 'Mint'
  if (grade >= 8)   return 'NM-MT'
  if (grade >= 7)   return 'Near Mint'
  if (grade >= 6)   return 'EX-NM'
  if (grade >= 5)   return 'Excellent'
  if (grade >= 4)   return 'VG-EX'
  if (grade >= 3)   return 'Very Good'
  if (grade >= 2)   return 'Good'
  return 'Poor'
}

function displayName(cardName: string, grade: number | null | undefined): string {
  const name = cardName?.trim()
  if (name && name.toLowerCase() !== 'unknown card') return name
  if (grade != null && grade > 0) return `${gradeLabel(grade)} · ${grade.toFixed(1)}`
  return 'Graded Card'
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100
  const color = value >= 9 ? '#ffd700' : value >= 7 ? '#22c55e' : value >= 5 ? '#eab308' : '#e63946'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function CardDetailModal({ card, onClose }: { card: CardRow; onClose: () => void }) {
  const g = card.grades?.[0] ?? null
  const grade = g?.overall ?? 0
  const gradeColor = grade >= 9 ? '#ffd700' : grade >= 7 ? '#22c55e' : grade >= 5 ? '#eab308' : '#e63946'
  const gradeLabel =
    grade >= 9.5 ? 'GEM-MT' : grade >= 9 ? 'MINT' : grade >= 8 ? 'NM-MT' :
    grade >= 7 ? 'NM' : grade >= 6 ? 'EX-NM' : grade >= 5 ? 'EX' :
    grade >= 4 ? 'VG-EX' : 'VG'
  const gradeName =
    grade >= 9.5 ? 'Gem Mint' : grade >= 9 ? 'Mint' : grade >= 8 ? 'Near Mint–Mint' :
    grade >= 7 ? 'Near Mint' : grade >= 6 ? 'Excellent–Near Mint' : grade >= 5 ? 'Excellent' :
    grade >= 4 ? 'Very Good–Excellent' : grade >= 3 ? 'Very Good' : grade >= 2 ? 'Good' : 'Poor'

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #111827, #0f172a)',
          border: '1px solid rgba(124,198,255,0.15)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: '#9fb0ff', background: 'rgba(255,255,255,0.07)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Card image */}
        <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center"
          style={{ minHeight: 220 }}>
          {card.front_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.front_image_url} alt={card.card_name}
              className="w-full object-contain" style={{ maxHeight: 260 }} />
          ) : (
            <span className="text-7xl opacity-30 py-12">🎴</span>
          )}
          {/* Grade badge overlay */}
          <div className="absolute bottom-3 right-3">
            <GradeBadge grade={grade} size="lg" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Header */}
          <div>
            <h2 className="text-lg font-black mb-0.5">{displayName(card.card_name, grade)}</h2>
            <div className="text-xs text-gray-500">
              Graded {new Date(card.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Overall grade */}
          <div
            className="flex items-center justify-between rounded-xl px-5 py-4"
            style={{
              background: `linear-gradient(135deg, ${gradeColor}15, ${gradeColor}08)`,
              border: `1px solid ${gradeColor}30`,
            }}
          >
            <div>
              <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wider">GradeVaultAI Score</div>
              <div className="text-2xl font-black" style={{ color: gradeColor }}>{grade.toFixed(1)}</div>
              <div className="text-sm font-semibold text-white/80">{gradeName}</div>
            </div>
            <div
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: `${gradeColor}20`, color: gradeColor, border: `1px solid ${gradeColor}40` }}
            >
              {gradeLabel}
            </div>
          </div>

          {/* Sub-scores */}
          {g && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Grade Breakdown</div>
              <ScoreBar label="Centering" value={g.centering} />
              <ScoreBar label="Corners"   value={g.corners} />
              <ScoreBar label="Edges"     value={g.edges} />
              <ScoreBar label="Surface"   value={g.surface} />
            </div>
          )}

          {/* AI summary */}
          {g?.summary && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Condition Report</div>
              <p className="text-sm text-gray-300 leading-relaxed">{g.summary}</p>
            </div>
          )}

          {/* Recommendation */}
          {g?.recommendation && (
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Worth Professional Grading?</div>
              <p className="text-sm text-gray-300 leading-relaxed">{g.recommendation}</p>
            </div>
          )}

          <Link
            href="/grade"
            className="block text-center py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)', color: '#e63946' }}
          >
            Grade Another Card →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BinderCard({ card, index }: { card: CardRow; index: number }) {
  const [open, setOpen] = useState(false)
  // grades is an array from Supabase — take the first entry
  const grade = card.grades?.[0]?.overall ?? 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-[#141414] border-2 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 ${
          grade >= 9 ? 'border-[#ffd700]/40 grade-glow-gold' :
          grade >= 7 ? 'border-green-500/40 grade-glow-green' :
          grade >= 5 ? 'border-yellow-500/40 grade-glow-yellow' :
          'border-red-600/40 grade-glow-red'
        }`}
        onClick={() => setOpen(true)}
      >
        {/* Card image */}
        <div className="relative h-48 bg-gradient-to-b from-[#1a1a1a] to-[#111] flex items-center justify-center">
          {card.front_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.front_image_url} alt={card.card_name} className="h-full w-full object-contain p-3" />
          ) : (
            <span className="text-6xl opacity-40">🎴</span>
          )}
          <div className="absolute top-3 right-3">
            <GradeBadge grade={grade} size="md" />
          </div>
        </div>

        {/* Card info */}
        <div className="p-4">
          <h3 className="font-bold text-sm mb-1 truncate">{displayName(card.card_name, grade)}</h3>
          <div className="text-xs text-gray-500">
            {new Date(card.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && <CardDetailModal card={card} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default function BinderPage() {
  const { user, loading: authLoading } = useAuth()
  const [cards, setCards] = useState<CardRow[]>([])
  const [loadingCards, setLoadingCards] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('date_desc')
  const [filterGrade, setFilterGrade] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoadingCards(true)
    setFetchError(null)

    supabase
      .from('cards')
      .select('id, card_name, front_image_url, back_image_url, created_at, grades(overall, centering, corners, edges, surface, summary, recommendation)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setFetchError('Failed to load your cards. Please try again.')
        } else {
          setCards((data as unknown as CardRow[]) ?? [])
        }
        setLoadingCards(false)
      })
  }, [user])

  const filteredCards = cards
    .filter((c) => {
      const grade = c.grades?.[0]?.overall ?? 0
      if (filterGrade === 'gem' && grade < 9) return false
      if (filterGrade === 'nm' && (grade < 7 || grade >= 9)) return false
      if (filterGrade === 'played' && grade >= 7) return false
      if (search && !c.card_name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      const ga = a.grades?.[0]?.overall ?? 0
      const gb = b.grades?.[0]?.overall ?? 0
      if (sortBy === 'grade_desc') return gb - ga
      if (sortBy === 'grade_asc') return ga - gb
      if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const grades = cards.map((c) => c.grades?.[0]?.overall ?? 0)
  const avgGrade = grades.length > 0 ? grades.reduce((s, g) => s + g, 0) / grades.length : 0
  const bestGrade = grades.length > 0 ? Math.max(...grades) : 0

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
          <div className="text-6xl mb-6">📒</div>
          <h1 className="text-3xl font-black mb-3">Your Binder</h1>
          <p className="text-gray-400 mb-8 max-w-sm">
            Sign in to save your graded cards and build your personal collection.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl transition-colors"
          >
            Sign In / Sign Up
          </button>
          <Link href="/grade" className="mt-4 text-sm text-gray-500 hover:text-white transition-colors">
            Grade a card first →
          </Link>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">My Binder</h1>
            <p className="text-gray-400">Your personal graded card collection.</p>
          </div>
          <Link
            href="/grade"
            className="px-6 py-3 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl transition-colors text-center"
          >
            + Grade New Card
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Cards',  value: cards.length },
            { label: 'Avg Grade',    value: cards.length > 0 ? avgGrade.toFixed(1) : '—' },
            { label: 'Gem Mint (9+)', value: grades.filter((g) => g >= 9).length },
            { label: 'Best Grade',   value: cards.length > 0 ? bestGrade : '—' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-[#ffd700]">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {fetchError && (
          <div className="mb-6 px-4 py-3 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
            {fetchError}
          </div>
        )}

        {/* Filters */}
        {cards.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm"
            />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
            >
              <option value="all">All Grades</option>
              <option value="gem">Gem Mint (9+)</option>
              <option value="nm">Near Mint (7–8.9)</option>
              <option value="played">Played (&lt;7)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="grade_desc">Highest Grade</option>
              <option value="grade_asc">Lowest Grade</option>
            </select>
          </div>
        )}

        {/* Content */}
        {loadingCards ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📒</div>
            <p className="mb-2">Your binder is empty.</p>
            <Link href="/grade" className="text-sm text-[#e63946] hover:text-[#c1121f] transition-colors">
              Grade your first card →
            </Link>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p>No cards match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCards.map((card, i) => (
              <BinderCard key={card.id} card={card} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
