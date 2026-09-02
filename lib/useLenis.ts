'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

/**
 * Istanza corrente, a livello di modulo.
 *
 * Serve a chi deve fermare lo scroll senza stare dentro l'albero React che monta
 * Lenis — il menu off-canvas, per esempio. Mettere `overflow:hidden` sul body
 * non basta: Lenis muove la pagina per conto suo e continuerebbe a scorrere
 * dietro all'overlay.
 */
let current: Lenis | null = null

/** Ritorna l'istanza attiva, o `null` (reduced-motion, o non ancora montata). */
export function getLenis(): Lenis | null {
  return current
}

/**
 * Smooth scroll inerziale globale sincronizzato con il ticker di GSAP, cosi'
 * che ScrollTrigger legga sempre la posizione interpolata da Lenis e non quella
 * nativa.
 *
 * Va montato UNA VOLTA sola, nel layout globale.
 *
 * Ritorna un ref all'istanza, come maniglia per eventuali scroll programmatici
 * (`lenis.scrollTo(...)`). Oggi nessuno lo usa.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  // ScrollTrigger memorizza le posizioni di start/end al momento della
  // creazione. Sulla home il layout cambia DOPO il primo paint (font swap,
  // init di Swiper, immagini/video che caricano): senza refresh i trigger
  // restano ancorati a coordinate sbagliate e alcune animazioni non partono
  // mai. Qui li ricalcoliamo a ogni variazione di altezza del documento.
  useEffect(() => {
    // Debounce vero, non coalescenza a frame: ScrollTrigger.refresh() rimisura
    // ogni trigger della pagina ed e' costoso. Se il ResizeObserver si attiva
    // ripetutamente mentre si scorre, chiamarlo a ogni frame si vede — la
    // pagina perde frame proprio durante il movimento. Aspettiamo che le
    // altezze si assestino e poi rimisuriamo una volta sola.
    let timer: ReturnType<typeof setTimeout> | undefined
    const refresh = () => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 200)
    }

    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    const observer = new ResizeObserver(refresh)
    observer.observe(document.body)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', refresh)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    // Con reduced-motion attivo lasciamo lo scroll nativo del browser.
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      // `lerp` invece di `duration` + easing.
      //
      // Con `duration` ogni evento di rotella fa ripartire un'animazione di
      // 1.2s verso un bersaglio: girando la rotella piu' volte di fila le
      // animazioni si accavallano e la pagina continua a scivolare per piu' di
      // un secondo dopo che hai smesso. Si legge come ritardo, non come
      // fluidita', ed e' il momento in cui sembra che il sito "vada per conto
      // suo".
      //
      // `lerp` insegue la posizione reale di continuo: risponde subito, si
      // ferma quando ti fermi, e non ha una durata da concludere.
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    lenisRef.current = instance
    current = instance

    instance.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
      lenisRef.current = null
      current = null
    }
  }, [])

  return lenisRef
}
