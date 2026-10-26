'use client'

import { useRef, useState, useTransition } from 'react'
import { nuovoAllergene } from '@/app/admin/actions'
import type { Allergene, VoceAllergene } from '@/lib/piatti'

/**
 * Le caselle degli allergeni, per il modulo che crea un piatto e per quello
 * che lo cambia.
 *
 * Caselle e non un campo di testo: «latticini», «lattosio», «formaggio» sono
 * tre modi di scrivere lo stesso allergene, e il menu deve stampare un numero
 * solo. Il numero accanto al nome e' quello che il cliente vedra' sotto al
 * piatto.
 *
 * Le caselle restano **campi del modulo e basta**: si spediscono tutte con il
 * nome `allergeni`, e l'azione legge quelle spuntate.
 *
 * In fondo c'e' il posto per **aggiungerne uno all'elenco**, con numero e nome.
 * Non e' un modulo a parte — un `<form>` dentro un altro non si puo' — ma due
 * campi senza nome e un bottone che chiama l'azione da se': il piatto che si
 * sta scrivendo resta li' com'era, e il nuovo allergene compare fra le caselle
 * gia' spuntato. Da quel momento lo propone a ogni piatto.
 */
export default function SceltaAllergeni({
  catalogo,
  scelti = [],
  compatto = false,
}: {
  catalogo: VoceAllergene[]
  scelti?: readonly Allergene[]
  /** Pillole piu' piccole, per il modulo di modifica dentro l'elenco. */
  compatto?: boolean
}) {
  const [appenaAggiunti, setAppenaAggiunti] = useState<Allergene[]>([])
  const [aperto, setAperto] = useState(false)
  const [guaio, setGuaio] = useState('')
  const [salvando, avvia] = useTransition()
  const numeroRef = useRef<HTMLInputElement>(null)
  const nomeRef = useRef<HTMLInputElement>(null)

  // Il primo numero libero dopo l'ultimo: quasi sempre e' quello giusto.
  const prossimo = Math.max(0, ...catalogo.map((a) => a.numero)) + 1

  const aggiungi = () => {
    const numero = numeroRef.current?.value ?? ''
    const nome = nomeRef.current?.value ?? ''
    setGuaio('')
    avvia(async () => {
      const r = await nuovoAllergene(numero, nome)
      if ('errore' in r) setGuaio(r.errore)
      else {
        setAppenaAggiunti((prima) => [...prima, r.chiave])
        setAperto(false)
      }
    })
  }

  // Invio in uno di questi campi manderebbe il modulo del piatto: qui vuol
  // dire "aggiungi l'allergene", e basta.
  const invio = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    aggiungi()
  }

  const campo =
    'border-secondary/25 focus:border-secondary rounded-full border bg-transparent px-4 py-2 text-sm outline-none'

  return (
    <fieldset>
      <legend className="nav-link opacity-60">Allergeni</legend>
      <div className={`flex flex-wrap ${compatto ? 'mt-3 gap-2' : 'mt-4 gap-2.5'}`}>
        {catalogo.map((a) => (
          <label
            key={a.chiave}
            className={`border-secondary/25 has-checked:bg-secondary has-checked:text-primary has-focus-visible:outline-secondary cursor-pointer rounded-full border text-sm transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 ${
              compatto ? 'px-4 py-1.5' : 'px-4 py-2'
            }`}
          >
            <input
              type="checkbox"
              name="allergeni"
              value={a.chiave}
              defaultChecked={scelti.includes(a.chiave) || appenaAggiunti.includes(a.chiave)}
              className="sr-only"
            />
            <span className="mr-1.5 opacity-60">{a.numero}</span>
            {a.it}
          </label>
        ))}

        {!aperto ? (
          <button
            type="button"
            onClick={() => {
              setAperto(true)
              setGuaio('')
            }}
            className={`border-secondary/25 hover:border-secondary rounded-full border border-dashed text-sm opacity-70 transition-opacity hover:opacity-100 ${
              compatto ? 'px-4 py-1.5' : 'px-4 py-2'
            }`}
          >
            + Nuovo allergene
          </button>
        ) : null}
      </div>

      {aperto ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            ref={numeroRef}
            aria-label="Numero del nuovo allergene"
            defaultValue={prossimo}
            inputMode="numeric"
            onKeyDown={invio}
            className={`${campo} w-20 text-center`}
          />
          <input
            ref={nomeRef}
            aria-label="Nome del nuovo allergene"
            placeholder="Nome, es. Kiwi"
            autoFocus
            onKeyDown={invio}
            className={`${campo} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={aggiungi}
            disabled={salvando}
            className="bg-secondary text-primary rounded-full px-5 py-2 text-sm disabled:opacity-50"
          >
            {salvando ? 'Aggiungo…' : 'Aggiungi'}
          </button>
          <button
            type="button"
            onClick={() => setAperto(false)}
            className="text-sm underline underline-offset-4 opacity-60"
          >
            Annulla
          </button>
        </div>
      ) : null}

      {guaio ? <p className="mt-2 text-sm text-red-700">{guaio}</p> : null}

      <p className="mt-2 text-sm opacity-60">
        Spunta quelli presenti nel piatto. Sul menù escono come numeri, spiegati in fondo alla
        pagina. Un allergene nuovo resta nell’elenco anche per i piatti che verranno.
      </p>
    </fieldset>
  )
}
