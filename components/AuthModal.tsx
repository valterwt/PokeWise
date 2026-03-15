'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
      } else {
        onClose()
      }
    } else {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error)
      } else {
        setSuccess('Account created! Check your email to confirm your account.')
        setEmail('')
        setPassword('')
      }
    }

    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, #111827, #0f172a)',
          border: '1px solid rgba(124,198,255,0.15)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,198,255,0.05)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: '#9fb0ff', background: 'rgba(255,255,255,0.05)' }}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">⚡</div>
          <h2 className="text-xl font-bold" style={{ color: '#dfe7ff' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6b7db3' }}>
            {mode === 'login' ? 'Sign in to access your binder and grades' : 'Join GradeVault and start grading'}
          </p>
        </div>

        {/* Mode tabs */}
        <div
          className="flex rounded-lg p-1 mb-6"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <button
            onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
            className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            style={
              mode === 'login'
                ? { background: 'rgba(124,198,255,0.15)', color: '#7cc6ff' }
                : { color: '#6b7db3' }
            }
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); setSuccess(null) }}
            className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            style={
              mode === 'signup'
                ? { background: 'rgba(124,198,255,0.15)', color: '#7cc6ff' }
                : { color: '#6b7db3' }
            }
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9fb0ff' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(124,198,255,0.15)',
                color: '#dfe7ff',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,198,255,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(124,198,255,0.15)')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9fb0ff' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(124,198,255,0.15)',
                color: '#dfe7ff',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,198,255,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(124,198,255,0.15)')}
            />
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)', color: '#ff8090' }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all mt-1"
            style={{
              background: loading ? 'rgba(124,198,255,0.3)' : 'linear-gradient(135deg, #7cc6ff, #a78bfa)',
              color: '#0b0f1e',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="text-center text-xs mt-4" style={{ color: '#6b7db3' }}>
            No account?{' '}
            <button
              onClick={() => { setMode('signup'); setError(null) }}
              className="underline transition-colors"
              style={{ color: '#7cc6ff' }}
            >
              Sign up free
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
