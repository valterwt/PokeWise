import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — GradeVault',
  description: 'Terms and conditions for using GradeVault AI card grading.',
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

function Callout({ children, color = '#7cc6ff' }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: `${color}10`, border: `1px solid ${color}25`, color: '#dfe7ff' }}
    >
      {children}
    </div>
  )
}

export default function TermsPage() {
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
            Governing law: Sweden · EU Consumer Rights Directive
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Terms of Service</h1>
          <p className="text-sm" style={{ color: '#9fb0ff' }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="1. About GradeVault">
          <P>
            GradeVault (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an AI-assisted trading card grading platform operated as a micro-enterprise
            based in Sweden. By accessing or using gradevaultai.com (the &quot;Service&quot;), you agree to be bound by these
            Terms of Service (&quot;Terms&quot;).
          </P>
          <P>
            If you do not agree to these Terms, do not use the Service. These Terms are subject to EU law and Swedish
            consumer protection legislation. If you are a consumer in the EU, mandatory rights under applicable law
            always apply regardless of these Terms.
          </P>
        </Section>

        <Section title="2. Eligibility">
          <UL items={[
            'You must be at least 16 years old to create an account.',
            'By using the Service you confirm that you have the legal capacity to enter into a binding agreement.',
            'You are responsible for maintaining the confidentiality of your account credentials.',
          ]} />
        </Section>

        <Section title="3. Description of the Service">
          <P>
            GradeVault provides an AI-powered tool to analyse images of trading cards and return an estimated condition
            grade on a 1–10 scale consistent with professional grading standards. The Service also includes a digital
            binder, community leaderboards, and a card restoration newsletter.
          </P>
          <Callout color="#f87171">
            <strong>Important disclaimer:</strong> GradeVault grades are <em>AI estimates</em> for informational and
            hobbyist purposes only. They are not official grades from PSA, BGS, CGC, or any other grading company.
            GradeVault grades cannot be used to certify a card&apos;s condition for sale, auction, or any commercial
            transaction. We make no guarantee that an AI grade will match any professional grading company&apos;s assessment.
          </Callout>
        </Section>

        <Section title="4. Accounts and access">
          <UL items={[
            'A free tier is available without registration (limited to 3 grades).',
            'Creating an account requires a valid email address and password.',
            'You are responsible for all activity that occurs under your account.',
            'You must not share your account credentials with others.',
            'We may suspend or terminate accounts that violate these Terms.',
          ]} />
        </Section>

        <Section title="5. Payments, subscriptions and cancellation">
          <P>
            GradeVault offers optional paid features: one-time credit packs and a monthly Pro subscription, processed
            securely via Stripe.
          </P>
          <UL items={[
            'All prices are displayed inclusive of any applicable VAT where required.',
            'Credit packs are one-time purchases. Unused credits carry over but are non-refundable once purchased, unless required by mandatory consumer law.',
            'Pro subscriptions are billed monthly. You may cancel at any time; cancellation takes effect at the end of the current billing period.',
            'If you are an EU consumer, you have a 14-day right of withdrawal from the date of purchase of a subscription under the Consumer Rights Directive (2011/83/EU). This right does not apply once you have actively begun using the service (e.g. submitted a grade) during the withdrawal period, as per Article 16(m) of the Directive — you will be asked to confirm this waiver at checkout.',
            'To cancel your subscription, visit your Account settings or contact us at support@gradevaultai.com.',
          ]} />
        </Section>

        <Section title="6. Acceptable use">
          <P>You agree not to:</P>
          <UL items={[
            'Use the Service for any unlawful purpose.',
            'Attempt to reverse-engineer, scrape, or abuse the AI grading API.',
            'Upload content that infringes third-party intellectual property rights.',
            'Use the Service to misrepresent card grades for fraudulent commercial transactions.',
            'Attempt to gain unauthorised access to other users&apos; accounts or data.',
            'Circumvent free-tier limits through automated means.',
          ]} />
        </Section>

        <Section title="7. Intellectual property">
          <P>
            GradeVault and its logo, design, and software are owned by or licensed to GradeVault. You are granted a
            limited, non-exclusive, non-transferable licence to use the Service for personal, non-commercial purposes.
          </P>
          <P>
            Card images and names (Pokémon etc.) are trademarks of their respective owners (Nintendo, The Pokémon Company,
            Game Freak). GradeVault is not affiliated with, endorsed by, or sponsored by any of these entities.
          </P>
          <P>
            You retain ownership of any images you upload. By uploading an image, you grant us a limited licence to
            process it for the purpose of providing the grading service.
          </P>
        </Section>

        <Section title="8. AI transparency">
          <P>
            GradeVault uses an AI system (Anthropic Claude) to analyse card images. In compliance with EU AI Act
            obligations (Regulation 2024/1689), you are informed that:
          </P>
          <UL items={[
            'Grading results are generated by an AI system, not a human expert.',
            'AI grades are estimates and may contain errors.',
            'You may request a human review of any grade by contacting us.',
            'The AI system does not make decisions with legal or significant personal effect.',
          ]} />
          <P>
            For full details, see our <Link href="/ai-disclosure" style={{ color: '#7cc6ff' }} className="underline">AI System Disclosure</Link>.
          </P>
        </Section>

        <Section title="9. Limitation of liability">
          <P>
            To the maximum extent permitted by applicable law, GradeVault is not liable for:
          </P>
          <UL items={[
            'Any inaccuracy in AI-generated grades.',
            'Financial loss arising from reliance on a GradeVault grade for commercial decisions.',
            'Service interruptions, data loss, or security incidents outside our reasonable control.',
            'Third-party services (Stripe, Supabase, Anthropic) — their own terms and liability limits apply.',
          ]} />
          <P>
            Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or any
            other liability that cannot lawfully be limited under Swedish or EU law.
          </P>
          <P>
            If you are an EU consumer, these limitations do not affect your mandatory statutory rights.
          </P>
        </Section>

        <Section title="10. Governing law and disputes">
          <P>
            These Terms are governed by the laws of Sweden. Any dispute not resolved amicably shall be subject to the
            jurisdiction of the courts of Sweden, without prejudice to your rights as an EU consumer to bring
            proceedings in the courts of your country of domicile.
          </P>
          <P>
            EU consumers may also use the EU Online Dispute Resolution platform:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#7cc6ff' }}>
              ec.europa.eu/consumers/odr
            </a>
          </P>
          <P>
            Swedish consumers may contact Konsumentverket (Swedish Consumer Agency) or the National Board for Consumer
            Disputes (Allmänna reklamationsnämnden, ARN) at arn.se.
          </P>
        </Section>

        <Section title="11. Changes to these Terms">
          <P>
            We may update these Terms from time to time. We will notify you of material changes by email (if you have
            an account) at least 30 days before they take effect. Continued use after the effective date constitutes
            acceptance of the updated Terms.
          </P>
        </Section>

        <Section title="12. Contact">
          <P>
            For any questions about these Terms: <a href="mailto:legal@gradevaultai.com" style={{ color: '#7cc6ff' }}>legal@gradevaultai.com</a>
          </P>
        </Section>

        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#9fb0ff' }}>
            These Terms of Service comply with the EU Consumer Rights Directive (2011/83/EU), the Swedish Distance
            Contracts Act (Lag om distansavtal och avtal utanför affärslokaler, SFS 2005:59), and applicable Swedish
            consumer protection law.
          </p>
        </div>
      </div>
    </div>
  )
}
