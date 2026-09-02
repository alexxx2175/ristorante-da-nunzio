'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import type { Photo } from '@/lib/images'
import 'swiper/css'

/** Quanto e' alta la sfumatura in fondo alla fascia, in pixel. */
const SFUMA_PX = 30

type FasciaPiattiProps = {
  /** I piatti fotografati, **nell'ordine del menu**. */
  piatti: Photo[]
}

/**
 * La fascia di piatti in cima al menu, su schermo stretto.
 *
 * Non e' una decorazione che scorre per conto suo: **mostra il piatto della voce
 * che in quel momento sta al centro dello schermo**. Si scorre il menu e la
 * fascia segue, nell'ordine del menu.
 *
 * Ha preso il posto del tocco sul nome. Toccare per vedere una foto funzionava,
 * ma richiedeva di sapere che si poteva fare, e per guardare venticinque piatti
 * voleva dire venticinque tocchi. Cosi' invece le fotografie si vedono
 * scorrendo, che e' quello che si sta gia' facendo.
 *
 * **Il centro non e' quello della finestra** ma quello dello spazio che resta
 * sotto la fascia: la fascia copre la parte alta, e misurare dal centro della
 * finestra farebbe corrispondere il piatto a una voce che sta dietro di essa.
 *
 * **Niente `loop`**: qui l'indice della slide deve corrispondere esattamente
 * alla posizione nel menu, e il ciclo continuo di Swiper duplica le slide e
 * sposta gli indici. Il giro infinito non serve — il menu ha un principio e una
 * fine.
 *
 * Le voci senza fotografia non fanno cambiare niente: la fascia resta sul piatto
 * di prima invece di svuotarsi.
 *
 * La voce a cui appartiene la foto in cima viene marcata con `data-attivo`: il
 * CSS la tiene piena mentre le altre si attenuano appena, cosi' si vede a colpo
 * d'occhio a che piatto corrisponde la fotografia.
 */
