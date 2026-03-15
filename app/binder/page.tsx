'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import GradeBadge from '@/components/GradeBadge'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

type CardRow = {
  id: string
  card_name: string
  front_image_url: string
  back_image_url: string | null
  created_at: string
  grades: {
    overall: number
    centering: number
    corners: number
    edges: number
    surface: number
    summary: string
    recommendation: string
  } | null
}

type SortOption = 'date_desc' | 'date_asc' | 'grade_desc' | 'grade_asc'

function BinderCard({ card, index }: { card: CardRow; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const grade = card.grades?.overall ?? 0

  return (
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
      onClick={() => setExpanded(!expanded)}
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
        <h3 className="font-bold text-sm mb-1 truncate">{card.card_name}</h3>
        <div className="text-xs text-gray-500">
          Graded {new Date(card.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Expanded breakdown */}
      {expanded && card.grades && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 border-t border-[#1e1e1e] pt-3"
        >
          <div className="text-xs text-gray-500 mb-3">Full Breakdown</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {([
              ['Centering', card.grades.centering],
              ['Corners',   card.grades.corners],
              ['Edges',     card.grades.edges],
              ['Surface',   card.grades.surface],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="flex justify-between bg-[#1a1a1a] rounded-lg px-3 py-2">
                <span className="text-gray-500">{label}</span>
                <span className="font-bold text-[#ffd700]">{val.toFixed(1)}</span>
              </div>
            ))}
          </div>
          {card.grades.summary && (
            <p className="mt-3 text-xs text-gray-500 leading-relaxed line-clamp-3">{card.grades.summary}</p>
          )}
          <Link
            href="/grade"
            className="mt-3 block text-center text-xs text-[#e63946] hover:text-[#c1121f] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Grade Another Card →
          </Link>
        </motion.div>
      )}
    </motion.div>
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
          setCards((data as CardRow[]) ?? [])
        }
        setLoadingCards(false)
      })
  }, [user])

  const filteredCards = cards
    .filter((c) => {
      const grade = c.grades?.overall ?? 0
      if (filterGrade === 'gem' && grade < 9) return false
      if (filterGrade === 'nm' && (grade < 7 || grade >= 9)) return false
      if (filterGrade === 'played' && grade >= 7) return false
      if (search && !c.card_name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      const ga = a.grades?.overall ?? 0
      const gb = b.grades?.overall ?? 0
      if (sortBy === 'grade_desc') return gb - ga
      if (sortBy === 'grade_asc') return ga - gb
      if (sortBy === 'date_asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const grades = cards.map((c) => c.grades?.overall ?? 0)
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
