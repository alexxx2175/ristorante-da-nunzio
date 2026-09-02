'use client'

import SplitType from 'split-type'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

/**
 * Helper GSAP/ScrollTrigger riutilizzabili da tutte le pagine.
 * Ogni helper ritorna una funzione di cleanup da chiamare nell'unmount.
 *
 * Nota: dalla 3.13 anche SplitText e' incluso nel pacchetto gsap; qui usiamo
 * split-type per restare su una dipendenza minima e senza plugin registration.
 */

type Cleanup = () => void

const noop: Cleanup = () => {}

/** Entrata one-shot: fade + slide-up quando l'elemento entra nel viewport. */
export function fadeInUp(
  target: gsap.TweenTarget,
  options: { y?: number; duration?: number; delay?: number; start?: string } = {}
): Cleanup {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 })
    return noop
  }

  const { y = 30, duration = 0.9, delay = 0, start = 'top 85%' } = options

  const tween = gsap.fromTo(
    target,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: target as gsap.DOMTarget, start, once: true },
    }
  )

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

/** Entrata one-shot a cascata su piu' elementi (gallery, liste, card). */
export function staggerFade(
  targets: gsap.TweenTarget,
  options: { y?: number; stagger?: number; start?: string; trigger?: Element | null } = {}
): Cleanup {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return noop
  }

  const { y = 24, stagger = 0.08, start = 'top 80%', trigger } = options

  const tween = gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger,
      /* A fine corsa GSAP lascerebbe un `transform: translate(0,0)` su ogni
         elemento. Visivamente non cambia niente, ma **un antenato trasformato
         diventa il riferimento dei discendenti `position: fixed`**, che quindi
         smettono di ancorarsi allo schermo. E' successo con la foto del piatto
         nel menu: compariva a meta' pagina invece che in basso. Ripulirlo qui
         evita il problema alla radice, e toglie una trasformazione inline da
         ogni voce. */
      clearProps: 'transform',
      scrollTrigger: {
        trigger: trigger ?? (targets as gsap.DOMTarget),
        start,
        once: true,
      },
    }
  )

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

/**
 * Text reveal "scrubbed": il testo viene splittato in parole e ogni parola
 * passa dal grigio muted al colore pieno seguendo esattamente la posizione di
 * scroll (scrub, non entrance animation).
 */
export function textReveal(
  element: HTMLElement | null,
  options: { from?: string; to?: string; start?: string; end?: string } = {}
): Cleanup {
  if (!element) return noop

  const {
    from = 'var(--color-text-muted)',
    to = 'var(--color-secondary)',
    start = 'top 75%',
    end = 'bottom 55%',
  } = options

  if (prefersReducedMotion()) {
    element.style.color = to
    return noop
  }

  const split = new SplitType(element, { types: 'words', tagName: 'span' })
  const words = split.words ?? []

  gsap.set(words, { color: from })

  const tween = gsap.to(words, {
    color: to,
    ease: 'none',
    stagger: 1, // valore relativo: con scrub distribuisce le parole sul range
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true,
    },
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    split.revert()
  }
}

/**
 * Parallax leggero legato allo scroll (equivalente di ukiyo.js / parallax.js
 * usati sull'originale per i layer decorativi fluttuanti).
 */
export function scrollParallax(
  targets: gsap.TweenTarget,
  options: { distance?: number; trigger?: Element | null } = {}
): Cleanup {
  if (prefersReducedMotion()) return noop

  const { distance = 80, trigger } = options

  const tween = gsap.to(targets, {
    y: () => -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger ?? (targets as gsap.DOMTarget),
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

/**
 * Parallax al movimento del mouse: ogni elemento con `data-depth` si sposta di
 * una quantita' proporzionale alla propria profondita'.
 */
export function mouseParallax(
  container: HTMLElement | null,
  options: { strength?: number } = {}
): Cleanup {
  if (!container || prefersReducedMotion()) return noop

  const { strength = 30 } = options
  const layers = Array.from(container.querySelectorAll<HTMLElement>('[data-depth]'))
  if (layers.length === 0) return noop

  const setters = layers.map((layer) => ({
    depth: Number(layer.dataset.depth ?? 0.2),
    x: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3.out' }),
    y: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3.out' }),
  }))

  const onMove = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5

    setters.forEach(({ depth, x, y }) => {
      x(nx * strength * depth * 2)
      y(ny * strength * depth * 2)
    })
  }

  const onLeave = () => setters.forEach(({ x, y }) => (x(0), y(0)))

  container.addEventListener('pointermove', onMove)
  container.addEventListener('pointerleave', onLeave)

  return () => {
    container.removeEventListener('pointermove', onMove)
    container.removeEventListener('pointerleave', onLeave)
    setters.forEach(({ x, y }) => (x(0), y(0)))
  }
}

/**
 * Crossfade a loop lento tra piu' layer sovrapposti.
 *
 * **Oggi non lo usa nessuna sezione.** Lo usava la hero per alternare tre
 * fotografie; adesso la hero e' un video in loop. Resta qui perche' e' un
 * pezzo generico della cassetta degli attrezzi, non codice legato a una
 * sezione: serve appena si vogliono alternare piu' sfondi da qualche parte.
 */
export function crossfadeLoop(
  layers: HTMLElement[],
  options: { hold?: number; fade?: number } = {}
): Cleanup {
  if (layers.length < 2) return noop

  const { hold = 4, fade = 1.6 } = options

  if (prefersReducedMotion()) {
    gsap.set(layers, { opacity: 0 })
    gsap.set(layers[0], { opacity: 1 })
    return noop
  }

  gsap.set(layers, { opacity: 0 })
  gsap.set(layers[0], { opacity: 1 })

  const tl = gsap.timeline({ repeat: -1 })

  layers.forEach((layer, index) => {
    const next = layers[(index + 1) % layers.length]
    tl.to(layer, { opacity: 0, duration: fade, ease: 'none' }, `+=${hold}`).to(
      next,
      { opacity: 1, duration: fade, ease: 'none' },
      '<'
    )
  })

  return () => {
    tl.kill()
  }
}

/**
 * Rivelazione carattere per carattere all'ingresso in viewport: ogni lettera
 * entra da destra con un fade. One-shot.
 *
 * Da usare sui titoli brevi. Su un paragrafo lungo produce centinaia di <span>
 * e il costo di layout si sente: per i testi lunghi c'e' `textReveal`, che
 * lavora sulle parole.
 */
export function charReveal(
  element: HTMLElement | null,
  options: { stagger?: number; x?: number; duration?: number; start?: string } = {}
): Cleanup {
  if (!element) return noop

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 })
    return noop
  }

  const { stagger = 0.03, x = 40, duration = 0.5, start = 'top 80%' } = options

  const split = new SplitType(element, { types: 'words,chars', tagName: 'span' })
  const chars = split.chars ?? []

  const tween = gsap.fromTo(
    chars,
    { opacity: 0, x },
    {
      opacity: 1,
      x: 0,
      duration,
      ease: 'power2.out',
      stagger,
      scrollTrigger: { trigger: element, start, once: true },
    }
  )

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    split.revert()
  }
}

