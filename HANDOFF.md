# Handoff — Ristorante da Nunzio

Aggiornato il **27 agosto 2026**.

Sito del ristorante da Nunzio, Malcesine (Lago di Garda). Next.js 16 (App
Router) + React 19, Tailwind 4, GSAP + ScrollTrigger, Lenis, Swiper.
Documentazione completa in `README.md`; questo file dice solo **a che punto
siamo**. Si riscrive con `/handoff` e si rilegge con `/leggihandoff`.

## Come si avvia

```bash
npm run dev        # http://localhost:3000
npm run build
npx tsc --noEmit
```

Stato al momento della scrittura: `tsc --noEmit` **passa**, `npm run build`
prerenderizza tutte e 9 le rotte.

> **Il progetto non è sotto controllo di versione.** Niente git, quindi niente
> rete di sicurezza: prima di cancellare qualcosa di scritto a mano, mettilo da
> parte. È il motivo per cui esiste `components/ui/VineBranchDrawing.tsx`.

## Fatto

**Animazioni — revisione completa.** Tutti e 11 gli helper di
`lib/animations.ts` verificati in un browser vero, compresa l'apertura a
cerchio della hero che il README dava per non verificata.

- `lib/animations.ts` — `charScrub` da `scrub: 2` a `0.6`, ora configurabile.
  Il titolo dello chef si completa in **418 ms** invece di 1407.
- `app/globals.css` — fallback senza JS con `@media (scripting: none)` per
  `.mask-reveal` e `.gsap-hidden`. Prima c'era `.no-js`, che però nessuno
  aggiungeva mai all'`<html>`: non si applicava in nessun caso.
- `components/sections/Hero.tsx` — il primo layer di sfondo parte visibile
  nell'HTML servito. Prima era `opacity-0` e ad accenderlo era `crossfadeLoop`:
  hero nera fino a idratazione, e nera per sempre senza JS.
- `app/globals.css` — tolto il `background-image` dalle classi
  `.texture-marble-*`: puntava a due file inesistenti e costava due 404 per
  pagina senza cambiare niente a schermo.

**Claim della home su 3 righe.** `--text-display-claim` da
`clamp(1.75rem, 4.4vw, 4rem)` a `clamp(1.75rem, 3.4vw, 3.25rem)` e contenitore
da `max-w-5xl` a `max-w-[95rem]` in `MissionStatement.tsx`. Tre righe da 768px a
1920px; a 390px restano 7 righe (era già così, il corpo è al minimo del clamp).

**Menù, dal PDF `NUNZIO_menu 2026.pdf`.**

- `lib/menu.ts` — 25 piatti in 4 sezioni, 42 bevande in 4 sezioni, menu
  degustazione, avviso allergeni. Tutto in italiano, tedesco e inglese.
- `components/sections/MenuScaffold.tsx` — rende le traduzioni con `lang`
  corretto; chiave React ora `nome-indice` (fra le bevande "Peroni" compare due
  volte, il solo nome non era univoco).
- `components/sections/TastingMenu.tsx`, `AllergenNotice.tsx` — nuovi.
- `app/carta-vini/page.tsx` — rotta, e voce "Vini" in `navItems`
  (era `carta-bevande` / "Bevande" fino al 01/09/2026)
  (che alimenta header, menu mobile, footer **e** sitemap).

**Angoli stondati rimossi dalle foto.** Chef, carosello, tessere dei piatti,
gallery rettangolare, `SplitFeature`: da `2rem`/`1.5rem` a `0`. L'arco tiene la
curva in cima e appoggia su base squadrata. Cerchio e pillola non toccati:
angoli non ne hanno. In `Gallery.tsx` la forma `rounded` si chiama ora `rect`.

**Vite: dal disegno alla fotografia.** `public/images/ramo-vite.png` (da
`AdobeStock_619893112.png`, ridimensionata da 7472px/16 MB a 1800px/1,1 MB con
`sips`). Fondo davvero trasparente, verificato: 82% dei pixel ad alpha 0.
`components/ui/VineBranch.tsx` ora rende un `next/image`.

> **Il ramo non eredita più il colore.** Con l'SVG bastava `text-accent-gold`
> sul contenitore; su una fotografia quelle classi non fanno niente. Le ho tolte
> dai quattro contenitori. L'unica leva rimasta è l'opacità.

`FooterVine.tsx` ritarato: `-top-16 w-[15rem] opacity-25 lg:-top-20 lg:w-[20rem]`.
Alla misura di prima la foto, molto più densa del tratto, copriva il bottone di
prenotazione e la colonna social.

**Proposte stagionali: una fascia video a tutta larghezza** (29/08/2026).
`components/sections/SeasonalShowcase.tsx`. Un piatto per volta in una fascia
alta `60svh` fra due bande di marmo, con 13 clip. Cambiano in due modi che
convivono: **scorrendo** (un piatto ogni ~160px, finche' la sezione e' a
schermo) e **da soli** ogni 2,2s quando ti fermi. Frecce e pallini per il
comando manuale.

