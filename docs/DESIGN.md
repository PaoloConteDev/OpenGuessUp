# Identità Open GuessUp — Confetti 1.0.0

Revisione più leggera di Confetti: sfondo crema caldo, menta e albicocca sulle superfici, lampone limitato a piccoli dettagli. Il verde scuro evidenzia titoli e comandi secondari; il prugna resta il colore del testo.

| Ruolo | Colore |
| --- | --- |
| Sfondo crema | `#FFF9F0` |
| Schede bianche | `#FFFFFF` |
| CTA principale e marchio albicocca | `#FFB05A` |
| Navigazione attiva e corretto menta | `#9AD7C7` |
| Titoli evidenziati e altri pulsanti | `#286554` |
| Testo prugna | `#422339` |
| Piccoli accenti lampone | `#AF2F63` |

Neutri e derivati: superfici menta chiaro `#E4F3EC`, pesca `#FFD4AC`, bordi neutri `#DDDCD2`, testo secondario `#6B6267`, passaggi pesca `#F5C3AA`, avvisi lampone scuro `#9C2854`.

Il lampone compare nel piccolo badge della home e in una categoria, senza occupare grandi superfici. La CTA della home è albicocca con testo scuro; la barra flottante usa menta con testo scuro. Le altre selezioni sono verdi con testo bianco. Le categorie alternano soprattutto menta e albicocca. Corretto e passaggio si distinguono anche per testo e icone. I mazzi personali mantengono i colori salvati.

Logo, icona Android, illustrazione e anteprima seguono la revisione. Outfit, pulsanti grandi, schede arrotondate e animazioni brevi mantengono la parentela con Open Taboo. Tema in `src/theme.ts`; `accentInk` adatta le etichette e `textOn` sceglie fra prugna e bianco in base al contrasto. Rigenerazione: `npm run assets`.

L’icona installata usa lo stesso simbolo Lucide ScanFace a sinistra del nome nella home: fondo albicocca, tratto prugna da 2,4 e inclinazione di −5°. La variante adattiva mantiene il simbolo nell’area sicura Android; anche la favicon riprende lo stesso marchio.

La firma “by Gleetch” compare sotto il nome nel marchio dei menu. Il selettore lingua mostra una bandiera vettoriale locale al posto della sigla, anche nella lista delle cinque lingue, seguendo il componente di Open Taboo consultato in sola lettura. Le etichette accessibili mantengono il nome della lingua; il rendering non dipende da emoji o connessioni. La testata adatta gli spazi anche a schermi larghi 320 px.

Contrasti sui colori pieni: testo/sfondo **13,1:1**, secondario/sfondo **5,6:1**, bianco/verde **6,8:1**, testo/menta **8,4:1**, testo/albicocca **7,6:1**, testo/pesca passaggio **8,7:1**.
