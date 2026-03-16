interface GradeVaultLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizes = {
  sm: { bolt: 20, textClass: 'text-lg', gap: 'gap-1.5' },
  md: { bolt: 28, textClass: 'text-2xl', gap: 'gap-2' },
  lg: { bolt: 44, textClass: 'text-4xl', gap: 'gap-3' },
  xl: { bolt: 72, textClass: 'text-6xl', gap: 'gap-4' },
}

export default function GradeVaultLogo({ size = 'md', showText = true, className = '' }: GradeVaultLogoProps) {
  const s = sizes[size]

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {/* Lightning bolt SVG */}
      <svg
        width={s.bolt}
        height={s.bolt}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <radialGradient id="boltGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7cc6ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="boltFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="60%" stopColor="#ffb800" />
            <stop offset="100%" stopColor="#e69500" />
          </linearGradient>
          <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7cc6ff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="outerGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow circle */}
        <circle cx="16" cy="16" r="14" fill="url(#boltGlow)" />

        {/* Rim ring with gradient */}
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="url(#rimGlow)"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* Lightning bolt shape */}
        <path
          d="M18.5 3L8 18h8.5L13.5 29L24 14h-8.5L18.5 3Z"
          fill="url(#boltFill)"
          filter="url(#glow)"
        />

        {/* Inner highlight on bolt */}
        <path
          d="M17 6L9.5 17.5h7L13.8 26.5l8.5-13h-7.5L17 6Z"
          fill="rgba(255,240,160,0.4)"
        />
      </svg>

      {showText && (
        <span
          className={`font-black leading-none tracking-tight ${s.textClass}`}
          style={{ fontFamily: 'inherit' }}
        >
          <span style={{ color: '#dfe7ff' }}>Grade</span>
          <span style={{ color: '#ffd700' }}>Vault</span>
        </span>
      )}
    </span>
  )
}