L'altezza e' legata alla **finestra**, non a un rapporto fisso: con un rapporto
fisso, a tutta larghezza, il video diventa piu' alto dello schermo e le bande
spariscono (su 1728px un 16:9 e' alto 972px contro 956 di finestra).

> **Due cose che sembrano dettagli e non lo sono.**
>
> Il passo dello scroll e' in **pixel fissi**, non una frazione della sezione.
> C'e' stata una versione che ricavava l'indice dalla posizione della sezione
> nello schermo: con 4 clip funzionava, con 13 diventavano 80px per piatto —
> meno di una rotellata — e ne lampeggiavano diversi insieme.
>
> Lo scroll si **ascolta** (listener `passive`), non si intercetta. C'e' stata
> una versione con `preventDefault` sopra al video: cambiava i piatti ma la
> pagina smetteva di rispondere, ed e' lo stesso difetto per cui era gia' stato
> tolto lo snap di Lenis. Prima ancora c'era una sezione bloccata su un binario
> alto tre schermate, peggio.

**Foto dei piatti rifatte, tutte e undici** (30/08/2026). Vengono da
`~/Downloads/piatti nunzio nuove`: scatti dall'alto, piatto centrato, fondo
pulito e luce uguale. E' la prima volta che le foto del menù sono una serie
coerente invece di scatti presi da occasioni diverse.

> Essendo tutte inquadrate cosi', il quadrato per il cerchio e' un ritaglio
> **centrato al 96%** — niente piu' centri decisi foto per foto. **Unica
> eccezione la tartare**, il cui scatto comprende anche due ciotoline di
> contorno: li' il ritaglio e' spostato sul piatto (cx 0.40, k 0.80), altrimenti
> il quadrato centrato taglia le ciotoline a meta' sul bordo del cerchio.

> **Due foto della serie non sono agganciate a nessuna voce**: un crudo di pesce
> e un piatto con cozze in brodo arancione. Nel menù non c'e' un crudo, e il
> secondo puo' essere piu' voci diverse. Stanno in `galleryGroups`. Da chiedere
> al locale che piatti siano.

> **L'arco di pietra disegnato e' stato scartato** (30/08/2026): il piatto
> disegnato non convinceva. `ArchFeature`, `StoneArch` e `ForkDish` restano su
> disco intestati NON IN USO, e la sezione e' stata tolta dalla home. Il locale
> fa le fotografie e l'idea e' animarle.

**Sezione forchetta, fra il video e la gallery** (30/08/2026).
`components/sections/ForkArch.tsx` con `components/ui/ArchLines.tsx`. Ricostruita
da un riferimento visivo fornito dal locale: archi concentrici a filo, cerchio di
marmo, forchetta con pacchero e cozza, CTA tonda sotto.

Materiali forniti: `Senza titolo-1.svg` (i sei archi), la forchetta ritagliata
(PNG con alpha) e il marmo venato d'oro. Diventati
`components/ui/ArchLines.tsx`, `public/images/forchetta-pacchero.png` e
`public/images/marmo-oro.jpg`.

> **La forchetta sta dentro il cerchio e ne esce dal fondo.** E' il dettaglio
> che regge la composizione: quel taglio fa leggere il cerchio come una finestra
> invece che come un adesivo tondo. Larga il 92% del cerchio, spostata in alto
> del 16%.

> **I path del file SVG non sono in ordine dal piu' grande al piu' piccolo**:
> sono mescolati. `ARCHI` in `ArchLines.tsx` li rimette in fila dall'esterno
> all'interno, cosi' il disegno progressivo va verso il centro invece che a caso.

> **`pathLength={1}`** normalizza la lunghezza di ogni tracciato, cosi'
> `stroke-dasharray: 1` lo copre esattamente senza doverla misurare a mano — e
> continua a funzionare se i tracciati cambiano.

> **La forchetta scorre a velocita' diversa dal resto.** E' l'effetto vero
> della sezione, ripreso dal riferimento che ha fornito il locale. Il cerchio
> ha `overflow: hidden` e fa da finestra: il marmo dentro sta fermo e scorre con
> la pagina, la forchetta riceve una traslazione proporzionale allo scroll. Da
> qui i due piani a velocita' diverse. Nessun `background-attachment: fixed`.

> **Il codice del riferimento e' auto-referenziale, e converge.** Calcola
> `y = -(scrollTop - offset) / (speed*2)` rileggendo a ogni giro un `offset` che
> **contiene gia' la traslazione applicata**. Sostituendo `offset = O + y` e
> risolvendo si trova il punto fisso: `y = (O - scrollTop) / (2*speed - 1)`, che
> con `speed 3` fa **un quinto**. `ForkArch` applica direttamente l'equilibrio.
> Misurato: rapporto -0.2000 esatto a ogni intervallo, scarto 0.00 fra valore
> applicato e valore atteso su desktop e mobile.
>
> `CERCHIO_PIENO` e' il diametro alla larghezza di progetto (oggi 448): se si
> ridimensiona la sezione va aggiornato, altrimenti la corsa cresce insieme al
> cerchio e la forchetta esce dalla maschera.
>
> Attenzione anche agli **script di verifica**: ricostruiscono il valore atteso
> con la stessa formula del componente, `ECCEDENZA` compresa. Cambiando la
> costante nel codice e non nello script compare uno scarto costante che sembra
> un difetto e non lo e'. E' successo: 7.38px, che sono esattamente
> `(0.325 - 0.2425) * 448 * 0.2`.

> **La corsa scala col diametro del cerchio** (`CERCHIO_PIENO`). Un quinto e' la
> misura giusta per un cerchio di 311px; il nostro pero' e' una frazione della
> pagina e su un telefono scende a 120px, dove gli stessi pixel di corsa
> svuotano la finestra e lasciano il marmo nudo — verificato, si vedeva. Nel
> riferimento il problema non si pone perche' il loro cerchio e' quasi fisso.

> **La forchetta e' piu' alta del cerchio** (`ECCEDENZA`, 148.5%), altrimenti
> scorrendo esce dalla maschera. Nel riferimento il rapporto e' 741 su 473.
>
> `ECCEDENZA` governa **due cose insieme**: la misura della forchetta, che sta
> in `object-contain` dentro un riquadro grande cosi', e quanto puo' scorrere
> prima di uscire dalla maschera. Abbassandola la forchetta rimpicciolisce ma si
> accorcia anche la corsa utile: va guardata a schermo, non solo calcolata. E
> vanno rifatti gli scostamenti del riquadro — `(100 - ECCEDENZA*100) / 2` per
> centrarla, piu' 13 per il ribasso.

> **La forchetta parte piu' in basso del centro** — `top-[-19.5%]` invece del
> -32.5% che la centrerebbe. Cosi' il piatto sta tutto dentro il cerchio mentre
> lo si guarda, e comincia a tagliarsi solo quando la sezione esce dallo
> schermo. Il ribasso sta nel CSS e non nel calcolo dello scroll: e' la
> posizione **a riposo** a cambiare, e la stessa inquadratura la vede anche chi
> ha chiesto meno animazioni.

> **Il cerchio sta dentro il blocco dell'arco, non dentro la sezione.** Prima
> erano fratelli, ciascuno dimensionato in percentuale della sezione: bastava
> cambiare formato perche' il cerchio scivolasse dentro la curva e coprisse gli
> archi piu' interni — il locale l'ha notato subito. Annidandolo, misura e
> posizione sono frazioni dell'arco e il rapporto fra i due non cambia mai.
>
> **Il cerchio e' concentrico agli archi**, ed e' la regola che tiene insieme
> tutta la composizione. I sei tracciati sono archi di cerchio con lo stesso
> centro — (415.36, 411.8) in unita' SVG — e raggi che calano di un passo
> costante di 33.3. Mettendo il cerchio su quello stesso centro, il margine dalla
> prima linea e' **uguale a sinistra, sopra e a destra per costruzione**, invece
> che stretto in cima e largo ai lati. Da qui `top-[10.113%]` e `w-[52.775%]`:
> sono quel centro e il raggio in frazioni del blocco arco.
>
> **Il margine giusto sta fra tre quarti e il passo pieno fra due linee.** Ci si
> e' arrivati per prove: a mezzo passo (17px contro 34) il cerchio sembrava
> incastrato; a 28.6px respira. Se si ridimensiona, e' quel rapporto a tenere —
> non il valore in pixel. E si ricalcola sempre dalla regola del concentrico,
> mai spostando il cerchio a mano.
>
> **La posizione verticale del cerchio non e' libera.** Imponendo i tre margini
> uguali resta inchiodata al centro degli archi, qualunque sia il raggio: la
> condizione `margine_sopra = margine_lato` si semplifica in `cy = centro degli
> archi` e il raggio sparisce dall'equazione. Abbassare il solo cerchio allarga
> il margine di sopra e lascia fermi quelli di fianco. Per abbassarlo davvero si
> sposta giu' **tutto il blocco arco** (`top-[8%]` sul contenitore): scendono
> insieme e il rapporto regge. E' la richiesta che e' arrivata dal locale, ed e'
> l'unico modo di soddisfarla senza rompere i margini.
>
> Il tracciato piu' interno **e' un cerchio vero**, non un'approssimazione da
> occhio: misurato, raggio 252.4px sia in verticale che in orizzontale. Il
> modello geometrico si puo' usare con fiducia.

> **Larghezza dell'arco `min(88%, 53rem)`**, non due valori su un punto di
> rottura: fra schermo stretto e schermo largo passa senza scalini.

> **Un ciclo rAF, non un ascolto dello scroll.** Agganciarsi allo scroll sembra
> piu' parsimonioso ma lascia la forchetta ferma in una posizione vecchia ogni
> volta che il layout si muove **senza** che si scrolli: immagini che finiscono
> di caricare, l'intro che sblocca la pagina, font che si sostituiscono. Il
> ciclo gira solo mentre la sezione e' in vista, acceso e spento da un
> `IntersectionObserver` con `rootMargin: '50%'`. Costo: una lettura di
> rettangolo per fotogramma.

> **Attenzione a `motion-safe:`**: funziona sulle utility di Tailwind, non su una
> classe scritta a mano. `motion-safe:fluttua` non generava niente e l'animazione
> del disegno degli archi non partiva. Con classe piana funziona, e a
> prefers-reduced-motion ci pensa la regola globale che azzera le durate.

> **Gli ingredienti che fluttuano** (31/08/2026) sono ventitre
> `public/images/ingrediente-*.png`: sette pezzi grandi — vongola, due
> pomodorini, cozza, prezzemolo, foglia, goccia d'olio — e sedici minuti fra
> foglioline e gocce. Rispondono al movimento del mouse tramite
> `mouseParallax`, con gli stessi `data-depth` della libreria del riferimento.
>
> Arrivavano **tutti da una sola immagine**, gia' disposti a cornice attorno a
> un centro vuoto. Separati cercando le **componenti connesse** del canale alfa
> e ritagliando ognuna mascherata per etichetta: i ritagli si toccano, e senza
> maschera in ognuno sarebbero finiti pezzi dei vicini. Lo script sta nello
> scratchpad della sessione, non nel progetto.
>
> `x` e `y` in `INGREDIENTI` sono in percentuale della **sezione intera**, non
> del blocco centrale: e' quello che li porta fino ai bordi della pagina. La
> disposizione e' sparsa ma **fissa**, generata una volta con un generatore
> deterministico e scritta nel file. Sorteggiarla a ogni render con
> `Math.random()` darebbe due pagine diverse fra server e browser e
> l'idratazione salterebbe.
>
> I sette grandi hanno una zona a testa lungo un anello attorno al cerchio, con
> le coppie dello stesso tipo in diagonale — i due molluschi, i due pomodorini:
> vicini leggono come una coppia invece che come un caso. E ci stanno **interi**:
> al sorteggio libero finivano ammucchiati in alto, e un pezzo grande tagliato a
> meta' dal bordo sembra un errore invece che una scelta. I minuti si spargono
> dove capita e possono sconfinare — sono pulviscolo.
>
> `sfocatura` e' un velo leggero, piu' forte sui pezzi piccoli: e' quello che li
> manda indietro e li fa leggere come pulviscolo invece che come adesivi.
>
> **Stanno piccoli apposta**: piu' grandi rubavano l'occhio alla forchetta, che
> e' il soggetto. Se si e' tentati di ingrandirli, e' la ragione per cui erano
> gia' stati rimpiccioliti.
>
> `sizes` e' calcolato per ciascuno (`${i.w}vw`, perche' la sezione e' larga
> quanto la finestra). Uno unico per tutti faceva scaricare 200px anche per un
> ritaglio da 29, ingrandendo il piccolo invece di rimpicciolire il grande.
>
> Il livello e' `pointer-events-none`: sotto ci passa il bottone, e serve
> comunque che il `pointermove` arrivi al contenitore, che e' dove
> `mouseParallax` ascolta.
>
> Nel riferimento gli oggetti si spostano **in direzione opposta** al mouse
> (`invertX/invertY`), qui verso il mouse. Non l'ho cambiato: `mouseParallax` lo
> usano anche `LakeSection` e `MissionStatement`, e girargli il segno cambiava
> due sezioni che nessuno aveva chiesto di toccare.
>
> Nell'anteprima quel PNG sembra avere un fondo nero e chiazze bianche attorno
> agli ingredienti. **Non e' vero**: misurato, e' trasparente al 94.6% e nei
> componenti il bianco sta fra lo 0 e il 2%. E' l'anteprima che rende cosi' la
> trasparenza — non rifare il ritaglio per quello.
>
> Manca ancora la **spolverata di spezie** in primo piano dentro la maschera.