/**
 * Rivelazione carattere per carattere **agganciata alla posizione di scroll**
 * (scrub), non a un tempo fisso: le lettere compaiono mentre si scorre e
 * tornano indietro se si risale.
 *
 * Diverso da `textReveal`, che colora le parole gia' visibili: qui i caratteri
 * partono trasparenti e leggermente schiacciati, e si raddrizzano.
 *
 * `scrub` e' il ritardo con cui l'animazione insegue lo scroll. Era 2: un
 * valore alto ammorbidisce, ma il titolo resta bianco per oltre un secondo
 * dopo che sei arrivato sulla sezione, e sembra che non parta. 0.6 toglie la
 * scattosita' legata alla rotella senza far aspettare.
 */
export function charScrub(
  element: HTMLElement | null,
  options: { start?: string; end?: string; stagger?: number; scrub?: number } = {}
): Cleanup {
  if (!element) return noop

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 })
    return noop
  }

  const { start = 'top 80%', end = '+=40%', stagger = 0.04, scrub = 0.6 } = options

  const split = new SplitType(element, { types: 'words,chars', tagName: 'span' })
  const chars = split.chars ?? []

  gsap.set(chars, {
    opacity: 0,
    yPercent: -15,
    scaleX: 0.7,
    transformOrigin: '50% 0%',
  })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: element, start, end, scrub },
  })

  chars.forEach((char, index) => {
    tl.to(
      char,
      { opacity: 1, yPercent: 0, scaleX: 1, duration: 0.3, ease: 'none' },
      index * stagger
    )
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    split.revert()
  }
}

/**
 * L'immagine si scopre da sinistra a destra con una maschera a gradiente,
 * invece di comparire in dissolvenza.
 *
 * Lo stato iniziale (`mask-size: 0% 100%`) lo mette la classe `.mask-reveal` in
 * globals.css: se lo impostasse questo helper, un utente con reduced-motion
 * vedrebbe l'immagine sparire per un istante prima di essere ripristinata.
 */
export function maskReveal(
  targets: gsap.TweenTarget,
  options: { duration?: number; start?: string } = {}
): Cleanup {
  const full = { maskSize: '1000% 100%', webkitMaskSize: '1000% 100%' }

  if (prefersReducedMotion()) {
    gsap.set(targets, full)
    return noop
  }

  const { duration = 1.6, start = 'top 85%' } = options

  const tween = gsap.to(targets, {
    ...full,
    duration,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: targets as gsap.DOMTarget, start, once: true },
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

/**
 * Entrata laterale: l'elemento arriva da fuori schermo e torna indietro
 * risalendo (`toggleActions` con reverse), invece di restare piantato.
 */
export function slideInX(
  target: HTMLElement | null,
  options: { from?: string; trigger?: Element | null; duration?: number } = {}
): Cleanup {
  if (!target) return noop

  if (prefersReducedMotion()) {
    gsap.set(target, { x: 0 })
    return noop
  }

  const { from = '150%', trigger, duration = 1 } = options

  const tween = gsap.fromTo(
    target,
    { x: from },
    {
      x: '0%',
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger ?? target,
        start: 'top 90%',
        end: 'bottom 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
  }
}

/**
 * Titolo "riempito" da un gradiente che scorre quando entra in viewport.
 *
 * L'animazione e' CSS (`.animated-text` in globals.css): qui si aggiunge solo
 * la classe che la fa partire, una volta sola. Con reduced-motion non si
 * aggiunge niente e il testo resta pieno, perche' lo stato di riposo della
 * classe e' gia' quello leggibile.
 */
export function gradientFill(element: HTMLElement | null): Cleanup {
  if (!element || prefersReducedMotion()) return noop

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-filled')
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  observer.observe(element)
  return () => observer.disconnect()
}


export { gsap, ScrollTrigger }
