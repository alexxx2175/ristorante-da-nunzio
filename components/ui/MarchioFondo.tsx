'use client'

import { usePathname } from 'next/navigation'

/**
 * Il ritratto in fondo alla pagina, velato e tagliato dal bordo.
 *
 * Chiude il sito con la faccia di chi ci sta dietro. **Solo il volto**: la
 * firma «da Nunzio» sta gia' in testata, e ripeterla qui in grande la
 * trasformava in un'insegna.
 *
 * **Esce da un bordo** invece di stare tutto dentro: un ritratto intero
 * appoggiato in un angolo sembra un'immagine dimenticata li', mentre uno
 * tagliato dal bordo si legge come una decisione. Il taglio e' un quinto della
 * larghezza — abbastanza da vedersi, poco da non perdere l'occhio.
 *
 * **Da che parte dipende dalla pagina.** Di regola a sinistra; in home no,
 * perche' li' l'ultima sezione e' la galleria e le fotografie stanno a
 * sinistra: il volto ci finiva sopra. A destra, in home, lo spazio e' vuoto.
 * E' l'unica ragione per cui questo componente sa in che pagina si trova.
 *
 * **Finisce dove finisce il testo**, e per farlo sta fuori dal flusso: e'
 * appoggiato in alto rispetto alla fine della pagina, non impilato dopo di
 * essa. Tenerlo nel flusso voleva dire o una fascia bianca sopra, o il piede
 * tirato su fino a toccare l'ultima riga. Il `bottom` vale il respiro che
 * l'ultima sezione si lascia sotto (40px, 72 da 1024 in su): se cambia
 * `--spacing-section`, va cambiato anche qui.
 *
 * `overflow-clip` e non `hidden`: `hidden` diventa un contenitore di
 * scorrimento e romperebbe gli elementi appiccicati piu' su nella pagina, la
 * fascia dei piatti per prima.
 *
 * **`mix-blend-multiply`**, e non un livello sotto al testo. Su schermo stretto
 * l'ultimo paragrafo e' largo quanto la pagina e il ritratto gli finisce sopra
 * per forza; in moltiplicazione le parole restano nere — nero per grigio fa
 * nero — mentre sul marmo chiaro il volto si vede tutto. Mandarlo dietro
 * sembrava la soluzione, ma in home l'ultima sezione ha delle fotografie e il
 * ritratto spariva a meta', tagliato dal bordo di una foto: sembrava rotto.
 *
 * Decorativo e basta: `aria-hidden` e `pointer-events-none`, cosi' non si mette
 * fra il dito e quello che c'e' sotto. Il marchio che porta a casa e' quello in
 * testata.
 */
export default function MarchioFondo() {
  const percorso = usePathname()
  const aDestra = percorso === '/'

  return (
    <div aria-hidden className="pointer-events-none relative">
      {/* `flex` non e' decorazione: la maschera prende la larghezza dal proprio
          rapporto, e per farlo la scatola deve dimensionarsi sul contenuto. Un
          blocco normale si allargherebbe a tutta la riga, e il taglio del 20%
          diventerebbe un quinto della pagina invece che un quinto del
          ritratto. */}
      <div
        className={`absolute inset-x-0 bottom-10 flex overflow-clip mix-blend-multiply lg:bottom-18 ${
          aDestra ? 'justify-end' : ''
        }`}
      >
        <div
          className={`marchio-ritratto h-40 opacity-25 sm:h-56 lg:h-72 ${
            aDestra ? 'translate-x-[20%]' : '-translate-x-[20%]'
          }`}
        />
      </div>
    </div>
  )
}
