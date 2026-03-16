import Link from 'next/link'
import GradeBadge from '@/components/GradeBadge'
import CharizardCarousel from '@/components/CharizardCarousel'

const features = [
  {
    icon: '🤖',
    title: 'AI Grading',
    description: 'Claude AI analyzes your card images using PSA-style criteria — centering, corners, edges, and surface — returning an AI-estimated 1–10 condition score. Not a replacement for professional grading. A starting point.',
  },
  {
    icon: '✨',
    title: 'Pack Opening Animation',
    description: "Every grade reveal is a moment. Watch a booster pack tear open and reveal your card's grade with a cinematic animation.",
  },
  {
    icon: '📒',
    title: 'Digital Binder',
    description: 'Store all your graded cards in a beautiful skeuomorphic binder. Filter, sort, and share your collection.',
  },
  {
    icon: '🔬',
    title: 'Restoration Newsletter',
    description: 'Follow our weekly journal documenting real card restoration experiments — successes, failures, and techniques.',
  },
  {
    icon: '🏆',
    title: 'Leaderboards',
    description: 'See which cards are being graded most across the community and watch the live feed of recent grades.',
  },
  {
    icon: '📊',
    title: 'Detailed Breakdown',
    description: 'Each grade includes sub-scores for centering, corners, edges, and surface with an AI-written condition report.',
  },
]

const steps = [
  {
    number: 'Step One',
    icon: '📸',
    title: 'Upload',
    description: 'Drag and drop or click to upload the front and back of your card.',
  },
  {
    number: 'Step Two',
    icon: '🔍',
    title: 'AI Analyzes',
    description: 'Claude AI examines every detail — centering, corner wear, edge condition, and surface quality.',
  },
  {
    number: 'Step Three',
    icon: '🎴',
    title: 'Get Your Grade',
    description: 'A pack opens, your card is revealed, and your grade appears with a full condition breakdown.',
  },
]

const testimonials = [
  { card: 'Charizard Base Set', grade: 8, username: 'FlameCollector', summary: 'Near mint condition. Excellent centering, minor wear on back corners.' },
  { card: 'Pikachu Illustrator', grade: 9, username: 'RarePokeFan', summary: 'Gem mint quality. Near-perfect surface with outstanding centering.' },
  { card: 'Mewtwo 1st Edition', grade: 6, username: 'VintageTrader', summary: 'Light play visible. Surface scratches reduce grade but corners hold well.' },
  { card: 'Blastoise Shadowless', grade: 7, username: 'WaterTypePro', summary: 'Good condition. Minor centering off, edges show light wear.' },
]

