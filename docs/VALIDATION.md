# Verifica — 26 ottobre 2026

Ambiente: Windows, Node 22.14.0, Expo SDK 58, React 19.3 / React Native 0.88, TypeScript 6. Java Android Studio 21 e SDK Android locali. Riferimento Open Taboo consultato in sola lettura; tutti i file del nuovo gioco sono nella cartella OpenGuess.

## Completato

- Illustrazione della home ridisegnata: lineamenti, capelli, mani sul telefono, abiti, riflessi e ombre. Scritta “PIZZA” e badge tradotto inclusi nello stesso SVG per mantenere l’allineamento. Typecheck ed export web superati. Screenshot e controllo visivo a 320, 390 e 1280 px; verificati i font Outfit e l’ingombro delle scritte nelle cinque lingue a 320 px, senza tagli o overflow orizzontale. File `hero-320.png`, `hero-390.png`, `hero-1280.png` e screenshot home aggiornati.
- Palette aggiornata a rosso, verde, blu e giallo pastello su bianco freddo, con testo blu scuro. Freccia rimossa dal marchio in testata. Card “La tua prossima ossessione?” in azzurro chiaro `#E1EEFC`, con feedback premuto dedicato. Controllo browser a 320, 390 e 1280 px: colore corretto, nessuna freccia, nessun overflow orizzontale o errore JavaScript. Screenshot home e `discovery-card-mobile-it.png` aggiornati; typecheck ed export web superati.
- Icona dell’app e favicon allineate al simbolo ScanFace della home. PNG 1024 px e foreground adattivo rigenerati, con verifica dell’area sicura circolare Android e anteprima in `app-icon-preview.png`.
- Registrazione rimossa completamente: componente, stato UI, pulizia video e dipendenze dirette dedicate eliminati; fotocamera, microfono e accesso alla galleria esclusi dalla configurazione Android.
- Sensore: 3 secondi per posizionare il telefono prima della misura, angolo ricavato dai tre assi, soglie angolari e stabilità basate sul tempo. Corretto il fallback manuale che lasciava attivo il rilevatore e il recupero dopo un’interruzione dei campioni. Prova dell’inclinazione disponibile prima del turno, senza assegnare punti. Il browser presenta soltanto controlli manuali.
- 17 test dedicati al sensore con stream e orologio simulati: landscape in entrambe le direzioni, rumore, ritorno neutro, 5/10/20/50 Hz, primo gesto dopo countdown, posizionamento dopo il tocco, posizione troppo piatta, perdita e ritorno del segnale, calibrazione e listener cancellati all’uscita. Totale: 60 test. Nessun telefono o emulatore collegato durante questa revisione.
- Pulsante “Codice sorgente su GitHub” nelle impostazioni, tradotto nelle cinque lingue. Verificata l’apertura dell’URL esatto `https://github.com/PaoloConteDev/OpenGuessUp`; screenshot `version-mobile-it.png` aggiornato. Sorgenti pubblicati nella repo e build distribuita come release v1.0.0.
- Marchio e nome pubblico corretti in “Open GuessUp”, con G e U maiuscole; versione pubblica sempre 1.0.0. Verificata la testata a 320 e 390 px. Identificativi tecnici e chiavi locali restano stabili per conservare i dati e consentire gli aggiornamenti.
- Versione pubblica fissata a 1.0.0 in Expo, package, lockfile e testi delle cinque lingue. Verificata anche nelle impostazioni renderizzate (`version-mobile-it.png`). Il codice build Android cresce separatamente per consentire gli aggiornamenti.
- Firma “by Gleetch” sotto il marchio e selettore con bandiere vettoriali locali per tutte le lingue. Controllo visivo della testata a 320 e 390 px e della schermata lingua; screenshot `header-compact-it.png` e `languages-mobile-it.png`.
- Ripristinati i metadati delle dipendenze nel lockfile dopo una sostituzione di versione troppo ampia. Versioni e URL confrontati con il lockfile dei pacchetti installati; `npm ci --dry-run --ignore-scripts --offline --no-audit --no-fund` riuscito.
- Revisione grafica 1.0.0: identità Confetti in quattro colori pastello, marchio e icona coordinati, barra di navigazione flottante, categorie con superfici colorate e selettori a capsula. Controllo visivo su mobile, desktop e turno landscape. Dettagli in `DESIGN.md`.
- APK 1.0.0: build riuscita, versionCode 16, firma v2 verificata e certificato identico alle build precedenti. Può essere installato come aggiornamento conservando i dati locali. La directory breve `C:\og-build-20261026` conserva la cache della build per le prossime iterazioni grafiche.

