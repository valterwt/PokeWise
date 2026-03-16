'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GradeBadge from '@/components/GradeBadge'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/lib/auth-context'
import type { GradeResult } from '@/types/database'

type Step = 'upload' | 'animating' | 'result'

function SubScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100
  const color = value >= 9 ? '#ffd700' : value >= 7 ? '#22c55e' : value >= 5 ? '#eab308' : '#e63946'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function PackOpeningAnimation({ grade, onComplete }: { grade: GradeResult; onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 2,
              delay: 1.5 + Math.random() * 1.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-8 relative">
        {/* Pack */}
        <motion.div
          className="w-32 h-44 bg-gradient-to-b from-[#e63946] to-[#ffd700] rounded-xl flex items-center justify-center text-6xl shadow-2xl border-2 border-white/10"
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          ⚡
        </motion.div>

        {/* Tear effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-xl" />
        </motion.div>

        {/* Card reveal */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: 'backOut' }}
        >
          <div className="w-40 h-56 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl border border-[#333] flex items-center justify-center text-7xl shadow-2xl">
            🎴
          </div>
        </motion.div>

        {/* Light burst */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: 1.4 }}
        />

        {/* Grade badge reveal */}
        <motion.div
          className="absolute -top-10 right-0"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.4, ease: 'backOut' }}
        >
          <GradeBadge grade={grade.grade} size="xl" />
        </motion.div>

        {/* Continue button */}
        <motion.button
          className="mt-60 px-8 py-4 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl text-lg transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          onClick={onComplete}
        >
          See Full Breakdown →
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function GradePage() {
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('upload')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [cardName, setCardName] = useState('')
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleFile = useCallback((file: File, side: 'front' | 'back') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      if (side === 'front') {
        setFrontFile(file)
        setFrontPreview(url)
      } else {
        setBackFile(file)
        setBackPreview(url)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file, side)
  }, [handleFile])

  const handleSubmit = async () => {
    if (!frontFile) {
      setError('Please upload the front of your card.')
      return
    }
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('front', frontFile)
    if (backFile) formData.append('back', backFile)
    if (cardName) formData.append('cardName', cardName)

    try {
      const res = await fetch('/api/grade', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.status === 401) {
        setShowAuthModal(true)
        return
      }
      if (res.status === 402) {
        window.location.href = `/pricing?upgrade=1`
        return
      }
      if (!res.ok) throw new Error(data.error || 'Grading failed')
      setGradeResult(data)
      setStep('animating')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep('upload')
    setFrontFile(null)
    setBackFile(null)
    setFrontPreview(null)
    setBackPreview(null)
    setGradeResult(null)
    setCardName('')
    setError(null)
    setSaveError(null)
  }

  const saveToBinder = async () => {
    if (!gradeResult || !frontFile) return
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const fd = new FormData()
      fd.append('front', frontFile)
      if (backFile) fd.append('back', backFile)
      fd.append('cardName', cardName || 'Unknown Card')
      fd.append('grade', String(gradeResult.grade))
      fd.append('centering', String(gradeResult.centering))
      fd.append('corners', String(gradeResult.corners))
      fd.append('edges', String(gradeResult.edges))
      fd.append('surface', String(gradeResult.surface))
      fd.append('summary', gradeResult.summary)
      fd.append('recommendation', gradeResult.recommendation)

      const res = await fetch('/api/save-card', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      window.location.href = '/binder'
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      <AnimatePresence>
        {step === 'animating' && gradeResult && (
          <PackOpeningAnimation
            grade={gradeResult}
            onComplete={() => setStep('result')}
          />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/20 text-[#e63946] text-sm font-medium px-4 py-2 rounded-full mb-6">
            🤖 AI Condition Estimate — PSA-Style 1–10
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Grade Your Card</h1>
          <p className="text-gray-400">Upload front and back photos for your AI condition estimate. Results are a guide, not a guarantee — always verify with a professional grader before submitting high-value cards.</p>
        </div>

        {step === 'upload' && !user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🎴</div>
              <h2 className="text-2xl font-black mb-3">Create a Free Account to Grade</h2>
              <p className="text-gray-400 mb-2 max-w-md mx-auto">
                Sign up in seconds and get <span className="text-white font-semibold">3 free AI grades</span> — no credit card required.
              </p>
              <p className="text-sm text-gray-600 mb-8 max-w-sm mx-auto">
                Your grades, binder, and history are saved to your account so nothing gets lost.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-4 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold text-lg rounded-xl transition-all hover:shadow-[0_0_30px_rgba(230,57,70,0.4)]"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors"
                >
                  Sign In
                </button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
                <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                  <div className="text-2xl font-black text-[#ffd700]">3</div>
                  <div className="text-xs text-gray-500 mt-1">Free grades</div>
                </div>
                <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                  <div className="text-2xl font-black text-[#e63946]">AI</div>
                  <div className="text-xs text-gray-500 mt-1">PSA-style</div>
                </div>
                <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                  <div className="text-2xl font-black text-green-400">$0</div>
                  <div className="text-xs text-gray-500 mt-1">To start</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'upload' && user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Card name */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-400 mb-2 block">Card Name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Charizard Base Set"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors"
              />
            </div>

            {/* Upload areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {(['front', 'back'] as const).map((side) => {
                const preview = side === 'front' ? frontPreview : backPreview
                return (
                  <div
                    key={side}
                    onDrop={(e) => handleDrop(e, side)}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative"
                  >
                    <label className="text-sm font-medium text-gray-400 mb-2 block capitalize">
                      {side} of Card {side === 'front' ? '(required)' : '(recommended)'}
                    </label>
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleFile(f, side)
                        }}
                      />
                      <div className={`border-2 border-dashed rounded-2xl h-52 flex flex-col items-center justify-center transition-all hover:border-[#e63946]/50 hover:bg-[#e63946]/5 ${preview ? 'border-[#e63946]/40' : 'border-[#2a2a2a]'}`}>
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={preview} alt={side} className="h-full w-full object-contain rounded-2xl p-2" />
                        ) : (
                          <>
                            <div className="text-4xl mb-3">📸</div>
                            <div className="text-sm text-gray-500 text-center px-4">
                              Drag & drop or click to upload<br />
                              <span className="text-xs text-gray-600">JPG, PNG, WEBP</span>
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!frontFile || loading}
              className="w-full py-4 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all hover:shadow-[0_0_30px_rgba(230,57,70,0.4)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing card...
                </span>
              ) : (
                '⚡ Grade This Card'
              )}
            </button>

            <p className="text-center text-xs text-gray-600 mt-4">
              Your card images are analyzed by Claude AI and not stored without your permission.
            </p>
          </motion.div>
        )}

        {step === 'result' && gradeResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main grade card */}
            <div className={`bg-[#141414] border-2 rounded-2xl p-8 text-center ${
              gradeResult.grade >= 9 ? 'border-[#ffd700]/40 grade-glow-gold' :
              gradeResult.grade >= 7 ? 'border-green-500/40 grade-glow-green' :
              gradeResult.grade >= 5 ? 'border-yellow-500/40 grade-glow-yellow' :
              'border-red-600/40 grade-glow-red'
            }`}>
              <div className="flex flex-col items-center gap-4">
                <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">GradeVaultAI Estimate</div>
                <GradeBadge grade={gradeResult.grade} size="xl" />
                <div className="text-3xl font-black">
                  {gradeResult.grade >= 9 ? 'Gem Mint' :
                   gradeResult.grade >= 8 ? 'Near Mint–Mint' :
                   gradeResult.grade >= 7 ? 'Near Mint' :
                   gradeResult.grade >= 6 ? 'Excellent–Near Mint' :
                   gradeResult.grade >= 5 ? 'Excellent' :
                   gradeResult.grade >= 4 ? 'Very Good–Excellent' :
                   gradeResult.grade >= 3 ? 'Very Good' :
                   gradeResult.grade >= 2 ? 'Good' : 'Poor'}
                </div>
              </div>
            </div>

            {/* Sub scores */}
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg mb-5">Grade Breakdown</h3>
              <SubScoreBar label="Centering" value={gradeResult.centering} />
              <SubScoreBar label="Corners" value={gradeResult.corners} />
              <SubScoreBar label="Edges" value={gradeResult.edges} />
              <SubScoreBar label="Surface" value={gradeResult.surface} />
            </div>

            {/* Summary */}
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-3">AI Condition Report</h3>
              <p className="text-gray-400 leading-relaxed">{gradeResult.summary}</p>
              <p className="text-xs text-gray-600 mt-3">This is an AI-generated estimate. It may not match a professional grader&apos;s assessment. If you think we got this wrong, we want to hear it — your feedback is how this improves.</p>
            </div>

            {/* Recommendation */}
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-3">Worth Professional Grading?</h3>
              <p className="text-gray-400 leading-relaxed">{gradeResult.recommendation}</p>
            </div>

            {/* Card images */}
            {(frontPreview || backPreview) && (
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Your Card</h3>
                <div className="flex gap-4 justify-center">
                  {frontPreview && (
                    <div className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frontPreview} alt="Front" className="h-48 object-contain rounded-lg border border-[#2a2a2a]" />
                      <div className="text-xs text-gray-500 mt-2">Front</div>
                    </div>
                  )}
                  {backPreview && (
                    <div className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={backPreview} alt="Back" className="h-48 object-contain rounded-lg border border-[#2a2a2a]" />
                      <div className="text-xs text-gray-500 mt-2">Back</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {saveError && (
              <div className="px-4 py-3 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
                {saveError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors"
              >
                Grade Another Card
              </button>
              <button
                onClick={saveToBinder}
                disabled={saving}
                className="flex-1 py-4 bg-[#ffd700] hover:bg-[#e6c200] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-colors"
              >
                {saving ? 'Saving…' : user ? 'Save to Binder' : 'Sign In to Save'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
