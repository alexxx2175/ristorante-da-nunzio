'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { BISCOTTO, esigiAccesso, impronta } from '@/lib/admin-auth'
import {
  aggiungiAllergene,
  aggiungiPiatto,
  cancellaPiatto,
  commutaNascosto,
  modificaPiatto,
  leggiDeposito,
  riordinaSezione,
  salvaFoto,
} from '@/lib/piatti-store'
import { PORTATE, catalogoAllergeni, formattaPrezzo, pulisciAllergeni } from '@/lib/piatti'
import type { Portata } from '@/lib/piatti'
import { traduciPiatto } from '@/lib/traduci'
import type { Esito } from './esito'

/**
 * Due ore, poi la password si richiede.
 *
 * Era un mese, ed era troppo: il pannello si apriva senza chiedere niente a
 * chiunque prendesse in mano un telefono o un computer da cui si era entrati
 * una volta. Due ore bastano per sistemare il menu in una sessione sola.
 */
const DURATA = 60 * 60 * 2

export async function entra(_precedente: Esito, dati: FormData): Promise<Esito> {
  const attesa = process.env.ADMIN_PASSWORD
  if (!attesa) return { errore: 'Il pannello non e’ configurato: manca ADMIN_PASSWORD.' }

  const password = String(dati.get('password') ?? '')
  if (password !== attesa) return { errore: 'Password sbagliata.' }

  ;(await cookies()).set(BISCOTTO, await impronta(attesa), {
    httpOnly: true,
    sameSite: 'lax',
    // In produzione solo su connessione cifrata; in sviluppo il sito gira su
    // http e con questo attivo il biscotto non verrebbe mai salvato.
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DURATA,
  })
  return { fatto: 'Accesso eseguito.' }
}

export async function esci(): Promise<void> {
  ;(await cookies()).delete(BISCOTTO)
  revalidatePath('/admin')
}

export async function salvaPiatto(_precedente: Esito, dati: FormData): Promise<Esito> {
  await esigiAccesso()

  const portata = String(dati.get('portata') ?? '') as Portata
  const nome = String(dati.get('nome') ?? '').trim()
  const ingredienti = String(dati.get('ingredienti') ?? '').trim()
  const prezzo = formattaPrezzo(String(dati.get('prezzo') ?? ''))
  const file = dati.get('foto')

  if (!PORTATE.some((p) => p.chiave === portata)) return { errore: 'Scegli se e’ antipasto, primo o secondo.' }
  if (!nome) return { errore: 'Manca il nome del piatto.' }

  let foto: string | undefined
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith('image/')) return { errore: 'Il file scelto non e’ un’immagine.' }
    // Il tetto vero non e' questo ma quello della piattaforma: le Server Action
    // accettano `bodySizeLimit`, e su Vercel non si va oltre 4.5 MB. Il modulo
    // rimpicciolisce la fotografia prima di mandarla, quindi qui non ci si
    // arriva quasi mai — ma se il browser non sa aprire il formato (certi HEIC)
    // la foto parte com'e', ed e' meglio un messaggio chiaro di un errore di
    // sistema.
    if (file.size > 3.5 * 1024 * 1024)
      return { errore: 'La fotografia e’ troppo grande: riprova con uno scatto piu’ leggero.' }
    foto = await salvaFoto(file)
  }

  // Le traduzioni si propongono da sole **solo se non le ha scritte nessuno**:
  // chi le ha compilate a mano ha gia' deciso, e sovrascriverle sarebbe come
  // correggere il locale su come si chiama un suo piatto.
  let de = String(dati.get('de') ?? '').trim()
  let en = String(dati.get('en') ?? '').trim()
  if (!de && !en) {
    const proposta = await traduciPiatto(nome, ingredienti)
    if (proposta) ({ de, en } = proposta)
  }

  const allergeni = await allergeniDalModulo(dati)

  await aggiungiPiatto({ portata, nome, ingredienti, prezzo, de, en, allergeni, foto })

  // Il menu e' una pagina pregenerata: senza questo continuerebbe a mostrare
  // quella di prima finche' non si ripubblica il sito.
  revalidatePath('/menu-ristorante')
  revalidatePath('/admin')
  return {
    fatto: `“${nome}” aggiunto al menu.${de || en ? ' Tedesco e inglese proposti dalla traduzione automatica: rileggili dalla matita.' : ''}`,
  }
}

/** Le caselle spuntate, tenendo solo gli allergeni che l'elenco conosce. */
async function allergeniDalModulo(dati: FormData) {
  const { allergeni } = await leggiDeposito()
  return pulisciAllergeni(dati.getAll('allergeni').map(String), catalogoAllergeni(allergeni))
}

/** Toglie un piatto per sempre. Il pannello chiede conferma prima di chiamarla. */
export async function rimuoviPiatto(_precedente: Esito, dati: FormData): Promise<Esito> {
  await esigiAccesso()
  const chiave = String(dati.get('chiave') ?? '')
  if (!chiave) return { errore: 'Piatto non trovato.' }
  await cancellaPiatto(chiave)
  revalidatePath('/menu-ristorante')
  revalidatePath('/admin')
  return { fatto: 'Piatto tolto dal menu.' }
}

