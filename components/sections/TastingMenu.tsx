import Reveal from '@/components/ui/Reveal'
import { tastingMenu } from '@/lib/menu'

/**
 * Il menu degustazione, in evidenza sopra la carta.
 *
 * Sta prima delle sezioni e non dentro l'elenco perche' non e' un piatto: e'
 * una proposta a se', senza prezzo e solo su prenotazione. In fondo alla
 * pagina si sarebbe persa proprio per chi sta decidendo se prenotare.
 */
export default function TastingMenu() {
  return (
    <section className="w-full pt-14 lg:pt-20">
      <div className="container-gutter mx-auto max-w-4xl">
        <Reveal>
          <div className="border-accent-gold/40 rounded-[2rem] border px-6 py-10 text-center sm:px-12">
            <p className="nav-link text-accent-gold">{tastingMenu.note}</p>

            <h2 className="mt-6 font-serif text-3xl md:text-4xl">{tastingMenu.title}</h2>

            <div className="mx-auto mt-6 max-w-xl">
              {tastingMenu.it.map((line) => (
                <p key={line} className="leading-relaxed">
                  {line}
                </p>
              ))}

              <p lang="de" className="mt-5 text-[0.8125rem] leading-relaxed opacity-45">
                {tastingMenu.de.join(' ')}
              </p>
              <p lang="en" className="mt-1 text-[0.8125rem] leading-relaxed opacity-45">
                {tastingMenu.en.join(' ')}
              </p>
            </div>

            {/* Qui c'era il bottone per prenotare. Tolto insieme agli altri
                (01/09/2026), e **non** sostituito con quello verso il menu:
                questo blocco sta sulla pagina del menu, e manderebbe dove si
                e' gia'. Il blocco dice "su prenotazione" e ora non offre un
                modo per farlo: se serve, il posto e' questo. */}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
