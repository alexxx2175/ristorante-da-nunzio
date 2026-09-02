/* NON IN USO. Prima prova dell'arco di pietra, scartata il 30/08/2026:
   il piatto disegnato non convinceva. Le fotografie le fa il locale, e
   l'idea e' animarle. Tenuto perche' il progetto non e' sotto controllo
   di versione — l'arco in se' potrebbe tornare utile come cornice. */
import Reveal from '@/components/ui/Reveal'
import StoneArch from '@/components/ui/StoneArch'
import ForkDish from '@/components/ui/ForkDish'

/**
 * L'arco di pietra con dentro un pacchero e una cozza sulla forchetta.
 *
 * Due livelli sovrapposti che condividono lo stesso sistema di coordinate
 * (viewBox 0 0 400 560): l'arco disegnato e, dentro il suo vuoto, il piatto.
 * Sono separati apposta — l'arco e' la cornice fissa, quello che ci sta dentro
 * puo' cambiare senza ridisegnare la pietra.
 *
 * Gli ingredienti che fluttuano intorno non ci sono ancora: quando arriveranno,
 * il posto e' il livello sopra a questi due, fuori dalla sagoma dell'arco.
 */
export default function ArchFeature() {
  return (
    <section className="w-full py-16 lg:py-24">
      <Reveal>
        <div className="relative mx-auto w-[min(32rem,84vw)]">
          <StoneArch className="text-secondary/45 w-full" />
          <ForkDish className="absolute inset-0 h-full w-full" />
        </div>
      </Reveal>
    </section>
  )
}
