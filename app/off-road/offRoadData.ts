export type Area = "Gallura" | "Supramonte" | "Barbagia" | "Ogliastra";
export type TourKind = "Half day" | "Full day" | "Tailored";

export const AREAS: { id: Area; img: string; pos?: string; text: string }[] = [
  { id: "Gallura", img: "/off-road/area-gallura.webp", pos: "50% 55%", text: "Granite hills around Tempio Pausania and the tracks up Monte Limbara." },
  { id: "Supramonte", img: "/off-road/area-supramonte.webp", pos: "50% 50%", text: "Limestone plateaus and canyons above Oliena, Dorgali and Baunei." },
  { id: "Barbagia", img: "/off-road/area-barbagia.webp", pos: "50% 45%", text: "Mountain villages, chestnut woods and the slopes of the Gennargentu." },
  { id: "Ogliastra", img: "/off-road/area-ogliastra.webp", pos: "50% 55%", text: "High ground between the Gennargentu and the east coast." },
];

export const TOUR_KINDS: TourKind[] = ["Half day", "Full day", "Tailored"];

export type Fact = { icon: string; label: string };

export type TourGroup = "Quad tours" | "Buggy rides" | "4x4 day tours";
export const TOUR_GROUPS: TourGroup[] = ["Quad tours", "Buggy rides", "4x4 day tours"];

export type Tour = {
  id: string;
  name: string;
  group: TourGroup;
  /** Type line under the name: "Quad tour", "Buggy ride", "4x4 jeep tour" or "4x4 day tour". */
  meta: string;
  /** Price as given by the operator, written "180 €". Shown on the card when known. */
  price?: string;
  /** External booking page (opens in a new tab). */
  book?: string;
  /** Empty when the area is agreed with the guest. */
  area: Area | "";
  kind: TourKind;
  img: string;
  pos?: string;
  text: string;
  facts: Fact[];
  /** Shown large at the bottom of the card, in place of a price. */
  length: string;
};

/*
 * The first three tours are the 4x4 tours listed on sardiniadiscoverytravels.com/our-tours
 * (October 2026): full day and tailored. The live-site half day from Tempio Pausania
 * was replaced by the client's Limbara mountain tour (see below).
 * Only the details the live site gives are used. No prices on purpose.
 * TODO: add prices once confirmed, and the meeting point and area of the full day tour
 * (the live site says "To be decided").
 */
const LIVE_TOURS: Tour[] = [
  /*
   * Limbara mountain: supplied by the client (October 2026) with their own photo.
   * It replaces the live-site "Monte Limbara half day" card (4 hours, from Tempio
   * Pausania, archaeological stop, 9:30 or 15:30). The client's newer details win:
   * Easy, 5 hours, €250, 4x4 jeep tour. None of the old details are carried over.
   * TODO: confirm the meeting point, start times, whether the price is per person
   * or per vehicle, and whether 5 hours counts as a half day for the filter.
   */
  {
    id: "limbara-mountain",
    name: "Limbara mountain",
    group: "4x4 day tours",
    meta: "4x4 jeep tour",
    price: "250 €",
    area: "Gallura",
    kind: "Half day",
    img: "/off-road/limbara-mountain-4x4.webp",
    pos: "50% 55%",
    text: "A 4x4 jeep tour on Monte Limbara.",
    facts: [
      { icon: "mountain", label: "Easy" },
      { icon: "clock", label: "5 hours" },
    ],
    length: "5 hours",
  },
  {
    id: "mountain-full-day",
    name: "Mountain trail full day",
    group: "4x4 day tours",
    meta: "4x4 day tour",
    area: "",
    kind: "Full day",
    img: "/off-road/tour-limbara-full-day.webp",
    pos: "50% 60%",
    text: "A long day on mountain tracks with an experienced guide, for groups who like a challenge.",
    facts: [
      { icon: "car", label: "Hotel pickup at 9:00" },
      { icon: "mountain", label: "Challenging" },
      { icon: "users", label: "Transfer for up to 5" },
    ],
    length: "7 hours",
  },
  {
    id: "tailored",
    name: "Tailored 4x4 tour",
    group: "4x4 day tours",
    meta: "4x4 day tour",
    area: "",
    kind: "Tailored",
    img: "/experiences/off-road.png",
    pos: "50% 50%",
    text: "Tell us the area, the pace and what you want to see, and we plan the route around your group.",
    facts: [
      { icon: "route", label: "Your route" },
      { icon: "calendar", label: "Your dates" },
    ],
    length: "You choose",
  },
];

