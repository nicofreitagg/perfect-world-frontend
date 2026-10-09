import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

/** Anchor that navigates inside the SPA for internal paths. */
export function A({ href = '', onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useNavigate()
  const internal = href.startsWith('/') && !href.startsWith('//')
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || !internal) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}
