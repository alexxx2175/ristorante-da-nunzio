---
name: handoff
description: Salva il passaggio di consegne del progetto in HANDOFF.md, cioè dove siamo arrivati con i lavori. Si invoca con /handoff. Per rileggere quello salvato c'è /leggihandoff.
---

# Handoff — scrittura

Riscrivi da capo `HANDOFF.md`, nella radice del progetto. È un file solo e
descrive **dove siamo adesso**, non la cronologia.

## Verifica prima di scrivere

**Non ricostruire lo stato a memoria.** La memoria della sessione confonde
quello che è stato deciso con quello che è stato davvero applicato al codice, e
un handoff sbagliato propaga l'errore a tutte le sessioni dopo.

Come minimo, prima di scrivere:

1. Esegui `npx tsc --noEmit` (e il build, se il progetto ce l'ha). Riporta
   l'esito **vero**, anche se fallisce.
2. Per ogni lavoro che credi concluso, controllalo nel codice: `grep` del
   componente, della classe o della funzione che dovresti aver aggiunto. Un
   componente scritto ma non importato da nessuno non è un lavoro concluso.
3. Se qualcosa era a metà quando la sessione si è interrotta, dillo
   esplicitamente e di' a che punto esatto è rimasto.

## Struttura del file

- **Cos'è il progetto** — due righe, per chi riapre a mesi di distanza, più lo
  stack e il rimando al README se c'è.
- **Come si avvia** — comandi, porta, e l'esito verificato di typecheck/build.
- **Fatto** — cosa è concluso e verificato, con i file toccati.
- **In corso** — cosa è a metà, il punto esatto dove si è fermato, e la
  prossima mossa concreta.
- **In coda** — cosa resta, in ordine di priorità.
- **Da chiedere all'utente** — decisioni che non puoi prendere da solo.
- **Trappole** — cose che sembrano bug e non lo sono, o che è già costato tempo
  scoprire. È la parte che fa risparmiare più tempo alla sessione dopo:
  scrivila anche quando sembra ovvia.

## Come scriverlo

- In italiano, come il resto del progetto.
- Concreto: percorsi di file, numeri, comandi. Non "sistemata la hero" ma
  "`components/sections/Hero.tsx`: il primo layer parte visibile".
- Datalo, e converti le date relative in assolute.
- Se una cosa non è verificata, scrivi che non è verificata.
- Non gonfiarlo: chi lo legge deve poter ripartire in due minuti.

Se `HANDOFF.md` esiste già, leggilo prima di sovrascriverlo: le voci di
"Trappole" e "Da chiedere all'utente" restano valide anche fra sessioni, e
vanno riportate se non sono state risolte nel frattempo.

Finito, di' all'utente in una riga cosa hai salvato e cosa è cambiato rispetto
a prima.
