// Offline content builder. Shared original family vocabulary plus original scenes.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const langs = ["it", "en", "es", "de", "fr"];
const { raw, dict } = JSON.parse(
  readFileSync(new URL("./vocabulary.json", import.meta.url), "utf8"),
);
const output = {};
const used = new Set();
function add(cat, rows) {
  output[cat] ??= [];
  for (let row of rows) {
    if (typeof row === "string") row = dict[row];
    if (!row || row.length !== 5) throw Error("Missing row " + cat);
    if (output[cat].length >= 300) break;
    if (
      output[cat].some((x) =>
        x.values.some(
          (v, i) =>
            v.toLocaleLowerCase(langs[i]) ===
            row[i].toLocaleLowerCase(langs[i]),
        ),
      )
    )
      continue;
    const id =
      cat +
      "-" +
      createHash("sha256").update(row[0]).digest("hex").slice(0, 12);
    output[cat].push({ id, values: row });
  }
}
const rows = (s) =>
  s
    .trim()
    .split("\n")
    .map((x) => x.split("|"));
const slice = (deck, a, b) => raw[deck].slice(a, b);
add("animals", [
  ...slice("natura", 1, 20),
  ...slice("natura", 37, 40),
  ...slice("natura", 40, 280),
]);
add(
  "animals",
  rows(`Squalo martello|Hammerhead shark|Tiburón martillo|Hammerhai|Requin-marteau
Squalo balena|Whale shark|Tiburón ballena|Walhai|Requin-baleine
Pesce luna|Ocean sunfish|Pez luna|Mondfisch|Poisson-lune
Pesce leone|Lionfish|Pez león|Rotfeuerfisch|Poisson-lion
Pesce pietra|Stonefish|Pez piedra|Steinfisch|Poisson-pierre
Pesce volante|Flying fish|Pez volador|Fliegender Fisch|Poisson volant
Pesce sega|Sawfish|Pez sierra|Sägefisch|Poisson-scie
Squalo bianco|Great white shark|Tiburón blanco|Weißer Hai|Grand requin blanc
Squalo tigre|Tiger shark|Tiburón tigre|Tigerhai|Requin-tigre
Drago di Komodo|Komodo dragon|Dragón de Komodo|Komodowaran|Dragon de Komodo
Tartaruga liuto|Leatherback turtle|Tortuga laúd|Lederschildkröte|Tortue luth
Tartaruga delle Galapagos|Galápagos tortoise|Tortuga de Galápagos|Galapagos-Riesenschildkröte|Tortue des Galápagos
Rana freccia|Poison dart frog|Rana dardo|Pfeilgiftfrosch|Dendrobate
Rana toro|Bullfrog|Rana toro|Ochsenfrosch|Grenouille-taureau
Cane della prateria|Prairie dog|Perrito de la pradera|Präriehund|Chien de prairie
Suricato|Meerkat|Suricata|Erdmännchen|Suricate
Okapi|Okapi|Okapi|Okapi|Okapi
Bongo|Bongo antelope|Antílope bongo|Bongoantilope|Antilope bongo
Saiga|Saiga|Saiga|Saiga|Saïga
Oritteropo|Aardvark|Cerdo hormiguero|Erdferkel|Oryctérope
Caracal|Caracal|Caracal|Karakal|Caracal
Serval|Serval|Serval|Serval|Serval
Gatto delle sabbie|Sand cat|Gato de las arenas|Sandkatze|Chat des sables
Licaone|African wild dog|Licaón|Afrikanischer Wildhund|Lycaon
Fennec|Fennec fox|Zorro fénec|Fennek|Fennec
Panda rosso|Red panda|Panda rojo|Roter Panda|Panda roux
Binturong|Binturong|Binturong|Binturong|Binturong
Quoll|Quoll|Quol|Beutelmarder|Chat marsupial
Dingo|Dingo|Dingo|Dingo|Dingo
Takin|Takin|Takín|Takin|Takin
Gaur|Gaur|Gaur|Gaur|Gaur
Zibetto|Civet|Civeta|Zibetkatze|Civette
Genetta|Genet|Gineta|Ginsterkatze|Genette
Mangusta|Mongoose|Mangosta|Manguste|Mangouste
Dik-dik|Dik-dik|Dicdic|Dikdik|Dik-dik
Impala|Impala|Impala|Impala|Impala
Springbok|Springbok|Gacela saltarina|Springbock|Springbok
Gerenuk|Gerenuk|Gerenuc|Giraffengazelle|Gazelle de Waller
Sitatunga|Sitatunga|Sitatunga|Sitatunga|Sitatunga
Nandù|Rhea|Ñandú|Nandu|Nandou
Kiwi uccello|Kiwi bird|Ave kiwi|Kiwivogel|Kiwi oiseau
Kakapo|Kakapo|Kakapo|Kakapo|Kakapo
Kea|Kea|Kea|Kea|Kéa
Quetzal|Quetzal|Quetzal|Quetzal|Quetzal
Uccello del paradiso|Bird of paradise|Ave del paraíso|Paradiesvogel|Oiseau de paradis
Uccello lira|Lyrebird|Ave lira|Leierschwanz|Oiseau-lyre
Becco a scarpa|Shoebill|Picozapato|Schuhschnabel|Bec-en-sabot
Segretario uccello|Secretary bird|Ave secretario|Sekretärvogel|Messager sagittaire
Seriema|Seriema|Seriema|Seriema|Cariama
Hoatzin|Hoatzin|Hoacín|Hoatzin|Hoazin
Fregata|Frigatebird|Fragata|Fregattvogel|Frégate
Sula|Gannet|Alcatraz|Basstölpel|Fou de Bassan
Sterna|Tern|Charrán|Seeschwalbe|Sterne
Svasso|Grebe|Somormujo|Lappentaucher|Grèbe
Folaga|Coot|Focha|Blässhuhn|Foulque
Gallinella d'acqua|Moorhen|Gallineta de agua|Teichhuhn|Gallinule
Avocetta|Avocet|Avoceta|Säbelschnäbler|Avocette
Cavaliere d'Italia|Black-winged stilt|Cigüeñuela|Stelzenläufer|Échasse blanche
Piviere|Plover|Chorlito|Regenpfeifer|Pluvier
Pettegola|Redshank|Archibebe|Rotschenkel|Chevalier gambette
Piro piro|Sandpiper|Andarríos|Wasserläufer|Chevalier guignette`),
);
add("food", slice("classico", 40, 140));
add(
  "food",
  [
    "Pizza",
    "Gelato",
    "Cioccolato",
    "Caffè",
    "Panna",
    "Panino",
    "Carne",
    "Uova",
    "Pangrattato",
    "Pane",
    "Aglio",
    "Mascarpone",
    "Savoiardi",
    "Rum",
    "Bignè",
    "Sciroppo",
    "Confettura",
    "Latticino",
    "Siero",
    "Finocchio",
    "Salsa di soia",
    "Noodles",
    "Ceci",
    "Sesamo",
    "Legumi",
    "Soia",
    "Mostarda",
    "Spezia",
    "Birra",
    "Espresso",
    "Pomodoro",
    "Latte",
    "Patate",
    "Zafferano",
  ].filter((x) => dict[x]),
);
add(
  "food",
  rows(`Carciofo|Artichoke|Alcachofa|Artischocke|Artichaut
Melanzana|Aubergine|Berenjena|Aubergine|Aubergine
Zucchina|Courgette|Calabacín|Zucchini|Courgette
Zucca|Pumpkin|Calabaza|Kürbis|Citrouille
Broccolo|Broccoli|Brócoli|Brokkoli|Brocoli
Cavolfiore|Cauliflower|Coliflor|Blumenkohl|Chou-fleur
Carota|Carrot|Zanahoria|Karotte|Carotte
Sedano|Celery|Apio|Sellerie|Céleri
Cipolla|Onion|Cebolla|Zwiebel|Oignon
Porro|Leek|Puerro|Lauch|Poireau
Ravanello|Radish|Rábano|Radieschen|Radis
Barbabietola|Beetroot|Remolacha|Rote Bete|Betterave
Rapa|Turnip|Nabo|Speiserübe|Navet
Asparago|Asparagus|Espárrago|Spargel|Asperge
Spinaci|Spinach|Espinacas|Spinat|Épinards
Bietola|Chard|Acelga|Mangold|Blette
Lattuga|Lettuce|Lechuga|Kopfsalat|Laitue
Rucola|Rocket salad|Rúcula|Rucola|Roquette
Cetriolo|Cucumber|Pepino|Gurke|Concombre
Peperone|Bell pepper|Pimiento|Paprika|Poivron
Peperoncino|Chilli pepper|Guindilla|Chilischote|Piment
Patata dolce|Sweet potato|Boniato|Süßkartoffel|Patate douce
Lenticchie|Lentils|Lentejas|Linsen|Lentilles
Fagioli|Beans|Alubias|Bohnen|Haricots
Piselli|Peas|Guisantes|Erbsen|Petits pois
Fave|Broad beans|Habas|Dicke Bohnen|Fèves
Lupini|Lupin beans|Altramuces|Lupinen|Lupins
Arachidi|Peanuts|Cacahuetes|Erdnüsse|Cacahuètes
Mandorle|Almonds|Almendras|Mandeln|Amandes
Nocciole|Hazelnuts|Avellanas|Haselnüsse|Noisettes
Pistacchi|Pistachios|Pistachos|Pistazien|Pistaches
Anacardi|Cashews|Anacardos|Cashewnüsse|Noix de cajou
Noci pecan|Pecans|Nueces pecanas|Pekannüsse|Noix de pécan
Castagne|Chestnuts|Castañas|Esskastanien|Châtaignes
Datteri|Dates|Dátiles|Datteln|Dattes
Uvetta|Raisins|Pasas|Rosinen|Raisins secs
Mirtilli|Blueberries|Arándanos|Heidelbeeren|Myrtilles
Lamponi|Raspberries|Frambuesas|Himbeeren|Framboises
More|Blackberries|Moras|Brombeeren|Mûres
Ribes|Currants|Grosellas|Johannisbeeren|Groseilles
Pompelmo|Grapefruit|Pomelo|Grapefruit|Pamplemousse
Lime|Lime|Lima|Limette|Citron vert
Papaya|Papaya|Papaya|Papaya|Papaye
Litchi|Lychee|Lichi|Litschi|Litchi
Frutto della passione|Passion fruit|Maracuyá|Passionsfrucht|Fruit de la passion
Guava|Guava|Guayaba|Guave|Goyave
Cachi|Persimmon|Caqui|Kaki|Kaki
Cedro candito|Candied citron|Cidra confitada|Zitronat|Cédrat confit
Zenzero|Ginger|Jengibre|Ingwer|Gingembre
Curcuma|Turmeric|Cúrcuma|Kurkuma|Curcuma
Cannella|Cinnamon|Canela|Zimt|Cannelle
Noce moscata|Nutmeg|Nuez moscada|Muskatnuss|Noix de muscade
Cardamomo|Cardamom|Cardamomo|Kardamom|Cardamome
Chiodi di garofano|Cloves|Clavo de olor|Gewürznelken|Clous de girofle
Anice stellato|Star anise|Anís estrellado|Sternanis|Badiane
Cumino|Cumin|Comino|Kreuzkümmel|Cumin
Coriandolo|Coriander|Cilantro|Koriander|Coriandre
Prezzemolo|Parsley|Perejil|Petersilie|Persil
Rosmarino|Rosemary|Romero|Rosmarin|Romarin
Salvia|Sage|Salvia|Salbei|Sauge
Timo|Thyme|Tomillo|Thymian|Thym
Origano|Oregano|Orégano|Oregano|Origan
Alloro|Bay leaf|Laurel|Lorbeer|Laurier
Erba cipollina|Chives|Cebollino|Schnittlauch|Ciboulette
Aneto|Dill|Eneldo|Dill|Aneth
Dragoncello|Tarragon|Estragón|Estragon|Estragon
Capperi|Capers|Alcaparras|Kapern|Câpres
Olive nere|Black olives|Aceitunas negras|Schwarze Oliven|Olives noires
Pomodori secchi|Sun-dried tomatoes|Tomates secos|Getrocknete Tomaten|Tomates séchées
Funghi porcini|Porcini mushrooms|Boletus|Steinpilze|Cèpes
Tartufo|Truffle|Trufa|Trüffel|Truffe
Funghi champignon|Button mushrooms|Champiñones|Champignons|Champignons de Paris
Quinoa|Quinoa|Quinoa|Quinoa|Quinoa
Farro|Spelt|Espelta|Dinkel|Épeautre
Orzo|Barley|Cebada|Gerste|Orge
Avena|Oats|Avena|Hafer|Avoine
Segale|Rye|Centeno|Roggen|Seigle
Grano saraceno|Buckwheat|Trigo sarraceno|Buchweizen|Sarrasin
Bulgur|Bulgur|Bulgur|Bulgur|Boulgour
Miglio|Millet|Mijo|Hirse|Millet
Seitan|Seitan|Seitán|Seitan|Seitan
Tempeh|Tempeh|Tempeh|Tempeh|Tempeh
Edamame|Edamame|Edamame|Edamame|Edamame
Miso|Miso|Miso|Miso|Miso
Wasabi|Wasabi|Wasabi|Wasabi|Wasabi
Nori|Nori|Nori|Nori|Nori
Tahina|Tahini|Tahini|Tahin|Tahini
Harissa|Harissa|Harissa|Harissa|Harissa
Sriracha|Sriracha|Sriracha|Sriracha|Sriracha
Chutney|Chutney|Chutney|Chutney|Chutney
Pico de gallo|Pico de gallo|Pico de gallo|Pico de Gallo|Pico de gallo
Chimichurri|Chimichurri|Chimichurri|Chimichurri|Chimichurri
Ajvar|Ajvar|Ajvar|Ajvar|Ajvar
Tzatziki|Tzatziki|Tzatziki|Tsatsiki|Tzatziki
Baba ganoush|Baba ganoush|Baba ganoush|Baba Ghanoush|Baba ganousch
Labneh|Labneh|Labneh|Labneh|Labné
Halloumi|Halloumi|Halloumi|Halloumi|Halloumi
Feta|Feta|Feta|Feta|Feta
Brie|Brie|Brie|Brie|Brie
Camembert|Camembert|Camembert|Camembert|Camembert
Cheddar|Cheddar|Cheddar|Cheddar|Cheddar
Gouda|Gouda|Gouda|Gouda|Gouda
Emmental|Emmental|Emmental|Emmentaler|Emmental
Roquefort|Roquefort|Roquefort|Roquefort|Roquefort
Manchego|Manchego|Manchego|Manchego|Manchego
Pecorino|Pecorino|Pecorino|Pecorino|Pecorino
Stracciatella|Stracciatella cheese|Stracciatella de queso|Stracciatella-Käse|Stracciatella fromagère
Burrata|Burrata|Burrata|Burrata|Burrata
Stracchino|Stracchino|Stracchino|Stracchino|Stracchino
Scamorza|Scamorza|Scamorza|Scamorza|Scamorza
Provolone|Provolone|Provolone|Provolone|Provolone
Fontina|Fontina|Fontina|Fontina|Fontina
Asiago|Asiago|Asiago|Asiago|Asiago
Taleggio|Taleggio|Taleggio|Taleggio|Taleggio
Montasio|Montasio|Montasio|Montasio|Montasio
Gamberi in tempura|Tempura prawns|Gambas en tempura|Tempura-Garnelen|Crevettes tempura
Poke|Poke bowl|Bol de poke|Poké-Bowl|Poke bowl
Bibimbap|Bibimbap|Bibimbap|Bibimbap|Bibimbap
Gyoza|Gyoza|Gyozas|Gyoza|Gyozas
Dim sum|Dim sum|Dim sum|Dim Sum|Dim sum
Bao|Bao buns|Panecillos bao|Bao-Brötchen|Brioches bao
Okonomiyaki|Okonomiyaki|Okonomiyaki|Okonomiyaki|Okonomiyaki
Takoyaki|Takoyaki|Takoyaki|Takoyaki|Takoyaki
Kimchi|Kimchi|Kimchi|Kimchi|Kimchi
Pad thai|Pad thai|Pad thai|Pad Thai|Pad thaï
Pho|Pho|Pho|Pho|Pho
Banh mi|Banh mi|Banh mi|Bánh mì|Banh mi
Satay|Satay|Satay|Satay|Satay
Nasi goreng|Nasi goreng|Nasi goreng|Nasi Goreng|Nasi goreng
Laksa|Laksa|Laksa|Laksa|Laksa
Tom yum|Tom yum|Tom yum|Tom Yam|Tom yum
Samosa|Samosa|Samosa|Samosa|Samoussa
Pakora|Pakora|Pakora|Pakora|Pakora
Dosa|Dosa|Dosa|Dosa|Dosa
Naan|Naan|Naan|Naan|Naan
Dal|Dal|Dal|Dal|Dal
Biryani|Biryani|Biryani|Biryani|Biryani
Vindaloo|Vindaloo|Vindaloo|Vindaloo|Vindaloo
Tandoori|Tandoori chicken|Pollo tandoori|Tandoori-Huhn|Poulet tandoori
Chana masala|Chana masala|Chana masala|Chana Masala|Chana masala
Empanada|Empanada|Empanada|Empanada|Empanada
Arepa|Arepa|Arepa|Arepa|Arepa
Ceviche|Ceviche|Ceviche|Ceviche|Ceviche
Feijoada|Feijoada|Feijoada|Feijoada|Feijoada
Churrasco|Churrasco|Churrasco|Churrasco|Churrasco
Tamales|Tamales|Tamales|Tamales|Tamales
Quesadilla|Quesadilla|Quesadilla|Quesadilla|Quesadilla
Burrito|Burrito|Burrito|Burrito|Burrito
Nachos|Nachos|Nachos|Nachos|Nachos
Churros|Churros|Churros|Churros|Churros
Flan|Flan|Flan|Flan|Flan
Dulce de leche|Dulce de leche|Dulce de leche|Dulce de Leche|Dulce de leche
Baklava|Baklava|Baklava|Baklava|Baklava
Knafeh|Knafeh|Knafeh|Künefe|Knafeh
Lokum|Turkish delight|Delicias turcas|Lokum|Loukoum
Halva|Halva|Halva|Halva|Halva
Mochi|Mochi|Mochi|Mochi|Mochi
Dorayaki|Dorayaki|Dorayaki|Dorayaki|Dorayaki
Taiyaki|Taiyaki|Taiyaki|Taiyaki|Taiyaki
Tanghulu|Tanghulu|Tanghulu|Tanghulu|Tanghulu
Kaiserschmarrn|Kaiserschmarrn|Kaiserschmarrn|Kaiserschmarrn|Kaiserschmarrn
Strudel|Strudel|Strudel|Strudel|Strudel
Sachertorte|Sachertorte|Tarta Sacher|Sachertorte|Sachertorte
Foresta nera|Black Forest cake|Tarta Selva Negra|Schwarzwälder Kirschtorte|Forêt-noire
Paris-Brest|Paris-Brest|París-Brest|Paris-Brest|Paris-brest
Éclair|Éclair|Éclair|Éclair|Éclair
Macaron|Macaron|Macarrón francés|Macaron|Macaron
Madeleine|Madeleine|Magdalena francesa|Madeleine|Madeleine
Canelé|Canelé|Canelé|Canelé|Canelé
Kouign-amann|Kouign-amann|Kouign-amann|Kouign-amann|Kouign-amann
Pastel de nata|Custard tart|Pastel de nata|Pastel de Nata|Pastel de nata
Crema catalana|Crema catalana|Crema catalana|Crema Catalana|Crème catalane
Torta di carote|Carrot cake|Tarta de zanahoria|Karottenkuchen|Gâteau aux carottes
Cheesecake|Cheesecake|Tarta de queso|Käsekuchen|Cheesecake
Brownie|Brownie|Brownie|Brownie|Brownie
Blondie|Blondie|Blondie|Blondie|Blondie
Red velvet|Red velvet cake|Tarta red velvet|Red-Velvet-Kuchen|Red velvet
Banana bread|Banana bread|Pan de plátano|Bananenbrot|Banana bread
Pavlova|Pavlova|Pavlova|Pavlova|Pavlova
Lamington|Lamington|Lamington|Lamington|Lamington
Anzac biscuit|Anzac biscuit|Galleta Anzac|Anzac-Keks|Biscuit Anzac
Sticky toffee pudding|Sticky toffee pudding|Pudin de caramelo|Sticky Toffee Pudding|Pudding au caramel
Shortbread|Shortbread|Galleta escocesa|Shortbread|Shortbread
Scone|Scone|Scone|Scone|Scone
Bagel|Bagel|Bagel|Bagel|Bagel
Pretzel|Pretzel|Bretzel|Brezel|Bretzel
Brioche|Brioche|Brioche|Brioche|Brioche
Focaccia alle olive|Olive focaccia|Focaccia de aceitunas|Olivenfocaccia|Focaccia aux olives
Pizza marinara|Marinara pizza|Pizza marinara|Pizza Marinara|Pizza marinara
Pizza quattro stagioni|Four seasons pizza|Pizza cuatro estaciones|Pizza Vier Jahreszeiten|Pizza quatre saisons
Spaghetti alla carbonara|Spaghetti carbonara|Espaguetis a la carbonara|Spaghetti Carbonara|Spaghettis carbonara
Pasta alla norma|Pasta alla Norma|Pasta a la norma|Pasta alla Norma|Pâtes à la norma
Risotto ai funghi|Mushroom risotto|Risotto de setas|Pilzrisotto|Risotto aux champignons
Gnocchi al pesto|Gnocchi with pesto|Ñoquis al pesto|Gnocchi mit Pesto|Gnocchis au pesto
Lasagne alle verdure|Vegetable lasagne|Lasaña de verduras|Gemüselasagne|Lasagnes aux légumes
Ravioli di zucca|Pumpkin ravioli|Raviolis de calabaza|Kürbisravioli|Raviolis à la courge
Tortellini in brodo|Tortellini in broth|Tortellini en caldo|Tortellini in Brühe|Tortellinis au bouillon
Zuppa di cipolle|French onion soup|Sopa de cebolla|Zwiebelsuppe|Soupe à l’oignon
Zuppa di miso|Miso soup|Sopa de miso|Misosuppe|Soupe miso
Insalata greca|Greek salad|Ensalada griega|Griechischer Salat|Salade grecque
Insalata nizzarda|Niçoise salad|Ensalada nizarda|Nizza-Salat|Salade niçoise
Tabbouleh|Tabbouleh|Tabulé|Taboulé|Taboulé
Fattoush|Fattoush|Fattush|Fattoush|Fattouche
Shakshuka|Shakshuka|Shakshuka|Schakschuka|Chakchouka
Menemen|Menemen|Menemen|Menemen|Menemen
Ratatouille|Ratatouille|Ratatouille|Ratatouille|Ratatouille
Moussaka|Moussaka|Musaca|Moussaka|Moussaka
Spanakopita|Spanakopita|Spanakopita|Spanakopita|Spanakopita
Pierogi|Pierogi|Pierogi|Pierogi|Pierogi
Pelmeni|Pelmeni|Pelmeni|Pelmeni|Pelmeni
Varenyky|Varenyky|Varényky|Wareniki|Varenyky
Gulasch|Goulash|Gulash|Gulasch|Goulasch
Borscht|Borscht|Borsch|Borschtsch|Bortsch
Stroganoff|Stroganoff|Stroganoff|Stroganoff|Stroganoff
Fish and chips|Fish and chips|Pescado con patatas|Fish and Chips|Fish and chips
Shepherd’s pie|Shepherd’s pie|Pastel de cordero|Shepherd’s Pie|Hachis d’agneau
Wellington|Beef Wellington|Solomillo Wellington|Beef Wellington|Bœuf Wellington
Jambalaya|Jambalaya|Jambalaya|Jambalaya|Jambalaya
Gumbo|Gumbo|Gumbo|Gumbo|Gumbo
Clam chowder|Clam chowder|Sopa de almejas|Muschelsuppe|Chaudrée de palourdes
Lobster roll|Lobster roll|Bocadillo de bogavante|Hummerbrötchen|Sandwich au homard`),
);
add("objects", slice("quotidiano", 60, 340));
add("objects", slice("classico", 190, 280));
add("places", slice("viaggio", 0, 320));
add("places", slice("viaggio", 320, 500));
add("nature", [
  raw.natura[0],
  ...slice("natura", 20, 37),
  ...slice("natura", 280, 500),
]);
add("nature", slice("extra", 270, 320));
add("nature", slice("extra", 400, 470));
add("ideas", slice("extra", 0, 300));
add("ideas", slice("extra", 300, 500));
add("sports", slice("spettacolo", 40, 155));
// Distinct, playable action prompts: a discipline plus a specific challenge.
const challenges =
  rows(`Allenarsi per: {w}|Train for: {w}|Entrenar para: {w}|Trainieren für: {w}|S’entraîner pour : {w}
Insegnare: {w}|Teach: {w}|Enseñar: {w}|Unterrichten: {w}|Enseigner : {w}
Festeggiare una vittoria: {w}|Celebrate a win: {w}|Celebrar una victoria: {w}|Einen Sieg feiern: {w}|Fêter une victoire : {w}`);
for (const template of challenges)
  add(
    "sports",
    slice("spettacolo", 40, 155).map((w) =>
      dict[w].map((x, i) => template[i].replace("{w}", x)),
    ),
  );
