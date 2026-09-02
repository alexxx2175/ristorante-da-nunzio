type ArchLinesProps = {
  className?: string
  /** Ritardo, in secondi, prima che il primo arco cominci a disegnarsi. */
  delay?: number
}

/**
 * I sei archi concentrici, dal file fornito dal locale.
 *
 * I tracciati sono quelli originali; qui cambiano solo tratto e colore — il
 * file arrivava con un rosso scuro spesso 7, che su un fondo chiaro urlava.
 *
 * L'ordine dei path nel file **non e' dal piu' grande al piu' piccolo**: sono
 * mescolati. `ORDINE` li rimette in fila dal piu' esterno al piu' interno, cosi'
 * il disegno progressivo va verso il centro invece che a caso.
 *
 * L'animazione e' `stroke-dasharray`: ogni arco parte con il tratteggio lungo
 * quanto se stesso e lo scopre da un capo. La lunghezza reale di ogni tracciato
 * la misura il browser (`pathLength={1}` normalizza tutto a 1), cosi' non serve
 * calcolarla a mano ne' aggiornarla se i tracciati cambiano.
 */

/** Dal piu' esterno al piu' interno. */
const ARCHI = [
  'M3.5,1904.49V415.35C7.29,192.65,185.22,12.16,399.06,3.8c225.5-8.81,423.81,176.4,428.17,411.55v1489.14',
  'M36.32,1900.3l.42-1486.54C40.22,208.92,203.89,42.9,400.58,35.21c207.42-8.11,389.83,162.26,393.83,378.55l-.42,1486.54',
  'M69.71,1897.71l-.7-1485.08c3.18-187.08,152.66-338.71,332.31-345.74,189.44-7.41,356.04,148.2,359.7,345.74l.7,1485.08',
  'M102.13,1890.26V417.71c2.88-169.37,138.2-306.64,300.84-312.99,171.5-6.7,322.32,134.16,325.64,312.99v1472.55',
  'M134.98,1885.3V412.31c2.58-151.6,123.71-274.48,269.29-280.17,153.51-6,288.52,120.09,291.48,280.17v1472.99',
  'M168.12,1883.23V411.8c2.27-133.68,109.09-242.03,237.45-247.05,135.37-5.29,254.41,105.89,257.03,247.05v1471.43',
]

export default function ArchLines({ className = '', delay = 0 }: ArchLinesProps) {
  return (
    <svg
      viewBox="0 0 830.73 1904.49"
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
      className={className}
    >
      {ARCHI.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={2.6}
          strokeMiterlimit={10}
          className="arco-linea"
          style={{ animationDelay: `${delay + i * 0.18}s` }}
        />
      ))}
    </svg>
  )
}
