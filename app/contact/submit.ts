// Builds the request summary (what the owner receives) and submits it.
import {
  AIRPORTS, ARRIVAL_METHODS, BOAT_STYLES, BOAT_TYPES, BUDGETS, CAR_SEATS, CAR_SIZES, CAR_TYPES, CELEBRATIONS,
  DURATIONS, GROUP_TYPES, HEARD_FROM, INTERESTS, LOCATIONS, NEEDS, PORTS, QUICK_TOPICS, RENTAL_CAR, REPLY_VIA, STAY_AMENITIES,
  STAY_BOARD, STAY_ROOMS, STAY_ROOMS_COUNT, STAY_TYPES, SWIMMING, TRANSFER_ITEMS, TRANSFER_TRIPS, YES_NO,
  asksPickup, isLargeGroup, labelOf, labelsOf, wantsBoat, wantsTransfer,
} from "./contactData";
import type { ContactData, StepId } from "./contactData";

export type ReviewSection = { step: StepId; title: string; rows: [string, string][] };

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

/** Every answer, grouped by step. Used by the review screen and the plain-text summary. */
export function buildReviewSections(d: ContactData): ReviewSection[] {
  const out: ReviewSection[] = [];
  const rows = (pairs: [string, string][]) => pairs.filter(([, v]) => v && v.trim() !== "");

  out.push({ step: "interests", title: "Interested in", rows: rows([
    ["Interests", labelsOf(INTERESTS, d.interests)],
    ["Details", d.interests.includes("other") ? d.interestOther : ""],
  ]) });

  if (wantsBoat(d)) {
    out.push({ step: "boatWhere", title: "Boat tour", rows: rows([
      ["Location", labelOf(LOCATIONS, d.boatLocation)],
      ["Boat type", labelOf(BOAT_TYPES, d.boatType)],
      ["Duration", labelOf(DURATIONS, d.boatDuration)],
      ["Shared or private", labelOf(BOAT_STYLES, d.boatStyle)],
    ]) });
  }

  if (wantsTransfer(d)) {
    out.push({ step: "transfer", title: "Private transfer", rows: rows([
      ["From", d.transferFrom],
      ["To", d.transferTo],
      ["Trip", labelOf(TRANSFER_TRIPS, d.transferTrip)],
      ["Large bags", String(d.transferBags)],
      ["Special items", labelsOf(TRANSFER_ITEMS, d.transferItems)],
    ]) });
  }

  out.push({ step: "dates", title: "Dates", rows: rows([
    ["Arrive in Sardinia", fmtDate(d.tripArrival)],
    ["Leave Sardinia", fmtDate(d.tripDeparture)],
    ["Preferred activity date", fmtDate(d.activityDate1)],
    ["Alternative date", fmtDate(d.activityDate2)],
    ["Flexible dates", d.datesFlexible ? "Yes" : "No"],
    ["Timing notes", d.datesNote],
  ]) });

  out.push({ step: "guests", title: "Who's coming", rows: rows([
    ["Adults", String(d.adults)],
    ["Children (2 to 12)", d.children ? `${d.children} (ages ${d.childAges.join(", ")})` : "0"],
    ["Infants (under 2)", String(d.infants)],
    ["Everyone swims", wantsBoat(d) ? labelOf(SWIMMING, d.swimming) : ""],
    ["Large group", isLargeGroup(d) ? "13 or more — tailor-made trip" : ""],
    ["Group type", isLargeGroup(d) ? labelOf(GROUP_TYPES, d.groupType) : ""],
    ["Group notes", isLargeGroup(d) ? d.groupNotes.trim() : ""],
  ]) });

  out.push({ step: "arrival", title: "Getting to Sardinia", rows: rows([
    ["Arriving by", labelOf(ARRIVAL_METHODS, d.arrivalMethod)],
    ["Airport", d.arrivalMethod === "plane" ? labelOf(AIRPORTS, d.airport) : ""],
    ["Flight number", d.arrivalMethod === "plane" ? d.flightNumber.toUpperCase() : ""],
    ["Ferry port", d.arrivalMethod === "ferry" ? labelOf(PORTS, d.port) : ""],
    ["Arrival", d.arrivalMethod === "plane" || d.arrivalMethod === "ferry" ? [fmtDate(d.arrivalDate || d.tripArrival), d.arrivalTime].filter(Boolean).join(" at ") : ""],
    ["Rental car", labelOf(RENTAL_CAR, d.rentalCar === "yes" ? "myself" : d.rentalCar)],
    ["Needs pickup to boat/tour", asksPickup(d) ? labelOf(YES_NO, d.pickup) : ""],
  ]) });

  const car = d.rentalCar === "yes" ? "myself" : d.rentalCar;
  if (car === "for_me") {
    out.push({ step: "arrival", title: "Richiesta auto a noleggio", rows: rows([
      ["Handling", "Book it for me"],
      ["Car type", labelOf(CAR_TYPES, d.rentalCarType)],
      ["Seats", labelOf(CAR_SEATS, d.rentalCarSeats)],
      ["Size", labelOf(CAR_SIZES, d.rentalCarSize)],
    ]) });
  }

  out.push({ step: "stay", title: "Where they're staying", rows: rows([
    ["Area / town", d.stayNotBooked ? "Not booked yet" : d.stayArea],
    ["Hotel / address", d.stayNotBooked ? "" : d.stayAddress],
    ["Stay type", d.stayNotBooked ? labelOf(STAY_TYPES, d.stayType) : ""],
    ["Room type", d.stayNotBooked ? labelOf(STAY_ROOMS, d.stayRoom) : ""],
    ["Number of rooms", d.stayNotBooked ? labelOf(STAY_ROOMS_COUNT, d.stayRoomsCount) : ""],
    ["Board", d.stayNotBooked ? labelOf(STAY_BOARD, d.stayBoard) : ""],
    ["Amenities", d.stayNotBooked ? labelsOf(STAY_AMENITIES, d.stayAmenities) : ""],
    ["Stay request", d.stayNotBooked ? d.stayRequest : ""],
  ]) });

  const needs = d.needs.map((n) => n === "celebration" && d.celebration ? `Celebration (${labelOf(CELEBRATIONS, d.celebration)})` : labelOf(NEEDS, n));
  out.push({ step: "extras", title: "Good to know", rows: rows([
    ["Special notes", needs.join(", ")],
    ["Details", d.needs.length ? d.needsDetail : ""],
    ["Budget per person", (() => { const l = labelOf(BUDGETS, d.budget); return l && l !== d.budget ? l : d.budget; })()],
    ["Message", d.message],
  ]) });

  out.push({ step: "about", title: "Contact", rows: rows([
    ["Name", `${d.firstName} ${d.lastName}`.trim()],
    ["Email", d.email],
    ["Phone / WhatsApp", d.phone],
    ["Country", d.country],
    ["Time zone", d.timeZone],
    ["Preferred reply", labelOf(REPLY_VIA, d.replyVia)],
    ["Heard about us", labelOf(HEARD_FROM, d.heardFrom)],
  ]) });

  return out;
}