add("music", slice("spettacolo", 155, 280));
const artists =
  `ABBA|Adele|Amy Winehouse|Aretha Franklin|Arctic Monkeys|Avicii|Beyoncé|Billie Eilish|Billy Joel|Black Eyed Peas|Bob Dylan|Bob Marley|Bon Jovi|Britney Spears|Bruno Mars|BTS|Céline Dion|Cher|Coldplay|Daft Punk|David Bowie|Diana Ross|Dolly Parton|Drake|Dua Lipa|Ed Sheeran|Elton John|Elvis Presley|Eminem|Enrique Iglesias|Enya|Eric Clapton|Eurythmics|Foo Fighters|Frank Sinatra|Freddie Mercury|George Michael|Gorillaz|Green Day|Guns N’ Roses|Harry Styles|Imagine Dragons|Iron Maiden|James Brown|Jamiroquai|Janet Jackson|Jay-Z|Jennifer Lopez|Jimi Hendrix|John Lennon|Johnny Cash|Justin Bieber|Justin Timberlake|Katy Perry|Kendrick Lamar|Kiss|Lady Gaga|Lana Del Rey|Led Zeppelin|Leonard Cohen|Lizzo|Louis Armstrong|Luciano Pavarotti|Madonna|Mariah Carey|Maroon 5|Metallica|Michael Jackson|Miley Cyrus|Muse|Nina Simone|Nirvana|No Doubt|Oasis|Olivia Rodrigo|One Direction|Outkast|Ozzy Osbourne|Paramore|Pearl Jam|Pet Shop Boys|Pharrell Williams|Phil Collins|Pink|Pink Floyd|Pitbull|Prince|Queen|R.E.M.|Radiohead|Rammstein|Ray Charles|Red Hot Chili Peppers|Rihanna|Robbie Williams|Rosalía|Sam Smith|Santana|Sia|Shakira|Shawn Mendes|Snoop Dogg|Spice Girls|Stevie Wonder|Sting|Stromae|System of a Down|Taylor Swift|The Beatles|The Cure|The Doors|The Police|The Rolling Stones|The Weeknd|Tina Turner|Toto|U2|Usher|Van Halen|Vangelis|Village People|Whitney Houston|Willie Nelson|Zaz|Zucchero|Andrea Bocelli|Angèle|Anitta|Bad Bunny|Björk|BLACKPINK|Buena Vista Social Club|Daddy Yankee|Édith Piaf|Eros Ramazzotti|Estopa|Fela Kuti|Gipsy Kings|Jacques Brel|Juanes|Julio Iglesias|Karol G|Kraftwerk|Laura Pausini|Luis Fonsi|Manu Chao|Måneskin|Mika|Miriam Makeba|Nek|Nena|Pablo Alborán|Raffaella Carrà|Rauw Alejandro|Ricky Martin|Rita Ora|Roxette|Sade|Seal|Sergio Mendes|Soolking|Tiziano Ferro|Tom Jones|Tracy Chapman|Vasco Rossi|Vianney|Vitaa|Woodkid|Youssou N’Dour|Zazie|Zimmer|Hans Zimmer|Ludovico Einaudi|Yann Tiersen|Joe Hisaishi|John Williams|Ennio Morricone|Max Richter|Philip Glass|Ryuichi Sakamoto|Lindsey Stirling|Yo-Yo Ma|Yuja Wang|Lang Lang|Nicola Benedetti|Hilary Hahn|Joshua Bell|Daniil Trifonov|Martha Argerich|Anne-Sophie Mutter`.split(
    "|",
  );
add(
  "music",
  artists.map((w) => Array(5).fill(w)),
);
// These scene packs use translated full clauses, not numbered filler. Each pair
// changes the action or the object that players must communicate.
const actions =
  rows(`Cercare gli occhiali|Look for your glasses|Buscar las gafas|Die Brille suchen|Chercher ses lunettes
Aprire un ombrello|Open an umbrella|Abrir un paraguas|Einen Regenschirm öffnen|Ouvrir un parapluie
Gonfiare un palloncino|Blow up a balloon|Inflar un globo|Einen Luftballon aufblasen|Gonfler un ballon
Preparare un caffè|Make coffee|Preparar café|Kaffee kochen|Préparer un café
Lavarsi i denti|Brush your teeth|Lavarse los dientes|Zähne putzen|Se brosser les dents
Allacciarsi le scarpe|Tie your shoelaces|Atarse los cordones|Schuhe binden|Faire ses lacets
Camminare sui tacchi|Walk in high heels|Caminar con tacones|Auf hohen Absätzen gehen|Marcher en talons
Scattare un selfie|Take a selfie|Hacerse un selfi|Ein Selfie machen|Prendre un selfie
Montare una tenda|Pitch a tent|Montar una tienda|Ein Zelt aufbauen|Monter une tente
Accendere un falò|Light a campfire|Encender una fogata|Ein Lagerfeuer anzünden|Allumer un feu de camp
Remare in canoa|Paddle a canoe|Remar en canoa|Kanu paddeln|Pagayer en canoë
Pattinare sul ghiaccio|Ice skate|Patinar sobre hielo|Schlittschuh laufen|Patiner sur glace
Soffiare le candeline|Blow out birthday candles|Soplar las velas|Geburtstagskerzen ausblasen|Souffler les bougies
Impastare il pane|Knead bread dough|Amasar pan|Brotteig kneten|Pétrir du pain
Stendere il bucato|Hang out the washing|Tender la ropa|Wäsche aufhängen|Étendre le linge
Stirare una camicia|Iron a shirt|Planchar una camisa|Ein Hemd bügeln|Repasser une chemise
Portare a spasso il cane|Walk the dog|Pasear al perro|Den Hund ausführen|Promener le chien
Inseguire un autobus|Chase a bus|Correr tras el autobús|Einem Bus nachlaufen|Courir après un bus
Fare il direttore d’orchestra|Conduct an orchestra|Dirigir una orquesta|Ein Orchester dirigieren|Diriger un orchestre
Suonare una chitarra|Play a guitar|Tocar una guitarra|Gitarre spielen|Jouer de la guitare
Sollevare una valigia|Lift a suitcase|Levantar una maleta|Einen Koffer heben|Soulever une valise
Spingere un carrello|Push a trolley|Empujar un carrito|Einen Einkaufswagen schieben|Pousser un chariot
Pelare una patata|Peel a potato|Pelar una patata|Eine Kartoffel schälen|Éplucher une pomme de terre
Tagliare una cipolla|Chop an onion|Cortar una cebolla|Eine Zwiebel schneiden|Couper un oignon
Mangiare spaghetti|Eat spaghetti|Comer espaguetis|Spaghetti essen|Manger des spaghettis
Bere una zuppa|Drink soup|Tomar sopa|Suppe trinken|Boire une soupe
Pescare con la canna|Fish with a rod|Pescar con caña|Mit einer Angel fischen|Pêcher à la ligne
Nuotare a dorso|Swim backstroke|Nadar de espaldas|Rückenschwimmen|Nager sur le dos
Fare un tuffo|Dive into a pool|Tirarse a la piscina|Ins Becken springen|Plonger dans une piscine
Scalare una parete|Climb a wall|Escalar una pared|Eine Wand erklettern|Escalader une paroi
Fare una riverenza|Take a bow|Hacer una reverencia|Sich verbeugen|Faire une révérence
Servire un vassoio|Carry a serving tray|Llevar una bandeja|Ein Tablett tragen|Porter un plateau
Sventolare una bandiera|Wave a flag|Agitar una bandera|Eine Fahne schwenken|Agiter un drapeau
Scartare un regalo|Unwrap a present|Abrir un regalo|Ein Geschenk auspacken|Déballer un cadeau
Leggere una mappa|Read a map|Leer un mapa|Eine Karte lesen|Lire une carte
Cercare le chiavi|Look for your keys|Buscar las llaves|Schlüssel suchen|Chercher ses clés
Aprire un barattolo|Open a jar|Abrir un tarro|Ein Schraubglas öffnen|Ouvrir un bocal
Scacciare una zanzara|Swat a mosquito|Espantar un mosquito|Eine Mücke verscheuchen|Chasser un moustique
Fare un castello di sabbia|Build a sandcastle|Hacer un castillo de arena|Eine Sandburg bauen|Construire un château de sable
Giocare a bowling|Go bowling|Jugar a los bolos|Bowling spielen|Jouer au bowling
Lanciare un frisbee|Throw a frisbee|Lanzar un frisbi|Eine Frisbee werfen|Lancer un frisbee
Fare una foto di gruppo|Take a group photo|Hacer una foto de grupo|Ein Gruppenfoto machen|Prendre une photo de groupe
Cucire un bottone|Sew on a button|Coser un botón|Einen Knopf annähen|Recoudre un bouton
Dipingere una parete|Paint a wall|Pintar una pared|Eine Wand streichen|Peindre un mur
Svitare una lampadina|Unscrew a light bulb|Desenroscar una bombilla|Eine Glühbirne herausdrehen|Dévisser une ampoule
Lavare una finestra|Clean a window|Limpiar una ventana|Ein Fenster putzen|Nettoyer une fenêtre
Passare l’aspirapolvere|Vacuum the floor|Pasar la aspiradora|Staubsaugen|Passer l’aspirateur
Cambiare una gomma|Change a tyre|Cambiar una rueda|Einen Reifen wechseln|Changer une roue
Parcheggiare un’auto|Park a car|Aparcar un coche|Ein Auto einparken|Garer une voiture
Guidare un trattore|Drive a tractor|Conducir un tractor|Einen Traktor fahren|Conduire un tracteur
Spalare la neve|Shovel snow|Quitar nieve con pala|Schnee schaufeln|Déblayer la neige
Raccogliere mele|Pick apples|Recoger manzanas|Äpfel pflücken|Cueillir des pommes
Innaffiare le piante|Water the plants|Regar las plantas|Pflanzen gießen|Arroser les plantes
Potare una siepe|Trim a hedge|Podar un seto|Eine Hecke schneiden|Tailler une haie
Lavare un cane|Wash a dog|Bañar a un perro|Einen Hund waschen|Laver un chien
Far addormentare un bebè|Rock a baby to sleep|Dormir a un bebé|Ein Baby in den Schlaf wiegen|Bercer un bébé
Fare una treccia|Braid hair|Hacer una trenza|Einen Zopf flechten|Faire une tresse
Truccarsi allo specchio|Put on makeup in a mirror|Maquillarse ante el espejo|Sich vor dem Spiegel schminken|Se maquiller devant un miroir
Sbucciare una banana|Peel a banana|Pelar un plátano|Eine Banane schälen|Éplucher une banane
Srotolare un tappeto|Unroll a carpet|Desenrollar una alfombra|Einen Teppich ausrollen|Dérouler un tapis`);
const modifiers = rows(`{w}|{w}|{w}|{w}|{w}
{w} al rallentatore|{w} in slow motion|{w} a cámara lenta|{w} in Zeitlupe|{w} au ralenti
{w} senza fare rumore|{w} without making a sound|{w} sin hacer ruido|{w} ohne ein Geräusch|{w} sans faire de bruit
{w} con i guanti da forno|{w} wearing oven gloves|{w} con guantes de horno|{w} mit Ofenhandschuhen|{w} avec des gants de cuisine
{w} su una nave che oscilla|{w} on a rocking ship|{w} en un barco que se balancea|{w} auf einem schwankenden Schiff|{w} sur un bateau qui tangue`);
for (const m of modifiers)
  add(
    "actions",
    actions.map((a) => a.map((s, i) => m[i].replace("{w}", s))),
  );
