import 'server-only'
import { cookies } from 'next/headers'

/**
 * La chiave del pannello: una password sola, condivisa con il locale.
 *
 * Nel biscotto non finisce la password ma la sua impronta, e il biscotto e'
 * `httpOnly`: non lo legge il JavaScript della pagina, quindi non lo porta via
 * uno script iniettato. Il confronto e' a tempo costante — su una password
 * corta conta poco, ma non costa niente farlo bene.
 *
 * **Senza `ADMIN_PASSWORD` il pannello non si apre.** Nessuna password di
 * riserva, nessun valore predefinito: una porta che si apre da sola perche' e'
 * stata dimenticata una variabile e' peggio di una porta che non c'e'.
 */

export const BISCOTTO = 'nunzio_admin'

export async function impronta(password: string): Promise<string> {
  const dati = new TextEncoder().encode(`nunzio:${password}`)
  const hash = await crypto.subtle.digest('SHA-256', dati)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Confronto che non si ferma alla prima differenza. */
function uguali(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let scarto = 0
  for (let i = 0; i < a.length; i++) scarto |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return scarto === 0
}

export function passwordConfigurata(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export async function autenticato(): Promise<boolean> {
  const attesa = process.env.ADMIN_PASSWORD
  if (!attesa) return false
  const valore = (await cookies()).get(BISCOTTO)?.value
  if (!valore) return false
  return uguali(valore, await impronta(attesa))
}

/**
 * Da chiamare all'inizio di ogni azione che tocca il menu.
 *
 * Le azioni **non si fidano della pagina**: chi conosce l'indirizzo di
 * un'azione puo' chiamarla senza passare dal modulo, e un controllo fatto solo
 * quando si disegna il pannello non serve a niente.
 */
export async function esigiAccesso(): Promise<void> {
  if (!(await autenticato())) throw new Error('Non autorizzato')
}
