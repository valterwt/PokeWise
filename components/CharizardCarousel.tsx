'use client'

// Top 15 most iconic Pokémon TCG cards — all URLs verified against pokemontcg.io
// Image format: https://images.pokemontcg.io/{setId}/{number}_hires.png
const cards = [
  // ── Vintage Era ─────────────────────────────────────────────────────────────
  { src: 'https://images.pokemontcg.io/base1/4_hires.png',    label: 'Charizard',           set: 'Base Set · #4/102 · 1999' },
  { src: 'https://images.pokemontcg.io/base1/2_hires.png',    label: 'Blastoise',           set: 'Base Set · #2/102 · 1999' },
  { src: 'https://images.pokemontcg.io/base1/10_hires.png',   label: 'Mewtwo',              set: 'Base Set · #10/102 · 1999' },
  { src: 'https://images.pokemontcg.io/base5/83_hires.png',   label: 'Dark Raichu',         set: 'Team Rocket · #83/82 · 2000' },
  { src: 'https://images.pokemontcg.io/neo1/9_hires.png',     label: 'Lugia',               set: 'Neo Genesis · #9/111 · 2000' },
  { src: 'https://images.pokemontcg.io/neo4/107_hires.png',   label: 'Shining Charizard',   set: 'Neo Destiny · #107/105 · 2002' },
  { src: 'https://images.pokemontcg.io/ex16/100_hires.png',   label: 'Charizard Gold Star', set: 'EX Dragon Frontiers · #100/101 · 2006' },
  { src: 'https://images.pokemontcg.io/pop5/17_hires.png',    label: 'Umbreon Gold Star',   set: 'POP Series 5 · #17/17 · 2007' },
  // ── Middle Era ──────────────────────────────────────────────────────────────
  { src: 'https://images.pokemontcg.io/xy12/11_hires.png',    label: 'Charizard',           set: 'XY Evolutions · #11/108 · 2016' },
  // ── Modern Era ──────────────────────────────────────────────────────────────
  { src: 'https://images.pokemontcg.io/swsh7/215_hires.png',  label: 'Umbreon VMAX',        set: 'Evolving Skies · #215/203 · 2021' },
  { src: 'https://images.pokemontcg.io/swsh8/271_hires.png',  label: 'Gengar VMAX',         set: 'Fusion Strike · #271/264 · 2021' },
  { src: 'https://images.pokemontcg.io/swsh9/174_hires.png',  label: 'Charizard VSTAR',     set: 'Brilliant Stars · #174/172 · 2022' },
  { src: 'https://images.pokemontcg.io/swsh12/186_hires.png', label: 'Lugia V',             set: 'Silver Tempest · #186/195 · 2022' },
  { src: 'https://images.pokemontcg.io/ex8/107_hires.png',    label: 'Rayquaza Gold Star',  set: 'EX Deoxys · #107/107 · 2005' },
  { src: 'https://images.pokemontcg.io/sv4pt5/234_hires.png', label: 'Charizard ex SIR',    set: 'Paldean Fates · #234/91 · 2024' },
]

// 2× duplication: animation shifts exactly -50% → seamless perfect loop
const track = [...cards, ...cards]

export default function CharizardCarousel() {
  return (
    <section className="py-20 overflow-hidden relative">
      {/* Entry barriers — wide gradient portals on each side */}
      <div className="absolute inset-y-0 left-0 w-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0b0f1e 30%, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0b0f1e 30%, transparent)' }} />

      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-black text-[#dfe7ff] mb-3">
          Some Iconic Pokémon Cards
        </h2>
        <p className="text-[#9fb0ff] text-lg">15 legendary cards spanning 25 years of the hobby</p>
      </div>

      {/* Carousel track — 2× duplicated so shifting -50% loops back to start */}
      <div className="flex carousel-track gap-6" style={{ width: 'max-content' }}>
        {track.map((card, i) => (
          <div key={i} className="flex-shrink-0 w-[22rem] group cursor-pointer">
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
                <div className="relative w-full aspect-[3/4] bg-[#0d1120]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.label}
                    className="w-full h-full object-contain object-center"
                    style={{ imageRendering: 'auto' }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement!
                      parent.style.background = 'linear-gradient(135deg, #1a1f35, #0e1223)'
                      parent.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center"><div style="font-size:4rem">✨</div><div style="font-size:14px;color:#9fb0ff;font-weight:600">${card.label}</div><div style="font-size:12px;color:rgba(159,176,255,0.5)">${card.set}</div></div>`
                    }}
                  />
                </div>

                {/* Card title */}
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
