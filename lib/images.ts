/**
 * Catalogo delle foto del locale.
 *
 * Sorgente unica: qui stanno percorso e testo alternativo di ogni foto, e da
 * qui li prendono sezioni e pagine. Cambiare foto a una sezione vuol dire
 * cambiare una riga di questo file, non andare a cercare la `src` nel componente.
 *
 * I file in `public/images` sono le foto originali ridotte (1920px per gli
 * sfondi a tutta pagina, 1400px per i blocchi testo+immagine, 1200px per
 * carosello e gallery) e ricompresse: `next/image` genera poi da questi le
 * varianti effettivamente servite al browser.
 *
 * ATTENZIONE ALL'ALT. Vuoto (`''`) NON e' una dimenticanza: e' la scelta giusta
 * per le foto puramente decorative — sfondi di hero e testate, che stanno dentro
 * contenitori `aria-hidden` e il cui contenuto informativo e' gia' nel testo
 * accanto. Descriverle costringerebbe chi usa uno screen reader ad ascoltare due
 * volte la stessa cosa. Dove invece la foto porta informazione (il ritratto
 * dello chef, le tessere della gallery, le slide del carosello) l'alt descrive
 * quello che si vede.
 */

export type Photo = {
  src: string
  alt: string
  /**
   * Dove sta il soggetto nella foto, come `object-position`.
   *
   * Serve dove la foto viene ritagliata in una forma diversa dalla sua — il
   * cerchio del menù, le tessere tonde della gallery. Il taglio predefinito
   * prende il centro dell'immagine, ma il centro dell'**immagine** non e' il
   * centro del **piatto**: quasi tutte queste foto hanno aria sopra, e col
   * taglio centrato il piatto finisce basso e mezzo tagliato.
   */
  focus?: string
  /**
   * Se la foto ritrae un piatto invece del locale.
   *
   * Serve alle tessere che **alternano** i due (vedi `RotatingPhoto`): il
   * gruppo va diviso in due liste, e l'alternanza va garantita anche dopo il
   * rimescolamento. Segnato esplicitamente invece di dedurlo dal prefisso
   * `piatto-` nel nome del file: la convenzione regge oggi, ma affidare a un
   * nome di file una scelta di composizione la rende fragile al primo rinomino.
   */
  piatto?: boolean
}

const photo = (file: string, alt: string, focus?: string): Photo => ({
  src: `/images/${file}`,
  alt,
  ...(focus ? { focus } : {}),
})

/** Come `photo`, ma per le foto di piatti della gallery. */
const piattoFoto = (file: string, alt: string, focus?: string): Photo => ({
  ...photo(file, alt, focus),
  piatto: true,
})

/* --- Sfondi a tutta pagina (decorativi: alt vuoto) --------------------- */

/* La hero non ha piu' fotografie di sfondo: e' un video in loop (vedi
   `heroVideo` in lib/videos.ts). C'era `heroBackgrounds` con dehors-sera,
   terrazza-pergola e sala-vini; i file restano in public/images, pronti se
   servissero altrove. */

export const backgrounds = {
  /** Sfondo del menu di navigazione mobile. */
  menuMobile: photo('esterno-pergola.jpg', ''),
} as const

/* --- Testate delle pagine interne (decorative: alt vuoto) -------------- */

export const pageHeroes = {
  /* Era l'insegna sopra l'ingresso, che pero' recita "PIZZA E CUCINA ITALIANA":
     su un sito che non parla piu' di pizza si contraddicevano a vicenda. Al suo
     posto la sala, che non ha scritte. */
  contatti: photo('sala-ristorante.jpg', ''),
  menuRistorante: photo('sala-murale.jpg', ''),
  cartaVini: photo('parete-vini.jpg', ''),
  /* La pagina che la usava e' fuori dal sito dal 01/09/2026; la voce resta
     per rimetterla in un attimo. */
  cenaRomantica: photo('cena-coppia.jpg', ''),
} as const

