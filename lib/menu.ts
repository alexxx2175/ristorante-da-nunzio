import type { MenuSection } from '@/components/sections/MenuScaffold'
import { dishPhoto } from './images'

/**
 * Il menù del locale, trascritto da `NUNZIO_menu 2026.pdf` (edizione 2026).
 *
 * Ogni voce porta il nome italiano, la riga di ingredienti dove il menù ce
 * l'ha, e le versioni tedesca e inglese: a Malcesine la clientela e' in buona
 * parte di lingua tedesca e inglese, ed e' il motivo per cui il menù cartaceo
 * e' gia' su tre lingue.
 *
 * **I nomi sono in tondo, non in maiuscolo.** Sul cartaceo sono tutti in
 * maiuscolo, ma quella e' impaginazione: un maiuscolo lungo si legge peggio a
 * schermo e alcuni screen reader lo sillabano lettera per lettera. Il testo e'
 * lo stesso, cambia la cassa.
 *
 * **Dove il PDF non ha una traduzione, qui non c'e'.** Alcuni piatti hanno solo
 * il tedesco o solo l'inglese: la voce viene resa senza, invece di inventare.
 *
 * Prezzi in euro come sul cartaceo. Aggiornandoli qui cambiano ovunque.
 *
 * **Le fotografie stanno solo dove il piatto e' riconoscibile con certezza.**
 * Undici voci su venticinque ne hanno una; le altre no, e non e' una svista.
 * Fra le foto disponibili non c'e' niente che le ritragga senza dubbio, e una
 * foto sbagliata accanto a una voce di menù non e' un difetto estetico: dice al
 * cliente che ordinera' una cosa diversa da quella che arriva.
 */

/* --- Menu degustazione (pagina 3 del PDF) --------------------------------- */

export const tastingMenu = {
  title: 'Menu degustazione',
  note: 'Su prenotazione',
  it: [
    'Un percorso di 5 portate studiate dallo chef.',
    'Vini in abbinamento selezionati dalla nostra cantina.',
  ],
  de: [
    'Degustationsmenü nur mit Reservierung.',
    'Ein 5-Gänge-Menü, kreiert von unserem Chef.',
    'Passende Weine, ausgewählt aus unserem Weinkeller.',
  ],
  en: [
    'Tasting menu by reservation.',
    'A 5-course journey created by our chef.',
    'Wines paired and selected from our cellar.',
  ],
} as const

/* --- Piatti ---------------------------------------------------------------- */

export const foodSections: MenuSection[] = [
  {
    title: 'Antipasti',
    items: [
      {
        name: 'Gelato all’olio di Malcesine, crumble di pane e sarde di lago',
        photo: dishPhoto.sardeGelato,
        de: 'Eis aus Malcesine-Olivenöl mit Brot-Crumble und Seesardinen',
        en: 'Malcesine olive oil ice cream with bread crumble and lake sardines',
        price: '€ 18,00',
      },
      {
        name: 'Seppia e piselli',
        photo: dishPhoto.seppiaPiselli,
        de: 'Sepia mit Erbsen',
        price: '€ 16,00',
      },
      {
        name: 'Tartare di manzo, insalatina di cavolo cappuccio marinato',
        photo: dishPhoto.tartare,
        de: 'Rindertatar mit mariniertem Spitzkohl-Salat',
        en: 'Beef tartare with marinated cabbage salad',
        price: '€ 17,00',
      },
      {
        name: 'Porro, grana e pere in osmosi',
        photo: dishPhoto.porroGranaPere,
        de: 'Lauch, Grana-Käse und osmotisch marinierte Birnen',
        en: 'Leek, Grana cheese and osmosis-marinated pears',
        price: '€ 14,00',
      },
      {
        name: 'Carpaccio di melanzane, acciughe, pesto di pomodori secchi e miele del Baldo',
        photo: dishPhoto.carpaccioMelanzane,
        de: 'Auberginen-Carpaccio mit Sardellen, getrocknetem Tomatenpesto und Baldo-Honig',
        en: 'Eggplant carpaccio with anchovies, sun-dried tomato pesto and Baldo honey',
        price: '€ 14,00',
      },
      {
        name: 'Polpo e fagioli all’occhio nero di Oliveto Citra',
        photo: dishPhoto.polpoFagioli,
        de: 'Oktopus mit Schwarzaugenbohnen aus Oliveto Citra',
        en: 'Octopus with black-eyed beans from Oliveto Citra',
        price: '€ 16,00',
      },
      {
        name: 'Crema di pane, cozze e olio all’erba cipollina',
        photo: dishPhoto.cremaPaneCozze,
        de: 'Brotcreme mit Miesmuscheln und Schnittlauchöl',
        en: 'Bread cream with mussels and chive oil',
        price: '€ 16,00',
      },
    ],
  },
  {
    title: 'Primi piatti',
    items: [
      {
        name: 'Calamarata ai frutti di mare',
        photo: dishPhoto.calamarata,
        de: 'Calamarata mit Meeresfrüchten',
        en: 'Calamarata pasta with seafood',
        price: '€ 22,00',
      },
      {
        name: 'Mezze maniche alla gricia',
        photo: dishPhoto.mezzeManiche,
        description: 'Burro al tartufo nero, guanciale e pecorino romano',
        de: 'Mezze Maniche nach Gricia-Art (schwarze Trüffelbutter, Guanciale und Pecorino Romano)',
        price: '€ 17,00',
      },
      {
        name: 'Spaghetti al nero',
        photo: dishPhoto.neroSeppia,
        description: 'Ortica, fondo di seppia, alici e burro',
        de: 'Spaghetti mit Sepiatinte, Brennnessel, Sepiafond und Forellenkaviar',
        price: '€ 18,00',
      },
      {
        name: 'Linguine ai tre pomodori e stracciatella di burrata',
        photo: dishPhoto.linguinePomodori,
        de: 'Linguine mit drei Tomatensorten und Burrata-Stracciatella',
        en: 'Linguine with three varieties of tomato and burrata stracciatella',
        price: '€ 16,00',
      },
      {
        name: 'Tagliatelle',
        photo: dishPhoto.tagliatelleFunghi,
        description: 'Funghi, gamberi, aglio, olio e peperoncino',
        de: 'Tagliatelle mit Pilzen, Garnelen, Knoblauch, Olivenöl und Chili',
        en: 'Tagliatelle with mushrooms, prawns, garlic, olive oil and chili',
        price: '€ 18,00',
      },
      {
        name: 'Spaghettone cacio e pepe',
        photo: dishPhoto.cacioPepe,
        de: 'Spaghettoni mit Käse und schwarzer Pfeffer',
        en: 'Spaghettoni with cheese and black pepper',
        price: '€ 16,00',
      },
      {
        name: 'Pasta, patate, provola affumicata e cozze',
        photo: dishPhoto.pastaPatateCozze,
        de: 'Pasta mit Kartoffeln, geräucherter Provola und Miesmuscheln',
        en: 'Pasta with potatoes, smoked provola cheese and mussels',
        price: '€ 18,00',
      },
      {
        name: 'Tagliatelle “fusion”',
        photo: dishPhoto.tagliatelleFusion,
        description: 'Tastasal sfumato alla soia e koutsouboschi',
        de: 'Fusion-Tagliatelle mit Tastasal, Soave-Wein und Koutsouboschi-Käse',
        en: 'Fusion tagliatelle with Tastasal sausage, Soave wine and Koutsouboschi cheese',
        price: '€ 16,00',
      },
    ],
  },
  {
    title: 'Secondi piatti',
    items: [
      {
        name: 'Merluzzo, scarola, beurre blanc e aglio nero fermentato',
        photo: dishPhoto.merluzzo,
        de: 'Kabeljau mit Endivie, Beurre Blanc und fermentiertem schwarzem Knoblauch',
        en: 'Cod with escarole, beurre blanc and fermented black garlic',
        price: '€ 19,00',
      },
      {
        name: 'Calamaro ripieno di risotto alla pescatora',
        photo: dishPhoto.calamaroRipieno,
        en: 'Squid stuffed with seafood risotto',
        price: '€ 19,00',
      },
      {
        name: 'Pescato del giorno',
        de: 'Fang des Tages',
        en: 'Catch of the day',
        price: '€ 16,00 – € 24,00',
      },
      {
        name: 'Tagliata di manzo “Iron Flat Angus”',
        photo: dishPhoto.tagliata,
        description: 'Gel di rucola, salsa di pomodorini e cialda di grana',
        de: 'Rinder-Tagliata „Iron Flat“ mit Rucola-Gel, Kirschtomaten und Grana-Chip',
        en: '“Iron Flat” beef with rocket gel, cherry tomatoes and Grana crisp',
        price: '€ 24,00',
      },
      {
        name: 'Tomahawk di pollo',
        photo: dishPhoto.tomahawkPollo,
        description: 'Wok di verdure e curry verde',
        de: 'Tomahawk Huhn mit Gemüse-Wok und grünem Curry',
        en: 'Tomahawk chicken with wok vegetables and green curry',
        price: '€ 18,00',
      },
      {
        name: 'Anatra, porro e gel di arancia',
        photo: dishPhoto.anatra,
        de: 'Ente mit Lauch und Orangengel',
        en: 'Duck with leek and orange gel',
        price: '€ 20,00',
      },
    ],
  },
  {
    title: 'Contorni e insalate',
    items: [
      {
        name: 'Insalata di patate',
        de: 'Kartoffelsalat',
        en: 'Potato salad',
        price: '€ 7,00',
      },
      {
        name: 'Verdure miste di stagione',
        de: 'Gemischtes saisonales Gemüse',
        en: 'Mixed seasonal vegetables',
        price: '€ 7,00',
      },
      {
        name: 'Insalata mista',
        de: 'Gemischter Salat',
        en: 'Mixed salad',
        price: '€ 6,50',
      },
      {
        name: 'Insalata vegetariana',
        description: 'Rucola, iceberg, mais, pomodori e peperoni',
        de: 'Rucola, Eisbergsalat, Mais, Tomaten und Paprika',
        en: 'Rocket, iceberg lettuce, sweetcorn, tomatoes and peppers',
        price: '€ 8,00',
      },
    ],
  },
]

/* --- Bevande --------------------------------------------------------------- */

/**
 * Il formato (33 cl, 20 cl…) sta in `description`, che e' la riga sotto al
 * nome: sul cartaceo e' una colonna a se', ma a schermo stretto una terza
 * colonna fra nome e prezzo si spezza male.
 *
 * Il primo gruppo sul cartaceo non ha un titolo di sezione — le altre tre ce
 * l'hanno. "Bibite, acqua e aperitivi" e' un titolo aggiunto qui, perche' una
 * sezione senza nome a schermo resta orfana.
 */
/* NON PIU' PUBBLICATA dal 01/09/2026: la carta dei vini ha preso il posto di
   quella delle bevande. I dati restano — sono corretti e completi, e per
   rimetterli online basta una pagina come `app/carta-vini/page.tsx`. */
export const drinkSections: MenuSection[] = [
  {
    title: 'Bibite, acqua e aperitivi',
    items: [
      { name: 'Acqua naturale o frizzante', description: '0,75 l', price: '€ 2,50' },
      { name: 'Coca cola', description: '33 cl', price: '€ 3,50' },
      { name: 'Coca cola zero', description: '33 cl', price: '€ 3,50' },
      { name: 'Fanta', description: '33 cl', price: '€ 3,50' },
      { name: 'Tonica', description: '20 cl', price: '€ 4,00' },
      { name: 'Lemon soda', description: '20 cl', price: '€ 3,50' },
      { name: 'Gingerino', price: '€ 3,50' },
      { name: 'Thè al limone', price: '€ 3,50' },
      { name: 'Crodino', price: '€ 3,50' },
      { name: 'Campari soda', price: '€ 3,50' },
      { name: 'Succo di mela', de: 'Apfelsaft', en: 'Apple juice', price: '€ 3,50' },
      { name: 'Succo d’arancia', de: 'Orangensaft', en: 'Orange juice', price: '€ 3,50' },
      { name: 'Aperol, Hugo, Limoncello, Spritz, Sarti Spritz', price: '€ 6,50' },
    ],
  },
  {
    title: 'Birra',
    items: [
      { name: 'Peroni', description: '20 cl', price: '€ 3,50' },
      { name: 'Peroni', description: '40 cl', price: '€ 6,00' },
      { name: 'Pilsner Urquell', price: '€ 5,00' },
      { name: 'Weizen Benediktiner', price: '€ 7,00' },
      { name: 'Weizen Benediktiner zero alcol', price: '€ 7,00' },
      { name: 'Peroni in bottiglia', description: '33 cl', price: '€ 4,00' },
      { name: 'Nastro Azzurro', description: '33 cl', price: '€ 4,50' },
      { name: 'Nastro Azzurro zero alcol', description: '33 cl', price: '€ 4,50' },
    ],
  },
  {
    title: 'Caffetteria',
    items: [
      { name: 'Caffè espresso', price: '€ 1,80' },
      { name: 'Decaffeinato', price: '€ 2,00' },
      { name: 'Cappuccino', price: '€ 3,50' },
      { name: 'Latte macchiato', price: '€ 3,50' },
      { name: 'Americano', price: '€ 3,00' },
    ],
  },
  {
    title: 'Amari e distillati',
    items: [
      { name: 'Braulio', price: '€ 5,00' },
      { name: 'Fernet Branca', price: '€ 5,00' },
      { name: 'Montenegro', price: '€ 5,00' },
      { name: 'Jägermeister', price: '€ 5,00' },
      { name: 'Sambuca', price: '€ 5,00' },
      { name: 'Limoncello fatto in casa', price: '€ 5,00' },
      { name: 'Brancamenta', price: '€ 5,00' },
      { name: 'Averna', price: '€ 5,00' },
      { name: 'Ramazzotti', price: '€ 5,00' },
      { name: 'Cynar', price: '€ 5,00' },
      { name: 'San Marzano Borsci', price: '€ 5,00' },
      { name: 'Vecchia Romagna', price: '€ 5,00' },
      { name: 'Disaronno', price: '€ 5,00' },
      { name: 'Rum Sao Cao 20', price: '€ 10,00' },
      { name: 'Ron Zacapa 23', price: '€ 10,00' },
      { name: 'Cognac Superior', price: '€ 10,00' },
    ],
  },
]

