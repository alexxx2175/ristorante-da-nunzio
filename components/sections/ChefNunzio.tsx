'use client'

import { useEffect, useRef } from 'react'
import PlaceholderMedia from '@/components/ui/PlaceholderMedia'
import { fadeInUp, maskReveal } from '@/lib/animations'
import VineBranch from '@/components/ui/VineBranch'
import SplitHeading from '@/components/ui/SplitHeading'
import { content } from '@/lib/images'

/** Presentazione dello chef: foto a sinistra, racconto a destra. */
export default function ChefNunzio() {
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => fadeInUp(textRef.current, { y: 40 }), [])

  // La foto si scopre da sinistra a destra invece di comparire in dissolvenza.
  useEffect(() => maskReveal(imageRef.current), [])

  return (
    <section className="screen-section relative w-full overflow-hidden">
      {/* La vite ricorre in tutto il sito: e' quella che copre la facciata del locale.
          Ritagliata dal bordo della finestra — `overflow-x: clip` e' globale. */}
      {/* Appoggiato al bordo della sezione, **non oltre**: la sezione ritaglia
          quello che esce, e un ramo spinto sotto veniva reciso da una riga
          orizzontale in mezzo alle foglie. Il PNG si porta gia' un quinto di
          altezza trasparente in fondo, che fa da sfumatura senza bisogno di
          sbordare. Gli scarti in pixel fissi peggioravano su schermo stretto,
          dove il ramo e' meta' e il taglio lo stesso. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 bottom-0 w-[min(20rem,44vw)] opacity-20 lg:-right-20"
      >
        <VineBranch className="w-full" flip />
      </div>


      <div className="container-gutter grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        {/* max-h: senza tetto l'aspect-ratio farebbe sfondare la schermata */}
        <div
          ref={imageRef}
          className="mask-reveal relative aspect-[4/5] max-h-[42svh] overflow-hidden lg:aspect-[3/4] lg:max-h-[68svh]"
        >
          <PlaceholderMedia
            token="[FOTO-CHEF-NUNZIO]"
            {...content.chef}
            sizes="(min-width: 1024px) 45vw, 90vw"
          />
        </div>

        <div ref={textRef} className="gsap-hidden">
          <h2 className="nav-link text-accent-gold">Lo chef</h2>

          <SplitHeading mode="scrub" className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
            Nunzio, è una cucina che si riconosce al primo assaggio
          </SplitHeading>

          <div className="mt-8 flex flex-col gap-5 leading-relaxed opacity-80">
            <p>
              Da Nunzio è un locale storico di Malcesine, a pochi passi dal Porto Vecchio e da
              Piazza Statuto. Qui lo chef Nunzio accoglie gli ospiti come si fa in famiglia: senza
              formalità, con la cura di chi conosce ogni piatto che esce dalla sua cucina.
            </p>
            <p>
              La sua idea di ristorazione è semplice e testarda insieme: materie prime fresche,
              tempi rispettati e ricette che attraversano l&apos;Italia da Nord a Sud. Il resto lo
              fa Malcesine, con il suo centro storico e il lago a due passi.
            </p>
          </div>

          <p className="text-accent-gold mt-8 font-serif text-2xl lowercase">
            «Se mi conosci ti innamori»
          </p>
        </div>
      </div>
    </section>
  )
}
