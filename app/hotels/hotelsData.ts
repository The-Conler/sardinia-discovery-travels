export type Area = "North" | "South" | "East" | "West" | "Inland";
export type StayType = "Hotels" | "Villas" | "Apartments" | "Resorts" | "Agriturismi";
export type Amenity = "seaview" | "pool" | "breakfast" | "parking" | "wifi" | "spa";

export const AREAS: { id: Area; img: string; pos?: string; text: string }[] = [
  { id: "North", img: "/hotels/area-north.webp", pos: "50% 60%", text: "Granite coasts, the Costa Smeralda and the La Maddalena islands." },
  { id: "South", img: "/hotels/area-south.webp", pos: "50% 62%", text: "Long sandy beaches around Chia and Villasimius, close to Cagliari." },
  { id: "East", img: "/hotels/area-east.webp", pos: "50% 55%", text: "The Gulf of Orosei, with high cliffs and coves you reach by boat." },
  { id: "West", img: "/hotels/area-west.webp", pos: "50% 45%", text: "Alghero, Bosa and a quiet coast with sunsets over the sea." },
  { id: "Inland", img: "/hotels/area-inland.webp", pos: "50% 50%", text: "Mountain villages, farm stays and walks in the Gennargentu." },
];

export const STAY_TYPES: { id: StayType; one: string }[] = [
  { id: "Hotels", one: "Hotel" },
  { id: "Villas", one: "Villa" },
  { id: "Apartments", one: "Apartment" },
  { id: "Resorts", one: "Resort" },
  { id: "Agriturismi", one: "Agriturismo" },
];

export const AMENITY_LABEL: Record<Amenity, string> = {
  seaview: "Sea view",
  pool: "Pool",
  breakfast: "Breakfast",
  parking: "Parking",
  wifi: "Wi-Fi",
  spa: "Spa",
};

export type Stay = {
  id: string;
  name: string;
  area: Area;
  type: StayType;
  img: string;
  pos?: string;
  text: string;
  amenities: Amenity[];
  from: number;
  /** Always true for now: shown as an "Example" tag on the card. */
  example: true;
};

/*
 * EXAMPLE STAYS: placeholder content approved for the first version.
 * Names, descriptions and prices are invented and generic, they are not real
 * properties, and the photos are free stock (credits in /workspace/hotels/source.md).
 * No ratings on purpose.
 * TODO: replace with the real partner stays (name, area, type, photos,
 * amenities and real "from" prices) and drop the `example` flag.
 */
export const STAYS: Stay[] = [
  {
    id: "granite-courtyard-hotel",
    name: "Granite Courtyard Hotel",
    area: "North",
    type: "Hotels",
    img: "/hotels/stay-courtyard-hotel.webp",
    pos: "50% 50%",
    text: "A small hotel around a shaded courtyard, a short drive from the Costa Smeralda beaches.",
    amenities: ["breakfast", "wifi", "parking"],
    from: 180,
    example: true,
  },
  {
    id: "juniper-garden-villa",
    name: "Juniper Garden Villa",
    area: "North",
    type: "Villas",
    img: "/hotels/stay-garden-villa.webp",
    pos: "50% 40%",
    text: "A stone villa with a flower garden and room for two families, ten minutes from the sea.",
    amenities: ["pool", "seaview", "parking", "wifi"],
    from: 420,
    example: true,
  },
  {
    id: "bay-pool-resort",
    name: "Bay Pool Resort",
    area: "South",
    type: "Resorts",
    img: "/hotels/stay-pool-resort.webp",
    pos: "40% 50%",
    text: "A resort with a large pool, shaded loungers and a sandy beach a few steps away.",
    amenities: ["pool", "breakfast", "spa", "wifi"],
    from: 260,
    example: true,
  },
  {
    id: "lookout-terrace-apartment",
    name: "Lookout Terrace Apartment",
    area: "South",
    type: "Apartments",
    img: "/hotels/stay-terrace-apartment.webp",
    pos: "50% 45%",
    text: "A bright apartment with a private terrace and a wide view over the bay.",
    amenities: ["seaview", "wifi", "parking"],
    from: 140,
    example: true,
  },
  {
    id: "cove-sun-resort",
    name: "Cove Sun Resort",
    area: "East",
    type: "Resorts",
    img: "/hotels/stay-poolside-resort.webp",
    pos: "50% 55%",
    text: "A quiet resort near the Gulf of Orosei with a pool deck, a spa and easy parking.",
    amenities: ["pool", "spa", "breakfast", "parking"],
    from: 230,
    example: true,
  },
  {
    id: "sea-balcony-rooms",
    name: "Sea Balcony Rooms",
    area: "East",
    type: "Hotels",
    img: "/hotels/stay-sea-view-room.webp",
    pos: "60% 50%",
    text: "Calm, simple rooms with balconies over the sea and breakfast on the terrace.",
    amenities: ["seaview", "breakfast", "wifi"],
    from: 150,
    example: true,
  },
  {
    id: "blue-shutter-apartment",
    name: "Blue Shutter Apartment",
    area: "West",
    type: "Apartments",
    img: "/hotels/stay-old-town-apartment.webp",
    pos: "50% 40%",
    text: "A renovated apartment in the old town, a short walk from the sea walls and restaurants.",
    amenities: ["wifi", "parking"],
    from: 120,
    example: true,
  },
  {
    id: "olive-hill-farm-stay",
    name: "Olive Hill Farm Stay",
    area: "Inland",
    type: "Agriturismi",
    img: "/hotels/stay-stone-farmhouse.webp",
    pos: "50% 55%",
    text: "A family farm with stone rooms, home cooking and country walks from the door.",
    amenities: ["breakfast", "parking", "wifi"],
    from: 110,
    example: true,
  },
];

// Extras a guest can ask for in the request form (step 3). icon = a name in icons.tsx.
export const EXTRAS: { label: string; icon: string }[] = [
  { label: "Swimming pool", icon: "pool" },
  { label: "Spa or wellness", icon: "spa" },
  { label: "Private chef", icon: "chef" },
  { label: "Sea view", icon: "seaview" },
  { label: "Beach nearby", icon: "beach" },
  { label: "Air conditioning", icon: "aircon" },
  { label: "Parking", icon: "parking" },
  { label: "Breakfast included", icon: "breakfast" },
  { label: "Family friendly", icon: "users" },
  { label: "Pets welcome", icon: "paw" },
  { label: "Boat or car hire help", icon: "ship" },
];

export const BUDGETS = ["Under €100", "€100 to €200", "€200 to €350", "€350 to €500", "Over €500", "Not sure yet"];
export const AIRPORTS = ["Olbia airport", "Cagliari airport", "Alghero airport"];
export const PORTS = ["Olbia port", "Golfo Aranci port", "Porto Torres port", "Cagliari port", "Arbatax port"];
