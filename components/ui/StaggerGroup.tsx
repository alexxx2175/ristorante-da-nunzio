'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { staggerFade } from '@/lib/animations'

type StaggerGroupProps = {
  children: ReactNode
  className?: string
  /** Cosa far entrare: di default i figli marcati `data-stagger-item`. */
  selector?: string
}

/**
 * Fa entrare a cascata gli elementi marcati al suo interno, con **un solo**
 * ScrollTrigger per gruppo invece di uno per elemento: la carta delle bevande
 * ha 42 voci, e 42 trigger sono 42 rimisurazioni a ogni `refresh()`.
 *
 * Lo scarto fra una voce e la successiva si accorcia quando la lista e' lunga.
 * Con uno stagger fisso da 0.08 le 42 voci delle bevande impiegherebbero oltre
 * tre secondi a comparire tutte, e le ultime arriverebbero quando hai gia'
 * smesso di guardare: il tetto e' 1.2s complessivi.
 *
 * Serve a tenere `MenuScaffold` un componente server — anima solo questo
 * involucro, i dati del menù non finiscono nel bundle.
 */
export default function StaggerGroup({
  children,
  className = '',
  selector = '[data-stagger-item]',
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = Array.from(el.querySelectorAll<HTMLElement>(selector))
    if (targets.length === 0) return

    return staggerFade(targets, {
      trigger: el,
      stagger: Math.min(0.08, 1.2 / targets.length),
      start: 'top 85%',
    })
  }, [selector])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
