import i18n from '../i18n'
import { isNewSiteVisible } from './launch'

// Wording for the fixed-amount model, swapped into the shared texts only where the new
// site shows (previews now, everywhere from 11.11 at 11:11). The live site keeps its texts.
const REFUND: Record<string, Record<number, { type: 'p' | 'h2'; text: string }>> = {
  en: {
    0: { type: 'p', text: 'Thank you for supporting Perfect World. Every piece gives a fixed amount to the partner its design was made with, and we want you to be happy with your order.' },
    5: { type: 'h2', text: 'Made to order' },
    6: { type: 'p', text: 'Every piece is made just for you once you order, which is why we cannot take back or exchange pieces that simply do not fit. Please check the size chart before you order. Your statutory rights remain unaffected. Read more on [How giving works](/how-giving-works).' },
  },
  de: {
    0: { type: 'p', text: 'Danke, dass du Perfect World unterstützt. Jedes Teil gibt einen festen Betrag an den Partner, mit dem sein Design entstanden ist, und wir möchten, dass du mit deiner Bestellung glücklich bist.' },
    5: { type: 'h2', text: 'Auf Bestellung gefertigt' },
    6: { type: 'p', text: 'Jedes Teil wird erst nach deiner Bestellung nur für dich gefertigt. Deshalb können wir Teile, die einfach nicht passen, nicht zurücknehmen oder umtauschen. Bitte wirf vor der Bestellung einen Blick auf die Größentabelle. Deine gesetzlichen Rechte bleiben unberührt. Mehr dazu unter [So funktioniert das Geben](/how-giving-works).' },
  },
  es: {
    0: { type: 'p', text: 'Gracias por apoyar a Perfect World. Cada prenda da una cantidad fija a la organización con la que se creó su diseño, y queremos que estés feliz con tu pedido.' },
    5: { type: 'h2', text: 'Hecho por encargo' },
    6: { type: 'p', text: 'Cada prenda se fabrica solo para ti cuando haces el pedido, por eso no podemos aceptar devoluciones ni cambios de prendas que simplemente no te queden bien. Revisa la guía de tallas antes de pedir. Tus derechos legales no se ven afectados. Más información en [Cómo funciona el dar](/how-giving-works).' },
  },
}

export function applyTextOverrides() {
  if (!isNewSiteVisible()) return
  for (const [lang, blocks] of Object.entries(REFUND)) {
    const bundle = i18n.getResourceBundle(lang, 'legal') as { refund?: { blocks?: unknown[] } } | undefined
    const list = bundle?.refund?.blocks
    if (!Array.isArray(list)) continue
    const next = list.slice()
    for (const [i, b] of Object.entries(blocks)) next[Number(i)] = b
    i18n.addResourceBundle(lang, 'legal', { refund: { blocks: next } }, true, true)
  }
}
