/**
 * Catalogo delle clip del locale.
 *
 * Stessa logica di lib/images.ts: percorso e testo alternativo stanno qui, non
 * nei componenti.
 *
 * Ogni clip ha un `poster` che e' **il suo primo fotogramma**, non una foto
 * qualsiasi dello stesso piatto. E' il dettaglio che fa funzionare l'effetto:
 * la tessera e' una fotografia ferma finche' il video non parte, e quando parte
 * non si vede nessuno stacco, perche' riprende esattamente da dove il poster
 * era rimasto. Con una foto diversa si vedrebbe un salto.
 *
 * I poster sono stati estratti dal fotogramma 0 di ogni clip, non scelti a mano.
 *
 * > **Le clip sono in HEVC (H.265), non in H.264.** Sono gli originali forniti
 * > dal service. Safari le riproduce, e anche Chrome su Mac — verificato: il
 * > file carica e va, nonostante `canPlayType('hvc1')` risponda vuoto. Dove
 * > l'HEVC non c'e' (Firefox, molte installazioni di Chrome su Windows) resta
 * > il poster: si vede una fotografia ferma invece di una clip, che e' una
 * > degradazione accettabile ma non voluta.
 * >
 * > La soluzione vera e' chiedere al service gli export in **H.264**: sarebbero
 * > un rimpiazzo diretto, stessi nomi. Ricodificarle qui non conviene —
 * > `avconvert` non ha controllo di bitrate e porta una clip da 1,5 MB a 3,9 MB,
 * > e ffmpeg non e' installato.
 */

export type Video = {
  src: string
  /** Primo fotogramma della clip. */
  poster: string
  alt: string
}

const video = (file: string, alt: string): Video => ({
  src: `/videos/${file}.mp4`,
  poster: `/videos/${file}.jpg`,
  alt,
})

/**
 * Le proposte stagionali, in ordine di scorrimento.
 *
 * L'ordine non e' quello dei file: alterna primi, secondi e impiattamenti, e
 * tiene distanti fra loro le clip che si somigliano — i tre neri di seppia e i
 * due piatti di cozze — perche' scorrendo non sembri due volte lo stesso piatto.
 */
/* NON PIU' IN USO dal 01/09/2026: la striscia in home ora e' fatta di
   fotografie (`SeasonalPlates`). Le clip e i file in public/videos restano dove
   sono — il progetto non e' sotto controllo di versione, e buttare 21MB di
   riprese del locale per una modifica di impaginazione sarebbe irreversibile. */
export const dishVideos: Video[] = [
  video('video-spaghetti-datterini', 'Spaghetti con datterini e pepe in un piatto fondo chiaro'),
  video('video-nero-in-padella', 'Spaghetti al nero di seppia saltati in padella'),
  video('video-cozze-vongole-brodo', 'Cozze e vongole servite in piedi nel loro brodo'),
  video('video-tagliata-cialde', 'Tagliata di manzo con cialde di grana, insalatina e salsa verde'),
  video('video-mezze-maniche-gricia', 'Mezze maniche alla gricia con guanciale croccante'),
  video('video-impiattamento-tartare', "Le mani dello chef che condiscono una tartare con un filo d'olio"),
  video('video-calamarata-frutti-di-mare', 'Calamarata ai frutti di mare con cozze e vongole'),
  video('video-crudo-di-pesce', 'Crudo di pesce con julienne di verdure e gocce di salsa verde'),
  video('video-spaghetti-pomodoro', 'Spaghetti al pomodoro avvolti a nido su salsa verde'),
  video('video-nero-crema-verde', 'Nido di spaghetti al nero con crema chiara su salsa verde'),
  video('video-cozze-brodo-verde', 'Cozze, vongole e gamberi in un brodo verde'),
  video('video-spaghetti-dettaglio', 'Dettaglio ravvicinato di spaghetti mantecati'),
  video('video-impiattamento-nero', "Le mani dello chef che impiattano il nero di seppia con un coppapasta"),
]

/**
 * Il video che apre la home: e' l'intero sfondo della hero, in loop.
 *
 * Dura 18 secondi. Prima era il primo di tre strati che si alternavano in
 * dissolvenza con delle fotografie, e andava tagliato per lasciare spazio alle
 * altre; adesso gira per intero e ricomincia.
 */
export const heroVideo: Video = video(
  'video-hero',
  'Il locale, la cucina e i piatti in una breve sequenza'
)

/* La gallery non ha piu' una tessera video: adesso ruotano tutte le foto, e una
   clip in loop non era piu' l'unica cosa in movimento — solo la piu' rumorosa.
   Il fotogramma di quella clip resta comunque nella gallery, come fotografia,
   dentro `galleryGroups` in lib/images.ts. */
