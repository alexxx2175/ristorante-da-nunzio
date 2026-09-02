/**
 * Rimpicciolisce una fotografia **prima** di mandarla al server.
 *
 * Le Server Action accettano un corpo di 1 MB, e su Vercel il tetto della
 * piattaforma e' 4.5 MB: una foto scattata col telefono li supera senza
 * problemi, e l'invio falliva con un errore che parla di limiti e non di
 * fotografie. Ridurla qui risolve il problema alla radice e non solo lo sposta
 * piu' in la': parte meno roba, si aspetta meno, e per un piatto in un menu non
 * serve niente di piu' di questo.
 *
 * Milleseicento pixel sul lato lungo bastano: la fotografia piu' grande che il
 * sito mostra e' quella nella fascia bianca del menu, e sta sotto i 600.
 */

const LATO_MASSIMO = 1600
const QUALITA = 0.85

export async function riduciImmagine(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  // Le immagini che il browser non sa disegnare (HEIC di certi telefoni) non si
  // possono ridurre: si mandano com'e' e sara' il server a dire di no. Meglio
  // un messaggio chiaro dal server che un errore qui.
  let sorgente: ImageBitmap
  try {
    sorgente = await createImageBitmap(file)
  } catch {
    return file
  }

  const scala = Math.min(1, LATO_MASSIMO / Math.max(sorgente.width, sorgente.height))
  const larghezza = Math.round(sorgente.width * scala)
  const altezza = Math.round(sorgente.height * scala)

  const tela = document.createElement('canvas')
  tela.width = larghezza
  tela.height = altezza
  const contesto = tela.getContext('2d')
  if (!contesto) return file
  contesto.imageSmoothingQuality = 'high'
  contesto.drawImage(sorgente, 0, 0, larghezza, altezza)
  sorgente.close()

  const pezzo = await new Promise<Blob | null>((risolvi) =>
    tela.toBlob(risolvi, 'image/jpeg', QUALITA)
  )
  if (!pezzo) return file

  // Se il giro non ha guadagnato niente, si tiene l'originale: capita con
  // immagini gia' piccole, dove il JPEG rifatto pesa piu' del PNG di partenza.
  if (pezzo.size >= file.size) return file

  const nome = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([pezzo], nome, { type: 'image/jpeg' })
}
