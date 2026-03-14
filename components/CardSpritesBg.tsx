'use client'

import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// Set SPRITE_SHEET_URL to your Bubble-hosted sprite sheet (or any publicly
// accessible PNG of card sprites on a white/solid background).
// Example: "https://yourapp.bubbleapps.io/version-test/…/Sprites.png"
// ─────────────────────────────────────────────────────────────────────────────
const SPRITE_SHEET_URL = '' // ← paste your sprite sheet URL here

const MAX_COMPONENTS  = 120
const COUNT_MOVERS    = 28
const PAD             = 24
const SPEED_MIN       = 24
const SPEED_MAX       = 60
const AREA_THRESHOLD  = 150
const WHITE_THRESH    = 245

type Sprite = { url: string; w: number; h: number }

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

async function segmentSprites(url: string): Promise<Sprite[]> {
  const img = await loadImage(url)
  const w = img.naturalWidth, h = img.naturalHeight
  const can = document.createElement('canvas')
  can.width = w; can.height = h
  const ctx = can.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, w, h)

  const mask    = new Uint8Array(w * h)
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    mask[p] = (r > WHITE_THRESH && g > WHITE_THRESH && b > WHITE_THRESH) ? 0 : 1
  }

  const visited = new Uint8Array(w * h)
  const sprites: Array<{ x: number; y: number; w: number; h: number }> = []
  const stack: number[] = []
  const idx  = (x: number, y: number) => y * w + x
  const dirs: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]]

  outer:
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = idx(x, y)
      if (!mask[p] || visited[p]) continue
      let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1, count = 0
      stack.length = 0
      stack.push(p); visited[p] = 1
      while (stack.length) {
        const q  = stack.pop()!
        const qx = q % w, qy = (q - qx) / w
        count++
        if (qx < minx) minx = qx; if (qx > maxx) maxx = qx
        if (qy < miny) miny = qy; if (qy > maxy) maxy = qy
        for (const [dx, dy] of dirs) {
          const nx = qx + dx, ny = qy + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          const np = idx(nx, ny)
          if (mask[np] && !visited[np]) { visited[np] = 1; stack.push(np) }
        }
      }
      if (count >= AREA_THRESHOLD) {
        sprites.push({ x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1 })
        if (sprites.length >= MAX_COMPONENTS) break outer
      }
    }
  }

  const sheet = document.createElement('canvas')
  sheet.width = w; sheet.height = h
  sheet.getContext('2d')!.drawImage(img, 0, 0)
  const results: Sprite[] = []
  const MAX_SIDE = 64

  for (const box of sprites) {
    const c = document.createElement('canvas')
    c.width = box.w; c.height = box.h
    const cx = c.getContext('2d')!
    cx.drawImage(sheet, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h)
    const id = cx.getImageData(0, 0, box.w, box.h)
    const d  = id.data
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > WHITE_THRESH && d[i+1] > WHITE_THRESH && d[i+2] > WHITE_THRESH) d[i+3] = 0
    }
    cx.putImageData(id, 0, 0)
    let tw = box.w, th = box.h
    const scale = Math.min(1, MAX_SIDE / Math.max(tw, th))
    let outCanvas = c
    if (scale < 1) {
      tw = Math.max(1, Math.round(tw * scale))
      th = Math.max(1, Math.round(th * scale))
      outCanvas = document.createElement('canvas')
      outCanvas.width = tw; outCanvas.height = th
      const oc = outCanvas.getContext('2d')!
      oc.imageSmoothingEnabled = false
      oc.drawImage(c, 0, 0, tw, th)
    }
    results.push({ url: outCanvas.toDataURL('image/png'), w: tw, h: th })
  }
  return results
}

function animateSprites(target: HTMLElement, sprites: Sprite[], count = COUNT_MOVERS) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const movers: Array<{ el: HTMLImageElement; state: { x: number; y: number; vx: number; vy: number; speed: number } }> = []
  const rand = (a: number, b: number) => a + Math.random() * (b - a)

  function spawnOne() {
    const s  = sprites[Math.floor(Math.random() * sprites.length)]
    const img = document.createElement('img')
    img.src = s.url; img.width = s.w; img.height = s.h
    img.style.cssText = `position:absolute;image-rendering:pixelated;will-change:transform;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5)) brightness(0.85) saturate(1.2);`
    target.appendChild(img)
    const state = {
      x:     rand(PAD, innerWidth  - PAD - s.w),
      y:     rand(PAD, innerHeight - PAD - s.h),
      vx:    Math.random() < 0.5 ? 1 : -1,
      vy:    rand(-0.6, 0.6),
      speed: rand(SPEED_MIN, SPEED_MAX),
    }
    img.style.transform = `translate(${state.x}px, ${state.y}px)`
    movers.push({ el: img, state })
  }

  const n = Math.min(count, sprites.length)
  for (let i = 0; i < n; i++) spawnOne()

  let last = performance.now()
  function tick(now: number) {
    const dt = Math.min(64, now - last) / 1000
    last = now
    for (const m of movers) {
      const { el, state } = m
      if (Math.random() < 0.012) { state.vx += rand(-0.7, 0.7); state.vy += rand(-0.6, 0.6) }
      const mag = Math.hypot(state.vx, state.vy) || 1
      const vx = state.vx / mag, vy = state.vy / mag
      state.x += vx * state.speed * dt
      state.y += vy * state.speed * dt
      const maxX = innerWidth  - PAD - el.width
      const maxY = innerHeight - PAD - el.height
      if (state.x <= PAD)  { state.x  = PAD;  state.vx =  Math.abs(state.vx) }
      if (state.x >= maxX) { state.x  = maxX; state.vx = -Math.abs(state.vx) }
      if (state.y <= PAD)  { state.y  = PAD;  state.vy =  Math.abs(state.vy) }
      if (state.y >= maxY) { state.y  = maxY; state.vy = -Math.abs(state.vy) }
      el.style.transform = `translate(${state.x}px, ${state.y}px)`
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

export default function CardSpritesBg() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!SPRITE_SHEET_URL || !bgRef.current) return
    const root = bgRef.current
    segmentSprites(SPRITE_SHEET_URL)
      .then(sprites => animateSprites(root, sprites, COUNT_MOVERS))
      .catch(err => console.error('CardSpritesBg: sprite extraction failed', err))
  }, [])

  return (
    <div
      ref={bgRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'radial-gradient(120% 140% at 50% 0%, #131729 0%, #0e1223 55%, #0b0f1e 100%)',
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
          'radial-gradient(1200px 800px at 50% -200px, rgba(124,198,255,.09), transparent 60%)',
          'radial-gradient(120% 140% at 50% 0%, #131729 0%, #0e1223 55%, #0b0f1e 100%)',
        ].join(','),
        backgroundSize: '24px 24px, 24px 24px, auto, auto',
      }}
    />
  )
}
