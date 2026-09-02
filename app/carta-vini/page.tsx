import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/layout/PageHero'
import MenuScaffold from '@/components/sections/MenuScaffold'
import Button from '@/components/ui/Button'
import { wineSections } from '@/lib/menu'
import { pageHeroes } from '@/lib/images'
import { menuCta } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Carta dei vini',
  description:
    'Carta dei vini del ristorante da Nunzio a Malcesine: vini al calice, spumanti, Champagne, bianchi, rosati e rossi, con le uve e i prezzi.',
  path: '/carta-vini',
})

/**
 * La carta dei vini, su una pagina propria.
 *
 * Ha preso il posto della carta delle bevande (01/09/2026), all'indirizzo
 * `/carta-vini`: lasciarla su `/carta-bevande` avrebbe dato un indirizzo che
 * dice una cosa e una pagina che ne mostra un'altra. La sitemap si genera dalle
 * voci di navigazione, quindi si e' aggiornata da sola.
 *
 * Le bevande non sono state buttate: `drinkSections` resta in `lib/menu.ts`, e
 * per rimetterle online basta una pagina come questa.
 */
export default function CartaViniPage() {
  return (
    <>
      <PageHero
        kicker="Ristorante a Malcesine"
        title="Carta dei vini"
        intro="Vini al calice, spumanti e Champagne, bianchi, rosati e rossi: del territorio e non solo."
        image={pageHeroes.cartaVini}
      >
        <Button href={menuCta.href} variant="gold">
          {menuCta.label}
        </Button>
      </PageHero>

      <MenuScaffold sections={wineSections} />
    </>
  )
}
