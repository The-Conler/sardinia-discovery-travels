// Contact-form data model, option lists, step order and per-step validation.

export type Opt = { value: string; label: string; icon?: string; hint?: string; image?: string };

export type ContactData = {
  /** "guided" is the step-by-step wizard, "quick" the one-screen request. */
  mode: "guided" | "quick";
  quickTopics: string[];
  quickDates: string;
  quickPeople: number;
  interests: string[];
  interestOther: string;
  /** Optional, only when the Wine Tour interest is selected. */
  multiWinery: boolean;
  boatLocation: string;
  boatType: string;
  boatDuration: string;
  boatStyle: string;
  transferFrom: string;
  transferTo: string;
  transferTrip: string;
  transferBags: number;
  transferItems: string[];
  tripArrival: string;
  tripDeparture: string;
  activityDate1: string;
  activityDate2: string;
  datesFlexible: boolean;
  datesNote: string;
  adults: number;
  children: number;
  childAges: string[];
  infants: number;
  /** Set when adults + children + infants is 13 or more. */
  groupType: string;
  groupNotes: string;
  swimming: string;
  arrivalMethod: string;
  airport: string;
  flightNumber: string;
  port: string;
  arrivalDate: string;
  arrivalTime: string;
  rentalCar: string;
  rentalCarType: string;
  rentalCarSeats: string;
  rentalCarSize: string;
  pickup: string;
  stayArea: string;
  stayAddress: string;
  stayNotBooked: boolean;
  stayType: string;
  stayRoom: string;
  stayRoomsCount: string;
  stayBoard: string;
  stayRequest: string;
  stayAmenities: string[];
  needs: string[];
  celebration: string;
  needsDetail: string;
  budget: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  timeZone: string;
  replyVia: string;
  heardFrom: string;
  /** Slug of a sample or real package opened from /pacchetti. Empty when none. */
  packageSlug: string;
};

export const emptyData: ContactData = {
  mode: "guided", quickTopics: [], quickDates: "", quickPeople: 0,
  interests: [], interestOther: "", multiWinery: false,
  boatLocation: "", boatType: "", boatDuration: "", boatStyle: "",
  transferFrom: "", transferTo: "", transferTrip: "", transferBags: 0, transferItems: [],
  tripArrival: "", tripDeparture: "", activityDate1: "", activityDate2: "", datesFlexible: false, datesNote: "",
  adults: 2, children: 0, childAges: [], infants: 0, groupType: "", groupNotes: "", swimming: "",
  arrivalMethod: "", airport: "", flightNumber: "", port: "", arrivalDate: "", arrivalTime: "", rentalCar: "", rentalCarType: "", rentalCarSeats: "", rentalCarSize: "", pickup: "",
  stayArea: "", stayAddress: "", stayNotBooked: false,
  stayType: "", stayRoom: "", stayRoomsCount: "", stayBoard: "", stayRequest: "", stayAmenities: [],
  needs: [], celebration: "", needsDetail: "", budget: "", message: "",
  firstName: "", lastName: "", email: "", phone: "", country: "", timeZone: "", replyVia: "", heardFrom: "",
  packageSlug: "",
};

export const INTERESTS: Opt[] = [
  { value: "boat", label: "Boat tour", icon: "sailboat", hint: "A day on the water", image: "/contact/card-boat.webp" },
  { value: "wine", label: "Wine tour", icon: "wine", hint: "Tastings at local wineries", image: "/destinations/north/ns-wine.webp" },
  { value: "transfer", label: "Private transfer", icon: "car", hint: "Airport, port or hotel rides", image: "/contact/card-transfer.webp" },
  { value: "trip", label: "Destination / multi-day trip", icon: "map", hint: "Several days around the island", image: "/contact/card-trip.webp" },
  { value: "other", label: "Something else", icon: "message", hint: "Tell us what you'd like", image: "/contact/card-other.webp" },
];

/**
 * Optional Wine Tour checkbox. The form itself is English.
 * it and nl match the languages in the site header.
 */
