/* NON IN USO. Prima prova dell'arco di pietra, scartata il 30/08/2026:
   il piatto disegnato non convinceva. Le fotografie le fa il locale, e
   l'idea e' animarle. Tenuto perche' il progetto non e' sotto controllo
   di versione — l'arco in se' potrebbe tornare utile come cornice. */
type ForkDishProps = {
  className?: string
}

/** Centro in x delle quattro punte. */
const REBBI = [180, 193.3, 206.7, 220]

/**
 * Forchetta con un pacchero visto in sezione e una cozza appoggiata sopra.
 *
 * Disegnata, non fotografata: sta dentro un arco disegnato, e una foto
 * ritagliata li' dentro metterebbe due linguaggi nella stessa immagine.
 *
 * Coordinate uguali a `StoneArch` (viewBox 0 0 400 560), cosi' i due si
 * sovrappongono senza calcoli: il vuoto dell'arco va da x=112 a x=288 e ha il
 * colmo a y=212.
 *
 * L'ordine di disegno e' quello vero — forchetta, poi pasta che la copre, poi
 * cozza appoggiata sopra — cosi' i rebbi spariscono dietro il pacchero e la
 * cozza si siede sul suo bordo invece di galleggiarci sopra.
 */
export default function ForkDish({ className = '' }: ForkDishProps) {
  return (
    <svg viewBox="0 0 400 560" fill="none" aria-hidden className={className}>
      {/* --- Forchetta ------------------------------------------------------
          I rebbi **escono sopra** il pacchero: la pasta e' infilzata, e i quattro
          punti che spuntano sono l'unica cosa che fa leggere una forchetta.
          Nascondendoli del tutto restava una forma bianca sotto la pasta che
          sembrava una spatola. */}
      <g fill="#f4f1eb" stroke="#9a9287" strokeWidth={1.5} strokeLinejoin="round">
        {REBBI.map((x) => (
          <path
            key={x}
            d={`M${x - 2.8},252 C${x - 2.8},245 ${x + 2.8},245 ${x + 2.8},252 L${x + 2.8},372 L${x - 2.8},372 Z`}
          />
        ))}

        {/* Spalle: dal ventaglio dei rebbi al collo. */}
        <path
          d="M176,368 C176,392 182,404 190,414 L210,414 C218,404 224,392 224,368
             C216,376 208,379 200,379 C192,379 184,376 176,368 Z"
        />

        {/* Manico, appena rastremato verso il fondo. */}
        <path
          d="M192.5,412 L207.5,412 C209.5,448 210,492 207.5,532
             C205,540 195,540 192.5,532 C190,492 190.5,448 192.5,412 Z"
        />
      </g>

      {/* --- Pacchero, in sezione -------------------------------------------
          Il taglio del tubo: parete spessa e **buco vero**. Il foro e' scuro e
          ha un'ombra sull'arco superiore interno — senza, legge come un disco
          appoggiato invece che come un'apertura. */}
      <g>
        <ellipse cx="200" cy="330" rx="58" ry="52" fill="#e7c184" stroke="#bf9550" strokeWidth={1.8} />

        {/* Rigatura del pacchero: corre lungo il tubo, quindi in sezione si
            legge come tacche sul bordo esterno. */}
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2
          const x1 = 200 + Math.cos(a) * 58
          const y1 = 330 + Math.sin(a) * 52
          const x2 = 200 + Math.cos(a) * 50
          const y2 = 330 + Math.sin(a) * 45
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cfa869" strokeWidth={1} opacity={0.75} />
          )
        })}

        {/* Il foro. */}
        <ellipse cx="200" cy="331" rx="29" ry="26" fill="#8a6a38" stroke="#a8834a" strokeWidth={1.4} />
        {/* Ombra dentro il foro, sull'arco alto: e' quella che lo fa sfondare. */}
        <path
          d="M171,331 A29,26 0 0 1 229,331 A29,20 0 0 0 171,331 Z"
          fill="#6d5229"
          opacity={0.85}
        />
      </g>

      {/* --- Cozza, seduta sul bordo del pacchero ---------------------------
          Sta di lato e non in mezzo: al centro ci sono i rebbi, e coprirli
          avrebbe tolto proprio il dettaglio che fa capire l'oggetto. Il guscio
          scavalca di poco il bordo della pasta, ed e' quella sovrapposizione a
          farla appoggiare invece che fluttuare. */}
      <g>
        <path
          d="M206,300 C208,276 228,258 250,258 C266,258 274,268 270,279
             C264,294 232,308 214,305 C208,304 205,303 206,300 Z"
          fill="#2f3540"
          stroke="#1b1f27"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {[0.2, 0.4, 0.6, 0.8].map((t) => (
          <path
            key={t}
            d={`M208,302 Q${222 + 42 * t},${288 - 16 * t} ${236 + 34 * t},${276 + 18 * t}`}
            stroke="#4d5665"
            strokeWidth={0.85}
            fill="none"
            opacity={0.8}
          />
        ))}
        <path
          d="M216,303 C232,306 254,296 266,283 C258,297 232,311 216,303 Z"
          fill="#d98f4e"
          opacity={0.92}
        />
      </g>
    </svg>
  )
}
