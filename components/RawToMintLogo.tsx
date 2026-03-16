interface RawToMintLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizes = {
  sm: { icon: 22, textClass: 'text-base',  gap: 'gap-2'   },
  md: { icon: 32, textClass: 'text-2xl',   gap: 'gap-2.5' },
  lg: { icon: 48, textClass: 'text-4xl',   gap: 'gap-3'   },
  xl: { icon: 76, textClass: 'text-[4rem]', gap: 'gap-4'  },
}

export default function RawToMintLogo({ size = 'md', showText = true, className = '' }: RawToMintLogoProps) {
  const s = sizes[size]

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {/* Split-card icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Raw side – warm amber glow */}
          <radialGradient id="rawGlow" cx="30%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#c8956a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c8956a" stopOpacity="0" />
          </radialGradient>
          {/* Mint side – emerald glow */}
          <radialGradient id="mintGlow" cx="70%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#2dd4a0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2dd4a0" stopOpacity="0" />
          </radialGradient>
          {/* Card fill – raw half */}
          <linearGradient id="rawFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8956a" />
            <stop offset="100%" stopColor="#9a6a3e" />
          </linearGradient>
          {/* Card fill – mint half */}
          <linearGradient id="mintFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4a0" />
            <stop offset="100%" stopColor="#12a878" />
          </linearGradient>
          {/* Rim: raw → mint gradient */}
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#c8956a" />
            <stop offset="50%"  stopColor="#e8e0d0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2dd4a0" />
          </linearGradient>
          {/* Glow filter for sparkles */}
          <filter id="sparkleGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Card clip paths */}
          <clipPath id="leftCard">
            <polygon points="4,3 19,3 10,29 4,29" />
          </clipPath>
          <clipPath id="rightCard">
            <polygon points="19,3 28,3 28,29 10,29" />
          </clipPath>
          <clipPath id="fullCard">
            <rect x="4" y="3" width="24" height="26" rx="2.5" ry="2.5" />
          </clipPath>
        </defs>

        {/* Ambient glows */}
        <circle cx="10" cy="16" r="12" fill="url(#rawGlow)" />
        <circle cx="22" cy="16" r="12" fill="url(#mintGlow)" />

        {/* Card base – raw (amber) left half */}
        <rect x="4" y="3" width="24" height="26" rx="2.5" fill="url(#rawFill)" clipPath="url(#leftCard)" />

        {/* Card base – mint (green) right half */}
        <rect x="4" y="3" width="24" height="26" rx="2.5" fill="url(#mintFill)" clipPath="url(#rightCard)" />

        {/* Subtle worn texture lines on raw side */}
        <g clipPath="url(#leftCard)" opacity="0.18">
          <line x1="4" y1="9"  x2="19" y2="9"  stroke="#6b3e18" strokeWidth="0.6" />
          <line x1="4" y1="15" x2="16" y2="15" stroke="#6b3e18" strokeWidth="0.5" />
          <line x1="4" y1="21" x2="14" y2="21" stroke="#6b3e18" strokeWidth="0.5" />
          <line x1="4" y1="26" x2="11" y2="26" stroke="#6b3e18" strokeWidth="0.4" />
        </g>

        {/* Sheen highlight on mint side */}
        <rect
          x="4" y="3" width="24" height="26" rx="2.5"
          fill="rgba(255,255,255,0.1)"
          clipPath="url(#rightCard)"
        />

        {/* Card border */}
        <rect
          x="4" y="3" width="24" height="26" rx="2.5"
          fill="none"
          stroke="url(#rimGrad)"
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Diagonal split line */}
        <line
          x1="19" y1="3" x2="10" y2="29"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.8"
        />

        {/* Arrow on the split – pointing right (raw→mint) */}
        <path
          d="M14 13.5 L18.5 16 L14 18.5"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Sparkle stars on mint side */}
        <g filter="url(#sparkleGlow)">
          {/* 4-point sparkle */}
          <path
            d="M24 7 L24.5 8.5 L26 9 L24.5 9.5 L24 11 L23.5 9.5 L22 9 L23.5 8.5 Z"
            fill="#2dd4a0"
            opacity="0.95"
          />
          {/* small dot sparkle */}
          <circle cx="22" cy="14" r="0.7" fill="#2dd4a0" opacity="0.8" />
          <circle cx="26" cy="20" r="0.5" fill="#a8f0d8" opacity="0.7" />
          {/* tiny sparkle */}
          <path
            d="M25 23 L25.25 23.75 L26 24 L25.25 24.25 L25 25 L24.75 24.25 L24 24 L24.75 23.75 Z"
            fill="#2dd4a0"
            opacity="0.75"
          />
        </g>
      </svg>

      {showText && (
        <span
          className={`font-black leading-none tracking-tight ${s.textClass}`}
          style={{ fontFamily: 'inherit' }}
        >
          <span style={{ color: '#c8956a' }}>raw</span>
          <span style={{ color: 'rgba(220,215,205,0.55)', fontWeight: 400, fontSize: '0.6em', verticalAlign: 'middle', padding: '0 0.15em' }}>to</span>
          <span style={{ color: '#2dd4a0' }}>mint</span>
        </span>
      )}
    </span>
  )
}
