'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const scripts = [
  {
    id: '1',
    title: 'The "AI grades my $5k card" hook',
    hook: 'I let an AI grade my rarest Pokémon card. Here\'s what it said.',
    script: `[Cold open — hold card up to camera]
"This Gold Star Charizard is worth $5,000 graded. I'm about to let AI tell me what grade it would get."

[Cut to GradeVault screen recording]
"Upload the card, hit grade, and…"

[Reveal grade]
"It gave it a 7.8. That's lower than I expected. Let me show you exactly why."

[Close-up of edges, surface]
"See this right here? That's a light edge wear on the bottom left. And here — tiny surface scratch."

[Cut back to camera]
"The AI caught both. This thing is honestly scary accurate. Link in bio if you want to try yours."

[End card: GradeVault logo + 'grade free at gradevaultai.com']`,
    tags: ['hook', 'ai', 'showcase'],
    duration: '45–60 sec',
    cta: 'Grade free at gradevaultai.com',
  },
  {
    id: '2',
    title: 'Restoration before/after — Sceptile Gold Star',
    hook: 'This card was unsubmittable. We brought it back.',
    script: `[Open on damaged card close-up]
"This Sceptile Gold Star came in with heavy edge whitening and a deep crease. Standard PSA would reject this."

[Time-lapse restoration clips]
"Week 1: weighted press for the crease. Week 2: edge treatment with a microfiber cloth and humidity chamber."

[Reveal after]
"Look at that now. The crease dropped from a canyon to a hairline. Edge whitening — almost gone."

[GradeVault screen: grade comparison]
"Before: AI graded it a 2.9. After: 5.5. Still not PSA 10, but the jump speaks for itself."

[Camera]
"We document every restoration in our newsletter. It's free. Link in bio."`,
    tags: ['restoration', 'before-after', 'newsletter'],
    duration: '60–75 sec',
    cta: 'Subscribe to newsletter — link in bio',
  },
  {
    id: '3',
    title: 'Myth bust — "Never clean a card"',
    hook: 'Everyone says never clean your cards. They\'re half right.',
    script: `[Text overlay: "MYTH: You should never clean Pokémon cards"]

"This is repeated everywhere. It's not wrong, but it's also not the full picture."

[Show clean microfiber cloth]
"Surface dust? A soft microfiber in one direction is fine. No pressure, no circular motion."

[Show example of what NOT to do]
"This — rubbing hard with a paper towel — is what ruins cards. This is what people mean by 'never clean.'"

[Show oxidized edges]
"Edge oxidation is different. That's a restoration technique. Not cleaning. And it actually works."

[Cut to result]
"Nuance matters in this hobby. We test everything so you don't have to. Follow for more."`,
    tags: ['myth-bust', 'educational', 'engagement'],
    duration: '30–45 sec',
    cta: 'Follow for weekly card restoration tips',
  },
  {
    id: '4',
    title: '"Pack to PSA" series intro',
    hook: 'I\'m going to pull a card, restore it if needed, and submit it to PSA. Watch every step.',
    script: `[Opening: pack in hand]
"I'm starting a new series. Pull a card, grade it with AI, restore it if needed, submit to PSA. Every step on camera."

[Pack rip]
"Today's pull: [card name]. AI grades it…"

[Screen recording]
"6.2. Not bad. Not PSA 9 territory either. Here's what's holding it back."

[Detailed close-up]
"Top left corner — micro-bend. Surface — fine. Back — clean."

[Decision moment]
"So the question is: do we restore it, or submit raw and see what PSA says?"

[Look at camera]
"Drop your vote in the comments. I'll go with whatever gets the most votes. Part 2 next week."`,
    tags: ['series', 'psa', 'interactive'],
    duration: '45–60 sec',
    cta: 'Comment your vote — restore or submit raw',
  },
]

const styleGuide = {
  tone: [
    'Direct and confident — no filler words',
    'Honest about failures as much as successes',
    'Educational without being condescending',
    'Fast-paced but never rushed on key reveals',
  ],
  dos: [
    'Always open with the card visible in the first 2 seconds',
    'Show the AI interface — GradeVault on screen',
    'Use close-ups for edge and surface detail',
    'End every video with one clear CTA',
    'Use natural light or a ring light for card close-ups',
  ],
  donts: [
    'Never claim grading outcomes are guaranteed',
    'No clickbait that isn\'t delivered in the video',
    'Avoid shaky handheld footage during card reveals',
    'Don\'t over-explain — trust the viewer',
    'No background music louder than voice',
  ],
  hashtags: [
    '#pokemoncards',
    '#cardgrading',
    '#psa',
    '#pokemonrestoration',
    '#rawtomint',
    '#gradevault',
    '#cardcollector',
    '#pokemontcg',
  ],
}

const schedule = [
  { day: 'Monday', type: 'Educational / Myth-bust', status: 'planned' },
  { day: 'Wednesday', type: 'AI Grading Showcase', status: 'planned' },
  { day: 'Friday', type: 'Restoration Before/After', status: 'planned' },
  { day: 'Sunday', type: 'Pack to PSA Series Update', status: 'optional' },
]

type Tab = 'scripts' | 'style' | 'schedule'

