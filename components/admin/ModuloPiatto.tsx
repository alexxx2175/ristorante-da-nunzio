'use client'

import { useActionState, useRef } from 'react'
import { salvaPiatto } from '@/app/admin/actions'
import { nessunEsito } from '@/app/admin/esito'
import { PORTATE } from '@/lib/piatti'
import { riduciImmagine } from '@/lib/riduci-immagine'

/**
 * Il modulo per aggiungere un piatto: che portata e', il nome, gli ingredienti,
 * il prezzo, come si legge in tedesco e in inglese, la fotografia.
 *
 * A cose fatte il modulo si svuota: senza, si resta davanti ai campi appena
 * compilati e non si capisce se il piatto e' stato salvato o no.
 *
 * Il tedesco e l'inglese lasciati vuoti li propone la traduzione automatica al
 * salvataggio. **Nessun bottone da premere qui**: chi aggiunge un piatto sta
 * facendo un'altra cosa, e la proposta la si rilegge con calma dalla matita —
 * che e' anche l'unico posto dove si vede accanto al resto della carta.
 */
export default function ModuloPiatto({ traduzioneAttiva }: { traduzioneAttiva: boolean }) {
  const ref = useRef<HTMLFormElement>(null)
  const [esito, azione, inCorso] = useActionState(
    async (precedente: typeof nessunEsito, dati: FormData) => {
      // La fotografia si rimpicciolisce **qui**, prima di partire: le Server
      // Action accettano un corpo di 1 MB e una foto da telefono lo supera
      // sempre. Vedi `riduciImmagine`.
      const foto = dati.get('foto')
      if (foto instanceof File && foto.size > 0) dati.set('foto', await riduciImmagine(foto))

      const r = await salvaPiatto(precedente, dati)
      if (r.fatto) ref.current?.reset()
      return r
    },
    nessunEsito
  )

  return (
    <form ref={ref} action={azione} className="flex flex-col gap-8">
      <fieldset>
        <legend className="nav-link opacity-60">Che piatto è</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {PORTATE.map((p, i) => (
            <label
              key={p.chiave}
              className="border-secondary/25 has-checked:bg-secondary has-checked:text-primary cursor-pointer rounded-full border px-6 py-3 transition-colors duration-200"
            >
              <input
                type="radio"
                name="portata"
                value={p.chiave}
                defaultChecked={i === 0}
                className="sr-only"
              />
              {p.etichetta}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="nome" className="nav-link opacity-60">
          Nome del piatto
        </label>
        <input
          id="nome"
          name="nome"
          required
          className="border-secondary/25 focus:border-secondary mt-3 w-full rounded-full border bg-transparent px-6 py-3 outline-none"
        />
      </div>

      <div>
        <label htmlFor="ingredienti" className="nav-link opacity-60">
          Ingredienti
        </label>
        <textarea
          id="ingredienti"
          name="ingredienti"
          rows={3}
          className="border-secondary/25 focus:border-secondary mt-3 w-full rounded-[1.5rem] border bg-transparent px-6 py-4 outline-none"
        />
      </div>

      <div>
        <label htmlFor="prezzo" className="nav-link opacity-60">
          Prezzo
        </label>
        <input
          id="prezzo"
          name="prezzo"
          inputMode="decimal"
          placeholder="18,00"
          className="border-secondary/25 focus:border-secondary mt-3 w-full rounded-full border bg-transparent px-6 py-3 outline-none"
        />
        <p className="mt-2 text-sm opacity-60">
          Basta il numero: il simbolo dell’euro lo mette da sé. Per un prezzo che non è un numero —
          «s.q.», «16,00 – 24,00» — scrivilo come vuoi che si legga.
        </p>
      </div>

      <fieldset className="border-secondary/15 rounded-[1.5rem] border p-6">
        <legend className="nav-link px-2 opacity-60">Come si legge nelle altre lingue</legend>
        <p className="leading-relaxed opacity-60">
          {traduzioneAttiva
            ? 'Il menù di sala è su tre lingue e buona parte dei tavoli legge il tedesco o l’inglese. Lasciali vuoti e li propone la traduzione automatica, dal nome e dagli ingredienti: la proposta si rilegge e si corregge dalla matita, qui sotto nel menù.'
            : 'Il menù di sala è su tre lingue e buona parte dei tavoli legge il tedesco o l’inglese. Facoltativi: se li lasci vuoti il piatto esce solo in italiano, come già succede per metà del menù stampato. Meglio niente che una traduzione inventata.'}
        </p>

        <div className="mt-6">
          <label htmlFor="de" className="nav-link opacity-60">
            Tedesco
          </label>
          <input
            id="de"
            name="de"
            className="border-secondary/25 focus:border-secondary mt-3 w-full rounded-full border bg-transparent px-6 py-3 outline-none"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="en" className="nav-link opacity-60">
            Inglese
          </label>
          <input
            id="en"
            name="en"
            className="border-secondary/25 focus:border-secondary mt-3 w-full rounded-full border bg-transparent px-6 py-3 outline-none"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="foto" className="nav-link opacity-60">
          Fotografia
        </label>
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/*"
          className="border-secondary/25 mt-3 w-full rounded-full border bg-transparent px-6 py-3 file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-primary"
        />
        <p className="mt-2 text-sm opacity-60">
          Facoltativa. Viene rimpicciolita da sola prima di partire, quindi anche uno scatto del telefono va bene.
        </p>
      </div>

      {esito.errore ? <p className="text-sm text-red-700">{esito.errore}</p> : null}
      {esito.fatto ? <p className="text-accent-gold text-sm">{esito.fatto}</p> : null}

      <button
        type="submit"
        disabled={inCorso}
        className="bg-secondary text-primary self-start rounded-full px-8 py-3 disabled:opacity-50"
      >
        {inCorso ? 'Salvo…' : 'Aggiungi al menù'}
      </button>
    </form>
  )
}