> C'e' stata una versione **disegnata** di questa idea (arco di pietra e piatto
> in SVG), scartata: `ArchFeature`, `StoneArch` e `ForkDish` restano su disco
> intestati NON IN USO.

**Gallery: i piatti solo nelle tessere tonde** (31/08/2026).
Le due tonde alternano piatto e locale; le altre quattro mostrano soltanto il
locale.

> **Le fotografie sono le stesse di prima, tutte e venti**: cambia solo in quale
> tessera stanno. Un primo tentativo aveva anche raggruppato le tessere per
> soggetto, tolto un piatto e aggiunta una foto dal carosello: era piu' di
> quanto era stato chiesto, ed e' stato annullato. Se una modifica alla gallery
> tocca **quali** foto ci sono e non solo **dove**, e' probabile che stia
> allargando il campo.

> **L'alternanza non puo' stare nell'ordine dell'elenco**: `RotatingPhoto`
> mescola dopo il montaggio, e il rimescolamento la disferebbe. La garantisce
> `alternato()`, che mescola le due categorie **separatamente** e poi le
> intercala: resta casuale a ogni visita, ma un piatto non segue mai un piatto.
> Le categorie le distingue il campo `piatto` di `Photo`, segnato a mano e non
> dedotto dal prefisso `piatto-` del nome file: la convenzione regge oggi, ma
> affidare a un nome di file una scelta di composizione la rende fragile al
> primo rinomino.

> **Le tonde tengono sei foto a testa, le altre due.** Non e' una scelta
> estetica: gli otto piatti devono entrare tutti in due tessere sole, e le
> dodici foto di locale bastano appena a dare due immagini a ognuna delle altre
> quattro — sotto le due, la tessera resta ferma in una griglia dove tutto
> ruota. Con quattro piatti e due foto di locale per tonda, a fine giro restano
> due piatti di fila: e' il prezzo per tenerli tutti.

> **Due foto di sala restano inutilizzate, come sono sempre state.**
> `insegna-ingresso.jpg` porta la scritta "pizza e cucina italiana", che dice
> un'altra cosa rispetto al menu del sito; `sala-vini.jpg` inquadra volti
> riconoscibili di clienti a tavola.

> **Misurare la rotazione e' scivoloso.** Avanza solo mentre la tessera e' in
> vista, quindi scorrendo a grandi salti si ferma e sembra bloccata; e con una
> finestra molto alta la pagina non ha abbastanza corsa e non ruota affatto.
> Entrambe le cose mi hanno dato falsi negativi. Il modo che funziona: **un
> passo solo per caricamento**, con la tessera al centro dello schermo,
> ripetuto su piu' caricamenti. Cosi' misurato: 8 passi su 8 alternano.

**Gallery: sei tessere che ruotano** (29/08/2026).
`components/ui/RotatingPhoto.tsx` + `galleryGroups` in `lib/images.ts`. Tutte e
sei le tessere cambiano fotografia scorrendo, una ogni **520px**, mescolando
piatti e locale. Ordine **casuale**, rimescolato a ogni caricamento. La tessera
video non c'e' piu'.

I piatti sono le **nove fotografie contrassegnate con il tag rosso** dal locale
in `~/Downloads/ristorante da Nunzio` (`da.Nunzio-22, 35, 54, 58, 63, 66, 73,
76, 89`), ridotte a 1400px e ricompresse in `public/images/piatto-*.jpg`, 1,6 MB
in tutto. Prima erano i fotogrammi estratti dalle clip: servivano finche' non
c'era altro, ma erano fermi immagine di un video e si vedeva.

> I tag di Finder si leggono con `mdls -name kMDItemUserTags`. Nella stessa
> cartella ci sono 91 foto: le altre 82 non sono contrassegnate.

**Undici piatti su 25 hanno una foto sul menù**, in un cerchio che compare al
lato solo passando il cursore sul nome. Le foto sono la serie nuova
(`~/Downloads/piatti nunzio nuove`, 14 PNG): tutte dall'alto, fondo pulito, luce
uguale. `dishPhoto` in `lib/images.ts` le indicizza, `lib/menu.ts` le aggancia.

> **I 14 senza foto non sono una svista.** Fra le 14 disponibili non c'e' niente
> che li ritragga con certezza. Due della serie restano non abbinate — un crudo
> di pesce e un piatto con cozze in brodo arancione: nel menù non c'e' un crudo,
> e il secondo puo' essere piu' voci diverse. Stanno nella gallery. **Da
> chiedere al locale.**

> **Il cerchio non tocca il flusso del menù.** E' `absolute` dentro un <li>
> `relative`, `pointer-events-none`, trasparente a riposo. Verificato che
> l'altezza della pagina non cambi passandoci sopra.
>
> Sta **dentro l'h3** (il cursore deve valere sul nome, non su tutta la riga) ma
> si ancora al <li>, altrimenti si attaccherebbe alla fine del testo, che e'
> lungo diverso per ogni piatto. `left: calc(25vw + 75%)` piu'
> `-translate-x-1/2` lo centra nella fascia bianca a destra — verificato a 1280,
> 1600 e 1920: centro del cerchio e centro della fascia coincidono al pixel.
>
> Solo da `xl` in su: sotto non c'e' margine, e su touch il passaggio del
> cursore non esiste.
>
> **`loading="eager"`, non pigro**: con il caricamento pigro non partiva nessuna
> richiesta — il browser non considera visibile un'immagine dentro un
> contenitore trasparente, e al primo passaggio sarebbe comparso un cerchio
> vuoto.

