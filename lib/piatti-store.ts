import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { del, list, put } from '@vercel/blob'
import type { Deposito, Modifica, PiattoAggiunto } from '@/lib/piatti'

export type { Deposito, PiattoAggiunto, Portata, Modifica } from '@/lib/piatti'
export { PORTATE, chiavePiatto, formattaPrezzo } from '@/lib/piatti'
import { portataDiSezione } from '@/lib/piatti'

const VUOTO: Deposito = { aggiunti: [], nascosti: [], cancellati: [], modifiche: {}, ordine: {} }

/**
 * Accetta anche i formati vecchi: prima era un elenco, poi un oggetto con due
 * campi. Un deposito che non si sa leggere e' un menu che sparisce.
 */
function normalizza(dati: unknown): Deposito {
  if (Array.isArray(dati)) return { ...VUOTO, aggiunti: dati as PiattoAggiunto[] }
  if (dati && typeof dati === 'object') {
    const d = dati as Partial<Deposito>
    return {
      // I piatti salvati prima che esistesse il prezzo non ce l'hanno.
      aggiunti: (d.aggiunti ?? []).map((p) => ({ ...p, prezzo: p.prezzo ?? '' })),
      nascosti: d.nascosti ?? [],
      cancellati: d.cancellati ?? [],
      modifiche: d.modifiche ?? {},
      ordine: d.ordine ?? {},
    }
  }
  return VUOTO
}

/** Il nome con cui il deposito conosce se stesso. */
const ELENCO = 'menu/piatti.json'

const suBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

/* --- deposito locale ---------------------------------------------------- */

const cartellaDati = path.join(process.cwd(), '.dati')
const fileLocale = path.join(cartellaDati, 'piatti.json')
/* Le fotografie di sviluppo stanno **fuori** da `public/`: quello che si scrive
   li' dopo l'avvio non viene servito — `next start` fa l'elenco dei file statici
   una volta sola. Le serve `app/media/[nome]/route.ts`. */
const cartellaFoto = path.join(cartellaDati, 'foto')

async function leggiLocale(): Promise<Deposito> {
  try {
    return normalizza(JSON.parse(await fs.readFile(fileLocale, 'utf8')))
  } catch {
    return VUOTO
  }
}

async function scriviLocale(deposito: Deposito) {
  await fs.mkdir(cartellaDati, { recursive: true })
  await fs.writeFile(fileLocale, JSON.stringify(deposito, null, 2), 'utf8')
}

/* --- lettura e scrittura ------------------------------------------------ */

export async function leggiDeposito(): Promise<Deposito> {
  // Leggere non deve **mai** far cadere una pagina: se il deposito non risponde
  // il menu esce com'e' scritto, che e' molto meglio di un sito che non compila
  // perche' mancava un token.
  try {
    if (!suBlob()) return await leggiLocale()

    const { blobs } = await list({ prefix: ELENCO, limit: 1 })
    if (blobs.length === 0) return VUOTO
    // `cache: 'no-store'`: il deposito cambia quando il locale lo cambia, e una
    // copia in cache mostrerebbe il menu di ieri.
    const risposta = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!risposta.ok) return VUOTO
    return normalizza(await risposta.json())
  } catch {
    return VUOTO
  }
}