/*
 * Quad tours and buggy rides supplied by the client (October 2026) with their
 * own photos. Descriptions were given in Italian; the site is English only (no
 * Italian locale on this page), so the originals are kept here in comments.
 * TODO: confirm where the quad tours start (area and meeting point) and their prices.
 * TODO: confirm the level of the two Polaris RZR rides (not given).
 * The buggy rides link to the Aritzo Off Road Experience booking calendar; Aritzo
 * is in Barbagia, so they are filed under Barbagia. TODO: confirm the meeting point.
 */
const CLIENT_TOURS: Tour[] = [
  {
    id: "quad-the-mines",
    name: "Quad tour The Mines",
    group: "Quad tours",
    meta: "Quad tour",
    area: "",
    kind: "Half day",
    img: "/off-road/quad-the-mines.webp",
    pos: "50% 55%",
    // "Un percorso avvincente, unico, meraviglioso"
    text: "A gripping, one of a kind and beautiful route.",
    facts: [
      { icon: "mountain", label: "Easy" },
      { icon: "clock", label: "3 to 4 h" },
      { icon: "route", label: "70 km" },
    ],
    length: "3 to 4 hours",
  },
  {
    id: "quad-red-sands",
    name: "Quad tour Red Sands",
    group: "Quad tours",
    meta: "Quad tour",
    area: "",
    kind: "Half day",
    img: "/off-road/quad-red-sands.webp",
    pos: "50% 60%",
    // "Suggestivo, difficoltà tecnica e presenza di ostacoli"
    text: "A striking route with technical sections and obstacles.",
    facts: [
      { icon: "mountain", label: "Medium" },
      { icon: "clock", label: "4 to 5 h" },
      { icon: "route", label: "90 km" },
    ],
    length: "4 to 5 hours",
  },
  {
    id: "quad-villa-ginestra",
    name: "Quad tour Villa Ginestra",
    group: "Quad tours",
    meta: "Quad tour",
    area: "",
    kind: "Full day",
    img: "/off-road/quad-villa-ginestra.webp",
    pos: "50% 60%",
    // "Difficile ed emozionante, con ostacoli naturali."
    text: "Hard and thrilling, with natural obstacles.",
    facts: [
      { icon: "mountain", label: "Hard" },
      { icon: "clock", label: "6 to 7 h" },
      { icon: "route", label: "100 km" },
    ],
    length: "6 to 7 hours",
  },
  {
    id: "buggy-cf800-zforce",
    // "Uscita con CF800 ZForce 2 posti"
    name: "CF800 ZForce, 2 seats",
    group: "Buggy rides",
    meta: "Buggy ride",
    area: "Barbagia",
    kind: "Half day",
    img: "/off-road/buggy-cf800-zforce.webp",
    pos: "50% 60%",
    text: "A ride in a two seat CF800 ZForce buggy.",
    facts: [
      { icon: "mountain", label: "Easy" },
      { icon: "clock", label: "3 h" },
      { icon: "users", label: "2 seats" },
    ],
    length: "3 hours",
    price: "180 €",
    book: "https://www.aritzoffroadexperience.com/booking-calendar/uscita-con-cf800-zforce-2-posti",
  },
  {
    id: "buggy-rzr-2",
    // "Uscita con Polaris 800 RZR per 2 persone"
    name: "Polaris 800 RZR for 2 people",
    group: "Buggy rides",
    meta: "Buggy ride",
    area: "Barbagia",
    kind: "Half day",
    img: "/off-road/buggy-rzr-2.webp",
    pos: "50% 88%",
    text: "A ride for two in a Polaris 800 RZR.",
    facts: [
      { icon: "clock", label: "3 h" },
      { icon: "users", label: "2 people" },
    ],
    length: "3 hours",
    price: "160 €",
    book: "https://www.aritzoffroadexperience.com/booking-calendar/uscita-con-polaris-800-rzr-per-2-persone",
  },
  {
    id: "buggy-rzr-1",
    // "Uscita con Polaris 800 RZR per 1 persone"
    name: "Polaris 800 RZR for 1 person",
    group: "Buggy rides",
    meta: "Buggy ride",
    area: "Barbagia",
    kind: "Half day",
    img: "/off-road/buggy-rzr-1.webp",
    pos: "50% 88%",
    text: "A ride on your own in a Polaris 800 RZR.",
    facts: [
      { icon: "clock", label: "3 h" },
      { icon: "user", label: "1 person" },
    ],
    length: "3 hours",
    price: "100 €",
    book: "https://www.aritzoffroadexperience.com/booking-calendar/uscita-con-polaris-800-rzr-per-1-persone",
  },
];

