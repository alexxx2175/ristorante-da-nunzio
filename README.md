# Ristorante da Nunzio — sito

Sito del ristorante **da Nunzio**, Malcesine (Lago di Garda).

Struttura, design system, animazioni, SEO tecnica, fotografie, menù, carta dei
vini e pannello di gestione sono in piedi. Restano da fornire alcuni contenuti
del locale — i link social, il dominio definitivo, qualche fotografia. Vedi
[Cosa manca](#cosa-manca).


## Pannello di gestione del menù

`/admin` — raggiungibile dal "Gestione" in fondo al piede, accanto alla partita
IVA. Fuori dalla sitemap e dai motori di ricerca.
Si entra con una password sola (`ADMIN_PASSWORD`). In cima si aggiunge un
piatto: portata (antipasto, primo, secondo, contorno), nome, ingredienti,
prezzo, tedesco e inglese, fotografia. Sotto c'è **tutto il menù in un elenco
solo** — piatti del cartaceo e piatti aggiunti da qui insieme, perché sono la
stessa carta e l'ordine è uno — con quattro comandi per riga:

| | Cosa fa |
| --- | --- |
| ☰ maniglia | Si trascina e i piatti si riordinano, col mouse e col dito. L'ordine si salva al rilascio. |
| 👁 occhio | Aperto = in carta, sbarrato = spento. Un piatto spento sparisce dal sito ma resta qui, e si riaccende quando torna. |
| ✎ matita | Apre il modulo, **già compilato**: nome, ingredienti, prezzo, traduzioni, fotografia — e la sezione, quindi da qui un piatto si sposta fra le portate. |
| 🗑 cestino | Toglie per sempre, dopo una conferma. Due clic, non uno: l'icona è a un centimetro dall'occhio e col dito si sbaglia. |

Le traduzioni tedesca e inglese lasciate vuote le propone la traduzione
automatica al salvataggio (serve `ANTHROPIC_API_KEY`); nella matita c'è un
bottone per rifarle e restano campi correggibili come gli altri. **Se la
traduzione non arriva il piatto si salva lo stesso**, senza: un servizio esterno
giù non è una buona ragione per perdere un piatto.

Il menù scritto a mano (`lib/menu.ts`) resta la base: venticinque voci con
traduzioni, prezzi e allergeni. Il pannello **non lo riscrive**, ci lavora
attorno — accoda, spegne, modifica, sposta — e `lib/menu-composto.ts` mette
insieme le due cose **in un posto solo**, per il sito e per il pannello. Se
ognuno se lo ricomponesse per conto suo, prima o poi il locale toglierebbe un
piatto che al cliente resta lì. Al peggio si svuota il deposito e il menù torna
esattamente com'era scritto.

### Variabili d'ambiente

Vedi `.env.example`.

| Variabile | Dove serve | Cosa succede se manca |
| --- | --- | --- |
| `ADMIN_PASSWORD` | ovunque | La pagina `/admin` non si apre. È voluto: nessuna password di riserva. |
| `BLOB_READ_WRITE_TOKEN` | solo in produzione | Si scrive su disco invece che su Vercel Blob. In locale è quello che si vuole; **su Vercel le modifiche andrebbero perse a ogni pubblicazione.** |
| `ANTHROPIC_API_KEY` | facoltativa | Niente traduzione automatica: i campi tedesco e inglese restano da compilare a mano e il bottone «Proponi traduzione» non compare. Tutto il resto del pannello funziona identico. |

### Due depositi, stessa interfaccia

`lib/piatti-store.ts` sceglie in base alla presenza del token, non in base a un
interruttore: in locale scrive sotto `.dati/`, su Vercel su Blob. Le fotografie
seguono i dati. In locale sono servite da `app/media/[nome]/route.ts` e non da
`public/`, perché quello che si scrive lì dopo l'avvio non viene servito —
`next start` fa l'elenco dei file statici una volta sola.

Le scritture passano da una coda (`aggiorna()` in `piatti-store.ts`): ogni
operazione è un leggi-cambia-scrivi sullo stesso file, e due che si accavallano
si mangiano a vicenda — basta spegnere due piatti di fila senza aspettare, ed è
esattamente come si usa un pannello del genere.


## Avvio

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build di produzione
npm run typecheck  # tsc --noEmit
```

## Stack

| Ambito          | Scelta                                          |
| --------------- | ----------------------------------------------- |
| Framework       | Next.js 16 (App Router) + React 19 + TypeScript |
| Stili           | Tailwind CSS 4 (token nel blocco `@theme` di `app/globals.css`, nessun file di config) |
| Animazioni      | GSAP + ScrollTrigger                            |
| Split del testo | SplitType                                       |
| Smooth scroll   | Lenis                                           |
| Carousel        | Swiper                                          |
| Font            | `next/font/google` — Bodoni Moda + Montserrat   |

## Struttura

```
app/
  layout.tsx        font, SmoothScroll, Header, Footer, JSON-LD del locale
  page.tsx          home
  globals.css       design token, reset, utility di progetto
  sitemap.ts        generata da navItems
  robots.ts
  menu-ristorante/               piatti: degustazione, carta, allergeni
  carta-vini/                    carta dei vini, su pagina propria
  contact/
    page.tsx        contatti + form (l'ancora #prenota e' la meta della CTA)
    actions.ts      server action di invio, con validazione e honeypot
components/
  layout/           Header, Footer, MobileNav, PageHero
  providers/        SmoothScroll (monta Lenis, una volta sola)
  sections/         Hero, MissionStatement, ChefNunzio,
                    LakeSection, SeasonalProposals, Gallery, PhotoCarousel,
                    SplitFeature*, MenuScaffold, TastingMenu,
                    AllergenNotice
                    (* non usato da nessuna pagina: lo usava solo la landing
                       della pizzeria. Tenuto perche' e' un blocco generico
                       testo+immagine, pronto per una pagina futura.)
  ui/               Button, CircleCTA, Decorations, Logo, PlaceholderMedia,
                    Reveal, VideoTile, VineBranch, ContactForm
lib/
  site.ts           dati del locale, navigazione, CTA di prenotazione
  images.ts         catalogo delle foto: percorso + testo alternativo
  videos.ts         catalogo delle clip: percorso, poster + testo alternativo
  menu.ts           il menù trascritto dal PDF: piatti, bevande, allergeni
  seo.ts            metadata di pagina + dati strutturati schema.org
  gsap.ts           registrazione plugin + prefersReducedMotion()
  useLenis.ts       smooth scroll + refresh dei ScrollTrigger
  animations.ts     fadeInUp, staggerFade, textReveal, scrollParallax,
                    mouseParallax, crossfadeLoop
public/images/      18 foto del locale, gia' ridotte e ricompresse
public/videos/      5 clip (mp4) con il rispettivo poster (jpg)
```

## Pagine

| Rotta                          | Contenuto                                                |
| ------------------------------ | -------------------------------------------------------- |
| `/`                            | home (vedi sotto)                                         |
| `/menu-ristorante`             | menu degustazione, 25 piatti in 4 sezioni, avviso allergeni. Venti piatti hanno una foto ritagliata (PNG trasparente): compare al lato col cursore, al tocco sul telefono |
| `/carta-vini`                  | 75 vini in 10 sezioni: al calice, spumanti, Champagne, bianchi, rosati, rossi |
| `/contact`                     | telefono, WhatsApp, indirizzo, orari, dati fiscali        |

Le voci di `navItems` (`lib/site.ts`) alimentano header, menu mobile, footer
**e la sitemap**: aggiungere una pagina li' significa averla ovunque.

## Ordine delle sezioni della home

1. **Header** — `position: fixed`, sempre visibile, cosi' la CTA "Prenota il tuo
   tavolo" resta a portata di clic. Due stati: in cima trasparente con testo
   bianco, oltre 40px di scroll fondo crema, testo scuro e altezza ridotta.
   Nav completa da `xl` (1280px); sotto, menu off-canvas (`MobileNav`).
2. **Hero** — l'unica sezione alta una schermata piena, con il video del locale in loop a tutto sfondo. All'apertura i primi 1,5 secondi mostrano solo il video, poi si compone il sito: header, testi, freccia. H1 con la
   keyword principale piu' il claim, CTA di prenotazione e telefono.
3. **MissionStatement** — la filosofia di cucina, con piu' aria delle altre sezioni,
   riempita parola per parola agganciata allo scroll (`scrub: true`). Qui l'aria
   intorno al testo e' il contenuto, non lo spazio avanzato. Due rami di vite
   agli angoli si muovono al movimento del mouse.
4. **ChefNunzio** — ritratto a sinistra, racconto dello chef a destra.
5. **LakeSection** — Malcesine e il lago: foto dentro un arco accanto al testo,
   su fondo crema, con decorazioni in parallasse al mouse.
6. **SeasonalProposals** — quattro piatti. Le tessere sono clip: sembrano
   fotografie e si muovono quando la sezione entra in viewport.
7. **ForkArch** — archi concentrici a filo che si disegnano uno dopo l'altro,
   con al centro un cerchio di marmo che fa da finestra: il marmo sta fermo, la
   forchetta scorre a un quinto della velocita' della pagina. Attorno, ventitre
   ingredienti ritagliati e sfocati che seguono il movimento del mouse, ognuno
   con la propria profondita'.
8. **Gallery** — griglia asimmetrica a forme organiche (cerchio, pillola, arco,
   rettangolo). **Tutte e sei le tessere cambiano fotografia mentre si scorre**
   (`RotatingPhoto`), mescolando piatti e locale in ordine casuale,
   rettangolo), entrata a cascata, claim e CTA circolare al centro. Una sola
   tessera e' una clip in movimento, in mezzo alle altre ferme. E' anche l'unica
   sezione della home con il ritmo verticale ampio.
9. **Footer** — blocco chiaro (marchio + nav) e blocco marmo scuro (telefono,
   CTA, indirizzo, orari, contatti, social, P.IVA).

## Ritmo verticale e scorrimento

**L'altezza delle sezioni la detta il contenuto.** L'utility `screen-section`
(in `globals.css`) centra il contenuto in verticale e mette il ritmo verticale,
ma non impone nessuna altezza minima.

> **C'e' stata un'impaginazione a schermate piene, ed e' stata tolta**
> (29/08/2026). Ogni sezione era alta `100svh`. Misurata a 1440x900, la home
> portava ~1130px di vuoto: le quattro sezioni centrali stavano a 900px con
> 590-660px di contenuto. La pagina e' passata da 6515px a ~5450px.
>
> Chi la rimettesse: il padding in cima per l'header **non va in
> `screen-section`**. L'header e' `fixed` e il contenuto gli scorre sotto,
> quindi riservargli spazio serve solo alla sezione che apre la pagina — per
> quella c'e' `page-hero-section`. Applicarlo a tutte aggiungeva 136px a ogni
> sezione senza motivo.
>
> Attenzione anche alle decorazioni posizionate in assoluto: le due viti di
> `MissionStatement` erano tarate su una sezione alta 900px e, accorciata la
> sezione, finivano sopra al claim.

Il movimento e' il solo smooth scroll inerziale di Lenis (`lib/useLenis.ts`),
sincronizzato con il ticker di GSAP perche' ScrollTrigger legga la posizione
interpolata da Lenis e non quella nativa. Con `prefers-reduced-motion` Lenis non
viene montata affatto: resta lo scroll nativo del browser.

> **C'e' stato un aggancio a schermate e non va rimesso.** Era `lenis/snap` in
> `proximity`: dopo ogni gesto la pagina scivolava alla schermata piu' vicina.
> Sulla carta e' l'effetto "fullpage"; alla prova si percepisce come uno
> strappo, perche' interrompe un movimento che l'utente ha ancora in corso. Se
> l'idea dovesse tornare, il problema da risolvere prima e' quello — non la
> durata o l'easing dell'animazione di aggancio, che erano gia' morbide.
>
> Da non tentare nemmeno con `scroll-snap-type` CSS: lo snap nativo del browser
> e lo smooth scroll di Lenis si contendono la posizione e il risultato e' uno
> scatto continuo, peggiore del precedente.

## Le clip

Alcuni riquadri non contengono una fotografia ma una clip muta di ~3 secondi in
loop: sembrano foto ferme e si muovono quando entrano in viewport. Il componente
e' `components/ui/VideoTile.tsx`, il catalogo `lib/videos.ts`.

| Dove                          | Clip                                    |
| ----------------------------- | --------------------------------------- |
| `SeasonalProposals` | le 13 clip dei piatti, una alla volta a tutta larghezza |
| `Hero`              | il video di apertura, in loop a tutto sfondo            |

**Il poster e' il primo fotogramma della clip stessa**, non una foto diversa
dello stesso piatto. E' il dettaglio da cui dipende tutto l'effetto: la tessera
e' una fotografia ferma finche' il video non parte, e quando parte riprende
esattamente da dove il poster era rimasto, senza stacco. Con una foto qualsiasi
si vedrebbe un salto e l'illusione cadrebbe. I poster si rigenerano dal video:

```bash
qlmanage -t -s 1200 -o /tmp public/videos/nome.mp4
sips -s format jpeg -Z 1200 --setProperty formatOptions 70 \
  /tmp/nome.mp4.png --out public/videos/nome.jpg
```

Tre scelte tecniche che tengono in piedi la cosa, tutte in `VideoTile`:

- **`preload="none"`** — senza, il browser scaricherebbe tutte le clip al
  caricamento della pagina, megabyte spesi per contenuto che l'utente forse non
  raggiunge mai.
- **Play e pausa legati alla visibilita'** (IntersectionObserver, soglia 0.25) —
  niente video che continuano a decodificare fuori schermo, che su telefono
  significa batteria e calore.
- **`muted` + `playsInline`** — sono i due requisiti perche' iOS accetti
  l'autoplay; senza `playsInline` il video andrebbe a tutto schermo da solo.

Con `prefers-reduced-motion` la clip non parte mai e resta il poster: la tessera
e' a tutti gli effetti una fotografia.

I file sono gli originali forniti (1280x720). **Non ricodificarli con
`avconvert`**: i preset di sistema usano un bitrate piu' alto della sorgente e
il risultato pesa di piu' — su una clip di prova, 516 KB diventavano 1,3 MB.

## Animazioni

Gli helper stanno tutti in `lib/animations.ts`, ognuno ritorna una funzione di
cleanup e ognuno esce subito con `prefers-reduced-motion` applicando lo stato
finale. Il wrapper `components/ui/SplitHeading.tsx` li usa sui titoli.

| Helper | Effetto | Dove |
|---|---|---|
| `fadeInUp` | fade + slide-up all'ingresso | ChefNunzio, LakeSection, `Reveal` |
| `staggerFade` | ingresso a cascata | tessere della Gallery |
| `textReveal` | le **parole** si colorano seguendo lo scroll | MissionStatement |
| `charReveal` | le **lettere** entrano da destra, una volta | titolo della Gallery |
| `charScrub` | le lettere si rivelano legate alla posizione di scroll | titoli di ChefNunzio e LakeSection |
| `gradientFill` | un gradiente attraversa il testo | titolo di SeasonalProposals |
| `maskReveal` | l'immagine si scopre con una maschera da sinistra | foto dello chef |
| `slideInX` | entra da fuori schermo, si ritira risalendo | ramo di vite del footer |
| `scrollParallax` | parallasse allo scroll | LakeSection |
| `mouseParallax` | parallasse al movimento del mouse | MissionStatement, LakeSection |
| `crossfadeLoop` | dissolvenza continua fra piu' sfondi | nessuna sezione: lo usava la hero, che ora e' un video in loop |

In CSS (`globals.css`, blocco ANIMAZIONI): apertura a cerchio della hero
(`.hero-media` / `.hero-content`), gradiente di `.animated-text`, stato iniziale
di `.mask-reveal`, micro-interazioni `.arrow-btn` e `.nav-underline`.

### Due trappole gia' pagate

**I `clip-path` interpolano solo fra forme uguali.** Il primo tentativo aveva
`circle(12% at 50% 55%)` → `circle(85% at 50% 50%)`. Il minificatore toglie la
posizione dove e' ridondante, quindi il secondo estremo diventava `circle(85%)`:
forme diverse, il browser smette di interpolare e l'animazione salta secca al
valore finale. Ora la posizione e' omessa in entrambi i fotogrammi.

**L'apertura della hero e' in CSS, non pilotata da JS a colpi di `setTimeout`.**
Cosi' se lo script non parte la hero e' comunque aperta, e con reduced-motion la
regola globale azzera la durata e l'apertura e' istantanea.

### Cosa NON e' stato portato, e perche'

| Cosa | Motivo |
|---|---|
| Loader introduttivo a fotogrammi | servono immagini dedicate che non ci sono, e un overlay che blocca la pagina per 2 s peggiora il primo caricamento — su un sito di ristorazione e' il momento in cui si decide se restare |
| Sezione a due box con immagine che insegue il mouse | quella sezione era `RestaurantPizzeria`, rimossa insieme alla pizzeria: non esiste piu' il DOM su cui agganciarla |
| Barra tab del menù sticky con frecce | le sezioni del menù sono quattro e stanno in una schermata di scorrimento: una barra di navigazione interna aggiungerebbe un elemento fisso senza far risparmiare scroll |
| Timeline lettera-per-lettera con anime.js | aggiungerebbe una libreria per fare quello che `charReveal` gia' fa con GSAP, che e' gia' in progetto |

### Verificate in un browser vero

Tutte, il 26/08/2026, pilotando un Chrome **non headless** via CDP e catturando
i fotogrammi durante l'animazione. Compresa l'apertura a cerchio della hero, che
era il punto rimasto aperto: a 500 ms dal caricamento il cerchio e' a meta'
corsa, quindi la transizione interpola davvero e non salta al valore finale.

Se rifai le misure, falle **headful**. In headless `requestAnimationFrame` non
gira: i fotogrammi avanzano solo quando qualcosa li forza (uno screenshot, per
esempio). Le animazioni agganciate allo scroll sembrano funzionare lo stesso —
ScrollTrigger si aggiorna sull'evento di scroll — ma quelle a tempo libero
restano ferme. Il crossfade della hero sembrava morto per questo motivo, e non
lo era.

Numeri utili come riferimento: il crossfade cicla i 3 layer con 5 s di stacco e
1.8 s di dissolvenza; il titolo dello chef si completa in ~420 ms da quando
arrivi sulla sezione.

### Cosa succede senza JavaScript

Due elementi diventano visibili solo grazie a JS, quindi hanno un fallback:

- la **foto dello chef** parte con `mask-size: 0%` e la apre `maskReveal()`.
  Il fallback e' `@media (scripting: none)` in `globals.css`. Prima era
  `.no-js .mask-reveal`, ma nessuno aggiungeva mai `no-js` all'`<html>`: la
  regola non si applicava in nessun caso e senza JS la foto restava invisibile.
- il **primo layer della hero** e' visibile gia' nell'HTML servito. Se partisse
  a `opacity-0` come gli altri, la hero resterebbe nera fino a idratazione
  avvenuta — e nera per sempre senza JS — perche' ad accenderlo e'
  `crossfadeLoop`.

Si verifica con `Emulation.setScriptExecutionDisabled` e leggendo lo stile
calcolato dai domini DOM/CSS del debugger, non con `Runtime.evaluate`: con lo
scripting spento la pagina non esegue JS.


## Il marchio

`components/ui/Logo.tsx`. Il ritratto e la firma «da Nunzio», **affiancati**:
nel disegno originale la firma sta sotto al ritratto e in una testata alta 80px
finiva schiacciata in una striscia di venti — c'era, ma non si leggeva.

Sono **due file e due maschere**, non due immagini:

- Due file (`public/logo-ritratto.png`, `public/logo-firma.png`) perché vanno
  impaginati: distanza e proporzione fra i pezzi cambiano con la misura, e
  dentro un'immagine sola sarebbero congelate. Staccati per macchie d'inchiostro
  attaccate, non con un taglio orizzontale: ritratto e firma non si toccano mai,
  ma in altezza si sovrappongono di una decina di pixel e un taglio netto
  avrebbe mangiato la punta del bavero.
- Maschere riempite con `currentColor` (`.marchio-ritratto`, `.marchio-firma` in
  `globals.css`) perché la testata cambia colore mentre si scorre: chiara sopra
  al video, scura una volta scesi. Un file nero sarebbe sparito sul video, uno
  bianco sul crema. Così il marchio prende il colore del testo che ha attorno e
  segue la stessa dissolvenza, senza scriverla due volte.

Il file consegnato aveva il fondo crema **pieno**, non trasparente, e di un
crema diverso da quello del sito: il ritaglio e la trasparenza sono ricavati
scomponendo la copertura pixel per pixel, così i bordi restano morbidi.

`components/ui/MarchioFondo.tsx` è il volto solo, velato al 25%, in fondo a ogni
pagina. Finisce all'altezza dell'ultima riga di testo — sta fuori dal flusso per
farlo — ed esce da un bordo: a sinistra di regola, **a destra in home**, dove
l'ultima sezione è la galleria e le fotografie stanno a sinistra. Va in
`mix-blend-multiply` e non sotto al testo: su schermo stretto l'ultimo paragrafo
è largo quanto la pagina e il volto ci finisce sopra per forza; in
moltiplicazione le parole restano nere. Mandarlo dietro sembrava la soluzione,
ma in home spariva a metà, tagliato dal bordo di una foto.

## Il ramo di vite

`components/ui/VineBranch.tsx`. La vite è quella che copre davvero la facciata
del locale, sotto cui stanno i tavoli nel vicolo, e ricorre in tutte le foto
dell'esterno: è il segno del posto più di qualunque altro.

**Era un disegno a tratto in SVG** (`VineBranchDrawing.tsx`, tenuto da parte e
non più importato). Adesso è una fotografia su fondo trasparente
(`public/images/ramo-vite.png`, 1800×1200), e la differenza che conta è una: il
ramo **non eredita più il colore** dal contenitore. `text-accent-gold` non ha
più effetto — il verde è quello dello scatto. L'unica leva è l'opacità.

Dove compare:

| Dove | Come |
| --- | --- |
| `MissionStatement` | due rami agli angoli opposti, che si muovono al mouse (`data-depth`) |
| `ChefNunzio` | in basso a destra |
| `SeasonalProposals` | in alto a sinistra, dalla parte opposta a quello dello chef |
| `Gallery` | in basso a sinistra, chiude la home prima del piede |
| `MenuScaffold` | in alto a destra, solo da `lg` |
| `PageHero` | in basso a destra — quindi su tutte le pagine interne |
| `FooterVine` | nel blocco scuro, entra da destra quando il piede arriva in viewport |

Note pratiche:

- **Appoggiali al bordo (`top-0` / `bottom-0`), non spingerli fuori.** Le sezioni
  hanno `overflow: hidden` e quello che esce viene reciso da una riga dritta in
  mezzo alle foglie. Gli scarti negativi in pixel fissi (`-bottom-16`) erano il
  bug: il ramo si rimpicciolisce con lo schermo, il taglio no — a 390px mangiava
  metà del ramo. Il PNG ha già un quinto di altezza trasparente sotto e un ottavo
  sopra, che fa da sfumatura senza bisogno di sbordare.
- I tagli **laterali** vanno bene: sono il bordo della finestra e si leggono come
  un ramo che entra da fuori.
- `flip` lo specchia per usarlo sul lato opposto. Attenzione: applica un
  `transform` inline, quindi non si combina con una classe di trasformazione.
- Nel piede va **sopra** la velatura nera, altrimenti sparisce.
- La proporzione è 3:2 (il vecchio disegno era 16:9): a parità di larghezza il
  ramo è più alto di prima.

## Verificare il layout stretto

Chrome headless da riga di comando **clampa la finestra a 500px**: chiedere
`--window-size=390` produce uno screenshot largo 390 ma la pagina viene
impaginata a 500, e il ritaglio fa sembrare che il sito sbordi quando non e'
vero. Misurato, non supposto: una pagina di prova che stampa `window.innerWidth`
riporta 500 per qualunque richiesta inferiore.

500px resta comunque **sotto il breakpoint `sm` (640px)**, quindi il layout
stretto e' verificabile: si vede l'header ridotto a logo e hamburger e la hero
in colonna. Quello che NON si puo' verificare cosi' e' la fascia 390-430px dei
telefoni reali, dove cambiano le andate a capo dei testi lunghi. Per quella
serve un dispositivo vero o l'emulazione da DevTools.


## Convenzioni

**`lib/site.ts` e' la sorgente unica dei dati.** Nome, claim, indirizzo,
telefono, email, P.IVA, orari, social, voci di nav e CTA di prenotazione stanno
li'; da li' arrivano header, footer, menu mobile, pagina contatti, metadata,
JSON-LD e sitemap. Non duplicare questi dati nei componenti.

**`lib/images.ts` e' la sorgente unica delle foto.** Percorso e testo
alternativo di ogni immagine stanno li', raggruppati per uso: `heroBackgrounds`,
`backgrounds`, `pageHeroes`, `content`, `dishes`, `carousel`, `gallery`.
Cambiare la foto di una sezione e' una riga di quel file, non una caccia alla
`src` nel componente. I componenti ricevono un oggetto `Photo` e lo passano per
spread: `<PlaceholderMedia token="[FOTO-CHEF]" {...content.chef} />`.

**Un `alt` vuoto e' una scelta, non una dimenticanza.** Lo sono le foto
puramente decorative — sfondi di hero e testate — che stanno dentro contenitori
`aria-hidden` e il cui contenuto informativo e' gia' nel testo accanto:
descriverle farebbe ascoltare due volte la stessa cosa a chi usa uno screen
reader. Dove la foto porta informazione (ritratto dello chef, tessere della
gallery, slide del carosello, piatti) l'alt descrive quello che si vede.

**Ogni media mancante passa da `PlaceholderMedia`.** Finche' `src` e' assente
mostra un riquadro tratteggiato con il token ben leggibile; appena si passa un
path reale renderizza `next/image` (o `<video>`) senza toccare il layout.

**Un `href` che inizia con `[` non e' cliccabile.** `Button`, `CircleCTA`, i
social del footer e il link Instagram della gallery lo rilevano e rendono uno
`<span>` con `data-placeholder`, cosi' un contenuto non ancora fornito non
diventa mai un link rotto. Oggi vale per i tre profili social.

**Le pagine interne partono da `PageHero`.** Riserva in cima lo spazio
dell'header e garantisce un fondo scuro sotto la navigazione, che nello stato
iniziale ha il testo bianco: una pagina che iniziasse chiara avrebbe l'header
illeggibile fino al primo scroll.

## Aggiungere una foto

Le immagini in `public/images` sono le originali ridotte e ricompresse (qualita'
65), non i file di macchina: da `next/image` passano poi le varianti servite al
browser. Le misure in uso, con `sips` (macOS, gia' installato):

```bash
# sfondo a tutta pagina
sips -Z 1920 --setProperty formatOptions 65 originale.jpg --out public/images/nome.jpg
# blocco testo+immagine (chef)
sips -Z 1400 --setProperty formatOptions 65 originale.jpg --out public/images/nome.jpg
# carosello, gallery, piatti
sips -Z 1200 --setProperty formatOptions 65 originale.jpg --out public/images/nome.jpg
```

Poi aggiungi la voce in `lib/images.ts` con il suo `alt` e usala nella sezione.
In griglie uniformi preferisci originali verticali: le orizzontali vengono
tagliate male da `object-cover`.

## Prima di pubblicare

1. **Cambia `ADMIN_PASSWORD`** in `.env.local` e su Vercel: in locale c'è una
   password di prova, e con quella il pannello lo apre chiunque la indovini.
2. **Crea uno store Blob su Vercel**, così `BLOB_READ_WRITE_TOKEN` esiste.
   Senza, in produzione ogni modifica al menù sparisce alla pubblicazione
   successiva — si scriverebbe sul disco effimero della funzione.
3. **Metti `ANTHROPIC_API_KEY`** se vuoi la traduzione automatica (facoltativa).
4. **Controlla che il numero WhatsApp sia attivo** su WhatsApp: il bottone della
   pagina contatti ci manda dritto.
5. **Link social e dominio**: vedi qui sotto.

## Cosa manca

| Cosa                          | Dove intervenire                                                        |
| ----------------------------- | ----------------------------------------------------------------------- |
| Dolci                         | il PDF 2026 non li contiene: ci sono antipasti, primi, secondi, contorni e bevande, ma nessun dessert. Se esiste una carta separata, si aggiunge una sezione a `lib/menu.ts` — la carta dei vini è stata aggiunta così (`wineSections`) |
| Sei righe della carta dei vini| nel testo consegnato sei voci sono corrotte o incomplete (Il Contestatore/Charus, «La BMeunier», Monte delle Saette/…ZATO Vespaiolo, «Bardolnella», Terre IGT/Carmenère San Leonardo, e un «Metodo classico» senza produttore). Stanno in `wineSections`, `lib/menu.ts`: vanno rilette sul cartaceo |
| Nomi dei piatti               | `SeasonalProposals` mostra i piatti senza nome, ingredienti o prezzi: dedurli da una fotografia significherebbe pubblicare un menù inventato, con di mezzo gli allergeni. Per aggiungerli: un campo `name` in `dishes` (`lib/images.ts`) e una `<figcaption>` nella figure |
| Link social                   | `siteConfig.social` in `lib/site.ts`                                    |
| Dominio definitivo            | `siteConfig.url` in `lib/site.ts` (usato da metadata, canonical, sitemap, robots) |
| Giorno di chiusura            | `siteConfig.hours` / `openingHoursSpecification` in `lib/seo.ts`: oggi le due fasce sono trattate come giornaliere |
| Foto del lago e del porto     | fra le foto fornite non ce n'e' nessuna del Garda, del porto vecchio o del Monte Baldo: hero, `LakeSection` e gallery usano esterni del locale. Il testo della sezione parla pero' del lago |
| Texture marmo scuro           | `public/images/texture-marmo-scuro-oro.jpg`. Il marmo **chiaro** c'e' (sta sul `body`, e' lo sfondo del sito); manca solo lo scuro, e finche' manca `.texture-marble-dark` resta colore pieno. Il commento sopra la classe in `globals.css` dice la riga da rimettere |
| Nome del locale               | il sito dice "Ristorante da Nunzio" (`siteConfig.name`), l'insegna nelle foto dice **"Aristotele da Nunzio — Pizza e cucina italiana"**. Restano quindi due scarti: il nome vero comincia con "Aristotele", e l'insegna promette pizza. Nome e insegna incoerenti con la scheda Google danneggiano il posizionamento locale: da decidere, e riguarda `siteConfig.name`, il logo, i metadata e il JSON-LD |
| Foto con la pizza nell'insegna| `insegna-ingresso.jpg` (l'ingresso, con la scritta "PIZZA E CUCINA ITALIANA") non e' piu' usata: era la testata dei contatti, sostituita dalla sala. E' ancora in `public/images` se dovesse tornare utile. Altre foto dell'esterno mostrano la stessa targa, piu' in piccolo |
| Colori, tipografia, breakpoint| blocco `@theme` in `app/globals.css`                                     |

### Form contatti — rimosso

Il modulo di contatto e la sua azione lato server (`ContactForm.tsx`,
`app/contact/actions.ts`) sono fuori uso dal 02/09/2026: dalla pagina contatti si
prenota al telefono o su WhatsApp. I file restano su disco, intestati, con la
variabile `CONTACT_WEBHOOK_URL` che servirebbe a rimetterli in funzione.

## Note di implementazione

- `lib/useLenis.ts` chiama `ScrollTrigger.refresh()` a ogni variazione di altezza
  del documento (font swap, init di Swiper, media che caricano): senza questo i
  trigger restano ancorati a coordinate calcolate sul primo paint. La chiamata e'
  **debounced a 200ms, non coalescata a frame**: `refresh()` rimisura ogni
  trigger della pagina, e se il ResizeObserver si attiva ripetutamente mentre si
  scorre, girare a ogni frame si vede come perdita di fluidita' proprio durante
  il movimento.
- `Decorations` marca le sue forme con `data-depth`, ma **il listener del mouse
  va messo sulla sezione**, non sul livello decorativo: quello e'
  `pointer-events-none` e il puntatore non ci arriva mai.
- Tutti gli helper di `lib/animations.ts` rispettano
  `prefers-reduced-motion: reduce` (stato finale applicato subito, niente smooth
  scroll, niente parallax) e ritornano una funzione di cleanup da chiamare
  nell'unmount.
- Gli elementi animati in entrata partono con la classe `.gsap-hidden`
  (`opacity: 0`) per evitare il flash pre-JS; con reduced-motion la classe
  torna opaca via CSS.
- I dati strutturati `Restaurant` (`lib/seo.ts`) sono volutamente senza `geo` e
  `priceRange`: si aggiungono quando ci sono coordinate e fascia di prezzo reali.
- Le voci di nav sono anche ancore SEO, quindi lunghe ("Cena romantica a
  Malcesine"). Quando erano sei, a 1280px non stavano su una riga e servivano
  tracking stretto e CTA accorciata; rimossa la pizzeria sono scese a quattro e
  quei compromessi sono stati tolti. Se ne aggiungi altre, verifica a 1280px
  prima di dare per scontato che ci stiano.
- **Attenzione a passare utility di `display` via `className` ai componenti
  `ui/`.** `Button` e `CircleCTA` impongono gia' `inline-flex` nella propria
  stringa base, e nel foglio generato `.inline-flex` viene DOPO `.hidden`: a
  parita' di specificita' vince l'ultima regola del CSS, non l'ordine in cui le
  classi compaiono nell'attributo `class`. Un `className="hidden sm:inline-flex"`
  passato al Button quindi **non nasconde niente** — era un bug reale nel CTA
  dell'header, che restava visibile su telefono accanto all'hamburger. La
  soluzione e' mettere il display su un `<span>` che avvolge il componente.
- Breakpoint: default Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280,
  `2xl` 1536) piu' `xs` 480, `hd` 1440, `fhd` 1920.
