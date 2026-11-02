// Data for the "Our highlights" grid on /destinations/north-sardinia.
//
// TODO(prices): every price, unit and "Max N" number below is EXAMPLE data
// taken from the design reference, not a confirmed offer. Replace them with
// the real figures from each partner before launch. The only values that came
// from the client earlier are the La Maddalena catamaran's €89 per person,
// Max 12 and "Lunch included". There is deliberately no visible "Example"
// tag on the cards (removed on request, same as /hotels).
// TODO(details): ratings, durations, start times, meeting points and
// itineraries in `detail` are sample copy too.
//
// "Highlights" shows ALL cards: `featured: true` ones first, then the rest.
// Each category pill shows only the cards in that category.
// Card photos: free stock from Pexels, credits in /workspace/north/source.md.

export type PerkIconKind = "meal" | "drink" | "wine" | "gear" | "snorkel" | "basket" | "luggage" | "breakfast";
export type ItineraryStep = { time: string; title: string; text: string };
export type HighlightDetail = {
  rating: string;
  summary: string;
  meetingPoint: string;
  highlights: string[];
  duration: string;
  times: string[];
  gallery: string[];
  included: string[];
  itinerary: ItineraryStep[];
};
export type Highlight = {
  title: string;
  type: string;
  category: string;
  image: string;
  featured: boolean;
  price: string;
  unit: string;
  maxGuests: number;
  perk: string;
  perkIcon: PerkIconKind;
  detail: HighlightDetail;
};

const IMG = "/destinations/north";