const jobs = rows(`Panettiere|Baker|Panadero|Bäcker|Boulanger
Pasticciere|Pastry chef|Pastelero|Konditor|Pâtissier
Pizzaiolo|Pizza chef|Pizzero|Pizzabäcker|Pizzaiolo
Cuoco|Chef|Cocinero|Koch|Cuisinier
Cameriere|Waiter|Camarero|Kellner|Serveur
Barista|Barista|Barista|Barista|Barista
Sommelier|Sommelier|Sumiller|Sommelier|Sommelier
Macellaio|Butcher|Carnicero|Metzger|Boucher
Pescivendolo|Fishmonger|Pescadero|Fischhändler|Poissonnier
Fruttivendolo|Greengrocer|Frutero|Gemüsehändler|Primeur
Medico|Doctor|Médico|Arzt|Médecin
Infermiere|Nurse|Enfermero|Krankenpfleger|Infirmier
Dentista|Dentist|Dentista|Zahnarzt|Dentiste
Veterinario|Vet|Veterinario|Tierarzt|Vétérinaire
Farmacista|Pharmacist|Farmacéutico|Apotheker|Pharmacien
Ottico|Optician|Óptico|Optiker|Opticien
Fisioterapista|Physiotherapist|Fisioterapeuta|Physiotherapeut|Kinésithérapeute
Chirurgo|Surgeon|Cirujano|Chirurg|Chirurgien
Ostetrica|Midwife|Matrona|Hebamme|Sage-femme
Massaggiatore|Massage therapist|Masajista|Masseur|Masseur
Pompiere|Firefighter|Bombero|Feuerwehrmann|Pompier
Poliziotto|Police officer|Policía|Polizist|Policier
Bagnino|Lifeguard|Socorrista|Rettungsschwimmer|Maître-nageur
Pilota|Pilot|Piloto|Pilot|Pilote
Marinaio|Sailor|Marinero|Matrose|Marin
Astronauta|Astronaut|Astronauta|Astronaut|Astronaute
Autista|Driver|Conductor|Fahrer|Chauffeur
Tassista|Taxi driver|Taxista|Taxifahrer|Chauffeur de taxi
Capotreno|Train conductor|Revisor de tren|Zugbegleiter|Contrôleur de train
Assistente di volo|Flight attendant|Auxiliar de vuelo|Flugbegleiter|Personnel de cabine
Muratore|Bricklayer|Albañil|Maurer|Maçon
Falegname|Carpenter|Carpintero|Tischler|Menuisier
Idraulico|Plumber|Fontanero|Klempner|Plombier
Elettricista|Electrician|Electricista|Elektriker|Électricien
Imbianchino|Decorator|Pintor de brocha gorda|Maler|Peintre en bâtiment
Meccanico|Mechanic|Mecánico|Mechaniker|Mécanicien
Saldatore|Welder|Soldador|Schweißer|Soudeur
Vetraio|Glazier|Cristalero|Glaser|Vitrier
Fabbro|Blacksmith|Herrero|Schmied|Forgeron
Calzolaio|Cobbler|Zapatero|Schuhmacher|Cordonnier
Sarto|Tailor|Sastre|Schneider|Tailleur
Parrucchiere|Hairdresser|Peluquero|Friseur|Coiffeur
Barbiere|Barber|Barbero|Barbier|Barbier
Truccatore|Makeup artist|Maquillador|Visagist|Maquilleur
Fotografo|Photographer|Fotógrafo|Fotograf|Photographe
Giornalista|Journalist|Periodista|Journalist|Journaliste
Presentatore|TV host|Presentador|Moderator|Présentateur
Attore|Actor|Actor|Schauspieler|Acteur
Regista|Film director|Director de cine|Regisseur|Réalisateur
Mago|Magician|Mago|Zauberer|Magicien
Clown|Clown|Payaso|Clown|Clown
Acrobata|Acrobat|Acróbata|Akrobat|Acrobate
Giardiniere|Gardener|Jardinero|Gärtner|Jardinier
Contadino|Farmer|Agricultor|Landwirt|Agriculteur
Apicoltore|Beekeeper|Apicultor|Imker|Apiculteur
Pescatore|Fisher|Pescador|Fischer|Pêcheur
Archeologo|Archaeologist|Arqueólogo|Archäologe|Archéologue
Bibliotecario|Librarian|Bibliotecario|Bibliothekar|Bibliothécaire
Insegnante|Teacher|Profesor|Lehrer|Enseignant
Postino|Postman|Cartero|Briefträger|Facteur`);
const jobScenes = rows(`{w}|{w}|{w}|{w}|{w}
{w} al primo giorno|{w} on the first day|{w} en su primer día|{w} am ersten Tag|{w} le premier jour
{w} che insegna a un apprendista|{w} teaching an apprentice|{w} enseñando a un aprendiz|{w} beim Einweisen eines Lehrlings|{w} qui forme un apprenti
{w} che cerca gli attrezzi|{w} looking for tools|{w} buscando herramientas|{w} bei der Werkzeugsuche|{w} qui cherche ses outils
{w} in una giornata frenetica|{w} on a hectic day|{w} en un día frenético|{w} an einem hektischen Tag|{w} lors d’une journée agitée`);
for (const m of jobScenes)
  add(
    "jobs",
    jobs.map((a) => a.map((s, i) => m[i].replace("{w}", s))),
  );