const faqs = [
  {
    q: 'How accurate is the AI grading?',
    a: "Honestly? It's a work in progress — and we say that openly. GradeVaultAI uses Claude's vision capabilities to assess cards against PSA-style criteria. It will not always match a professional grader's eye. It gets better over time through real use, community feedback, and iteration. We're not here to replace PSA or claim we've cracked grading — we're building a transparent tool, in public, with the people who actually use it.",
  },
  {
    q: 'What Pokémon cards can I grade?',
    a: 'Any Pokémon TCG card — vintage Base Set to modern sets, English and international prints. The AI analyzes the physical condition of whatever card you upload.',
  },
  {
    q: 'Is my first grade really free?',
    a: 'Yes! You can grade your first card without creating an account. Sign up to save grades to your binder and access your full history.',
  },
  {
    q: 'How do I get the best grade reading?',
    a: 'Use good lighting with no glare. Place the card on a dark surface. Take photos straight-on, not at an angle. Submit both front and back for the most accurate grade.',
  },
  {
    q: 'What is the Restoration Newsletter?',
    a: "A weekly journal documenting our team's real experiments restoring damaged Pokémon cards — steam treatment, press methods, cleaning techniques, and honest reports on what works and what doesn't.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Soft glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'rgba(124,198,255,0.06)' }} />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{ background: 'rgba(167,139,250,0.05)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(124,198,255,0.08)',
              border: '1px solid rgba(124,198,255,0.2)',
              color: '#7cc6ff',
            }}>
            <span>⚡</span> AI TCG Card Grading — built openly with the community
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
            style={{ color: '#dfe7ff' }}>
            AI TCG Card Grading<br />
            <span style={{ color: '#7cc6ff' }}>Instant.</span>{' '}
            <span style={{ color: '#a78bfa' }}>Honest.</span>{' '}
            <span style={{ background: 'linear-gradient(90deg, #dfe7ff, #9fb0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Evolving.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#9fb0ff' }}>
            Upload your card and get an AI-assessed condition estimate in seconds. This is not the definitive word on your card — it&apos;s a starting point. We&apos;re building this openly, improving through real use, and we welcome your feedback when we get it wrong.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/grade"
              className="px-8 py-4 font-bold text-lg rounded-xl transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)',
                color: '#0b0f1e',
                boxShadow: '0 0 32px rgba(124,198,255,0.35)',
              }}
            >
              Grade Your First Card Free ⚡
            </Link>
            <Link
              href="/leaderboards"
              className="px-8 py-4 font-semibold text-lg rounded-xl transition-colors"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#dfe7ff',
              }}
            >
              View Community Grades
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
            {[
              { value: '50,000+', label: 'Cards Graded' },
              { value: '1–10',    label: 'PSA-Style Scale' },
              { value: '< 30s',   label: 'Average Grade Time' },
              { value: 'Free',    label: 'First Grade' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-black" style={{ color: '#7cc6ff' }}>{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: 'rgba(159,176,255,0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Charizard Carousel ───────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(19,23,41,0.6)' }}>
        <CharizardCarousel />
      </div>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#dfe7ff' }}>How It Works</h2>
            <p className="text-lg" style={{ color: '#9fb0ff' }}>Three steps from photo to grade.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className="rounded-2xl p-8 h-full transition-all hover:-translate-y-1"
                  style={{
                    background: 'rgba(19,23,41,0.7)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div
                    className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{
                      background: 'rgba(124,198,255,0.1)',
                      border: '1px solid rgba(124,198,255,0.25)',
                      color: '#7cc6ff',
                    }}
                  >{step.number}</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#dfe7ff' }}>{step.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#9fb0ff' }}>{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-2xl z-10" style={{ color: 'rgba(124,198,255,0.4)' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community Grades ─────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(14,18,35,0.5)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#dfe7ff' }}>Community Grades</h2>
            <p className="text-lg" style={{ color: '#9fb0ff' }}>Real cards graded by real collectors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border-2 transition-all hover:-translate-y-1 ${
                  t.grade >= 9 ? 'grade-glow-gold' :
                  t.grade >= 7 ? 'grade-glow-green' :
                  t.grade >= 5 ? 'grade-glow-yellow' :
                  'grade-glow-red'
                }`}
                style={{ background: 'rgba(19,23,41,0.8)', backdropFilter: 'blur(6px)' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-20 rounded-lg flex items-center justify-center text-3xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    🎴
                  </div>
                  <GradeBadge grade={t.grade} size="lg" />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: '#dfe7ff' }}>{t.card}</h3>
                <p className="text-xs mb-3" style={{ color: '#9fb0ff' }}>{t.summary}</p>
                <div className="text-xs" style={{ color: 'rgba(159,176,255,0.5)' }}>by @{t.username}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#dfe7ff' }}>Everything You Need</h2>
            <p className="text-lg" style={{ color: '#9fb0ff' }}>Built for TCG collectors, by collectors — and improved by them too.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{
                  background: 'rgba(19,23,41,0.7)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#dfe7ff' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9fb0ff' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section
        className="px-4 py-20"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(135deg, rgba(124,198,255,0.07) 0%, rgba(11,15,30,0) 50%, rgba(167,139,250,0.07) 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#dfe7ff' }}>Grade your cards. Tell us where we&apos;re wrong.</h2>
          <p className="text-lg mb-8" style={{ color: '#9fb0ff' }}>This hobby has had enough smoke and mirrors. GradeVaultAI is free to use, transparent about its limits, and gets better every time the community puts it to the test.</p>
          <Link
            href="/grade"
            className="inline-block px-10 py-5 font-bold text-xl rounded-xl transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7cc6ff, #a78bfa)',
              color: '#0b0f1e',
              boxShadow: '0 0 40px rgba(124,198,255,0.4)',
            }}
          >
            Grade Your First Card Free ⚡
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#dfe7ff' }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(19,23,41,0.7)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold flex justify-between items-center list-none"
                  style={{ color: '#dfe7ff' }}>
                  {faq.q}
                  <span className="group-open:rotate-180 transition-transform" style={{ color: '#7cc6ff' }}>▼</span>
                </summary>
                <div className="px-6 pb-5 leading-relaxed pt-4"
                  style={{ color: '#9fb0ff', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
