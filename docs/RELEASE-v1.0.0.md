# Open GuessUp v1.0.0

Party game offline per Android: un telefono sulla fronte, gli amici danno gli indizi e tu indovini. Interfaccia Confetti, marchio “Open GuessUp by Gleetch”, bandiere per le cinque lingue e link alla repository nelle impostazioni.

- Partita rapida o 2–4 squadre, timer configurabile, passaggi e riepilogo modificabile.
- Dodici categorie, 3.600 voci per lingua, italiano, inglese, spagnolo, francese e tedesco.
- Mazzi personali, salvataggio locale, pausa e ripresa, controlli manuali e tramite inclinazione.
- Calibrazione del sensore con prova prima del turno, recupero del segnale e fallback manuale.
- Registrazione rimossa, insieme ai permessi per fotocamera, microfono e galleria.
- Nessun account, pubblicità, tracking o backend necessario.
- Palette rosso, verde, blu e giallo pastello su bianco freddo, con testo blu scuro.
- Icona installata uguale al simbolo della home: ScanFace blu scuro su fondo giallo, anche nella variante adattiva Android.
- Marchio senza freccia e card di scoperta categorie in azzurro chiaro, distinta dai colori pieni dei mazzi.
- Illustrazione originale della home ridisegnata, con mani che impugnano il telefono, volto espressivo e scritta “PIZZA” allineata su ogni dimensione.

## Installazione

Scarica `OpenGuessUp-1.0.0-arm64.apk` su un telefono Android ARM64 (Android 7/API 24 o successivo) e aprilo. È una build di test autonoma firmata con chiave debug, senza Expo Go. I sorgenti sono disponibili nella repo e nell'archivio `OpenGuessUp-source.zip`; i digest sono in `SHA256SUMS.txt`.

## Verifiche e limiti

Typecheck, 60 test automatici, export web/Android e prove complete nel browser superati. APK nativo compilato e firma verificata. Sensori, orientamento, feedback tattile richiedono ancora un collaudo su dispositivo fisico. I contenuti localizzati non hanno ricevuto una revisione linguistica professionale. Dettagli in `docs/VALIDATION.md`.
