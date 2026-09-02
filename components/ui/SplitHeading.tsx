'use client'

import { useEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { charReveal, charScrub, gradientFill } from '@/lib/animations'

type Mode = 'chars' | 'scrub' | 'gradient'

type SplitHeadingProps = {
  children: ReactNode
  /**
   * `chars`    — le lettere entrano da destra quando il titolo arriva in vista
   * `scrub`    — le lettere si rivelano seguendo la posizione di scroll
   * `gradient` — un gradiente attraversa il testo da destra a sinistra
   */
  mode?: Mode
  /** Tag da rendere: `p` di default, per non inventare gerarchie di heading. */
  as?: ElementType
  className?: string
}

/**
 * Titolo animato.
 *
 * `chars` e `scrub` spezzano il testo in lettere con SplitType, quindi vanno
 * usati su titoli **brevi**: su un paragrafo lungo si generano centinaia di
 * <span> e il costo di layout si vede. Per i testi lunghi c'e' `textReveal`,
 * che lavora sulle parole.
 *
 * Nota di accessibilita': lo split inserisce elementi dentro al titolo, ma il
 * testo resta nel DOM e leggibile da uno screen reader. Con
 * `prefers-reduced-motion` non si splitta affatto — gli helper escono subito e
 * il testo resta quello originale.
 */
export default function SplitHeading({
  children,
  mode = 'chars',
  as: Tag = 'p',
  className = '',
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (mode === 'scrub') return charScrub(el)
    if (mode === 'gradient') return gradientFill(el)
    return charReveal(el)
  }, [mode])

  const extra = mode === 'gradient' ? 'animated-text' : ''

  return (
    <Tag ref={ref} className={`${extra} ${className}`}>
      {children}
    </Tag>
  )
}