const fantasy = rows(`Un drago|A dragon|Un dragón|Ein Drache|Un dragon
Un unicorno|A unicorn|Un unicornio|Ein Einhorn|Une licorne
Un vampiro|A vampire|Un vampiro|Ein Vampir|Un vampire
Uno zombie|A zombie|Un zombi|Ein Zombie|Un zombie
Una strega|A witch|Una bruja|Eine Hexe|Une sorcière
Un fantasma|A ghost|Un fantasma|Ein Geist|Un fantôme
Un orco|An ogre|Un ogro|Ein Oger|Un ogre
Una sirena|A mermaid|Una sirena|Eine Meerjungfrau|Une sirène
Un folletto|A sprite|Un duende|Ein Kobold|Un lutin
Una fata|A fairy|Un hada|Eine Fee|Une fée
Un mago|A wizard|Un mago|Ein Zauberer|Un sorcier
Un cavaliere|A knight|Un caballero|Ein Ritter|Un chevalier
Una principessa|A princess|Una princesa|Eine Prinzessin|Une princesse
Un re|A king|Un rey|Ein König|Un roi
Un elfo|An elf|Un elfo|Ein Elf|Un elfe
Uno gnomo|A gnome|Un gnomo|Ein Gnom|Un gnome
Un gigante|A giant|Un gigante|Ein Riese|Un géant
Un troll|A troll|Un trol|Ein Troll|Un troll
Un licantropo|A werewolf|Un hombre lobo|Ein Werwolf|Un loup-garou
Una mummia|A mummy|Una momia|Eine Mumie|Une momie
Un pirata|A pirate|Un pirata|Ein Pirat|Un pirate
Un ninja|A ninja|Un ninja|Ein Ninja|Un ninja
Un robot|A robot|Un robot|Ein Roboter|Un robot
Un alieno|An alien|Un alienígena|Ein Alien|Un extraterrestre
Un supereroe|A superhero|Un superhéroe|Ein Superheld|Un super-héros
Un pupazzo di neve|A snowman|Un muñeco de nieve|Ein Schneemann|Un bonhomme de neige
Un mostro marino|A sea monster|Un monstruo marino|Ein Seeungeheuer|Un monstre marin
Un centauro|A centaur|Un centauro|Ein Zentaur|Un centaure
Un minotauro|A minotaur|Un minotauro|Ein Minotaurus|Un minotaure
Un ciclope|A cyclops|Un cíclope|Ein Zyklop|Un cyclope`);
const fantasyScenes =
  rows(`{w} cerca casa|{w} goes house hunting|{w} busca casa|{w} sucht ein Zuhause|{w} cherche une maison
{w} impara a ballare|{w} learns to dance|{w} aprende a bailar|{w} lernt tanzen|{w} apprend à danser
{w} perde la voce|{w} loses their voice|{w} pierde la voz|{w} verliert die Stimme|{w} perd sa voix
{w} prepara la colazione|{w} makes breakfast|{w} prepara el desayuno|{w} macht Frühstück|{w} prépare le petit-déjeuner
{w} prende il treno|{w} catches a train|{w} toma el tren|{w} nimmt den Zug|{w} prend le train
{w} va dal dentista|{w} visits the dentist|{w} va al dentista|{w} geht zum Zahnarzt|{w} va chez le dentiste
{w} cerca il telecomando|{w} looks for the remote|{w} busca el mando|{w} sucht die Fernbedienung|{w} cherche la télécommande
{w} fa un colloquio|{w} attends a job interview|{w} hace una entrevista|{w} hat ein Vorstellungsgespräch|{w} passe un entretien
{w} si allena in palestra|{w} works out at the gym|{w} entrena en el gimnasio|{w} trainiert im Fitnessstudio|{w} s’entraîne à la salle
{w} festeggia il compleanno|{w} celebrates a birthday|{w} celebra su cumpleaños|{w} feiert Geburtstag|{w} fête son anniversaire`);
for (const m of fantasyScenes)
  add(
    "fantasy",
    fantasy.map((a) => a.map((s, i) => m[i].replace("{w}", s))),
  );