export const highlights: Highlight[] = [
  {
    title: "La Maddalena: all inclusive luxury catamaran tour",
    type: "Boat tour · Catamaran",
    category: "Boat Rentals",
    image: `${IMG}/ns-catamaran.webp`,
    featured: true,
    price: "89",
    unit: "per person",
    maxGuests: 12,
    perk: "Lunch included",
    perkIcon: "meal",
    detail: {
      rating: "4.9",
      duration: "Full day · 7 hours",
      times: ["09:00", "14:30"],
      summary: "Sail the La Maddalena archipelago aboard a luxury catamaran, with swim stops in turquoise bays, snorkelling and a relaxed lunch on board.",
      meetingPoint: "Palau harbour (Molo Vecchio)",
      highlights: ["Spargi & Budelli islands", "Pink sand beaches", "Snorkelling in turquoise coves"],
      gallery: [`${IMG}/ns-catamaran.webp`, "/experiences/katamaran.png", "/experiences/boat-tour.webp", "/destinations/islands.png"],
      included: ["Skipper & fuel", "Lunch on board", "Snorkelling gear", "Hotel pickup & drop off"],
      itinerary: [
        { time: "09:00", title: "Departure from Palau", text: "Board the catamaran and set sail toward the archipelago." },
        { time: "11:00", title: "Spargi & Budelli", text: "Swim stops at pink sand bays with time to snorkel." },
        { time: "13:00", title: "Lunch on board", text: "A relaxed Sardinian lunch while anchored in a quiet cove." },
        { time: "16:00", title: "Return to Palau", text: "Cruise back with a final swim stop along the way." },
      ],
    },
  },
  {
    title: "Costa Smeralda: private yacht day charter with skipper",
    type: "Boat tour · Yacht",
    category: "Boat Rentals",
    image: `${IMG}/ns-yacht.webp`,
    featured: true,
    price: "149",
    unit: "per person",
    maxGuests: 8,
    perk: "Drinks included",
    perkIcon: "drink",
    detail: {
      rating: "4.8",
      duration: "Full day · 8 hours",
      times: ["09:30"],
      summary: "A private yacht day along the Costa Smeralda with your own skipper: secluded coves, swim stops and time to unwind on deck.",
      meetingPoint: "Porto Cervo marina",
      highlights: ["Costa Smeralda coastline", "Secluded swim bays", "Golden hour cruise back"],
      gallery: [`${IMG}/ns-yacht.webp`, "/experiences/yacht.png", "/experiences/boat-tour.webp", "/destinations/islands.png"],
      included: ["Private skipper", "Fuel & mooring", "Welcome drinks", "Towels & gear"],
      itinerary: [
        { time: "09:30", title: "Boarding at Porto Cervo", text: "Meet your skipper and settle in on board." },
        { time: "12:00", title: "Coastal cruise", text: "Anchor at secluded bays along the Costa Smeralda." },
        { time: "14:00", title: "Lunch stop", text: "Optional beach club lunch or a platter on board." },
        { time: "17:30", title: "Return", text: "Head back into Porto Cervo at golden hour." },
      ],
    },
  },
  {
    title: "Gallura: guided quad & off road adventure through the inland",
    type: "Adventure · Quad",
    category: "4×4 Tours",
    image: `${IMG}/ns-quad.webp`,
    featured: true,
    price: "75",
    unit: "per person",
    maxGuests: 8,
    perk: "Gear included",
    perkIcon: "gear",
    detail: {
      rating: "4.7",
      duration: "Half day · 4 hours",
      times: ["09:00", "15:00"],
      summary: "A guided quad adventure through the granite hills and cork forests of Gallura, with panoramic stops and all the gear included.",
      meetingPoint: "Tour base near Arzachena",
      highlights: ["The granite hills of Gallura", "Cork oak forests", "Panoramic valley viewpoint"],
      gallery: [`${IMG}/ns-quad.webp`, "/experiences/quad.png", "/experiences/off-road.png", "/destinations/interlands.png"],
      included: ["Quad & fuel", "Helmet & gear", "Expert guide", "Bottled water"],
      itinerary: [
        { time: "09:00", title: "Briefing & gear", text: "Safety briefing and a short practice loop." },
        { time: "09:45", title: "Inland trails", text: "Ride through the granite hills and cork forests of Gallura." },
        { time: "11:30", title: "Panoramic stop", text: "Break at a viewpoint over the valley." },
        { time: "13:00", title: "Return to base", text: "Head back after a final stretch of trail." },
      ],
    },
  },
  {
    title: "Sardinian cooking class: fresh pasta and local wine tasting",
    type: "Food · Cooking class",
    category: "Cooking Classes",
    image: `${IMG}/ns-cooking.webp`,
    featured: true,
    price: "65",
    unit: "per person",
    maxGuests: 10,
    perk: "Wine included",
    perkIcon: "wine",
    detail: {
      rating: "4.9",
      duration: "3 hours",
      times: ["11:00", "17:00"],
      summary: "A hands on Sardinian cooking class: make fresh pasta and a traditional main, then sit down to enjoy it all with local wine.",
      meetingPoint: "Cookery studio, central Olbia",
      highlights: ["A local Sardinian kitchen", "Handmade pasta technique", "Traditional family recipes"],
      gallery: [`${IMG}/ns-cooking.webp`, "/experiences/cooking.png", "/experiences/cooking-class.png", "/explore/food-expierences.png"],
      included: ["All ingredients", "Local wine tasting", "Recipe booklet", "The full meal you cook"],
      itinerary: [
        { time: "11:00", title: "Market & welcome", text: "Meet your host and taste a welcome glass of wine." },
        { time: "11:30", title: "Fresh pasta", text: "Learn to make handmade pasta from scratch." },
        { time: "12:30", title: "Cook the mains", text: "Prepare a traditional Sardinian main course." },
        { time: "13:15", title: "Sit down & eat", text: "Enjoy the full meal you prepared, paired with wine." },
      ],
    },
  },
  {
    title: "Stintino & La Pelosa: RIB boat tour to Asinara",
    type: "Boat tour · RIB",
    category: "Boat Rentals",
    image: `${IMG}/ns-pelosa.webp`,
    featured: true,
    price: "90",
    unit: "per person",
    maxGuests: 10,
    perk: "Snorkeling gear",
    perkIcon: "snorkel",
    detail: {
      rating: "4.8",
      summary: "A fast RIB tour from Stintino to the Asinara national park, with crystal clear swim stops and time at La Pelosa beach.",
      meetingPoint: "Stintino marina",
      highlights: ["Asinara National Park", "La Pelosa beach", "Crystal clear coves"],
      duration: "Half day · 5 hours",
      times: ["09:30", "14:00"],
      gallery: [`${IMG}/ns-pelosa.webp`, "/destinations/islands.png", "/explore/blue-zone.png", "/experiences/boat-tour.webp"],
      included: ["Skipper & fuel", "Snorkelling gear", "Park entrance", "Fresh water on board"],
      itinerary: [
        { time: "09:30", title: "Depart from Stintino", text: "Board the RIB and head out toward Asinara." },
        { time: "11:00", title: "Asinara swim stops", text: "Anchor at clear water coves for swimming and snorkelling." },
        { time: "13:30", title: "La Pelosa", text: "Finish with time at the famous shallow beach." },
      ],
    },
  },
  {
    title: "Gallura wine estates: guided tasting & vineyard tour",
    type: "Wine · Tasting",
    category: "Wine Tasting",
    image: `${IMG}/ns-wine.webp`,
    featured: true,
    price: "59",
    unit: "per person",
    maxGuests: 12,
    perk: "Local products",
    perkIcon: "basket",
    detail: {
      rating: "4.9",
      summary: "Visit a family run Vermentino estate in Gallura, walk the vineyards and taste local wines paired with Sardinian bites.",
      meetingPoint: "Vermentino estate near Arzachena",
      highlights: ["Vineyard walk", "The estate cellar", "Local food pairings"],
      duration: "3 hours",
      times: ["11:00", "16:30"],
      gallery: [`${IMG}/ns-wine.webp`, "/explore/food-expierences.png", "/destinations/interlands.png", "/experiences/cooking-class.png"],
      included: ["Guided vineyard walk", "4 wine tastings", "Local food pairings", "Estate tour"],
      itinerary: [
        { time: "11:00", title: "Estate welcome", text: "Meet the winemaker and tour the cellar." },
        { time: "11:45", title: "Vineyard walk", text: "Stroll the Vermentino vines with tasting notes." },
        { time: "12:30", title: "Guided tasting", text: "Taste four wines paired with local produce." },
      ],
    },
  },
  {
    title: "Costa Smeralda: private transfer from Olbia Airport",
    type: "Transfer · Private car",
    category: "Private Transfers",
    image: `${IMG}/ns-transfer.webp`,
    featured: true,
    price: "70",
    unit: "per transfer",
    maxGuests: 4,
    perk: "Luggage included",
    perkIcon: "luggage",
    detail: {
      rating: "4.9",
      summary: "A private door to door transfer between Olbia Airport and your Costa Smeralda stay, with a professional local driver.",
      meetingPoint: "Olbia Airport arrivals hall",
      highlights: ["Scenic drive to the coast", "Door to door comfort"],
      duration: "About 45 min",
      times: ["On request"],
      gallery: [`${IMG}/ns-transfer.webp`, "/explore/private-transfer.png", "/destinations/north-sardinia.png", "/explore/tailor-made-tours.png"],
      included: ["Private vehicle", "Professional driver", "Meet & greet", "Luggage assistance"],
      itinerary: [
        { time: "Step 1", title: "Airport pickup", text: "Your driver meets you in arrivals with a name sign." },
        { time: "Step 2", title: "Direct transfer", text: "Travel comfortably to your accommodation." },
        { time: "Step 3", title: "Drop off", text: "Arrive at your door with help for your luggage." },
      ],
    },
  },
  {
    title: "Boutique seaview stay near Palau",
    type: "Hotel · Seaview",
    category: "Hotels",
    image: `${IMG}/ns-hotel.webp`,
    featured: true,
    price: "120",
    unit: "per night",
    maxGuests: 2,
    perk: "Breakfast included",
    perkIcon: "breakfast",
    detail: {
      rating: "4.7",
      summary: "A small boutique hotel above Palau with sea view rooms, an easy base for the archipelago and the northeast coast.",
      meetingPoint: "Reception, Palau",
      highlights: ["Sea view rooms", "Sunset terrace", "Easy base for the north"],
      duration: "From 1 night",
      times: ["Check in 15:00"],
      gallery: [`${IMG}/ns-hotel.webp`, "/experiences/hotel.png", "/destinations/east-sardinia.png", "/destinations/south-sardinia.png"],
      included: ["Sea view room", "Breakfast", "Free parking", "Wi-Fi"],
      itinerary: [
        { time: "15:00", title: "Check in", text: "Settle into your sea view room." },
        { time: "19:30", title: "Sunset terrace", text: "Aperitivo overlooking the bay." },
        { time: "08:00", title: "Breakfast", text: "Sardinian breakfast before your day out." },
      ],
    },
  },
  {
    title: "Castelsardo & the northwest coast: 4×4 day tour",
    type: "Adventure · 4×4",
    category: "4×4 Tours",
    image: "/experiences/escursioni.png",
    featured: false,
    price: "95",
    unit: "per person",
    maxGuests: 6,
    perk: "Lunch included",
    perkIcon: "meal",
    detail: {
      rating: "4.8",
      summary: "A full day 4×4 tour to the medieval town of Castelsardo and the wild northwest coast, with off road trails and coastal views.",
      meetingPoint: "Hotel pickup (northwest area)",
      highlights: ["Castelsardo fortress town", "Wild northwest coast", "Off road backcountry trails"],
      duration: "Full day · 8 hours",
      times: ["09:00"],
      gallery: ["/experiences/escursioni.png", "/destinations/west-sardinia.png", "/experiences/off-road.png"],
      included: ["4×4 with guide", "Lunch", "Castelsardo visit", "Hotel pickup"],
      itinerary: [
        { time: "09:00", title: "Pickup & briefing", text: "Meet your guide and set off along the coast." },
        { time: "11:00", title: "Castelsardo", text: "Explore the medieval fortress town." },
        { time: "13:00", title: "Coastal lunch", text: "Lunch with a view before the afternoon trails." },
        { time: "16:00", title: "Off road return", text: "Head back through scenic backroads." },
      ],
    },
  },
  {
    title: "Golfo Aranci: dolphin watching boat trip",
    type: "Boat tour · Dolphin watching",
    category: "Boat Rentals",
    image: "/destinations/east-sardinia.png",
    featured: false,
    price: "69",
    unit: "per person",
    maxGuests: 12,
    perk: "Drinks included",
    perkIcon: "drink",
    detail: {
      rating: "4.7",
      summary: "A morning boat trip off Golfo Aranci in search of resident dolphins, with a marine guide and time for a swim stop.",
      meetingPoint: "Golfo Aranci port",
      highlights: ["Resident bottlenose dolphins", "Open sea views", "A quiet swim bay"],
      duration: "Half day · 3.5 hours",
      times: ["09:00", "13:30"],
      gallery: ["/destinations/east-sardinia.png", "/explore/blue-zone.png", "/experiences/boat-tour.webp"],
      included: ["Marine guide", "Drinks on board", "Swim stop", "Hotel pickup"],
      itinerary: [
        { time: "09:00", title: "Depart Golfo Aranci", text: "Head out with your marine guide to the feeding grounds." },
        { time: "10:00", title: "Dolphin watching", text: "Spot resident bottlenose dolphins from the deck." },
        { time: "11:30", title: "Swim stop", text: "Anchor in a quiet bay for a refreshing swim." },
      ],
    },
  },
];