export const WINE_MULTI_COPY = {
  en: {
    label: "I'd like to visit more than one winery",
    hint: "The tour operator will suggest the best combination of nearby wineries.",
  },
  it: {
    label: "Voglio visitare più cantine",
    hint: "Il tour operator ti proporrà la combinazione di cantine vicine più adatta.",
  },
  nl: {
    label: "Ik wil graag meer dan één wijnhuis bezoeken",
    hint: "De touroperator stelt de beste combinatie van wijnhuizen in de buurt voor.",
  },
} as const;

/** Topics for the quick request (same values as INTERESTS, shorter labels). */
export const QUICK_TOPICS: Opt[] = [
  { value: "boat", label: "Boat tour", icon: "sailboat" },
  { value: "wine", label: "Wine tour", icon: "wine" },
  { value: "transfer", label: "Private transfer", icon: "car" },
  { value: "trip", label: "Multi-day trip", icon: "map" },
  { value: "other", label: "Something else", icon: "message" },
];

export const LOCATIONS: Opt[] = [
  { value: "maddalena", label: "La Maddalena", icon: "pin" },
  { value: "baunei", label: "Baunei (Cala Goloritzè)", icon: "pin" },
  { value: "tavolara", label: "Tavolara", icon: "pin" },
  { value: "asinara", label: "Asinara", icon: "pin" },
  { value: "alghero", label: "Alghero", icon: "pin" },
  { value: "cagliari", label: "Cagliari", icon: "pin" },
  { value: "corsica", label: "Corsica", icon: "pin" },
  { value: "notsure", label: "Not sure yet", icon: "help" },
];

export const BOAT_TYPES: Opt[] = [
  { value: "catamaran", label: "Catamaran", icon: "sailboat" },
  { value: "sailboat", label: "Sailboat", icon: "anchor" },
  { value: "rib", label: "RIB", icon: "zap" },
  { value: "yacht", label: "Yacht", icon: "crown" },
  { value: "help", label: "Help me choose", icon: "help" },
];

export const DURATIONS: Opt[] = [
  { value: "half", label: "Half day", icon: "clock" },
  { value: "full", label: "Full day", icon: "sun" },
  { value: "notsure", label: "Not sure", icon: "help" },
];

export const BOAT_STYLES: Opt[] = [
  { value: "shared", label: "Shared", icon: "users", hint: "Join other guests on board" },
  { value: "private", label: "Private", icon: "lock", hint: "Just your group on board" },
];

export const TRANSFER_TRIPS: Opt[] = [
  { value: "oneway", label: "One-way", icon: "arrowRight" },
  { value: "return", label: "Return", icon: "repeat" },
];

export const TRANSFER_ITEMS: Opt[] = [
  { value: "bikes", label: "Bikes", icon: "bike" },
  { value: "surfboards", label: "Surfboards", icon: "waves" },
  { value: "stroller", label: "Stroller", icon: "baby" },
];

export const PLACE_SUGGESTIONS = [
  "Olbia Airport", "Alghero Airport", "Cagliari Airport",
  "Olbia port", "Golfo Aranci port", "Porto Torres port", "Santa Teresa Gallura port", "Cagliari port", "Arbatax port",
  "My hotel / accommodation",
];

export const SWIMMING: Opt[] = [
  { value: "yes", label: "Yes, everyone", icon: "waves" },
  { value: "some", label: "Some of us", icon: "users" },
  { value: "no", label: "No", icon: "x" },
];

export const ARRIVAL_METHODS: Opt[] = [
  { value: "plane", label: "Plane", icon: "plane" },
  { value: "ferry", label: "Ferry", icon: "ship" },
  { value: "here", label: "Already in Sardinia", icon: "pin" },
];

export const AIRPORTS: Opt[] = [
  { value: "olbia", label: "Olbia (OLB)" },
  { value: "alghero", label: "Alghero (AHO)" },
  { value: "cagliari", label: "Cagliari (CAG)" },
];

export const PORTS: Opt[] = [
  { value: "olbia", label: "Olbia" },
  { value: "golfo-aranci", label: "Golfo Aranci" },
  { value: "porto-torres", label: "Porto Torres" },
  { value: "cagliari", label: "Cagliari" },
  { value: "santa-teresa", label: "Santa Teresa Gallura" },
  { value: "arbatax", label: "Arbatax" },
];

