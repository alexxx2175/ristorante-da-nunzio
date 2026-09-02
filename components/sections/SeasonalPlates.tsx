'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import { prefersReducedMotion } from '@/lib/gsap'
import type { Photo } from '@/lib/images'
import 'swiper/css'

type SeasonalPlatesProps = {
  piatti: Photo[]
}

/** Quanto resta al centro un piatto prima di lasciare il posto al successivo. */
const SOSTA_MS = 2000

/** Quanto ci mette la slitta a spostarsi di un piatto. */
const SCORRIMENTO_MS = 1000

/**
 * I piatti che scorrono, in home.
 *
 * **L'animazione e' tutta nel CSS**, in `.piatto-in-slitta`: i piatti stanno
 * inclinati di dieci gradi e quello al centro si raddrizza. Non serve ne' JS ne'
 * GSAP — basta la classe `swiper-slide-active` che Swiper mette sulla slide
 * attiva. Con l'avanzamento automatico ogni due secondi, quello che si vede e'
 * un piatto che si mette dritto mentre gli altri restano di sbieco.
 *
 * Sette piatti, un giro in quattordici secondi. Le slide ai bordi sono tagliate
 * a meta' apposta: dicono che il giro continua, senza bisogno di frecce.
 *
 * `loop` e `centeredSlides` insieme sono quello che tiene il piatto attivo
 * sempre in mezzo: senza il secondo, il primo e l'ultimo si accosterebbero a un
 * bordo e il raddrizzamento avverrebbe fuori asse.
 *
 * Con `prefers-reduced-motion` l'avanzamento viene **fermato**: un carosello che
 * si muove da solo e' esattamente il tipo di movimento che chi ha fatto quella
 * scelta ha chiesto di non vedere. I piatti restano, fermi e sfogliabili.
 */
export default function SeasonalPlates({ piatti }: SeasonalPlatesProps) {
  return (
    <Swiper
      className="w-full"
      modules={[Autoplay, A11y, Keyboard]}
      loop
      centeredSlides
      speed={SCORRIMENTO_MS}
      autoplay={{ delay: SOSTA_MS, disableOnInteraction: false }}
      /* La configurazione va passata **sempre**, e semmai fermata dopo.
         Swiper legge `autoplay` all'avvio: passandogli `false` e cambiando idea
         dopo il montaggio resta `enabled: false` per sempre, in silenzio. */
      onSwiper={(swiper) => {
        if (prefersReducedMotion()) swiper.autoplay?.stop()
      }}
      keyboard={{ enabled: true }}
      slidesPerView={1.6}
      spaceBetween={20}
      breakpoints={{
        640: { slidesPerView: 2.4, spaceBetween: 32 },
        1024: { slidesPerView: 3.4, spaceBetween: 48 },
      }}
    >
      {piatti.map((p) => (
        <SwiperSlide key={p.src}>
          {/* L'inclinazione sta su un involucro suo: dentro, l'immagine non
              deve spartirsi `transform` con nessuno. */}
          <div className="piatto-in-slitta relative aspect-square w-full">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 60vw"
              className="object-contain"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
