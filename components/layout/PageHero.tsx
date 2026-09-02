import type { ReactNode } from 'react'
import PlaceholderMedia from '@/components/ui/PlaceholderMedia'
import VineBranch from '@/components/ui/VineBranch'
import type { Photo } from '@/lib/images'

type PageHeroProps = {
  /** Sovratitolo breve (uppercase). */
  kicker?: string
  /** H1 della pagina. */
  title: string
  /** Paragrafo introduttivo. */
  intro?: string
  /** Foto di sfondo (da lib/images); senza, resta la texture scura. */
  image?: Photo
  children?: ReactNode
}

/**
 * Testata delle pagine interne.
 *
 * Due compiti:
 *  1. riservare in cima lo spazio dell'header, che e' `position: fixed` e non
 *     occupa flusso (--spacing-header + respiro);
 *  2. garantire un fondo scuro sotto l'header, che nello stato iniziale ha il
 *     testo bianco. Una pagina che iniziasse con un fondo chiaro avrebbe la
 *     navigazione illeggibile fino al primo scroll.
 */
export default function PageHero({ kicker, title, intro, image, children }: PageHeroProps) {
  return (
    <section
      className="texture-marble-dark text-primary page-hero-section relative w-full"
    >
      {image ? (
        <div aria-hidden className="absolute inset-0">
          <PlaceholderMedia token="[FOTO-TESTATA]" {...image} priority />
        </div>
      ) : null}

      <div aria-hidden className="absolute inset-0 bg-black/60" />

      {/* La vite ricorre su ogni pagina interna: e' il segno del locale. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 w-[20rem] opacity-30 lg:w-[30rem]"
      >
        <VineBranch className="w-full" flip />
      </div>

      <div className="page-hero-content container-gutter relative">
        {kicker ? <p className="nav-link text-accent-gold mb-6">{kicker}</p> : null}

        <h1 className="text-display-hero max-w-3xl font-serif">{title}</h1>

        {intro ? (
          <p className="mt-6 max-w-xl leading-relaxed opacity-80">{intro}</p>
        ) : null}

        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  )
}
