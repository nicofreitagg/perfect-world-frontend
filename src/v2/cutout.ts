import { useEffect, useState } from 'react'

// Shopify product photos sit on a white studio background. In the browser, the white that touches the
// edge of the photo is flooded out to transparent, so the garment stands on the page itself (16 Oct).
// Light garments stay: only near-pure white connected to the border is removed, and the outline is feathered.
const cache = new Map<string, Promise<string>>()
const MAX = 900

function cut(url: string): Promise<string> {
  const hit = cache.get(url)
  if (hit) return hit
  const job = new Promise<string>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => {
      try {
        const k = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
        const w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k))
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        const g = c.getContext('2d', { willReadFrequently: true })
        if (!g) return resolve('')
        g.drawImage(img, 0, 0, w, h)
        const im = g.getImageData(0, 0, w, h), d = im.data
        const white = (i: number) => {
          const r = d[i], gg = d[i + 1], b = d[i + 2]
          const mn = Math.min(r, gg, b), mx = Math.max(r, gg, b)
          return mn > 232 && mx - mn < 14
        }
        // Already transparent (a cut-out PNG): leave it alone.
        if (d[3] < 250) return resolve('')
        // Strict mode matches only the studio background's own colour (sampled at the corners), so a white
        // garment with its soft shading stays (Nico, 16 Oct: the white tee showed as a glowing box).
        const cs = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4]
        const ref = [0, 1, 2].map((k) => Math.round(cs.reduce((t, i) => t + d[i + k], 0) / 4))
        const strict = (i: number) => Math.abs(d[i] - ref[0]) <= 3 && Math.abs(d[i + 1] - ref[1]) <= 3 && Math.abs(d[i + 2] - ref[2]) <= 3
        const flood = (isBg: (i: number) => boolean, pockets: boolean) => {
          const bg = new Uint8Array(w * h)
          const stack: number[] = []
          const push = (x: number, y: number) => { const p = y * w + x; if (!bg[p] && isBg(p * 4)) { bg[p] = 1; stack.push(p) } }
          for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
          for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
          while (stack.length) {
            const p = stack.pop()!, x = p % w, y = (p - x) / w
            if (x > 0) push(x - 1, y)
            if (x < w - 1) push(x + 1, y)
            if (y > 0) push(x, y - 1)
            if (y < h - 1) push(x, y + 1)
          }
          if (!pockets) return bg
          // Closed gaps (inside a tote handle, between arm and body): large, flat, pure-white pockets are background too.
          // Printed white has texture and sits below this, so designs stay.
          const pure = (i: number) => d[i] >= 248 && d[i + 1] >= 248 && d[i + 2] >= 248
          const seen = new Uint8Array(w * h)
          for (let s0 = 0; s0 < w * h; s0++) {
            if (bg[s0] || seen[s0] || !pure(s0 * 4)) continue
            const region: number[] = [s0]
            seen[s0] = 1
            for (let k = 0; k < region.length; k++) {
              const p = region[k], x = p % w, y = (p - x) / w
              const nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1]
              for (const q of nb) if (q >= 0 && !seen[q] && !bg[q] && pure(q * 4)) { seen[q] = 1; region.push(q) }
            }
            // A flat white print in the middle of the garment (the OG polar bear, Nico 16 Oct) is not a gap: skip pockets centred there.
            let sx = 0, sy = 0
            for (const p of region) { sx += p % w; sy += (p - (p % w)) / w }
            const cx = sx / region.length / w, cy = sy / region.length / h
            const inPrint = cx > 0.3 && cx < 0.7 && cy > 0.25 && cy < 0.8
            if (region.length > w * h * 0.004 && !inPrint) for (const p of region) bg[p] = 1
          }
          return bg
        }
        const count = (bg: Uint8Array) => { let n = 0; for (let p = 0; p < bg.length; p++) n += bg[p]; return n }
        // How much of the middle of the photo was removed: a lot means the garment went with the background.
        const midGone = (bg: Uint8Array) => {
          let mid = 0, midN = 0
          for (let y = Math.round(h * 0.3); y < h * 0.7; y += 2) for (let x = Math.round(w * 0.3); x < w * 0.7; x += 2) { midN++; mid += bg[y * w + x] }
          return mid > midN * 0.25
        }
        // Studio photos have a flat background: match its exact colour first, so light garments keep clean edges
        // (Nico, 16 Oct: a white tee came out ragged when near-white fabric was eaten in patches).
        let bg = flood(strict, true)
        if (count(bg) >= w * h * 0.12) {
          // Then take two more rings of near-white anti-aliasing, so dark garments get no light halo.
          for (let ring = 0; ring < 2; ring++) {
            const add: number[] = []
            for (let p = 0; p < bg.length; p++) {
              if (bg[p] || !white(p * 4)) continue
              const x = p % w
              if ((x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (p >= w && bg[p - w]) || (p < bg.length - w && bg[p + w])) add.push(p)
            }
            for (const p of add) bg[p] = 1
          }
        } else {
          // Not a flat background: fall back to the looser near-white flood.
          bg = flood(white, true)
          // Hardly any background found: not a studio photo (a lifestyle shot), keep the original.
          if (count(bg) < w * h * 0.12 || midGone(bg)) return resolve('')
        }
        if (midGone(bg)) return resolve('')
        // Clean outline (Nico 16 Oct: light shirts showed a ragged, whitish rim and white flecks). Pixels near the
        // edge are part garment, part white studio light. Each one takes the colour of the fabric just inside it,
        // and its opacity from how far it is from white towards that fabric colour.
        const RIM = 6, dist = new Uint8Array(w * h)
        let ring: number[] = []
        for (let p = 0; p < bg.length; p++) {
          if (bg[p]) continue
          const x = p % w
          if ((x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (p >= w && bg[p - w]) || (p < bg.length - w && bg[p + w])) { dist[p] = 1; ring.push(p) }
        }
        const rims: number[] = [...ring]
        for (let r = 2; r <= RIM + 3; r++) {
          const next: number[] = []
          for (const p of ring) {
            const x = p % w
            for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
              if (q < 0 || q >= bg.length || bg[q] || dist[q]) continue
              dist[q] = r; next.push(q)
            }
          }
          if (r <= RIM) rims.push(...next)
          ring = next
        }
        const fix: [number, number, number, number, number][] = []
        for (const p of rims) {
          const x = p % w, y = (p - x) / w
          let fr = 0, fg = 0, fb = 0, n = 0
          for (let dy = -9; dy <= 9; dy += 2) for (let dx = -9; dx <= 9; dx += 2) {
            const xx = x + dx, yy = y + dy
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
            const q = yy * w + xx
            if (bg[q] || dist[q] <= RIM) continue
            fr += d[q * 4]; fg += d[q * 4 + 1]; fb += d[q * 4 + 2]; n++
          }
          const i = p * 4
          if (!n) { fix.push([p, d[i], d[i + 1], d[i + 2], dist[p] === 1 ? 140 : 255]); continue }
          fr /= n; fg /= n; fb /= n
          const span = 255 - Math.min(fr, fg, fb)
          // White fabric can't be told apart from the white studio: keep it, only soften the outer pixel.
          if (span < 14) { fix.push([p, d[i], d[i + 1], d[i + 2], dist[p] === 1 ? 170 : 255]); continue }
          const ch = fr <= fg && fr <= fb ? 0 : fg <= fb ? 1 : 2
          const a = Math.max(0, Math.min(1, (255 - d[i + ch]) / span))
          // Solid fabric keeps its own pixel (seams, shading); only the see-through rim takes the inside colour.
          if (a > 0.97) fix.push([p, d[i], d[i + 1], d[i + 2], 255])
          else fix.push([p, fr, fg, fb, Math.round(a * 255)])
        }
        for (let p = 0; p < bg.length; p++) if (bg[p]) d[p * 4 + 3] = 0
        for (const [p, r, gg, b, a] of fix) { const i = p * 4; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = a }
        g.putImageData(im, 0, 0)
        c.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : ''), 'image/png')
      } catch {
        resolve('')
      }
    }
    img.onerror = () => resolve('')
    // Shopify serves a smaller copy on request, which keeps the work light.
    img.src = /cdn\.shopify\.com|myshopify/.test(url) && !/[?&]width=/.test(url) ? url + (url.includes('?') ? '&' : '?') + 'width=' + MAX : url
  })
  cache.set(url, job)
  return job
}

/** The cut-out version of a product photo, or '' while working or when it can't be cut. */
export function useCutout(url?: string) {
  const [out, setOut] = useState<{ url: string; cut: string }>({ url: '', cut: '' })
  useEffect(() => {
    if (!url) return
    let live = true
    cut(url).then((c) => { if (live) setOut({ url, cut: c }) })
    return () => { live = false }
  }, [url])
  return out.url === url ? out.cut : ''
}

/** Start cutting a photo ahead of time (for example when the pointer nears a colour dot). */
export function precut(url: string) { void cut(url) }
