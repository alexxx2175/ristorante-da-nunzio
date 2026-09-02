import { foodSections } from '@/lib/menu'
import { PORTATE, chiavePiatto } from '@/lib/piatti'
import type { Deposito, Modifica } from '@/lib/piatti'
import type { MenuItem } from '@/components/sections/MenuScaffold'

/**
 * Un piatto del menu **dopo** che il pannello ci ha messo mano, con addosso le
 * due cose che al pannello servono e al sito no: da dove viene e se e' acceso.
 */
export type VoceComposta = {
  /** Come il deposito lo conosce: l'identificatore, o `sezione::nome`. */
  chiave: string
  voce: MenuItem
  /** Nato dal pannello, non dal menu scritto a mano. */
  aggiunto: boolean
  spento: boolean
}

export type SezioneComposta = { title: string; note?: string; voci: VoceComposta[] }

/**
 * Mette insieme il menu scritto a mano e quello che il pannello ha fatto.
 *
 * **Un posto solo.** Il sito e il pannello devono vedere lo stesso menu — se
 * ognuno se lo ricomponesse per conto suo, prima o poi mostrerebbero due cose
 * diverse e il locale toglierebbe un piatto che al cliente resta li'. Da qui
 * escono tutte le voci, spente comprese: il sito butta via le spente, il
 * pannello le mostra con l'occhio chiuso.
 *
 * L'ordine e' quello del file, salvo dove il pannello l'ha cambiato.
 */
export function componiMenu(deposito: Deposito): SezioneComposta[] {
  const cancellati = new Set(deposito.cancellati)
  const nascosti = new Set(deposito.nascosti)
  const sezioni = new Set(foodSections.map((s) => s.title))

  // Prima tutti i piatti con la sezione in cui vanno **adesso**, poi si
  // raggruppano: un piatto puo' essere stato spostato in un'altra sezione, e
  // finche' si guarda una sezione per volta quello spostamento non si vede.
  // `origine` e' la sezione a cui il piatto appartiene di suo; `sezione` e'
  // quella in cui sta adesso. Sono diverse solo per un piatto spostato.
  const tutti: (VoceComposta & { sezione: string; origine: string })[] = []

  for (const sezione of foodSections) {
    for (const voce of sezione.items) {
      const chiave = chiavePiatto(sezione.title, voce.name)
      if (cancellati.has(chiave)) continue
      const cambi = deposito.modifiche[chiave]
      tutti.push({
        chiave,
        aggiunto: false,
        spento: nascosti.has(chiave),
        voce: cambi ? applica(voce, cambi) : voce,
        origine: sezione.title,
        // Una sezione che non esiste piu' — il menu cambia, il deposito resta —
        // riporta il piatto a casa sua invece di farlo sparire.
        sezione: cambi?.sezione && sezioni.has(cambi.sezione) ? cambi.sezione : sezione.title,
      })
    }
  }

  for (const p of deposito.aggiunti) {
    const sezione = PORTATE.find((x) => x.chiave === p.portata)?.sezione
    if (!sezione) continue
    tutti.push({
      chiave: p.id,
      aggiunto: true,
      spento: nascosti.has(p.id),
      sezione,
      origine: sezione,
      voce: {
        name: p.nome,
        ...(p.ingredienti ? { description: p.ingredienti } : {}),
        ...(p.prezzo ? { price: p.prezzo } : {}),
        ...(p.de ? { de: p.de } : {}),
        ...(p.en ? { en: p.en } : {}),
        ...(p.foto ? { photo: { src: p.foto, alt: p.nome } } : {}),
      },
    })
  }

  return foodSections.map((sezione) => {
    const dentro = tutti.filter((v) => v.sezione === sezione.title)
    return {
      title: sezione.title,
      ...(sezione.note ? { note: sezione.note } : {}),
      // Chi arriva da un'altra sezione si mette **in fondo**, non dove capita:
      // spostare un piatto e vederselo comparire in mezzo agli altri sembra un
      // errore. Da li' lo si trascina dove serve.
      voci: ordina(
        [
          ...dentro.filter((v) => v.origine === sezione.title),
          ...dentro.filter((v) => v.origine !== sezione.title),
        ],
        deposito.ordine[sezione.title]
      ),
    }
  })
}

/**
 * Riscrive una voce con quello che il pannello ha cambiato.
 *
 * Le traduzioni si cambiano come tutto il resto: il pannello ha i due campi, e
 * lasciarle indietro quando si corregge il nome italiano voleva dire una carta
 * che dice due cose diverse a due tavoli vicini.
 *
 * Un campo svuotato **cancella**: il modulo di modifica arriva gia' compilato
 * con quello che c'e', quindi lasciarlo vuoto e' una scelta, non una
 * dimenticanza.
 */
function applica(voce: MenuItem, cambi: Modifica): MenuItem {
  const descrizione = cambi.ingredienti ?? voce.description
  const prezzo = cambi.prezzo ?? voce.price
  const de = cambi.de ?? voce.de
  const en = cambi.en ?? voce.en
  const foto = cambi.foto ? { src: cambi.foto, alt: cambi.nome ?? voce.name } : voce.photo
  return {
    ...voce,
    name: cambi.nome ?? voce.name,
    ...(descrizione ? { description: descrizione } : { description: undefined }),
    ...(prezzo ? { price: prezzo } : { price: undefined }),
    ...(de ? { de } : { de: undefined }),
    ...(en ? { en } : { en: undefined }),
    ...(foto ? { photo: foto } : {}),
  }
}

/**
 * Rimette le voci nell'ordine deciso trascinandole.
 *
 * Chi non e' nell'elenco salvato — un piatto aggiunto dopo l'ultimo
 * riordino — finisce in fondo, nell'ordine in cui stava. Il posto e' un numero
 * grande e non `Infinity`: `Infinity - Infinity` fa `NaN` e il confronto salta,
 * lasciando l'ordine a caso.
 */
function ordina(voci: VoceComposta[], chiavi?: string[]): VoceComposta[] {
  if (!chiavi?.length) return voci
  const posto = new Map(chiavi.map((c, i) => [c, i]))
  const fondo = chiavi.length + voci.length
  return [...voci].sort((a, b) => (posto.get(a.chiave) ?? fondo) - (posto.get(b.chiave) ?? fondo))
}
