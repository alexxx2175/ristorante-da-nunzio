import PlaceholderMedia from '@/components/ui/PlaceholderMedia'
import Reveal from '@/components/ui/Reveal'
import type { Photo } from '@/lib/images'

type SplitFeatureProps = {
  kicker?: string
  title: string
  paragraphs: string[]
  /** Foto del blocco (da lib/images). */
  image: Photo
  /** Immagine a destra invece che a sinistra. */
  reverse?: boolean
  /** Fondo chiaro piatto o texture marmo. */
  background?: 'light' | 'marble'
  children?: React.ReactNode
}

/**
 * Blocco testo + immagine, riutilizzato dalle pagine di contenuto.
 * Su mobile impila immagine e testo; da lg affianca due colonne.
 */
export default function SplitFeature({
  kicker,
  title,
  paragraphs,
  image,
  reverse = false,
  background = 'light',
  children,
}: SplitFeatureProps) {
  return (
    <section
      className={`${
        background === 'light' ? 'bg-bg-light' : 'texture-marble-light'
      } screen-section w-full`}
    >
      <div className="container-gutter grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        {/* max-h: senza tetto l'aspect-ratio farebbe sfondare la schermata */}
        <div
          className={`relative aspect-[4/5] max-h-[42svh] overflow-hidden lg:aspect-[3/4] lg:max-h-[68svh] ${
            reverse ? 'lg:order-2' : ''
          }`}
        >
          <PlaceholderMedia
            token="[FOTO-BLOCCO]"
            {...image}
            sizes="(min-width: 1024px) 45vw, 90vw"
          />
        </div>

        <Reveal>
          {kicker ? <h2 className="nav-link text-accent-gold">{kicker}</h2> : null}

          <p className="mt-6 font-serif text-3xl leading-tight md:text-4xl">{title}</p>

          <div className="mt-8 flex flex-col gap-5 leading-relaxed opacity-80">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  )
}