/**
 * Le fotografie dei piatti, indicizzate per nome, cosi' che `lib/menu.ts` possa
 * agganciarle alla voce giusta senza ripetere i percorsi.
 *
 * Sono le nove contrassegnate dal locale come le migliori. Qui ci sono solo
 * quelle di cui e' certo **quale** piatto ritraggono: le altre quattro stanno
 * nella gallery, dove basta che siano belle, ma non accanto a una voce del
 * menù, dove devono anche essere quella giusta.
 */
/**
 * Le foto dei piatti che compaiono al lato del menù, al passaggio del cursore.
 *
 * Sono **PNG ritagliati**, con lo sfondo trasparente: il piatto sta sul marmo
 * della pagina senza nessuna cornice. Dal 29% al 58% dei pixel sono trasparenti,
 * a seconda della foto.
 *
 * C'e' stato un cerchio che le mascherava. Serviva quando le foto erano JPEG:
 * convertendole si perdeva la trasparenza e restava un riquadro di fondo chiaro
 * attorno al piatto, che il cerchio nascondeva ritagliandolo. Ma il cerchio
 * tagliava anche il piatto, e serviva un quadrato pre-ritagliato per ogni foto.
 * Tenendo il PNG non serve niente di tutto questo: il ritaglio ce l'hanno gia'.
 */
const ritaglio = (nome: string, alt: string): Photo => ({
  src: `/images/piatto-${nome}.png`,
  alt,
})

export const dishPhoto = {
  tartare: ritaglio('tartare', 'Tartare di manzo con julienne di verdure e salse a parte'),
  /* Nome nuovo, non contenuto nuovo sotto il vecchio nome: vedi il commento
     sopra su `petto-anatra`. */
  polpoFagioli: ritaglio(
    'polpo-occhio-nero',
    'Polpo con fagioli all’occhio nero, pomodorini, finocchio e sedano'
  ),
  cremaPaneCozze: ritaglio('cozze-brodo', 'Crema di pane con cozze, gamberi e basilico'),
  calamarata: ritaglio('calamarata', 'Calamarata ai frutti di mare con cozze e vongole'),
  mezzeManiche: ritaglio('mezze-maniche', 'Mezze maniche alla gricia con guanciale croccante'),
  neroSeppia: ritaglio('nero-seppia', 'Nido di spaghetti al nero di seppia su salsa verde'),
  linguinePomodori: ritaglio('linguine-pomodori', 'Linguine ai pomodori su crema di stracciatella'),
  tagliatelleFunghi: ritaglio('tagliatelle-funghi', 'Tagliatelle con funghi e gamberi'),
  pastaPatateCozze: ritaglio('pasta-patate-cozze', 'Pasta e patate con cozze e provola affumicata'),
  tagliata: ritaglio('tagliata', 'Tagliata di manzo con cialde di grana e salsa verde'),
  /* Nomi nuovi, non un contenuto nuovo sotto il vecchio nome: sostituendo un
     file e lasciando l'indirizzo com'era, chi ha gia' visitato il sito continua
     a vedere la foto di prima — la sua cache non ha motivo di ricontrollare.
     Un indirizzo nuovo non puo' essere vecchio in nessuna cache. */
  anatra: ritaglio('petto-anatra', 'Petto d’anatra con porro croccante e gel di arancia'),
  /* La foto che stava su questa voce ritraeva **pollo**, non anatra: carne
     bianca a pezzi, verdure a julienne, gocce di curry — cioe' il tomahawk.
     Spostata li' e sostituita con l'anatra vera. */
  tomahawkPollo: ritaglio('tomahawk-pollo', 'Tomahawk di pollo con wok di verdure e curry verde'),
  sardeGelato: ritaglio('sarde-gelato', 'Gelato all’olio con crumble di pane e sarde di lago'),
  seppiaPiselli: ritaglio('seppia-piselli', 'Seppia con piselli e crema di piselli'),
  carpaccioMelanzane: ritaglio(
    'carpaccio-melanzane',
    'Carpaccio di melanzane con acciughe, pesto di pomodori secchi e miele'
  ),
  cacioPepe: ritaglio('cacio-pepe', 'Spaghettone cacio e pepe'),
  tagliatelleFusion: ritaglio('tagliatelle-fusion', 'Tagliatelle con tastasal sfumato alla soia'),
  /* Questa era finita sul merluzzo. E' il porro: l'ha corretto il locale. */
  porroGranaPere: ritaglio('porro-grana-pere', 'Porro, grana e pere in osmosi'),
  calamaroRipieno: ritaglio('calamaro-ripieno', 'Calamaro ripieno di risotto alla pescatora'),
  merluzzo: ritaglio('merluzzo-scarola', 'Merluzzo con scarola, beurre blanc e aglio nero fermentato'),
} as const

