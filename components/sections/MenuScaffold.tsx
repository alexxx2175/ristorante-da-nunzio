import Button from '@/components/ui/Button'
import VineBranch from '@/components/ui/VineBranch'
import FasciaPiatti from '@/components/sections/FasciaPiatti'
import NomePiatto from '@/components/ui/NomePiatto'
import Reveal from '@/components/ui/Reveal'
import SplitHeading from '@/components/ui/SplitHeading'
import StaggerGroup from '@/components/ui/StaggerGroup'
import type { Photo } from '@/lib/images'
import { menuCta, siteConfig } from '@/lib/site'

/**
 * Struttura di una voce di menù. I campi sono opzionali dove puo' servire
 * (es. una voce senza descrizione, o un prezzo "s.q.").
 */
export type MenuItem = {
  name: string
  description?: string
  price?: string
  /**
   * Fotografia del piatto. Compare in un cerchio al lato, solo mentre il
   * cursore e' sul nome: vedi il commento nella lista.
   */
  photo?: Photo
  /** Traduzione tedesca, dove il menù cartaceo ce l'ha. */
  de?: string
  /** Traduzione inglese, dove il menù cartaceo ce l'ha. */
  en?: string
}

export type MenuSection = {
  title: string
  /** Nota di sezione, es. allergeni o provenienza. */
  note?: string
  items: MenuItem[]
}

type Richiamo = { label: string; href: string }

type MenuScaffoldProps = {
  /**
   * Sezioni del menù. Finche' l'array e' vuoto la pagina mostra lo stato
   * "in aggiornamento" con i segnaposto della griglia.
   *
   * Per popolarla:
   *   const SECTIONS: MenuSection[] = [
   *     { title: 'Antipasti', items: [{ name: '…', description: '…', price: '…' }] },
   *   ]
   *   <MenuScaffold sections={SECTIONS} />
   */
  sections?: MenuSection[]
  /** Numero di segnaposto mostrati quando `sections` e' vuoto. */
  placeholderSlots?: number
}

/**
 * Layout della pagina "Menù". Resta generico e riutilizzabile: se un domani
 * servisse un secondo menù, basta una nuova pagina che lo istanzi.
 * Nessun piatto, ingrediente o prezzo: solo l'impaginazione, pronta a ricevere
 * i contenuti reali.
 */
