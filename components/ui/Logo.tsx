import Link from 'next/link'
import { siteConfig } from '@/lib/site'

type LogoProps = {
  /**
   * `sm` per la testata rimpicciolita, `md` per quella alta, `grande` per il
   * marchio in filigrana in fondo alla pagina.
   */
  size?: 'sm' | 'md' | 'grande'
  className?: string
}

/**
 * Il marchio del locale: il ritratto e la firma «da Nunzio», **affiancati**.
 *
 * Nel disegno originale la firma sta sotto al ritratto, e in una testata alta
 * ottanta pixel finiva schiacciata in una striscia di venti: c'era, ma non si
 * leggeva. Di lato la firma prende tutta l'altezza che le serve e il marchio
 * cresce in larghezza, dove lo spazio c'e'.
 *
 * Sono due file perche' vanno **impaginati**, non solo mostrati: distanza fra i
 * due pezzi e proporzione fra loro sono decisioni che cambiano con la misura, e
 * dentro un'immagine sola sarebbero congelate. Li ho staccati per macchie
 * d'inchiostro attaccate — il ritratto e la firma non si toccano mai — e non
 * con un taglio orizzontale, che avrebbe mangiato la punta del bavero.
 *
 * **Sono maschere, non immagini**, riempite con `currentColor`: il disegno e'
 * nero su crema e la testata cambia colore mentre si scorre. Cosi' il marchio
 * prende il colore del testo che ha attorno — bianco sopra al video, nero caldo
 * sulla barra chiara — con un file solo per stato e la dissolvenza gia' pronta.
 *
 * Il nome del locale non e' scritto in lettere: sta nell'`aria-label` del
 * collegamento, che e' quello che leggono gli screen reader e i motori.
 */

/* La firma sta al 45% dell'altezza del ritratto: sotto sparisce, sopra pesa piu'
   del volto. Nell'originale, impilata, stava al 38%, ma li' era larga quanto
   tutto il marchio e poteva permetterselo. */
const MISURE = {
  sm: { spazio: 'gap-2.5', ritratto: 'h-11 xl:h-14', firma: 'h-5 xl:h-6' },
  md: { spazio: 'gap-3 xl:gap-4', ritratto: 'h-16 xl:h-18', firma: 'h-7 xl:h-8' },
  grande: { spazio: 'gap-5 sm:gap-7', ritratto: 'h-24 sm:h-32', firma: 'h-11 sm:h-14' },
} as const

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const m = MISURE[size]
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={`inline-flex items-center ${m.spazio} ${className}`}
    >
      <span aria-hidden className={`marchio-ritratto block ${m.ritratto}`} />
      <span aria-hidden className={`marchio-firma block ${m.firma}`} />
    </Link>
  )
}
