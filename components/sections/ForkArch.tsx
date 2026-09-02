'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import ArchLines from '@/components/ui/ArchLines'
import CircleCTA from '@/components/ui/CircleCTA'
import { menuCta } from '@/lib/site'
import { mouseParallax } from '@/lib/animations'
import { prefersReducedMotion } from '@/lib/gsap'

/**
 * Di quanto si sposta la forchetta rispetto alla pagina: un quinto.
 *
 * Il riferimento calcola `y = -(scrollTop - offset) / (speed * 2)` con
 * `data-speed="3"`, e a ogni giro rilegge un `offset` che **contiene gia' la
 * traslazione applicata**. E' un sistema auto-referenziale, e converge:
 * sostituendo `offset = O + y` e risolvendo,
 *
 *     y = (O - scrollTop) / (2 * speed - 1)   ->   con speed 3, diviso 5
 *
 * dove `O` e' la posizione dell'elemento senza trasformazione. Qui si applica
 * direttamente il punto d'equilibrio: stesso identico risultato, senza rileggere
 * il layout a ogni evento di scroll.
 */
const DIVISORE = 5

/**
 * Il diametro del cerchio alla larghezza di progetto, in pixel.
 *
 * Serve a **scalare la corsa insieme alla finestra**. Un quinto e' la misura
 * giusta per un cerchio di questa taglia; qui pero' il cerchio e' una frazione
 * della pagina, e su un telefono scende a un terzo. Gli stessi pixel di corsa
 * che su schermo grande sono uno scarto elegante, in un cerchio piccolo lo
 * svuotano: il piatto scivola fuori e resta il marmo nudo. Tenendo la corsa
 * proporzionale al diametro, il movimento si vede uguale ovunque.
 *
 * Nel riferimento il problema non si pone perche' il loro cerchio e' quasi fisso
 * (473px, che su un telefono diventano 390). Il nostro e' molto piu' fluido.
 */
const CERCHIO_PIENO = 448

/**
 * Quanto la forchetta e' piu' alta della finestra che la contiene.
 *
 * Governa due cose insieme: **la misura della forchetta** — l'immagine sta in
 * `object-contain` dentro un riquadro grande cosi' — e **quanto puo' scorrere
 * prima di uscire dalla maschera**. Abbassandola la forchetta rimpicciolisce ma
 * si accorcia anche la corsa utile, quindi va guardata a schermo, non solo
 * calcolata. Se si cambia, vanno rifatti anche gli scostamenti del riquadro qui
 * sotto: `(100 - ECCEDENZA*100) / 2` per centrarla, piu' 13 per il ribasso.
 */
const ECCEDENZA = 1.485

/**
 * Gli ingredienti che fluttuano: sette pezzi grandi e sedici minuti.
 *
 * Arrivano tutti da una sola immagine. Separati cercando le **componenti
 * connesse** del canale alfa e ritagliando ognuna mascherata per etichetta: i
 * ritagli si toccano, e senza maschera in ognuno sarebbero finiti pezzi dei
 * vicini.
 *
 * `x` e `y` sono in percentuale della **sezione intera**, non del blocco
 * centrale: e' quello che li porta fino ai bordi della pagina. La zona del
 * cerchio e' esclusa, tenuta larga perche' su schermo stretto il cerchio pesa
 * di piu' in proporzione.
 *
 * La disposizione **e' sparsa ma fissa**, generata una volta con un
 * generatore deterministico e scritta qui. Sorteggiarla a ogni render con
 * `Math.random()` darebbe due pagine diverse fra server e browser, e
 * l'idratazione salterebbe.
 *
 * I sette pezzi grandi hanno una zona a testa lungo un anello attorno al
 * cerchio, con le coppie dello stesso tipo in diagonale — i due molluschi, i due
 * pomodorini: vicini leggono come una coppia invece che come un caso. E ci
 * stanno **interi**: al sorteggio libero finivano ammucchiati in
 * alto, e uno tagliato a meta' dal bordo sembra un errore invece che una
 * scelta. I minuti si spargono dove capita e possono sconfinare — sono
 * pulviscolo, e ai bordi ci devono arrivare.
 *
 * `profondita` decide di quanto ognuno risponde al mouse — sono gli stessi
 * `data-depth` della libreria usata dal riferimento. `sfocatura` e' un velo
 * leggero, piu' forte sui pezzi piccoli: e' quello che li manda indietro e li
 * fa leggere come pulviscolo invece che come adesivi.
 */