async function scriviDeposito(deposito: Deposito) {
  if (!suBlob()) return scriviLocale(deposito)
  await put(ELENCO, JSON.stringify(deposito, null, 2), {
    access: 'public',
    contentType: 'application/json',
    // Senza questo Blob aggiunge un suffisso casuale al nome e a ogni scrittura
    // nasce un file nuovo invece di sostituire quello di prima.
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

/**
 * Legge, cambia e riscrive il deposito **una operazione alla volta**.
 *
 * Ogni cosa che il pannello fa e' un leggi-cambia-scrivi sullo stesso file, e
 * due che si accavallano si mangiano a vicenda: chi scrive per ultimo parte da
 * una copia vecchia e cancella quello che ha fatto l'altro. Succede sul serio —
 * basta spegnere due piatti di fila senza aspettare, che e' esattamente come si
 * usa un pannello del genere.
 *
 * La coda e' una catena di promesse: chi arriva si mette in fila dietro
 * all'ultimo, cosi' nessuno legge mentre un altro sta scrivendo. Vale dentro un
 * processo solo, che qui basta: il pannello lo usa una persona per volta.
 */
let catena: Promise<unknown> = Promise.resolve()

function aggiorna(cambia: (deposito: Deposito) => Deposito | Promise<Deposito>): Promise<void> {
  const mio = catena.then(async () => {
    await scriviDeposito(await cambia(await leggiDeposito()))
  })
  // La catena non deve spezzarsi se un'operazione fallisce: chi e' in fila
  // dietro deve partire lo stesso.
  catena = mio.catch(() => {})
  return mio
}

/* --- fotografie --------------------------------------------------------- */

/** Salva la fotografia e restituisce l'indirizzo con cui richiamarla. */
export async function salvaFoto(file: File): Promise<string> {
  const estensione = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const nome = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${estensione}`

  if (suBlob()) {
    const { url } = await put(`menu/foto/${nome}`, file, { access: 'public' })
    return url
  }

  await fs.mkdir(cartellaFoto, { recursive: true })
  await fs.writeFile(path.join(cartellaFoto, nome), Buffer.from(await file.arrayBuffer()))
  return `/media/${nome}`
}

async function eliminaFoto(indirizzo?: string) {
  if (!indirizzo) return
  try {
    if (indirizzo.startsWith('http')) await del(indirizzo)
    else await fs.unlink(path.join(cartellaFoto, path.basename(indirizzo)))
  } catch {
    // Se la fotografia non c'e' piu', il piatto va toccato lo stesso: un file
    // mancante non e' una buona ragione per lasciare una voce nel menu.
  }
}

/* --- operazioni del pannello -------------------------------------------- */

export async function aggiungiPiatto(dati: Omit<PiattoAggiunto, 'id' | 'creato'>) {
  await aggiorna((deposito) => ({
    ...deposito,
    aggiunti: [
      ...deposito.aggiunti,
      {
        ...dati,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        creato: new Date().toISOString(),
      },
    ],
  }))
}

/**
 * Cambia un piatto, di qualunque origine.
 *
 * Se e' nato dal pannello si tocca il piatto stesso; se viene dal menu scritto
 * a mano si scrive una **modifica** che il menu applica sopra al file. In
 * entrambi i casi si scrive solo quello che e' cambiato: un campo lasciato
 * vuoto vuol dire "come prima", non "cancella".
 */
export async function modificaPiatto(chiave: string, cambi: Modifica) {
  await aggiorna(async (deposito) => {
    const aggiunto = deposito.aggiunti.find((p) => p.id === chiave)

    if (aggiunto) {
      if (cambi.foto && aggiunto.foto) await eliminaFoto(aggiunto.foto)
      // Un piatto nato qui la sezione ce l'ha nella portata: si sposta
      // cambiando quella, non scrivendo una modifica sopra a se stesso.
      const portata = cambi.sezione ? portataDiSezione(cambi.sezione)?.chiave : undefined
      return {
        ...deposito,
        aggiunti: deposito.aggiunti.map((p) =>
          p.id === chiave
            ? {
                ...p,
                portata: portata ?? p.portata,
                nome: cambi.nome ?? p.nome,
                ingredienti: cambi.ingredienti ?? p.ingredienti,
                prezzo: cambi.prezzo ?? p.prezzo,
                de: cambi.de ?? p.de,
                en: cambi.en ?? p.en,
                foto: cambi.foto ?? p.foto,
              }
            : p
        ),
      }
    }

    const prima = deposito.modifiche[chiave] ?? {}
    if (cambi.foto && prima.foto) await eliminaFoto(prima.foto)
    return { ...deposito, modifiche: { ...deposito.modifiche, [chiave]: { ...prima, ...cambi } } }
  })
}

/** Spegne un piatto se e' acceso, lo riaccende se e' spento. */
export async function commutaNascosto(chiave: string) {
  await aggiorna((deposito) => ({
    ...deposito,
    nascosti: deposito.nascosti.includes(chiave)
      ? deposito.nascosti.filter((c) => c !== chiave)
      : [...deposito.nascosti, chiave],
  }))
}

/**
 * Toglie un piatto per sempre: fuori dal sito e fuori dal pannello.
 *
 * Un piatto nato dal pannello sparisce davvero, con la sua fotografia. Uno del
 * menu scritto a mano resta nel file — da qui non lo si puo' toccare — ma
 * finisce fra i `cancellati` e non si vede piu' da nessuna parte. Per farlo
 * tornare si toglie la sua chiave dal deposito.
 */
export async function cancellaPiatto(chiave: string) {
  await aggiorna(async (deposito) => {
    const aggiunto = deposito.aggiunti.find((p) => p.id === chiave)
    await eliminaFoto(aggiunto ? aggiunto.foto : deposito.modifiche[chiave]?.foto)

    const modifiche = { ...deposito.modifiche }
    delete modifiche[chiave]

    return {
      aggiunti: deposito.aggiunti.filter((p) => p.id !== chiave),
      nascosti: deposito.nascosti.filter((c) => c !== chiave),
      cancellati: aggiunto ? deposito.cancellati : [...deposito.cancellati, chiave],
      modifiche,
      ordine: Object.fromEntries(
        Object.entries(deposito.ordine).map(([s, chiavi]) => [s, chiavi.filter((c) => c !== chiave)])
      ),
    }
  })
}

/** Riscrive l'ordine dei piatti di una sezione. */
export async function riordinaSezione(sezione: string, chiavi: string[]) {
  await aggiorna((deposito) => ({
    ...deposito,
    ordine: { ...deposito.ordine, [sezione]: chiavi },
  }))
}