const feelings =
  `Altruismo|Egoismo|Ottimismo|Pessimismo|Entusiasmo|Malinconia|Gelosia|Invidia|Orgoglio|Vergogna|Imbarazzo|Gratitudine|Riconciliazione|Perdono|Rancore|Rimpianto|Rimorso|Compassione|Tenerezza|Affetto|Amicizia|Lealtà|Fedeltà|Fiducia|Diffidenza|Sincerità|Ipocrisia|Umiltà|Superbia|Vanità|Timidezza|Estroversione|Introversione|Autostima|Autocritica|Autocontrollo|Determinazione|Perseveranza|Pigrizia|Procrastinazione|Impazienza|Frustrazione|Soddisfazione|Delusione|Speranza|Desiderio|Ambizione|Meraviglia|Stupore|Sconcerto|Nervosismo|Serenità|Noia|Solitudine|Solidarietà|Tolleranza|Rispetto|Responsabilità|Consapevolezza|Concentrazione`
    .split("|")
    .map((w) => dict[w]);
const feelingScenes = rows(`{w}|{w}|{w}|{w}|{w}
Mostrare {w} con il viso|Show {w} with your face|Mostrar {w} con la cara|{w} mit dem Gesicht zeigen|Montrer : {w}, avec le visage
Raccontare una notizia con {w}|Tell news with {w}|Dar una noticia con {w}|Eine Nachricht mit {w} erzählen|Annoncer une nouvelle avec : {w}
Ricevere un regalo con {w}|Receive a gift with {w}|Recibir un regalo con {w}|Ein Geschenk mit {w} empfangen|Recevoir un cadeau avec : {w}
Entrare in scena con {w}|Enter a scene with {w}|Entrar en escena con {w}|Mit {w} die Bühne betreten|Entrer en scène avec : {w}`);
for (const m of feelingScenes)
  add(
    "emotions",
    feelings.map((a) => a.map((s, i) => m[i].replace("{w}", s))),
  );
