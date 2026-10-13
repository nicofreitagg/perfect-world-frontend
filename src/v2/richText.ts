// Product descriptions come from the Shopify editor as HTML. Keep only simple text formatting
// (paragraphs, bold, italics, lists, small headings, line breaks) and drop every attribute,
// so nothing else from the editor can reach the page.
const KEEP = new Set(['P', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'H3', 'H4', 'H5', 'BR'])

export function cleanDescription(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const span = document.createElement('span')
      span.textContent = node.textContent ?? ''
      return span.innerHTML
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return ''
    const el = node as Element
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return ''
    const inner = Array.from(el.childNodes).map(walk).join('')
    if (!KEEP.has(el.tagName)) return inner
    const tag = el.tagName.toLowerCase()
    return tag === 'br' ? '<br>' : `<${tag}>${inner}</${tag}>`
  }
  return Array.from(doc.body.childNodes).map(walk).join('')
}