const INGREDIENTI = [
  { nome: 'vongola', x: 7.2, y: 10.3, w: 10.20, profondita: 0.32, sfocatura: 0.9, dim: [197, 201] },
  { nome: 'pomodoro', x: 89.7, y: 15.6, w: 7.66, profondita: 0.31, sfocatura: 0.9, dim: [148, 158] },
  { nome: 'pomodoro-spicchio', x: 8.4, y: 79.4, w: 6.62, profondita: 0.28, sfocatura: 0.9, dim: [128, 162] },
  { nome: 'cozza', x: 85.1, y: 86.8, w: 7.09, profondita: 0.36, sfocatura: 0.9, dim: [137, 120] },
  { nome: 'prezzemolo', x: 89.2, y: 67.7, w: 6.26, profondita: 0.24, sfocatura: 0.9, dim: [121, 177] },
  { nome: 'foglia', x: 41.3, y: 12.7, w: 6.42, profondita: 0.19, sfocatura: 0.9, dim: [124, 108] },
  { nome: 'olio', x: 10.0, y: 65.7, w: 6.62, profondita: 0.25, sfocatura: 0.9, dim: [128, 126] },
  { nome: 'foglia-2', x: 20.1, y: 87.3, w: 4.01, profondita: 0.31, sfocatura: 1.4, dim: [62, 76] },
  { nome: 'foglia-3', x: 82.6, y: 56.0, w: 2.98, profondita: 0.38, sfocatura: 1.7, dim: [46, 84] },
  { nome: 'olio-2', x: 10.7, y: 20.4, w: 2.66, profondita: 0.32, sfocatura: 1.8, dim: [41, 51] },
  { nome: 'foglia-4', x: 16.6, y: 15.8, w: 3.04, profondita: 0.16, sfocatura: 1.7, dim: [47, 43] },
  { nome: 'foglia-5', x: 95.8, y: 49.5, w: 2.66, profondita: 0.22, sfocatura: 1.8, dim: [41, 53] },
  { nome: 'olio-3', x: 31.8, y: 24.1, w: 2.20, profondita: 0.4, sfocatura: 1.9, dim: [34, 40] },
  { nome: 'olio-4', x: 51.0, y: 23.5, w: 2.20, profondita: 0.41, sfocatura: 1.9, dim: [34, 38] },
  { nome: 'foglia-6', x: 59.3, y: 95.3, w: 2.46, profondita: 0.2, sfocatura: 1.8, dim: [38, 38] },
  { nome: 'foglia-7', x: 56.6, y: 92.8, w: 2.46, profondita: 0.33, sfocatura: 1.8, dim: [38, 37] },
  { nome: 'olio-5', x: 49.1, y: 86.6, w: 2.39, profondita: 0.37, sfocatura: 1.8, dim: [37, 33] },
  { nome: 'foglia-8', x: 60.5, y: 82.4, w: 2.27, profondita: 0.33, sfocatura: 1.9, dim: [35, 31] },
  { nome: 'olio-6', x: 8.1, y: 34.0, w: 1.87, profondita: 0.44, sfocatura: 2.0, dim: [29, 30] },
  { nome: 'foglia-9', x: 26.6, y: 88.6, w: 2.01, profondita: 0.34, sfocatura: 1.9, dim: [31, 29] },
  { nome: 'foglia-10', x: 15.4, y: 62.6, w: 2.07, profondita: 0.27, sfocatura: 1.9, dim: [32, 33] },
  { nome: 'foglia-11', x: 94.1, y: 84.0, w: 1.87, profondita: 0.41, sfocatura: 2.0, dim: [29, 31] },
  { nome: 'foglia-12', x: 94.6, y: 32.5, w: 2.20, profondita: 0.27, sfocatura: 1.9, dim: [34, 23] },
] as const

