import type { Metadata } from 'next'
import { Bodoni_Moda, Montserrat } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MarchioFondo from '@/components/ui/MarchioFondo'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { restaurantJsonLd } from '@/lib/seo'
import { siteConfig } from '@/lib/site'
import './globals.css'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-bodoni',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Ristorante a Malcesine, sul Lago di Garda`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    'Ristorante a Malcesine, sul Lago di Garda. La cucina dello chef Nunzio nel centro storico, tra il Porto Vecchio e Piazza Statuto. Prenota il tuo tavolo.',
  keywords: [
    'ristorante Malcesine',
    'miglior ristorante Malcesine',
    'cena romantica lago di Garda',
    'ristorante lago di Garda',
    'dove mangiare a Malcesine',
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  robots: { index: true, follow: true },
}

/**
 * Layout globale: font, smooth scroll, header e footer condivisi da tutte le
 * pagine, piu' i dati strutturati del locale (una sola volta per sito).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bodoni.variable} ${montserrat.variable}`}>
      <body>
        {/* Il marmo di sfondo, dietro a tutto. Vedi `.marble-backdrop`. */}
        <div aria-hidden className="marble-backdrop" />

        <SmoothScroll />
        <Header />
        <main>{children}</main>

        {/* Sta fuori da `main` e prima del piede: e' la chiusa della pagina,
            non un suo contenuto, e ogni pagina finisce cosi'. */}
        <MarchioFondo />
        <Footer />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
      </body>
    </html>
  )
}
