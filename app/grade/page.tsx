'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactCrop, { centerCrop, makeAspectCrop, convertToPixelCrop, type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import GradeBadge from '@/components/GradeBadge'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/lib/auth-context'
import type { GradeResult } from '@/types/database'

type Step = 'upload' | 'crop' | 'animating' | 'result'
type AuthIntent = 'grade' | 'save'

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

function GradeVaultBoosterPack() {
  return (
    <div className="relative select-none" style={{ width: 220, height: 300 }}>
      {/* Main foil body */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '14px 14px 10px 10px',
          background: 'linear-gradient(160deg, #1c1c1c 0%, #2e2e2e 18%, #3a3a3a 32%, #252525 48%, #323232 62%, #1e1e1e 80%, #101010 100%)',
          border: '1.5px solid rgba(255,255,255,0.16)',
          boxShadow: 'inset 3px 0 10px rgba(255,255,255,0.05), inset -2px 0 6px rgba(0,0,0,0.5)',
        }}
      >
        {/* Silver light sweep streaks (inspired by silver pack) */}
        {[
          { top: '18%', left: '-30%', rotate: '-38deg', opacity: 0.18, h: 5 },
          { top: '28%', left: '-30%', rotate: '-38deg', opacity: 0.10, h: 2 },
          { top: '44%', left: '-30%', rotate: '-38deg', opacity: 0.14, h: 3 },
          { top: '62%', left: '-30%', rotate: '28deg',  opacity: 0.10, h: 2 },
          { top: '74%', left: '-30%', rotate: '28deg',  opacity: 0.08, h: 4 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: '160%', height: `${s.h}px`,
              top: s.top, left: s.left,
              transform: `rotate(${s.rotate})`,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${s.opacity}) 40%, rgba(255,255,255,${s.opacity * 1.5}) 55%, transparent 100%)`,
            }}
          />
        ))}

        {/* Radial glow center */}
        <div
          className="absolute"
          style={{
            inset: 0,
            background: 'radial-gradient(ellipse 55% 60% at 52% 52%, rgba(140,150,180,0.1) 0%, transparent 70%)',
          }}
        />

        {/* GRADEVAULTAI watermark tile */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: 0.055, transform: 'rotate(-35deg) scale(1.4)', transformOrigin: 'center' }}
        >
          {[...Array(10)].map((_, row) => (
            <div key={row} className="flex gap-2 whitespace-nowrap" style={{ marginBottom: 10, marginLeft: row % 2 === 0 ? 0 : -30 }}>
              {[...Array(5)].map((_, col) => (
                <span key={col} className="text-[9px] font-black text-white tracking-[0.18em]">
                  GRADEVAULTAI
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Top seal strip */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 28,
            background: 'linear-gradient(180deg, rgba(90,90,90,0.55) 0%, rgba(45,45,45,0.35) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <div className="flex items-center justify-center h-full gap-[3px]">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="rounded-full" style={{ width: 3, height: 3, background: 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>

        {/* === PACK CONTENT === */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 pt-3">
          {/* Pokeball with silver ring */}
          <div className="relative mb-3" style={{ width: 72, height: 72 }}>
            {/* Silver outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 45deg, #777, #bbb, #888, #ccc, #777, #aaa, #666, #999, #777)',
                padding: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden">
                <div className="w-full" style={{ height: '50%', background: 'linear-gradient(140deg, #ff5555 0%, #cc1111 100%)' }} />
                <div className="w-full" style={{ height: '50%', background: 'linear-gradient(140deg, #ddd 0%, #aaa 100%)' }} />
              </div>
            </div>
            {/* Center divider */}
            <div className="absolute left-0 right-0" style={{ top: 'calc(50% - 3.5px)', height: 7, background: '#111', zIndex: 1 }} />
            {/* Center button */}
            <div
              className="absolute rounded-full"
              style={{
                width: 22, height: 22,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle at 38% 35%, #fff 0%, #ccc 100%)',
                border: '3.5px solid #111',
                zIndex: 2,
              }}
            />
          </div>

          {/* Main GRADEVAULTAI badge (hexagon/shield shape) */}
          <div
            className="flex items-center justify-center px-4 py-[5px] mb-[4px]"
            style={{
              background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(40,40,40,0.95) 100%)',
              border: '1px solid rgba(200,200,200,0.28)',
              clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <span
              className="text-[15px] font-black tracking-[0.14em] text-white"
              style={{ textShadow: '0 0 14px rgba(255,255,255,0.25)', letterSpacing: '0.14em' }}
            >
              GRADEVAULTAI
            </span>
          </div>

          {/* ★ GRADE PACK ★ */}
          <div
            className="flex items-center gap-[5px] px-3 py-[3px]"
            style={{
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 4,
            }}
          >
            <span className="text-[9px] text-white/45">★</span>
            <span className="text-[9px] font-bold text-white/65 tracking-[0.18em]">GRADE PACK</span>
            <span className="text-[9px] text-white/45">★</span>
          </div>

          {/* POWERED BY AI */}
          <div className="mt-3 text-[7px] font-mono text-white/25 tracking-widest">POWERED BY AI</div>
        </div>

        {/* Bottom sealed edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-5"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%)' }}
        />

        {/* Left edge highlight */}
        <div
          className="absolute top-0 bottom-0 left-0 w-5"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.055) 0%, transparent 100%)' }}
        />
      </div>

      {/* Outer shadow/glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '14px 14px 10px 10px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.85), 0 0 50px rgba(100,110,140,0.12)',
        }}
      />
    </div>
  )
}

function GradeVaultSlab({
  grade,
  frontPreview,
  cardName,
}: {
  grade: GradeResult
  frontPreview: string | null
  cardName: string
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

  const serial = useMemo(() => {
    const seed = Math.round((grade.grade + grade.centering + grade.corners) * 1000000)
    return String((seed % 90000000) + 10000000)
  }, [grade.grade, grade.centering, grade.corners])

  return (
    <div
      className="relative select-none"
      style={{
        filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.9)) drop-shadow(0 0 50px rgba(124,198,255,0.15))',
      }}
    >
      {/* Outer plastic casing */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(215,230,255,0.13) 0%, rgba(175,200,245,0.06) 40%, rgba(215,230,255,0.11) 100%)',
          border: '2px solid rgba(185,210,255,0.3)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.3)',
          padding: '5px',
          width: '300px',
        }}
      >
        {/* === TOP LABEL BAND === */}
        <div
          className="rounded-t-lg mb-[3px]"
          style={{
            background: 'linear-gradient(180deg, #0d1628 0%, #111c35 60%, #0e1729 100%)',
            border: '1px solid rgba(124,198,255,0.18)',
            padding: '10px 14px 9px',
          }}
        >
          {/* Row 1: year, grade label, grade number */}
          <div className="flex justify-between items-center mb-[6px]">
            <span className="font-mono text-[9px] text-white/50">2024 TCG</span>
            <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color: gradeColor }}>
              {gradeLabel}
            </span>
            <span
              className="font-mono text-[15px] font-black"
              style={{ color: gradeColor, textShadow: `0 0 12px ${gradeColor}` }}
            >
              {grade.grade.toFixed(1)}
            </span>
          </div>

          {/* GRADEVAULTAI brand */}
          <div className="text-center my-[5px]">
            <div
              className="text-[14px] font-black uppercase tracking-[0.22em]"
              style={{
                color: '#7cc6ff',
                textShadow: '0 0 14px rgba(124,198,255,0.65), 0 0 28px rgba(124,198,255,0.2)',
                fontFamily: 'monospace',
              }}
            >
              GRADEVAULTAI
            </div>
          </div>

          {/* Card name */}
          <div
            className="text-center font-mono text-[9px] truncate mb-[7px]"
            style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}
          >
            {(cardName || 'TRADING CARD').toUpperCase()}
          </div>

          {/* Barcode */}
          <div className="flex gap-px justify-center mb-[4px]">
            {[2,1,2,1,1,2,1,3,1,2,1,1,2,1,2,1,1,2,3,1,2,1].map((w, i) => (
              <div key={i} className="bg-white/35" style={{ width: `${w}px`, height: '12px' }} />
            ))}
          </div>

          {/* Serial */}
          <div className="text-center font-mono text-[7px] text-white/30 tracking-widest">{serial}</div>
        </div>

        {/* === CARD IMAGE WINDOW — shows full cropped image === */}
        <div
          className="relative rounded-b-lg overflow-hidden"
          style={{
            aspectRatio: '2.5 / 3.5',
            background: '#040508',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {frontPreview ? (
            <motion.img
              src={frontPreview}
              alt="Card"
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'rgba(124,198,255,0.25)', fontSize: 64, fontWeight: 900 }}>
              ?
            </div>
          )}

          {/* Grade color glow border */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-b-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.3] }}
            transition={{ duration: 1.5, delay: 0.4 }}
            style={{ border: `2px solid ${gradeColor}`, boxShadow: `inset 0 0 20px ${gradeColor}25` }}
          />
        </div>
      </div>

      {/* Holographic corner sticker */}
      <motion.div
        className="absolute -top-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center text-[8px] font-black"
        style={{
          background: 'conic-gradient(from 0deg, #ff6b6b, #ffd700, #7cc6ff, #a78bfa, #ff6b6b)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.6)',
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

function PackOpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'shake' | 'burst'>('idle')

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-12"
      style={{ background: 'radial-gradient(ellipse at center, #0d0d1a 0%, #050508 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: i % 5 === 0 ? '2px' : '1px',
              height: i % 5 === 0 ? '2px' : '1px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 2.5, delay: 0.5 + (i * 0.06), repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </div>

      {/* Light burst on opening */}
      {phase === 'burst' && (
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,220,100,0.45) 0%, rgba(124,198,255,0.2) 40%, transparent 70%)',
            width: 600, height: 600,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9 }}
        />
      )}

      {/* Booster pack */}
      <motion.div
        initial={{ scale: 0.45, opacity: 0, y: 70 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: 'backOut' }}
        onAnimationComplete={() => setPhase('shake')}
      >
        <motion.div
          animate={
            phase === 'shake' ? {
              x: [0, -6, 6, -5, 5, -3, 3, -2, 2, 0],
              rotate: [0, -1.5, 1.5, -1, 1, -0.5, 0.5, 0],
            } : phase === 'burst' ? {
              scale: [1, 1.08, 0],
              opacity: [1, 1, 0],
            } : {}
          }
          transition={
            phase === 'shake'
              ? { duration: 0.7, delay: 0.4, times: [0,.1,.2,.35,.45,.6,.7,.8,.9,1], onComplete: () => setPhase('burst') }
              : { duration: 0.45 }
          }
          onAnimationComplete={() => {
            if (phase === 'shake') setPhase('burst')
          }}
        >
          <GradeVaultBoosterPack />
        </motion.div>
      </motion.div>

      {/* Reveal Grade button */}
      <motion.button
        className="px-10 py-4 font-bold rounded-xl text-lg text-[#0b0f1e]"
        style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        onClick={onComplete}
      >
        Reveal Grade →
      </motion.button>
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
  const [authIntent, setAuthIntent] = useState<AuthIntent>('grade')

  // Crop state
  const [rawFrontSrc, setRawFrontSrc] = useState<string | null>(null)
  const [rawFrontFile, setRawFrontFile] = useState<File | null>(null)
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 })
  const cropImgRef = useRef<HTMLImageElement>(null)

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

  const handleFile = useCallback(async (file: File, side: 'front' | 'back') => {
    if (side === 'front') {
      // Go to crop step first; processing happens after crop confirmation
      setRawFrontFile(file)
      setRawFrontSrc(URL.createObjectURL(file))
      // Default crop: full image selected
      setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 })
      setStep('crop')
      return
    }
    // Back image: no crop step, just resize
    const jpeg = await prepareImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setBackFile(jpeg)
      setBackPreview(e.target?.result as string)
    }
    reader.readAsDataURL(jpeg)
  }, [prepareImage])

  const onCropImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    // Default: full image selected, centered
    const initial = centerCrop(
      makeAspectCrop({ unit: '%', width: 100 }, width / height, width, height),
      width, height,
    )
    setCrop(initial)
  }, [])

  const finishCrop = useCallback(async (applyCropArea: boolean) => {
    if (!rawFrontFile) return
    let fileToProcess = rawFrontFile

    if (applyCropArea && cropImgRef.current) {
      const img = cropImgRef.current
      const pixelCrop: PixelCrop = convertToPixelCrop(crop, img.width, img.height)
      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height

      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(pixelCrop.width  * scaleX)
      canvas.height = Math.round(pixelCrop.height * scaleY)
      canvas.getContext('2d')!.drawImage(
        img,
        Math.round(pixelCrop.x * scaleX),
        Math.round(pixelCrop.y * scaleY),
        canvas.width, canvas.height,
        0, 0, canvas.width, canvas.height,
      )
      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95))
      fileToProcess = new File([blob], rawFrontFile.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
    }

    const jpeg = await prepareImage(fileToProcess)
    const reader = new FileReader()
    reader.onload = (e) => {
      setFrontFile(jpeg)
      setFrontPreview(e.target?.result as string)
    }
    reader.readAsDataURL(jpeg)

    // Clean up
    URL.revokeObjectURL(rawFrontSrc!)
    setRawFrontSrc(null)
    setRawFrontFile(null)
    setStep('upload')
  }, [rawFrontFile, rawFrontSrc, crop, prepareImage])

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
        setAuthIntent('grade')
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
    if (rawFrontSrc) { URL.revokeObjectURL(rawFrontSrc); setRawFrontSrc(null) }
    setRawFrontFile(null)
  }

  const saveToBinder = async () => {
    if (!gradeResult || !frontFile) return
    if (!user) {
      setAuthIntent('save')
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
          onSuccess={() => {
            setShowAuthModal(false)
            if (authIntent === 'save') saveToBinder()
            else handleSubmit()
          }}
        />
      )}
      <AnimatePresence>
        {step === 'animating' && gradeResult && (
          <PackOpeningAnimation
            onComplete={() => setStep('result')}
          />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        {/* Header — hidden during crop */}
        {step !== 'crop' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/20 text-[#e63946] text-sm font-medium px-4 py-2 rounded-full mb-6">
              🤖 AI Condition Estimate — PSA-Style 1–10
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">Grade Your Card</h1>
            <p className="text-gray-400">Upload front and back photos for your AI condition estimate. Results are a guide, not a guarantee — always verify with a professional grader before submitting high-value cards.</p>
          </div>
        )}

        {/* ── CROP STEP ── */}
        {step === 'crop' && rawFrontSrc && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Step header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#7cc6ff]/10 border border-[#7cc6ff]/20 text-[#7cc6ff] text-sm font-medium px-4 py-2 rounded-full mb-4">
                ✂️ Step 1 of 2 — Crop Image
              </div>
              <h2 className="text-2xl font-black mb-2">Crop Your Card Image</h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Drag the handles to select just the card, or zoom into the Pokemon artwork. This is what the AI will analyze.
              </p>
            </div>

            {/* Card name (collect here so user doesn't have to go back) */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-400 mb-2 block">Card Name <span className="text-gray-600">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. Charizard Base Set"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#7cc6ff] transition-colors"
              />
            </div>

            {/* Crop area */}
            <div
              className="rounded-2xl overflow-hidden mb-2"
              style={{
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                maxHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                style={{ maxHeight: '60vh', maxWidth: '100%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={cropImgRef}
                  src={rawFrontSrc}
                  alt="Crop preview"
                  onLoad={onCropImageLoad}
                  style={{ maxHeight: '60vh', maxWidth: '100%', display: 'block' }}
                />
              </ReactCrop>
            </div>
            <p className="text-xs text-gray-600 text-center mb-6">Click and drag to adjust the crop selection</p>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => finishCrop(false)}
                className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Use Full Image
              </button>
              <button
                onClick={() => finishCrop(true)}
                className="py-4 font-bold rounded-xl text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)', color: '#0b0f1e' }}
              >
                ✓ Apply Crop → Step 2
              </button>
            </div>
          </motion.div>
        )}

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
            {/* GradeVaultAI Slab */}
            <div className="flex justify-center py-4">
              <GradeVaultSlab
                grade={gradeResult}
                frontPreview={frontPreview}
                cardName={cardName}
              />
            </div>

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
