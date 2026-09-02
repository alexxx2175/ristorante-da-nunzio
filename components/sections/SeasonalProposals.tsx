import Button from '@/components/ui/Button'
import VineBranch from '@/components/ui/VineBranch'
import SplitHeading from '@/components/ui/SplitHeading'
import SeasonalPlates from '@/components/sections/SeasonalPlates'
import { seasonalPlates } from '@/lib/images'
import { siteConfig } from '@/lib/site'

/**
 * "Le nostre proposte stagionali": una selezione di piatti, per immagini.
 *
 * Un carosello di piatti che avanza da solo: quello al centro si raddrizza,
 * gli altri restano inclinati. Vedi `SeasonalPlates`. Prima c'erano delle clip
 * — 21MB di video per la stessa cosa che ora fanno sette fotografie.
 *
 * Volutamente senza nomi di piatto, ingredienti o prezzi. Non e' una sezione
 * lasciata a meta': sono le immagini a raccontare la cucina, e il testo manda
 * al telefono e al menù per il dettaglio. Dedurre una ricetta da una ripresa
 * significherebbe pubblicare un menù inventato — sbagliato in generale, ancora
 * di piu' dove ci sono allergeni di mezzo.
 *
 * Per aggiungere i nomi quando la cucina li conferma: i piatti hanno gia' un
 * testo alternativo in `dishPhoto`, basta stamparlo.
 */
export default function SeasonalProposals() {
  return (
    /* Niente `screen-section` qui: la parte alta e' testo, e la fascia dei
       piatti si porta la propria altezza. */
    <section className="relative w-full overflow-hidden py-14 lg:py-20">
      {/* Un ramo dietro al titolo, dalla parte opposta a quello dello chef qui sopra:
          alternandoli non sembrano una cornice ripetuta. */}
      {/* Appoggiato al bordo, **non oltre**: quello che esce la sezione lo
          ritaglia, e un ramo spinto fuori veniva reciso da una riga dritta in
          mezzo alle foglie. Il PNG ha gia' un ottavo di altezza trasparente in
          cima, che fa da sfumatura senza bisogno di sbordare. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 -left-24 w-[min(18rem,40vw)] opacity-20 lg:-left-14"
      >
        <VineBranch className="w-full" />
      </div>


      <div className="container-gutter mx-auto max-w-6xl text-center">
        <h2 className="nav-link text-accent-gold">Le nostre proposte stagionali</h2>

        <SplitHeading mode="gradient" className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
          Quello che il mercato porta in cucina, stagione dopo stagione
        </SplitHeading>

        <p className="mx-auto mt-6 max-w-xl leading-relaxed opacity-70">
          Cambiano con la stagione e con quello che troviamo al mercato. Per sapere cosa vi
          aspetta in tavola oggi, chiamateci: siamo i primi a raccontarvelo volentieri.
        </p>

      </div>

      <div className="mt-10">
        <SeasonalPlates piatti={seasonalPlates} />
      </div>

      <div className="container-gutter mx-auto mt-12 flex max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row">
        <Button href={siteConfig.phoneHref} variant="gold">
          {siteConfig.phone}
        </Button>
        <Button href="/menu-ristorante" variant="outline" tone="dark">
          Vai al menù ristorante
        </Button>
      </div>
    </section>
  )
}
