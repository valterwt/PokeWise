'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [oauthLoading, setOauthLoading] = useState<'google' | 'discord' | null>(null)

  const signInWithOAuth = async (provider: 'google' | 'discord') => {
    setOauthLoading(provider)
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const switchMode = (m: typeof mode) => {
    setMode(m); setError(null); setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) { setError(error) } else { onSuccess ? onSuccess() : onClose() }
    } else if (mode === 'signup') {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error)
      } else {
        setSuccess('Account created! Check your email to confirm your account.')
        setEmail('')
        setPassword('')
      }
    } else {
      // password reset
      const redirectTo = new URL('/auth/callback', window.location.origin)
      redirectTo.searchParams.set('next', '/auth/update-password')
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo.toString(),
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email for a password reset link.')
        setEmail('')
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
            {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6b7db3' }}>
            {mode === 'login'
              ? 'Sign in to access your binder and grades'
              : mode === 'signup'
              ? 'Join GradeVault and start grading'
              : "Enter your email and we'll send a reset link"}
          </p>
        </div>

        {/* Mode tabs (hidden for reset mode) */}
        {mode !== 'reset' && (
          <div
            className="flex rounded-lg p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <button
              onClick={() => switchMode('login')}
              className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
              style={mode === 'login' ? { background: 'rgba(124,198,255,0.15)', color: '#7cc6ff' } : { color: '#6b7db3' }}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
              style={mode === 'signup' ? { background: 'rgba(124,198,255,0.15)', color: '#7cc6ff' } : { color: '#6b7db3' }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* OAuth providers (hidden for reset mode) */}
        {mode !== 'reset' && <div className="flex flex-col gap-2 mb-4">
          <button
            type="button"
            onClick={() => signInWithOAuth('google')}
            disabled={oauthLoading !== null}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#dfe7ff' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {oauthLoading === 'google' ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs" style={{ color: '#4a5580' }}>or continue with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>}

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

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium" style={{ color: '#9fb0ff' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-xs transition-colors"
                    style={{ color: '#6b7db3' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#7cc6ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7db3')}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
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
          )}

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
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="text-center text-xs mt-4" style={{ color: '#6b7db3' }}>
            No account?{' '}
            <button onClick={() => switchMode('signup')} className="underline" style={{ color: '#7cc6ff' }}>
              Sign up free
            </button>
          </p>
        )}
        {mode === 'reset' && (
          <p className="text-center text-xs mt-4" style={{ color: '#6b7db3' }}>
            <button onClick={() => switchMode('login')} className="underline" style={{ color: '#7cc6ff' }}>
              ← Back to sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
