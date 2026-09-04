import Link from 'next/link'
import Button from '@/components/ui/Button'
import FooterVine from '@/components/layout/FooterVine'
import TornaSu from '@/components/ui/TornaSu'
import { addressLine, reservationCta, siteConfig } from '@/lib/site'

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.name}, ${addressLine}`
)}`

function SocialIcon({ name }: { name: string }) {
  if (name === 'Facebook') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M9.6 15V8.8h2.1l.3-2.4H9.6V5c0-.7.2-1.2 1.2-1.2h1.3V1.6C11.7 1.6 11 1.5 10.2 1.5 8.4 1.5 7.1 2.6 7.1 4.7v1.7H5v2.4h2.1V15h2.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'Instagram') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect
          x="1.4"
          y="1.4"
          width="13.2"
          height="13.2"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="11.9" cy="4.1" r="0.9" fill="currentColor" />
      </svg>
    )
  }

  /* TripAdvisor: marchio semplificato (due "occhi"). */
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      <circle cx="5.2" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12.8" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="5.2" cy="7" r="1.3" fill="currentColor" />
      <circle cx="12.8" cy="7" r="1.3" fill="currentColor" />
    </svg>
  )
}

/**
 * Footer presente in tutte le pagine: dati del locale, orari, contatti,
 * partita IVA e social. E' l'unico posto in cui compaiono tutti insieme.
 *
 * Non ha `screen-section`: e' il suo contenuto a dettarne l'altezza.
 */
export default function Footer() {
  return (
    <footer>
      {/* ---- blocco chiaro: torna in cima --------------------------------
          Qui c'era una seconda barra di navigazione con le stesse quattro voci
          della testata. Ripeterle a un dito dal piede non aggiungeva niente:
          la testata e' fissa e non se ne va mai. Al suo posto una freccia che
          risale la pagina **restando dove sei**, e da lassu' il menu c'e'
          gia'. */}
      <div className="text-secondary border-secondary/10 border-t">
        <div className="container-gutter flex justify-center py-8">
          <TornaSu />
        </div>
      </div>

      {/* ---- blocco scuro: contatti e info pratiche ---------------------- */}
      <div className="texture-marble-dark text-primary relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-black/55" />

        {/* La vite del pergolato: sopra la velatura, altrimenti sparirebbe.
            Entra da destra quando il footer arriva in viewport, e torna
            indietro risalendo. */}
        <FooterVine />

        <div className="container-gutter relative py-14 lg:py-20">
          {/* telefono + CTA */}
          <div className="flex flex-col gap-6 border-b border-white/15 pb-10 md:flex-row md:items-end md:justify-between">
            <a
              href={siteConfig.phoneHref}
              className="text-display-cta font-serif transition-opacity duration-300 ease-out hover:opacity-70"
            >
              {siteConfig.phone}
            </a>

            <Button href={reservationCta.href} variant="gold">
              {reservationCta.label}
            </Button>
          </div>

          {/* colonne info */}
          <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h2 className="nav-link font-sans opacity-60">Dove siamo</h2>
              <p className="mt-4 leading-relaxed">
                {siteConfig.location}
                <br />
                {addressLine}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent-gold mt-3 inline-block transition-opacity duration-300 hover:opacity-70"
              >
                Apri in Google Maps
              </a>
            </div>

            <div>
              <h2 className="nav-link font-sans opacity-60">Orari</h2>
              <p className="mt-4 leading-relaxed">
                Pranzo {siteConfig.hours.lunch.from}–{siteConfig.hours.lunch.to}
                <br />
                Cena {siteConfig.hours.dinner.from}–{siteConfig.hours.dinner.to}
              </p>
            </div>

            <div>
              <h2 className="nav-link font-sans opacity-60">Contatti</h2>
              <p className="mt-4 flex flex-col gap-1 leading-relaxed">
                <a href={siteConfig.phoneHref} className="hover:opacity-70">
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="hover:opacity-70">
                  {siteConfig.email}
                </a>
              </p>
            </div>

            <div>
              <h2 className="nav-link font-sans opacity-60">Follow us</h2>
              <ul className="mt-4 flex items-center gap-3">
                {siteConfig.social.map((profile) => {
                  const isPlaceholder = profile.href.startsWith('[')
                  const shell =
                    'flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 ease-out'

                  return (
                    <li key={profile.label}>
                      {isPlaceholder ? (
                        <span
                          className={`${shell} opacity-40`}
                          title={`${profile.label}: ${profile.href}`}
                          data-placeholder={profile.href}
                          aria-hidden
                        >
                          <SocialIcon name={profile.label} />
                        </span>
                      ) : (
                        <a
                          href={profile.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={profile.label}
                          className={`${shell} hover:border-accent-gold hover:text-accent-gold`}
                        >
                          <SocialIcon name={profile.label} />
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* barra finale */}
          <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-[0.6875rem] tracking-wider uppercase opacity-50 md:flex-row md:justify-between">
            <p>
              {siteConfig.name} — P.IVA {siteConfig.vatId}
            </p>
            <p className="flex gap-4">
              <span>© {new Date().getFullYear()} Tutti i diritti riservati</span>
              {/* Il pannello del menu. Sta qui, in fondo e in piccolo, perche'
                  serve a due persone e lo vedrebbero tutti i clienti: la
                  protezione e' la password, ma non annunciarlo evita comunque
                  qualche tentativo a caso. */}
              <Link href="/admin" className="underline underline-offset-4 hover:opacity-70">
                Gestione
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
