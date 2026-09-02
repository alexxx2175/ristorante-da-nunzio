'use client'

import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import PlaceholderMedia from '@/components/ui/PlaceholderMedia'
import { carousel } from '@/lib/images'
import type { Photo } from '@/lib/images'
import 'swiper/css'

type Slide = { photo: Photo; caption: string }

type PhotoCarouselProps = {
  title: string
  slides?: Slide[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Carousel fotografico riutilizzabile (Swiper): contatore, barra di
 * avanzamento e frecce personalizzate.
 */
export default function PhotoCarousel({ title, slides = carousel }: PhotoCarouselProps) {
  const swiperRef = useRef<SwiperClass | null>(null)
  const [active, setActive] = useState(0)

  const total = slides.length
  const progress = ((active + 1) / total) * 100

  return (
    <section
      className="screen-section relative w-full overflow-hidden"
    >
      <div className="container-gutter">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl lowercase md:text-5xl">{title}</h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Foto precedente"
              onClick={() => swiperRef.current?.slidePrev()}
              className="arrow-btn border-secondary/25 hover:bg-secondary hover:text-primary flex h-12 w-12 items-center justify-center rounded-full border"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                <path d="M17 6H1m0 0 5-5M1 6l5 5" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Foto successiva"
              onClick={() => swiperRef.current?.slideNext()}
              className="border-secondary/25 hover:bg-secondary hover:text-primary flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 ease-out"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                <path d="M1 6h16m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Le slide prendono l'altezza che avanza invece di imporla con un
          aspect-ratio: dentro una schermata piena e' l'unico modo perche' il
          carosello non sfondi la viewport. `min-h-0` serve a permettere al
          figlio flex di rimpicciolirsi sotto l'altezza del proprio contenuto. */}
      <div className="min-h-0 flex-1 pl-5 md:pl-[4%]">
        <Swiper
          className="h-full"
          modules={[Autoplay, A11y, Keyboard]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
          slidesPerView={1.15}
          spaceBetween={16}
          keyboard={{ enabled: true }}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          breakpoints={{
            768: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3.2, spaceBetween: 32 },
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.photo.src} className="h-full">
              <figure className="group relative h-full overflow-hidden">
                <PlaceholderMedia
                  token="[FOTO-LOCALE]"
                  {...slide.photo}
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 45vw, 85vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
                />
                <figcaption className="text-primary absolute inset-x-0 bottom-0 p-6 font-serif text-xl md:text-2xl">
                  {slide.caption}
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container-gutter mt-8">
        <div className="flex items-center gap-6">
          <p className="font-serif leading-none">
            <span className="text-4xl md:text-5xl">{pad(active + 1)}</span>
            <span className="ml-1 text-base opacity-50">/{pad(total)}</span>
          </p>
          <div className="bg-secondary/15 h-px flex-1">
            <div
              className="bg-secondary h-px transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
