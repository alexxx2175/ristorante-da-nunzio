import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    /* Il pannello manda le fotografie attraverso una Server Action, e il corpo
       predefinito e' 1 MB: bastava uno scatto del telefono per superarlo. Il
       modulo le rimpicciolisce gia' nel browser, questo e' il margine di
       sicurezza. Oltre i 4.5 MB non si va comunque: e' il tetto di Vercel. */
    serverActions: { bodySizeLimit: '4mb' },
  },
  images: {
    // I placeholder sono locali (/public/images). Aggiungi qui i domini remoti
    // quando sostituirai i placeholder con immagini reali (CDN, WordPress, ecc.).
    remotePatterns: [
      /* Le fotografie caricate dal pannello vivono su Vercel Blob, che serve da
         un sottodominio diverso per ogni deposito: senza questo `next/image`
         le rifiuta. */
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig
