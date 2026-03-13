'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import GradeBadge from '@/components/GradeBadge'

// Demo data shown when not connected to Supabase
const demoCards = [
  { id: '1', card_name: 'Charizard Base Set', grade: 8.5, date: '2024-03-10', front_image_url: null },
  { id: '2', card_name: 'Pikachu 1st Edition', grade: 9, date: '2024-03-08', front_image_url: null },
  { id: '3', card_name: 'Blastoise Shadowless', grade: 7, date: '2024-03-05', front_image_url: null },
  { id: '4', card_name: 'Mewtwo Base Set', grade: 6, date: '2024-03-01', front_image_url: null },
  { id: '5', card_name: 'Venusaur Holo', grade: 8, date: '2024-02-28', front_image_url: null },
  { id: '6', card_name: 'Gengar 1st Edition', grade: 9.5, date: '2024-02-25', front_image_url: null },
  { id: '7', card_name: 'Alakazam Holo', grade: 5, date: '2024-02-20', front_image_url: null },
  { id: '8', card_name: 'Machamp 1st Edition', grade: 4, date: '2024-02-18', front_image_url: null },
  { id: '9', card_name: 'Clefairy Doll', grade: 7.5, date: '2024-02-15', front_image_url: null },
]

type SortOption = 'date_desc' | 'date_asc' | 'grade_desc' | 'grade_asc'

function BinderCard({ card, index }: { card: typeof demoCards[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-[#141414] border-2 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 ${
        card.grade >= 9 ? 'border-[#ffd700]/40 grade-glow-gold' :
        card.grade >= 7 ? 'border-green-500/40 grade-glow-green' :
        card.grade >= 5 ? 'border-yellow-500/40 grade-glow-yellow' :
        'border-red-600/40 grade-glow-red'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card image area */}
      <div className="relative h-48 bg-gradient-to-b from-[#1a1a1a] to-[#111] flex items-center justify-center">
        {card.front_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.front_image_url} alt={card.card_name} className="h-full w-full object-contain p-3" />
        ) : (
          <span className="text-6xl opacity-40">🎴</span>
        )}
        {/* Grade badge */}
        <div className="absolute top-3 right-3">
          <GradeBadge grade={card.grade} size="md" />
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <h3 className="font-bold text-sm mb-1 truncate">{card.card_name}</h3>
        <div className="text-xs text-gray-500">
          Graded {new Date(card.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Expanded breakdown */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 border-t border-[#1e1e1e] pt-3"
        >
          <div className="text-xs text-gray-500 mb-3">Full Breakdown</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Centering', 'Corners', 'Edges', 'Surface'].map((sub) => (
              <div key={sub} className="flex justify-between bg-[#1a1a1a] rounded-lg px-3 py-2">
                <span className="text-gray-500">{sub}</span>
                <span className="font-bold text-[#ffd700]">{(card.grade - 0.5 + Math.random()).toFixed(1)}</span>
              </div>
            ))}
          </div>
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
  const [sortBy, setSortBy] = useState<SortOption>('date_desc')
  const [filterGrade, setFilterGrade] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredCards = demoCards
    .filter((c) => {
      if (filterGrade === 'gem' && c.grade < 9) return false
      if (filterGrade === 'nm' && (c.grade < 7 || c.grade >= 9)) return false
      if (filterGrade === 'played' && c.grade >= 7) return false
      if (search && !c.card_name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'grade_desc') return b.grade - a.grade
      if (sortBy === 'grade_asc') return a.grade - b.grade
      if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime()
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const avgGrade = demoCards.reduce((s, c) => s + c.grade, 0) / demoCards.length

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
            { label: 'Total Cards', value: demoCards.length },
            { label: 'Avg Grade', value: avgGrade.toFixed(1) },
            { label: 'Gem Mint (9+)', value: demoCards.filter((c) => c.grade >= 9).length },
            { label: 'Best Grade', value: Math.max(...demoCards.map((c) => c.grade)) },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-[#ffd700]">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Demo notice */}
        <div className="mb-6 px-4 py-3 bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-xl text-[#ffd700] text-sm flex items-center gap-2">
          <span>💡</span>
          <span>Showing demo collection. Connect Supabase and sign in to save your own graded cards.</span>
        </div>

        {/* Filters */}
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

        {/* Binder grid */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCards.map((card, i) => (
              <BinderCard key={card.id} card={card} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📒</div>
            <p>No cards match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
