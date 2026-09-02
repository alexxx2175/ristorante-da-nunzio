'use client'

import { useEffect, useRef } from 'react'
import CircleCTA from '@/components/ui/CircleCTA'
import { staggerFade } from '@/lib/animations'
import VineBranch from '@/components/ui/VineBranch'
import SplitHeading from '@/components/ui/SplitHeading'
import RotatingPhoto from '@/components/ui/RotatingPhoto'
import { galleryGroups } from '@/lib/images'
import type { Photo } from '@/lib/images'
import { reservationCta, siteConfig } from '@/lib/site'

type Shape = 'circle' | 'pill' | 'rect' | 'arch'

type Tile = {
  /** Le foto fra cui ruota la tessera: un gruppo di `galleryGroups`. */
  photos: Photo[]
  /** Sfasa il cambio rispetto alle altre tessere. */
  rotationOffset: number
  shape: Shape
  /** Posizionamento sulla griglia a 12 colonne (da lg in su). */
  area: string
  /** Offset verticale per rompere l'allineamento e rendere la griglia asimmetrica. */
  offset?: string
  /** Alterna piatti e foto del locale. Solo per le tessere tonde. */
  alterna?: boolean
}

type GalleryProps = {
  title: string
  claim: string
}

const SHAPES: Record<Shape, string> = {
  circle: 'shape-circle',
  pill: 'shape-pill',
  rect: 'aspect-[4/3]',
  arch: 'shape-arch',
}

/**
 * Le sei tessere. **Tutte ruotano**, ognuna sul proprio gruppo di
 * `galleryGroups`, e ognuna sfasata dalle altre: se cambiassero insieme si
 * leggerebbe come un effetto meccanico invece che come una griglia che respira.
 *
 * **I piatti stanno solo nelle due tonde**, dove si alternano al locale. Le
 * altre quattro mostrano soltanto il locale.
 *
 * C'era una tessera con un video in mezzo alle fotografie. Non c'e' piu': ora
 * che cambiano tutte, una clip in loop non era piu' l'unica cosa in movimento —
 * era solo la piu' rumorosa.
 */
const TILES: Tile[] = [
  {
    photos: galleryGroups[0],
    rotationOffset: 0,
    shape: 'circle',
    area: 'lg:col-start-1 lg:col-span-3 lg:row-start-1',
    alterna: true,
  },
  {
    photos: galleryGroups[1],
    rotationOffset: 0.17,
    shape: 'pill',
    area: 'lg:col-start-5 lg:col-span-3 lg:row-start-1 lg:row-span-2',
    offset: 'lg:mt-16',
  },
  {
    photos: galleryGroups[2],
    rotationOffset: 0.34,
    shape: 'rect',
    area: 'lg:col-start-9 lg:col-span-4 lg:row-start-1',
  },
  {
    photos: galleryGroups[3],
    rotationOffset: 0.5,
    shape: 'rect',
    area: 'lg:col-start-9 lg:col-span-4 lg:row-start-2 lg:row-span-2',
    offset: 'lg:mt-10',
  },
  {
    photos: galleryGroups[4],
    rotationOffset: 0.67,
    shape: 'arch',
    area: 'lg:col-start-1 lg:col-span-3 lg:row-start-3',
  },
  {
    photos: galleryGroups[5],
    rotationOffset: 0.84,
    shape: 'circle',
    area: 'lg:col-start-5 lg:col-span-3 lg:row-start-3',
    offset: 'lg:mt-20',
    alterna: true,
  },
]

const instagram = siteConfig.social.find((profile) => profile.label === 'Instagram')

/**
 * Galleria asimmetrica: forme organiche diverse (cerchio, pillola, arco,
 * rettangolo, video) che entrano in viewport con fade e slide-up a cascata.
 */
export default function Gallery({ title, claim }: GalleryProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tiles = Array.from(gridRef.current?.querySelectorAll<HTMLElement>('[data-tile]') ?? [])
    return staggerFade(tiles, { trigger: gridRef.current, start: 'top 80%' })
  }, [])

  const instagramHref = instagram?.href ?? ''
  const instagramIsPlaceholder = instagramHref.startsWith('[')

  return (
    <section className="texture-marble-light section-y relative w-full overflow-hidden">
      {/* Il ramo chiude la pagina in basso, prima del piede. */}
      {/* Appoggiato al bordo della sezione, **non oltre**: la sezione ritaglia
          quello che esce, e un ramo spinto sotto veniva reciso da una riga
          orizzontale in mezzo alle foglie. Il PNG si porta gia' un quinto di
          altezza trasparente in fondo, che fa da sfumatura senza bisogno di
          sbordare. Gli scarti in pixel fissi peggioravano su schermo stretto,
          dove il ramo e' meta' e il taglio lo stesso. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-20 w-[min(19rem,42vw)] opacity-[0.18] lg:-left-10"
      >
        <VineBranch className="w-full" />
      </div>


      <div className="container-gutter">
        <SplitHeading as="h2" className="nav-link text-accent-gold mb-12 block text-center">
          {title}
        </SplitHeading>

        <div ref={gridRef} className="grid grid-cols-2 items-start gap-6 lg:grid-cols-12 lg:gap-10">
          {TILES.map((tile) => (
            <figure
              key={tile.photos[0].src}
              data-tile
              className={`gsap-hidden relative overflow-hidden ${SHAPES[tile.shape]} ${tile.area} ${
                tile.offset ?? ''
              }`}
            >
              <RotatingPhoto
                photos={tile.photos}
                offset={tile.rotationOffset}
                alterna={tile.alterna}
                sizes="(min-width: 1024px) 25vw, 45vw"
              />
            </figure>
          ))}

          <div
            data-tile
            className="gsap-hidden relative col-span-2 flex flex-col items-center gap-8 py-10 text-center lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:py-0"
          >
            <p className="font-serif text-2xl md:text-3xl">{claim}</p>
            <CircleCTA label="Prenota" href={reservationCta.href} tone="dark" size={130} />
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          {instagramIsPlaceholder ? (
            <span
              data-placeholder={instagramHref}
              title={instagramHref}
              className="nav-link border-secondary/25 inline-flex items-center gap-3 rounded-full border px-7 py-4 opacity-50"
            >
              Seguici su Instagram
            </span>
          ) : (
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              className="nav-link border-secondary/25 hover:bg-secondary hover:text-primary inline-flex items-center gap-3 rounded-full border px-7 py-4 transition-colors duration-300 ease-out"
            >
              Seguici su Instagram
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
