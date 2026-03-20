'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const newsletterPosts = [
  {
    id: '4',
    title: 'Week 4 — Double Feature: Sceptile Gold Star + Metagross Gold Star',
    body: `Two Gold Stars in one week — neither was in submittable condition. This is the most ambitious restoration session we have run so far.

The Sceptile Gold Star arrived with heavy edge whitening along the left and bottom edges, plus a crease running diagonally from the top-right corner. Surface was clean. The plan: humidity chamber for the crease, followed by a weighted press, then edge treatment.

Results on the Sceptile: the crease reduced from a hard fold to a hairline — visible under direct light, nearly invisible at normal viewing angle. Edge whitening dropped by roughly 60%. AI grade moved from 2.9 to 5.4. Not a PSA 9, but the card is now a viable raw collector copy.

The Metagross Gold Star was a different challenge — no crease, but deep surface scratches on the holo pattern. This is the hardest category to restore. We attempted a micro-abrasive technique using a jeweller's polishing cloth with light circular pressure.

Results on the Metagross: mixed. Shallow scratches improved noticeably. The two deepest scratches remain untouched. AI grade moved from 3.1 to 4.0. The surface is better but still shows damage under harsh light.

Key lesson from this week: edge and crease restoration is highly repeatable and predictable. Surface scratch restoration is not. The same technique produces inconsistent results depending on scratch depth. We will continue refining the surface work, but our recommendation for now is to never attempt it on cards worth more than raw market value — the risk/reward is too tight.

Next week: we are attempting our first resubmission to PSA with the restored Sceptile to see if the jump in AI grade translates to an actual PSA grade improvement.`,
    before_image_url: null,
    after_image_url: null,
    published_at: new Date().toISOString(),
    tags: ['restoration', 'success', 'gold-star'],
    readTime: '5 min read',
  },
  {
    id: '3',
    title: 'Week 3 — Failure Report: Acetone Attempt Gone Wrong',
    body: `Honest failure report this week. We attempted to use diluted acetone to remove a stubborn sticker residue from a 1st Edition Venusaur surface. The result was immediate surface damage — the acetone stripped part of the card's finish and left a dull patch.

This technique should never be used on Pokémon cards. The card is now ungradable from a surface perspective. We are documenting this so no one else makes the same mistake.

Some restorations are not worth attempting if the risk of further damage is high. This is one of those cases. The sticker residue, while ugly, was preferable to the acetone damage.

Lesson learned: when in doubt, do nothing. A card with a minor flaw is better than a card with a catastrophic one.`,
    before_image_url: null,
    after_image_url: null,
    published_at: new Date().toISOString(),
    tags: ['failure', 'surface', 'chemical'],
    readTime: '3 min read',
  },
  {
    id: '2',
    title: 'Week 2 — Weighted Press Results and Edge Cleaning',
    body: `Following up from last week's steam treatment — we placed the Charizard under 10kg of books for 5 days at room temperature. The results were better than expected: the remaining curve is almost gone.

Separately we tested a soft microfiber edge cleaning technique on a scratched Blastoise. Light circular motions with a lens cloth removed surface oxidation but did not affect the deeper scratches.

Grades: Charizard moved from 6.1 to 7.4. Blastoise from 3.8 to 4.5.

Lesson: edge cleaning works on oxidation, not scratches. The weighted press over several days is far more effective than a single session — patience matters.`,
    before_image_url: null,
    after_image_url: null,
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['press', 'success', 'edges'],
    readTime: '4 min read',
  },
  {
    id: '1',
    title: 'Week 1 — First Attempt: Steam Treatment on a Bent Charizard',
    body: `This week we tried our first restoration attempt using a steam iron method on a heavily bent Base Set Charizard. The card had significant warping along the top edge — a common issue with cards stored improperly for decades.

We used a low-heat iron with a damp cloth barrier and achieved about 70% improvement. The warp reduced significantly but a slight curve remains. Surface was not damaged.

Grade improved from 4.2 to 6.1 according to the AI. We will try a weighted press method next week to push further.

The full process: 30 seconds of steam from 4 inches away, then immediately placed between two flat hardcovers. Repeated 3 times with 10-minute rest intervals.`,
    before_image_url: null,
    after_image_url: null,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['steam', 'warping', 'charizard'],
    readTime: '5 min read',
  },
]

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>('4')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubscribed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🔬 Weekly Restoration Journal
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Restoration Newsletter</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            A personal, honest journal of our team restoring damaged Pokémon cards. Every week: what we tried, what worked, what failed, and what we learned.
          </p>
        </div>

        {/* Subscribe section */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-3xl">📬</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Follow Our Journey</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get each new entry delivered to your inbox every week. No marketing, no noise — just the restoration journal.
              </p>
            </div>
          </div>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 text-green-400"
            >
              <span className="text-xl">✅</span>
              <div>
                <div className="font-semibold">You&apos;re subscribed!</div>
                <div className="text-sm opacity-80">You&apos;ll get the next entry in your inbox.</div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                {loading ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
          )}
          {error && <p className="mt-3 text-[#e63946] text-sm">{error}</p>}
        </div>

        {/* Newsletter entries */}
        <div>
          <h2 className="text-xl font-bold mb-6">Previous Entries</h2>
          <div className="space-y-4">
            {newsletterPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl overflow-hidden transition-colors"
              >
                {/* Entry header */}
                <button
                  className="w-full px-6 pt-6 pb-4 text-left flex items-start justify-between gap-4"
                  onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            tag === 'failure' ? 'bg-red-600/20 text-red-400' :
                            tag === 'success' ? 'bg-green-600/20 text-green-400' :
                            'bg-[#1e1e1e] text-gray-400'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg text-left leading-tight mb-2">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <span className={`text-gray-500 mt-1 flex-shrink-0 transition-transform ${expanded === post.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded body */}
                {expanded === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-6 border-t border-[#1e1e1e]"
                  >
                    {/* Before/after images placeholder */}
                    {(post.before_image_url || post.after_image_url) && (
                      <div className="grid grid-cols-2 gap-4 mt-5 mb-5">
                        <div>
                          <div className="text-xs text-gray-500 mb-2">Before</div>
                          <div className="h-40 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] flex items-center justify-center text-gray-600 text-sm">
                            Before photo
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-2">After</div>
                          <div className="h-40 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] flex items-center justify-center text-gray-600 text-sm">
                            After photo
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Body text */}
                    <div className="mt-5 space-y-4">
                      {post.body.split('\n\n').map((paragraph, pi) => (
                        <p key={pi} className="text-gray-300 leading-relaxed text-sm">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-gray-500 text-sm mb-4">Want to contribute your own restoration attempt?</p>
          <a
            href="mailto:restore@gradevaultai.com"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-colors inline-block"
          >
            Submit Your Restoration →
          </a>
        </div>
      </div>
    </div>
  )
}
