import Image from 'next/image'
import type { Photo } from '@/lib/images'

type NomePiattoProps = {
  nome: string
  photo?: Photo
}

/**
 * Il nome di un piatto, con la sua fotografia al passaggio del cursore.
 *
 * **Solo da `xl` in su**, dove c'e' la fascia bianca a lato del menu: la foto
 * sta li', in mezzo, senza toccare il testo. Piu' in basso il margine non
 * esiste — a 1024px sarebbe largo 112px — e ci pensa `FasciaPiatti`, la
 * striscia in cima che segue lo scorrimento.
 *
 * Il titolo **non e' un comando**: la fotografia e' decorazione, e il nome del
 * piatto e' gia' scritto li' accanto. Renderlo attivabile aggiungerebbe
 * venticinque tappe da tastiera in cambio di niente. C'e' stata una versione in
 * cui il clic apriva il piatto in grande — scartata dal locale — e con essa il
 * bottone e' tornato a essere testo.
 */
export default function NomePiatto({ nome, photo }: NomePiattoProps) {
  return (
    <h3 className="group/piatto voce-piatto font-serif text-xl leading-[1.22] md:text-2xl md:leading-snug">
      {nome}
      {photo ? (
        <span
          aria-hidden
          className="foto-piatto pointer-events-none absolute top-1/2 left-[calc(25vw+75%)] hidden aspect-[3/2] w-[min(50vw-400px,34rem)] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover/piatto:opacity-100 xl:block"
        >
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 1536px) 544px, 400px"
            /* `loading="eager"` e non pigro: con il caricamento pigro non
               partiva nessuna richiesta, perche' il browser non considera
               visibile un'immagine dentro un contenitore trasparente. */
            loading="eager"
            className="object-contain"
          />
        </span>
      ) : null}
    </h3>
  )
}
