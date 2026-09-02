import type { Metadata } from 'next'
import { addressLine, siteConfig } from './site'

/**
 * Costruisce i metadata di una pagina con titolo, description, canonical e
 * Open Graph coerenti. Il titolo passato viene completato dal template
 * definito in app/layout.tsx.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = `${siteConfig.url}${path}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'it_IT',
      type: 'website',
    },
  }
}

/**
 * Dati strutturati schema.org per il locale (rich result "Restaurant").
 * Volutamente senza `geo` e `priceRange`: si aggiungono quando si hanno le
 * coordinate esatte e la fascia di prezzo reale, per non pubblicare dati inventati.
 */
export function restaurantJsonLd() {
  const { name, url, phone, email, vatId, address, hours } = siteConfig

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name,
    description: `Ristorante nel centro storico di Malcesine, sul Lago di Garda, tra il Porto Vecchio e Piazza Statuto. Cucina italiana da Nord a Sud, con ingredienti freschi scelti ogni giorno.`,
    url,
    telephone: phone,
    email,
    vatID: vatId,
    servesCuisine: ['Italiana'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressRegion: address.province,
      addressCountry: address.country,
    },
    /* Due fasce giornaliere: pranzo e cena. */
    openingHoursSpecification: [hours.lunch, hours.dinner].map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: slot.from,
      closes: slot.to,
    })),
    areaServed: 'Malcesine, Lago di Garda',
    /* Ridondante rispetto a `address`, ma utile ai crawler che leggono il testo. */
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${name}, ${addressLine}`
    )}`,
  }
}