const travelScenes =
  rows(`Fare la valigia per: {w}|Pack for: {w}|Hacer la maleta para: {w}|Koffer packen für: {w}|Faire sa valise pour : {w}
Mandare una cartolina da: {w}|Send a postcard from: {w}|Enviar una postal desde: {w}|Eine Postkarte schicken aus: {w}|Envoyer une carte postale de : {w}
Fare da guida a: {w}|Be a tour guide in: {w}|Ser guía en: {w}|Reiseführer spielen in: {w}|Être guide à : {w}
Prenotare una vacanza a: {w}|Book a holiday in: {w}|Reservar vacaciones en: {w}|Urlaub buchen in: {w}|Réserver des vacances à : {w}
Perdersi a: {w}|Get lost in: {w}|Perderse en: {w}|Sich verlaufen in: {w}|Se perdre à : {w}`);
for (const m of travelScenes)
  add(
    "travel",
    slice("viaggio", 40, 100).map((w) =>
      dict[w].map((s, i) => m[i].replace("{w}", s)),
    ),
  );
add(
  "emotions",
  rows(`Sorpresa a una festa segreta|Surprise at a secret party|Sorpresa en una fiesta secreta|Überraschung bei einer geheimen Party|Surprise lors d’une fête secrète
Paura sulle montagne russe|Fear on a roller coaster|Miedo en una montaña rusa|Angst auf der Achterbahn|Peur dans les montagnes russes
Sollievo dopo un esame|Relief after an exam|Alivio tras un examen|Erleichterung nach einer Prüfung|Soulagement après un examen
Orgoglio per una torta riuscita|Pride in a perfect cake|Orgullo por una tarta perfecta|Stolz auf einen gelungenen Kuchen|Fierté devant un gâteau réussi
Gelosia per l’ultima fetta|Jealousy over the last slice|Celos por la última porción|Eifersucht auf das letzte Stück|Jalousie pour la dernière part`),
);
delete output.ideas;
for (const [cat, list] of Object.entries(output)) {
  if (list.length !== 300) throw Error(cat + ": " + list.length);
  for (const w of list) {
    if (used.has(w.id)) throw Error("id collision");
    used.add(w.id);
  }
}
writeFileSync(
  new URL("../src/data/content.json", import.meta.url),
  JSON.stringify(output, null, 1) + "\n",
);
console.log(
  Object.fromEntries(Object.entries(output).map(([k, v]) => [k, v.length])),
);