export const TOURS: Tour[] = [...CLIENT_TOURS, ...LIVE_TOURS];

// What the live site lists as included on its 4x4 tours (sardiniadiscoverytravels.com/our-tours).
// TODO: confirm with the team which of these apply to every tour.
export const INCLUDED: { icon: string; title: string; text: string }[] = [
  { icon: "user", title: "An experienced guide", text: "Listed with the full day tour on mountain tracks." },
  { icon: "car", title: "Private transfer", text: "From where you stay on the full day tour, for up to 5 people within 50 km of the start." },
  // Removed with the Monte Limbara half day tour: "An archaeological stop" (Nuraghe Majori or
  // the Tomba dei Giganti di Pascaredda). TODO: re-add if the Limbara mountain tour includes one.
];

export const PHOTO_CREDITS: { file: string; title: string; author: string; license: string; url: string }[] = [
  { file: "Hero", title: "Supramonte, Richtung Scala e’ Pradu", author: "Falk2", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:14_674_Supramonte,_Richtung_Scala_e%E2%80%99_Pradu.jpg" },
  { file: "Gallura", title: "Monte Limbara (05)", author: "Gianni Careddu", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Monte_Limbara_(05).jpg" },
  { file: "Supramonte", title: "Supramonte view from Punta Sos Nidos", author: "Rafael Brix", license: "CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Supramonte_view-from-Punta-Sos-Nidos-to-North-East_2.jpg" },
  { file: "Barbagia", title: "Gennargentu view 1996", author: "JopkeB", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Gennargentu_view_1996.jpg" },
  { file: "Ogliastra", title: "Talana Orrunori, vista Gennargentu", author: "Enzo Encius", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Talana_Orrunori,_vista_Gennargentu.jpg" },
  { file: "Mountain trail full day", title: "Monte Limbara (01)", author: "Gianni Careddu", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Monte_Limbara_(01).JPG" },
];

export const STAY_AREAS = ["North", "South", "East", "West", "Inland", "Not sure"] as const;
export const STAY_TYPES = ["Hotel", "Villa", "Apartment", "Agriturismo", "Any"] as const;
export const BUDGETS = ["Under €100", "€100 to €200", "€200 to €350", "Over €350", "Not sure yet"];

/* ---------- Tour pages (/off-road/[slug]) ---------- */

export const tourHref = (t: Tour) => `/off-road/${t.id}`;
export const tourBySlug = (slug: string) => TOURS.find((t) => t.id === slug);

/** The value shown in the card's bottom bar: the price when known, otherwise the duration. */
export const barValue = (t: Tour) => (t.price ? { label: "Price", value: t.price } : { label: "Duration", value: t.length });

/** Chips on the card. When the bar shows the duration, the duration chip is dropped. */
export const cardFacts = (t: Tour) => (t.price ? t.facts : t.facts.filter((f) => f.icon !== "clock"));

export type TourDetails = {
  /** Stops or highlights along the route. */
  stops: { title: string; text?: string }[];
  /** What the price includes. */
  included: { icon: string; title: string; text?: string }[];
  bring?: string;
  rules?: string;
  meeting?: string;
  /** Optional video (mp4 path) shown in the gallery. */
  video?: string;
};

/*
 * Per tour page content. We only have the title, level, duration, distance,
 * price, one line and one photo per tour, so everything below is empty on
 * purpose and the page shows a neutral "confirmed in our reply" line instead.
 * TODO: fill in stops, inclusions, what to bring, age and licence rules,
 * meeting point and a video for every tour once the client sends them.
 * The only real inclusions are the full day tour's, from the live site.
 */
const NO_DETAILS: TourDetails = { stops: [], included: [] };
export const TOUR_DETAILS: Record<string, TourDetails> = {
  "mountain-full-day": {
    stops: [],
    included: [
      { icon: "user", title: "An experienced guide" },
      { icon: "car", title: "Private transfer", text: "From where you stay, for up to 5 people within 50 km of the start." },
    ],
  },
};
export const detailsFor = (t: Tour): TourDetails => TOUR_DETAILS[t.id] ?? NO_DETAILS;

/*
 * Stock photos for the tour page galleries (public/off-road/stock/), from Pexels
 * under the Pexels License (free to use, no attribution required; credited anyway
 * on the page and in public/off-road/CREDITS.md). Chosen for dry hills and dirt
 * tracks, no readable plates or recognisable faces.
 * TODO: these are stock, not this operator's tours. Replace them with the
 * client's own photos and video for each tour when they arrive.
 */
export type StockPhoto = { src: string; type: "quad" | "buggy" | "jeep"; alt: string; author: string; url: string };
export const STOCK: StockPhoto[] = [
  { src: "/off-road/stock/quad-1.webp", type: "quad", alt: "Quad rider on a dusty dirt track", author: "Daniel", url: "https://www.pexels.com/photo/person-riding-on-black-atv-quad-bike-1135197/" },
  { src: "/off-road/stock/quad-2.webp", type: "quad", alt: "Quad bike raising dust on an off road trail", author: "Luis Becerra Fotógrafo", url: "https://www.pexels.com/photo/man-riding-in-dust-on-4x4-quad-bike-15490755/" },
  { src: "/off-road/stock/quad-3.webp", type: "quad", alt: "Quad bike on a dusty hillside trail", author: "Ricardo Avalos", url: "https://www.pexels.com/photo/off-road-adventure-on-quad-bike-in-desert-28580479/" },
  { src: "/off-road/stock/quad-4.webp", type: "quad", alt: "Quad bike on a dirt track", author: "Daniel", url: "https://www.pexels.com/photo/man-riding-atv-on-race-track-1135198/" },
  { src: "/off-road/stock/quad-5.webp", type: "quad", alt: "Quad bike on a rocky dirt road", author: "Malik Cil", url: "https://www.pexels.com/photo/man-riding-quad-on-dirt-road-16959272/" },
  { src: "/off-road/stock/quad-6.webp", type: "quad", alt: "Quad bike on a grassy hill with mountain views", author: "White Noiise", url: "https://www.pexels.com/photo/atv-on-scenic-mountain-landscape-during-daytime-29008357/" },
  { src: "/off-road/stock/buggy-1.webp", type: "buggy", alt: "A line of buggies on a rocky track", author: "Kart Aventure", url: "https://www.pexels.com/photo/off-road-dune-buggy-adventure-in-desert-landscape-39742410/" },
  { src: "/off-road/stock/buggy-2.webp", type: "buggy", alt: "Buggy on a dirt track", author: "Isaac Mitchell", url: "https://www.pexels.com/photo/black-and-red-buggy-on-dirt-road-12973561/" },
  { src: "/off-road/stock/buggy-3.webp", type: "buggy", alt: "Buggy on a muddy track through dry grass", author: "Nikita Volodko", url: "https://www.pexels.com/photo/offroad-adventure-in-muddy-terrain-29548902/" },
  { src: "/off-road/stock/buggy-4.webp", type: "buggy", alt: "Buggy splashing along a trail", author: "Quang Vuong", url: "https://www.pexels.com/photo/off-road-vehicle-driving-through-muddy-trail-37039910/" },
  { src: "/off-road/stock/buggy-5.webp", type: "buggy", alt: "Two buggies on sand dunes", author: "Denys Gromov", url: "https://www.pexels.com/photo/dune-buggies-on-sand-dunes-under-a-clear-blue-sky-13252286/" },
  { src: "/off-road/stock/buggy-6.webp", type: "buggy", alt: "Buggy on sand below a rock face", author: "Denys Gromov", url: "https://www.pexels.com/photo/a-blue-and-black-dune-buggy-on-sand-near-rocky-mountain-13252289/" },
  { src: "/off-road/stock/jeep-1.webp", type: "jeep", alt: "4x4 on a dirt road between hills", author: "Aleksey Kuprikov", url: "https://www.pexels.com/photo/photo-of-vehicles-on-dirt-road-3551225/" },
  { src: "/off-road/stock/jeep-2.webp", type: "jeep", alt: "4x4 on a rock ledge above a valley", author: "Gunnar Ensign", url: "https://www.pexels.com/photo/an-off-road-vehicle-on-a-natural-rock-formation-6441589/" },
  { src: "/off-road/stock/jeep-3.webp", type: "jeep", alt: "4x4 on a track between rock walls", author: "ArtHouse Studio", url: "https://www.pexels.com/photo/black-suv-moving-on-the-road-between-big-rock-formations-4636241/" },
  { src: "/off-road/stock/jeep-4.webp", type: "jeep", alt: "4x4 on rocky ground at dusk", author: "Todd Felton", url: "https://www.pexels.com/photo/4x4-off-road-at-dawn-19379648/" },
  { src: "/off-road/stock/jeep-5.webp", type: "jeep", alt: "4x4 on a mountain dirt road", author: "Vitaliy Mitrofanenko", url: "https://www.pexels.com/photo/white-4x4-car-on-dirt-road-in-mountains-9920226/" },
  { src: "/off-road/stock/jeep-6.webp", type: "jeep", alt: "4x4 crossing rocky ground", author: "Syed Qaarif Andrabi", url: "https://www.pexels.com/photo/red-4x4-car-driving-through-extreme-terrain-9846190/" },
];
const stockType = (t: Tour): StockPhoto["type"] => (t.group === "Quad tours" ? "quad" : t.group === "Buggy rides" ? "buggy" : "jeep");

export type GalleryItem = { src: string; pos?: string; alt: string; credit?: { author: string; url: string } };

/** Gallery: the tour's own photo first, then stock photos of the same kind of tour. */
export function galleryFor(t: Tour): GalleryItem[] {
  return [
    { src: t.img, pos: t.pos, alt: t.name },
    ...STOCK.filter((p) => p.type === stockType(t)).map((p) => ({ src: p.src, alt: p.alt, credit: { author: p.author, url: p.url } })),
  ];
}

/** Other tours row: the same group first, then the rest. */
export const otherTours = (t: Tour, n = 3) => [...TOURS.filter((o) => o.id !== t.id && o.group === t.group), ...TOURS.filter((o) => o.group !== t.group)].slice(0, n);