/** The complete plain-text email the owner would receive. */
export function buildSummaryText(d: ContactData, sentAt = new Date()): string {
  const name = `${d.firstName} ${d.lastName}`.trim();
  let clientLocal = "";
  try {
    clientLocal = sentAt.toLocaleString("en-GB", { timeZone: d.timeZone || undefined, dateStyle: "medium", timeStyle: "short" });
  } catch {
    clientLocal = sentAt.toLocaleString("en-GB");
  }
  const romeTime = sentAt.toLocaleString("en-GB", { timeZone: "Europe/Rome", dateStyle: "medium", timeStyle: "short" });

  if (d.mode === "quick") {
    const rows: [string, string][] = ([
      ["Name", name],
      ["Email", d.email.trim()],
      ["Phone / WhatsApp", d.phone.trim()],
      ["Preferred reply", labelOf(REPLY_VIA, d.replyVia)],
      ["Time zone", d.timeZone],
      ["About", labelsOf(QUICK_TOPICS, d.quickTopics)],
      ["Rough dates", d.quickDates.trim()],
      ["People", d.quickPeople > 0 ? String(d.quickPeople) : ""],
    ] as [string, string][]).filter(([, v]) => v && v.trim() !== "");
    return [
      `QUICK REQUEST: ${name}`,
      "Sardinia Discovery Travels · website contact form (quick request)",
      "",
      `Sent: ${romeTime} (Sardinia time) · ${clientLocal} for the client (${d.timeZone || "time zone unknown"})`,
      `Reply by: ${labelOf(REPLY_VIA, d.replyVia)} · ${d.replyVia === "whatsapp" ? d.phone : d.email}`,
      "",
      "QUICK REQUEST",
      "-------------",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      "",
      "MESSAGE",
      "-------",
      d.message.trim(),
    ].join("\n");
  }

  const lines: string[] = [
    `NEW TRIP REQUEST: ${name}`,
    "Sardinia Discovery Travels · website contact form",
    "",
    `Sent: ${romeTime} (Sardinia time) · ${clientLocal} for the client (${d.timeZone || "time zone unknown"})`,
    `Reply by: ${labelOf(REPLY_VIA, d.replyVia)} · ${d.replyVia === "whatsapp" ? d.phone : d.email}`,
  ];
  for (const s of buildReviewSections(d)) {
    lines.push("", s.title.toUpperCase(), "-".repeat(s.title.length));
    for (const [k, v] of s.rows) lines.push(`${k}: ${v}`);
  }
  return lines.join("\n");
}

/**
 * Submit a contact request.
 * TODO: connect this to email delivery (e.g. a server route or form service) so the
 * summary is emailed to the owner. Right now it only builds the summary and logs it.
 */
/** Car request kept as its own block so a future email backend can lift it out. No mail is sent from this preview. */
export function rentalCarRequest(d: ContactData) {
  const car = d.rentalCar === "yes" ? "myself" : d.rentalCar;
  if (car !== "for_me") return null;
  return {
    title: "Richiesta auto a noleggio",
    handling: "book_it_for_me",
    carType: labelOf(CAR_TYPES, d.rentalCarType),
    seats: labelOf(CAR_SEATS, d.rentalCarSeats),
    size: labelOf(CAR_SIZES, d.rentalCarSize),
  };
}

export async function submitContactRequest(data: ContactData): Promise<{ ok: true; summary: string }> {
  const summary = buildSummaryText(data);
  const rental = rentalCarRequest(data);
  console.log("[contact] Request summary (email delivery not connected yet):\n\n" + summary);
  if (rental) console.log("[contact] payload.rentalCarRequest", rental);
  return { ok: true, summary };
}