/**
 * Cambia un piatto gia' in carta, senza rifarlo da capo: il nome, gli
 * ingredienti, il prezzo, gli allergeni, la fotografia e la sezione in cui sta.
 */
export async function cambiaPiatto(_precedente: Esito, dati: FormData): Promise<Esito> {
  await esigiAccesso()
  const chiave = String(dati.get('chiave') ?? '')
  if (!chiave) return { errore: 'Piatto non trovato.' }

  const nome = String(dati.get('nome') ?? '').trim()
  if (!nome) return { errore: 'Il nome non puo’ restare vuoto.' }

  let foto: string | undefined
  const file = dati.get('foto')
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith('image/')) return { errore: 'Il file scelto non e’ un’immagine.' }
    if (file.size > 3.5 * 1024 * 1024)
      return { errore: 'La fotografia e’ troppo grande: riprova con uno scatto piu’ leggero.' }
    foto = await salvaFoto(file)
  }

  // La sezione si accetta solo se e' una di quelle che esistono: arriva da un
  // modulo, e un modulo lo si puo' riscrivere prima di mandarlo.
  const sezione = String(dati.get('sezione') ?? '')
  const spostato = PORTATE.find((p) => p.sezione === sezione)

  await modificaPiatto(chiave, {
    nome,
    ingredienti: String(dati.get('ingredienti') ?? '').trim(),
    prezzo: formattaPrezzo(String(dati.get('prezzo') ?? '')),
    de: String(dati.get('de') ?? '').trim(),
    en: String(dati.get('en') ?? '').trim(),
    // Sempre, anche vuoto: le caselle arrivano gia' spuntate come sono adesso,
    // e toglierle tutte e' il modo di dire che il piatto non ne ha.
    allergeni: await allergeniDalModulo(dati),
    ...(spostato ? { sezione: spostato.sezione } : {}),
    ...(foto ? { foto } : {}),
  })
  revalidatePath('/menu-ristorante')
  revalidatePath('/admin')
  return { fatto: 'Piatto aggiornato.' }
}

/** Salva l'ordine dei piatti di una sezione, dopo che sono stati trascinati. */
export async function salvaOrdine(sezione: string, chiavi: string[]): Promise<void> {
  await esigiAccesso()
  await riordinaSezione(sezione, chiavi)
  revalidatePath('/menu-ristorante')
  revalidatePath('/admin')
}

/** Spegne o riaccende un piatto, che sia del menu scritto a mano o aggiunto qui. */
export async function commutaVisibilita(_precedente: Esito, dati: FormData): Promise<Esito> {
  await esigiAccesso()
  const chiave = String(dati.get('chiave') ?? '')
  if (!chiave) return { errore: 'Piatto non trovato.' }
  await commutaNascosto(chiave)
  revalidatePath('/menu-ristorante')
  revalidatePath('/admin')
  return {}
}

/**
 * Propone la traduzione di un piatto, senza salvare niente.
 *
 * Sta dietro all'accesso come tutto il resto: ogni chiamata costa, e l'indirizzo
 * di un'azione lo si puo' trovare guardando la pagina.
 *
 * Il risultato torna al modulo, che lo mette nei due campi **lasciandoli
 * modificabili**: e' una proposta, non un verdetto. Chi conosce il piatto ha
 * sempre l'ultima parola.
 */
export async function proponiTraduzione(
  nome: string,
  ingredienti: string
): Promise<{ de: string; en: string } | { errore: string }> {
  await esigiAccesso()
  if (!nome.trim()) return { errore: 'Scrivi prima il nome del piatto.' }

  const proposta = await traduciPiatto(nome, ingredienti)
  return proposta ?? { errore: 'La traduzione non è arrivata. Riprova, o scrivila a mano.' }
}

/**
 * Aggiunge un allergene all'elenco, con il suo numero e il suo nome.
 *
 * Non salva nessun piatto: lo si chiama da dentro il modulo del piatto, che
 * resta compilato com'era, e il nuovo allergene compare fra le caselle gia'
 * spuntato. Da li' in avanti viene proposto a ogni piatto.
 */
export async function nuovoAllergene(
  numeroGrezzo: string,
  nomeGrezzo: string
): Promise<{ chiave: string } | { errore: string }> {
  await esigiAccesso()
  const numero = Number(numeroGrezzo.trim())
  const nome = nomeGrezzo.trim()
  if (!Number.isInteger(numero) || numero < 1 || numero > 99)
    return { errore: 'Il numero dev’essere un numero intero, da 1 a 99.' }
  if (!nome) return { errore: 'Manca il nome dell’allergene.' }

  const catalogo = catalogoAllergeni((await leggiDeposito()).allergeni)
  const stessoNumero = catalogo.find((a) => a.numero === numero)
  if (stessoNumero) return { errore: `Il numero ${numero} è già di «${stessoNumero.it}».` }
  if (catalogo.some((a) => a.it.toLowerCase() === nome.toLowerCase()))
    return { errore: `«${nome}» c’è già nell’elenco.` }

  const chiave = await aggiungiAllergene(numero, nome)
  if (!chiave) return { errore: 'Numero o nome già presi: ricarica la pagina e riprova.' }

  revalidatePath('/menu-ristorante')
  revalidatePath('/admin')
  return { chiave }
}
