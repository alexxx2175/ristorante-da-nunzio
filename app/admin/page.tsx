import ModuloAccesso from '@/components/admin/ModuloAccesso'
import ModuloPiatto from '@/components/admin/ModuloPiatto'
import SezioneMenu from '@/components/admin/SezioneMenu'
import type { Riga } from '@/components/admin/SezioneMenu'
import { autenticato, passwordConfigurata } from '@/lib/admin-auth'
import { leggiDeposito } from '@/lib/piatti-store'
import { traduzioneConfigurata } from '@/lib/traduci'
import { componiMenu } from '@/lib/menu-composto'
import { esci } from './actions'

export const metadata = {
  title: 'Gestione menù',
  // Fuori dai motori di ricerca. Non e' nella sitemap — che si genera dalle
  // voci di navigazione — ma un'indicazione esplicita costa una riga.
  robots: { index: false, follow: false },
}

/**
 * Il pannello per gestire il menù.
 *
 * Una pagina sola: se non si e' entrati mostra la password, altrimenti il
 * modulo per aggiungere e il menù intero, sezione per sezione. Niente rotte
 * separate da proteggere una per una — e le azioni controllano l'accesso per
 * conto loro, perche' chi conosce il loro indirizzo puo' chiamarle senza
 * passare di qui.
 *
 * **I piatti sono tutti nello stesso elenco**, quelli del menù stampato e
 * quelli aggiunti da qui: sono la stessa carta, e tenerli in due riquadri
 * diversi voleva dire che riordinarli non aveva senso: l'ordine e' uno solo.
 *
 * `force-dynamic` perche' la pagina dipende da un biscotto e da un elenco che
 * cambia: pregenerata mostrerebbe a tutti lo stesso stato, compreso quello di
 * chi era entrato.
 */
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const configurato = passwordConfigurata()
  const dentro = configurato && (await autenticato())
  const sezioni = dentro ? componiMenu(await leggiDeposito()) : []
  const traduce = traduzioneConfigurata()

  return (
    <section className="texture-marble-light section-y w-full">
      <div className="container-gutter mx-auto max-w-2xl">
        <h1 className="nav-link text-accent-gold">Gestione menù</h1>
        <p className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
          {dentro ? 'Aggiungi un piatto' : 'Area riservata'}
        </p>

        {!configurato ? (
          <p className="mt-8 leading-relaxed opacity-70">
            Il pannello non è ancora configurato: manca la variabile{' '}
            <code className="font-mono">ADMIN_PASSWORD</code>. Finché non c’è, da qui non si entra.
          </p>
        ) : !dentro ? (
          <div className="mt-10">
            <ModuloAccesso />
          </div>
        ) : (
          <>
            <div className="mt-10">
              <ModuloPiatto traduzioneAttiva={traduce} />
            </div>

            <div className="border-secondary/15 mt-16 border-t pt-10">
              <h2 className="nav-link opacity-60">Il menù</h2>
              <ul className="mt-4 flex flex-col gap-1.5 leading-relaxed opacity-70">
                <li>
                  <span aria-hidden>☰</span> Trascina la righetta per cambiare l’ordine dei piatti.
                </li>
                <li>
                  <span aria-hidden>◉</span> L’occhio toglie il piatto dal sito senza perderlo: si
                  riaccende quando torna in carta.
                </li>
                <li>
                  <span aria-hidden>✎</span> La matita cambia nome, ingredienti, prezzo, traduzioni
                  e fotografia — e sposta il piatto fra antipasti, primi, secondi e contorni.
                </li>
                <li>
                  <span aria-hidden>🗑</span> Il cestino lo toglie per sempre, dopo una conferma.
                </li>
              </ul>

              <div className="mt-10 flex flex-col gap-12">
                {sezioni.map((sezione) => (
                  <SezioneMenu
                    key={sezione.title}
                    sezione={sezione.title}
                    traduzioneAttiva={traduce}
                    righe={sezione.voci.map(
                      (v): Riga => ({
                        chiave: v.chiave,
                        nome: v.voce.name,
                        ingredienti: v.voce.description ?? '',
                        prezzo: v.voce.price ?? '',
                        de: v.voce.de ?? '',
                        en: v.voce.en ?? '',
                        sezione: sezione.title,
                        ...(v.voce.photo ? { foto: v.voce.photo.src } : {}),
                        aggiunto: v.aggiunto,
                        spento: v.spento,
                      })
                    )}
                  />
                ))}
              </div>
            </div>

            <form action={esci} className="mt-16">
              <button type="submit" className="underline underline-offset-4 opacity-60">
                Esci
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