> **Le foto sono i PNG ritagliati, non JPEG** (`piatto-*.png`, alte 480px, ~4MB
> in tutto).
>
> **Normalizzate sull'altezza, non sul rettangolo del contenuto**: i piatti sono
> tondi, quindi l'altezza del contenuto **e'** il diametro del piatto, ed e' la
> stessa in tutte — 451px su 480 di tela. Verificato a schermo: tutte e undici
> rese a 224px di altezza, cioe' stesso diametro.
>
> Normalizzare sul rettangolo intero non basta: la tartare ha anche **due
> ciotoline di contorno**, il rettangolo le include, e il suo piatto verrebbe
> rimpicciolito per far stare tutto. Sull'altezza no: le ciotoline stanno di
> fianco e allargano solo la tela (656x480 contro 480x480 delle altre).
>
> **La larghezza del riquadro segue la fascia bianca**, non e' fissa:
> `min(50vw - 400px, 34rem)`. La fascia vale `50vw - 384px`, e il riquadro usa
> la **stessa pendenza** con un'intercetta appena piu' alta — cosi' resta a
> distanza costante dai bordi invece di avvicinarsi o allontanarsi mentre la
> finestra cambia. Reso: 240px a 1280, 400 a 1600, 464 a 1728, 544 a 1920.
>
> **Il limite lo detta 1280**, dove la fascia e' 243px: li' non c'e' spazio per
> crescere. Una richiesta di "+40%" si puo' soddisfare solo sugli schermi larghi.
>
> **Per questo il riquadro a schermo e' 3:2 e non quadrato.** Con
> `object-contain` un'immagine entra per il lato che eccede: in un riquadro
> quadrato la tartare entrerebbe per la larghezza e il suo piatto sarebbe piu'
> piccolo degli altri. Con un riquadro piu' largo del suo rapporto (1.37)
> entrano tutte per l'altezza. **Se si aggiunge una foto piu' larga di 1.5, il
> riquadro va allargato di conseguenza.** Hanno lo sfondo trasparente — dal 29% al 58% dei pixel — e il
> piatto sta sul marmo senza cornice: niente maschera tonda, `object-contain`
> per mostrare il ritaglio intero.
>
> C'e' stato un cerchio, e con lui undici quadrati `piatto-*-tondo.jpg`
> pre-ritagliati. Servivano perche' le foto erano state convertite in **JPEG**,
> che non ha trasparenza: attorno al piatto restava un riquadro di fondo chiaro,
> e il cerchio lo nascondeva ritagliandolo. Ma tagliava anche il piatto, e ogni
> foto voleva il suo centro. Tenendo il PNG non serve niente di tutto questo.
> **Se le foto tornano a essere JPEG, il problema torna.**

> **E' stato tolto e rimesso** nel giro di poco: se ricapita, quello che conta
> conservare e' `dishPhoto` — sa quale foto appartiene a quale voce, e quel
> lavoro e' costato guardare tutto l'archivio.

**Video di apertura nella hero****Apertura della home** (30/08/2026). I primi **1,5 secondi** si vede solo il
video, a tutto schermo: niente header, niente testi, e niente velo scuro sopra.
Poi si compone il sito — header a 1,5s, testi a 1,85s, freccia a 2,1s.

La durata sta in `--intro-attesa` (`app/globals.css`), i tre ritardi sono
`calc()` su quella: si sposta l'attesa in un punto solo.

> **L'apertura a cerchio non c'e' piu'.** Era `clip-path` da `circle(12%)` a
> `circle(85%)` su `.hero-media`: nata quando lo sfondo era una fotografia, su
> un video mangiava i primi due secondi di ripresa proprio mentre si apriva.
> Se ci si torna: i due estremi devono avere la **stessa forma** di `circle()`,
> altrimenti il minificatore ne normalizza uno solo e l'animazione salta secca
> al valore finale invece di interpolare.

> Il **velo scuro** (`bg-black/45`) entra col resto e non prima: serve a rendere
> leggibile il testo sopra al video, e nei primi due secondi testo non ce n'e'.
> Tenerlo acceso smorzava la ripresa senza motivo.

> L'header fa l'entrata **solo sulla home** e solo se non si e' gia' scrollato:
> altrove non c'e' nessuna inquadratura da lasciar respirare, e un header che
> tarda sarebbe solo un header lento.

**Video di apertura nella hero** (29/08/2026). `public/videos/video-hero.mp4`
(18,3s, 5,6 MB) e' **tutto lo sfondo della hero**, in loop. Le tre fotografie
che si alternavano in dissolvenza non ci sono piu': `heroBackgrounds` e' stato
tolto da `lib/images.ts` e i file restano in `public/images` senza referenze.

Di conseguenza **`crossfadeLoop` non lo usa piu' nessuna sezione**. E' rimasto in
`lib/animations.ts` come pezzo generico della cassetta degli attrezzi, non come
codice orfano di una sezione.

Il video si mette in pausa quando la hero esce dallo schermo — verificato:
riparte da dov'era.

**Clip nuove** (29/08/2026). Le 13 di `~/Downloads/NUNZIO/CLIP SINGOLE PIATTI`
hanno sostituito le 5 precedenti. Poster estratti dal fotogramma 0 di ognuna
(via canvas in Chrome: non c'e' ffmpeg), che e' la convenzione del progetto.

> **Sono in HEVC, non in H.264.** Safari le riproduce, e anche Chrome su Mac —
> verificato, nonostante `canPlayType('hvc1')` risponda vuoto. Dove l'HEVC manca
> (Firefox, molte installazioni di Chrome su Windows) resta il poster: una foto
> ferma invece della clip. **Chiedere al service gli export in H.264**: stessi
> nomi, rimpiazzo diretto. Ricodificarle in locale non conviene, `avconvert` non
> ha controllo di bitrate e porta una clip da 1,5 a 3,9 MB.

**Fluidita' dello scorrimento** (29/08/2026). Due interventi, entrambi sulla
sensazione e non sul frame rate — che era gia' a 120fps con zero fotogrammi
persi, misurato:

- `lib/useLenis.ts` — da `duration: 1.2` + easing a `lerp: 0.1`. Con `duration`
  ogni rotellata faceva ripartire un'animazione da 1.2s: girando piu' volte le
  animazioni si accavallavano e la pagina scivolava per oltre un secondo dopo
  che avevi smesso.
- `app/globals.css` + `app/layout.tsx` — il marmo non e' piu'
  `background-attachment: fixed` sul body ma un livello `position: fixed`
  (`.marble-backdrop`). Il primo obbliga il browser a ridisegnare la texture a
  ogni fotogramma di scroll; il secondo resta un livello composto. In piu' iOS
  Safari ignora `background-attachment: fixed`, un elemento fisso no.

**Animazioni sulle pagine del menù** (27/08/2026). `MenuScaffold.tsx`: ogni
`<ul>` è avvolta in `StaggerGroup`, ogni `<li>` ha `gsap-hidden
data-stagger-item`, e i titoli di sezione usano `SplitHeading mode="chars"`.
`PageHero.tsx` ha la classe `.page-hero-content`, che riusa le `@keyframes
hero-content-in` — in CSS e non con ScrollTrigger, perché la testata è già in
viewport al caricamento e l'H1 è l'elemento LCP.
Verificato in Chrome headful: a ogni altezza di scroll **ogni voce che è a
schermo è visibile** (25/25 e 42/42 alla fine della pagina), e con
`Emulation.setScriptExecutionDisabled` le 25 voci restano tutte visibili — il
fallback `@media (scripting: none)` regge.

## In corso

**Vite sulla testata delle pagine interne — da ritarare.**
`components/layout/PageHero.tsx:44` è ancora ai valori pensati per il disegno:
`right-0 bottom-0 w-[20rem] opacity-30 lg:w-[30rem]`. Su una foto affollata (si
vede bene su `/menu-ristorante`) il verde al 30% legge come una macchia, non
come un ramo. Va rifatto lo stesso lavoro fatto sul footer: provare due o tre
varianti dal browser, misurare, scegliere.

## In coda

1. **Video della hero.** `~/Downloads/ctmarketing_video-sito-720p-mp4_.../VIDEO
   SITO 720P.mp4`, 1280×720, 18 s, 5,5 MB — deve sostituire l'immagine di
   apertura. **È HEVC, che Chrome e Firefox non riproducono in `<video>`**: va
   transcodificato in H.264. `ffmpeg` non c'è, ma `/usr/bin/avconvert` sì.
   Attenzione a come si incastra con `crossfadeLoop`, che oggi cicla tre foto.
2. **Favicon assente**: 404 su `/favicon.ico`. Con l'App Router basta
   `app/icon.svg`. Serve decidere l'icona — si potrebbe derivare dal lockup di
   `components/ui/Logo.tsx`.
3. **Texture di marmo**: le classi `.texture-marble-*` sono colore pieno finché
   il locale non fornisce i due file. Il commento sopra le classi in
   `globals.css` dice la riga esatta da rimettere.

## Da chiedere all'utente

- **Avviso allergeni, versione inglese.** Una riga non è uscita dal PDF
  (l'elenco fra "eggs," e "lupin") ed è **ricostruita** dall'elenco italiano.
  È testo con valore legale: va confrontata col cartaceo.
- **Dolci e carta dei vini** non esistono nel PDF 2026. Se ci sono su una carta
  separata, si aggiungono a `lib/menu.ts`.
- **Incongruenze già presenti nel menù cartaceo**, trascritte fedelmente:
  "Spaghetti al nero" dice *alici e burro* in italiano ma *Forellenkaviar* in
  tedesco; "Tagliatelle fusion" dice *sfumato alla soia* ma *Soave-Wein* in
  tedesco e inglese.
- **Gallery**: cerchio e pillola sono rimasti tondi. Se li vuole rettangolari è
  una riga in `globals.css`.

**Foto del menu: 20 voci su 25** (31/08/2026).
Sette ritagli nuovi in `public/images/piatto-*.png`, normalizzati come gli altri:
tela alta 480 col piatto alto 451. I piatti sono tondi, quindi l'altezza del
contenuto **e'** il diametro — normalizzando su quella risultano tutti della
stessa misura. Verificato: 451/480 su tutti e diciotto.

> **La foto che stava su "Anatra" ritraeva pollo.** Carne bianca a pezzi,
> verdure a julienne, gocce di curry: cioe' "Tomahawk di pollo — wok di verdure
> e curry verde". Segnalato dal locale, e la descrizione della voce lo conferma.
> Spostata li', e sull'anatra e' andata la foto giusta (petto rosato, porro
> croccante, gel d'arancia).

> **Sostituire una foto lasciando lo stesso nome file non si vede.** E' successo
> due volte: prima con la tagliata, poi con anatra e merluzzo. Il file su disco
> era giusto e il server serviva quello giusto — verificato scaricando i byte —
> ma il browser di chi aveva gia' aperto la pagina continuava a mostrare la
> vecchia, perche' l'indirizzo non era cambiato e la sua cache non aveva motivo
> di ricontrollare. Un ricaricamento forzato risolve per se stessi, non per chi
> ha gia' visitato il sito.
>
> **Quando cambia il contenuto, cambia il nome del file**: `piatto-anatra.png`
> e' diventata `piatto-petto-anatra.png`, `piatto-merluzzo.png`
> `piatto-merluzzo-scarola.png`. Un indirizzo nuovo non puo' essere vecchio in
> nessuna cache. Utile anche svuotare `.next/cache/images`, dove
> l'ottimizzatore tiene copie indicizzate per indirizzo.

> **Riconoscere un piatto da una foto e' meno affidabile di quanto sembri.** Il
> pesce bianco con salsa chiara e funghetti l'avevo letto come "merluzzo,
> scarola, beurre blanc e aglio nero": era il porro. Il locale l'ha corretto, e
> ha indicato anche il calamaro ripieno, che non avevo saputo riconoscere.
> Regola confermata: quando non e' evidente, **si chiede** — una foto sbagliata
> promette al cliente un piatto diverso da quello che arriva.

> **Ancora senza foto**: "Pescato del giorno" e le quattro insalate. Resta un
> ritaglio non assegnato, in attesa che il locale dica cos'e': qualcosa di
> simile a un dolce, con polvere rossa su cubetti di pane — e nel PDF 2026 i
> dolci non ci sono.

**Le foto dei piatti nel menu: due modi diversi** (01/09/2026).

Da `xl` in su, al passaggio del cursore, nella fascia bianca a lato — dove non
c'e' testo sotto. Compare e sparisce in 300ms, senza attese.

> C'e' stato un secondo di ritardo in uscita, chiesto per calmare la pagina e
> tolto subito dopo perche' rallentava troppo il passaggio da un piatto
> all'altro. Se dovesse tornare: va messo sullo stato **a riposo**, non su
> quello col cursore sopra — in CSS contano le proprieta' di transizione dello
> stato verso cui si va, quindi cosi' l'andata resta immediata e solo il ritorno
> aspetta.

Sotto `xl`, una **fascia in cima** (`FasciaPiatti`) che mostra il piatto della
voce al centro dello schermo e segue lo scorrimento, nell'ordine del menu.
Misurato: otto posizioni su otto corrispondono.

> **Il centro non e' quello della finestra** ma quello dello spazio che resta
> sotto la fascia: la fascia copre la parte alta, e misurare dal centro della
> finestra farebbe corrispondere il piatto a una voce che le sta dietro.

> **Niente `loop` in questa slitta**: l'indice della slide deve corrispondere
> esattamente alla posizione nel menu, e il ciclo continuo di Swiper duplica le
> slide e sposta gli indici.

> **`sticky` non regge dentro un antenato con `overflow: hidden`**, che diventa
> un contenitore di scorrimento. La sezione del menu usa `overflow-x: clip`, che
> ritaglia il ramo di vite senza diventarlo. Se la fascia smette di piantarsi in
> alto, e' quasi sempre un `overflow` comparso su un antenato.

> **`slideTo` solo quando l'indice cambia davvero**: chiamarlo a ogni fotogramma
> di scroll rimette in coda un'animazione mai finita.

> **Il piatto al centro e' del 44% piu' grande degli altri** (`scale(1.44)`),
> oltre che dritto e a fuoco. Misurato: 193px contro 134 dei laterali, in un
> riquadro da 193 — l'ingrandito riempie il riquadro esatto senza sbordare.
>
> **I tre numeri sono legati** e vanno cambiati insieme:
> `scale` — il margine verticale sull'immagine — la misura del riquadro.
> Il margine dev'essere `1 - 1/scala` dell'altezza, meta' per lato: con 1.44 fa
> il 30.6%, cioe' `py-[15.3%]`. E' in percentuale perche' cosi' il conto tiene a
> qualunque misura della fascia — che e' gia' cambiata tre volte.
>
> **Alzare solo `scale` non ingrandisce il piatto al centro**: quello riempie
> gia' il riquadro, quindi il margine cresce e a rimpicciolire sono i laterali.
> Per farlo davvero piu' grande bisogna allargare il riquadro, cioe' la fascia.
> Ci sono cascato passando da 1.2 a 1.44.
>
> **Il riquadro e' quadrato, non 7:5.** Era largo per far entrare la tartare
> (656x480), ma con il margine solo verticale il piatto si stringe in altezza e
> ci sta lo stesso — verificato, 183 di larghezza su 193 di riquadro. Quello
> largo costringeva a slide larghissime e i piatti vicini finivano fuori
> schermo.

> C'e' stata una versione in cui **il clic sul nome apriva il piatto in grande**,
> a schermo pieno per meta' su desktop e da bordo a bordo su telefono. Scartata
> dal locale e rimossa: con essa il titolo e' tornato a essere testo e non un
> bottone, e il file `PiattoIngrandito.tsx` e' stato cancellato.

> **Il titolo "Menu degustazione" e' sempre attenuato** (`.titolo-degustazione`,
> 0.25, solo sotto `xl`): non e' una voce che possa finire al centro dello
> schermo, quindi non passa mai in evidenza, e a piena opacita' era l'unica
> scritta forte in una pagina dove tutto il resto arretra.

