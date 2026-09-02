/* NON IN USO. Nessuna sezione monta piu' questo componente: la gallery ha
   fotografie che ruotano e le proposte stagionali hanno il proprio <video>.

   Tenuto perche' il progetto non e' sotto controllo di versione e qui dentro
   c'e' del sapere che e' costato provarlo: preload="none", play/pausa legati
   alla visibilita', e i due requisiti perche' iOS accetti l'autoplay. */
'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'

type VideoTileProps = {
  src: string
  /** Primo fotogramma della clip: e' quello che si vede prima che parta. */
  poster: string
  alt: string
  className?: string
}

/**
 * Clip che riempie un riquadro e sembra una fotografia finche' non entra in
 * viewport, poi si muove.
 *
 * Tre scelte che tengono in piedi l'effetto:
 *
 *  - **`preload="none"`.** Senza, il browser scaricherebbe tutte le clip al
 *    caricamento della pagina — megabyte spesi per contenuto che l'utente forse
 *    non raggiunge mai. Si scarica quando serve.
 *  - **Play e pausa legati alla visibilita'.** Un IntersectionObserver avvia la
 *    clip quando la tessera entra e la ferma quando esce: niente video che
 *    continuano a decodificare fuori schermo, che su telefono si traduce in
 *    batteria e calore.
 *  - **`muted` + `playsInline`.** Sono i due requisiti perche' iOS accetti
 *    l'autoplay; senza `playsInline` il video andrebbe a tutto schermo da solo.
 *
 * Con `prefers-reduced-motion` non parte mai: resta il poster, e la tessera e'
 * a tutti gli effetti una fotografia.
 */
export default function VideoTile({ src, poster, alt, className = '' }: VideoTileProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() puo' essere rifiutata (risparmio energetico, politiche di
          // autoplay): non e' un errore da propagare, semplicemente resta il
          // poster e la tessera continua a sembrare una foto.
          void el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      // 0.25: parte poco prima di essere del tutto visibile, cosi' il caricamento
      // ha un margine e non si vede il fermo immagine appena arrivati.
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    />
  )
}
