'use client'

import Image from 'next/image'
import { useActionState, useRef, useState, useTransition } from 'react'
import ModuloModifica from '@/components/admin/ModuloModifica'
import { commutaVisibilita, rimuoviPiatto, salvaOrdine } from '@/app/admin/actions'
import { nessunEsito } from '@/app/admin/esito'

export type Riga = {
  chiave: string
  nome: string
  ingredienti: string
  prezzo: string
  de: string
  en: string
  foto?: string
  /** La sezione in cui sta adesso, per il modulo che lo puo' spostare. */
  sezione: string
  /** Nato dal pannello, non dal menu scritto a mano. */
  aggiunto: boolean
  spento: boolean
}

/**
 * Una sezione del menu nel pannello: i piatti in fila, con quello che si puo'
 * fare a ciascuno — spostarlo, spegnerlo, cambiarlo, toglierlo.
 *
 * **Si riordina trascinando la maniglia**, e l'ordine si salva al rilascio. Il
 * trascinamento e' fatto con gli eventi del puntatore e non con l'API di
 * trascinamento del browser: quella sugli schermi tattili non parte, e questo
 * pannello si usera' quasi sempre dal telefono.
 *
 * **Il contenuto delle righe viene sempre dal server**; di suo il componente
 * tiene solo l'ordine, e appena l'elenco delle chiavi cambia — un piatto
 * aggiunto, uno tolto — lo lascia perdere e riparte da quello che arriva.
 * Copiarsi tutta la riga nello stato voleva dire vedere il nome vecchio dopo
 * una modifica, e l'occhio fermo dopo averlo cliccato.
 */
