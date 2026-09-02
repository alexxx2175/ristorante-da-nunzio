import { allergenNotice } from '@/lib/menu'

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
 */
export default function AllergenNotice() {
  return (
    /* Il respiro sotto e' quello standard delle sezioni, non uno suo: il
       ritratto in fondo alla pagina si appoggia a quella misura per finire
       all'altezza dell'ultima riga, e ventiquattro pixel in piu' qui lo
       facevano scendere sotto al testo solo su questa pagina. */
    <section className="w-full pb-10 lg:pb-18">
      <div className="container-gutter mx-auto max-w-4xl">
        <div className="border-secondary/15 flex flex-col gap-8 border-t pt-10">
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
