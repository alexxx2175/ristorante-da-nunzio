'use client'

import { useEffect, useRef } from 'react'
import CircleCTA from '@/components/ui/CircleCTA'
import Decorations from '@/components/ui/Decorations'
import PlaceholderMedia from '@/components/ui/PlaceholderMedia'
import SplitHeading from '@/components/ui/SplitHeading'
import { fadeInUp, mouseParallax, scrollParallax } from '@/lib/animations'
import { content } from '@/lib/images'
import { menuCta } from '@/lib/site'

/**
 * Sezione dedicata a Malcesine e al Lago di Garda.
 *
 * La foto non e' piu' uno sfondo scuro a tutta pagina con il testo sopra, ma
 * sta dentro un arco accanto al testo, su fondo crema. Cosi' la pagina non
 * accumula tre schermate scure di fila (hero, pannelli, questa) e l'arco
 * riprende le forme della gallery. Dentro l'arco la foto scorre in parallasse.
 */
export default function LakeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cleanups = [
      scrollParallax(sectionRef.current?.querySelector('[data-parallax]') ?? [], {
        distance: 60,
        trigger: sectionRef.current,
      }),
      fadeInUp(contentRef.current, { y: 40 }),
      mouseParallax(sectionRef.current),
    ]
    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="texture-marble-light screen-section relative w-full overflow-hidden"
    >
      <Decorations />

      <div className="container-gutter relative grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        {/* il wrapper sborda in verticale per lasciare spazio alla parallasse */}
        <div className="shape-arch relative mx-auto w-full max-w-[17rem] overflow-hidden lg:order-2 lg:max-w-sm">
          <div data-parallax className="absolute inset-x-0 -inset-y-12">
            <PlaceholderMedia
              token="[FOTO-MALCESINE]"
              {...content.malcesine}
              sizes="(min-width: 1024px) 30vw, 70vw"
            />
          </div>
        </div>

        <div ref={contentRef} className="gsap-hidden flex flex-col items-start gap-8">
          <h2 className="nav-link text-accent-gold">Il Lago di Garda</h2>

          <SplitHeading mode="scrub" className="font-serif text-3xl leading-tight md:text-5xl">
            A tavola con il lago a due passi
          </SplitHeading>

          <div className="flex flex-col gap-5 leading-relaxed opacity-75">
            <p>
              Malcesine è uno di quei posti che si ricordano: i vicoli in pietra, le barche in
              porto, il Monte Baldo che scende fino all&apos;acqua. Da Nunzio siete nel cuore del
              centro storico, a pochi metri dalla riva.
            </p>
            <p>
              Una cena qui è prima di tutto una pausa: il tempo rallenta, il lago si tinge di rosa e
              la serata diventa il ricordo che vi porterete a casa.
            </p>
          </div>

          <CircleCTA label={menuCta.label} href={menuCta.href} tone="dark" size={140} />
        </div>
      </div>
    </section>
  )
}
