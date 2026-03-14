'use client'

const cards = [
  { src: 'https://images.pokemontcg.io/base1/4_hires.png', label: '1999 Base Set Holo', set: '#4/102' },
  { src: 'https://images.pokemontcg.io/ex7/105_hires.png', label: '2004 Charizard ex Holo', set: 'Fire Red Leaf Green #105' },
  { src: 'https://images.pokemontcg.io/ex16/100_hires.png', label: '2006 Gold Star Holo', set: 'EX Dragon Frontiers #100' },
  { src: 'https://images.pokemontcg.io/xy2/69_hires.png', label: '2014 M Charizard EX', set: 'Flashfire #69' },
  { src: 'https://images.pokemontcg.io/sv4pt5/234_hires.png', label: '2024 Charizard ex SIR', set: 'PAF EN #234' },
]

// 2× duplication: animation shifts exactly -50% → seamless perfect loop
const track = [...cards, ...cards]

export default function CharizardCarousel() {
  return (
    <section className="py-20 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0b0f1e, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0b0f1e, transparent)' }} />

      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-black text-[#dfe7ff] mb-3">
          Iconic Charizard Cards
        </h2>
        <p className="text-[#9fb0ff] text-lg">25 years of the most graded card in the hobby</p>
      </div>

      {/* Carousel track — 2× duplicated so shifting -50% loops back to start */}
      <div className="flex carousel-track gap-6" style={{ width: 'max-content' }}>
        {track.map((card, i) => (
          <div key={i} className="flex-shrink-0 w-[26rem] group cursor-pointer">
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
                {/* Card image — object-contain so full slab (PSA label included) always shows */}
                <div className="relative w-full aspect-[3/4] bg-[#0d1120]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.label}
                    className="w-full h-full object-contain object-top"
                    style={{ imageRendering: 'auto' }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement!
                      parent.style.background = 'linear-gradient(135deg, #1a1f35, #0e1223)'
                      parent.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center"><div style="font-size:4rem">🔥</div><div style="font-size:14px;color:#9fb0ff;font-weight:600">${card.label}</div><div style="font-size:12px;color:rgba(159,176,255,0.5)">${card.set}</div></div>`
                    }}
                  />
                </div>

                {/* Card footer */}
                <div className="px-4 py-3">
                  <div className="text-sm font-bold text-[#dfe7ff] leading-tight truncate">{card.label}</div>
                  <div className="text-xs text-[#9fb0ff] mt-1 truncate">{card.set}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