/* --- Allergeni ------------------------------------------------------------- */

/**
 * Avviso allergeni, obbligatorio (Reg. UE 1169/2011).
 *
 * L'italiano e' verbatim dal PDF. Il tedesco e l'inglese sono quelli del PDF
 * con gli spazi ripristinati: il cartaceo li rende con la crenatura invece che
 * con spazi veri, e in estrazione le parole risultavano attaccate.
 *
 * Una riga dell'inglese — l'elenco degli allergeni fra "eggs," e "lupin" — non
 * e' uscita dal PDF ed e' ricostruita dall'elenco italiano, che e' quello
 * fissato dal regolamento. Da confermare sul cartaceo prima di considerarla
 * definitiva.
 */
export const allergenNotice = {
  it: {
    title: 'Allergeni',
    text: 'Nelle nostre cucine e nei nostri laboratori utilizziamo prodotti che possono essere considerati allergeni (così come previsto dal Reg. UE 1169/11), che provocano allergie o intolleranze: cereali, crostacei, uova, pesce, arachidi, soia, latte, frutta a guscio, sedano, senape, semi di sesamo, anidride solforosa, molluschi, lupini. La nostra attenzione è molto alta per minimizzare il rischio; non possiamo escludere del tutto, però, una possibile contaminazione incrociata.',
  },
  de: {
    title: 'Allergene',
    text: 'In unseren Küchen und Labors verwenden wir Produkte, die als Allergene (gemäß Verordnung (EU) Nr. 1169/2011) gelten und Allergien oder Unverträglichkeiten auslösen können: Getreide, Krebstiere, Eier, Fische, Erdnüsse, Sojabohnen, Milch, Schalenfrüchte, Sellerie, Senf, Sesamsamen, Schwefeldioxid, Weichtiere, Lupinen. Obwohl wir sehr darauf bedacht sind, Risiken zu minimieren, können wir eine mögliche Kreuzkontamination nicht völlig ausschließen.',
  },
  en: {
    title: 'Allergens',
    text: 'In our kitchens and laboratories, we use products that may be considered allergens (as per Regulation (EU) No. 1169/2011) that can cause allergies or intolerances: cereals, crustaceans, eggs, fish, peanuts, soybeans, milk, nuts, celery, mustard, sesame seeds, sulphur dioxide, molluscs, lupin. Although we take great care to minimise risks, we cannot completely rule out possible cross-contamination.',
  },
} as const

