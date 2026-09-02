/**
 * Il vocabolario dei piatti gestiti dal pannello.
 *
 * Sta in un file suo, **senza `server-only`**, perche' lo usano tutti e due i
 * lati: i moduli nel browser e il deposito sul server. Tenendolo insieme al
 * deposito, il modulo si tirava dietro `node:fs` e la compilazione cadeva.
 */

/**
 * Le portate, con la sezione del menu in cui finiscono.
 *
 * Sono **tutte** le sezioni di `foodSections`, non tre su quattro: da qui si
 * sceglie dove sta un piatto sia quando lo si crea sia quando lo si sposta, e
 * un contorno che non si puo' nominare e' un contorno che non si puo' spostare.
 */
export const PORTATE = [
  { chiave: 'antipasti', etichetta: 'Antipasto', sezione: 'Antipasti' },
  { chiave: 'primi', etichetta: 'Primo', sezione: 'Primi piatti' },
  { chiave: 'secondi', etichetta: 'Secondo', sezione: 'Secondi piatti' },
  { chiave: 'contorni', etichetta: 'Contorno', sezione: 'Contorni e insalate' },
] as const

/** La portata che porta a una sezione, se quella sezione e' del menu dei piatti. */
export const portataDiSezione = (sezione: string) => PORTATE.find((p) => p.sezione === sezione)

export type Portata = (typeof PORTATE)[number]['chiave']

export type PiattoAggiunto = {
  id: string
  portata: Portata
  nome: string
  ingredienti: string
  prezzo: string
  /**
   * Il nome in tedesco e in inglese, come sul menu di carta.
   *
   * A Malcesine buona parte della sala legge quelli, ed e' il motivo per cui il
   * cartaceo e' gia' su tre lingue. Restano **facoltativi**: una voce senza
   * traduzione esce solo in italiano, che e' quello che gia' succede per meta'
   * del menu stampato. Meglio niente che una traduzione inventata.
   */
  de?: string
  en?: string
  /** Indirizzo della fotografia. Vuoto se non ne e' stata caricata una. */
  foto?: string
  creato: string
}

/** Quello che il pannello puo' cambiare di un piatto del menu scritto a mano. */
export type Modifica = {
  nome?: string
  ingredienti?: string
  prezzo?: string
  de?: string
  en?: string
  foto?: string
  /**
   * La sezione in cui il piatto e' stato spostato, se e' stato spostato.
   *
   * Vale solo per i piatti del menu scritto a mano: quelli nati dal pannello
   * hanno la loro `portata` e si cambia quella. La **chiave non si muove** —
   * resta `sezioneDiPartenza::nome` — altrimenti spostare un piatto gli farebbe
   * perdere tutto il resto: se era spento, come era stato modificato, dov'era
   * nell'ordine.
   */
  sezione?: string
}

/**
 * La chiave con cui il deposito conosce un piatto.
 *
 * I piatti aggiunti dal pannello hanno un identificatore proprio e usano
 * quello. Quelli del menu scritto a mano non ce l'hanno — sono voci in un file —
 * quindi la chiave si costruisce da sezione e nome. Il nome da solo non
 * basterebbe: due sezioni potrebbero avere una voce omonima.
 *
 * **Rinominare un piatto nel file gli fa perdere quello che il pannello sapeva
 * di lui** (se era spento, se era stato modificato), perche' la chiave cambia.
 * E' il male minore: l'alternativa era mettere un identificatore a venticinque
 * voci scritte a mano e ricordarsi di non toccarlo mai. Rinominare si fa dal
 * pannello, e li' la chiave non cambia.
 */
export const chiavePiatto = (sezione: string, nome: string) => `${sezione}::${nome}`

/**
 * Mette il simbolo dell'euro se chi scrive ha inserito solo il numero.
 *
 * Nel menu i prezzi sono scritti "€ 22,00", e chi compila il modulo scrive
 * quasi sempre "22" o "22,00". Correggerlo qui evita di avere mezza carta con
 * il simbolo e mezza senza — e chi vuole scrivere "s.q." o "16,00 – 24,00" puo'
 * comunque farlo: si tocca solo quello che e' un numero e basta.
 */
export function formattaPrezzo(grezzo: string): string {
  const pulito = grezzo.trim()
  if (!pulito) return ''
  if (!/^\d+([.,]\d{1,2})?$/.test(pulito)) return pulito
  const [interi, decimali = '00'] = pulito.replace('.', ',').split(',')
  return `€ ${interi},${decimali.padEnd(2, '0')}`
}

/**
 * Quello che il pannello salva.
 *
 * I piatti del menu scritto a mano **non finiscono qui**: restano in
 * `lib/menu.ts` con le loro traduzioni, i prezzi e gli allergeni. Di loro il
 * deposito conserva soltanto cosa il pannello ha fatto — spegnerli, cambiarli,
 * toglierli, spostarli — e il menu applica quelle indicazioni sopra al file.
 *
 * E' la differenza che tiene in piedi tutto: il pannello **non riscrive** il
 * menu, ci lavora attorno. Al peggio si svuota il deposito e il menu torna
 * esattamente com'era scritto.
 *
 * Il tipo sta qui e non nel deposito perche' lo legge anche chi compone il
 * menu, che gira dalle due parti: `lib/piatti-store.ts` si tira dietro
 * `node:fs` e non puo' essere importato dal browser.
 */
export type Deposito = {
  /** I piatti nati dal pannello. */
  aggiunti: PiattoAggiunto[]
  /** Chiavi dei piatti spenti: fuori dal sito, ma si riaccendono. */
  nascosti: string[]
  /** Chiavi dei piatti tolti per sempre: fuori dal sito e fuori dal pannello. */
  cancellati: string[]
  /** Cosa e' stato cambiato dei piatti del menu scritto a mano. */
  modifiche: Record<string, Modifica>
  /** L'ordine dei piatti dentro ogni sezione, per chiave. */
  ordine: Record<string, string[]>
}