/** Rental car: book yourself, ask us to arrange it, or skip. */
export const RENTAL_CAR: Opt[] = [
  { value: "myself", label: "I'll book it myself" },
  { value: "for_me", label: "Book it for me" },
  { value: "no", label: "No" },
  { value: "notsure", label: "Not sure" },
];

export const CAR_TYPES: Opt[] = [
  { value: "suv", label: "SUV" },
  { value: "sport", label: "Sport" },
  { value: "berlina", label: "Sedan" },
  { value: "citycar", label: "City car" },
];

export const CAR_SEATS: Opt[] = [
  { value: "2", label: "2 seats" },
  { value: "4", label: "4 seats" },
  { value: "5", label: "5 seats" },
  { value: "7", label: "7 seats" },
  { value: "9", label: "9+ seats" },
];

export const CAR_SIZES: Opt[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const STAY_TYPES: Opt[] = [
  { value: "hotel_resort", label: "Hotel or resort" },
  { value: "bnb", label: "B&B" },
  { value: "apartment", label: "Private apartment" },
  { value: "villa", label: "Villa" },
];

export const STAY_ROOMS: Opt[] = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "triple", label: "Triple" },
  { value: "quad", label: "4 people" },
  { value: "more", label: "More than 4" },
];

export const STAY_ROOMS_COUNT: Opt[] = [
  { value: "1", label: "1 room" },
  { value: "2", label: "2 rooms" },
  { value: "3", label: "3 rooms" },
];

export const STAY_BOARD: Opt[] = [
  { value: "bnb", label: "Bed and breakfast" },
  { value: "half", label: "Half board" },
  { value: "full", label: "Full board" },
];

export const STAY_AMENITIES: Opt[] = [
  { value: "spa", label: "Spa" },
  { value: "sea_view", label: "Sea view" },
  { value: "pool", label: "Pool" },
  { value: "parking", label: "Parking" },
  { value: "animals", label: "Pets welcome" },
  { value: "kids_club", label: "Kids club" },
];

/** Half day is only offered for RIB (gommone). */
export const DURATIONS_RIB: Opt[] = DURATIONS;
export const DURATIONS_OTHER: Opt[] = DURATIONS.filter((o) => o.value !== "half");

export const guestTotal = (d: ContactData) => d.adults + d.children + d.infants;
export const isLargeGroup = (d: ContactData) => guestTotal(d) >= 13;

/** Shown only when the party is 13 or more. Labels stay in the form's English. */
export const GROUP_TYPES: Opt[] = [
  { value: "family", label: "Family or friends" },
  { value: "company", label: "Company" },
  { value: "school", label: "School" },
  { value: "association", label: "Association" },
  { value: "other", label: "Other" },
];

export const YES_NO_UNSURE: Opt[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "notsure", label: "Not sure" },
];