export default function SezioneMenu({
  sezione,
  righe,
  traduzioneAttiva,
}: {
  sezione: string
  righe: Riga[]
  /** Se il pannello puo' proporre le traduzioni, cioe' se la chiave c'e'. */
  traduzioneAttiva: boolean
}) {
  const [ordineLocale, setOrdineLocale] = useState<string[] | null>(null)
  const [preso, setPreso] = useState<string | null>(null)
  const [inModifica, setInModifica] = useState<string | null>(null)
  const [, avvia] = useTransition()
  const listaRef = useRef<HTMLUListElement>(null)

  const perChiave = new Map(righe.map((r) => [r.chiave, r]))
  // L'ordine tenuto qui vale finche' parla degli stessi piatti che manda il
  // server: appena non combacia e' vecchio, e comanda il server.
  const valido =
    ordineLocale?.length === righe.length && ordineLocale.every((c) => perChiave.has(c))
  const chiavi = valido ? ordineLocale : righe.map((r) => r.chiave)

  const trascina = (e: React.PointerEvent, chiave: string) => {
    e.preventDefault()
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    setPreso(chiave)
  }

  const muovi = (e: React.PointerEvent) => {
    if (!preso || !listaRef.current) return
    const righeDom = Array.from(listaRef.current.children) as HTMLElement[]
    const sopra = righeDom.findIndex((el) => {
      const r = el.getBoundingClientRect()
      return e.clientY >= r.top && e.clientY <= r.bottom
    })
    const da = chiavi.indexOf(preso)
    if (sopra < 0 || da < 0 || da === sopra) return
    const copia = [...chiavi]
    copia.splice(sopra, 0, ...copia.splice(da, 1))
    setOrdineLocale(copia)
  }

  // Si salva al rilascio, non a ogni scatto: trascinando una riga in fondo a un
  // elenco lungo si passa sopra a tutte le altre, e sarebbero dieci scritture
  // per un movimento solo.
  const lascia = () => {
    if (!preso) return
    setPreso(null)
    const ordinate = [...chiavi]
    avvia(() => {
      void salvaOrdine(sezione, ordinate)
    })
  }

  return (
    <div>
      <h3 className="nav-link text-accent-gold">{sezione}</h3>

      <ul
        ref={listaRef}
        onPointerMove={muovi}
        onPointerUp={lascia}
        onPointerCancel={lascia}
        className="divide-secondary/10 mt-3 flex flex-col divide-y"
      >
        {chiavi.map((chiave) => {
          const riga = perChiave.get(chiave)
          if (!riga) return null
          return (
            <li key={chiave} className={`py-3 ${preso === chiave ? 'bg-secondary/5' : ''}`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <Maniglia nome={riga.nome} prendi={(e) => trascina(e, chiave)} />

                {riga.foto ? (
                  <div className="relative h-11 w-11 shrink-0">
                    <Image
                      src={riga.foto}
                      alt=""
                      fill
                      sizes="44px"
                      className={`rounded-full object-cover ${riga.spento ? 'opacity-40' : ''}`}
                    />
                  </div>
                ) : null}

                <div className={`min-w-0 flex-1 ${riga.spento ? 'opacity-40' : ''}`}>
                  <p className="font-serif text-lg leading-snug">
                    {riga.nome}
                    {riga.aggiunto ? (
                      <span className="text-accent-gold ml-2 align-middle text-xs">aggiunto</span>
                    ) : null}
                  </p>
                  {riga.prezzo ? <p className="mt-0.5 text-sm opacity-60">{riga.prezzo}</p> : null}
                </div>

                <Occhio chiave={chiave} spento={riga.spento} nome={riga.nome} />

                <Icona
                  etichetta={`Modifica ${riga.nome}`}
                  premuto={inModifica === chiave}
                  onClick={() => setInModifica(inModifica === chiave ? null : chiave)}
                >
                  <path
                    d="M11.6 1.9l2.5 2.5L5.4 13H2.9v-2.5L11.6 1.9z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </Icona>

                <Cestino chiave={chiave} nome={riga.nome} />
              </div>

              {inModifica === chiave ? (
                <div className="mt-4 mb-2">
                  <ModuloModifica
                    riga={riga}
                    chiudi={() => setInModifica(null)}
                    traduzioneAttiva={traduzioneAttiva}
                  />
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * La maniglia per trascinare.
 *
 * `touch-none` non e' un vezzo: senza, il dito che prende la riga fa scorrere
 * la pagina e la riga non si muove. Il margine attorno al disegno serve allo
 * stesso scopo: dodici pixel di righetta non si prendono con un dito.
 */
function Maniglia({
  nome,
  prendi,
}: {
  nome: string
  prendi: (e: React.PointerEvent) => void
}) {
  return (
    <button
      type="button"
      aria-label={`Sposta ${nome}`}
      onPointerDown={prendi}
      className="shrink-0 cursor-grab touch-none px-2 py-3 opacity-30 transition-opacity hover:opacity-70 active:cursor-grabbing"
    >
      <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
        <path
          d="M1 4h10M1 8h10M1 12h10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

/** Un bottone con dentro un disegno, per non riscrivere ogni volta le stesse classi. */
function Icona({
  etichetta,
  premuto,
  onClick,
  children,
  className = '',
}: {
  etichetta: string
  premuto?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={etichetta}
      {...(premuto === undefined ? {} : { 'aria-expanded': premuto })}
      onClick={onClick}
      className={`shrink-0 rounded-full p-2 transition-opacity ${premuto ? 'opacity-100' : 'opacity-45 hover:opacity-100'} ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        {children}
      </svg>
    </button>
  )
}

/**
 * L'occhio: aperto se il piatto e' in carta, chiuso se e' spento.
 *
 * Spegnere non cancella — il piatto resta qui e si riaccende quando torna in
 * stagione. E' la differenza fra "oggi non c'e'" e "non lo facciamo piu'".
 */
function Occhio({ chiave, spento, nome }: { chiave: string; spento: boolean; nome: string }) {
  const [, azione, inCorso] = useActionState(commutaVisibilita, nessunEsito)

  return (
    <form action={azione} className="shrink-0">
      <input type="hidden" name="chiave" value={chiave} />
      <button
        type="submit"
        disabled={inCorso}
        aria-label={spento ? `Rimetti ${nome} in carta` : `Togli ${nome} dalla carta`}
        aria-pressed={!spento}
        className={`rounded-full p-2 transition-opacity disabled:opacity-30 ${
          spento ? 'opacity-45 hover:opacity-100' : 'text-accent-gold'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
          {spento ? (
            <>
              <path
                d="M2.5 10s3.2-4.5 7.5-4.5c1.2 0 2.3.35 3.3.9M17.5 10s-3.2 4.5-7.5 4.5c-1.2 0-2.3-.35-3.3-.9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path d="M3.5 3.5l13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path
                d="M2.5 10S5.7 5.5 10 5.5 17.5 10 17.5 10 14.3 14.5 10 14.5 2.5 10 2.5 10z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.4" />
            </>
          )}
        </svg>
      </button>
    </form>
  )
}

/**
 * Il cestino, con una conferma.
 *
 * Toglie il piatto per sempre, e un clic solo su un'icona piccola e' troppo
 * poco per una cosa che non si annulla — tanto piu' col dito, dove il cestino
 * sta a un centimetro dall'occhio. Il primo clic chiede, il secondo fa.
 */
function Cestino({ chiave, nome }: { chiave: string; nome: string }) {
  const [chiede, setChiede] = useState(false)
  const [esito, azione, inCorso] = useActionState(rimuoviPiatto, nessunEsito)

  if (!chiede) {
    return (
      <Icona
        etichetta={`Elimina ${nome}`}
        onClick={() => setChiede(true)}
        className={esito.errore ? 'text-red-700 opacity-100' : ''}
      >
        <path
          d="M2.5 4h11M6 4V2.4h4V4M3.9 4l.7 9.6h6.8L12.1 4M6.4 6.4v5M9.6 6.4v5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icona>
    )
  }

  return (
    <form action={azione} className="flex shrink-0 items-center gap-3">
      <input type="hidden" name="chiave" value={chiave} />
      <button
        type="submit"
        disabled={inCorso}
        className="rounded-full bg-red-700 px-4 py-1.5 text-sm whitespace-nowrap text-white disabled:opacity-50"
      >
        {inCorso ? 'Tolgo…' : 'Elimina'}
      </button>
      <button
        type="button"
        onClick={() => setChiede(false)}
        className="text-sm underline underline-offset-4 opacity-60"
      >
        No
      </button>
    </form>
  )
}