/* --- Piatti in carosello (home) ---------------------------------------- */
/**
 * I sette piatti della fascia in home (vedi `SeasonalPlates`).
 *
 * Sette e non venti: e' un carosello, e ogni piatto ha il suo turno al centro
 * invece di dividersi una posizione con altri due. Un giro completo dura
 * quattordici secondi.
 *
 * Scelti mescolando le portate — antipasti, primi, secondi — cosi' il giro non
 * diventa una sfilata di paste.
 */
export const seasonalPlates: Photo[] = [
  dishPhoto.calamarata,
  dishPhoto.seppiaPiselli,
  dishPhoto.tagliata,
  dishPhoto.polpoFagioli,
  dishPhoto.neroSeppia,
  dishPhoto.cremaPaneCozze,
  dishPhoto.anatra,
]

/* --- Gallery ----------------------------------------------------------- */
/**
 * Le foto della gallery, divise in **sei gruppi disgiunti**: uno per tessera.
 *
 * I piatti sono gli stessi scatti del menù: la serie dall'alto, fondo pulito,
 * luce uguale. C'era rimasto un fotogramma estratto da un video
 * (`piatto-impiattamento-nero`) e stonava in mezzo agli altri — tolto, e il
 * file con lui.
 *
 * I piatti sono fra le fotografie che il locale ha contrassegnato come le
 * migliori. Prima qui c'erano i fotogrammi estratti dalle clip: servivano
 * finche' non c'era altro, ma sono fermi immagine di un video e si vedeva.
 *
 * `insegna-ingresso.jpg` e `sala-vini.jpg` restano fuori, come sono sempre
 * state: la prima porta la scritta "pizza e cucina italiana", che dice un'altra
 * cosa rispetto al menu del sito; la seconda inquadra volti riconoscibili di
 * clienti a tavola.
 *
 * **I piatti stanno solo nelle due tessere tonde**, dove si alternano alle foto
 * del locale: piatto, sala, piatto, sala. Le altre quattro mostrano soltanto il
 * locale.
 *
 * Le fotografie sono **le stesse di prima**, tutte e venti: cambia solo in quale
 * tessera stanno. Le tonde ne tengono sei a testa e le altre due, perche' gli
 * otto piatti devono entrare tutti in due tessere sole.
 *
 * L'alternanza non puo' stare nell'ordine di questo elenco: `RotatingPhoto`
 * mescola. La garantisce lui, intercalando due liste mescolate separatamente
 * (vedi il campo `piatto` di `Photo`). Con quattro piatti e due foto di locale
 * per tessera, a fine giro restano due piatti di fila: e' il prezzo per tenerli
 * tutti invece di scartarne qualcuno.
 *
 * **Disgiunti** perche' le tessere ruotano ognuna per conto suo e in ordine
 * casuale: pescando dalla stessa lista, prima o poi due mostrano la stessa foto
 * nello stesso momento. E' successo davvero, con due tessere sullo stesso nero
 * di seppia. Il caso, da solo, non puo' garantire il contrario; i gruppi si'.
 *
 * Per la stessa ragione i piatti che si somigliano stanno **nello stesso
 * gruppo** — i due neri di seppia insieme, le due cozze insieme: una tessera
 * mostra una foto per volta, quindi non possono finire a fianco.
 */
