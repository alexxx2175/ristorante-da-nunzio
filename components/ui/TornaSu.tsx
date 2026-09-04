'use client'

import { getLenis } from '@/lib/useLenis'

/**
 * La freccia che riporta in cima, in fondo a ogni pagina.
 *
 * Ha preso il posto di una seconda barra di navigazione, che ripeteva le stesse
 * quattro voci della testata a un dito di distanza dal piede. Chi arriva in
 * fondo non ha bisogno di un altro menu: ha bisogno di **tornare a quello che
 * c'e' gia'**, che e' fisso in cima. Per questo la freccia risale la pagina e
 * non porta da nessuna parte: resta dove sei.
 *
 * Risale con **Lenis**, non con `window.scrollTo`: il sito ha lo scorrimento
 * inerziale montato su `document.documentElement`, e uno scroll nativo gli
 * passerebbe sotto — la pagina salterebbe e Lenis la riporterebbe indietro
 * inseguendo la sua posizione interna. Quando Lenis non c'e' (reduced-motion,
 * o prima che sia montato) si usa quello del browser, e li' senza animazione:
 * chi ha chiesto meno movimento non vuole nemmeno questo.
 */
export default function TornaSu() {
  const risali = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 })
      return
    }
    const fermo = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: fermo ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={risali}
      aria-label="Torna in cima alla pagina"
      className="border-secondary/25 hover:bg-secondary hover:text-primary flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300 ease-out"
    >
      {/* La stessa freccia della hero, rovesciata: li' invita a scendere, qui a
          risalire. Stesso disegno perche' e' lo stesso gesto, al contrario. */}
      <svg width="14" height="26" viewBox="0 0 14 26" fill="none" aria-hidden>
        <path d="M7 26V2M1 8l6-6 6 6" stroke="currentColor" strokeWidth="1" />
      </svg>
    </button>
  )
}
