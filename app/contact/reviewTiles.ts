// Friendly, sentence-style summary tiles for the review step.
// Every answer from the form appears in one of these tiles.
import {
  AIRPORTS, BOAT_TYPES, BUDGETS, CAR_SEATS, CAR_SIZES, CAR_TYPES, CELEBRATIONS, GROUP_TYPES, HEARD_FROM, INTERESTS, LOCATIONS,
  NEEDS, PORTS, STAY_AMENITIES, STAY_BOARD, STAY_ROOMS, STAY_ROOMS_COUNT, STAY_TYPES, TRANSFER_ITEMS,
  asksPickup, isLargeGroup, labelOf, labelsOf, wantsBoat, wantsTransfer,
} from "./contactData";
import type { ContactData, StepId } from "./contactData";

export type ReviewTile = {
  step: StepId;
  icon: string;
  title: string;
  headline: string;
  details: string[];
  quote?: string;
  wide?: boolean;
  lines?: boolean;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d, wd: DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] };
};
const shortDate = (iso: string) => {
  const p = parts(iso);
  return p ? `${p.wd} ${p.d} ${MONTHS[p.m - 1]}` : iso;
};
const range = (a: string, b: string) => {
  const p = parts(a), q = parts(b);
  if (!p || !q) return "";
  if (p.y === q.y && p.m === q.m) return `${p.d} to ${q.d} ${MONTHS[q.m - 1]} ${q.y}`;
  if (p.y === q.y) return `${p.d} ${MONTHS[p.m - 1]} to ${q.d} ${MONTHS[q.m - 1]} ${q.y}`;
  return `${p.d} ${MONTHS[p.m - 1]} ${p.y} to ${q.d} ${MONTHS[q.m - 1]} ${q.y}`;
};
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const andList = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const end = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

