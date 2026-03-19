import GradeVaultLogo from '@/components/GradeVaultLogo'
import RawToMintLogo from '@/components/RawToMintLogo'

export default function BrandPage() {
  return (
    <div className="min-h-screen px-6 py-16" style={{ color: '#dfe7ff' }}>
      <div className="max-w-4xl mx-auto space-y-20">

        {/* ── GradeVaultAI ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: 'rgba(159,176,255,0.4)' }}>
            GradeVaultAI — App Logo
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
              <div
                key={sz}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl"
                style={{ background: 'rgba(19,23,41,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <GradeVaultLogo size={sz} showText={sz !== 'sm'} />
                <span className="text-xs" style={{ color: 'rgba(159,176,255,0.4)' }}>{sz}</span>
              </div>
            ))}
          </div>

          {/* Icon-only on dark + light */}
          <div className="flex gap-4">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <GradeVaultLogo size="md" showText={false} />
            </div>
            <div
              className="flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{ background: '#f5f5f5' }}
            >
              <GradeVaultLogo size="md" showText={false} />
            </div>
          </div>
        </section>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ── rawtomint ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: 'rgba(159,176,255,0.4)' }}>
            @rawtomint — TikTok Channel Logo
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
              <div
                key={sz}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl"
                style={{ background: 'rgba(10,14,22,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <RawToMintLogo size={sz} showText={sz !== 'sm'} />
                <span className="text-xs" style={{ color: 'rgba(159,176,255,0.4)' }}>{sz}</span>
              </div>
            ))}
          </div>

          {/* Square TikTok profile preview */}
          <div className="flex flex-wrap gap-6 items-end">
            {/* Dark bg — profile pic simulation */}
            <div
              className="flex items-center justify-center rounded-full overflow-hidden"
              style={{
                width: 100,
                height: 100,
                background: 'linear-gradient(135deg, #0e1222 60%, #141a2e)',
                border: '2px solid rgba(45,212,160,0.35)',
                boxShadow: '0 0 24px rgba(45,212,160,0.2)',
              }}
            >
              <RawToMintLogo size="md" showText={false} />
            </div>

            {/* Banner strip */}
            <div
              className="flex items-center justify-center px-8 py-5 rounded-2xl"
              style={{
                background: 'linear-gradient(120deg, #0e1222 40%, #0f1f18)',
                border: '1px solid rgba(45,212,160,0.2)',
                boxShadow: '0 0 40px rgba(45,212,160,0.1)',
                minWidth: 280,
              }}
            >
              <RawToMintLogo size="lg" />
            </div>

            {/* Text labels */}
            <div className="text-xs space-y-1" style={{ color: 'rgba(159,176,255,0.4)' }}>
              <div>↑ profile pic (100px circle)</div>
              <div>↑ channel banner strip</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
