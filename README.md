# Open GuessUp

**Tu non vedi. Loro ridono.** Un party game offline per Android e web, con un solo telefono, realizzato con Expo SDK 58, React Native e TypeScript. Progetto indipendente di Gleetch. Identità Confetti: crema, menta e albicocca, con piccoli accenti lampone, con Outfit, logo e icona originali. [Note di design](docs/DESIGN.md).

![Home](docs/home-desktop-it.png)
![Turno landscape](docs/turn-landscape-it.png)

## Avvio

Richiede Node 22.13+ (qui verificato con 22.14), npm e, per il nativo, un client compatibile con Expo SDK 58 o un APK.

```powershell
git clone https://github.com/PaoloConteDev/OpenGuessUp.git
cd OpenGuessUp
npm.cmd ci
npm.cmd start
```

`npm run web` avvia l'anteprima web in sviluppo. Per l'export di produzione:

```powershell
npm.cmd run export:web
npm.cmd run preview
```

Apri [127.0.0.1:4174](http://127.0.0.1:4174). [Anteprima telefono](http://127.0.0.1:4174/__mobile).

## Giocare

1. Scegli e mescola categorie incluse e mazzi personali, oppure usa la categoria iniziale Animali.
2. Configura una partita rapida (un turno) oppure 2–4 squadre. Ogni squadra gioca un turno per ciascun round.
3. Tieni il telefono **in orizzontale sulla fronte**, schermo verso gli amici. Calibra tenendolo verticale e fermo per un secondo, poi avvia il countdown. La parola appare solo dopo il via.
4. Gli amici seguono il tipo di indizio: descrivere senza dire la risposta; mimare senza parlare; cantare/fredonnare senza nominare l'artista o il titolo; imitare senza fare il nome. Per le scene bisogna indovinare l'intera situazione, non soltanto il personaggio.
5. Inclina **in basso** per indovinata (+1), **in alto** per passare. Torna alla posizione verticale dopo ogni gesto. Sono sempre disponibili anche i pulsanti.
6. Alla fine rivedete e correggete gli esiti, quindi confermate. Una parola senza risposta vale zero. Vince il punteggio più alto; tutti i primi a pari merito vincono.

Nel browser: **↓ indovinata**, **↑ passa**, **spazio pausa/riprendi**. I tasti tenuti premuti non producono risposte ripetute. Gli input funzionano anche col pool di una sola parola.

| Opzione           | Valori                                         |
| ----------------- | ---------------------------------------------- |
| Durata            | 30, 45, 60, 90, 120 secondi                    |
| Squadre           | 2, 3, 4; nomi modificabili                     |
| Round             | 1, 3, 5, 7 per squadra                         |
| Risposta corretta | +1                                             |
| Passaggio         | 0 predefinito, oppure −1                       |
| Limite passaggi   | Illimitato predefinito, 0, 3, 5, 10            |
| Feedback          | Suono e vibrazione separatamente disattivabili |

Il timer usa una scadenza temporale, non il conteggio degli intervalli. Il background e la perdita di focus web mettono in pausa e nascondono la parola; serve una ripresa esplicita con nuovo countdown. Il tempo si ferma durante la pausa; il breve feedback di un esito consuma tempo del turno. Le parole non si ripetono prima dell'esaurimento del pool; alla nuova mescolata si evita anche la ripetizione sul confine, se il pool contiene più di una voce.

## Categorie e lingue

**12 categorie × 300 voci × 5 lingue = 18.000 versioni localizzate di 3.600 voci.** I conteggi nell'app vengono dai dati, non da etichette statiche.

| Categoria             | Indizio                      | Voci per lingua |
| --------------------- | ---------------------------- | --------------: |
| Animali               | Mimica                       |             300 |
| Cibo                  | Descrizione                  |             300 |
| Oggetti quotidiani    | Descrizione                  |             300 |
| Luoghi                | Descrizione                  |             300 |
| Natura e scienza      | Descrizione                  |             300 |
| Sport in scena        | Mimica                       |             300 |
| Musica e artisti      | Canto / imitazione strumento |             300 |
| Azioni da mimare      | Mimica                       |             300 |
| Mestieri e imprevisti | Imitazione                   |             300 |
| Fiabe sottosopra      | Imitazione                   |             300 |
| Emozioni in scena     | Imitazione                   |             300 |
| Viaggi e disavventure | Indizi liberi                |             300 |

Italiano, inglese, spagnolo, tedesco e francese includono interfaccia, regole, metadati e voci. Prima lingua dal dispositivo, fallback inglese; il selettore IT/EN/ES/DE/FR salva la preferenza. Un cambio lingua non traduce la partita in corso: la sua copia delle parole resta nella lingua di creazione.

I pacchetti contengono sia parole sia espressioni e scene complete. Animali, cibo e altri repertori condividono parte del lessico originale del progetto dell'utente Open Taboo; sono state aggiunte specie, piatti, artisti e scene originali per Open GuessUp. I pacchetti di scene combinano protagonisti, azioni e vincoli: ad esempio «Un vampiro va dal dentista» è una situazione da recitare. Non sono presenti liste di parole vietate o dati estratti da GuessUp. La localizzazione è inclusa e controllata automaticamente per integrità e duplicati; resta consigliabile una revisione editoriale da madrelingua per terminologia specialistica e naturalezza di alcune scene.

`src/data/content.json` è autosufficiente e versionato; gli ID sono hash stabili della voce italiana nella sua categoria. Per correggere una traduzione, mantenere l'ID. Nessun dato viene scaricato durante il gioco.

## Mazzi personali e salvataggi

Creazione, modifica, colore e cancellazione dalla schermata Categorie. Una voce per riga; normalizzazione Unicode, spazi e doppioni senza distinguere maiuscole. Massimo 100 caratteri per voce e 3.000 voci per mazzo. Il nome è obbligatorio; un mazzo vuoto si può salvare ma non selezionare.

Ogni mazzo appartiene alla lingua di creazione. La partita salva una **copia completa** delle parole, così rinominare o eliminare il mazzo non altera il gioco riprendibile. AsyncStorage usa `@open-guess/state-v1` e `@open-guess/language-v1`. Salvataggi assenti/corrotti vengono gestiti con valori sicuri; errori di scrittura vengono segnalati senza interrompere il gioco. Durante il turno si salva anche un checkpoint ogni due secondi; una chiusura forzata può perdere fino a due secondi di progresso.

## Sensori e orientamento Android

`expo-sensors` legge l'accelerometro a 20 Hz. Il valore gravitazionale Z è indipendente dalla scelta landscape sinistra/destra. La calibrazione rifiuta una posizione troppo piatta o instabile. Filtro passa-basso 0,22; attivazione a ±0,58 g rispetto alla posizione neutra e rientro entro ±0,18 g per quattro campioni. Una sola risposta per inclinazione; countdown, pausa e feedback disarmano il rilevatore e richiedono il rientro neutro. Un watchdog rileva l'assenza di campioni; i comandi manuali restano disponibili.

`expo-screen-orientation` blocca realmente in landscape preparazione e turno, e ripristina portrait nei menu/riepiloghi. Nessun componente viene semplicemente ruotato per simulare l'orientamento. Keep-awake mantiene attivo lo schermo durante countdown e turno. Le subscription vengono rimosse all'uscita.

**I test del filtro sono simulati. Non sostituiscono una prova dell'inclinazione su telefono fisico.** Il segno e le soglie vanno verificati impugnando il dispositivo sulla fronte; è disponibile la ricalibrazione in pausa.

## Registrazione opzionale, solo Android

Nella preparazione puoi scegliere «Attiva registrazione». Solo allora vengono richiesti fotocamera e microfono. Il rifiuto lascia il gioco utilizzabile. Si usa la fotocamera frontale; compare una piccola anteprima, poi la registrazione parte con il turno e si arresta alla pausa, al background o alla fine. Una ripresa dopo la pausa produce un segmento separato.

Nel riepilogo: anteprima con player nativo, salvataggio in galleria (permesso richiesto solo su quel comando), condivisione di sistema e cancellazione. I file temporanei vengono rimossi quando si lascia il turno; quelli orfani dopo una chiusura forzata vengono ripuliti dopo 24 ore al successivo avvio. Salva o condividi prima di confermare. I video non fanno parte del salvataggio riprendibile. Nessun comando video appare nel browser o su iOS.

## APK Android

Scarica l'APK per telefoni ARM64 dalla [release v1.0.0](https://github.com/PaoloConteDev/OpenGuessUp/releases/tag/v1.0.0) (circa 34 MB). Nelle build locali il file è `artifacts/OpenGuessUp-1.0.0-arm64.apk`. Copialo sul telefono, aprilo e consenti l'installazione dalla fonte scelta. È un APK autonomo di test, firmato con la chiave debug Expo; non richiede Expo Go. Firma e metadati sono controllati, ma non è stato installato su un dispositivo fisico durante questa sessione.

Identità autonoma: **Open GuessUp**, slug `open-guess`, schema `openguess`, package `it.gleetch.openguess`, versione 1.0.0. Nessun ID EAS, proprietario o segreto di Open Taboo. Android minimo API 24. Icone e suoni propri inclusi.

Durante queste revisioni la versione pubblica resta **1.0.0**, come richiesto. Le build Android mantengono un `versionCode` interno crescente per poter aggiornare le copie già installate; questo numero non cambia la versione mostrata agli utenti.

La [repository GitHub](https://github.com/PaoloConteDev/OpenGuessUp) è raggiungibile anche dalle impostazioni dell'app. Sorgenti, dati, font e suoni sono inclusi nel progetto; APK e archivi di consegna vengono distribuiti negli allegati della release.

Build cloud, richiede un account Expo e l'associazione a un **nuovo** progetto:

```powershell
npx.cmd eas-cli login
npx.cmd eas-cli build:configure
npx.cmd eas-cli build --platform android --profile preview
```

`eas.json` configura un vero APK per il profilo `preview`; `production` produce un AAB. Non riutilizzare le credenziali di pubblicazione di altri progetti.

Build locale con Android SDK/NDK, CMake e Java 21 installati:

```powershell
npx.cmd expo prebuild --platform android --no-install
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a --no-daemon --max-workers=2
```

Output: `android/app/build/outputs/apk/release/app-release.apk`. La build locale generata da Expo usa la chiave debug del template: adatta ai test e al sideload, da sostituire con una chiave di rilascio propria prima della distribuzione pubblica. Non è stata letta né copiata alcuna chiave di Open Taboo. Il profilo EAS può gestire una chiave nuova.

Su Windows usare una cartella breve (es. `C:\og-build`) se Ninja segnala nomi oltre 260 caratteri. Il config plugin `scripts/withShortPaths.cjs` limita anche i percorsi oggetto CMake; da solo può non bastare quando la checkout è molto profonda. La build ARM64 è adatta ai telefoni ARM64; per altre architetture omettere la proprietà `reactNativeArchitectures`.

**`npm run export:android` genera bundle JavaScript/Hermes e asset, non un APK.** L'APK installato è autonomo e funziona offline dal primo avvio. Expo Go in sviluppo richiede Metro. La versione web non include un service worker per l'avvio offline a freddo.

## Verifiche

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run export:web
npm.cmd run export:android
npm.cmd run preview
# In un secondo terminale; richiede Edge nel percorso standard Windows
node scripts/smoke.mjs
```

I test del motore verificano punteggi, penalità, turni uguali per 2–4 squadre e 1/3/5/7 round, pareggio, scadenza, pausa/ripresa, mescolamento e pool minimi, input simultanei, correzioni, ripristino, mazzi e dati localizzati. La prova browser percorre anche salvataggio/ricaricamento, cinque lingue, creazione multipla, tastiera e scadenza reale del timer. Screenshot in `docs/`; risultati e limiti in `docs/VALIDATION.md`.

## Struttura

- `App.tsx`: navigazione, ciclo di vita, scadenza e persistenza.
- `src/game/engine.ts`: motore puro, nessuna dipendenza UI, storage o sensore.
- `src/game/tilt.ts`: filtro e isteresi puri.
- `src/hooks/useTilt.ts`: acquisizione Expo e calibrazione.
- `src/components/Recording.tsx`: registrazione e strumenti nativi.
- `src/screens/`: menu, editor, impostazioni e partita.
- `src/data/`: contenuti locali e validazione mazzi.
- `src/i18n/`: tutte le stringhe locali.
- `scripts/assets.mjs`: rigenera icona e suoni sintetizzati originali.

Font Outfit e icone Lucide conservano le rispettive licenze; vedere `THIRD_PARTY_NOTICES.md`. Open GuessUp non è affiliato a Cosmicode o GuessUp. Riferimenti di meccanica consultati: [sito ufficiale](https://cosmicode.games/en/guess-up) e [scheda Google Play](https://play.google.com/store/apps/details?id=pt.cosmicode.guessup&hl=it). Nessuna immagine, logo, traccia audio o banca dati di GuessUp è inclusa.
