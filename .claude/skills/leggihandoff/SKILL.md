---
name: leggihandoff
description: Rilegge HANDOFF.md per ripartire da dove si era arrivati con il progetto. Si invoca con /leggihandoff. Per salvare lo stato attuale c'è /handoff.
---

# Handoff — lettura

Leggi `HANDOFF.md` nella radice del progetto.

Se non c'è, dillo e proponi di crearlo con `/handoff`.

## Cosa riferire

Riassumi all'utente in poche righe:

- **dove eravamo** — cosa è concluso, per sommi capi;
- **cosa è in corso** — il punto esatto in cui si era fermato;
- **la prossima mossa** — una, concreta;
- **cosa aspetta una sua risposta**, se la sezione "Da chiedere all'utente" non
  è vuota.

Leggi anche la sezione "Trappole" e tienila presente per il resto della
sessione, ma non ripeterla tutta all'utente: la conosce già, l'ha scritta con
te. Richiamala quando torna utile.

## Poi fermati

Non ripartire da solo con il lavoro. Aspetta che l'utente dica da dove
ricominciare: potrebbe avere in mente una priorità diversa da quella scritta nel
file.

## Il file fotografa il passato

`HANDOFF.md` racconta com'erano le cose quando è stato scritto, e nel frattempo
il codice può essere cambiato — anche per mano di altri, o di un'altra sessione.
**Prima di agire su qualcosa che il file dà per fatto o per rotto, verificalo**:
apri il file citato, o fai un `grep`. Vale soprattutto se nomina componenti,
classi o flag che stai per toccare.

Se trovi uno scarto fra quello che dice l'handoff e quello che dice il codice,
segnalalo all'utente invece di sistemarlo in silenzio: sapere che l'handoff era
sbagliato è un'informazione utile.
