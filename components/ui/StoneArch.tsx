/* NON IN USO. Prima prova dell'arco di pietra, scartata il 30/08/2026:
   il piatto disegnato non convinceva. Le fotografie le fa il locale, e
   l'idea e' animarle. Tenuto perche' il progetto non e' sotto controllo
   di versione — l'arco in se' potrebbe tornare utile come cornice. */
type StoneArchProps = {
  className?: string
}

/** Quanti conci compongono la ghiera dell'arco. Dispari: cosi' uno cade in cima
 *  ed e' la chiave di volta. */
const CONCI = 11

const CX = 200
const SPRING = 300 // linea d'imposta: dove l'arco smette di essere piedritto
const R_INT = 88 // raggio dell'intradosso (il vuoto)
const R_EST = 148 // raggio dell'estradosso (il fuori)
const BASE = 560

/** Un punto sulla circonferenza di raggio `r`, all'angolo `deg` (0 = destra). */
function punto(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180
  return [CX + r * Math.cos(rad), SPRING - r * Math.sin(rad)] as const
}

/**
 * Un arco a tutto sesto in pietra, disegnato a tratto.
 *
 * E' la forma che ricorre nel locale — l'ingresso, la saletta interna, l'angolo
 * delle bottiglie — e che la gallery gia' cita con la tessera `shape-arch`.
 * Qui e' disegnata invece che fotografata, cosi' regge il fondo chiaro senza
 * portarsi dietro il rumore di uno scatto.
 *
 * La pietra si legge dai **giunti**, non da una texture: le linee radiali fra i
 * conci della ghiera e i filari orizzontali dei piedritti. Una texture piena
 * litigherebbe col marmo che sta gia' dietro.
 *
 * Il vuoto dell'arco e' lasciato trasparente: quello che ci va dentro sta in un
 * altro livello, sopra. Serve a poterlo cambiare senza toccare il disegno.
 */
export default function StoneArch({ className = '' }: StoneArchProps) {
  const conci = Array.from({ length: CONCI + 1 }, (_, i) => 180 - (180 / CONCI) * i)

  return (
    <svg
      viewBox={`0 0 400 ${BASE}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {/* Sagoma: due piedritti e la ghiera che li scavalca, con il vuoto in
          mezzo. Un solo tracciato, cosi' il contorno resta continuo. */}
      <path
        d={`M${CX - R_EST},${BASE} L${CX - R_EST},${SPRING}
            A${R_EST},${R_EST} 0 0 1 ${CX + R_EST},${SPRING} L${CX + R_EST},${BASE}
            L${CX + R_INT},${BASE} L${CX + R_INT},${SPRING}
            A${R_INT},${R_INT} 0 0 0 ${CX - R_INT},${SPRING} L${CX - R_INT},${BASE} Z`}
      />

      {/* Giunti fra i conci: raggi dall'intradosso all'estradosso. */}
      {conci.map((deg) => {
        const [x1, y1] = punto(deg, R_INT)
        const [x2, y2] = punto(deg, R_EST)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />
      })}

      {/* Chiave di volta: il concio in cima, ribadito con un filo piu' marcato
          perche' e' il pezzo che tiene su tutto. */}
      <path
        d={(() => {
          const mezzo = 180 / CONCI / 2
          const [ax, ay] = punto(90 + mezzo, R_INT)
          const [bx, by] = punto(90 + mezzo, R_EST)
          const [cx2, cy2] = punto(90 - mezzo, R_EST)
          const [dx, dy] = punto(90 - mezzo, R_INT)
          return `M${ax},${ay} L${bx},${by} A${R_EST},${R_EST} 0 0 1 ${cx2},${cy2} L${dx},${dy} A${R_INT},${R_INT} 0 0 0 ${ax},${ay} Z`
        })()}
        strokeWidth={2}
      />

      {/* Filari dei piedritti, sfalsati fra destra e sinistra come in una
          muratura vera. */}
      {[352, 404, 456, 508].map((y, i) => (
        <g key={y}>
          <line x1={CX - R_EST} y1={y} x2={CX - R_INT} y2={y} />
          <line x1={CX + R_INT} y1={y + (i % 2 ? 0 : 26)} x2={CX + R_EST} y2={y + (i % 2 ? 0 : 26)} />
        </g>
      ))}

      {/* Qualche giunto verticale, per non far leggere i filari come strisce. */}
      <line x1={CX - 118} y1={352} x2={CX - 118} y2={404} />
      <line x1={CX - 118} y1={456} x2={CX - 118} y2={508} />
      <line x1={CX + 118} y1={378} x2={CX + 118} y2={404} />
      <line x1={CX + 118} y1={456} x2={CX + 118} y2={534} />
    </svg>
  )
}
