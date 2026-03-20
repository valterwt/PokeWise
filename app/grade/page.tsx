'use client'

import { useState, useCallback, useMemo } from 'react'
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

function GradeVaultSlab({
  grade,
  frontPreview,
  cardName,
  revealed,
}: {
  grade: GradeResult
  frontPreview: string | null
  cardName: string
  revealed: boolean
}) {
  const gradeColor =
    grade.grade >= 9 ? '#ffd700' :
    grade.grade >= 7 ? '#22c55e' :
    grade.grade >= 5 ? '#eab308' : '#e63946'

  const gradeLabel =
    grade.grade >= 9.5 ? 'GEM-MT' :
    grade.grade >= 9   ? 'MINT'   :
    grade.grade >= 8   ? 'NM-MT'  :
    grade.grade >= 7   ? 'NM'     :
    grade.grade >= 6   ? 'EX-NM'  :
    grade.grade >= 5   ? 'EX'     :
    grade.grade >= 4   ? 'VG-EX'  : 'VG'

  // Stable serial number derived from grade values
  const serial = useMemo(() => {
    const seed = Math.round((grade.grade + grade.centering + grade.corners) * 1000000)
    return String((seed % 90000000) + 10000000)
  }, [grade.grade, grade.centering, grade.corners])

  return (
    <div
      className="relative select-none"
      style={{
        filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(124,198,255,0.12))',
      }}
    >
      {/* Outer plastic casing */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(210,225,255,0.12) 0%, rgba(170,195,240,0.06) 40%, rgba(210,225,255,0.10) 100%)',
          border: '2px solid rgba(180,205,255,0.28)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)',
          padding: '5px',
          width: '230px',
        }}
      >
        {/* === TOP LABEL BAND === */}
        <div
          className="rounded-t-lg mb-[3px]"
          style={{
            background: 'linear-gradient(180deg, #0d1628 0%, #111c35 60%, #0e1729 100%)',
            border: '1px solid rgba(124,198,255,0.15)',
            padding: '10px 12px 8px',
          }}
        >
          {/* Row 1: year + grade label + grade number */}
          <div className="flex justify-between items-center mb-[6px]">
            <span className="font-mono text-[9px] text-white/50">2024 TCG</span>
            <motion.span
              className="font-mono text-[9px] font-bold tracking-wider"
              style={{ color: gradeColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ duration: 0.4, delay: revealed ? 0 : 0 }}
            >
              {gradeLabel}
            </motion.span>
            <motion.span
              className="font-mono text-[13px] font-black"
              style={{ color: gradeColor, textShadow: `0 0 10px ${gradeColor}` }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.5 }}
              transition={{ duration: 0.5, delay: revealed ? 0 : 0, ease: 'backOut' }}
            >
              {grade.grade.toFixed(1)}
            </motion.span>
          </div>

          {/* Row 2: GRADEVAULTAI brand */}
          <div className="text-center my-[5px]">
            <div
              className="text-[13px] font-black uppercase tracking-[0.2em]"
              style={{
                color: '#7cc6ff',
                textShadow: '0 0 12px rgba(124,198,255,0.6), 0 0 24px rgba(124,198,255,0.2)',
                fontFamily: 'monospace',
              }}
            >
              GRADEVAULTAI
            </div>
          </div>

          {/* Row 3: card name */}
          <div
            className="text-center font-mono text-[8px] truncate mb-[6px]"
            style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}
          >
            {(cardName || 'TRADING CARD').toUpperCase()}
          </div>

          {/* Barcode */}
          <div className="flex gap-px justify-center mb-[4px]">
            {[2,1,2,1,1,2,1,3,1,2,1,1,2,1,2,1,1,2,3,1].map((w, i) => (
              <div
                key={i}
                className="bg-white/35"
                style={{ width: `${w}px`, height: '11px' }}
              />
            ))}
          </div>

          {/* Serial */}
          <div className="text-center font-mono text-[7px] text-white/30 tracking-widest">
            {serial}
          </div>
        </div>

        {/* === CARD WINDOW === */}
        <div
          className="relative rounded-b-lg overflow-hidden"
          style={{
            background: '#040508',
            aspectRatio: '2.5 / 3.5',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Mystery state: animated shimmer + "?" */}
          <AnimatePresence>
            {!revealed && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Scan lines texture */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(124,198,255,0.06) 3px, rgba(124,198,255,0.06) 4px)',
                  }}
                />
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(105deg, transparent 35%, rgba(124,198,255,0.07) 50%, transparent 65%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                />
                {/* Question mark */}
                <motion.div
                  animate={{ opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'rgba(124,198,255,0.4)', fontSize: '72px', fontWeight: 900, lineHeight: 1 }}
                >
                  ?
                </motion.div>
                <div
                  className="mt-3 text-[9px] font-mono uppercase tracking-widest"
                  style={{ color: 'rgba(124,198,255,0.25)' }}
                >
                  Analyzing...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Revealed card image */}
          {frontPreview && (
            <motion.img
              src={frontPreview}
              alt="Card front"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
              initial={{ opacity: 0, y: -18, scale: 1.06 }}
              animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : -18, scale: revealed ? 1 : 1.06 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          )}

          {/* Border scan lines after reveal */}
          {revealed && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <div
                className="absolute inset-0 rounded"
                style={{ border: `1px solid ${gradeColor}`, boxShadow: `inset 0 0 12px ${gradeColor}30` }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Holographic corner sticker (top-right) */}
      <motion.div
        className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-[8px] font-black"
        style={{
          background: 'conic-gradient(from 0deg, #ff6b6b, #ffd700, #7cc6ff, #a78bfa, #ff6b6b)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          color: 'rgba(0,0,0,0.7)',
        }}
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'backOut' }}
      >
        AI
      </motion.div>
    </div>
  )
}

