import { useT } from './t'

// Stanley/Stella's four fits (stanleystella.com/fit-guide) and the fit of each blank we use.
// Creator 2.0, Cruiser 2.0, Stella Muser and Bomber 2.0 are "Medium fit" per their product
// specs. The oversized model isn't confirmed yet: assumed Blaster 2.0 (STTU959), "Oversized".
const FITS = ['Fitted', 'Medium', 'Relaxed', 'Oversized'] as const
type Fit = (typeof FITS)[number]
const BY_PIECE: Record<string, { fit: Fit; model: string } | undefined> = {
  tshirt: { fit: 'Medium', model: 'Creator 2.0' },
  tee: { fit: 'Medium', model: 'Creator 2.0' },
  women: { fit: 'Medium', model: 'Stella Muser' },
  hoodie: { fit: 'Medium', model: 'Cruiser 2.0' },
  bomber: { fit: 'Medium', model: 'Bomber 2.0' },
  oversized: { fit: 'Oversized', model: 'Blaster 2.0' },
  over: { fit: 'Oversized', model: 'Blaster 2.0' },
}
const TIP: Record<Fit, string> = {
  Fitted: 'Follows the body. Size up for more room.',
  Medium: 'Not too tight, not too loose. Take your usual size, or size up for a roomier look.',
  Relaxed: 'Generous room through the body. Take your usual size.',
  Oversized: 'Boxy with dropped shoulders, big on purpose. Take your usual size, or size down for a closer fit.',
}

/** A small fit scale above the sizes, like Stanley/Stella shows on its products. Totes and beanies are one size. */
export default function FitScale({ piece }: { piece: string }) {
  const t = useT()
  const info = BY_PIECE[piece]
  if (piece === 'tote' || piece === 'beanie') return <p className="pw-fit-one">{t('One size.')}</p>
  if (!info) return null
  return (
    <div className="pw-fit">
      <div className="pw-fit-scale" role="img" aria-label={`${t('Fit')}: ${t(info.fit)}`}>
        {FITS.map((f) => <span key={f} className={f === info.fit ? 'is-on' : undefined}>{t(f)}</span>)}
      </div>
      <p className="pw-fit-tip"><b>{t(info.fit)} {t('fit')}.</b> {t(TIP[info.fit])}</p>
    </div>
  )
}
