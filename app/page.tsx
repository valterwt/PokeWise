import Link from 'next/link'
import GradeBadge from '@/components/GradeBadge'

const features = [
  {
    icon: '🤖',
    title: 'AI Grading',
    description: 'Claude AI analyzes your card images using PSA-style criteria — centering, corners, edges, and surface — returning a precise 1–10 grade.',
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
    number: '01',
    icon: '📸',
    title: 'Upload',
    description: 'Drag and drop or click to upload the front and back of your Pokémon card.',
  },
  {
    number: '02',
    icon: '🔍',
    title: 'AI Analyzes',
    description: 'Claude AI examines every detail — centering, corner wear, edge condition, and surface quality.',
  },
  {
    number: '03',
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
    a: "Our AI uses Claude's vision capabilities trained on PSA-style criteria. While not a replacement for professional grading, it provides a reliable indicator of card condition and is excellent for deciding which cards are worth submitting for professional grading.",
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
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#e63946]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#ffd700]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span>⚡</span> AI Pokémon Card Grading is here
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            AI Pokémon Card Grading<br />
            <span className="text-[#e63946]">Instant.</span>{' '}
            <span className="text-[#ffd700]">Accurate.</span>{' '}
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Animated.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your Pokémon card and get a professional PSA-style grade in seconds. Watch a pack open to reveal your score. Build your digital binder. Join the community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/grade"
              className="px-8 py-4 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold text-lg rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(230,57,70,0.4)]"
            >
              Grade Your First Card Free ⚡
            </Link>
            <Link
              href="/leaderboards"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg rounded-xl transition-colors"
            >
              View Community Grades
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
            {[
              { value: '50,000+', label: 'Cards Graded' },
              { value: '1–10', label: 'PSA-Style Scale' },
              { value: '< 30s', label: 'Average Grade Time' },
              { value: 'Free', label: 'First Grade' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-black text-[#ffd700]">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 border-t border-[#1e1e1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three steps from photo to grade.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 h-full hover:border-[#333] transition-colors">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="text-[#e63946] text-sm font-bold mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-gray-600 text-2xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Grades */}
      <section className="px-4 py-20 border-t border-[#1e1e1e] bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Community Grades</h2>
            <p className="text-gray-400 text-lg">Real cards graded by real collectors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`bg-[#141414] rounded-2xl p-5 border-2 transition-all hover:-translate-y-1 ${
                  t.grade >= 9 ? 'border-[#ffd700]/40 grade-glow-gold' :
                  t.grade >= 7 ? 'border-green-500/40 grade-glow-green' :
                  t.grade >= 5 ? 'border-yellow-500/40 grade-glow-yellow' :
                  'border-red-600/40 grade-glow-red'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-20 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-3xl border border-[#2a2a2a]">
                    🎴
                  </div>
                  <GradeBadge grade={t.grade} size="lg" />
                </div>
                <h3 className="font-bold text-sm mb-1">{t.card}</h3>
                <p className="text-gray-500 text-xs mb-3">{t.summary}</p>
                <div className="text-gray-600 text-xs">by @{t.username}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 border-t border-[#1e1e1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Built for Pokémon collectors, by collectors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 hover:border-[#2a2a2a] transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-20 border-t border-[#1e1e1e] bg-gradient-to-r from-[#e63946]/10 via-[#0a0a0a] to-[#ffd700]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to grade your collection?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of collectors who use PokeWise to track, grade, and showcase their cards.</p>
          <Link
            href="/grade"
            className="inline-block px-10 py-5 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold text-xl rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(230,57,70,0.5)]"
          >
            Grade Your First Card Free ⚡
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 border-t border-[#1e1e1e]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#141414] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-colors"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold flex justify-between items-center list-none">
                  {faq.q}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-[#1e1e1e] pt-4">
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