> **La voce corrispondente si marca con `data-attivo`**, e il CSS la tiene piena
> mentre le altre scendono a **0.6**; anche i due piatti ai lati si attenuano
> allo stesso valore. In evidenza resta solo il piatto di cui si sta leggendo il
> titolo. La regola dei titoli sta sotto `@media (width < 80rem)`: piu' in su la
> fascia non si vede (`xl:hidden`) ma il suo ascoltatore gira lo stesso, e senza
> quel limite attenuerebbe i titoli anche su schermo largo.
>
> Si era partiti da 0.9, che su un testo quasi nero non si distingueva. A 0.6 il
> legame fra fotografia e riga si coglie a colpo d'occhio.

> **Sotto la fascia c'e' il marmo vero**, non un colore che gli somiglia
> (`.marmo-fascia`). E' un livello `fixed` con le stesse misure di
> `.marble-backdrop`: copre lo schermo esattamente come quello dietro alla
> pagina, quindi le venature combaciano, e viene ritagliato sulla banda della
> fascia con `clip-path`. Il menu che ci scorre sotto sparisce, il fondo
> prosegue senza un salto. Verificato: stessa immagine, stessa
> `background-size`, stessa `background-position`, e il ritaglio corrisponde ai
> pixel della fascia.
>
> Le due misure le riscrive `FasciaPiatti` **a ogni fotogramma**, anche quando
> il piatto non cambia: la fascia si muove finche' non si pianta in alto.

> **Il bordo inferiore sfuma**, non taglia: niente riga, il testo del menu
> emerge da sotto invece di comparire di colpo.
>
> **Le tappe della maschera si calcolano in JS e arrivano al CSS gia' in
> ordine.** Scritte in percentuale con delle sottrazioni — `calc(100% - sotto -
> 30px)` — si invertivano appena la fascia usciva dallo schermo: il CSS
> riallinea una tappa fuori ordine a quella precedente, e il gradiente diventava
> **una rampa da trasparente a opaco lunga tutta la finestra**. Il risultato era
> un velo di marmo su tutta la pagina che sbiadiva testo e bottoni — e non si
> vede nei numeri, perche' ogni singola proprieta' risultava corretta. L'ha
> notato il locale su uno screenshot, non io.
>
> C'e' anche `[data-fuori]` che spegne del tutto il livello quando la fascia non
> e' in schermo: la maschera da sola non copre tutti i casi limite, e un velo di
> marmo non salta all'occhio subito.

> **La sfumatura sta nel vuoto sotto ai piatti** (il `pb-10` della fascia), non
> sui piatti. Sfumando anche loro si spegneva il bordo inferiore di quello al
> centro — che il riquadro lo riempie tutto — e i piatti finivano per sbiadire
> proprio dove dovevano essere piu' pieni. Quei quaranta pixel servono anche a
> tenere il testo del menu lontano dai piatti.
>
> **La sfumatura non puo' stare sulla fascia.** Una maschera su un elemento ne
> fa il riferimento dei discendenti `position: fixed`, esattamente come una
> trasformazione: il marmo si ridimensionerebbe sulla fascia e perderebbe
> l'allineamento con lo sfondo della pagina. Va messa sui due livelli
> separatamente — il marmo e la slitta.
>
> **Il colore di riserva sta sul livello del marmo, non sulla fascia.** Ce
> l'aveva la fascia, e non essendo mascherato finiva di colpo: restava una riga
> netta proprio dove la sfumatura doveva toglierla. Si vedeva a schermo, non nei
> numeri.
>
> **Perche' non `background-attachment: fixed`**, che sarebbe una riga sola: su
> iOS non viene rispettato e il marmo tornerebbe ad ancorarsi all'elemento,
> disallineandosi proprio sui telefoni — l'unico posto dove la fascia si vede.
> `--color-bg-light` resta come fondo sotto al livello, per il caso in cui la
> texture non arrivi.

> **Il riquadro delle slide e' 7:5, non quadrato.** Il ritaglio della tartare e'
> 656x480 perche' ha anche le due ciotoline: in un quadrato entra per la
> larghezza e il suo piatto viene fuori un quarto piu' piccolo. Con un riquadro
> piu' largo del ritaglio piu' largo (1.4 contro 1.367) entrano tutti per
> l'altezza. Verificato: 122px di piatto per tutti, tartare compresa.
>
> **Per misurarlo serve `offsetWidth`/`offsetHeight`, non
> `getBoundingClientRect`**: i piatti ai lati sono ruotati di dieci gradi, e il
> rettangolo di ingombro di un elemento ruotato e' piu' grande di lui. Con
> quello i piatti inclinati sembravano piu' grandi di quello dritto, e la
> tartare sembrava ancora sbagliata quando non lo era piu'.

Ci sono state in mezzo due versioni per schermo stretto, entrambe sostituite:
una foto che compariva **al tocco** sul nome — funzionava, ma richiedeva di
sapere che si poteva fare, e venticinque piatti volevano dire venticinque
tocchi — e prima ancora una **cornice tonda** attorno al piatto, che lo rendeva
una finestrella invece del piatto che compare.

> **Attenzione a `-translate-x-1/2` sulla foto del margine.** Convertendola in
> fascia a tutta larghezza l'avevo persa, e su schermo largo la foto partiva dal
> punto calcolato invece di esserci centrata: sbordava di 160px a destra e la
> sezione la tagliava. Il locale se n'e' accorto prima di me.

**Il layout regge a tutte le larghezze** (01/09/2026). Provate cinque pagine a
390, 768, 1024 e 1440: nessuna scorre in orizzontale. Restano deliberatamente
piccoli la scritta "Ristorante" sotto il marchio (8-9px) e la navigazione
(11px): sono scelte tipografiche, non difetti.

**In home, sette piatti in carosello al posto delle clip** (01/09/2026).
`components/sections/SeasonalPlates.tsx`, piatti in `seasonalPlates`. Erano 21MB
di video per la stessa cosa che ora fanno sette fotografie gia' in casa.

> **L'animazione e' tutta nel CSS**, in `.piatto-in-slitta`: i piatti stanno
> inclinati di dieci gradi e **quello al centro si raddrizza**. Nessun JS,
> nessun GSAP — basta la classe `swiper-slide-active` che Swiper mette sulla
> slide attiva. Il raddrizzamento dura 0.8s contro il secondo che impiega la
> slitta a scorrere: finisce appena prima che il piatto sia arrivato, e non
> sembra che le due cose siano incollate.
>
> Prima avevo capito male e i piatti giravano **su se stessi** seguendo lo
> scroll, ognuno a velocita' sua. Il riferimento che il locale ha poi fornito
> mostrava un'altra cosa: e' la slitta a girare, e l'inclinazione e' un stato
> fisso che solo l'attivo perde.

> **`autoplay` va passato sempre, e semmai fermato dopo.** Swiper lo legge
> all'avvio: passandogli `false` e cambiando idea dopo il montaggio resta
> `enabled: false` per sempre, in silenzio — il carosello sta li' fermo e non
> c'e' nessun errore da nessuna parte. Ci sono cascato: la preferenza sulle
> animazioni ridotte ora si applica con `swiper.autoplay.stop()` dentro
> `onSwiper`.

> `loop` e `centeredSlides` insieme sono quello che tiene il piatto attivo
> sempre in mezzo: senza il secondo, il primo e l'ultimo si accosterebbero a un
> bordo e il raddrizzamento avverrebbe fuori asse.

