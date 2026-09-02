/* NON IN USO dal 02/09/2026: dalla pagina contatti si prenota al telefono, e il
   modulo per scrivere e' stato tolto. Il componente resta su disco — il
   progetto non e' sotto controllo di versione, e qui dentro c'e' la validazione
   dei campi e la gestione dello stato di invio, che rifare da zero costerebbe
   piu' di quanto costi tenere il file. */
'use client'

import { useActionState } from 'react'
import { initialContactState, sendContactMessage } from '@/app/contact/actions'
import { siteConfig } from '@/lib/site'

const fieldClass =
  'border-secondary/20 focus:border-accent-gold w-full rounded-2xl border bg-white/60 px-5 py-4 outline-none transition-colors duration-300'

const labelClass = 'nav-link mb-3 block opacity-60'

/** Form contatti: nome, email, messaggio. */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState)

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <div>
        <label className={labelClass} htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? 'name-error' : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.name ? (
          <p id="name-error" className="mt-2 text-[0.8125rem] text-red-700">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
          className={fieldClass}
        />
        {state.fieldErrors?.email ? (
          <p id="email-error" className="mt-2 text-[0.8125rem] text-red-700">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? 'message-error' : undefined}
          className={`${fieldClass} resize-y`}
        />
        {state.fieldErrors?.message ? (
          <p id="message-error" className="mt-2 text-[0.8125rem] text-red-700">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* campo esca antispam: invisibile agli utenti */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <button
        type="submit"
        disabled={pending}
        className="nav-link bg-secondary text-primary mt-2 self-start rounded-full px-8 py-4 transition-opacity duration-300 ease-out hover:opacity-85 disabled:opacity-50"
      >
        {pending ? 'Invio…' : 'Invia il messaggio'}
      </button>

      {state.status !== 'idle' && state.message ? (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-2xl border px-5 py-4 leading-relaxed ${
            state.status === 'success'
              ? 'border-accent-gold/50 bg-accent-gold/10'
              : 'border-secondary/20 bg-white/60'
          }`}
        >
          <p>{state.message}</p>

          {state.mailto ? (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <a href={state.mailto} className="text-accent-gold underline underline-offset-4">
                Apri il messaggio nel client di posta
              </a>
              <a href={siteConfig.phoneHref} className="underline underline-offset-4">
                {siteConfig.phone}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}
