'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { cambiaPiatto, proponiTraduzione } from '@/app/admin/actions'
import { nessunEsito } from '@/app/admin/esito'
import { PORTATE } from '@/lib/piatti'
import { riduciImmagine } from '@/lib/riduci-immagine'
import type { Riga } from '@/components/admin/SezioneMenu'

/**
 * Il modulo per cambiare un piatto gia' in carta.
 *
 * Arriva **gia' compilato** con quello che c'e': si corregge una parola nel
 * nome, si aggiusta un prezzo, si cambia una foto, e il resto resta com'e'.
 * Rifare il piatto da capo per una virgola era la cosa che il locale non
 * voleva.
 *
 * La fotografia si sostituisce solo se se ne sceglie una: il campo vuoto vuol
 * dire "tieni quella di prima". Gli altri campi no — lasciarne uno vuoto
 * cancella quello che c'era, che e' l'unico modo per togliere un prezzo o una
 * riga di ingredienti.
 *
 * Da qui si cambia anche **dov'e'**: un piatto passato dagli antipasti ai
 * secondi si sposta di sezione senza perdere niente, foto compresa.
 *
 * Le due righe in tedesco e inglese si possono farsi proporre, e restano
 * **campi come gli altri**: la proposta si corregge, si riscrive, si cancella.
 * Nessuno traduce «tastasal» meglio di chi lo cucina.
 */
export default function ModuloModifica({
  riga,
  chiudi,
  traduzioneAttiva,
}: {
  riga: Riga
  chiudi: () => void
  traduzioneAttiva: boolean
}) {
  const moduloRef = useRef<HTMLFormElement>(null)
  // Questi due sono gli unici campi guidati da React: il bottone ci scrive
  // dentro, e un campo che si riempie da solo non puo' essere lasciato al DOM.
  const [de, setDe] = useState(riga.de)
  const [en, setEn] = useState(riga.en)
  const [guaio, setGuaio] = useState('')
  const [traducendo, avviaTraduzione] = useTransition()

  const proponi = () => {
    const f = moduloRef.current
    if (!f) return
    setGuaio('')
    avviaTraduzione(async () => {
      const r = await proponiTraduzione(f.nome.value, f.ingredienti.value)
      if ('errore' in r) setGuaio(r.errore)
      else {
        setDe(r.de)
        setEn(r.en)
      }
    })
  }

  const [esito, azione, inCorso] = useActionState(
    async (precedente: typeof nessunEsito, dati: FormData) => {
      const foto = dati.get('foto')
      if (foto instanceof File && foto.size > 0) dati.set('foto', await riduciImmagine(foto))
      return cambiaPiatto(precedente, dati)
    },
    nessunEsito
  )

  // Il modulo si chiude da solo quando ha salvato: restare aperti su dei campi
  // identici a quelli di prima non dice se e' andata.
  useEffect(() => {
    if (esito.fatto) chiudi()
  }, [esito.fatto, chiudi])

  return (
    <form
      ref={moduloRef}
      action={azione}
      className="border-secondary/15 flex flex-col gap-5 rounded-[1.5rem] border p-5"
    >
      <input type="hidden" name="chiave" value={riga.chiave} />

      <fieldset>
        <legend className="nav-link opacity-60">Che piatto è</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PORTATE.map((p) => (
            <label
              key={p.chiave}
              className="border-secondary/25 has-checked:bg-secondary has-checked:text-primary cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors duration-200"
            >
              <input
                type="radio"
                name="sezione"
                value={p.sezione}
                defaultChecked={p.sezione === riga.sezione}
                className="sr-only"
              />
              {p.etichetta}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`nome-${riga.chiave}`} className="nav-link opacity-60">
          Nome
        </label>
        <input
          id={`nome-${riga.chiave}`}
          name="nome"
          defaultValue={riga.nome}
          required
          className="border-secondary/25 focus:border-secondary mt-2 w-full rounded-full border bg-transparent px-5 py-2.5 outline-none"
        />
      </div>

      <div>
        <label htmlFor={`ingr-${riga.chiave}`} className="nav-link opacity-60">
          Ingredienti
        </label>
        <textarea
          id={`ingr-${riga.chiave}`}
          name="ingredienti"
          rows={2}
          defaultValue={riga.ingredienti}
          className="border-secondary/25 focus:border-secondary mt-2 w-full rounded-[1.25rem] border bg-transparent px-5 py-3 outline-none"
        />
      </div>

      <div>
        <label htmlFor={`prezzo-${riga.chiave}`} className="nav-link opacity-60">
          Prezzo
        </label>
        <input
          id={`prezzo-${riga.chiave}`}
          name="prezzo"
          defaultValue={riga.prezzo}
          inputMode="decimal"
          className="border-secondary/25 focus:border-secondary mt-2 w-full rounded-full border bg-transparent px-5 py-2.5 outline-none"
        />
      </div>

      <fieldset className="border-secondary/15 rounded-[1.25rem] border px-5 pt-5 pb-5">
        <legend className="nav-link px-2 opacity-60">Come si legge nelle altre lingue</legend>

        {traduzioneAttiva ? (
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={proponi}
              disabled={traducendo}
              className="border-secondary/25 hover:bg-secondary hover:text-primary rounded-full border px-5 py-2 text-sm transition-colors duration-300 disabled:opacity-50"
            >
              {traducendo ? 'Traduco…' : 'Proponi traduzione'}
            </button>
            <span className="text-sm opacity-60">
              Dal nome e dagli ingredienti scritti qui sopra. Poi correggi pure.
            </span>
          </div>
        ) : null}

        {guaio ? <p className="mb-4 text-sm text-red-700">{guaio}</p> : null}

        <div>
          <label htmlFor={`de-${riga.chiave}`} className="nav-link opacity-60">
            Tedesco
          </label>
          <input
            id={`de-${riga.chiave}`}
            name="de"
            value={de}
            onChange={(e) => setDe(e.target.value)}
            className="border-secondary/25 focus:border-secondary mt-2 w-full rounded-full border bg-transparent px-5 py-2.5 outline-none"
          />
        </div>

        <div className="mt-4">
          <label htmlFor={`en-${riga.chiave}`} className="nav-link opacity-60">
            Inglese
          </label>
          <input
            id={`en-${riga.chiave}`}
            name="en"
            value={en}
            onChange={(e) => setEn(e.target.value)}
            className="border-secondary/25 focus:border-secondary mt-2 w-full rounded-full border bg-transparent px-5 py-2.5 outline-none"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor={`foto-${riga.chiave}`} className="nav-link opacity-60">
          Cambia fotografia
        </label>
        <input
          id={`foto-${riga.chiave}`}
          name="foto"
          type="file"
          accept="image/*"
          className="border-secondary/25 file:bg-secondary file:text-primary mt-2 w-full rounded-full border bg-transparent px-5 py-2.5 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-1.5"
        />
        <p className="mt-2 text-sm opacity-60">Se non ne scegli una resta quella di adesso.</p>
      </div>

      {esito.errore ? <p className="text-sm text-red-700">{esito.errore}</p> : null}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={inCorso}
          className="bg-secondary text-primary rounded-full px-6 py-2.5 disabled:opacity-50"
        >
          {inCorso ? 'Salvo…' : 'Salva'}
        </button>
        <button type="button" onClick={chiudi} className="underline underline-offset-4 opacity-60">
          Annulla
        </button>
      </div>
    </form>
  )
}
