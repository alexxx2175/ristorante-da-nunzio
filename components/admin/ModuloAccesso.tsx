'use client'

import { useActionState } from 'react'
import { entra } from '@/app/admin/actions'
import { nessunEsito } from '@/app/admin/esito'

/** Il modulo d'accesso: una password sola, quella condivisa con il locale. */
export default function ModuloAccesso() {
  const [esito, azione, inCorso] = useActionState(entra, nessunEsito)

  return (
    <form action={azione} className="mx-auto max-w-sm">
      <label htmlFor="password" className="nav-link opacity-60">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="border-secondary/25 focus:border-secondary mt-3 w-full rounded-full border bg-transparent px-6 py-3 outline-none"
      />

      {esito.errore ? <p className="mt-4 text-sm text-red-700">{esito.errore}</p> : null}

      <button
        type="submit"
        disabled={inCorso}
        className="bg-secondary text-primary mt-6 w-full rounded-full px-6 py-3 disabled:opacity-50"
      >
        {inCorso ? 'Un momento…' : 'Entra'}
      </button>
    </form>
  )
}
