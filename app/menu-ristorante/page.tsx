import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/layout/PageHero'
import MenuScaffold from '@/components/sections/MenuScaffold'
import TastingMenu from '@/components/sections/TastingMenu'
import AllergenNotice from '@/components/sections/AllergenNotice'
import { pageHeroes } from '@/lib/images'
import { reservationCta } from '@/lib/site'
import { leggiDeposito } from '@/lib/piatti-store'
import { componiMenu } from '@/lib/menu-composto'
import type { MenuSection } from '@/components/sections/MenuScaffold'

export const metadata = pageMetadata({
  title: 'Menù Ristorante',
  description:
    'Il menù del ristorante da Nunzio a Malcesine: antipasti, primi, secondi e contorni con i prezzi, piu’ il menu degustazione su prenotazione. Descrizioni in italiano, tedesco e inglese.',
  path: '/menu-ristorante',
})

/**
 * Le sezioni del menu, come le vede chi guarda il sito.
 *
 * Il menu scritto a mano resta la base — venticinque voci con traduzioni,
 * prezzi e allergeni — e sopra ci va quello che il pannello ha deciso:
 * `componiMenu` fa quel lavoro **una volta sola**, per il sito e per il
 * pannello insieme. Qui resta solo da buttare via i piatti spenti, che il
 * pannello invece deve continuare a vedere.
 *
 * Una sezione rimasta senza piatti non si stampa: un titolo con il vuoto sotto
 * sembra una pagina rotta.
 */
async function sezioniDaMostrare(): Promise<MenuSection[]> {
  return componiMenu(await leggiDeposito())
    .map((sezione) => ({
      title: sezione.title,
      ...(sezione.note ? { note: sezione.note } : {}),
      items: sezione.voci.filter((v) => !v.spento).map((v) => v.voce),
    }))
    .filter((sezione) => sezione.items.length > 0)
}

export default async function MenuRistorantePage() {
  const sezioni = await sezioniDaMostrare()

  return (
    <>
      <PageHero
        kicker="Ristorante a Malcesine"
        title="Menù Ristorante"
        intro="La nostra cucina attraversa l’Italia da Nord a Sud, con materie prime fresche e piatti che cambiano con le stagioni."
        image={pageHeroes.menuRistorante}
      />

      <TastingMenu />

      {/* In fondo si prenota: mandare al menu, da dentro il menu, sarebbe un
          giro a vuoto. Per la stessa ragione la testata non ha un bottone. */}
      <MenuScaffold sections={sezioni} cta={reservationCta} />

      <AllergenNotice />
    </>
  )
}
