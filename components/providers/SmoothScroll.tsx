'use client'

import { useLenis } from '@/lib/useLenis'

/**
 * Monta Lenis a livello globale. Nessun wrapper DOM: Lenis agisce su
 * document.documentElement, cosi' il markup delle pagine resta pulito e
 * position:sticky continua a funzionare.
 *
 * Lo scorrimento e' libero. C'e' stato un aggancio a schermate (`lenis/snap`):
 * e' stato tolto perche' agganciare dopo ogni gesto si percepisce come uno
 * strappo, non come fluidita'. Le sezioni restano alte una schermata — quella
 * e' impaginazione, la fa `screen-section` in globals.css — ma niente le
 * trattiene mentre si scorre.
 */
export default function SmoothScroll() {
  useLenis()
  return null
}
