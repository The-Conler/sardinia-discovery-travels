/**
 * EXAMPLE packages only.
 * Every trip in this file is sample content for the Pacchetti section.
 * Prices are invented. Replace this list with real trips before selling anything.
 * Add a package by appending one object: the listing and the detail page both read this array.
 */

export type ThemeId = "mare" | "natura" | "enogastronomia" | "cultura";
export type ZoneId = "nord" | "sud" | "est" | "ovest" | "interno";
export type DurationId = "short" | "mid" | "long";

export type PackageCopy = {
  title: string;
  intro: string;
  days: { title: string; text: string }[];
  included: string[];
  excluded: string[];
};

export type SamplePackage = {
  /** EXAMPLE: this flag stays true until a real trip replaces the sample. */
  example: true;
  slug: string;
  theme: ThemeId;
  zone: ZoneId;
  days: number;
  nights: number;
  /** EXAMPLE price in euros. Not a real fare. */
  priceFrom: number;
  /** Local site images only. */
  images: string[];
  /** EXAMPLE date ranges. Not real departures. */
  dates: { it: string; en: string }[];
  it: PackageCopy;
  en: PackageCopy;
};

export const THEMES: { id: ThemeId; it: string; en: string }[] = [
  { id: "mare", it: "Mare", en: "Sea" },
  { id: "natura", it: "Natura", en: "Nature" },
  { id: "enogastronomia", it: "Enogastronomia", en: "Food and wine" },
  { id: "cultura", it: "Cultura", en: "Culture" },
];

export const ZONES: { id: ZoneId; it: string; en: string }[] = [
  { id: "nord", it: "Nord", en: "North" },
  { id: "sud", it: "Sud", en: "South" },
  { id: "est", it: "Est", en: "East" },
  { id: "ovest", it: "Ovest", en: "West" },
  { id: "interno", it: "Interno", en: "Inland" },
];

export const DURATIONS: { id: DurationId; it: string; en: string }[] = [
  { id: "short", it: "Fino a 3 notti", en: "Up to 3 nights" },
  { id: "mid", it: "4 o 5 notti", en: "4 or 5 nights" },
  { id: "long", it: "6 notti o più", en: "6 nights or more" },
];

export function durationBand(nights: number): DurationId {
  if (nights <= 3) return "short";
  if (nights <= 5) return "mid";
  return "long";
}

