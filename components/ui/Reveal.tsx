'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { fadeInUp } from '@/lib/animations'

type RevealProps = {
  children: ReactNode
  /** Spostamento verticale iniziale in px. */
  y?: number
  delay?: number
  className?: string
}

/**
 * Wrapper che fa entrare il contenuto con fade + slide-up quando arriva in
 * viewport. Utile per animare blocchi renderizzati lato server senza
 * trasformarli in componenti client.
 */
export default function Reveal({ children, y = 30, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => fadeInUp(ref.current, { y, delay }), [y, delay])

  return (
    <div ref={ref} className={`gsap-hidden ${className}`}>
      {children}
    </div>
  )
}
