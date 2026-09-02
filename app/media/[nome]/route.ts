import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Serve le fotografie caricate dal pannello **in sviluppo**.
 *
 * In produzione non passa di qui: su Vercel le fotografie stanno su Blob e
 * hanno un indirizzo loro. Questa rotta esiste perche' in locale i file scritti
 * dentro `public/` dopo l'avvio **non vengono serviti**: `next start` fa
 * l'elenco dei file statici una volta sola, e una fotografia appena caricata
 * restituiva 404 finche' non si riavviava il server. Leggendola qui, si vede
 * subito.
 *
 * Il nome viene ripulito prima di toccare il disco: senza, un nome con `..`
 * dentro farebbe leggere file fuori dalla cartella.
 */

const CARTELLA = path.join(process.cwd(), '.dati', 'foto')

const TIPI: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
}

export async function GET(_richiesta: Request, { params }: { params: Promise<{ nome: string }> }) {
  const { nome } = await params
  const pulito = path.basename(nome).replace(/[^a-zA-Z0-9._-]/g, '')
  const estensione = pulito.split('.').pop()?.toLowerCase() ?? ''
  if (!pulito || !TIPI[estensione]) return new Response('Non trovata', { status: 404 })

  try {
    const dati = await fs.readFile(path.join(CARTELLA, pulito))
    return new Response(new Uint8Array(dati), {
      headers: {
        'Content-Type': TIPI[estensione],
        // I nomi contengono un istante e un pezzo casuale: lo stesso indirizzo
        // non cambia mai contenuto, quindi si puo' tenere a lungo.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Non trovata', { status: 404 })
  }
}
