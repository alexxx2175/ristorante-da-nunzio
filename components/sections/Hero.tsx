'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { heroVideo } from '@/lib/videos'
import { menuCta, siteConfig } from '@/lib/site'

/**
 * Hero della home. L'H1 tiene insieme la parola chiave principale
 * ("ristorante a Malcesine") e il claim del locale.
 *
 * Lo sfondo e' **solo il video**, in loop.
 *
 * C'erano tre fotografie che si alternavano in dissolvenza con `crossfadeLoop`,
 * poi il video al posto della prima e le altre due a seguire. Adesso non ci
 * sono piu': il video gira e basta. I file restano in `public/images`, ma non
 * li referenzia piu' nessuno.
 */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Il video si ferma quando la hero esce dallo schermo. Senza, un 720p
  // continuerebbe a decodificare mentre si legge il resto della pagina.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {
            /* l'autoplay puo' essere negato: resta il poster */
          })
        } else {
          el.pause()
        }
      },
      { threshold: 0.05 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="text-primary relative flex h-svh min-h-[600px] w-full items-center justify-center overflow-hidden">
      {/* `poster` e' il fotogramma 0 della clip: finche' il video non parte — o
          se il browser non decodifica l'HEVC — si vede comunque quella
          immagine, e quando parte non c'e' stacco.

          `preload="metadata"`: sono 5,6 MB, non vanno scaricati prima che la
          pagina sia utilizzabile. */}
      <div aria-hidden className="hero-media bg-bg-dark absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo.src}
          poster={heroVideo.poster}
          aria-label={heroVideo.alt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      {/* Il velo scuro serve a tenere leggibile il testo sopra al video, e
          quindi entra **col testo**: nei primi due secondi non c'e' niente da
          rendere leggibile, e tenerlo acceso smorzerebbe la ripresa senza
          motivo. */}
      <div aria-hidden className="intro-header absolute inset-0 bg-black/45" />

      <div className="hero-content container-gutter relative flex flex-col items-center gap-8 pt-24 text-center">
        <p className="nav-link text-accent-gold">{siteConfig.location}</p>

        <h1 className="max-w-4xl">
          <span className="block font-sans text-sm font-medium tracking-[0.2em] uppercase opacity-90">
            Ristorante a Malcesine
          </span>
          <span className="text-display-hero mt-4 block font-serif lowercase">
            {siteConfig.claim}
          </span>
        </h1>

        <p className="max-w-xl leading-relaxed opacity-85">
          Nel centro storico di Malcesine, tra il Porto Vecchio e Piazza Statuto: la cucina di
          Nunzio, il profumo del lago e la sensazione di essere a casa.
        </p>

        <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
          <Button href={menuCta.href} variant="gold">
            {menuCta.label}
          </Button>
          <Button href={siteConfig.phoneHref} variant="outline" tone="light">
            {siteConfig.phone}
          </Button>
        </div>
      </div>

      <div
        aria-hidden
        className="intro-freccia absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-bounce"
      >
        <svg width="14" height="26" viewBox="0 0 14 26" fill="none">
          <path d="M7 0v24M1 18l6 6 6-6" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </section>
  )
}
