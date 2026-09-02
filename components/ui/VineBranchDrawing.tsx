/* NON IN USO. Il disegno a tratto della vite, sostituito da una fotografia
   (vedi VineBranch.tsx). Tenuto perche' il progetto non e' sotto controllo di
   versione e questo SVG e' disegnato a mano: per tornare al tratto basta
   reimportare questo componente al posto di VineBranch. */
type VineBranchProps = {
  className?: string
  /** Ribalta il ramo in orizzontale, per usarlo sul lato opposto. */
  flip?: boolean
  /** Spessore del tratto: alzalo se il ramo e' molto piccolo. */
  strokeWidth?: number
}

/*
 * Foglia di vite, disegnata in un riquadro 100x100 con l'attacco del picciolo
 * in (50,88) e la punta in (50,6).
 *
 * Quello che la rende riconoscibile come vite e non come una foglia qualsiasi:
 * la base cordata (i due lobi bassi scendono ai lati dell'attacco, formando la
 * V), i cinque lobi separati da seni profondi, e le nervature palmate che
 * partono tutte dallo stesso punto. Togliendo uno dei tre diventa una foglia
 * generica.
 *
 * E' solo la meta' sinistra: la destra e' la stessa specchiata, cosi' la sagoma
 * resta simmetrica e c'e' un unico path da correggere.
 */
const LEAF_HALF =
  'M50,88 C44,89 38,88 32,84 C20,79 9,73 10,63 C11,57 21,56 27,52 C18,48 6,42 7,32 C8,25 21,24 27,27 C27,19 33,10 43,6 C46,5 48,5 50,6'

/*
 * Nervature palmate: tutte dal picciolo verso i lobi, e tenute corte di
 * proposito perche' non sbordino oltre il contorno.
 */
const LEAF_VEINS =
  'M50,88 L50,16 M50,88 L18,62 M50,88 L82,62 M50,88 L17,36 M50,88 L83,36'

/** Foglia intera, con l'attacco del picciolo nell'origine del gruppo. */
function Leaf({ x, y, rotate, scale }: { x: number; y: number; rotate: number; scale: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale}) translate(-50,-88)`}>
      <path d={LEAF_HALF} />
      <path d={LEAF_HALF} transform="translate(100,0) scale(-1,1)" />
      <path d={LEAF_VEINS} opacity="0.5" />
    </g>
  )
}

/** Grappolo: acini in file da 3, 2, 1. */
function Grapes({ x, y, scale }: { x: number; y: number; scale: number }) {
  const rows = [
    [-11, 0],
    [0, 0],
    [11, 0],
    [-5.5, 9.5],
    [5.5, 9.5],
    [0, 19],
  ]

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path d="M0,-14 L0,-6" />
      {rows.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.6" />
      ))}
    </g>
  )
}

/**
 * Ramo di vite: fusto, foglie, viticci e un grappolo, a tratto sottile.
 *
 * Non e' decorazione generica. La vite e' quella che copre la facciata del
 * locale, sotto cui stanno i tavoli nel vicolo: e' l'elemento che caratterizza
 * il posto piu' di qualunque altro e ricorre in tutte le foto dell'esterno.
 *
 * Il colore lo eredita da `currentColor`: basta mettere `text-accent-gold` (o
 * altro) sul contenitore per cambiarlo, senza toccare l'SVG.
 */
export default function VineBranchDrawing({
  className = '',
  flip = false,
  strokeWidth = 2.2,
}: VineBranchProps) {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {/* fusto */}
      <path d="M4,18 C58,10 94,46 140,40 C186,34 212,68 260,58 C286,52 304,62 316,70" />

      {/* foglie appese sotto il fusto, con inclinazioni diverse */}
      <Leaf x={54} y={20} rotate={158} scale={0.46} />
      <Leaf x={146} y={41} rotate={196} scale={0.6} />
      <Leaf x={252} y={58} rotate={172} scale={0.42} />

      {/* grappolo */}
      <Grapes x={196} y={62} scale={0.62} />

      {/* viticci */}
      <path d="M100,36 C110,48 105,60 96,58 C88,56 88,46 95,45" opacity="0.85" />
      <path d="M288,62 C298,72 294,84 285,82 C278,80 279,71 285,70" opacity="0.85" />
    </svg>
  )
}