/* --- Carta dei vini ----------------------------------------------------- */
/**
 * La carta dei vini ha preso il posto di quella delle bevande (01/09/2026).
 *
 * Il campo `description` porta le **uve**: e' gia' la riga in tono minore sotto
 * il nome, esattamente dove servono, e non ha richiesto di toccare
 * `MenuSection`.
 *
 * I vini al calice stanno in quattro sezioni separate invece che in una sola
 * con dei sottotitoli: `MenuSection` non ha un livello intermedio, e inventarlo
 * per quattro gruppi di tre righe sarebbe stato piu' codice che risultato.
 *
 * **Mancano otto vini**: nel testo consegnato cinque righe erano corrotte —
 * due vini fusi in una, oppure un nome o un prezzo troncato a meta'. Sono
 * elencate nell'handoff. Ricostruirle a intuito significherebbe pubblicare un
 * prezzo sbagliato o un produttore che non esiste, e su una carta vini un
 * errore del genere lo si scopre al momento del conto.
 */
export const wineSections: MenuSection[] = [
  {
    title: 'Al calice — bollicine',
    items: [
      { name: 'Prosecco “Cantico”', price: '€ 5,00' },
      { name: 'Prosecco “Spagnol”', price: '€ 5,00' },
      { name: 'Metodo classico', price: '€ 7,00' },
    ],
  },
  {
    title: 'Al calice — bianchi',
    items: [
      { name: 'Pinot Grigio', price: '€ 4,50' },
      { name: 'Soave Classico “Montesei”', price: '€ 4,50' },
      { name: 'Lugana DOC', price: '€ 5,00' },
      { name: 'Monte delle Saette', price: '€ 6,00' },
    ],
  },
  {
    title: 'Al calice — rosati',
    items: [
      { name: 'Rosé Brioso Veneto IGT', price: '€ 4,00' },
      { name: 'Bardolino Chiaretto DOC', price: '€ 4,00' },
    ],
  },
  {
    title: 'Al calice — rossi',
    items: [
      { name: 'Bardolino Classico DOC', price: '€ 4,00' },
      { name: 'Valpolicella Classico DOC', price: '€ 5,00' },
      { name: 'Valpolicella Ripasso DOC', price: '€ 6,00' },
      { name: 'Nero d’Avola DOC “Cataldo”', price: '€ 5,00' },
    ],
  },
  {
    title: 'Spumanti',
    items: [
      { name: 'Prosecco Superiore Brut “Cantico”', description: 'Glera', price: '€ 27,00' },
      { name: 'Prosecco Superiore Extra Dry “Spagnol”', description: 'Glera', price: '€ 27,00' },
      { name: 'Franciacorta Brut Edea “Mirabella”', description: 'Chardonnay', price: '€ 42,00' },
      { name: '011 Extra Brut “Padròn & C°”', description: 'Chardonnay, Pinot Nero', price: '€ 55,00' },
      { name: 'Trento DOC Perlè “Ferrari”', description: 'Chardonnay', price: '€ 55,00' },
      { name: 'Trento DOC Brut “Madonna delle Vittorie”', description: 'Chardonnay', price: '€ 42,00' },
      { name: 'Trento DOC Riserva “Madonna delle Vittorie”', description: 'Chardonnay, Pinot Nero', price: '€ 75,00' },
      { name: 'Trento DOC Giulio Ferrari “Ferrari”', description: 'Chardonnay', price: '€ 220,00' },
      { name: 'Montpre Brut “Tenuta Chiccheri”', description: 'Chardonnay', price: '€ 32,00' },
      { name: 'Blanc de Morgex Pas Dosé “Cave Mont Blanc”', description: 'Priè Blanc', price: '€ 43,00' },
      { name: 'Pas Dosé “D’Araprì”', description: 'Bombino Bianco, Pinot Nero', price: '€ 40,00' },
      { name: 'Montpre Pas Dosé “Tenuta Chiccheri”', description: 'Chardonnay', price: '€ 45,00' },
    ],
  },
  {
    title: 'Spumanti rosé',
    items: [
      { name: 'Enrico “Gentili”', description: 'Corvinone, Corvina, Rondinella, Molinara', price: '€ 38,00' },
      { name: 'Franciacorta Demetra Rosé “Mirabella”', description: 'Chardonnay, Pinot Bianco, Pinot Nero', price: '€ 70,00' },
      { name: '001 Brut “Padròn & C°”', description: 'Chardonnay, Pinot Nero', price: '€ 60,00' },
      { name: 'Blanc de Noir Bruciato Rosa “Il Pendio”', description: 'Pinot Nero', price: '€ 75,00' },
    ],
  },
  {
    title: 'Champagne',
    items: [
      { name: 'Zero Dosage “Vincent Couche”', description: 'Pinot Nero, Chardonnay', price: '€ 85,00' },
      { name: 'Eloquence Grand Cru “J. L. Vergnon”', description: 'Chardonnay', price: '€ 110,00' },
      { name: 'L’Ouverture “Frédéric Savart”', description: 'Pinot Nero', price: '€ 120,00' },
      { name: 'Oeil de Perdrix “Jean Vesselle”', description: 'Pinot Nero', price: '€ 100,00' },
      { name: 'Millésime 1er Cru “Lacourte Godbillon”', description: 'Chardonnay, Pinot Nero', price: '€ 140,00' },
      { name: 'Chromatique Grand Cru “Stéphane Regnault”', description: 'Chardonnay', price: '€ 115,00' },
      { name: 'Crémant d’Alsace Zéro Dosage “Barmés Buecher”', description: 'Chardonnay, Pinot Gris, Pinot Auxerrois', price: '€ 55,00' },
    ],
  },
  {
    title: 'Vini bianchi',
    items: [
      { name: 'Pinot Grigio DOC delle Venezie “Villa San Zeno”', description: 'Pinot Grigio', price: '€ 22,00' },
      { name: 'Lugana DOC “La Torretta”', description: 'Turbiana', price: '€ 25,00' },
      { name: 'Lugana DOC Capotesta “Cascina Maddalena”', description: 'Turbiana', price: '€ 30,00' },
      { name: 'Soave Classico Montesei “Le Battistelle”', description: 'Garganega', price: '€ 24,00' },
      { name: 'Soave Roccolo del Durlo “Le Battistelle”', description: 'Garganega', price: '€ 38,00' },
      { name: 'Chardonnay Bertilla “Thomas Conzato”', description: 'Chardonnay', price: '€ 50,00' },
      { name: 'Gewürztraminer Capolago “Madonna delle Vittorie”', description: 'Gewürztraminer', price: '€ 36,00' },
      { name: 'Grillo Kebrilla “Fina”', description: 'Grillo', price: '€ 25,00' },
      { name: 'Ondapazza “Centopassi”', description: 'Grillo, Catarratto', price: '€ 23,00' },
      { name: 'Kikè “Fina”', description: 'Traminer, Sauvignon', price: '€ 30,00' },
      { name: 'Chardonnay Masera “Madonna delle Vittorie”', description: 'Chardonnay', price: '€ 55,00' },
      { name: 'Verdicchio dei Castelli di Jesi “Coroncino”', description: 'Verdicchio', price: '€ 32,00' },
      { name: 'Falanghina Sabbia Vulcanica “Agnanum”', description: 'Falanghina, Biancolella, Catalanesca', price: '€ 29,00' },
      { name: 'Riesling Renano Famèi “Corvée”', description: 'Riesling', price: '€ 26,00' },
      { name: 'Riesling “Taschlerhof”', description: 'Riesling', price: '€ 43,00' },
      { name: 'Chioma Integrale “Vignai da Duline”', description: 'Malvasia', price: '€ 52,00' },
      { name: 'Bourgogne Blanc Terre de Molesme', description: 'Chardonnay', price: '€ 70,00' },
      { name: 'Chablis 1er Cru Montmains “Chaude Écuelle”', description: 'Chardonnay', price: '€ 70,00' },
    ],
  },
  {
    title: 'Vini rosati',
    items: [
      { name: 'Rosé Brioso Veneto “Campagnola”', description: 'Molinara, Corvina', price: '€ 22,00' },
      { name: 'Barbagliante “Gentili”', description: 'Rondinella, Molinara, Corvina', price: '€ 35,00' },
      { name: 'Lambrusco di Sorbara Falistra “Podere il Saliceto”', description: 'Lambrusco', price: '€ 26,00' },
    ],
  },
  {
    title: 'Vini rossi',
    items: [
      { name: 'Bardolino Classico DOC “Gentili”', description: 'Rondinella, Molinara, Corvina, Corvinone', price: '€ 22,00' },
      { name: 'Valpolicella Classico DOC “Villa San Zeno”', description: 'Corvina, Corvinone, Rondinella', price: '€ 24,00' },
      { name: 'Valpolicella Classico Superiore “Caterina Zardini”', description: 'Corvina, Corvinone, Rondinella', price: '€ 35,00' },
      { name: 'Valpolicella Classico Superiore Figari “Villa Spinosa”', description: 'Corvina, Corvinone, Rondinella', price: '€ 38,00' },
      { name: 'Valpolicella Ripasso “Villa San Zeno”', description: 'Corvina, Rondinella', price: '€ 30,00' },
      { name: 'Valpolicella Superiore Ripasso Jago “Villa Spinosa”', description: 'Corvina, Corvinone, Rondinella', price: '€ 40,00' },
      { name: 'Merlot Vigna Barbài “Thomas Conzato”', description: 'Merlot', price: '€ 50,00' },
      { name: 'Pinot Nero La Valletta “Il Pendio”', description: 'Pinot Nero', price: '€ 70,00' },
      { name: 'San Leonardo “Tenuta San Leonardo”', description: 'Cabernet Sauvignon, Merlot, Carmenère', price: '€ 140,00' },
      { name: 'Villa Gresti “Tenuta San Leonardo”', description: 'Merlot, Carmenère, Cabernet Sauvignon', price: '€ 50,00' },
      { name: 'Montepulciano d’Abruzzo Riserva “Podere Frontino”', description: 'Montepulciano', price: '€ 38,00' },
      { name: 'Nero d’Avola DOC “Cataldo”', description: 'Nero d’Avola', price: '€ 26,00' },
      { name: 'Bolgheri Rosso DOC “Le Macchiole”', description: 'Merlot, Cabernet Franc, Cabernet Sauvignon, Syrah', price: '€ 50,00' },
      { name: 'Sassella Stella Retica Valtellina Superiore “Arpepe”', description: 'Chiavennasca', price: '€ 70,00' },
      { name: 'Barolo Serralunga “Ettore Germano”', description: 'Nebbiolo', price: '€ 80,00' },
      { name: 'Amarone Classico DOCG “Villa San Zeno”', description: 'Rondinella, Corvina, Corvinone', price: '€ 60,00' },
      { name: 'Amarone Riserva DOCG Missoj “Campagnola”', description: 'Corvina, Rondinella, Croatina', price: '€ 170,00' },
      { name: 'Amarone Riserva DOCG Magnum “Caterina Zardini”', description: 'Corvina, Corvinone, Rondinella', price: '€ 160,00' },
    ],
  },
]
