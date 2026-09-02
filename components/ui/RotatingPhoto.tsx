'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'
import type { Photo } from '@/lib/images'

type RotatingPhotoProps = {
  photos: Photo[]
  /**
   * Sfasamento iniziale. Due tessere che cambiano nello stesso istante si
   * leggono come un effetto meccanico: sfalsandole sembra che la griglia
   * respiri.
   */
  offset?: number
  sizes?: string
  /**
   * Alterna piatti e locale invece di mescolare tutto insieme.
   *
   * Serve alle tessere tonde della gallery: i piatti stanno solo li', e devono
   * darsi il cambio con le foto del locale invece di uscire a grappoli.
   */
  alterna?: boolean
}

/** Quanto scroll fa passare alla foto dopo. */
const PASSO_PX = 520

/** Gli indici passati, rimescolati con Fisher-Yates. */
function mescola(indici: number[]): number[] {
  const a = [...indici]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Ordine che **alterna** piatti e locale: piatto, sala, piatto, sala.
 *
 * Le due categorie si mescolano separatamente e poi si intercalano. Cosi'
 * l'alternanza e' garantita per costruzione e non lasciata al caso — mettere le
 * foto alternate nell'elenco non basterebbe, perche' il rimescolamento la
 * disferebbe.
 *
 * Quando le due liste non sono lunghe uguali, alla fine del giro restano due
 * foto della stessa categoria di fila. E' il prezzo per mostrare tutti i piatti
 * disponibili invece di scartarne un paio per far quadrare i conti: si vede
 * solo scorrendo l'intero ciclo, e la rotazione cambia verso con lo scroll.
 */
function alternato(photos: Photo[]): number[] {
  const indici = photos.map((_, i) => i)
  const piatti = mescola(indici.filter((i) => photos[i].piatto))
  const locale = mescola(indici.filter((i) => !photos[i].piatto))
  const fuori: number[] = []
  for (let i = 0; i < Math.max(piatti.length, locale.length); i++) {
    if (i < piatti.length) fuori.push(piatti[i])
    if (i < locale.length) fuori.push(locale[i])
  }
  return fuori
}

/**
 * Tessera che cambia fotografia mentre si scorre, in ordine casuale.
 *
 * Lo scroll si **ascolta** (listener `passive`), non si intercetta: la pagina
 * scorre sempre normalmente, e il cambio e' un effetto collaterale del
 * movimento. E' la stessa regola di `SeasonalShowcase`, e il motivo e' lo
 * stesso: qualsiasi cosa trattenga lo scroll si legge come un blocco.
 *
 * Il passo e' in **pixel fissi**, non una frazione di qualcosa, cosi' non
 * dipende da quante foto ha la tessera ne' da quanto e' alta la sezione.
 *
 * L'ordine viene mescolato a ogni caricamento, cosi' due visite non mostrano la
 * stessa sequenza. Con `alterna` il rimescolamento avviene **dentro** le due
 * categorie e le tiene intercalate: resta casuale, ma un piatto non segue mai
 * un piatto. Che due tessere non mostrino mai la stessa foto insieme non
 * dipende pero' dal caso: lo garantiscono i gruppi disgiunti di `galleryGroups`
 * — una cosa che il caso, da solo, non puo' promettere.
 *
 * Le immagini stanno tutte nel DOM, sovrapposte, e si alternano in opacita':
 * il cambio non ha nulla da caricare quando arriva. Con `prefers-reduced-motion`
 * la rotazione non parte e resta la prima foto.
 */
export default function RotatingPhoto({
  photos,
  offset = 0,
  sizes = '(min-width: 1024px) 33vw, 50vw',
  alterna = false,
}: RotatingPhotoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [indice, setIndice] = useState(0)
  /**
   * In che ordine scorrere le foto.
   *
   * Parte dall'ordine dichiarato e viene mescolato **dopo il montaggio**, mai
   * durante il render: `Math.random()` in fase di render darebbe al server un
   * ordine e al browser un altro, e React segnalerebbe una discrepanza di
   * idratazione. Cosi' invece il primo fotogramma combacia e il rimescolamento
   * arriva subito dopo.
   */
  const [ordine, setOrdine] = useState<number[]>(() => photos.map((_, i) => i))

  useEffect(() => {
    if (photos.length < 2) return
    setOrdine(alterna ? alternato(photos) : mescola(photos.map((_, i) => i)))
  }, [photos, alterna])

  useEffect(() => {
    const el = ref.current
    if (!el || photos.length < 2 || prefersReducedMotion()) return

    let inVista = false
    const obs = new IntersectionObserver(([e]) => (inVista = e.isIntersecting), { threshold: 0.1 })
    obs.observe(el)

    let ultimo = window.scrollY
    let accumulato = offset * PASSO_PX

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - ultimo
      ultimo = y
      if (!inVista) return
      accumulato += delta
      if (Math.abs(accumulato) < PASSO_PX) return
      const passo = accumulato > 0 ? 1 : -1
      accumulato = 0
      setIndice((p) => (p + passo + photos.length) % photos.length)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [photos.length, offset])

  /** Quale foto e' a schermo: la posizione `indice` nell'ordine mescolato. */
  const visibile = ordine[indice % ordine.length] ?? 0

  return (
    <div ref={ref} className="absolute inset-0">
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={i === visibile ? p.alt : ''}
          fill
          sizes={sizes}
          className="object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: i === visibile ? 1 : 0, objectPosition: p.focus }}
        />
      ))}
    </div>
  )
}
