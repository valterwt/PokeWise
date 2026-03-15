'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GradeBadge from '@/components/GradeBadge'

type MostGradedItem = { rank: number; card: string; count: number; avgGrade: number }
type RecentItem = { id: string; card: string; grade: number; username: string; time: string }
type LeaderboardData = {
  totalGrades: number
  communityAvg: string
  uniqueCards: number
  mostGraded: MostGradedItem[]
  recentGrades: RecentItem[]
}

function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<'most_graded' | 'recent'>('most_graded')
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load data'); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] text-sm font-medium px-4 py-2 rounded-full mb-6">
            🏆 Community Leaderboards
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Leaderboards</h1>
          <p className="text-gray-400">The most graded cards and latest community grades.</p>
        </div>

        {/* Stats banner */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: loading ? '…' : (data?.totalGrades.toLocaleString() ?? '0'), label: 'Total Grades' },
            { value: loading ? '…' : (data?.communityAvg ?? '0.0'), label: 'Community Avg' },
            { value: loading ? '…' : (data?.uniqueCards.toLocaleString() ?? '0'), label: 'Unique Cards' },
          ].map((s) => (
            <div key={s.label} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 text-center">
              <div className="text-xl md:text-2xl font-black text-[#ffd700]">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-[#141414] border border-[#1e1e1e] rounded-xl p-1 mb-6">
          {[
            { key: 'most_graded', label: '📊 Most Graded Cards' },
            { key: 'recent', label: '🕐 Recently Graded' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                tab === t.key ? 'bg-[#e63946] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <div className="text-center py-10 text-gray-500">{error}</div>}

        {/* Most Graded */}
        {!loading && !error && tab === 'most_graded' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {(data?.mostGraded.length ?? 0) === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-4xl mb-3">🏆</div>
                <p>No grades yet — be the first!</p>
              </div>
            ) : (
              data!.mostGraded.map((item, i) => (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 transition-colors"
                >
                  <div className={`w-8 text-center font-black text-lg ${
                    item.rank === 1 ? 'text-[#ffd700]' :
                    item.rank === 2 ? 'text-gray-300' :
                    item.rank === 3 ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                  </div>
                  <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xl border border-[#2a2a2a] flex-shrink-0">
                    🎴
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.card}</div>
                    <div className="text-xs text-gray-500">{item.count.toLocaleString()} grade{item.count !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-gray-400 mb-1">Avg Grade</div>
                    <GradeBadge grade={item.avgGrade} size="sm" />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Recent Grades */}
        {!loading && !error && tab === 'recent' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {(data?.recentGrades.length ?? 0) === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-4xl mb-3">🕐</div>
                <p>No grades yet — be the first!</p>
              </div>
            ) : (
              data!.recentGrades.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xl border border-[#2a2a2a] flex-shrink-0">
                    🎴
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.card}</div>
                    <div className="text-xs text-gray-500">
                      <span className="text-[#ffd700]">@{item.username}</span> · {timeAgo(item.time)}
                    </div>
                  </div>
                  <GradeBadge grade={item.grade} size="md" />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
