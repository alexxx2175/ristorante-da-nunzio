import { allergenNotice } from '@/lib/menu'
import { ALLERGENI } from '@/lib/piatti'
import type { VoceAllergene } from '@/lib/piatti'

const LANGS = [
  { lang: 'it', ...allergenNotice.it },
  { lang: 'de', ...allergenNotice.de },
  { lang: 'en', ...allergenNotice.en },
] as const

/**
 * Avviso allergeni, obbligatorio per il Reg. UE 1169/2011.
 *
 * In tre lingue e con lo stesso peso per tutte e tre: non e' un dettaglio di
 * cortesia come le traduzioni dei piatti, e chi lo cerca dev'essere in grado
 * di leggerlo nella propria lingua.
 *
 * Prima dell'avviso c'e' la **legenda dei numeri** che il menu stampa sotto a
 * ogni piatto: un numero per allergene, con il nome nelle tre lingue sulla
 * stessa riga, cosi' chi cerca il 7 lo trova senza sapere dove guardare.
 */
export default function AllergenNotice({ allergeni = ALLERGENI }: { allergeni?: VoceAllergene[] }) {
  return (
    /* Il respiro sotto e' quello standard delle sezioni, non uno suo: il
       ritratto in fondo alla pagina si appoggia a quella misura per finire
       all'altezza dell'ultima riga, e ventiquattro pixel in piu' qui lo
       facevano scendere sotto al testo solo su questa pagina. */
    <section className="w-full pb-10 lg:pb-18">
      <div className="container-gutter mx-auto max-w-4xl">
        <div className="border-secondary/15 flex flex-col gap-8 border-t pt-10">
          <div>
            <h2 className="nav-link opacity-70">Allergeni · Allergene · Allergens</h2>
            <ol className="mt-4 grid gap-x-8 gap-y-2 text-[0.8125rem] leading-snug sm:grid-cols-2">
              {allergeni.map((a) => (
                <li key={a.chiave} className="flex gap-3">
                  <span className="w-5 shrink-0 text-right font-serif opacity-80">{a.numero}</span>
                  {/* Quelli aggiunti dal pannello hanno un nome solo. */}
                  <span className="opacity-60">
                    {a.it}
                    {a.de ? <> · <span lang="de">{a.de}</span></> : null}
                    {a.en ? <> · <span lang="en">{a.en}</span></> : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {LANGS.map(({ lang, title, text }) => (
            <div key={lang} lang={lang}>
              <h2 className="nav-link opacity-70">{title}</h2>
              <p className="mt-3 text-[0.8125rem] leading-relaxed opacity-60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
