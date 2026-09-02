import Image from 'next/image'

type VineBranchProps = {
  className?: string
  /** Ribalta il ramo in orizzontale, per usarlo sul lato opposto. */
  flip?: boolean
  /** Larghezza resa, per far scegliere a next/image la variante giusta. */
  sizes?: string
}

/**
 * Il ramo di vite che ricorre su ogni pagina: e' il segno del locale, la vite
 * che copre davvero la facciata e sotto cui stanno i tavoli nel vicolo.
 *
 * **Era un disegno a tratto in SVG** (`VineBranchDrawing.tsx`, tenuto da parte
 * e non piu' importato da nessuno). Adesso e' una fotografia su fondo
 * trasparente, e la differenza che conta per chi lo usa e' una:
 *
 *   il ramo NON eredita piu' il colore dal contenitore.
 *
 * Prima bastava `text-accent-gold` sul wrapper per farlo oro, perche' l'SVG
 * disegnava con `currentColor`. Su una fotografia quelle classi non hanno piu'
 * effetto: il verde e' quello dello scatto. L'unica leva rimasta e' l'opacita'
 * del contenitore, che e' come il ramo si tiene sullo sfondo senza contendere
 * la scena al testo.
 *
 * Cambia anche la proporzione: il disegno era 320x180 (16:9), la foto e' 3:2.
 * A parita' di larghezza il ramo e' quindi piu' alto di prima.
 */
export default function VineBranch({
  className = '',
  flip = false,
  sizes = '(min-width: 1024px) 544px, 85vw',
}: VineBranchProps) {
  return (
    <Image
      src="/images/ramo-vite.png"
      /* Decorativo: l'alt vuoto e' una scelta, come per le altre foto di
         contorno. I contenitori sono gia' aria-hidden. */
      alt=""
      width={1800}
      height={1200}
      sizes={sizes}
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    />
  )
}