/**
 * La forchetta dentro gli archi concentrici.
 *
 * Tre livelli, dal fondo alla superficie:
 *
 *  1. gli **archi** a filo, che si disegnano uno dopo l'altro al caricamento;
 *  2. il **cerchio** di marmo, che fa da finestra: `overflow: hidden`;
 *  3. la **forchetta**, dentro il cerchio, che scorre a velocita' diversa.
 *
 * L'effetto dei due piani a velocita' diverse nasce tutto qui: il marmo sta
 * fermo dentro la maschera e scorre insieme alla pagina, mentre la forchetta
 * riceve una traslazione pari a un quinto dello scroll, in direzione opposta.
 * Nessun `background-attachment: fixed`, nessun trucco: un elemento che si muove
 * e gli altri no.
 *
 * > La forchetta dev'essere **piu' alta della finestra** che la contiene —
 * > qui il 165% del cerchio — altrimenti scorrendo esce dalla maschera e lascia
 * > il marmo nudo. Nel riferimento il rapporto e' 741 su 473, cioe' 1.57.
 *
 * La larghezza in eccesso non e' un problema: nel PNG la forchetta e' stretta e
 * al centro, quindi la maschera taglia solo margine trasparente.
 *
 * Mancano due cose rispetto al riferimento, entrambe per assenza di materiale:
 * la **spolverata di spezie** in primo piano dentro la maschera, e gli
 * **ingredienti che fluttuano** col movimento del mouse. Per i secondi il
 * progetto ha gia' `mouseParallax` in `lib/animations.ts`, che fa quel lavoro
 * con gli stessi `data-depth` della libreria usata dal riferimento: appena
 * arrivano i ritagli si aggancia lui.
 */
