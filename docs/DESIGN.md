# Identità Open GuessUp — Confetti 1.0.0

Rosso, verde, blu e giallo pastello su una base bianco freddo. Il testo blu scuro sostituisce il prugna; le superfici colorate sostituiscono crema, pesca e rosa. La pelle dell’illustrazione mantiene una tonalità naturale.

| Ruolo | Colore |
| --- | --- |
| Sfondo bianco freddo | `#F7FAFF` |
| Pannelli bianchi | `#FFFFFF` |
| Rosso pastello / passaggi | `#F39A93` |
| Verde pastello / corretto | `#A9D7AF` |
| Blu pastello | `#A4C8F0` |
| Giallo pastello / CTA e logo | `#F4D875` |
| Testo blu scuro | `#26344A` |
| Accento blu accessibile | `#285E9B` |
| Successo verde accessibile | `#286A42` |
| Avviso rosso accessibile | `#B63C36` |

La card “La tua prossima ossessione?” usa azzurro chiaro `#E1EEFC` (premuta `#D0E3FA`), distinto dal blu pieno delle categorie. Bordo `#D8E1EC`, testo secondario `#5D6979`, superfici secondarie `#E9F2FC`. Le categorie e i quattro colori disponibili per i nuovi mazzi personali usano gli stessi token del tema. I mazzi personali esistenti mantengono il colore scelto dall’utente.

La CTA della home e il marchio sono gialli; la navigazione attiva è verde. Il titolo in evidenza e gli altri pulsanti usano il blu scuro. Le categorie distribuiscono i quattro colori, con icone e testi scuri coordinati. Corretto e passaggio si distinguono anche per testo e icone.

Outfit, pulsanti grandi, schede arrotondate e animazioni brevi mantengono la parentela con Open Taboo. Il tema è in `src/theme.ts`; `accentInk` adatta le etichette e `textOn` sceglie fra blu scuro e bianco in base al contrasto. Rigenerazione asset: `npm run assets`.

L’illustrazione originale della home è disegnata in SVG dentro `src/components/HeroArt.tsx`: ragazzo sorridente, mani che impugnano il telefono sulla fronte, maglietta verde e coriandoli nei quattro colori. Capelli, dita, cuciture, riflesso del display e ombre leggere definiscono la figura. “PIZZA” e il badge tradotto sono parte dello stesso SVG e scalano insieme alla scena, con i font Outfit locali. La proporzione 460:360 mantiene l’allineamento su mobile e desktop. Anteprima: `hero-1280.png`.

L’icona installata riprende il simbolo Lucide ScanFace a sinistra del nome nella home: fondo giallo, tratto blu scuro da 2,4 e inclinazione di −5°. La variante adattiva rientra nell’area sicura Android; anche la favicon riprende lo stesso marchio. La firma “by Gleetch” compare sotto “Open GuessUp”, senza freccia. Il selettore lingua mostra bandiere vettoriali locali per tutte le cinque lingue.

Contrasti misurati: testo/sfondo **12,0:1**, secondario/sfondo **5,3:1**, testo/rosso **5,9:1**, testo/verde **7,8:1**, testo/blu **7,2:1**, testo/giallo **8,9:1**. Bianco su blu, verde e rosso scuri: rispettivamente **6,6:1**, **6,5:1** e **5,7:1**.