> Con `delay: 2000` e `speed: 1000`, Swiper aspetta la fine della transizione
> prima di far partire l'attesa: il giro reale e' di tre secondi a piatto, non
> due. E' cosi' anche nel riferimento.

> `SeasonalShowcase` e `dishVideos` restano su disco, intestati. I file in
> `public/videos` **non** sono stati cancellati.

**La carta dei vini ha preso il posto delle bevande** (01/09/2026).
`/carta-vini`, dati in `wineSections`. Settantacinque vini in dieci sezioni:
quattro al calice piu' spumanti, spumanti rose', Champagne, bianchi, rosati e
rossi. La sitemap si genera dalle voci di navigazione, quindi si e' aggiornata
da sola.

> **Le uve stanno nel campo `description`.** E' gia' la riga in tono minore
> sotto il nome, esattamente dove servono: nessuna modifica a `MenuSection`.

> **Le bevande non sono state buttate**: `drinkSections` resta in `lib/menu.ts`,
> completo e corretto, intestato come non piu' pubblicato. Per rimetterlo online
> basta una pagina come `app/carta-vini/page.tsx`.

> **Mancano otto vini: nel testo consegnato cinque righe erano corrotte** — due
> vini fusi in una riga, oppure un nome o un prezzo troncato a meta'. Vanno
> chieste al locale, non ricostruite: su una carta vini un prezzo sbagliato lo
> si scopre al momento del conto.
>
> 1. Spumanti — `Il Contestatore "IL PENDIO" | Charus "BALDESSARRI" | Chardonnay
>    | 42`: due vini in una riga, e un prezzo solo.
> 2. Champagne — `La BMeunier | 65`: nome troncato, produttore e uve mancanti.
> 3. Bianchi — `Monte delle Saette "CORTE QUAIARA" | Pinot Grigio, Goldtraminer,
>    Fernanda | € ZATO" | Vespaiolo | 38`: il prezzo del primo e' sparito, e il
>    secondo ha solo la coda del nome.
> 4. Rosati — `Bardolnella, Molinara, Corvina | 22`: nome troncato, quasi certo
>    un Bardolino Chiaretto, ma "quasi certo" non basta.
> 5. Rossi — `Terre IGT "TENUTA SAN LEONARDO" | ... | € 3 SAN LEONARDO" |
>    Carmenère | 130`: prezzo del primo troncato, e un secondo vino incompleto.
>
> Anche `Metodo classico` al calice (7,00) e' senza produttore: nel testo non
> c'era.

**Il ramo di vite ricorre in sette punti** (01/09/2026). Era in tre —
`MissionStatement`, la testata delle pagine interne, il piede — e ne sono stati
aggiunti quattro: `ChefNunzio`, `SeasonalProposals`, `Gallery` e `MenuScaffold`
(quindi menu e carta vini). Sempre `VineBranch`, sempre `aria-hidden` e
`pointer-events-none`, opacita' fra 0.16 e 0.20, appoggiato a un angolo e
tagliato dal bordo.

> **I lati si alternano.** Ramo a destra nella sezione dello chef, a sinistra in
> quella dei piatti, di nuovo a sinistra in fondo alla gallery: messi tutti dallo
> stesso lato diventavano una cornice ripetuta invece di un motivo che ricorre.

> **Nel menu compare solo da `lg` in su.** Piu' in basso la colonna occupa tutta
> la larghezza, e un ramo dietro a un elenco di prezzi si legge come sporco
> invece che come decorazione.

> **`overflow-x: clip` sul body non basta.** Ci sono cascato: i primi quattro
> rami hanno fatto scorrere la home di 80px in orizzontale (112 su telefono),
> perche' la regola globale impedisce la barra ma non impedisce a
> `scrollWidth` di crescere. Serve `overflow-hidden` **sulla sezione** che
> ospita il ramo. Dopo la correzione: zero su tutte le pagine, a 1600 e a 390.
> Se si aggiunge un ramo altrove, la prima cosa da controllare e' questa.

**La pagina "Cena romantica a Malcesine" e' fuori dal sito** (01/09/2026).
Rotta rimossa e voce tolta da `navItems`; la sitemap si genera dalla navigazione
e si e' aggiornata da sola.

> **Non e' stata cancellata.** La cartella e' diventata
> `app/_cena-romantica-a-malcesine/`: nel routing di Next una cartella che
> comincia con un trattino basso esce dalle rotte con tutto quello che contiene
> — e' una convenzione del framework, non un espediente (vedi
> `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`).
> Per rimetterla online si toglie il trattino basso e si rimette la voce in
> `navItems`. Il progetto non e' sotto controllo di versione: cancellare
> settantatre righe di testo scritto per il locale sarebbe stato irreversibile.

> Dopo aver spostato una cartella sotto `app/`, **serve `rm -rf .next/types`**:
> il validatore generato continua a riferirsi al percorso vecchio e `tsc`
> fallisce su un file che non hai scritto tu.

> Verificato: `/cena-romantica-a-malcesine` risponde 404, la sitemap ha quattro
> voci, e in pagina non resta nessun collegamento.

**Due richiami, ognuno al suo posto** (01/09/2026).

**"Prenota il tuo tavolo"** (`reservationCta`) sta nei punti in cui si decide,
dopo aver visto: **l'intestazione** — e il suo equivalente nel menu a scomparsa —
**il piede**, **il fondo della home** (il tondo della gallery) e **il fondo del
menu** (`cta={reservationCta}` passato allo scaffold).

**"View the menu"** (`menuCta`) sta nei punti in cui si sta ancora guardando:
hero della home, i tondi del lago e della forchetta, testata e fondo della carta
vini, stato vuoto dello scaffold.

> **Sulla pagina del menu il richiamo in fondo prenota, non manda al menu**:
> mandare al menu da dentro il menu sarebbe un giro a vuoto. Per la stessa
> ragione la testata di quella pagina non ha bottone. Lo scaffold accetta il
> richiamo come proprieta' (`cta`), cosi' menu e carta vini possono averne uno
> diverso — o nessuno.

> **Il blocco degustazione non ha piu' un bottone.** Dice "su prenotazione" e
> **non offre un modo per farlo**: se serve un richiamo li', e' il posto giusto
> — il telefono, o la carta dei vini.

> **L'etichetta e' in inglese** su un sito in italiano. Il sito ha gia' "Contact"
> e "Follow us", quindi non stona, ma se un giorno si uniforma la lingua e' una
> stringa sola. Anche il tondo della forchetta, che diceva "Vedi il menù", ora
> pesca dalla stessa fonte: un'azione sola, un'etichetta sola.

**La pagina contatti: telefono e WhatsApp** (02/09/2026). Via l'email
dall'intestazione e dai riferimenti, via il modulo per scrivere. Restano il
numero, il riquadro WhatsApp, l'indirizzo con il collegamento a Google Maps, gli
orari e la partita IVA.

> **WhatsApp ha preso il posto del modulo**: chi vuole scrivere invece di
> chiamare ora scrive dove il locale gia' guarda, non in una casella di posta.
> `siteConfig.whatsappHref` e' lo stesso numero del telefono nel formato che
> vuole `wa.me` — solo cifre, prefisso internazionale, niente piu'. Se un giorno
> il locale usa un numero diverso per WhatsApp, si separa li'.
>
> **Il numero non e' stato verificato su WhatsApp**: e' un cellulare, quindi
> plausibile, ma se il locale non ha WhatsApp su quel numero il collegamento
> porta a un vicolo cieco. Da confermare con loro.

> **L'ancora `#prenota` resta**: e' la destinazione del bottone "Prenota il tuo
> tavolo" che ricorre in tutto il sito. Toccando quella sezione, controllare che
> ci sia ancora — altrimenti undici bottoni finiscono a meta' pagina.

> La griglia era a due colonne, con il modulo a sinistra: tolto quello, i
> riferimenti sono passati a colonna unica centrata. Restava mezza pagina vuota.

> `ContactForm.tsx` resta su disco, intestato: dentro c'e' la validazione dei
> campi e la gestione dello stato d'invio, che rifare da zero costerebbe piu' di
> quanto costi tenere il file.

