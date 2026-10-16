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
        const bg = new Uint8Array(w * h)
        const stack: number[] = []
        const push = (x: number, y: number) => { const p = y * w + x; if (!bg[p] && white(p * 4)) { bg[p] = 1; stack.push(p) } }
        for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
        for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
        while (stack.length) {
          const p = stack.pop()!, x = p % w, y = (p - x) / w
          if (x > 0) push(x - 1, y)
          if (x < w - 1) push(x + 1, y)
          if (y > 0) push(x, y - 1)
          if (y < h - 1) push(x, y + 1)
        }
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
          if (region.length > w * h * 0.004) for (const p of region) bg[p] = 1
        }
        // Hardly any background found: not a studio photo (a lifestyle shot), keep the original.
        let n = 0
        for (let p = 0; p < bg.length; p++) n += bg[p]
        if (n < w * h * 0.12) return resolve('')
        // A white or very light garment floods away with its background (Nico, 16 Oct: the white tee vanished).
        // If most of the middle of the photo was removed, keep the original photo instead.
        let mid = 0, midN = 0
        for (let y = Math.round(h * 0.3); y < h * 0.7; y += 2) for (let x = Math.round(w * 0.3); x < w * 0.7; x += 2) { midN++; mid += bg[y * w + x] }
        if (mid > midN * 0.25) return resolve('')
        for (let p = 0; p < bg.length; p++) {
          if (bg[p]) { d[p * 4 + 3] = 0; continue }
          const x = p % w, y = (p - x) / w
          const edge = (x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (y > 0 && bg[p - w]) || (y < h - 1 && bg[p + w])
          if (edge) {
            const i = p * 4, mn = Math.min(d[i], d[i + 1], d[i + 2])
            d[i + 3] = Math.max(60, Math.min(255, (255 - mn) * 6))
          }
        }
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
