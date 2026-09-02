'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import MobileNav from './MobileNav'
import { navItems, reservationCta } from '@/lib/site'

/**
 * Header fisso e sempre raggiungibile, cosi' la CTA "Prenota il tuo tavolo"
 * resta a portata di clic su tutta la pagina.
 *
 * Due stati:
 *  - in cima  -> fondo trasparente, testo bianco, sopra la hero scura;
 *  - scrollato -> fondo crema, testo scuro, altezza ridotta.
 *
 * La nav completa compare da `xl` (1280px): sotto quella soglia le sei voci non
 * stanno su una riga senza abbreviarle, quindi si passa al menu off-canvas.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* `intro-header` solo sulla home, e solo se non si e' gia' scrollato.
          Li' i primi due secondi si vede il solo video e poi si compone il
          sito; sulle altre pagine non c'e' nessuna inquadratura da lasciar
          respirare, e un header che tarda sarebbe solo un header lento.

          La condizione su `scrolled` serve a chi torna in home da un'altra
          pagina con la pagina gia' scorsa: li' l'apertura non ha senso. */}
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 ${
          pathname === '/' && !scrolled ? 'intro-header' : ''
        } ${
          scrolled
            ? 'text-secondary bg-bg-light/95 shadow-[0_1px_0_rgba(23,19,15,0.08)] backdrop-blur-md'
            : 'text-primary'
        }`}
      >
        <div
          className={`container-gutter flex items-center justify-between gap-8 ${
            scrolled ? 'h-16 xl:h-20' : 'h-20 xl:h-(--spacing-header)'
          }`}
        >
          <Logo size={scrolled ? 'sm' : 'md'} />

          <nav aria-label="Navigazione principale" className="hidden xl:block">
            <ul className="flex items-center gap-6 fhd:gap-8">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`nav-underline font-sans text-[0.6875rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase transition-opacity duration-300 ease-out hover:opacity-60 fhd:text-xs ${
                        active ? 'opacity-100' : 'opacity-80'
                      }`}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden
                          className="bg-accent-gold mt-1.5 block h-px w-full origin-left"
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {/* Il display sta sul wrapper, non sul Button: la base del Button
                contiene gia' `inline-flex`, e nel foglio di stile `.inline-flex`
                viene DOPO `.hidden`. A parita' di specificita' vince l'ultima,
                quindi un `hidden` passato via className non nasconderebbe nulla
                — l'ordine nell'attributo class non conta. */}
            <span className="hidden sm:block">
              <Button
                href={reservationCta.href}
                variant="gold"
                className="px-5 py-3 text-[0.6875rem] tracking-[0.14em] whitespace-nowrap"
              >
                {reservationCta.label}
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Apri il menu di navigazione"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="p-2 xl:hidden"
            >
              <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden>
                <path d="M0 1h26M0 13h18" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
