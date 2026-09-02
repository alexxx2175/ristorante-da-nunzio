import Image from 'next/image'

type PlaceholderMediaProps = {
  /** Token del contenuto mancante, es. "[IMMAGINE-HERO-BG-1]". */
  token: string
  /** Path reale in /public/images: quando c'e', sostituisce il placeholder. */
  src?: string
  alt?: string
  /** Riempie il contenitore (che deve essere position: relative). */
  fill?: boolean
  className?: string
  /** Rende un <video> muto in loop invece di un'immagine. */
  video?: boolean
  priority?: boolean
  sizes?: string
}

/**
 * Segnaposto visivo per ogni media non ancora fornito.
 *
 * Finche' `src` e' assente mostra un riquadro tratteggiato con il token ben
 * leggibile; appena si passa un path reale renderizza next/image (o <video>)
 * senza toccare il layout circostante.
 */
export default function PlaceholderMedia({
  token,
  src,
  alt,
  fill = true,
  className = '',
  video = false,
  priority = false,
  sizes = '100vw',
}: PlaceholderMediaProps) {
  const base = fill ? 'absolute inset-0 h-full w-full' : 'relative w-full'

  if (src && video) {
    return (
      <video
        className={`${base} object-cover ${className}`}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt ?? token}
      />
    )
  }

  if (src) {
    return (
      <div className={`${base} overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={alt ?? token}
      data-placeholder={token}
      className={`${base} flex items-center justify-center overflow-hidden border border-dashed border-current/25 bg-[repeating-linear-gradient(135deg,rgba(120,120,120,0.10)_0_10px,rgba(120,120,120,0.02)_10px_20px)] ${className}`}
    >
      <span className="px-3 text-center font-mono text-[10px] leading-tight tracking-widest uppercase opacity-55 sm:text-xs">
        {token}
        {video ? ' (video)' : null}
      </span>
    </div>
  )
}
