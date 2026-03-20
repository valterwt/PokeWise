import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Centre — GradeVault',
  description: 'GradeVault legal documents: privacy policy, terms of service, cookie policy, and AI disclosure.',
}

const documents = [
  {
    href: '/privacy',
    icon: '🔏',
    title: 'Privacy Policy',
    subtitle: 'GDPR · Regulation (EU) 2016/679',
    desc: 'How we collect, use, store, and protect your personal data. Covers your rights as a data subject, our data processors, retention periods, and how to contact us or file a complaint with IMY.',
    tags: ['GDPR', 'Data rights', 'IMY'],
  },
  {
    href: '/terms',
    icon: '📋',
    title: 'Terms of Service',
    subtitle: 'Swedish law · EU Consumer Rights Directive',
    desc: 'The agreement between you and GradeVault. Covers the service description, AI grading disclaimer, payment and cancellation terms, acceptable use, limitation of liability, and dispute resolution including ARN and the EU ODR platform.',
    tags: ['Contract', 'Payments', 'Consumer rights'],
  },
  {
    href: '/cookies',
    icon: '🍪',
    title: 'Cookie Policy',
    subtitle: 'ePrivacy Directive · GDPR Article 5(3)',
    desc: 'Every cookie and localStorage item GradeVault sets, what it does, and how long it lasts. Explains how to manage or withdraw your consent at any time.',
    tags: ['Cookies', 'Consent', 'Local storage'],
  },
  {
    href: '/ai-disclosure',
    icon: '🤖',
    title: 'AI System Disclosure',
    subtitle: 'EU AI Act · Regulation (EU) 2024/1689',
    desc: 'Transparency information about the Anthropic Claude AI system powering GradeVault grades. Covers risk classification (Limited Risk), how the AI works, its limitations, and your right to human review.',
    tags: ['EU AI Act', 'Transparency', 'AI ethics'],
  },
]

const compliance = [
  { flag: '🇪🇺', law: 'GDPR (EU) 2016/679', status: 'Compliant', detail: 'Privacy policy, consent management, user rights, DPA agreements' },
  { flag: '🇸🇪', law: 'Swedish IMY / Dataskyddslagen', status: 'Compliant', detail: 'IMY listed as supervisory authority; Swedish law governs disputes' },
  { flag: '🍪', law: 'ePrivacy Directive', status: 'Compliant', detail: 'Granular cookie consent banner, no marketing/analytics cookies by default' },
  { flag: '🤖', law: 'EU AI Act 2024/1689', status: 'Proactive', detail: 'Limited Risk classification; Article 50 transparency implemented ahead of 2026 deadline' },
  { flag: '🛒', law: 'Consumer Rights Directive 2011/83/EU', status: 'Compliant', detail: '14-day withdrawal right, pre-contractual information, EU ODR platform' },
  { flag: '⚖️', law: 'Swedish Distance Contracts Act (SFS 2005:59)', status: 'Compliant', detail: 'Cooling-off rights, mandatory information for distance contracts' },
  { flag: '💳', law: 'PSD2 / Stripe compliance', status: 'Compliant', detail: 'Payments processed by Stripe (PCI DSS Level 1); GradeVault stores no card data' },
  { flag: '📢', law: 'Swedish Marketing Act (SFS 2008:486)', status: 'Compliant', detail: 'No misleading commercial communications; AI grading disclaimers prominent' },
]

export default function LegalPage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(124,198,255,0.08)', border: '1px solid rgba(124,198,255,0.2)', color: '#7cc6ff' }}
          >
            ⚖️ Legal Centre
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Legal &amp; Compliance</h1>
          <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: '#9fb0ff' }}>
            GradeVault is operated from Sweden and complies with EU and Swedish law. All legal documents
            are written in plain English.
          </p>
        </div>

        {/* Document cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {documents.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group rounded-2xl p-6 transition-all block"
              style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,198,255,0.25)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{doc.icon}</span>
                  <div>
                    <h2 className="font-bold" style={{ color: '#dfe7ff' }}>{doc.title}</h2>
                    <p className="text-[11px] mt-0.5" style={{ color: '#7cc6ff' }}>{doc.subtitle}</p>
                  </div>
                </div>
                <span className="text-sm transition-transform group-hover:translate-x-1" style={{ color: '#9fb0ff' }}>→</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#9fb0ff' }}>{doc.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#9fb0ff', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Compliance table */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Regulatory compliance overview</h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {compliance.map((row, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4"
                style={{
                  borderBottom: i < compliance.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: i % 2 === 0 ? '#0e1223' : 'rgba(255,255,255,0.01)',
                }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{row.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: '#dfe7ff' }}>{row.law}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={
                        row.status === 'Compliant'
                          ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
                          : { background: 'rgba(124,198,255,0.12)', color: '#7cc6ff' }
                      }
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#9fb0ff' }}>{row.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: 'rgba(124,198,255,0.05)', border: '1px solid rgba(124,198,255,0.15)' }}
        >
          <h3 className="font-bold mb-2" style={{ color: '#7cc6ff' }}>Questions about compliance or your rights?</h3>
          <p className="text-sm mb-4" style={{ color: '#9fb0ff' }}>
            We aim to respond to all privacy and legal enquiries within 5 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <a href="mailto:privacy@gradevaultai.com" style={{ color: '#7cc6ff' }} className="underline">
              privacy@gradevaultai.com
            </a>
            <span style={{ color: '#9fb0ff' }} className="hidden sm:inline">·</span>
            <a href="mailto:legal@gradevaultai.com" style={{ color: '#7cc6ff' }} className="underline">
              legal@gradevaultai.com
            </a>
          </div>
          <p className="text-xs mt-4" style={{ color: '#9fb0ff' }}>
            Supervisory authority: Integritetsskyddsmyndigheten (IMY) ·{' '}
            <a href="https://imy.se" target="_blank" rel="noopener noreferrer" style={{ color: '#7cc6ff' }}>imy.se</a>
          </p>
        </div>
      </div>
    </div>
  )
}
