import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/layout/PageHero'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { pageHeroes } from '@/lib/images'
import { addressLine, siteConfig } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Contatti e prenotazioni',
  description:
    'Contatta il Ristorante da Nunzio a Malcesine: Vicolo Casella 10, telefono +39 338 9019697. Orari 11:30–14:30 e 18:30–23:30. Prenota il tuo tavolo.',
  path: '/contact',
})

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.name}, ${addressLine}`
)}`

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contatti"
        title="Prenota il tuo tavolo"
        intro="Il modo più veloce per prenotare è una telefonata: rispondiamo noi. Se preferite scrivere, siamo su WhatsApp."
        image={pageHeroes.contatti}
      >
        {/* Solo il telefono: e' il recapito che il locale vuole in evidenza.
            Per scrivere c'e' il form qui sotto, e l'indirizzo email resta nel
            piede. */}
        <Button href={siteConfig.phoneHref} variant="gold">
          Chiama {siteConfig.phone}
        </Button>
      </PageHero>

      {/* L'ancora #prenota resta: e' la destinazione del bottone che ricorre in
          tutto il sito. Qui c'era anche un modulo per scrivere, tolto il
          02/09/2026 — si prenota al telefono. */}
      <section id="prenota" className="texture-marble-light section-y w-full scroll-mt-28">
        <div className="container-gutter mx-auto max-w-2xl">
          {/* riferimenti */}
          <Reveal delay={0.1}>
            <div className="border-secondary/15 flex flex-col gap-8 rounded-[2rem] border p-8 lg:p-10">
              <div>
                <h2 className="nav-link opacity-60">Il locale</h2>
                <p className="mt-4 font-serif text-2xl">{siteConfig.name}</p>
                <p className="mt-2 leading-relaxed opacity-70">
                  {siteConfig.location}
                  <br />
                  {addressLine}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-gold mt-4 inline-block underline underline-offset-4"
                >
                  Apri in Google Maps
                </a>
              </div>

              <div className="border-secondary/10 border-t pt-8">
                <h2 className="nav-link opacity-60">Telefono</h2>
                <p className="mt-4 leading-relaxed">
                  <a
                    href={siteConfig.phoneHref}
                    className="font-serif text-2xl transition-opacity duration-300 hover:opacity-70"
                  >
                    {siteConfig.phone}
                  </a>
                </p>
              </div>

              {/* WhatsApp: lo stesso numero del telefono, per chi preferisce
                  scrivere invece di chiamare. Ha preso il posto del modulo,
                  tolto il 02/09/2026: le risposte arrivano dove il locale gia'
                  guarda, invece che in una casella di posta.
                  `rel="noreferrer"` perche' apre fuori dal sito. */}
              <div className="border-secondary/10 border-t pt-8">
                <h2 className="nav-link opacity-60">WhatsApp</h2>
                <p className="mt-4 leading-relaxed opacity-70">
                  Preferite scrivere? Mandateci un messaggio.
                </p>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="border-secondary/25 hover:bg-secondary hover:text-primary mt-5 inline-flex items-center gap-3 rounded-full border px-6 py-3 transition-colors duration-300 ease-out"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
                  </svg>
                  Scrivici su WhatsApp
                </a>
              </div>

              <div className="border-secondary/10 border-t pt-8">
                <h2 className="nav-link opacity-60">Orari</h2>
                <p className="mt-4 leading-relaxed opacity-70">
                  Pranzo {siteConfig.hours.lunch.from}–{siteConfig.hours.lunch.to}
                  <br />
                  Cena {siteConfig.hours.dinner.from}–{siteConfig.hours.dinner.to}
                </p>
              </div>

              <div className="border-secondary/10 border-t pt-8">
                <h2 className="nav-link opacity-60">Dati fiscali</h2>
                <p className="mt-4 opacity-70">P.IVA {siteConfig.vatId}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
