import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Shell, { Page } from './Shell'
import CartDrawerV2 from './CartDrawerV2'
import { A } from './A'
import { useCart } from '../contexts/CartContext'
import { useT } from './t'
import { usePageTitle } from '../hooks/usePageTitle'
import { SIZE_CHARTS } from './sizes'

// Smaller pages of the new site. Each one replaces an old page only while the new site is visible.

const pill = { display: 'inline-flex', alignItems: 'center', minHeight: '48px', padding: '0 24px', borderRadius: '999px', background: '#0b0b0c', color: '#ffffff', textDecoration: 'none', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' } as const
const field = { width: '100%', boxSizing: 'border-box', minHeight: '50px', padding: '12px 16px', borderRadius: '16px', border: '1.5px solid #cfccc5', background: '#ffffff', font: 'inherit', fontSize: '16px', color: '#0b0b0c' } as const

export function To({ to }: { to: string }) {
  return <Navigate to={to} replace />
}

export function NotFoundV2() {
  const t = useT()
  usePageTitle('Not found')
  return (
    <Shell>
      <Page kicker={t('oops.')} title={t('This page wandered off.')}>
        <p>{t('The link may be old, or the page has moved. Everything else is still here.')}</p>
        <p style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          <A href="/" style={pill}>{t('Back home')}</A>
          <A href="/shop" style={{ ...pill, background: 'transparent', color: '#0b0b0c', border: '1.5px solid #0b0b0c' }}>{t('Shop')}</A>
        </p>
      </Page>
    </Shell>
  )
}

export function ContactV2() {
  const t = useT()
  usePageTitle('Contact')
  const [form, setForm] = useState({ name: '', email: '', comment: '' })
  const send = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Message from ${form.name || 'website visitor'}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.comment}`)
    window.location.href = `mailto:info@perfectworld.global?subject=${subject}&body=${body}`
  }
  return (
    <Shell>
      <Page kicker={t('say hi.')} title={t('Contact us')}>
        <form onSubmit={send} style={{ display: 'grid', gap: '12px' }}>
          <input aria-label={t('Name')} placeholder={t('Name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={field} />
          <input aria-label={t('Email')} type="email" required placeholder={t('Email') + ' *'} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={field} />
          <textarea aria-label={t('Message')} rows={6} placeholder={t('Message')} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} style={{ ...field, minHeight: '150px', resize: 'vertical' }} />
          <div><button type="submit" style={pill}>{t('Send')}</button></div>
        </form>
        <h2>{t('Or reach us directly')}</h2>
        <p>
          Perfect World · Nicholas Freitag<br />
          <a href="mailto:info@perfectworld.global">info@perfectworld.global</a><br />
          +49 15129109696<br />
          Am Hochwald 5, 82319 Starnberg, {t('Germany')}
        </p>
      </Page>
    </Shell>
  )
}

export function CartPageV2() {
  usePageTitle('Cart')
  return (
    <Shell>
      <CartDrawerV2 isOpen inline onClose={() => {}} />
    </Shell>
  )
}

export function OrderSuccessV2() {
  const t = useT()
  usePageTitle('Thank you')
  const [params] = useSearchParams()
  const { clearCart } = useCart()
  const orderId = params.get('order_id')
  useEffect(() => { clearCart() }, [clearCart])
  return (
    <Shell>
      <Page kicker={t('thank you.')} title={t('Your order is in.')}>
        <p>{t('Your piece is now being made just for you. You will get a confirmation email with all the details, and a tracking link once it ships, usually within 1½ to 2 weeks.')}</p>
        <p>{t('The fixed amount from your order goes to the partner your design was made with.')} <A href="/how-giving-works">{t('How giving works')}</A></p>
        {orderId && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#5c5c5c' }}>{t('Order')}: {orderId}</p>}
        <p style={{ marginTop: '20px' }}><A href="/" style={pill}>{t('Back home')}</A></p>
      </Page>
    </Shell>
  )
}

/** The two remaining info pages, from the legal namespace, in the new frame. */
export function InfoV2({ k }: { k: 'together' | 'fashionTool' }) {
  const { t } = useTranslation('legal')
  return (
    <Shell>
      <Page title={t(`info.${k}.title`)}>
        <p style={{ fontSize: '19px' }}>{t(`info.${k}.body`)}</p>
      </Page>
    </Shell>
  )
}

/** Size guide with the official Stanley/Stella measurements. */
export function SizeGuideV2() {
  const t = useT()
  usePageTitle('Size guide')
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
  }, [])
  return (
    <Shell active="/shop">
      <Page kicker={t('fits like this.')} title={t('Size guide')} sub={t('Every piece is a Stanley/Stella garment in organic cotton. These are the official measurements, in centimetres, with the piece laid flat.')}>
        <div className="pw-howto">
          <p><b>A · {t('Half chest')}</b> {t('Straight across the front, 2.5 cm below the armholes.')}</p>
          <p><b>B · {t('Body length')}</b> {t('From the highest point of the shoulder down to the hem.')}</p>
          <p><b>C · {t('Sleeve length')}</b> {t('Along the sleeve, from the shoulder seam to the end.')}</p>
          <p className="pw-tip">{t('Between two sizes? Lay a top you love flat, measure it and pick the closest. For a looser fit, go one size up.')}</p>
        </div>
        {SIZE_CHARTS.map((c) => (
          <section key={c.id} id={c.id} className="pw-size">
            <h2>{t(c.piece)} {c.soon && <span className="pw-soon">{t('COMING SOON')}</span>}</h2>
            <p className="pw-size-model">STANLEY/STELLA {c.model.toUpperCase()} · {c.code} · CM</p>
            <div className="pw-size-scroll" tabIndex={0} role="region" aria-label={`${t(c.piece)}, ${t('measurements in cm')}`}>
              <table>
                <thead><tr><th scope="col">{t('Size')}</th>{c.rows.map((r) => <th key={r[0]} scope="col">{r[0]}</th>)}</tr></thead>
                <tbody>
                  {c.cols.map(([letter, col], i) => (
                    <tr key={col}><th scope="row">{letter} · {t(col)}</th>{c.rows.map((r) => <td key={r[0]}>{r[i + 1]}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <p style={{ marginTop: '28px' }}>{t('Still unsure?')} <A href="/contact">{t('Write to us')}</A> {t('and we will help you pick.')}</p>
      </Page>
    </Shell>
  )
}
