'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import PlaceholderMedia from '@/components/ui/PlaceholderMedia'
import { backgrounds } from '@/lib/images'
import { getLenis } from '@/lib/useLenis'
import { addressLine, hoursLine, navItems, reservationCta, siteConfig } from '@/lib/site'

type MobileNavProps = {
  open: boolean
  onClose: () => void
}

/**
 * Menu off-canvas full-screen (entra da destra), attivo sotto i 1280px.
 * Oltre alle voci di navigazione porta la CTA di prenotazione e i contatti,
 * cosi' da mobile telefono e indirizzo sono sempre a un tap.
 */
export default function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    // `overflow:hidden` sul body non basta: Lenis muove la pagina per conto
    // proprio e continuerebbe a scorrere dietro all'overlay. Va fermata.
    const lenis = getLenis()
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    lenis?.stop()
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-nav"
      aria-hidden={!open}
      className={`text-primary fixed inset-0 z-100 transition-transform duration-500 xl:hidden ${
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-soft)' }}
    >
      <div className="bg-bg-dark absolute inset-0 -z-10">
        <PlaceholderMedia token="[FOTO-SFONDO-MENU]" {...backgrounds.menuMobile} />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="container-gutter flex h-full flex-col justify-between gap-8 overflow-y-auto py-7">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi il menu"
            className="nav-link p-2 transition-opacity duration-300 hover:opacity-60"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M2 2 20 20M20 2 2 20" stroke="currentColor" strokeWidth="1.25" />
            </svg>
          </button>
        </div>

        <nav aria-label="Navigazione principale">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="inline-block font-serif text-3xl transition-opacity duration-300 hover:opacity-60 sm:text-4xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Button
            href={reservationCta.href}
            variant="gold"
            className="mt-8"
            onClick={onClose}
          >
            {reservationCta.label}
          </Button>
        </nav>

        <div className="flex flex-col gap-1 border-t border-white/20 pt-6 opacity-75">
          <a href={siteConfig.phoneHref} className="hover:opacity-70">
            {siteConfig.phone}
          </a>
          <a href={`mailto:${siteConfig.email}`} className="hover:opacity-70">
            {siteConfig.email}
          </a>
          <p>{addressLine}</p>
          <p>{hoursLine}</p>
        </div>
      </div>
    </div>
  )
}
