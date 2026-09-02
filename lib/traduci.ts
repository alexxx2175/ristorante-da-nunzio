import 'server-only'

/**
 * La traduzione di un piatto in tedesco e in inglese.
 *
 * Una riga per lingua, non due campi separati per nome e ingredienti: e' il
 * formato del menu di carta, dove il tedesco dice «Tagliatelle mit Pilzen,
 * Garnelen, Knoblauch, Olivenöl und Chili» — nome e ingredienti in una frase
 * sola. Il sito stampa quella riga sotto al nome italiano.
 */
export type Traduzione = { de: string; en: string }

/** Il modello: piccolo, veloce, e queste sono due righe di testo per volta. */
const MODELLO = 'claude-sonnet-5'

/** Oltre questo si smette di aspettare: salvare un piatto viene prima. */
const ATTESA_MS = 20_000

export const traduzioneConfigurata = () => Boolean(process.env.ANTHROPIC_API_KEY)

const ISTRUZIONI = `Traduci in tedesco e in inglese il nome di un piatto per il menu di un ristorante italiano sul lago di Garda.

Regole:
- Una riga sola per lingua, che unisce il nome e — se c'è — la riga di ingredienti. Non due frasi separate.
- Registro da menu: sintagma nominale, niente verbo, niente punto finale, niente articolo iniziale.
- I nomi propri, i luoghi e i formati di pasta restano in italiano: Malcesine, Garda, Baldo, Oliveto Citra, tagliatelle, mezze maniche, calamarata, guanciale, pecorino romano, tastasal.
- In tedesco i sostantivi vanno maiuscoli e le parole si compongono come si usa (Malcesine-Olivenöl, Sepiatinte).
- Se un ingrediente non ha un nome corrente nell'altra lingua, lascialo in italiano invece di inventarlo.

Esempi presi dal menu di carta di questo locale:

Italiano: Tagliatelle — funghi, gamberi, aglio, olio e peperoncino
de: Tagliatelle mit Pilzen, Garnelen, Knoblauch, Olivenöl und Chili
en: Tagliatelle with mushrooms, prawns, garlic, olive oil and chili

Italiano: Gelato all'olio di Malcesine, crumble di pane e sarde di lago
de: Eis aus Malcesine-Olivenöl mit Brot-Crumble und Seesardinen
en: Malcesine olive oil ice cream with bread crumble and lake sardines

Italiano: Mezze maniche alla gricia — burro al tartufo nero, guanciale e pecorino romano
de: Mezze Maniche nach Gricia-Art (schwarze Trüffelbutter, Guanciale und Pecorino Romano)
en: Mezze maniche alla gricia (black truffle butter, guanciale and pecorino romano)`

/**
 * Propone la traduzione di un piatto.
 *
 * **Non solleva mai.** Restituisce `null` se la chiave non c'e', se la rete non
 * risponde, se la risposta non si capisce: chi chiama deve poter salvare il
 * piatto lo stesso. Una traduzione mancante si scrive a mano dalla matita, un
 * piatto che non si salva perche' un servizio esterno era giu' e' un guaio.
 *
 * La risposta arriva da uno strumento con lo schema obbligato invece che da del
 * testo da spacchettare: cosi' i due campi ci sono sempre, e non c'e' niente da
 * ritagliare fra virgolette e righe di cortesia.
 */
export async function traduciPiatto(nome: string, ingredienti: string): Promise<Traduzione | null> {
  const chiave = process.env.ANTHROPIC_API_KEY
  if (!chiave || !nome.trim()) return null

  const italiano = ingredienti.trim() ? `${nome.trim()} — ${ingredienti.trim()}` : nome.trim()

  try {
    const risposta = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': chiave,
        'anthropic-version': '2023-06-01',
      },
      signal: AbortSignal.timeout(ATTESA_MS),
      body: JSON.stringify({
        model: MODELLO,
        max_tokens: 400,
        system: ISTRUZIONI,
        messages: [{ role: 'user', content: `Italiano: ${italiano}` }],
        tools: [
          {
            name: 'traduzione',
            description: 'Le due righe tradotte, una per lingua.',
            input_schema: {
              type: 'object',
              properties: {
                de: { type: 'string', description: 'La riga in tedesco.' },
                en: { type: 'string', description: 'La riga in inglese.' },
              },
              required: ['de', 'en'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'traduzione' },
      }),
    })

    if (!risposta.ok) return null

    const dati = await risposta.json()
    const uso = dati?.content?.find((c: { type?: string }) => c.type === 'tool_use')
    const de = String(uso?.input?.de ?? '').trim()
    const en = String(uso?.input?.en ?? '').trim()
    return de || en ? { de, en } : null
  } catch {
    return null
  }
}
