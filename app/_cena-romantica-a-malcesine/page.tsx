/* FUORI DAL SITO dal 01/09/2026, su richiesta del locale.
   La cartella comincia con un trattino basso: nel routing di Next una cartella
   `_cosi` esce dalle rotte con tutto quello che contiene (vedi
   node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md).
   La pagina non e' stata cancellata: per rimetterla online si toglie il
   trattino basso dal nome della cartella e si rimette la voce in `navItems`.
   La sitemap si genera dalla navigazione, quindi si aggiorna da sola. */
import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/layout/PageHero'
import PhotoCarousel from '@/components/sections/PhotoCarousel'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { pageHeroes } from '@/lib/images'
import { reservationCta, siteConfig } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Cena romantica a Malcesine',
  description:
    'Una cena romantica sul Lago di Garda, nel centro storico di Malcesine: luci basse, ritmo lento e la cucina dello chef Nunzio. Prenota il tuo tavolo.',
  path: '/cena-romantica-a-malcesine',
})

export default function CenaRomanticaPage() {
  return (
    <>
      <PageHero
        kicker="Cena romantica sul Lago di Garda"
        title="Una serata che vale il viaggio"
        intro="Il centro storico si svuota, le luci si abbassano, il lago resta. Da Nunzio la cena romantica non è un allestimento: è quello che succede naturalmente a Malcesine, quando il sole scende dietro il Monte Baldo."
        image={pageHeroes.cenaRomantica}
      >
        <Button href={reservationCta.href} variant="gold">
          {reservationCta.label}
        </Button>
      </PageHero>

      <section className="section-y w-full">
        <div className="container-gutter mx-auto max-w-3xl text-center">
          <Reveal>
            <blockquote className="font-serif text-3xl leading-snug md:text-[2.75rem]">
              «Il lago non ha fretta: aspetta che siate pronti a rallentare.»
            </blockquote>
            <p className="nav-link mt-8 opacity-50">Da Nunzio, Malcesine</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-16 flex flex-col gap-5 text-left leading-relaxed opacity-80">
              <p>
                Ci sono cene che si ricordano per un piatto e cene che si ricordano per come vi
                siete sentiti. Noi lavoriamo sulla seconda cosa: tavoli distanziati, servizio che
                non interrompe, tempi lasciati liberi di allungarsi.
              </p>
              <p>
                Siamo in Vicolo Casella, nel cuore del centro storico, tra il Porto Vecchio e
                Piazza Statuto: si arriva a piedi e, dopo cena, ci si perde volentieri tra i vicoli
                fino alla riva.
              </p>
              <p>
                Se avete un&apos;occasione da festeggiare — un anniversario, una domanda da fare,
                una sera che volete diversa dalle altre — ditecelo quando prenotate. Ce ne
                occupiamo noi.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={reservationCta.href} variant="gold">
              {reservationCta.label}
            </Button>
            <Button href={siteConfig.phoneHref} variant="outline" tone="dark">
              {siteConfig.phone}
            </Button>
          </div>
        </div>
      </section>

      <PhotoCarousel title="Malcesine, di sera" />
    </>
  )
}
