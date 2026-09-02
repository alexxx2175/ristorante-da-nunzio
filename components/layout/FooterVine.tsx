'use client'

import { useEffect, useRef } from 'react'
import VineBranch from '@/components/ui/VineBranch'
import { slideInX } from '@/lib/animations'

/**
 * Il ramo di vite del footer, che entra da destra quando il blocco scuro
 * arriva in viewport e si ritira risalendo.
 *
 * E' un componente a se' solo perche' serve un effetto: il Footer resta un
 * Server Component e non paga il costo del client bundle per il resto.
 */
export default function FooterVine() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(
    () => slideInX(ref.current, { from: '140%', trigger: ref.current?.parentElement }),
    []
  )

  return (
    <div
      ref={ref}
      aria-hidden
      /* La foto e' molto piu' densa del disegno a tratto che c'era prima: alla
         vecchia misura copriva il bottone e la colonna dei social. Ora sta
         nell'angolo in alto a destra, tagliata dal bordo del blocco scuro
         (il Footer e' overflow-hidden), e finisce sopra al bottone. */
      className="pointer-events-none absolute top-0 right-0 w-[15rem] opacity-25 lg:w-[20rem]"
    >
      <VineBranch className="w-full" flip />
    </div>
  )
}
