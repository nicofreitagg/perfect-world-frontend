import { useEffect, useState } from 'react'

// Minimal listings have two photos per colour: the front (a small logo) and the back
// (the design), but not always in the same order in Shopify. The back has far more
// print in the middle of the garment, so a tiny copy of each photo is scored for how
// much the centre varies, and the busier one is treated as the design side.
const scores = new Map<string, Promise<number>>()

const small = (url: string) => url + (url.includes('?') ? '&' : '?') + 'width=96'

export function inkScore(url: string): Promise<number> {
  const hit = scores.get(url)
  if (hit) return hit
  const job = new Promise<number>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const w = 48, h = 60
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        const g = c.getContext('2d', { willReadFrequently: true })
        if (!g) return resolve(0)
        g.drawImage(img, 0, 0, w, h)
        // Chest/back area: the middle of the garment, away from the sleeves and hem.
        const d = g.getImageData(Math.round(w * 0.28), Math.round(h * 0.22), Math.round(w * 0.44), Math.round(h * 0.42)).data
        let n = 0, sum = 0, sq = 0
        for (let i = 0; i < d.length; i += 4) {
          const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
          sum += y; sq += y * y; n++
        }
        const mean = sum / n
        resolve(Math.sqrt(Math.max(0, sq / n - mean * mean)))
      } catch {
        resolve(0)
      }
    }
    img.onerror = () => resolve(0)
    img.src = small(url)
  })
  scores.set(url, job)
  return job
}

// Filenames sometimes say which side it is; that wins over the score.
const named = (url: string) => /back|hinten|rueck|rück/i.test(url) ? 1 : /front|vorne/i.test(url) ? -1 : 0

// Returns [design, front] for two photos of the same colour.
export async function orderPair(a: string, b: string): Promise<[string, string]> {
  const na = named(a), nb = named(b)
  if (na !== nb) return na > nb ? [a, b] : [b, a]
  const [sa, sb] = await Promise.all([inkScore(a), inkScore(b)])
  // A tie (for example photos the browser may not read) falls back to the usual order: front first.
  return sa > sb ? [a, b] : [b, a]
}

// Shopify mockup files are named like "mockup-c727-back_…" / "mockup-c727-front_…": the colour
// code and the side. The photos of one colour are found by that code, so the order the photos
// sit in on Shopify no longer matters (14 Nov: Nico moved the back print to the first slot).
const colourCode = (url: string) => /mockup-c(\d+)-(?:front|back)/i.exec(url)?.[1] ?? null

// The pair a photo belongs to: the front and back of the same colour. Falls back to
// position pairs (from the first photo) for files that don't follow the naming.
export const pairOf = <T extends { url: string }>(images: T[], url?: string): [string, string] | null => {
  if (!images.length) return null
  const i = url ? images.findIndex((im) => im.url === url) : 0
  const at = images[i < 0 ? 0 : i].url
  const code = colourCode(at)
  if (code) {
    const same = images.filter((im) => colourCode(im.url) === code).map((im) => im.url)
    const back = same.find((u) => named(u) > 0), front = same.find((u) => named(u) < 0)
    if (back && front) return [back, front]
    if (same.length === 1) return [same[0], same[0]]
  }
  const start = i < 0 ? 0 : i - (i % 2)
  const a = images[start]?.url, b = images[start + 1]?.url
  return a && b ? [a, b] : a ? [a, a] : null
}

// [design, front] for a product's photos (optionally for one colour's photo); null while loading.
export function useDesignPair(images: { url: string }[] | undefined, colourUrl?: string): [string, string] | null {
  const pair = images ? pairOf(images, colourUrl) : null
  const k = pair ? pair.join('|') : ''
  const [res, setRes] = useState<{ k: string; v: [string, string] } | null>(null)
  useEffect(() => {
    if (!pair || pair[0] === pair[1]) return
    let live = true
    orderPair(pair[0], pair[1]).then((v) => { if (live) setRes({ k, v }) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])
  if (!pair) return null
  if (pair[0] === pair[1]) return pair
  return res && res.k === k ? res.v : null
}

// Same, but never empty: until the photos are scored it guesses the usual order (front first).
export function useDesignPairOrGuess(images: { url: string }[] | undefined, colourUrl?: string): [string, string] | null {
  const known = useDesignPair(images, colourUrl)
  if (known) return known
  const pair = images ? pairOf(images, colourUrl) : null
  if (!pair) return null
  // Filenames say the side for every current listing, so the guess is usually already right.
  const na = named(pair[0]), nb = named(pair[1])
  if (na !== nb) return na > nb ? pair : [pair[1], pair[0]]
  return [pair[1], pair[0]]
}
