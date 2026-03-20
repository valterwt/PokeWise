import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — GradeVault',
  description: 'How GradeVault uses cookies and how to manage your preferences.',
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

type CookieEntry = {
  name: string
  purpose: string
  duration: string
  provider: string
}

function CookieTable({ cookies }: { cookies: CookieEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: '#dfe7ff' }}>Name</th>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: '#dfe7ff' }}>Purpose</th>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: '#dfe7ff' }}>Duration</th>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: '#dfe7ff' }}>Provider</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((c, i) => (
            <tr
              key={i}
              style={{
                borderBottom: i < cookies.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              }}
            >
              <td className="px-4 py-3 font-mono" style={{ color: '#7cc6ff' }}>{c.name}</td>
              <td className="px-4 py-3" style={{ color: '#9fb0ff' }}>{c.purpose}</td>
              <td className="px-4 py-3" style={{ color: '#9fb0ff' }}>{c.duration}</td>
              <td className="px-4 py-3" style={{ color: '#9fb0ff' }}>{c.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CategoryBadge({ label, required }: { label: string; required: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium mb-3"
      style={
        required
          ? { background: 'rgba(124,198,255,0.1)', color: '#7cc6ff', border: '1px solid rgba(124,198,255,0.2)' }
          : { background: 'rgba(255,255,255,0.06)', color: '#9fb0ff', border: '1px solid rgba(255,255,255,0.1)' }
      }
    >
      {required ? '🔒 Always on' : '⚙️ Optional — requires consent'}
    </span>
  )
}

export default function CookiesPage() {
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
            ePrivacy Directive · GDPR Article 5(3)
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Cookie Policy</h1>
          <p className="text-sm" style={{ color: '#9fb0ff' }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="1. What are cookies?">
          <P>
            Cookies are small text files placed on your device by a website. They allow the site to remember
            information about your visit — such as your login session or preferences. Similar technologies include
            localStorage (used by GradeVault for cookie consent and grade count tracking) and session storage.
          </P>
          <P>
            Under the EU ePrivacy Directive and GDPR, cookies that are not strictly necessary for the service to
            function require your prior consent. GradeVault respects this requirement.
          </P>
        </Section>

        <Section title="2. Categories we use">

          {/* Strictly necessary */}
          <div className="rounded-xl p-5 mb-4" style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}>
            <CategoryBadge label="Strictly necessary" required={true} />
            <h3 className="font-bold mb-2" style={{ color: '#dfe7ff' }}>Strictly necessary</h3>
            <P>These cookies are essential for the website to work. They cannot be disabled.</P>
            <div className="mt-3">
              <CookieTable cookies={[
                { name: 'sb-*-auth-token', purpose: 'Supabase authentication session — keeps you logged in.', duration: 'Session / up to 1 week', provider: 'Supabase (GradeVault)' },
                { name: 'gradevault_cookie_consent_v1', purpose: 'Stores your cookie consent preferences so the banner does not reappear.', duration: '12 months', provider: 'GradeVault (localStorage)' },
                { name: 'gradevault_free_grades', purpose: 'Tracks how many free grades a guest user has used.', duration: 'Session', provider: 'GradeVault (localStorage)' },
              ]} />
            </div>
          </div>

          {/* Functional */}
          <div className="rounded-xl p-5 mb-4" style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}>
            <CategoryBadge label="Functional" required={false} />
            <h3 className="font-bold mb-2" style={{ color: '#dfe7ff' }}>Functional</h3>
            <P>These remember your preferences to improve your experience.</P>
            <div className="mt-3">
              <CookieTable cookies={[
                { name: 'gradevault_binder_layout', purpose: 'Remembers your preferred binder grid layout (grid or list view).', duration: '6 months', provider: 'GradeVault (localStorage)' },
                { name: 'gradevault_ui_prefs', purpose: 'Stores UI display preferences.', duration: '6 months', provider: 'GradeVault (localStorage)' },
              ]} />
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-xl p-5 mb-4" style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}>
            <CategoryBadge label="Analytics" required={false} />
            <h3 className="font-bold mb-2" style={{ color: '#dfe7ff' }}>Analytics</h3>
            <P>
              We do not currently use analytics cookies. If we introduce analytics in the future, we will update
              this policy and request fresh consent before setting any such cookies.
            </P>
          </div>

          {/* Marketing */}
          <div className="rounded-xl p-5" style={{ background: '#0e1223', border: '1px solid rgba(255,255,255,0.07)' }}>
            <CategoryBadge label="Marketing" required={false} />
            <h3 className="font-bold mb-2" style={{ color: '#dfe7ff' }}>Marketing</h3>
            <P>
              We do not use marketing or advertising cookies and do not share data with advertising networks.
            </P>
          </div>
        </Section>

        <Section title="3. Third-party cookies">
          <P>
            Stripe (our payment processor) may set cookies during the checkout flow to prevent fraud and remember
            your payment method. These are governed by{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#7cc6ff' }}>
              Stripe&apos;s Privacy Policy
            </a>.
          </P>
          <P>
            We do not embed social media tracking pixels, advertising networks, or analytics SDKs that set third-party
            cookies without your explicit consent.
          </P>
        </Section>

        <Section title="4. How to manage your preferences">
          <P>
            You can change your cookie preferences at any time using the cookie banner (click &quot;Manage cookies&quot; in the
            footer) or by clearing your browser&apos;s cookies and local storage. Note that clearing cookies will also
            sign you out of your account.
          </P>
          <P>You can also control cookies at the browser level:</P>
          <ul className="space-y-1 pl-4" style={{ color: '#9fb0ff' }}>
            {[
              ['Chrome', 'Settings → Privacy and security → Cookies'],
              ['Firefox', 'Settings → Privacy & Security → Cookies'],
              ['Safari', 'Preferences → Privacy → Cookies'],
              ['Edge', 'Settings → Privacy, search and services → Cookies'],
            ].map(([browser, path]) => (
              <li key={browser} className="flex items-start gap-2 text-sm">
                <span style={{ color: '#7cc6ff' }} className="flex-shrink-0">–</span>
                <span><strong style={{ color: '#dfe7ff' }}>{browser}:</strong> {path}</span>
              </li>
            ))}
          </ul>
          <P>
            Note: disabling strictly necessary cookies will break authentication and prevent you from logging in.
          </P>
        </Section>

        <Section title="5. Withdrawing consent">
          <P>
            Where you have given consent for optional cookies, you may withdraw it at any time. Withdrawal of consent
            does not affect the lawfulness of processing based on consent before its withdrawal. To withdraw, use the
            cookie preference panel or contact us at privacy@gradevaultai.com.
          </P>
        </Section>

        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: '#9fb0ff' }}>
            Questions? <a href="mailto:privacy@gradevaultai.com" style={{ color: '#7cc6ff' }}>privacy@gradevaultai.com</a>
            {' · '}
            <Link href="/privacy" style={{ color: '#7cc6ff' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
