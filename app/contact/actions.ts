/* NON IN USO dal 02/09/2026: il modulo che la chiamava e' stato tolto dalla
   pagina contatti (vedi ContactForm.tsx). Resta su disco insieme a lui: se il
   modulo torna, torna anche questa senza riscriverla. */
'use server'

import { siteConfig } from '@/lib/site'

export type ContactState = {
  status: 'idle' | 'success' | 'error' | 'not-configured'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>
  /** mailto precompilato, usato come via d'uscita se non c'e' un endpoint. */
  mailto?: string
}

export const initialContactState: ContactState = { status: 'idle' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function buildMailto(name: string, email: string, message: string) {
  const subject = `Richiesta dal sito — ${name}`
  const body = `${message}\n\n—\n${name}\n${email}`
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}

/**
 * Invio del form contatti.
 *
 * Il messaggio viene inoltrato a `CONTACT_WEBHOOK_URL` (endpoint HTTP che
 * accetta JSON: Formspree, un webhook n8n/Make, una Cloud Function...).
 * Se la variabile d'ambiente non e' configurata la funzione NON finge di aver
 * inviato: restituisce `not-configured` insieme a un mailto precompilato, cosi'
 * il messaggio dell'utente non va perso.
 */
export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const honeypot = String(formData.get('company') ?? '').trim()

  /* Campo esca invisibile: se e' pieno e' un bot. Rispondiamo ok e non inviamo. */
  if (honeypot) return { status: 'success', message: 'Grazie, messaggio ricevuto.' }

  const fieldErrors: ContactState['fieldErrors'] = {}
  if (name.length < 2) fieldErrors.name = 'Inserisci il tuo nome.'
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Inserisci un indirizzo email valido.'
  if (message.length < 10) fieldErrors.message = 'Scrivi almeno una frase (10 caratteri).'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Controlla i campi segnalati.', fieldErrors }
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL

  if (!endpoint) {
    return {
      status: 'not-configured',
      message:
        'Il sito non ha ancora un servizio di invio email collegato. Puoi mandarci il messaggio dal tuo client di posta oppure chiamarci.',
      mailto: buildMailto(name, email, message),
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, source: siteConfig.url }),
    })

    if (!response.ok) throw new Error(`Endpoint ha risposto ${response.status}`)

    return {
      status: 'success',
      message: 'Grazie! Abbiamo ricevuto il messaggio e vi risponderemo presto.',
    }
  } catch {
    return {
      status: 'error',
      message: 'Non riusciamo a inviare il messaggio in questo momento. Provate a chiamarci.',
      mailto: buildMailto(name, email, message),
    }
  }
}