export const YES_NO: Opt[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const NEEDS: Opt[] = [
  { value: "celebration", label: "Celebration", icon: "cake" },
  { value: "dietary", label: "Dietary needs", icon: "utensils" },
  { value: "mobility", label: "Mobility needs", icon: "accessibility" },
  { value: "seasickness", label: "Seasickness", icon: "waves" },
  { value: "photography", label: "Photography", icon: "camera" },
];

export const CELEBRATIONS: Opt[] = [
  { value: "birthday", label: "Birthday", icon: "cake" },
  { value: "honeymoon", label: "Honeymoon", icon: "heart" },
  { value: "proposal", label: "Proposal", icon: "gem" },
  { value: "other", label: "Something else" },
];

export const BUDGETS: Opt[] = [
  { value: "under100", label: "Under €100" },
  { value: "100-250", label: "€100 to €250" },
  { value: "250-500", label: "€250 to €500" },
  { value: "500plus", label: "€500+" },
  { value: "na", label: "Prefer not to say" },
];

export const REPLY_VIA: Opt[] = [
  { value: "email", label: "Email", icon: "mail" },
  { value: "whatsapp", label: "WhatsApp", icon: "message" },
];

export const HEARD_FROM: Opt[] = [
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google" },
  { value: "friend", label: "Friend or family" },
  { value: "other", label: "Other" },
];

export const COUNTRY_SUGGESTIONS = [
  "United States", "Canada", "United Kingdom", "Ireland", "Australia", "Italy", "Germany", "France",
  "Netherlands", "Belgium", "Switzerland", "Spain", "Sweden", "Norway", "Denmark",
];

export type StepId =
  | "intro" | "interests" | "boatWhere" | "boatHow" | "transfer" | "dates" | "guests"
  | "arrival" | "stay" | "extras" | "about" | "review" | "thanks" | "quick";

export const ALL_STEPS: StepId[] = [
  "intro", "interests", "boatWhere", "boatHow", "transfer", "dates", "guests",
  "arrival", "stay", "extras", "about", "review", "thanks", "quick",
];

export const wantsBoat = (d: ContactData) => d.interests.includes("boat");
export const wantsWine = (d: ContactData) => d.interests.includes("wine") || d.quickTopics.includes("wine");
export const wantsTransfer = (d: ContactData) => d.interests.includes("transfer");
/** The pickup question is pointless when the only thing asked for is a transfer. */
export const asksPickup = (d: ContactData) => !(d.interests.length === 1 && wantsTransfer(d));

export function activeSteps(d: ContactData): StepId[] {
  return ALL_STEPS.filter((s) => {
    if (s === "quick") return false; // the quick request is its own one-screen path
    if (s === "boatWhere" || s === "boatHow") return wantsBoat(d);
    if (s === "transfer") return wantsTransfer(d);
    return true;
  });
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const filled = (v: string) => v.trim().length > 0;

export function stepValid(step: StepId, d: ContactData): boolean {
  switch (step) {
    case "interests":
      return d.interests.length > 0 && (!d.interests.includes("other") || filled(d.interestOther));
    case "boatWhere":
      return !!d.boatLocation;
    case "boatHow": {
      if (!d.boatType || !d.boatDuration || !d.boatStyle) return false;
      if (d.boatDuration === "half" && d.boatType !== "rib") return false;
      return true;
    }
    case "transfer":
      return filled(d.transferFrom) && filled(d.transferTo) && !!d.transferTrip;
    case "dates": {
      const haveDates = !!d.tripArrival && !!d.tripDeparture && d.tripDeparture >= d.tripArrival;
      return d.datesFlexible ? haveDates || filled(d.datesNote) : haveDates;
    }
    case "guests":
      return d.adults >= 1 && d.childAges.length === d.children && d.childAges.every(filled) && (!wantsBoat(d) || !!d.swimming) && (!isLargeGroup(d) || !!d.groupType);
    case "arrival": {
      if (!d.arrivalMethod) return false;
      if (d.arrivalMethod === "plane" && !d.airport) return false;
      if (d.arrivalMethod === "ferry" && !d.port) return false;
      // Migrate legacy "yes" answers to "myself".
      const car = d.rentalCar === "yes" ? "myself" : d.rentalCar;
      if (!car) return false;
      if (car === "for_me" && (!d.rentalCarType || !d.rentalCarSeats || !d.rentalCarSize)) return false;
      return (!asksPickup(d) || !!d.pickup);
    }
    case "stay":
      if (d.stayNotBooked) return !!d.stayType;
      return filled(d.stayArea);
    case "extras":
      return !!d.budget && (!d.needs.includes("celebration") || !!d.celebration);
    case "quick":
      return filled(d.firstName) && filled(d.lastName) && isEmail(d.email) && filled(d.phone) && !!d.replyVia && filled(d.message);
    case "about":
      return filled(d.firstName) && filled(d.lastName) && isEmail(d.email) && filled(d.phone) && filled(d.country) && filled(d.timeZone) && !!d.replyVia;
    default:
      return true;
  }
}

export const labelOf = (opts: Opt[], v: string) => opts.find((o) => o.value === v)?.label ?? v;
export const labelsOf = (opts: Opt[], vs: string[]) => vs.map((v) => labelOf(opts, v)).join(", ");
