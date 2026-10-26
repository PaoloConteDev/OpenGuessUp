# Open GuessUp v1.1.0

Party game offline per Android: un telefono sulla fronte, gli amici danno gli indizi e tu indovini. Questa release raccoglie l’identità Confetti a quattro colori pastello e la nuova illustrazione 3D della home, con README completo e versione 1.1.0 visibile nelle cinque lingue.

## Novità

- Rosso, verde, blu e giallo pastello su bianco freddo, con testo blu scuro.
- Illustrazione originale con telefono, carte e gettoni, inclusa offline nell’app.
- Icona Android coordinata alla home, firma “by Gleetch”, bandiere delle lingue e link alla repository nelle impostazioni.
- Versione di home e impostazioni letta dalla configurazione, per mantenere coerenti i futuri aggiornamenti.
- README con download diretto, regole, categorie, mazzi personali, avvio web e compilazione Android.

## Gioco

Partita rapida o 2–4 squadre, dodici categorie con 3.600 voci per lingua, mazzi personali, salvataggio locale, timer configurabile e riepilogo modificabile. Interfaccia e contenuti in italiano, inglese, spagnolo, francese e tedesco. Controlli manuali e tramite inclinazione su Android; pulsanti e tastiera nel browser. Nessun account, pubblicità, acquisto, tracking o backend necessario. La registrazione resta rimossa.

## Installazione e aggiornamento

Scarica **`OpenGuessUp-1.1.0-arm64.apk`** su un telefono ARM64 con Android 7/API 24 o successivo. È un APK autonomo, senza Expo Go, firmato con la stessa chiave debug delle build precedenti. Installa sopra la 1.0.0 per mantenere impostazioni, mazzi e partita salvata. Versione Android: 1.1.0, codice build 18.

Gli allegati comprendono anche `OpenGuessUp-1.1.0-source.zip` e `SHA256SUMS.txt`. La release 1.0.0 resta disponibile nello storico.

## Screenshot

<p>
  <img src="https://raw.githubusercontent.com/PaoloConteDev/OpenGuessUp/main/docs/screenshots/home-portrait-it.png" width="200" alt="Home portrait" />
  <img src="https://raw.githubusercontent.com/PaoloConteDev/OpenGuessUp/main/docs/screenshots/game-portrait-it.png" width="200" alt="Anteprima portrait della schermata reale di gioco in landscape" />
</p>

Home e schermata reale di gioco, presentate in formato portrait. Il turno si gioca in landscape, come mostrato nella seconda anteprima.

## Verifiche e limiti

Typecheck, 60 test automatici ed export web superati. APK nativo ARM64 compilato, metadati e firma controllati; controlli browser della versione nelle cinque lingue, in home e nelle impostazioni. Il sensore è coperto da test con campioni simulati: sensori, orientamento e feedback tattile richiedono ancora un collaudo su telefono fisico. Dettagli in `docs/VALIDATION.md`.
