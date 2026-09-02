/**
 * Livello decorativo: forme geometriche sottili in oro che fluttuano dietro al
 * contenuto e si spostano al movimento del mouse.
 *
 * Volutamente astratte — anelli, archi, punti — e non illustrazioni: di
 * illustrazioni del locale non ne esistono, e inventarne di figurative
 * (limoni, foglie, barche) vorrebbe dire aggiungere un immaginario che non e'
 * quello del ristorante. Anelli e archi riprendono invece forme gia' presenti
 * nel sito: le CTA circolari, la gallery a cerchi e archi, la maschera
 * ellittica dei due pannelli.
 *
 * Il movimento non e' qui dentro: `data-depth` marca le forme, ma il listener
 * va messo sulla sezione che contiene questo livello, perche' questo e'
 * `pointer-events-none` e non riceve il puntatore. Nella sezione:
 *
 *   useEffect(() => mouseParallax(sectionRef.current), [])
 *
 * Con `prefers-reduced-motion` mouseParallax non aggancia niente e le forme
 * restano ferme dove sono.
 */
export default function Decorations({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`text-accent-gold pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* anello grande, in alto a sinistra */}
      <svg
        data-depth="0.7"
        viewBox="0 0 100 100"
        fill="none"
        className="absolute top-[14%] left-[5%] h-24 w-24 opacity-20 md:h-36 md:w-36"
      >
        <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.75" />
      </svg>

      {/* arco, in basso a destra */}
      <svg
        data-depth="0.45"
        viewBox="0 0 100 60"
        fill="none"
        className="absolute right-[7%] bottom-[16%] h-16 w-28 opacity-25 md:h-24 md:w-44"
      >
        <path d="M1 59a49 49 0 0 1 98 0" stroke="currentColor" strokeWidth="0.75" />
      </svg>

      {/* anello piccolo, in alto a destra */}
      <svg
        data-depth="0.9"
        viewBox="0 0 100 100"
        fill="none"
        className="absolute top-[22%] right-[14%] h-10 w-10 opacity-30 md:h-14 md:w-14"
      >
        <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* punto pieno, in basso a sinistra */}
      <span
        data-depth="0.3"
        className="bg-accent-gold absolute bottom-[26%] left-[16%] h-1.5 w-1.5 rounded-full opacity-40"
      />
    </div>
  )
}
