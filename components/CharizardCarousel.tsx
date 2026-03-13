'use client'

// Charizard card images — save these to /public/cards/ with matching filenames:
//   charizard-1.jpg  → 1999 Base Set Holo (PSA 10)
//   charizard-2.jpg  → 2004 Charizard EX Holo Fire Red Leaf Green (PSA 10)
//   charizard-3.jpg  → 2006 Gold Star EX Dragon Frontiers (PSA 10)
//   charizard-4.jpg  → 2014 M Charizard EX Flashfire (PSA 10)
//   charizard-5.jpg  → 2024 Charizard ex PAF Special Illustration Rare (PSA 9)

const cards = [
  {
    src: '/cards/charizard-1.jpg.webp',
    label: '1999 Base Set Holo',
    grade: 'PSA 10',
    set: '#4/102',
  },
  {
    src: '/cards/charizard-2.jpg.webp',
    label: '2004 Charizard ex Holo',
    grade: 'PSA 10',
    set: 'Fire Red Leaf Green #105',
  },
  {
    src: '/cards/charizard-3.jpg.webp',
    label: '2006 Gold Star Holo',
    grade: 'PSA 10',
    set: 'EX Dragon Frontiers #100',
  },
  {
    src: '/cards/charizard-4.jpg.webp',
    label: '2014 M Charizard EX',
    grade: 'PSA 10',
    set: 'Flashfire #69',
  },
  {
    src: '/cards/charizard-5.jpg.webp',
    label: '2024 Charizard ex SIR',
    grade: 'PSA 9',
    set: 'PAF EN #234',
  },
]

// Duplicate for a seamless infinite loop
const track = [...cards, ...cards]

export default function CharizardCarousel() {
  return (
    <section className="py-20 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0b0f1e, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0b0f1e, transparent)' }} />

      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-black text-[#dfe7ff] mb-3">
          Iconic Charizard Cards
        </h2>
        <p className="text-[#9fb0ff] text-lg">25 years of the most graded card in the hobby</p>
      </div>

      {/* Carousel track — no padding so cards extend to full width */}
      <div className="flex carousel-track gap-6" style={{ width: 'max-content' }}>
        {track.map((card, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-52 group cursor-pointer"
          >
            {/* PSA slab outer shell */}
            <div
              className="rounded-2xl p-[3px] transition-transform duration-300 group-hover:-translate-y-3 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(124,198,255,0.5), rgba(167,139,250,0.3), rgba(124,198,255,0.15))',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
              }}
            >
              <div
                className="rounded-[14px] overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #1a2040 0%, #111828 100%)' }}
              >
                {/* PSA label bar */}
                <div className="px-3 py-1.5 flex justify-between items-center"
                  style={{ background: 'rgba(124,198,255,0.08)', borderBottom: '1px solid rgba(124,198,255,0.12)' }}>
                  <span className="text-[10px] font-bold text-[#7cc6ff] tracking-widest uppercase">PSA</span>
                  <span className="text-[10px] font-black text-[#fbbf24]">{card.grade}</span>
                </div>

                {/* Card image */}
                <div className="relative w-full aspect-[2.5/3.5] bg-[#0d1120]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.label}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
                    onError={(e) => {
                      // Fallback placeholder when image isn't added yet
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement!
                      parent.style.background = 'linear-gradient(135deg, #1a1f35, #0e1223)'
                      parent.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;text-align:center"><div style="font-size:2.5rem">🔥</div><div style="font-size:11px;color:#9fb0ff;font-weight:600">${card.label}</div><div style="font-size:10px;color:rgba(159,176,255,0.5)">${card.set}</div></div>`
                    }}
                  />
                </div>

                {/* Card footer */}
                <div className="px-3 py-2">
                  <div className="text-[11px] font-bold text-[#dfe7ff] leading-tight truncate">{card.label}</div>
                  <div className="text-[10px] text-[#9fb0ff] mt-0.5 truncate">{card.set}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