export default function MenuScaffold({
  sections = [],
  placeholderSlots = 4,
  /* Il richiamo in fondo. `null` per non metterlo: sulla pagina del menu
     manderebbe alla pagina che si sta gia' guardando. */
  cta = menuCta,
}: MenuScaffoldProps & { cta?: Richiamo | null }) {
  const isEmpty = sections.length === 0

  /* I piatti fotografati, nell'ordine del menu, con la loro posizione: la
     fascia in cima mostra il piatto della voce che sta al centro dello schermo,
     e per saperlo le serve un indice su ogni voce. La chiave e' l'oggetto
     stesso — i nomi si potrebbero ripetere, i riferimenti no. */
  const indiciFoto = new Map<MenuItem, number>()
  for (const sezione of sections) {
    for (const voce of sezione.items) {
      if (voce.photo) indiciFoto.set(voce, indiciFoto.size)
    }
  }
  const piattiFotografati = [...indiciFoto.keys()].map((v) => v.photo as Photo)

  return (
    /* `overflow-x: clip` e non `hidden`: ritaglia il ramo di vite senza
       diventare un contenitore di scorrimento — e `position: sticky`, che serve
       alla fascia dei piatti, dentro un `hidden` non funziona. */
    <section className="texture-marble-light section-y relative w-full overflow-x-clip">
      {piattiFotografati.length > 0 ? <FasciaPiatti piatti={piattiFotografati} /> : null}

      {/* Solo da `lg` in su. Piu' in basso la colonna del menu occupa tutta la
          larghezza, e un ramo dietro a un elenco di prezzi si legge come sporco
          invece che come decorazione. */}
      {/* Appoggiato al bordo, **non oltre**: quello che esce la sezione lo
          ritaglia, e un ramo spinto fuori veniva reciso da una riga dritta in
          mezzo alle foglie. Il PNG ha gia' un ottavo di altezza trasparente in
          cima, che fa da sfumatura senza bisogno di sbordare. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 -right-16 hidden w-[min(17rem,34vw)] opacity-[0.16] lg:block"
      >
        <VineBranch className="w-full" flip />
      </div>


      <div className="container-gutter mx-auto max-w-4xl">
        {isEmpty ? (
          <>
            <div className="border-secondary/20 rounded-[2rem] border border-dashed px-6 py-14 text-center">
              <p className="font-serif text-2xl md:text-3xl">Menù in aggiornamento</p>
              <p className="mx-auto mt-4 max-w-md leading-relaxed opacity-70">
                Stiamo preparando la versione online. Per conoscere le proposte di oggi
                chiamateci: vi raccontiamo tutto al telefono.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href={siteConfig.phoneHref} variant="gold">
                  {siteConfig.phone}
                </Button>
                {cta ? (
                  <Button href={cta.href} variant="outline" tone="dark">
                    {cta.label}
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Anteprima della griglia che accogliera' le voci del menù. */}
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: placeholderSlots }, (_, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="border-secondary/15 h-full rounded-2xl border border-dashed px-6 py-10">
                    <p className="font-mono text-[0.625rem] tracking-widest uppercase opacity-40">
                      [SEZIONE-MENU-{index + 1}]
                    </p>
                    <div aria-hidden className="mt-6 flex flex-col gap-3">
                    {[0, 1, 2].map((line) => (
                      <div key={line} className="flex items-baseline gap-4">
                        <span className="bg-secondary/10 h-3 flex-1 rounded-full" />
                        <span className="bg-secondary/10 h-3 w-10 rounded-full" />
                      </div>
                    ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-12">
            {sections.map((section) => (
              <div key={section.title}>
                {/* `chars` e non `scrub`: i titoli di sezione sono corti e
                    stanno in cima a un elenco lungo. Con lo scrub la rivelazione
                    resterebbe legata alla rotella mentre l'occhio e' gia' sulle
                    voci sotto. */}
                <SplitHeading
                  as="h2"
                  mode="chars"
                  className="border-secondary/15 block border-b pb-4 font-serif text-3xl md:text-4xl"
                >
                  {section.title}
                </SplitHeading>
                {section.note ? (
                  <p className="mt-3 text-[0.8125rem] opacity-60">{section.note}</p>
                ) : null}

                <StaggerGroup>
                  <ul className="mt-6 flex flex-col gap-6">
                  {/* La chiave include l'indice: fra le bevande lo stesso nome
                      torna con formati diversi ("Peroni" 20 cl e 40 cl), e il
                      solo nome non e' univoco. */}
                  {section.items.map((item, index) => (
                    <li
                      key={`${item.name}-${index}`}
                      data-stagger-item
                      className="gsap-hidden relative"
                      /* L'indice serve a `FasciaPiatti` per sapere quale piatto
                         mostrare in cima: e' la posizione fra le voci
                         fotografate, nell'ordine del menu. */
                      data-piatto={indiciFoto.get(item)}
                    >
                      {/* Su schermo stretto **non** e' una riga a due colonne:
                          il prezzo si prendeva 114px dei 342 disponibili e i
                          titoli andavano a quattro righe. Qui il blocco e'
                          normale e il prezzo **galleggia a destra**, cosi' il
                          titolo gli scorre accanto sulla prima riga e usa tutta
                          la larghezza sulle altre — come sui menu stampati.
                          Da `sm` in su torna una riga flex, dove il
                          galleggiamento non ha effetto e li tiene l'ordine. */}
                      <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-6">
                      {item.price ? (
                        <p className="float-right ml-4 font-serif text-xl sm:order-last sm:float-none sm:ml-0 sm:shrink-0 md:text-2xl">
                          {item.price}
                        </p>
                      ) : null}
                      <div>
                        {/* Il cerchio con la foto del piatto.

                            Sta **dentro** l'h3 perche' il passaggio del cursore
                            deve valere sul nome, non su tutta la riga; ma e'
                            `absolute` e l'antenato posizionato e' il <li>, non
                            l'h3, quindi si ancora al <li> e non alla fine del
                            testo — che e' lungo diverso per ogni piatto.

                            `left: calc(25vw + 75%)` lo mette al centro della
                            fascia bianca a destra: il <li> e' centrato nella
                            finestra, quindi il centro di quella fascia,
                            riportato all'origine del <li>, e' 25vw + 0.75 della
                            sua larghezza. Da li' `-translate-x-1/2` centra il
                            cerchio.

                            Non intacca il menù: e' fuori dal flusso,
                            `pointer-events-none`, e a riposo e' trasparente.
                            Solo da `xl` in su — sotto non c'e' margine dove
                            metterlo, e su touch il passaggio del cursore non
                            esiste.

                            **Niente maschera tonda.** Le foto sono PNG gia'
                            ritagliati: il piatto sta sul marmo per conto suo.
                            Il cerchio serviva quando erano JPEG e si portavano
                            dietro un riquadro di fondo — ma tagliava anche il
                            piatto. `object-contain` e non `cover`: il ritaglio
                            va mostrato intero, non riempito.

                            **Il riquadro e' piu' largo che alto (3:2).** I file
                            sono normalizzati sull'**altezza**: il piatto e'
                            tondo, quindi la sua altezza e' il diametro, ed e' la
                            stessa in tutti — 451px su 480 di tela. Con
                            `object-contain` un'immagine entra per il lato che
                            eccede: se il riquadro fosse quadrato, la tartare
                            — che e' larga 1.37 perche' ha anche le due
                            ciotoline — entrerebbe per la larghezza e il suo
                            piatto verrebbe rimpicciolito. Con un riquadro piu'
                            largo di 1.37 entrano tutte per l'altezza, e i piatti
                            si vedono tutti dello stesso diametro.

                            **La larghezza segue la fascia bianca**, invece di
                            essere fissa: la fascia va da ~243px a 1280 fino a
                            ~589px a 1920, e un valore fisso o sborderebbe sullo
                            schermo piccolo o sprecherebbe spazio su quello
                            grande.

                            La fascia vale `50vw - 384px` — meta' di quello che
                            avanza attorno al menù, largo 768px. Il riquadro usa
                            la **stessa pendenza** (`50vw`) con un'intercetta
                            appena piu' alta: cosi' resta a una distanza costante
                            dai bordi invece di avvicinarsi o allontanarsi
                            mentre la finestra cambia. A 1280 sono 240px contro
                            243 di fascia, ed e' il punto che detta il limite:
                            li' lo spazio e' finito. Il tetto di 34rem evita che
                            su uno schermo molto largo il piatto diventi
                            sproporzionato rispetto al testo.

                            `loading="eager"` e non pigro: con il caricamento
                            pigro non partiva nessuna richiesta, perche' il
                            browser non considera visibile un'immagine dentro un
                            contenitore trasparente. Alla misura del cerchio sono
                            pochi KB l'una. */}
                        <NomePiatto nome={item.name} photo={item.photo} />
                        {item.description ? (
                          <p className="mt-1.5 text-[0.9375rem] leading-[1.5] opacity-60 sm:mt-2 sm:text-base sm:leading-relaxed">{item.description}</p>
                        ) : null}
                        {/* Tedesco e inglese in tono minore: servono a chi non
                            legge l'italiano senza contendere il primo piano al
                            nome del piatto. `lang` fa cambiare voce e regole di
                            sillabazione agli screen reader. */}
                        {item.de ? (
                          <p lang="de" className="mt-1.5 text-xs leading-[1.45] opacity-45 sm:text-[0.8125rem] sm:leading-relaxed">
                            {item.de}
                          </p>
                        ) : null}
                        {item.en ? (
                          <p lang="en" className="mt-1 text-xs leading-[1.45] opacity-45 sm:text-[0.8125rem] sm:leading-relaxed">
                            {item.en}
                          </p>
                        ) : null}
                      </div>
                      </div>
                    </li>
                  ))}
                  </ul>
                </StaggerGroup>
              </div>
            ))}

            {cta ? (
              <div className="flex justify-center">
                <Button href={cta.href} variant="gold">
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
