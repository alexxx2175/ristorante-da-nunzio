/**
 * L'esito di un'azione del pannello: un errore da mostrare, o la conferma che
 * e' andata.
 *
 * Sta fuori da `actions.ts` perche' un file marcato `'use server'` puo'
 * esportare **solo funzioni asincrone**: ogni altra cosa — un tipo, una
 * costante — fa cadere la compilazione con un messaggio che parla d'altro.
 */
export type Esito = { errore?: string; fatto?: string }

export const nessunEsito: Esito = {}