export function buildReviewTiles(d: ContactData): ReviewTile[] {
  const tiles: ReviewTile[] = [];

  // Boat tour
  if (wantsBoat(d)) {
    const type = d.boatType === "help" ? "A boat day" : labelOf(BOAT_TYPES, d.boatType);
    const where = d.boatLocation === "notsure" ? "" : labelOf(LOCATIONS, d.boatLocation);
    const headline = where ? `${type} in ${where}` : `${type}, place still open`;
    const length = d.boatDuration === "half" ? "Half day" : d.boatDuration === "full" ? "Full day" : "Length not decided";
    const details = [`${length}, ${d.boatStyle === "private" ? "private boat" : "shared with other guests"}.`];
    if (d.boatType === "help") details.push("Would like help choosing the boat.");
    if (d.boatLocation === "notsure") details.push("Not sure where to go yet.");
    tiles.push({ step: "boatWhere", icon: "sailboat", title: "Boat tour", headline, details, wide: true });
  }

  // What they want
  const interests = d.interests.map((v) => labelOf(INTERESTS, v).toLowerCase());
  tiles.push({
    step: "interests", icon: "compass", title: "Interested in",
    headline: cap(andList(interests)) || "Nothing chosen",
    details: [
      ...(d.interests.includes("other") && d.interestOther.trim() ? [end(d.interestOther)] : []),
      ...(d.interests.includes("wine") ? [d.multiWinery ? "I'd like to visit more than one winery." : "A single winery is fine."] : []),
    ],
  });

  // Transfer
  if (wantsTransfer(d)) {
    const details = [`${d.transferTrip === "return" ? "Return" : "One way"}, ${plural(d.transferBags, "large bag", "large bags")}.`];
    if (d.transferItems.length) details.push(`Bringing ${andList(d.transferItems.map((v) => (v === "stroller" ? "a stroller" : labelOf(TRANSFER_ITEMS, v).toLowerCase())))}.`);
    tiles.push({ step: "transfer", icon: "car", title: "Private transfer", headline: `${d.transferFrom} to ${d.transferTo}`, details });
  }

  // Dates
  {
    const r = range(d.tripArrival, d.tripDeparture);
    const details: string[] = [];
    if (d.datesFlexible) details.push(d.datesNote.trim() ? `Flexible. ${end(cap(d.datesNote))}` : "Dates are flexible.");
    const acts = [d.activityDate1, d.activityDate2].filter(Boolean).map(shortDate);
    if (acts.length) details.push(`Activity on ${acts.join(" or ")}.`);
    tiles.push({ step: "dates", icon: "calendar", title: "Dates", headline: r || (d.datesFlexible ? "Flexible dates" : "No dates yet"), details });
  }

  // Guests
  {
    const who = [plural(d.adults, "adult", "adults")];
    if (d.children) who.push(plural(d.children, "child", "children"));
    if (d.infants) who.push(plural(d.infants, "infant", "infants"));
    const details: string[] = [];
    if (d.children) details.push(d.children === 1 ? `Child age ${d.childAges[0]}.` : `Children ages ${andList(d.childAges)}.`);
    if (!d.children && !d.infants) details.push("No children or infants.");
    else if (!d.infants) details.push("No infants.");
    if (wantsBoat(d)) details.push(d.swimming === "yes" ? "Everyone can swim." : d.swimming === "some" ? "Some of the group can swim." : "Not everyone can swim.");
    if (isLargeGroup(d)) {
      details.push("Group of 13 or more: tailor-made trip.");
      if (d.groupType) details.push(`Group: ${labelOf(GROUP_TYPES, d.groupType)}.`);
      if (d.groupNotes.trim()) details.push(end(d.groupNotes));
    }
    tiles.push({ step: "guests", icon: "users", title: "Who's coming", headline: who.join(", "), details });
  }

  // Getting here
  {
    let headline = "Already in Sardinia";
    let icon = "pin";
    const details: string[] = [];
    const when = [d.arrivalDate || d.tripArrival ? shortDate(d.arrivalDate || d.tripArrival) : "", d.arrivalTime ? `at ${d.arrivalTime}` : ""].filter(Boolean).join(" ");
    if (d.arrivalMethod === "plane") {
      icon = "plane";
      headline = `Flying into ${labelOf(AIRPORTS, d.airport).replace(/ \(.*\)$/, "")}`;
      const flight = d.flightNumber.trim() ? `Flight ${d.flightNumber.trim().toUpperCase()}` : "Flight number not known yet";
      details.push(`${flight}${when ? `, landing ${when}` : ""}.`);
    } else if (d.arrivalMethod === "ferry") {
      icon = "ship";
      headline = `Ferry into ${labelOf(PORTS, d.port)}`;
      if (when) details.push(`Arriving ${when}.`);
    }
    const carVal = d.rentalCar === "yes" ? "myself" : d.rentalCar;
    let car = "Rental car not decided";
    if (carVal === "myself") car = "Will book a rental car independently";
    else if (carVal === "for_me") {
      const bits = [labelOf(CAR_TYPES, d.rentalCarType), labelOf(CAR_SEATS, d.rentalCarSeats), labelOf(CAR_SIZES, d.rentalCarSize)].filter(Boolean);
      car = bits.length ? `Richiesta auto a noleggio: ${bits.join(", ")}` : "Richiesta auto a noleggio";
    } else if (carVal === "no") car = "No rental car";
    else if (carVal === "notsure") car = "Rental car not decided";
    const pick = asksPickup(d) ? (d.pickup === "yes" ? ", needs a pickup to the boat or tour." : ", no pickup needed.") : ".";
    details.push(car + pick);
    tiles.push({ step: "arrival", icon, title: "Getting here", headline, details, wide: true });
  }

  // Staying
  {
    const details: string[] = [];
    if (d.stayNotBooked) {
      if (d.stayType) details.push(labelOf(STAY_TYPES, d.stayType) + ".");
      const roomBits = [d.stayRoom && labelOf(STAY_ROOMS, d.stayRoom), d.stayRoomsCount && labelOf(STAY_ROOMS_COUNT, d.stayRoomsCount), d.stayBoard && labelOf(STAY_BOARD, d.stayBoard)].filter(Boolean);
      if (roomBits.length) details.push(roomBits.join(", ") + ".");
      if (d.stayAmenities.length) details.push(`Looking for ${labelsOf(STAY_AMENITIES, d.stayAmenities).toLowerCase()}.`);
      if (d.stayRequest.trim()) details.push(end(d.stayRequest));
    } else if (!d.stayAddress.trim()) {
      details.push("No hotel or address given.");
    }
    tiles.push({
      step: "stay", icon: "home", title: "Staying",
      headline: d.stayNotBooked ? (d.stayType ? `Looking for a ${labelOf(STAY_TYPES, d.stayType).toLowerCase()}` : "Not booked yet") : d.stayAddress.trim() ? `${d.stayAddress.trim()}, ${d.stayArea.trim()}` : d.stayArea.trim(),
      details,
    });
  }

  // Good to know
  {
    const notes = d.needs.map((n) => {
      if (n === "celebration") return d.celebration && d.celebration !== "other" ? `${labelOf(CELEBRATIONS, d.celebration).toLowerCase()} celebration` : "a celebration";
      return labelOf(NEEDS, n).toLowerCase();
    });
    const budgetLabel = labelOf(BUDGETS, d.budget);
    const budgetShown = budgetLabel && budgetLabel !== d.budget ? budgetLabel : d.budget;
    const budget = d.budget === "na" ? "Prefers not to share a budget." : `Budget ${budgetShown} per person.`;
    const details: string[] = [];
    if (d.needsDetail.trim() && d.needs.length) details.push(end(d.needsDetail));
    details.push(budget);
    tiles.push({
      step: "extras", icon: "heart", title: "Good to know",
      headline: notes.length ? cap(andList(notes)) : "Nothing special to note",
      details, quote: d.message.trim() || undefined, wide: true,
    });
  }

  // You
  {
    const details = [
      d.email,
      d.phone,
      [d.country, d.timeZone && `${d.timeZone.replace(/_/g, " ")} time`].filter(Boolean).join(", ") + ".",
      `Reply ${d.replyVia === "whatsapp" ? "on WhatsApp" : "by email"}.${d.heardFrom ? ` Found us ${d.heardFrom === "friend" ? "through a friend" : d.heardFrom === "other" ? "another way" : `on ${labelOf(HEARD_FROM, d.heardFrom)}`}.` : ""}`,
    ].filter((x) => x && x !== ".");
    tiles.push({ step: "about", icon: "user", title: "You", headline: `${d.firstName} ${d.lastName}`.trim(), details, lines: true });
  }

  return tiles;
}