- `npm run typecheck`: riuscito.
- `npm test`: 60 test riusciti, nessun fallimento. Copertura di punteggi, penalità, scadenza, pause, deduplicazione, review, mescolamento, recupero salvataggi, mazzi e integrità delle cinque lingue. La matrice di turnazione include 2/3/4 squadre × 1/3/5/7 round.
- `npm run export:web`: export Metro di produzione riuscito, font e suoni locali.
- `npm run export:android`: export Hermes e asset riuscito. Questo controllo **non equivale a un APK**.
- Build Android nativa `assembleRelease`: riuscita dalla copia temporanea a percorso breve, con le dipendenze native di sensori, orientamento e audio. APK ARM64, minSdk 24, package `it.gleetch.openguess`, versione 1.0.0. Le prime compilazioni nella cartella profonda fallivano sul limite di 260 caratteri di Ninja; la copia breve ha risolto il problema senza cambiare impostazioni di Windows o file di Open Taboo.
- APK finale: `artifacts/OpenGuessUp-1.0.0-arm64.apk`. `apksigner verify --verbose`: firma APK v2 valida, un firmatario. `aapt dump badging`: nome Open GuessUp, package e versione corretti, minSdk 24 / targetSdk 36, ABI arm64-v8a. Archivio ispezionato: libreria nativa, bundle Hermes, font e suoni inclusi. Digest SHA-256 in `artifacts/SHA256SUMS.txt`. Sorgenti completi separati in `artifacts/OpenGuessUp-source.zip`.
- `node scripts/smoke.mjs`: prova end-to-end su Edge headless, con UI reale. Home mobile/desktop; ricerca; mazzo personale con spazi e duplicati; partita rapida; tastiera; pausa, uscita, ricaricamento e ripresa; scadenza reale di 30 secondi; modifica esiti; conferma; rivincita; cambio di tutte le lingue; due squadre, un round e pareggio.
- `node scripts/extra-smoke.mjs`: avvio da JSON corrotto, mazzo vuoto non selezionabile, modifica ed eliminazione, copia immutabile nella partita salvata, espressione lunga di 93 caratteri, pausa per perdita di focus, categorie e configurazione desktop.
- Verifica visiva dei PNG: home mobile e desktop, categorie mobile e griglia desktop, configurazione mobile e desktop, preparazione, turno landscape (anche testo lungo), pausa, riepilogo e risultati. Durante la verifica è stato corretto il troncamento delle espressioni lunghe.
- Gli script browser controllano gli errori JavaScript e l'overflow orizzontale nelle schermate principali. Gli esiti strutturati sono in `web-validation.json` e `extra-validation.json`.

## Dispositivi e limiti

`adb devices` non elenca telefoni o emulatori collegati; non sono configurati AVD. **Non sono dichiarati verificati su hardware fisico**: direzione delle inclinazioni, calibrazione nell'impugnatura reale, blocco orientamento, feedback tattile, screen wake lock nativo. Il filtro di inclinazione è verificato con campioni simulati; non costituisce un collaudo del sensore reale.

La registrazione è stata rimossa da interfaccia, codice, dipendenze dirette e configurazione. La nuova build esclude i permessi di fotocamera, microfono e galleria.

I contenuti comprendono parole e scene; queste ultime riutilizzano strutture linguistiche con azioni, protagonisti e vincoli diversi. I controlli garantiscono 300 voci uniche per categoria in ciascuna lingua, 3.600 ID stabili e assenza di righe vuote o segnaposto numerati. Non è stata svolta una revisione linguistica professionale delle 18.000 versioni: alcune traduzioni specialistiche e scene possono essere migliorate editorialmente.

Il web richiede rete/server per l'avvio a freddo: non c'è un service worker. L'APK include dati, font e audio e non richiede backend o download per giocare. Il salvataggio periodico durante il turno ha granularità di due secondi.

## Screenshot

| Schermata                         | File                                                    |
| --------------------------------- | ------------------------------------------------------- |
| Home telefono                     | `home-mobile-it.png`                                    |
| Home desktop                      | `home-desktop-it.png`                                   |
| Categorie telefono / desktop      | `categories-mobile-it.png`, `categories-desktop-it.png` |
| Configurazione telefono / desktop | `setup-mobile-it.png`, `setup-desktop-it.png`           |
| Preparazione e turno landscape    | `preparation-landscape-it.png`, `turn-landscape-it.png` |
| Espressione lunga                 | `long-word-landscape-it.png`                            |
| Pausa                             | `pause-landscape-it.png`                                |
| Revisione                         | `review-mobile-it.png`                                  |
| Fine rapida / pari merito squadre | `results-mobile-it.png`, `teams-tie-mobile-it.png`      |

## Checklist per il collaudo fisico

1. Installare APK ARM64, attivare modalità aereo e avviare da app chiusa: menu, font, suoni e categorie devono apparire subito.
2. Avviare turno con sensori. Tenere il display verticale sulla fronte, calibrare; in basso deve risultare corretto, in alto passa. Mantenere l'inclinazione non deve ripetere l'evento. Un nuovo gesto richiede il centro.
3. Provare landscape sinistra/destra, scuotimenti piccoli, countdown, pausa e feedback; nessun esito spurio. Tornare ai menu deve ripristinare portrait.
4. Premere Home Android durante il turno; al ritorno parola nascosta e ripresa esplicita. Verificare il tasto Indietro e lo schermo mantenuto attivo.
5. Toccare “Calibra” mentre si guarda lo schermo, poi portare il telefono sulla fronte entro i 3 secondi e restare fermi. La posizione deve risultare calibrata; la prova prima del turno deve riconoscere giù/su senza assegnare punti. La scelta dei comandi manuali deve ignorare le inclinazioni.
6. Verificare che non compaiano comandi di registrazione né richieste di fotocamera, microfono o galleria. Interrompere il sensore durante countdown/turno deve mettere in pausa; il ritorno dei campioni richiede una nuova calibrazione.
