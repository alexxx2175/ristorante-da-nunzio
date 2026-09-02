/* NON IN USO dal 01/09/2026. La striscia di clip in home ha lasciato il posto a
   `SeasonalPlates`: sette fotografie di piatti che girano piano con lo scroll e
   cambiano ogni due secondi. Erano 21MB di video per la stessa cosa che ora
   fanno venti PNG da qualche centinaio di KB.

   Tenuto perche' il progetto non e' sotto controllo di versione, e perche' il
   modo in cui **ascolta** lo scroll senza intercettarlo e' il riferimento per
   chiunque debba rifare un effetto legato allo scorrimento qui dentro.
   I file in public/videos non sono stati cancellati. */
'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'
import type { Video } from '@/lib/videos'

type SeasonalShowcaseProps = {
  videos: Video[]
}

/** Quanto resta a schermo un piatto quando non stai scorrendo. */
const DURATA_MS = 2200
/** Quanto scroll fa passare al piatto dopo, mentre la sezione e' a schermo. */
const PASSO_PX = 160

/**
 * I piatti a tutta larghezza, uno alla volta, fra due bande di marmo.
 *
 * I piatti cambiano in due modi, che convivono:
 *
 *  - **scorrendo**, un piatto ogni ~160px, finche' la sezione e' a schermo;
 *  - **da soli**, ogni 2,2s, quando smetti di scorrere.
 *
 * Lo scorrimento della pagina non viene mai toccato: si ascolta lo scroll, non
 * lo si intercetta. E' la differenza rispetto a una versione precedente che
 * usava `preventDefault` sopra al video — cambiava i piatti, ma la pagina
 * smetteva di rispondere.
 *
 * **Il passo e' in pixel, non una frazione della sezione.** C'e' stata una
 * versione che ricavava l'indice dalla posizione della sezione nello schermo:
 * con 4 clip andava, con 13 diventavano 80px per piatto — meno di una rotellata
 * — e scorrendo ne lampeggiavano diversi insieme. Un passo fisso non dipende da
 * quante clip ci sono.
 *
 * Il timer gira solo quando la sezione e' davvero a schermo, e con
 * `prefers-reduced-motion` non parte affatto: restano il poster e i comandi.
 */
export default function SeasonalShowcase({ videos }: SeasonalShowcaseProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [inVista, setInVista] = useState(false)
  /** Cambia a ogni comando manuale: fa ripartire il timer da capo. */
  const [giroTimer, setGiroTimer] = useState(0)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setInVista(e.isIntersecting), { threshold: 0.35 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inVista || prefersReducedMotion() || videos.length < 2) return
    const id = setInterval(() => setActive((p) => (p + 1) % videos.length), DURATA_MS)
    return () => clearInterval(id)
  }, [inVista, videos.length, giroTimer])

  // Scorrendo si cambia piatto. Listener `passive`: si ascolta lo scroll, non
  // lo si trattiene.
  useEffect(() => {
    if (!inVista || videos.length < 2) return

    let ultimo = window.scrollY
    let accumulato = 0

    const onScroll = () => {
      const y = window.scrollY
      accumulato += y - ultimo
      ultimo = y
      if (Math.abs(accumulato) < PASSO_PX) return
      const passo = accumulato > 0 ? 1 : -1
      accumulato = 0
      setActive((p) => (p + passo + videos.length) % videos.length)
      // Il cambio automatico riparte da capo, cosi' non ne somma un altro
      // subito dopo quello appena fatto scorrendo.
      setGiroTimer((g) => g + 1)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [inVista, videos.length])

  // Solo la clip a schermo decodifica: le altre restano ferme sul poster.
  useEffect(() => {
    if (prefersReducedMotion()) return
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === active && inVista) {
        v.play().catch(() => {
          /* l'autoplay puo' essere negato: resta il poster, non e' un errore */
        })
      } else {
        v.pause()
      }
    })
  }, [active, inVista])

  /** Comando manuale: sposta il piatto e rimanda il cambio automatico. */
  const vai = (i: number) => {
    setActive((i + videos.length) % videos.length)
    setGiroTimer((g) => g + 1)
  }

  return (
    /* Le due bande sono queste: il video a tutta larghezza e il padding che
       lascia vedere il marmo sopra e sotto.

       L'altezza del video e' legata alla finestra (`60svh`) e non a un rapporto
       fisso: con un rapporto fisso, a tutta larghezza, il video diventa piu'
       alto dello schermo e le bande spariscono — su 1728px un 16:9 e' alto
       972px contro 956 di finestra. Il taglio lo fa `object-cover`.

       Su telefono resta 16:9: a 390px di larghezza una fascia da 60svh sarebbe
       sproporzionata rispetto alla larghezza. */
    <div className="w-full py-[9svh]">
      <div ref={stageRef} className="group relative aspect-video w-full md:aspect-auto md:h-[60svh]">
        {videos.map((v, i) => (
          <video
            key={v.src}
            ref={(node) => {
              videoRefs.current[i] = node
            }}
            src={v.src}
            poster={v.poster}
            aria-label={v.alt}
            muted
            loop
            playsInline
            /* Si precaricano la clip a schermo e la successiva: cosi' il cambio
               non parte da fermo, senza scaricarle tutte e tredici. */
            preload={i === active || i === (active + 1) % videos.length ? 'auto' : 'none'}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}

        {/* Frecce: invisibili finche' non ci passi sopra. Su touch il passaggio
            del mouse non esiste, quindi li' restano sempre un po' visibili.
            Sono cicliche, come il cambio automatico: niente stato disabilitato. */}
        <button
          type="button"
          onClick={() => vai(active - 1)}
          aria-label="Piatto precedente"
          className="text-primary absolute top-1/2 left-4 z-10 -translate-y-1/2 p-4 opacity-40 transition-opacity duration-300 hover:opacity-100 md:left-8 md:opacity-0 md:group-hover:opacity-60 md:hover:opacity-100"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 4 7 12l8 8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => vai(active + 1)}
          aria-label="Piatto successivo"
          className="text-primary absolute top-1/2 right-4 z-10 -translate-y-1/2 p-4 opacity-40 transition-opacity duration-300 hover:opacity-100 md:right-8 md:opacity-0 md:group-hover:opacity-60 md:hover:opacity-100"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 4 8 8-8 8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {videos.map((v, i) => (
            <button
              key={v.src}
              type="button"
              onClick={() => vai(i)}
              aria-label={`Vai al piatto ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'bg-primary w-6' : 'bg-primary/45 w-1.5 hover:bg-primary/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
