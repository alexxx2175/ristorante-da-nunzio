import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'text' | 'gold'
type Tone = 'light' | 'dark'

type BaseProps = {
  children: ReactNode
  variant?: Variant
  /** `light` = pensato per fondi scuri, `dark` = per fondi chiari. */
  tone?: Tone
  className?: string
}

type ButtonAsLink = BaseProps & {
  href: string
  external?: boolean
} & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>

type ButtonAsButton = BaseProps & {
  href?: undefined
} & Omit<ComponentProps<'button'>, 'className' | 'children'>

type ButtonProps = ButtonAsLink | ButtonAsButton

const base =
  'nav-link inline-flex items-center justify-center gap-2 transition-[color,background-color,border-color,opacity] duration-300 ease-out'

const styles: Record<Variant, Record<Tone, string>> = {
  primary: {
    light: 'bg-primary text-secondary px-7 py-4 rounded-full hover:opacity-80',
    dark: 'bg-secondary text-primary px-7 py-4 rounded-full hover:opacity-80',
  },
  outline: {
    light:
      'border border-primary/60 text-primary px-7 py-4 rounded-full hover:bg-primary hover:text-secondary',
    dark: 'border border-secondary/40 text-secondary px-7 py-4 rounded-full hover:bg-secondary hover:text-primary',
  },
  text: {
    light: 'text-primary hover:opacity-60',
    dark: 'text-secondary hover:opacity-60',
  },
  /* CTA di prenotazione: oro con testo scuro (contrasto ~6.5:1). */
  gold: {
    light: 'bg-accent-gold text-secondary px-7 py-4 rounded-full hover:opacity-85',
    dark: 'bg-accent-gold text-secondary px-7 py-4 rounded-full hover:opacity-85',
  },
}

/**
 * Bottone/link generico riutilizzabile su tutte le pagine.
 * Un href che inizia con "[" e' un placeholder non ancora risolto: viene reso
 * come <span> non cliccabile, cosi' non produce link rotti.
 */
export default function Button({
  children,
  variant = 'outline',
  tone = 'dark',
  className = '',
  ...rest
}: ButtonProps) {
  const cls = `${base} ${styles[variant][tone]} ${className}`

  if ('href' in rest && rest.href) {
    const { href, external, ...anchorProps } = rest as ButtonAsLink
    const isPlaceholder = href.startsWith('[')

    if (isPlaceholder) {
      return (
        <span className={`${cls} cursor-not-allowed`} title={href} data-placeholder={href}>
          {children}
        </span>
      )
    }

    /* tel:, mailto: e URL assoluti non passano da next/link. */
    const isInternal = href.startsWith('/') || href.startsWith('#')
    const isNewTab = external || /^https?:/.test(href)

    if (!isInternal || isNewTab) {
      return (
        <a
          className={cls}
          href={href}
          target={isNewTab ? '_blank' : undefined}
          rel={isNewTab ? 'noreferrer' : undefined}
          {...anchorProps}
        >
          {children}
        </a>
      )
    }

    return (
      <Link className={cls} href={href} {...anchorProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = rest as ButtonAsButton
  return (
    <button className={cls} type="button" {...buttonProps}>
      {children}
    </button>
  )
}