export default function CampaignPage() {
  const [activeTab, setActiveTab] = useState<Tab>('scripts')
  const [expanded, setExpanded] = useState<string | null>('1')
  const [copied, setCopied] = useState<string | null>(null)

  const copyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scripts', label: 'Scripts' },
    { id: 'style', label: 'Style Guide' },
    { id: 'schedule', label: 'Schedule' },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(124,198,255,0.08)',
              border: '1px solid rgba(124,198,255,0.2)',
              color: '#7cc6ff',
            }}
          >
            🎬 @rawtomint Campaign Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">TikTok Campaign Studio</h1>
          <p style={{ color: '#9fb0ff' }} className="text-lg leading-relaxed max-w-xl mx-auto">
            Scripts, style guide, and content schedule for the @rawtomint TikTok channel.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
              style={
                activeTab === tab.id
                  ? { background: 'rgba(124,198,255,0.15)', color: '#7cc6ff' }
                  : { color: '#9fb0ff' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scripts Tab */}
        {activeTab === 'scripts' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {scripts.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden transition-colors"
                style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <button
                  className="w-full px-6 pt-5 pb-4 text-left flex items-start justify-between gap-4"
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(124,198,255,0.1)', color: '#7cc6ff' }}
                        >
                          {tag}
                        </span>
                      ))}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#9fb0ff' }}
                      >
                        {s.duration}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-snug text-white">{s.title}</h3>
                    <p className="text-sm mt-1" style={{ color: '#9fb0ff' }}>
                      Hook: <span className="italic">&ldquo;{s.hook}&rdquo;</span>
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 mt-1 transition-transform text-sm ${expanded === s.id ? 'rotate-180' : ''}`}
                    style={{ color: '#9fb0ff' }}
                  >
                    ▼
                  </span>
                </button>

                {expanded === s.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 pb-6"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <pre
                      className="mt-4 text-sm leading-relaxed whitespace-pre-wrap font-mono rounded-xl p-4"
                      style={{ background: '#0b0f1e', color: '#dfe7ff', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {s.script}
                    </pre>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div className="text-sm" style={{ color: '#9fb0ff' }}>
                        CTA: <span className="font-semibold" style={{ color: '#dfe7ff' }}>{s.cta}</span>
                      </div>
                      <button
                        onClick={() => copyScript(s.id, s.script)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                        style={{
                          background: copied === s.id ? 'rgba(34,197,94,0.15)' : 'rgba(124,198,255,0.12)',
                          color: copied === s.id ? '#22c55e' : '#7cc6ff',
                          border: `1px solid ${copied === s.id ? 'rgba(34,197,94,0.3)' : 'rgba(124,198,255,0.25)'}`,
                        }}
                      >
                        {copied === s.id ? 'Copied!' : 'Copy Script'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Style Guide Tab */}
        {activeTab === 'style' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Tone */}
            <div
              className="rounded-2xl p-6"
              style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🎯</span> Tone & Voice
              </h2>
              <ul className="space-y-2">
                {styleGuide.tone.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#dfe7ff' }}>
                    <span style={{ color: '#7cc6ff' }} className="mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dos and Donts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-6"
                style={{ background: '#0e1223', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span style={{ color: '#22c55e' }}>✓</span> Do
                </h2>
                <ul className="space-y-2">
                  {styleGuide.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#dfe7ff' }}>
                      <span style={{ color: '#22c55e' }} className="mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: '#0e1223', border: '1px solid rgba(248,113,113,0.15)' }}
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span style={{ color: '#f87171' }}>✗</span> Don&apos;t
                </h2>
                <ul className="space-y-2">
                  {styleGuide.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#dfe7ff' }}>
                      <span style={{ color: '#f87171' }} className="mt-0.5 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hashtags */}
            <div
              className="rounded-2xl p-6"
              style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>#</span> Standard Hashtags
              </h2>
              <div className="flex flex-wrap gap-2">
                {styleGuide.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1.5 rounded-lg font-mono cursor-default select-all"
                    style={{ background: 'rgba(124,198,255,0.08)', color: '#7cc6ff', border: '1px solid rgba(124,198,255,0.15)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-lg font-bold">Weekly Posting Schedule</h2>
                <p className="text-sm mt-1" style={{ color: '#9fb0ff' }}>3 core posts per week + optional Sunday update.</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                {schedule.map((item, i) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-24 text-sm font-bold"
                        style={{ color: item.status === 'optional' ? '#9fb0ff' : '#dfe7ff' }}
                      >
                        {item.day}
                      </div>
                      <div className="text-sm" style={{ color: '#9fb0ff' }}>{item.type}</div>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={
                        item.status === 'planned'
                          ? { background: 'rgba(124,198,255,0.1)', color: '#7cc6ff' }
                          : { background: 'rgba(255,255,255,0.05)', color: '#9fb0ff' }
                      }
                    >
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="mt-6 rounded-2xl p-6"
              style={{ background: 'rgba(124,198,255,0.05)', border: '1px solid rgba(124,198,255,0.15)' }}
            >
              <h3 className="font-bold mb-2" style={{ color: '#7cc6ff' }}>Posting Notes</h3>
              <ul className="space-y-1.5 text-sm" style={{ color: '#9fb0ff' }}>
                <li>• Best posting windows: 7–9am or 6–9pm in target timezone</li>
                <li>• Always pin top-performing video in profile for new visitors</li>
                <li>• Reply to all comments within first hour of posting</li>
                <li>• Restoration videos perform 2× better with a visible before/after thumbnail</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
