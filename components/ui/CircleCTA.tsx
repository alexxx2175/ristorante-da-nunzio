import Link from 'next/link'
import type { ReactNode } from 'react'

type CircleCTAProps = {
  /** Etichetta, es. "SEE MENU": va a capo automaticamente su 2 righe. */
  label: string
  href: string
  tone?: 'light' | 'dark'
  /** Dimensione in px (120 come nell'originale). */
  size?: number
  className?: string
  children?: ReactNode
}

/**
 * CTA circolare: anello sottile in rotazione lenta e continua (idle) con
 * etichetta statica al centro su due righe; hover = leggero scale-up.
 *
 * L'anello e' un layer separato dal testo, cosi' la rotazione non rende
 * illeggibile l'etichetta.
 */
export default function CircleCTA({
  label,
  href,
  tone = 'light',
  size = 120,
  className = '',
}: CircleCTAProps) {
  const color = tone === 'light' ? 'text-primary' : 'text-secondary'
  const isPlaceholder = href.startsWith('[')

  const inner = (
    <>
      {/* anello rotante */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-dashed border-current/50 motion-safe:animate-[spin_20s_linear_infinite]"
      />
      {/* anello statico interno, per dare spessore visivo */}
      <span aria-hidden className="absolute inset-[6px] rounded-full border border-current/20" />
      <span className="nav-link relative z-10 max-w-[70%] text-center text-[0.6875rem] leading-[1.4] text-balance">
        {label}
      </span>
    </>
  )

  const cls = `group relative inline-flex shrink-0 items-center justify-center rounded-full ${color} transition-transform duration-300 ease-out hover:scale-105 ${className}`
  const style = { width: size, height: size }

  if (isPlaceholder) {
    return (
      <span className={cls} style={style} title={href} data-placeholder={href}>
        {inner}
      </span>
    )
  }

  return (
    <Link className={cls} style={style} href={href} aria-label={label}>
      {inner}
    </Link>
  )
}
