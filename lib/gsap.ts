'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrazione idempotente dei plugin: gsap ignora le registrazioni duplicate,
// ma centralizzarla qui evita di ripeterla in ogni componente client.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/** true se l'utente ha chiesto di ridurre le animazioni. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