export default function ForkArch() {
  const foglioRef = useRef<HTMLElement>(null)
  const sezioneRef = useRef<HTMLDivElement>(null)
  const cerchioRef = useRef<HTMLDivElement>(null)
  const forchettaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cerchio = cerchioRef.current
    const forchetta = forchettaRef.current
    if (!foglioRef.current || !sezioneRef.current || !cerchio || !forchetta) return

    // Gli ingredienti seguono il mouse. Si ascolta sulla **sezione intera**,
    // non sul blocco centrale: e' li' che stanno, fino ai bordi della pagina.
    // `strength` vale solo per questa chiamata: le altre sezioni che usano lo
    // stesso aiutante restano al valore di prima.
    // Si aggancia prima del controllo sulle animazioni ridotte perche' ci pensa
    // `mouseParallax` per conto suo.
    const fermaIngredienti = mouseParallax(foglioRef.current, { strength: 65 })
    if (prefersReducedMotion()) return fermaIngredienti

    // La posizione si rilegge dal cerchio a ogni fotogramma. Misurarla una volta
    // sola non regge: sopra c'e' un video e ci sono immagini, e quando finiscono
    // di caricare la pagina si assesta sotto ai piedi del calcolo. Anche il
    // riferimento rilegge la posizione a ogni giro.
    //
    // Il cerchio non riceve trasformazioni, quindi leggerlo e' lecito: non si sta
    // misurando una posizione che dipende da se stessa.
    const disegna = () => {
      const r = cerchio.getBoundingClientRect()
      if (!r.height) return
      // `r.top` e' relativo allo schermo, quindi lo scroll e' gia' dentro.
      const scarto = r.top - ((ECCEDENZA - 1) / 2) * r.height
      const quota = 1 / DIVISORE / (CERCHIO_PIENO / r.height)
      forchetta.style.transform = `translateY(${(scarto * quota).toFixed(2)}px)`
    }

    // Un ciclo continuo invece dell'ascolto dello scroll. Agganciarsi allo scroll
    // sembra piu' parsimonioso, ma lascia la forchetta ferma in una posizione
    // vecchia ogni volta che il layout si muove **senza** che si scrolli: le
    // immagini che finiscono di caricare, l'intro che sblocca la pagina, i font
    // che si sostituiscono. Cosi' invece e' sempre allineata, qualunque cosa
    // succeda sopra.
    //
    // Il costo e' una lettura di rettangolo per fotogramma, e la si paga solo
    // mentre la sezione e' in vista: fuori, l'osservatore spegne tutto.
    let giro = 0
    const cicla = () => {
      disegna()
      giro = requestAnimationFrame(cicla)
    }

    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (voce.isIntersecting && !giro) giro = requestAnimationFrame(cicla)
        else if (!voce.isIntersecting && giro) {
          cancelAnimationFrame(giro)
          giro = 0
        }
      },
      // Un margine largo: la sezione entra gia' allineata invece di scattare
      // in posizione appena spunta dal bordo.
      { rootMargin: '50%' }
    )
    osservatore.observe(sezioneRef.current)

    disegna()
    return () => {
      fermaIngredienti()
      osservatore.disconnect()
      if (giro) cancelAnimationFrame(giro)
    }
  }, [])

  return (
    <section ref={foglioRef} className="relative w-full overflow-hidden py-24 lg:py-32">
      {/* L'altezza la detta la composizione: gli archi sono molto piu' alti che
          larghi e vengono tagliati in basso dal bordo della sezione, come nel
          riferimento. */}
      <div
        ref={sezioneRef}
        className="relative mx-auto h-[clamp(34rem,62vw,58rem)] w-[min(76rem,94vw)]"
      >
        {/* Blocco arco. **Il cerchio sta qui dentro**, non nella sezione: cosi'
            la sua misura e la sua posizione sono frazioni dell'arco, e il
            rapporto fra i due resta identico a ogni larghezza di schermo.
            Misurandoli separatamente sulla sezione — com'era prima — bastava
            cambiare formato perche' il cerchio scivolasse dentro la curva e si
            mangiasse gli archi piu' interni.

            `min(88%, 53rem)` invece di due valori su un punto di rottura: fra
            uno schermo stretto e uno largo la larghezza passa senza scalini. */}
        <div className="absolute inset-x-0 top-[11%] mx-auto w-[min(88%,53rem)]">
          <ArchLines delay={0.2} className="text-accent-gold/25 h-auto w-full" />

          {/* **Il cerchio e' concentrico agli archi.** I sei tracciati sono
              archi di cerchio con lo stesso centro (415.36, 411.8 in unita' SVG)
              e raggi che calano di un passo costante di 33.3. Mettendo il
              cerchio su quello stesso centro, lo spazio fra il suo bordo e la
              prima linea e' **uguale a sinistra, sopra e a destra** per
              costruzione, invece che stretto in cima e largo ai lati.
              Da qui `top-[10.113%]` e `w-[52.775%]`: sono quel centro e il raggio,
              espressi in frazioni del blocco arco. Il margine che ne esce vale
              circa **tre quarti del passo fra due linee** — mezzo passo era
              troppo stretto e il cerchio sembrava incastrato.

              **La posizione verticale non e' libera**: imponendo i tre margini
              uguali resta inchiodata al centro degli archi. Abbassare il solo
              cerchio allarga il margine di sopra e lascia fermi quelli di
              fianco. Per abbassarlo davvero si sposta giu' tutto il blocco —
              l'`top-[8%]` qui sopra — cosi' scendono insieme e il rapporto
              regge.

              La finestra: quello che ci passa dentro lo taglia il bordo tondo. */}
          <div
            ref={cerchioRef}
            className="absolute top-[10.113%] left-1/2 aspect-square w-[52.775%] -translate-x-1/2 overflow-hidden rounded-full"
          >
            <Image
              src="/images/marmo-oro.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 410px, 42vw"
              className="object-cover"
            />

            <div
              ref={forchettaRef}
              /* Posizionata con gli offset e non con `translate`: la traslazione
                 dello scroll si scrive su `transform`, e le due si darebbero il
                 cambio a vicenda. Centrata sarebbe -24.25% — (100 - 148.5) / 2 —
                 ma **la partenza va tenuta piu' bassa**, cosi' il piatto sta
                 tutto dentro il cerchio mentre lo si guarda e comincia a
                 tagliarsi solo quando la sezione esce dallo schermo.

                 Il ribasso sta qui e non nel calcolo dello scroll: cosi' e' la
                 posizione a riposo a cambiare, e la stessa inquadratura la vede
                 anche chi ha chiesto meno animazioni. */
              className="absolute top-[-11.25%] left-[-24.25%] h-[148.5%] w-[148.5%] will-change-transform"
            >
              <Image
                src="/images/forchetta-pacchero.png"
                alt="Un pacchero e una cozza su una forchetta"
                fill
                sizes="(min-width: 1024px) 780px, 80vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <CircleCTA label={menuCta.label} href={menuCta.href} tone="dark" size={150} />
        </div>
      </div>

      {/* Gli ingredienti stanno sopra a tutto ma **non intercettano il
          puntatore**: sotto ci passa il bottone, e il parallax ha bisogno che
          il `pointermove` arrivi alla sezione. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {INGREDIENTI.map((i) => (
          <div
            key={i.nome}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${i.x}%`, top: `${i.y}%`, width: `${i.w}%` }}
          >
            {/* La profondita' sta su un figlio: il centraggio qui sopra usa
                gia' `transform`, e GSAP scrive sulla stessa proprieta'. */}
            <div data-depth={i.profondita}>
              <Image
                src={`/images/ingrediente-${i.nome}.png`}
                alt=""
                width={i.dim[0]}
                height={i.dim[1]}
                /* La sezione e' larga quanto la finestra, quindi la larghezza
                   in percentuale e' gia' una misura in `vw`. Un `sizes` unico
                   per tutti farebbe scaricare 200px anche per un ritaglio da
                   29, e ingrandire il piccolo invece di rimpicciolire il
                   grande. */
                sizes={`${i.w}vw`}
                className="h-auto w-full"
                style={{ filter: `blur(${i.sfocatura}px)` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
