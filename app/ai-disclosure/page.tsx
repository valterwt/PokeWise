import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI System Disclosure — GradeVault',
  description: 'Transparency information about the AI system used by GradeVault, in compliance with the EU AI Act.',
}

const LAST_UPDATED = '20 March 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4" style={{ color: '#dfe7ff' }}>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#9fb0ff' }}>
        {children}
      </div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span style={{ color: '#7cc6ff' }} className="flex-shrink-0 mt-0.5">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function InfoCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold text-sm" style={{ color: '#dfe7ff' }}>{title}</h3>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: '#9fb0ff' }}>
        {children}
      </div>
    </div>
  )
}

export default function AIDisclosurePage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <Link href="/legal" className="text-xs mb-6 inline-block transition-colors" style={{ color: '#7cc6ff' }}>
            ← Legal Centre
          </Link>
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-4 block"
            style={{ background: 'rgba(124,198,255,0.08)', border: '1px solid rgba(124,198,255,0.2)', color: '#7cc6ff' }}
          >
            EU AI Act — Regulation (EU) 2024/1689 · Article 50
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">AI System Disclosure</h1>
          <p className="text-sm" style={{ color: '#9fb0ff' }}>Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Key facts summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <InfoCard icon="🤖" title="AI system">
            <p>Anthropic Claude (large language model with vision). Used to analyse card images and return a condition grade.</p>
          </InfoCard>
          <InfoCard icon="⚖️" title="Risk classification">
            <p>Limited Risk (Article 50 EU AI Act). Transparency obligation applies. Not classified as high-risk.</p>
          </InfoCard>
          <InfoCard icon="👤" title="Human oversight">
            <p>Every grade can be challenged. A human review is available on request. No automated decision has legal effect on you.</p>
          </InfoCard>
        </div>

        <Section title="1. What the AI does">
          <P>
            When you upload a card image, GradeVault sends that image to the Anthropic Claude API. The AI model
            analyses the image for visual indicators of card condition — including surface scratches, edge wear,
            corner damage, centering, and holo pattern condition — and returns a numerical grade on a 1–10 scale
            consistent with professional grading standards.
          </P>
          <P>
            This is an automated process. The grade you receive is generated entirely by an AI system, not reviewed
            by a human grader before delivery to you.
          </P>
        </Section>

        <Section title="2. EU AI Act compliance">
          <P>
            The EU AI Act (Regulation (EU) 2024/1689) entered into force on 1 August 2024. GradeVault&apos;s AI grading
            system is classified as a <strong style={{ color: '#dfe7ff' }}>Limited Risk AI system</strong> under Article 50.
          </P>
          <P>
            Under Article 50(1), we are required to inform you clearly that you are interacting with an AI system.
            This page, our Terms of Service, and the grading interface all fulfil this transparency obligation.
          </P>
          <P>
            GradeVault&apos;s AI system does <em>not</em> fall into any high-risk category listed in Annex III of the EU
            AI Act (such as biometric identification, employment decisions, credit scoring, or critical infrastructure).
            It is a hobbyist consumer tool for estimating the condition of trading cards.
          </P>
          <UL items={[
            'Prohibited AI practices (Chapter II, applicable from 2 February 2025): not applicable — GradeVault does not use subliminal manipulation, social scoring, real-time biometric surveillance, or emotion recognition in prohibited contexts.',
            'High-risk AI requirements (Annex III, applicable from 2 August 2026): not applicable.',
            'Limited Risk transparency (Article 50, applicable from 2 August 2026): GradeVault is implementing transparency measures now as best practice, in advance of the mandatory deadline.',
          ]} />
        </Section>

        <Section title="3. How the AI grades">
          <P>
            The AI model is instructed to evaluate the following card condition factors:
          </P>
          <UL items={[
            'Centering — the alignment of the printed image within the card border.',
            'Corners — sharpness and whitening of all four corners.',
            'Edges — condition of all four edges (chipping, whitening, roughness).',
            'Surface — presence of scratches, print lines, staining, or holo damage.',
            'Overall — holistic assessment synthesising all four sub-categories.',
          ]} />
          <P>
            The AI is prompted to return a grade on a 1–10 scale and a brief explanation of the key factors
            influencing the grade. The model&apos;s vision capability assesses the uploaded JPEG or PNG image directly.
          </P>
        </Section>

        <Section title="4. Limitations you must be aware of">
          <div
            className="rounded-xl p-5"
            style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <ul className="space-y-2">
              {[
                'AI grades are estimates, not certified assessments. They do not constitute a professional grading opinion.',
                'The AI can only analyse what is visible in the uploaded image. Poor lighting, angle, or image quality will directly reduce accuracy.',
                'The AI cannot detect all forms of card damage, including certain types of surface damage that are only visible under specific lighting conditions or tactile inspection.',
                'AI grades will not match PSA, BGS, CGC, or any other grading company\'s grade exactly — and in some cases may differ significantly.',
                'Do not use a GradeVault grade to make high-value buying or selling decisions. Always seek a certified professional grade for transactions involving significant sums.',
                'The model may perform differently across different card sets, printing eras, or foil types.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#dfe7ff' }}>
                  <span style={{ color: '#f87171' }} className="flex-shrink-0 mt-0.5">⚠</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="5. Your right to human review">
          <P>
            You have the right to request that a human review any grade produced by GradeVault&apos;s AI system.
            To do so, email <a href="mailto:grade-review@gradevaultai.com" style={{ color: '#7cc6ff' }}>grade-review@gradevaultai.com</a> with
            your grade ID and the card image. We will review and respond within 5 business days.
          </P>
          <P>
            Note: this review is advisory only. GradeVault does not certify cards and cannot issue binding grading
            opinions. It is intended to catch clear AI errors (e.g. a grade obviously inconsistent with the image).
          </P>
        </Section>

        <Section title="6. Data handling by the AI system">
          <P>
            Images are sent to the Anthropic Claude API for analysis. Anthropic does not use API inputs to train
            its models (as of March 2026, under Anthropic&apos;s API data use policy). Images are not stored by GradeVault
            after the grade is returned. See our <Link href="/privacy" style={{ color: '#7cc6ff' }}>Privacy Policy</Link> for
            full details on data handling.
          </P>
        </Section>

        <Section title="7. Contact">
          <P>
            For questions about our AI system or this disclosure:{' '}
            <a href="mailto:ai@gradevaultai.com" style={{ color: '#7cc6ff' }}>ai@gradevaultai.com</a>
          </P>
        </Section>

        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#9fb0ff' }}>
            This disclosure is provided in accordance with Article 50 of Regulation (EU) 2024/1689 (EU AI Act) and
            as a best practice measure. GradeVault is committed to updating this disclosure as the EU AI Act
            application timeline progresses and as our AI system evolves.
          </p>
        </div>
      </div>
    </div>
  )
}
