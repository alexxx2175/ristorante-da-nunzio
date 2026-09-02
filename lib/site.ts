/**
 * Sorgente unica dei dati del locale e della navigazione.
 * Modifica qui e si aggiornano header, menu mobile, footer, pagina contatti,
 * metadata SEO e dati strutturati JSON-LD.
 */

export const siteConfig = {
  name: 'Ristorante da Nunzio',
  shortName: 'da Nunzio',
  claim: 'Se mi conosci ti innamori',
  /** Usato nei metadata: cambialo quando il dominio definitivo e' attivo. */
  url: 'https://www.ristorantedanunzio.it',
  location: 'Malcesine, Lago di Garda',
  address: {
    street: 'Vicolo Casella 10',
    postalCode: '37018',
    city: 'Malcesine',
    province: 'VR',
    country: 'IT',
  },
  phone: '+39 338 9019697',
  /** Stesso numero in formato tel: (senza spazi). */
  phoneHref: 'tel:+393389019697',
  /* Stesso numero del telefono, nel formato che vuole wa.me: solo cifre, con
     il prefisso internazionale e senza il piu'. Se un giorno il locale usa un
     numero diverso per WhatsApp, e' qui che si separa. */
  whatsappHref: 'https://wa.me/393389019697',
  email: 'ristorantedanunzio@gmail.com',
  vatId: '01203090228',
  /**
   * Orari di apertura. NOTA: il brief indica le due fasce senza specificare
   * il giorno di chiusura, quindi qui sono trattate come giornaliere.
   * Se esiste un giorno di riposo va aggiunto in `openingHours`.
   */
  hours: {
    lunch: { from: '11:30', to: '14:30' },
    dinner: { from: '18:30', to: '23:30' },
  },
  /** Profili social: inserisci gli URL reali quando disponibili. */
  social: [
    { label: 'Facebook', href: '[LINK-FACEBOOK]' },
    { label: 'Instagram', href: '[LINK-INSTAGRAM]' },
    { label: 'TripAdvisor', href: '[LINK-TRIPADVISOR]' },
  ],
} as const

/** Indirizzo su una riga, per footer e box contatti. */
export const addressLine = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city} (${siteConfig.address.province})`

/** Orari su una riga. */
export const hoursLine = `${siteConfig.hours.lunch.from}–${siteConfig.hours.lunch.to} e ${siteConfig.hours.dinner.from}–${siteConfig.hours.dinner.to}`

/** CTA ricorrente: unico punto in cui cambiare destinazione e testo. */
/**
 * Il richiamo che ricorre nel sito.
 *
 * Ha preso il posto di quello alla prenotazione (01/09/2026): dal sito si manda
 * al menu, non al telefono. `reservationCta` resta perche' il numero e
 * l'indirizzo servono comunque — e per rimettere il bottone dove dovesse
 * servire.
 */
export const menuCta = {
  label: 'View the menu',
  href: '/menu-ristorante',
}

export const reservationCta = {
  label: 'Prenota il tuo tavolo',
  href: '/contact#prenota',
} as const

export type NavItem = { label: string; href: string; external?: boolean }

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Menù', href: '/menu-ristorante' },
  { label: 'Vini', href: '/carta-vini' },
  { label: 'Contact', href: '/contact' },
]
