'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Post = {
  id: string
  title: string
  body: string
  before_image_url: string | null
  after_image_url: string | null
  published_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // New post form
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [beforeUrl, setBeforeUrl] = useState('')
  const [afterUrl, setAfterUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const authHeaders = { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/admin/newsletter', { headers: authHeaders })
      if (res.status === 401) {
        setLoginError('Wrong password.')
        return
      }
      if (!res.ok) throw new Error('Server error')
      setPosts(await res.json())
      setAuthed(true)
    } catch {
      setLoginError('Failed to connect. Try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    setFormSuccess(false)
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ title, body, before_image_url: beforeUrl, after_image_url: afterUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create post')
      setPosts([data, ...posts])
      setTitle(''); setBody(''); setBeforeUrl(''); setAfterUrl('')
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 3000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    const res = await fetch(`/api/admin/newsletter?id=${id}`, { method: 'DELETE', headers: authHeaders })
    if (res.ok) setPosts(posts.filter((p) => p.id !== id))
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-black">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Newsletter management</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm"
              />
            </div>
            {loginError && (
              <div className="px-4 py-2 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
            >
              {loginLoading ? 'Checking…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black">Newsletter Admin</h1>
            <p className="text-gray-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Create new post */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-5">New Post</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Week N — What we tried"
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write the full post content here…"
                required
                rows={6}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm resize-y"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Before Image URL (optional)</label>
                <input
                  value={beforeUrl}
                  onChange={(e) => setBeforeUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">After Image URL (optional)</label>
                <input
                  value={afterUrl}
                  onChange={(e) => setAfterUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e63946] transition-colors text-sm"
                />
              </div>
            </div>
            {formError && (
              <div className="px-4 py-2 bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl text-[#e63946] text-sm">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                Post published!
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
            >
              {submitting ? 'Publishing…' : 'Publish Post'}
            </button>
          </form>
        </div>

        {/* Existing posts */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Published Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-[#141414] border border-[#1e1e1e] rounded-2xl">
              No posts yet.
            </div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1 truncate">{post.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-2">{post.body}</p>
                    {(post.before_image_url || post.after_image_url) && (
                      <div className="flex gap-2 mt-2 text-xs text-gray-600">
                        {post.before_image_url && <span>📷 Before</span>}
                        {post.after_image_url && <span>📷 After</span>}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