export const galleryGroups: Photo[][] = [
  /* Tonda: i piatti stanno qui. */
  [
    piattoFoto('piatto-nero-seppia.jpg', 'Nido di spaghetti al nero di seppia su salsa verde'),
    photo('interno-arco.jpg', "La sala interna sotto l'arco in pietra"),
    piattoFoto('piatto-calamarata.jpg', 'Calamarata ai frutti di mare con cozze e vongole'),
    photo('cena-sera.jpg', 'Due ospiti a cena in sala'),
    piattoFoto('piatto-tartare.jpg', 'Tartare di manzo con julienne di verdure e salse a parte'),
    piattoFoto('piatto-tagliata.jpg', 'Tagliata di manzo con cialde di grana e salsa verde'),
  ],
  [
    photo('vicolo-tavoli.jpg', 'I tavoli apparecchiati lungo il vicolo'),
    photo('vicolo-lanterne.jpg', 'Il vicolo illuminato dalle lanterne, la sera'),
  ],
  [
    photo('parete-vini.jpg', 'La parete con le bottiglie di vino'),
    photo('sala-vini-arco.jpg', "L'angolo delle bottiglie sotto l'arco"),
  ],
  [
    photo('cortile-sera.jpg', 'Il cortile con le luci accese, di sera'),
    photo('esterno-pergola.jpg', 'La pergola di vite sopra i tavoli esterni'),
  ],
  [
    photo('dehors-sera.jpg', 'I tavoli esterni apparecchiati, di sera'),
    photo('cena-coppia.jpg', 'Una coppia a cena al tavolo'),
  ],
  /* Tonda: i piatti stanno qui. Le due cozze insieme, come prima. */
  [
    piattoFoto('piatto-cozze-brodo.jpg', 'Cozze e gamberi in un brodo con perle nere e basilico'),
    photo('vicolo-serale.jpg', 'Gli ospiti ai tavoli nel vicolo del centro storico'),
    piattoFoto('piatto-cozze-vongole.jpg', 'Cozze e vongole servite in piedi nel loro brodo'),
    photo('terrazza-pergola.jpg', 'La terrazza sotto la pergola'),
    piattoFoto('piatto-crudo-pesce.jpg', 'Crudo di pesce con julienne di verdure e gocce di salsa verde'),
    piattoFoto('piatto-mezze-maniche.jpg', 'Mezze maniche alla gricia con guanciale croccante'),
  ],
]

/* --- Foto di contenuto (alt descrittivo) ------------------------------- */

export const content = {
  chef: photo('chef-nunzio.jpg', 'Lo chef al lavoro ai fornelli della cucina'),
  /* Non e' piu' uno sfondo ma una foto in primo piano dentro un arco, quindi
     l'alt descrive: qui la foto porta informazione. */
  malcesine: photo('cortile-sera.jpg', 'Il cortile del locale con le luci accese, di sera'),
} as const

/* Le proposte stagionali non stanno qui: sono clip, e vivono in lib/videos.ts.
   I loro poster sono i primi fotogrammi delle clip stesse, quindi non servono
   fotografie dei piatti. */

/* --- Carosello "Uno sguardo al locale" --------------------------------- */

export const carousel: { photo: Photo; caption: string }[] = [
  {
    photo: photo('interno-arco.jpg', 'La sala interna sotto le volte in pietra'),
    caption: 'La sala sotto le volte in pietra',
  },
  {
    photo: photo('vicolo-tavoli.jpg', 'I tavoli apparecchiati lungo il vicolo, la sera'),
    caption: 'I tavoli nel vicolo',
  },
  {
    photo: photo('parete-vini.jpg', 'La parete con le bottiglie di vino esposte'),
    caption: 'La parete dei vini',
  },
  {
    photo: photo('dettaglio-logo.jpg', 'Il marchio da Nunzio inciso sul bancone'),
    caption: 'Il marchio sul bancone',
  },
  {
    photo: photo('cena-sera.jpg', 'Due ospiti a cena in sala, la sera'),
    caption: "Una cena d'estate",
  },
]

/* --- Gallery della pagina "cena romantica" ----------------------------- */

/* Le foto della gallery non stanno piu' in un oggetto a parte: sono dentro
   `galleryGroups` qui sopra, divise per tessera. Tenerle in due posti voleva
   dire due liste da riconciliare a ogni cambio. */
