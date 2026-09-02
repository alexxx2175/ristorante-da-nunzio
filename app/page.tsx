import { pageMetadata } from '@/lib/seo'
import Hero from '@/components/sections/Hero'
import MissionStatement from '@/components/sections/MissionStatement'
import ChefNunzio from '@/components/sections/ChefNunzio'
import LakeSection from '@/components/sections/LakeSection'
import SeasonalProposals from '@/components/sections/SeasonalProposals'
import ForkArch from '@/components/sections/ForkArch'
import Gallery from '@/components/sections/Gallery'

export const metadata = pageMetadata({
  title: 'Ristorante a Malcesine, sul Lago di Garda',
  description:
    'Ristorante da Nunzio, nel centro storico di Malcesine: ingredienti freschi e tradizione italiana da Nord a Sud, a due passi dal Lago di Garda. Prenota il tuo tavolo.',
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionStatement />
      <ChefNunzio />
      <LakeSection />
      <SeasonalProposals />

      <ForkArch />
      {/* Unica sezione della home a non essere alta una schermata: dopo sei
          schermate piene, l'ultima respira. */}
      <Gallery title="Uno sguardo al locale" claim="A tavola nel cuore di Malcesine" />
    </>
  )
}