/** Thousands use a dot and cents a comma: 1.250,00 €. Example amounts only. */
export function formatEuro(amount: number) {
  const [whole, cents] = amount.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped},${cents} €`;
}

/* EXAMPLE packages. None of these trips or prices are for sale. */
export const PACKAGES: SamplePackage[] = [
  {
    example: true,
    slug: "esempio-costa-smeralda",
    theme: "mare",
    zone: "nord",
    days: 5,
    nights: 4,
    priceFrom: 1250,
    images: [
      "/destinations/north/nd-costa-smeralda.webp",
      "/destinations/north/ns-yacht.webp",
      "/experiences/boat-tour.webp",
      "/locations/la-maddalena.jpg",
    ],
    dates: [
      { it: "12–16 maggio 2027", en: "12–16 May 2027" },
      { it: "9–13 giugno 2027", en: "9–13 June 2027" },
    ],
    it: {
      title: "Quattro giorni in Costa Smeralda",
      intro: "Un viaggio di prova tra cale e isole. Il programma e il prezzo sono inventati, da sostituire con un viaggio vero.",
      days: [
        { title: "Arrivo a Olbia", text: "Trasferimento di esempio verso un paese della costa. Passeggiata serale sul porto. Nessuna prenotazione reale." },
        { title: "Arcipelago", text: "Giornata in barca di esempio verso calette vicine. Soste per nuotare, rientro nel pomeriggio." },
        { title: "Costa a piedi", text: "Cammino breve su un sentiero costiero e tempo libero in un borgo. Il percorso è solo indicativo." },
        { title: "Un'altra cala", text: "Seconda uscita in mare, più corta, con rientro per una cena semplice in paese." },
        { title: "Rientro", text: "Mattina libera e trasferimento di esempio verso l'aeroporto o il porto." },
      ],
      included: ["Quattro notti in camera doppia di esempio", "Due uscite in barca di esempio", "Trasferimenti indicati nel programma"],
      excluded: ["Voli e traghetti", "Pranzi e cene", "Qualsiasi extra non scritto sopra"],
    },
    en: {
      title: "Four days on the Costa Smeralda",
      intro: "A sample trip of coves and islands. The plan and the price are made up, and will be replaced by a real trip.",
      days: [
        { title: "Arrival in Olbia", text: "A sample transfer to a coastal village. An evening walk on the harbour. Nothing here is a real booking." },
        { title: "The archipelago", text: "A sample boat day toward nearby coves, with swimming stops and a return in the afternoon." },
        { title: "The coast on foot", text: "A short coastal walk and free time in a village. The route is only a sketch." },
        { title: "Another cove", text: "A shorter second boat trip, then a simple dinner back in the village." },
        { title: "Departure", text: "A free morning and a sample transfer to the airport or the port." },
      ],
      included: ["Four nights in a sample double room", "Two sample boat days", "The transfers named in the plan"],
      excluded: ["Flights and ferries", "Lunches and dinners", "Anything not written above"],
    },
  },
  {
    example: true,
    slug: "esempio-supramonte",
    theme: "natura",
    zone: "est",
    days: 4,
    nights: 3,
    priceFrom: 890,
    images: [
      "/off-road/hero-supramonte-track.webp",
      "/off-road/area-supramonte.webp",
      "/cinematic-hero/photos/coastal-hike.png",
      "/about/perda-e-liana.webp",
    ],
    dates: [
      { it: "3–6 aprile 2027", en: "3–6 April 2027" },
      { it: "2–5 ottobre 2027", en: "2–5 October 2027" },
    ],
    it: {
      title: "Sentieri del Supramonte",
      intro: "Tre notti di prova tra altopiano e mare. Le tappe e il prezzo non sono un'offerta.",
      days: [
        { title: "Oliena", text: "Arrivo di esempio e cammino breve verso un belvedere. Pernottamento in paese." },
        { title: "Altopiano", text: "Giornata a piedi su un sentiero di esempio, con guida. Il dislivello è indicativo." },
        { title: "Verso la costa", text: "Trasferimento di esempio fino a un belvedere sul mare e tempo per una cala." },
        { title: "Partenza", text: "Colazione e rientro di esempio verso Olbia." },
      ],
      included: ["Tre notti di esempio", "Guide per le due camminate", "Trasferimenti del programma"],
      excluded: ["Pranzi al sacco", "Noleggio auto", "Attrezzatura personale"],
    },
    en: {
      title: "Supramonte trails",
      intro: "Three sample nights between the plateau and the sea. The stages and the price are not an offer.",
      days: [
        { title: "Oliena", text: "A sample arrival and a short walk to a viewpoint. Overnight in the village." },
        { title: "The plateau", text: "A sample day on foot with a guide. The elevation is only a sketch." },
        { title: "Toward the coast", text: "A sample drive to a sea viewpoint, with time for a cove." },
        { title: "Departure", text: "Breakfast and a sample return toward Olbia." },
      ],
      included: ["Three sample nights", "Guides for the two walks", "The transfers in the plan"],
      excluded: ["Picnic lunches", "A hire car", "Personal kit"],
    },
  },
  {
    example: true,
    slug: "esempio-tavola-gallura",
    theme: "enogastronomia",
    zone: "nord",
    days: 3,
    nights: 2,
    priceFrom: 640,
    images: [
      "/destinations/north/ns-wine.webp",
      "/destinations/north/ns-cooking.webp",
      "/explore/food-expierences.png",
      "/about/tile-food-lovers.webp",
    ],
    dates: [
      { it: "21–23 maggio 2027", en: "21–23 May 2027" },
      { it: "18–20 settembre 2027", en: "18–20 September 2027" },
    ],
    it: {
      title: "Tavola in Gallura",
      intro: "Un fine settimana di prova tra una cantina e una cucina. Prezzi e tappe sono fittizi.",
      days: [
        { title: "Cantina", text: "Arrivo di esempio e visita breve in una cantina immaginaria, con assaggio." },
        { title: "In cucina", text: "Mattina in cucina per un piatto semplice, pomeriggio libero in un borgo." },
        { title: "Mercato e partenza", text: "Sosta di esempio a un mercato e rientro." },
      ],
      included: ["Due notti di esempio", "Una visita in cantina", "Una mattina in cucina"],
      excluded: ["Cene al ristorante", "Acquisti in cantina", "Trasferimenti non indicati"],
    },
    en: {
      title: "A Gallura table",
      intro: "A sample weekend between a winery and a kitchen. Prices and stops are fictional.",
      days: [
        { title: "Winery", text: "A sample arrival and a short visit to an imaginary winery, with a tasting." },
        { title: "In the kitchen", text: "A morning cooking one simple dish, then a free afternoon in a village." },
        { title: "Market and departure", text: "A sample stop at a market, then the return." },
      ],
      included: ["Two sample nights", "One winery visit", "One morning in the kitchen"],
      excluded: ["Restaurant dinners", "Bottles you buy", "Transfers that are not listed"],
    },
  },
  {
    example: true,
    slug: "esempio-nuraghi",
    theme: "cultura",
    zone: "interno",
    days: 6,
    nights: 5,
    priceFrom: 1480,
    images: [
      "/destinations/interlands.png",
      "/about/tile-culture-traditions.webp",
      "/destinations/north/nd-castelsardo.webp",
      "/about/gruppo-folk.webp",
    ],
    dates: [
      { it: "6–11 settembre 2027", en: "6–11 September 2027" },
      { it: "4–9 ottobre 2027", en: "4–9 October 2027" },
    ],
    it: {
      title: "Nuraghi e paesi",
      intro: "Sei giorni di prova nell'interno. I siti e il prezzo sono solo uno schema.",
      days: [
        { title: "Ingresso nell'interno", text: "Arrivo di esempio in un paese e prima sosta a un sito nuragico." },
        { title: "Un villaggio", text: "Mattina in un borgo, pomeriggio in un museo civico immaginario." },
        { title: "Verso la Barbagia", text: "Strada di esempio tra due paesi, con una sosta panoramica." },
        { title: "Artigiani", text: "Visita di esempio a un laboratorio. Nessun acquisto è incluso." },
        { title: "Una festa", text: "Serata di esempio con musica, solo come indicazione." },
        { title: "Rientro", text: "Partenza di esempio verso la costa." },
      ],
      included: ["Cinque notti di esempio", "Ingressi indicati nel programma", "Guida per quattro giornate"],
      excluded: ["Pranzi e cene", "Acquisti", "Voli"],
    },
    en: {
      title: "Nuraghi and villages",
      intro: "Six sample days inland. The sites and the price are only a sketch.",
      days: [
        { title: "Into the interior", text: "A sample arrival in a village and a first stop at a nuragic site." },
        { title: "A village", text: "A morning in a town and an afternoon in an imaginary civic museum." },
        { title: "Toward Barbagia", text: "A sample road between two villages, with one viewpoint stop." },
        { title: "Makers", text: "A sample visit to a workshop. Nothing you buy is included." },
        { title: "A gathering", text: "A sample evening of music, only as an indication." },
        { title: "Return", text: "A sample departure toward the coast." },
      ],
      included: ["Five sample nights", "The entries named in the plan", "A guide for four days"],
      excluded: ["Lunches and dinners", "Shopping", "Flights"],
    },
  },
];

export function packageBySlug(slug: string) {
  return PACKAGES.find((p) => p.slug === slug);
}

/** English title plus the example mark, for the request summary. */
export function packageLabel(slug: string) {
  const pkg = packageBySlug(slug);
  return pkg ? `${pkg.en.title} (example)` : "";
}
