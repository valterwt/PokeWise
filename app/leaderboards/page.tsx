'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import GradeBadge from '@/components/GradeBadge'

const mostGraded = [
  { rank: 1, card: 'Charizard Base Set', count: 3842, avgGrade: 6.8, icon: '🔥' },
  { rank: 2, card: 'Pikachu Base Set', count: 2901, avgGrade: 7.2, icon: '⚡' },
  { rank: 3, card: 'Mewtwo Base Set', count: 2410, avgGrade: 6.5, icon: '🔮' },
  { rank: 4, card: 'Blastoise Base Set', count: 2188, avgGrade: 6.9, icon: '💧' },
  { rank: 5, card: 'Venusaur Base Set', count: 1954, avgGrade: 7.1, icon: '🌿' },
  { rank: 6, card: 'Gengar 1st Ed', count: 1720, avgGrade: 7.8, icon: '👻' },
  { rank: 7, card: 'Alakazam Holo', count: 1601, avgGrade: 6.3, icon: '🥄' },
  { rank: 8, card: 'Raichu Holo', count: 1485, avgGrade: 7.0, icon: '⚡' },
  { rank: 9, card: 'Gyarados Holo', count: 1402, avgGrade: 6.7, icon: '🌊' },
  { rank: 10, card: 'Machamp 1st Ed', count: 1301, avgGrade: 8.1, icon: '💪' },
]

const recentGrades = [
  { id: '1', card: 'Charizard VMAX', grade: 9.5, username: 'PokeMaster99', time: '2 min ago', icon: '🔥' },
  { id: '2', card: 'Pikachu Illustrator', grade: 9, username: 'RareFinder', time: '5 min ago', icon: '⚡' },
  { id: '3', card: 'Base Charizard', grade: 6.5, username: 'VintagePoke', time: '8 min ago', icon: '🎴' },
  { id: '4', card: 'Mew Ancient Mew', grade: 7, username: 'PsychicTrainer', time: '12 min ago', icon: '🌟' },
  { id: '5', card: 'Umbreon Gold Star', grade: 8.5, username: 'DarkCollector', time: '15 min ago', icon: '🌙' },
  { id: '6', card: 'Rayquaza EX', grade: 5, username: 'DragonTamer', time: '18 min ago', icon: '🐉' },
  { id: '7', card: 'Lugia Neo Genesis', grade: 7.5, username: 'SkyWarden', time: '21 min ago', icon: '🦅' },
  { id: '8', card: 'Blastoise Shadowless', grade: 8, username: 'WaterMaster', time: '24 min ago', icon: '💧' },
  { id: '9', card: 'Misty Tears Promo', grade: 9, username: 'PromoHunter', time: '27 min ago', icon: '💦' },
  { id: '10', card: 'Espeon Gold Star', grade: 8.5, username: 'StarSeeker', time: '30 min ago', icon: '✨' },
  { id: '11', card: 'Pikachu Trophy', grade: 10, username: 'TrophyVault', time: '33 min ago', icon: '🏆' },
  { id: '12', card: 'Shining Mewtwo', grade: 6, username: 'ShiningFan', time: '36 min ago', icon: '💫' },
]

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<'most_graded' | 'recent'>('most_graded')

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
            { value: '50,249', label: 'Total Grades' },
            { value: '7.1', label: 'Community Avg' },
            { value: '1,204', label: 'Unique Cards' },
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
                tab === t.key
                  ? 'bg-[#e63946] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Most Graded */}
        {tab === 'most_graded' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {mostGraded.map((item, i) => (
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
                  item.rank === 3 ? 'text-amber-600' :
                  'text-gray-600'
                }`}>
                  {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                </div>
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xl border border-[#2a2a2a] flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{item.card}</div>
                  <div className="text-xs text-gray-500">{item.count.toLocaleString()} grades</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-gray-400 mb-1">Avg Grade</div>
                  <GradeBadge grade={item.avgGrade} size="sm" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Recent Grades */}
        {tab === 'recent' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {recentGrades.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4 transition-colors"
              >
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-xl border border-[#2a2a2a] flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{item.card}</div>
                  <div className="text-xs text-gray-500">
                    <span className="text-[#ffd700]">@{item.username}</span> · {item.time}
                  </div>
                </div>
                <GradeBadge grade={item.grade} size="md" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
