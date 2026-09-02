'use client'

import { useEffect, useRef } from 'react'
import VineBranch from '@/components/ui/VineBranch'
import { mouseParallax, textReveal } from '@/lib/animations'

/**
 * Filosofia di cucina: il testo si "riempie" di colore parola per parola
 * seguendo lo scroll (effetto scrubbed, non entrance), su una schermata quasi
 * vuota. E' la pausa fra la hero e il resto della pagina: qui l'aria intorno al
 * testo e' il contenuto, non lo spazio avanzato.
 */
export default function MissionStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => textReveal(textRef.current), [])

  // Il listener sta sulla sezione, non sul livello decorativo: quello e'
  // pointer-events-none e il puntatore non ci arriva mai.
  useEffect(() => mouseParallax(sectionRef.current), [])

  return (
    <section
      ref={sectionRef}
      /* Un po' piu' d'aria delle altre sezioni: questa e' la pausa fra la hero e
         il resto, e l'aria intorno al claim qui e' contenuto. Ma e' aria
         misurata, non una schermata vuota per convenzione. */
      className="texture-marble-light screen-section relative w-full overflow-hidden py-16 lg:py-24"
    >
      {/* `data-depth` lo fa muovere al mouse: il listener e' sulla sezione. */}
      {/* Appoggiato al bordo, **non oltre**: quello che esce la sezione lo
          ritaglia, e un ramo spinto fuori veniva reciso da una riga dritta in
          mezzo alle foglie. Il PNG ha gia' un ottavo di altezza trasparente in
          cima, che fa da sfumatura senza bisogno di sbordare. */}
      <div
        data-depth="0.5"
        aria-hidden
        className="pointer-events-none absolute top-0 -left-24 w-[min(22rem,48vw)] opacity-25 lg:-left-16"
      >
        <VineBranch className="w-full" />
      </div>

      {/* Appoggiato al bordo della sezione, **non oltre**: la sezione ritaglia
          quello che esce, e un ramo spinto sotto veniva reciso da una riga
          orizzontale in mezzo alle foglie. Il PNG si porta gia' un quinto di
          altezza trasparente in fondo, che fa da sfumatura senza bisogno di
          sbordare. Gli scarti in pixel fissi peggioravano su schermo stretto,
          dove il ramo e' meta' e il taglio lo stesso. */}
      <div
        data-depth="0.25"
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 w-[min(18rem,40vw)] opacity-20 lg:-right-16"
      >
        <VineBranch className="w-full" flip />
      </div>

      <div className="container-gutter relative mx-auto max-w-[95rem] text-center">
        <h2 className="nav-link text-accent-gold mb-14">La nostra cucina</h2>

        <p ref={textRef} className="text-reveal text-display-claim font-serif">
          Ingredienti freschi, scelti ogni giorno. Piatti che raccontano la tradizione italiana da
          Nord a Sud, con la semplicità di chi cucina per far sentire gli ospiti a casa.
        </p>
      </div>
    </section>
  )
}
