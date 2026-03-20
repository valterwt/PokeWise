import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — GradeVault',
  description: 'How GradeVault collects, uses, and protects your personal data under GDPR.',
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

export default function PrivacyPage() {
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
            GDPR — Regulation (EU) 2016/679
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Privacy Policy</h1>
          <p className="text-sm" style={{ color: '#9fb0ff' }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="1. Who we are (Data Controller)">
          <P>
            GradeVault is operated as a solo/micro-enterprise based in Sweden. For the purposes of the General Data
            Protection Regulation (GDPR) (EU) 2016/679, GradeVault is the <strong style={{ color: '#dfe7ff' }}>data controller</strong> of
            personal data collected through this website and its services.
          </P>
          <P>
            <strong style={{ color: '#dfe7ff' }}>Contact:</strong> privacy@gradevaultai.com<br />
            <strong style={{ color: '#dfe7ff' }}>Supervisory authority:</strong> Integritetsskyddsmyndigheten (IMY) — the Swedish Authority for Privacy Protection,
            imy.se. You have the right to lodge a complaint with IMY at any time.
          </P>
        </Section>

        <Section title="2. Data we collect and why">
          <P>We only collect data that is necessary to provide and improve the service.</P>

          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-semibold mb-2" style={{ color: '#dfe7ff' }}>Account data</p>
              <UL items={[
                'Email address — to create and identify your account.',
                'Encrypted password — stored via Supabase Auth, we never see your plaintext password.',
                'Lawful basis: performance of a contract (Article 6(1)(b) GDPR).',
              ]} />
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-semibold mb-2" style={{ color: '#dfe7ff' }}>Card images you upload</p>
              <UL items={[
                'Images are sent to the Anthropic Claude API for AI analysis and immediately discarded — we do not store uploaded images.',
                'Grade results (a numerical score and description) are stored in your account binder.',
                'Lawful basis: performance of a contract (Article 6(1)(b) GDPR).',
              ]} />
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-semibold mb-2" style={{ color: '#dfe7ff' }}>Newsletter subscription</p>
              <UL items={[
                'Email address — if you choose to subscribe to the Restoration Newsletter.',
                'You may unsubscribe at any time using the link in any newsletter email.',
                'Lawful basis: consent (Article 6(1)(a) GDPR).',
              ]} />
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-semibold mb-2" style={{ color: '#dfe7ff' }}>Payment data</p>
              <UL items={[
                'Payment card details are handled exclusively by Stripe. GradeVault does not store any payment card information.',
                'We receive only a transaction confirmation and your subscription/credit status from Stripe.',
                'Lawful basis: performance of a contract (Article 6(1)(b) GDPR) and legal obligation (Article 6(1)(c) GDPR) for invoicing.',
              ]} />
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-semibold mb-2" style={{ color: '#dfe7ff' }}>Technical / log data</p>
              <UL items={[
                'Server logs may contain IP addresses and browser user agents for security and error monitoring.',
                'These are retained for a maximum of 30 days and are not linked to your account.',
                'Lawful basis: legitimate interests (Article 6(1)(f) GDPR) — operating a secure service.',
              ]} />
            </div>
          </div>
        </Section>

        <Section title="3. Data processors (third parties)">
          <P>We use the following sub-processors who handle data on our behalf. All are bound by data processing agreements and, where applicable, EU Standard Contractual Clauses for international transfers.</P>
          <UL items={[
            'Supabase, Inc. (USA) — database, authentication, file storage. EU data residency region selected where available.',
            'Anthropic, PBC (USA) — Claude AI API for card image analysis. Images are not stored by Anthropic beyond the API request. Governed by Anthropic\'s API data processing terms.',
            'Stripe, Inc. (USA) — payment processing. Stripe is PCI DSS Level 1 certified.',
            'Resend, Inc. (USA) — transactional email (newsletter welcome and subscription emails).',
          ]} />
          <P>We do not sell personal data to any third party. We do not use personal data for advertising profiling.</P>
        </Section>

        <Section title="4. Data retention">
          <UL items={[
            'Account data: retained for the duration of your account, plus 90 days after deletion to allow account recovery.',
            'Grade records in your binder: deleted when you delete your account or individual records.',
            'Newsletter subscription: retained until you unsubscribe.',
            'Payment records: retained for 7 years as required by Swedish accounting law (Bokföringslagen).',
            'Server logs: 30 days maximum.',
          ]} />
        </Section>

        <Section title="5. Your rights under GDPR">
          <P>As a data subject in the EU/EEA, you have the following rights. To exercise any of them, contact us at privacy@gradevaultai.com. We will respond within 30 days.</P>
          <UL items={[
            'Right of access (Article 15) — request a copy of all personal data we hold about you.',
            'Right to rectification (Article 16) — correct inaccurate data.',
            'Right to erasure / "right to be forgotten" (Article 17) — request deletion of your account and data.',
            'Right to restriction of processing (Article 18) — ask us to limit how we use your data.',
            'Right to data portability (Article 20) — receive your data in a machine-readable format (JSON).',
            'Right to object (Article 21) — object to processing based on legitimate interests.',
            'Right to withdraw consent — where processing is based on consent (e.g. newsletter), you may withdraw at any time without affecting lawfulness of prior processing.',
            'Right to lodge a complaint with IMY — imy.se, +46 8 657 61 00.',
          ]} />
        </Section>

        <Section title="6. Cookies">
          <P>
            We use cookies and similar technologies. Strictly necessary cookies are set automatically. Optional cookies
            require your consent, which you can provide or withdraw via the cookie banner or our{' '}
            <Link href="/cookies" style={{ color: '#7cc6ff' }} className="underline hover:opacity-80 transition-opacity">Cookie Policy</Link>.
          </P>
        </Section>

        <Section title="7. International transfers">
          <P>
            Some of our processors are based in the United States. Transfers are protected by Standard Contractual Clauses
            (SCCs) approved by the European Commission (Commission Decision 2021/914), or covered by processors that
            participate in equivalent transfer mechanisms. You may request a copy of the applicable transfer safeguards
            by contacting us.
          </P>
        </Section>

        <Section title="8. Children">
          <P>
            GradeVault is not directed at children under 16 years of age. We do not knowingly collect personal data
            from children. If you believe a child has provided us with personal data, please contact us and we will
            delete it promptly.
          </P>
        </Section>

        <Section title="9. Changes to this policy">
          <P>
            We may update this Privacy Policy from time to time. Material changes will be notified via email (if you
            have an account) or via a prominent notice on the website. Continued use of the service after the effective
            date of a change constitutes acceptance of the updated policy.
          </P>
        </Section>

        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#9fb0ff' }}>
            Questions? Email us at{' '}
            <a href="mailto:privacy@gradevaultai.com" style={{ color: '#7cc6ff' }}>privacy@gradevaultai.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