export default function FasciaPiatti({ piatti }: FasciaPiattiProps) {
  const slittaRef = useRef<SwiperClass | null>(null)
  const fasciaRef = useRef<HTMLDivElement>(null)
  const [attivo, setAttivo] = useState(0)

  useEffect(() => {
    const voci = Array.from(document.querySelectorAll<HTMLElement>('[data-piatto]'))
    if (voci.length === 0) return

    let atteso = false
    let segnata: HTMLElement | null = null
    const guarda = () => {
      atteso = false
      const fascia = fasciaRef.current
      const r = fascia?.getBoundingClientRect()
      const sotto = r ? r.bottom : 0
      const centro = (sotto + window.innerHeight) / 2

      // Dove ritagliare il marmo: la fascia si muove finche' non si pianta in
      // alto, quindi le misure vanno riscritte a ogni fotogramma — anche quando
      // il piatto da mostrare non cambia.
      if (fascia && r) {
        const alto = Math.max(0, r.top)
        const fine = Math.min(window.innerHeight, r.bottom)
        // Le tappe si calcolano qui e arrivano al CSS **gia' in ordine**:
        // scritte in percentuale con delle sottrazioni si invertivano appena la
        // fascia usciva dallo schermo, e il gradiente diventava un velo lungo
        // tutta la finestra.
        fascia.style.setProperty('--fascia-top', `${alto}px`)
        fascia.style.setProperty('--fascia-fine', `${Math.max(alto, fine)}px`)
        fascia.style.setProperty('--fascia-sfuma-da', `${Math.max(alto, fine - SFUMA_PX)}px`)
        fascia.toggleAttribute('data-fuori', r.bottom <= 0 || r.top >= window.innerHeight)
      }

      let vicina: HTMLElement | null = null
      let minima = Infinity
      for (const v of voci) {
        const r = v.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - centro)
        if (d < minima) {
          minima = d
          vicina = v
        }
      }
      if (!vicina || vicina === segnata) return

      // Si marca la voce a cui appartiene la foto in cima, cosi' il CSS puo'
      // tenerla piena mentre le altre si attenuano. Si tocca il DOM **solo al
      // cambio**: rifarlo su venti voci a ogni fotogramma sarebbe lavoro
      // buttato.
      segnata?.removeAttribute('data-attivo')
      vicina.setAttribute('data-attivo', '')
      segnata = vicina

      setAttivo(Number(vicina.dataset.piatto))
    }

    // Si **ascolta** lo scroll, non lo si intercetta: la pagina scorre sempre.
    const alloScroll = () => {
      if (atteso) return
      atteso = true
      requestAnimationFrame(guarda)
    }

    guarda()
    window.addEventListener('scroll', alloScroll, { passive: true })
    window.addEventListener('resize', alloScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', alloScroll)
      window.removeEventListener('resize', alloScroll)
      segnata?.removeAttribute('data-attivo')
    }
  }, [])

  useEffect(() => {
    // `slideTo` solo quando l'indice cambia davvero: chiamarlo a ogni
    // fotogramma di scroll rimetterebbe in coda un'animazione mai finita.
    slittaRef.current?.slideTo(attivo)
  }, [attivo])

  return (
    <div
      ref={fasciaRef}
      /* `sticky` non regge dentro un antenato con `overflow: hidden`, che
         diventa un contenitore di scorrimento. La sezione del menu usa
         `overflow-x: clip`, che ritaglia il ramo di vite senza diventarlo.
         Niente bordo in basso: al suo posto c'e' una sfumatura. Il `pb-10`
         serve a quella — lascia sotto ai piatti lo spazio in cui sfumare, cosi'
         i piatti restano pieni e il testo del menu non arriva a toccarli. */
      className="fascia-piatti sticky top-16 z-30 pt-3 pb-10 xl:hidden"
    >
      {/* Il marmo che sta sotto, ritagliato sulla fascia: sotto di essa il menu
          sparisce, ma lo sfondo prosegue senza un salto. Sta prima della slitta
          nel DOM, quindi i piatti gli finiscono sopra. */}
      <div aria-hidden className="marmo-fascia" />

      <Swiper
        modules={[A11y]}
        onSwiper={(s) => (slittaRef.current = s)}
        onSlideChange={(s) => setAttivo(s.activeIndex)}
        centeredSlides
        slidesPerView={1.95}
        spaceBetween={14}
        speed={500}
        breakpoints={{ 480: { slidesPerView: 2.6, spaceBetween: 20 } }}
      >
        {piatti.map((p, i) => (
          <SwiperSlide key={p.src}>
            {/* Stessa inclinazione del carosello in home: i piatti stanno di
                sbieco e quello al centro si raddrizza. */}
            {/* Riquadro **quadrato**, con il margine solo sopra e sotto. Era
                piu' largo che alto per far entrare la tartare, che ha anche le
                due ciotoline (656x480): ma con il margine verticale il piatto
                si stringe in altezza e ci sta lo stesso, e il riquadro largo
                sprecava spazio ai lati — costringeva a slide larghissime, e i
                piatti vicini finivano fuori schermo. */}
            <div className="piatto-in-slitta relative aspect-square w-full">
              <Image
                src={p.src}
                alt={i === attivo ? p.alt : ''}
                fill
                sizes="(min-width: 480px) 30vw, 40vw"
                /* Il margine e' quello che lascia al piatto al centro lo spazio
                   per crescere: la slitta ritaglia all'altezza della slide, e
                   senza un po' d'aria il piatto ingrandito verrebbe tagliato
                   sopra e sotto.
                   **In percentuale e solo verticale**: la percentuale si calcola
                   sulla larghezza, che in un riquadro quadrato e' anche
                   l'altezza. L'altezza da lasciare libera e' `1 - 1/scala`, che con
                   `scale(1.44)` fa il 30.6%: meta' per lato da' il 15.3%. Il
                   conto torna a qualunque misura della fascia, ma **va rifatto
                   se cambia l'ingrandimento**. */
                className="object-contain py-[15.3%]"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