> L'indirizzo email resta nel **piede** e nel **menu a scomparsa**, che non fanno
> parte della sezione contatti. Se un giorno deve sparire del tutto, sono quei
> due punti.

**Pannello di gestione del menu** (02/09/2026). `/admin`: si sceglie la portata,
si scrive nome e ingredienti, si carica una fotografia. I piatti aggiunti si
accodano alla loro sezione del menu e si possono togliere. Provato dal vivo:
aggiunta, comparsa nel menu nella sezione giusta e in coda, rimozione da
pannello, menu e deposito, con la fotografia cancellata insieme.

> **Il menu scritto a mano resta la base**, e il pannello ci lavora attorno in
> due modi: **accoda** i piatti nuovi alla loro sezione e **spegne** quelli che
> in questo momento non ci sono. Le venticinque voci di `lib/menu.ts`, con
> traduzioni, prezzi e allergeni, non passano da un modulo.
>
> **Spento non e' cancellato.** Un piatto spento sparisce dal sito e si riaccende
> quando torna in carta: e' la differenza fra "oggi non c'e'" e "non lo facciamo
> piu'". Dal pannello i piatti del menu si possono solo spegnere — toglierli
> davvero vuol dire toccare il file, ed e' giusto che costi di piu'.
>
> La chiave di un piatto spento e' `sezione::nome` (`chiavePiatto`), perche'
> quelle voci non hanno un identificatore. **Rinominare un piatto nel file lo fa
> ricomparire**: la chiave cambia. E' il male minore rispetto ad aggiungere un
> identificatore a venticinque voci e ricordarsi di non toccarlo mai.
>
> Una sezione rimasta senza piatti non si stampa: un titolo con il vuoto sotto
> sembra una pagina rotta.

> **Due depositi, stessa interfaccia** (`lib/piatti-store.ts`). Su Vercel il
> disco e' di sola lettura e si azzera a ogni pubblicazione, quindi i dati e le
> fotografie stanno su Blob; in locale, senza token, si scrive sotto `.dati/`.
> **La scelta la fa la presenza del token**, non un interruttore: un
> interruttore lo si dimentica acceso e si scopre in produzione che i dati non
> si salvavano.

> **Le fotografie si rimpiccioliscono nel browser** (`lib/riduci-immagine.ts`),
> prima di partire. Le Server Action accettano un corpo di **1 MB** e su Vercel
> il tetto e' 4.5: uno scatto del telefono lo supera sempre, e l'invio falliva
> con "Body exceeded 1 MB limit" — un errore che parla di limiti e non di
> fotografie. Il mio controllo a 8 MB non c'entrava niente: il limite della
> piattaforma arriva prima. Provato con uno scatto da **21.6 MB**: arriva a
> destinazione come 170 KB.
>
> `bodySizeLimit: '4mb'` in `next.config.ts` e' solo il margine di sicurezza per
> i formati che il browser non sa ridurre (certi HEIC): quelli partono
> com'erano, e il server risponde con un messaggio comprensibile.

> **Le fotografie locali non stanno in `public/`.** Quello che ci si scrive dopo
> l'avvio **non viene servito**: `next start` fa l'elenco dei file statici una
> volta sola, e una foto appena caricata dava 404 finche' non si riavviava. Le
> serve `app/media/[nome]/route.ts`, che ripulisce il nome prima di toccare il
> disco. In produzione non passa di li'.

> **Le azioni controllano l'accesso da sole** (`esigiAccesso`). Chi conosce
> l'indirizzo di un'azione puo' chiamarla senza passare dal pannello: un
> controllo fatto solo quando si disegna la pagina non serve a niente.

> **Senza `ADMIN_PASSWORD` il pannello non si apre.** Nessuna password di
> riserva: una porta che si apre da sola perche' e' stata dimenticata una
> variabile e' peggio di una porta che non c'e'.

> **`revalidatePath('/menu-ristorante')` dopo ogni modifica.** Il menu e' una
> pagina pregenerata: senza, continuerebbe a mostrare quella di prima finche'
> non si ripubblica il sito.

> Due inciampi di Next, entrambi con messaggi che parlano d'altro: un file
> `'use server'` puo' esportare **solo funzioni asincrone** (`Esito` e
> `nessunEsito` sono finiti in `app/admin/esito.ts`), e un componente client non
> puo' importare un modulo con `server-only` — le portate sono in `lib/piatti.ts`,
> senza quella marcatura, e il deposito le riesporta.

> **Ci si arriva dal piede**, in fondo alla barra con la partita IVA: un
> "Gestione" in undici pixel, alla stessa opacita' del resto della riga. Non e'
> in sitemap e la pagina chiede di non essere indicizzata. La protezione e' la
> password, non il fatto che l'indirizzo sia nascosto — ma tenerlo defilato
> evita qualche tentativo a caso.

> **Da fare prima di pubblicare**: cambiare la password in `.env.local` (adesso
> c'e' quella di prova che ho usato per verificare), e su Vercel creare uno store
> Blob — la variabile `BLOB_READ_WRITE_TOKEN` compare da sola.

## Trappole

**`requestAnimationFrame` non gira, e falsa ogni misura.** È la trappola che in
questo progetto è già costata tre falsi allarmi. In headless i fotogrammi
avanzano solo quando qualcosa li forza; ma **anche headful non basta**: se la
finestra è coperta da un'altra (il terminale, per dire) Chrome la considera
occlusa e scende a **1 fotogramma al secondo** — misurato. A quel ritmo le
callback di `IntersectionObserver` non arrivano proprio, e un'animazione sana
sembra congelata a un valore vecchio.

`Page.startScreencast` aiuta ma da solo non risolve. Chrome va lanciato così:

```
--disable-backgrounding-occluded-windows
--disable-renderer-backgrounding
--disable-background-timer-throttling
--disable-features=CalculateNativeWinOcclusion,IntensiveWakeUpThrottling
```

Con queste: 121 fotogrammi al secondo, e le misure tornano. **Prima di dichiarare
rotta un'animazione, conta i fotogrammi**: un ciclo `rAF` che incrementa un
contatore per un secondo. Se dà 1, il rotto è il banco di prova.

**Meglio ancora: headless con lo screencast acceso.** Dà gli stessi 121 fps ed è
molto più stabile — headful litiga col Chrome che l'utente ha già aperto (e col
suo aggiornatore, che gira per conto suo e può avere una versione diversa da
quella nel bundle). Con headful i lanci morivano a metà misura.

**Il profilo del browser va buttato a ogni giro** (`rm -rf` della
`--user-data-dir`). Riusandolo si misura la pagina vecchia rimasta in cache: è
successo, e il cerchio risultava della misura di prima della modifica. Un
profilo nuovo ha la cache vuota per costruzione, senza dover disabilitare niente
via CDP — cosa che si è invece rivelata instabile.

**Il badge circolare con la "N" in basso a sinistra non fa parte del sito**: è
l'indicatore di sviluppo di Next. Nella build di produzione non c'è. Non
inseguirlo.

**Le animazioni in scrub hanno inerzia.** Saltando a una posizione di scroll e
scattando subito, il titolo risulta vuoto. Aspetta che si assesti prima di
concludere che è rotto.

**Il PDF del menù non è estraibile con gli strumenti normali.** Niente poppler,
e i font sono a codifica sottoinsieme: il testo esce cifrato. Vanno decodificate
le tabelle `ToUnicode` e ricostruite le righe dalle coordinate — la pagina
bevande è su tre colonne e il testo lineare accoppia i prezzi sbagliati. Gli
script usati sono nello scratchpad della sessione, non nel progetto: se serve
rifarlo, si riscrivono.

**`AGENTS.md` non è la Next.js che conosci.** Prima di scrivere codice che tocca
API di Next, leggi la guida in `node_modules/next/dist/docs/`. Il blocco in cima
ad `AGENTS.md` lo riscrive `next dev`: toglierlo dal diff lo fa solo ricomparire.