function PackOpeningAnimation({
  grade,
  frontPreview,
  cardName,
  onComplete,
}: {
  grade: GradeResult
  frontPreview: string | null
  cardName: string
  onComplete: () => void
}) {
  // revealed = card image is showing in the slab
  const [revealed, setRevealed] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #0a0f1e 0%, #050508 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Particle stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: i % 4 === 0 ? '2px' : '1px',
              height: i % 4 === 0 ? '2px' : '1px',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 2.5,
              delay: 0.8 + (i * 0.07),
              repeat: Infinity,
              repeatDelay: 1 + (i % 5) * 0.4,
            }}
          />
        ))}
      </div>

      {/* Light burst on reveal */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,198,255,0.25) 0%, transparent 70%)', width: 400, height: 400 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1, delay: 1.5 }}
        onAnimationComplete={() => setRevealed(true)}
      />

      <div className="flex flex-col items-center gap-10 relative">
        {/* Slab */}
        <motion.div
          initial={{ scale: 0.55, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'backOut' }}
        >
          <GradeVaultSlab
            grade={grade}
            frontPreview={frontPreview}
            cardName={cardName}
            revealed={revealed}
          />
        </motion.div>

        {/* Grade badge below slab */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.6 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 16, scale: revealed ? 1 : 0.6 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'backOut' }}
        >
          <GradeBadge grade={grade.grade} size="xl" />
        </motion.div>

        {/* Continue button */}
        <motion.button
          className="px-10 py-4 font-bold rounded-xl text-lg text-[#0b0f1e] transition-opacity"
          style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4 }}
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

  const MAX_BYTES = 1_048_576 // 1 MB — stays well under Next.js / Anthropic limits
  const MAX_DIM   = 1500     // longest side in pixels

  const prepareImage = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        // Scale down proportionally so the longest side ≤ MAX_DIM
        let { naturalWidth: w, naturalHeight: h } = img
        if (w > MAX_DIM || h > MAX_DIM) {
          const scale = MAX_DIM / Math.max(w, h)
          w = Math.round(w * scale)
          h = Math.round(h * scale)
        }

        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        URL.revokeObjectURL(objectUrl)

        // Try decreasing quality until file fits within MAX_BYTES
        const tryQuality = (quality: number) => {
          canvas.toBlob((blob) => {
            if (!blob) { resolve(file); return }
            if (blob.size <= MAX_BYTES || quality <= 0.4) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            } else {
              tryQuality(Math.max(quality - 0.1, 0.4))
            }
          }, 'image/jpeg', quality)
        }
        tryQuality(0.85)
      }
      img.src = objectUrl
    })

  // Keep the old name so nothing else needs to change
  const convertToJpeg = prepareImage

  const handleFile = useCallback(async (file: File, side: 'front' | 'back') => {
    const jpeg = await convertToJpeg(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      if (side === 'front') {
        setFrontFile(jpeg)
        setFrontPreview(url)
      } else {
        setBackFile(jpeg)
        setBackPreview(url)
      }
    }
    reader.readAsDataURL(jpeg)
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
      let data: (GradeResult & { error?: string }) | { error?: string } = {}
      try {
        data = await res.json()
      } catch {
        if (res.status === 413) throw new Error('Image is too large. Please upload a smaller file.')
        throw new Error(`Server error (${res.status})`)
      }
      if (res.status === 401) {
        setShowAuthModal(true)
        return
      }
      if (res.status === 402) {
        window.location.href = `/pricing?upgrade=1`
        return
      }
      if (!res.ok) throw new Error(data.error || 'Grading failed')
      setGradeResult(data as GradeResult)
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
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => { setShowAuthModal(false); handleSubmit() }}
        />
      )}
      <AnimatePresence>
        {step === 'animating' && gradeResult && (
          <PackOpeningAnimation
            grade={gradeResult}
            frontPreview={frontPreview}
            cardName={cardName}
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
              Your card images are analyzed by Claude AI and not stored without your permission.{' '}
              <a href="/ai-disclosure" className="underline hover:text-gray-400 transition-colors">AI disclosure</a>
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
