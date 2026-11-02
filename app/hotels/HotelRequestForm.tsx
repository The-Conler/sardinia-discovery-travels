"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { FormEvent, ReactNode } from "react";
import { HIcon } from "./icons";
import { Stepper, scrollToEl } from "./ui";
import { AREAS, BUDGETS, EXTRAS, STAY_TYPES } from "./hotelsData";
import type { Area, StayType } from "./hotelsData";

export type SearchSnapshot = {
  area: Area | "";
  type: StayType | "";
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  at: number;
};

/* ---------- Choices ---------- */

const LOOKING = ["Just the stay", "Stay plus experiences"] as const;
const REACH = ["Email", "WhatsApp"] as const;
const LANGS = ["English", "Italian", "Other"] as const;
const FLEX = ["Exact dates", "A few days either way"] as const;
const WHOLE = ["Yes, whole trip", "Only some nights"] as const;
const MULTI = ["No, one place", "Yes, more than one"] as const;
const BEDS = ["Double bed", "Twin beds", "Extra bed or crib"];
const ARRIVALS = ["Flight", "Ferry", "Already in Sardinia", "Not sure yet"] as const;
const AIRPORTS = ["Olbia", "Cagliari", "Alghero"];
const PORTS = ["Olbia", "Golfo Aranci", "Porto Torres", "Cagliari", "Arbatax", "Santa Teresa"];
const YES_NO = ["Yes", "No"] as const;
const YES_NO_MAYBE = ["Yes", "No", "Not sure"] as const;
const OCCASIONS = ["Honeymoon", "Anniversary", "Birthday", "Family trip", "Other"] as const;
const AGES = ["Under 1", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const EXPERIENCES: { label: string; icon: string }[] = [
  { label: "4x4 tours", icon: "car" },
  { label: "Boat trips", icon: "ship" },
  { label: "Hiking and trekking", icon: "mountain" },
  { label: "Food and wine", icon: "wine" },
  { label: "Cultural visits", icon: "landmark" },
  { label: "Beaches and snorkelling", icon: "waves" },
  { label: "Something else", icon: "dots" },
];
const MAX_LEGS = 3;
// The site's main trip planning form (the guided contact wizard).
const FULL_TRIP_FORM = "/contact";

type Leg = { area: string; in: string; out: string };
type Choice<T extends readonly string[]> = T[number] | "";

type Fields = {
  lookingFor: Choice<typeof LOOKING>;
  name: string;
  email: string;
  phone: string;
  reach: Choice<typeof REACH>;
  lang: Choice<typeof LANGS>;
  langOther: string;
  checkIn: string;
  checkOut: string;
  flex: Choice<typeof FLEX>;
  adults: number;
  children: number;
  childAges: string[];
  rooms: number;
  whole: Choice<typeof WHOLE>;
  stayIn: string;
  stayOut: string;
  multi: Choice<typeof MULTI>;
  legs: Leg[];
  area: Area | "Not sure" | "";
  stayType: StayType | "Any" | "";
  budget: string;
  beds: string[];
  extras: string[];
  dietary: string;
  earlyIn: boolean;
  lateOut: boolean;
  access: string;
  experiences: string[];
  expNote: string;
  arrival: Choice<typeof ARRIVALS>;
  arrDate: string;
  arrTime: string;
  arrPlace: string;
  arrRef: string;
  ferryCo: string;
  depDate: string;
  depTime: string;
  depPlace: string;
  depRef: string;
  transfer: Choice<typeof YES_NO>;
  rentCar: Choice<typeof YES_NO_MAYBE>;
  ownCar: Choice<typeof YES_NO>;
  occasion: Choice<typeof OCCASIONS>;
  notes: string;
};

const EMPTY_LEG: Leg = { area: "", in: "", out: "" };

const EMPTY: Fields = {
  lookingFor: "",
  name: "",
  email: "",
  phone: "",
  reach: "",
  lang: "",
  langOther: "",
  checkIn: "",
  checkOut: "",
  flex: "",
  adults: 2,
  children: 0,
  childAges: [],
  rooms: 1,
  whole: "",
  stayIn: "",
  stayOut: "",
  multi: "",
  legs: [EMPTY_LEG, EMPTY_LEG],
  area: "",
  stayType: "",
  budget: "",
  beds: [],
  extras: [],
  dietary: "",
  earlyIn: false,
  lateOut: false,
  access: "",
  experiences: [],
  expNote: "",
  arrival: "",
  arrDate: "",
  arrTime: "",
  arrPlace: "",
  arrRef: "",
  ferryCo: "",
  depDate: "",
  depTime: "",
  depPlace: "",
  depRef: "",
  transfer: "",
  rentCar: "",
  ownCar: "",
  occasion: "",
  notes: "",
};

/* ---------- Steps ---------- */

type StepId = "about" | "trip" | "stay" | "place" | "experiences" | "travel" | "extra" | "review";
const STEP_TITLES: Record<StepId, string> = {
  about: "About you",
  trip: "Your trip",
  stay: "Where you stay",
  place: "Your place",
  experiences: "Experiences",
  travel: "Travel",
  extra: "Anything else",
  review: "Review",
};
const wantsExperiences = (d: Fields) => d.lookingFor === "Stay plus experiences";
// The experiences step only exists when the guest asks for experiences.
const stepsFor = (d: Fields): StepId[] =>
  (["about", "trip", "stay", "place", "experiences", "travel", "extra", "review"] as StepId[]).filter((s) => s !== "experiences" || wantsExperiences(d));

type Errors = Record<string, string>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const someNights = (d: Fields) => d.whole === "Only some nights" && d.multi !== "Yes, more than one";
const manyStays = (d: Fields) => d.multi === "Yes, more than one";
const ages = (d: Fields) => Array.from({ length: d.children }, (_, i) => d.childAges[i] ?? "");
const needsDiet = (d: Fields) => d.extras.includes("Private chef") || d.extras.includes("Breakfast included");

// A stay inside the trip: both dates, in order, and between the trip dates.
function checkRange(e: Errors, key: string, d: Fields, a: string, b: string, what: string) {
  if (!a) e[`${key}In`] = `Please choose the check in date${what}.`;
  else if (d.checkIn && a < d.checkIn) e[`${key}In`] = "This date is before your trip starts.";
  else if (d.checkOut && a >= d.checkOut) e[`${key}In`] = "This date is after your trip ends.";
  if (!b) e[`${key}Out`] = `Please choose the check out date${what}.`;
  else if (a && b <= a) e[`${key}Out`] = "Check out needs to be after check in.";
  else if (d.checkOut && b > d.checkOut) e[`${key}Out`] = "This date is after your trip ends.";
}

// Required only where it matters: name, email, trip dates, stay dates inside
// the trip, flight dates. Everything else is optional.
function stepErrors(id: StepId, d: Fields): Errors {
  const e: Errors = {};
  if (id === "about") {
    if (!d.name.trim()) e.name = "Please add your name.";
    if (!EMAIL_RE.test(d.email.trim())) e.email = "Please add a valid email address.";
    if (d.reach === "WhatsApp" && !d.phone.trim()) e.phone = "Please add your WhatsApp number so we can reach you there.";
  }
  if (id === "trip") {
    if (!d.checkIn) e.checkIn = "Please choose the day you arrive.";
    if (!d.checkOut) e.checkOut = "Please choose the day you leave.";
    else if (d.checkIn && d.checkOut <= d.checkIn) e.checkOut = "This needs to be after the day you arrive.";
  }
  if (id === "stay") {
    if (someNights(d)) checkRange(e, "stay", d, d.stayIn, d.stayOut, "");
    if (manyStays(d)) d.legs.forEach((l, i) => checkRange(e, `leg${i}`, d, l.in, l.out, ` for stay ${i + 1}`));
  }
  if (id === "travel") {
    if (d.arrival === "Flight") {
      if (!d.arrDate) e.arrDate = "Please add the date your flight lands.";
      if (!d.depDate) e.depDate = "Please add the date your flight leaves.";
    }
    if ((d.arrival === "Flight" || d.arrival === "Ferry") && d.arrDate && d.depDate && d.depDate < d.arrDate) e.depDate = "This needs to be after your arrival.";
  }
  return e;
}

/* ---------- Formatting ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toUtc = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? Date.UTC(y, m - 1, d) : NaN;
};
const fmtDay = (iso: string) => {
  const t = toUtc(iso);
  if (Number.isNaN(t)) return iso;
  const d = new Date(t);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
const fmtWhen = (date: string, time: string) => [date && fmtDay(date), time && `at ${time}`].filter(Boolean).join(" ");
const nightsBetween = (a: string, b: string) => Math.round((toUtc(b) - toUtc(a)) / 86400000);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const capitalise = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);
const join = (parts: (string | false | undefined | null)[]) => parts.filter(Boolean).join(", ");
const ageText = (a: string) => (a === "Under 1" ? "under 1" : a === "1" ? "1 year" : `${a} years`);

/* ---------- Payload: only what applies, no empty fields ---------- */

function clean<T extends Record<string, unknown>>(o: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === "" || v === false || v == null) continue;
    if (Array.isArray(v) && !v.length) continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v as object).length) continue;
    out[k] = typeof v === "string" ? v.trim() : v;
  }
  return out as Partial<T>;
}

export function buildPayload(d: Fields) {
  const flight = d.arrival === "Flight";
  const ferry = d.arrival === "Ferry";
  const moving = flight || ferry;
  return clean({
    lookingFor: d.lookingFor,
    contact: clean({ name: d.name, email: d.email, phone: d.phone, reachBy: d.reach, replyLanguage: d.lang === "Other" ? d.langOther || "Other" : d.lang }),
    trip: clean({
      arrive: d.checkIn,
      leave: d.checkOut,
      nights: d.checkIn && d.checkOut ? nightsBetween(d.checkIn, d.checkOut) : null,
      dateFlexibility: d.flex,
      adults: d.adults,
      children: d.children || null,
      childAges: d.children ? ages(d) : [],
      rooms: d.rooms,
    }),
    stay: clean({
      wholeTrip: manyStays(d) ? null : d.whole,
      checkIn: someNights(d) ? d.stayIn : "",
      checkOut: someNights(d) ? d.stayOut : "",
      area: manyStays(d) ? "" : d.area,
      stays: manyStays(d) ? d.legs.map((l) => clean({ area: l.area, checkIn: l.in, checkOut: l.out })) : [],
      type: d.stayType,
      budgetPerNight: d.budget,
      beds: d.beds,
      extras: d.extras,
      dietaryNeeds: needsDiet(d) ? d.dietary : "",
      earlyCheckIn: d.earlyIn,
      lateCheckOut: d.lateOut,
      accessibility: d.access,
    }),
    experiences: wantsExperiences(d) ? clean({ wanted: d.experiences, note: d.expNote }) : {},
    travel: clean({
      arrivingBy: d.arrival,
      arrival: moving ? clean({ date: d.arrDate, time: d.arrTime, [flight ? "airport" : "port"]: d.arrPlace, [flight ? "flightNumber" : "bookingNumber"]: d.arrRef, ferryCompany: ferry ? d.ferryCo : "" }) : {},
      departure: moving ? clean({ date: d.depDate, time: d.depTime, [flight ? "airport" : "port"]: d.depPlace, flightNumber: flight ? d.depRef : "" }) : {},
      transferNeeded: moving ? d.transfer : "",
      rentingCar: flight ? d.rentCar : "",
      ownCar: ferry ? d.ownCar : "",
    }),
    occasion: d.occasion,
    notes: d.notes,
  });
}

/* ---------- Small controls ---------- */

type Smoother = { scrollTo: (t: Element, smooth: boolean, pos: string) => void };
// Bring the form card back into view when a step change leaves its top off screen.
function revealCard(el: HTMLElement | null) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const offset = 110; // clear of the fixed header
  if (r.top >= offset && r.top < window.innerHeight * 0.6) return;
  const smoother = (window as unknown as { ScrollSmoother?: { get: () => Smoother | undefined } }).ScrollSmoother?.get();
  if (smoother) smoother.scrollTo(el, true, `top ${offset}px`);
  else window.scrollTo({ top: window.scrollY + r.top - offset, behavior: "smooth" });
}

/** The site's teal button-02, the same button the contact form uses. */
function TealButton({ children, type = "button", onClick }: { children: ReactNode; type?: "button" | "submit"; onClick?: () => void }) {
  return (
    <button type={type} className="button-02 button-02--teal ct-btn" onClick={onClick}>
      <span className="inner">{children}</span>
      <span className="circle" aria-hidden="true">
        <span>→</span>
      </span>
    </button>
  );
}

function Pills<T extends string>({ label, options, value, onChange, icons }: { label: string; options: readonly T[]; value: T | ""; onChange: (v: T | "") => void; icons?: Partial<Record<T, string>> }) {
  return (
    <div className="ct-pills" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" className={`ct-pill${value === o ? " is-on" : ""}`} aria-pressed={value === o} onClick={() => onChange(value === o ? "" : o)}>
          {icons?.[o] && <HIcon name={icons[o] as string} size={16} />}
          {o}
        </button>
      ))}
    </div>
  );
}

function MultiPills({ label, options, value, onChange, className = "" }: { label: string; options: { label: string; icon?: string }[]; value: string[]; onChange: (v: string[]) => void; className?: string }) {
  return (
    <div className={`ct-pills ${className}`} role="group" aria-label={label}>
      {options.map((x) => {
        const on = value.includes(x.label);
        return (
          <button key={x.label} type="button" className={`ct-pill${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => onChange(on ? value.filter((v) => v !== x.label) : [...value, x.label])}>
            {x.icon && <HIcon name={x.icon} size={16} />}
            {x.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, optional, hint, children, as = "label" }: { label: string; optional?: boolean; hint?: string; children: ReactNode; as?: "label" | "div" }) {
  const Tag = as;
  return (
    <Tag className="ct-field">
      <span className="ct-field-label">
        {label}
        {optional && <em> (optional)</em>}
      </span>
      {hint && <span className="ct-field-hint">{hint}</span>}
      {children}
    </Tag>
  );
}

function Toggle({ label, sub, on, onChange }: { label: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} className={`ct-toggle ht-toggle${on ? " is-on" : ""}`} onClick={() => onChange(!on)}>
      <span className="ct-toggle-text">
        <span className="ct-toggle-label">{label}</span>
        {sub && <span className="ct-toggle-sub">{sub}</span>}
      </span>
      <span className="ct-toggle-track" aria-hidden="true">
        <span className="ct-toggle-knob" />
      </span>
    </button>
  );
}

const Err = ({ msg }: { msg?: string }) => (msg ? <span className="ct-error">{msg}</span> : null);

/* ---------- Summary (review step and thank you) ---------- */

function Tile({ icon, label, wide, children }: { icon: string; label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`ht-sum-tile${wide ? " is-wide" : ""}`}>
      <span className="ht-sum-icon"><HIcon name={icon} size={18} /></span>
      <span className="ht-sum-text">
        <span className="ht-sum-label">{label}</span>
        <span className="ht-sum-value">{children}</span>
      </span>
    </div>
  );
}

const PillList = ({ items }: { items: string[] }) => (
  <span className="ht-sum-pills">
    {items.map((x) => (
      <span key={x} className="ht-sum-pill">{x}</span>
    ))}
  </span>
);

const Lines = ({ lines }: { lines: (string | false | undefined)[] }) => {
  const l = lines.filter(Boolean) as string[];
  return (
    <>
      {l.map((x, i) => (
        <span key={i} className="ht-sum-line">{x}</span>
      ))}
    </>
  );
};

function summaryGroups(d: Fields): { id: StepId; title: string; tiles: ReactNode[] }[] {
  const flight = d.arrival === "Flight";
  const ferry = d.arrival === "Ferry";
  const nights = d.checkIn && d.checkOut ? nightsBetween(d.checkIn, d.checkOut) : 0;
  const reply = join([d.reach && `By ${d.reach === "Email" ? "email" : "WhatsApp"}`, d.lang && `in ${d.lang === "Other" ? d.langOther.trim() || "another language" : d.lang}`]);
  const childAges = ages(d).filter(Boolean);
  const checkTimes = join([d.earlyIn && "Early check in", d.lateOut && "Late check out"]);
  const g: { id: StepId; title: string; tiles: ReactNode[] }[] = [
    {
      id: "about",
      title: "About you",
      tiles: [
        d.lookingFor && <Tile key="lf" icon="search" label="Looking for">{d.lookingFor}</Tile>,
        <Tile key="ne" icon="user" label="Name and email">
          <Lines lines={[d.name.trim().split(/\s+/).map(capitalise).join(" "), d.email.trim()]} />
        </Tile>,
        d.phone.trim() && <Tile key="ph" icon="phone" label="Phone or WhatsApp">{d.phone.trim()}</Tile>,
        reply && <Tile key="re" icon="message" label="Reply">{capitalise(reply)}</Tile>,
      ],
    },
    {
      id: "trip",
      title: "Your trip",
      tiles: [
        (d.checkIn || d.checkOut) && (
          <Tile key="td" icon="calendar" label="Trip dates">
            <Lines lines={[`${fmtDay(d.checkIn)} to ${fmtDay(d.checkOut)}`, join([nights > 0 && plural(nights, "night", "nights"), d.flex])]} />
          </Tile>
        ),
        <Tile key="gu" icon="users" label="Guests">
          <Lines
            lines={[
              join([plural(d.adults, "adult", "adults"), d.children > 0 && plural(d.children, "child", "children"), plural(d.rooms, "room", "rooms")]),
              childAges.length > 0 && `Children aged ${childAges.map(ageText).join(", ")}`,
            ]}
          />
        </Tile>,
      ],
    },
    {
      id: "stay",
      title: "Where you stay",
      tiles: manyStays(d)
        ? d.legs.map((l, i) => (
            <Tile key={`leg${i}`} icon="route" label={`Stay ${i + 1}`}>
              <Lines lines={[l.area || "Area not chosen", (l.in || l.out) && `${fmtDay(l.in)} to ${fmtDay(l.out)}`, l.in && l.out && plural(nightsBetween(l.in, l.out), "night", "nights")]} />
            </Tile>
          ))
        : [
            d.area && <Tile key="ar" icon="pin" label="Area">{d.area}</Tile>,
            d.whole && (
              <Tile key="wh" icon="bed" label="Nights">
                <Lines lines={[someNights(d) ? "Only some nights" : "The whole trip", someNights(d) && (d.stayIn || d.stayOut) && `${fmtDay(d.stayIn)} to ${fmtDay(d.stayOut)}`]} />
              </Tile>
            ),
          ],
    },
    {
      id: "place",
      title: "Your place",
      tiles: [
        d.stayType && <Tile key="ty" icon="bed" label="Type of stay">{d.stayType}</Tile>,
        d.budget && <Tile key="bu" icon="wallet" label="Budget per night">{d.budget}</Tile>,
        d.beds.length > 0 && <Tile key="be" icon="bed" label="Beds">{d.beds.join(", ")}</Tile>,
        checkTimes && <Tile key="ct" icon="clock" label="Check in and out">{checkTimes}</Tile>,
        d.extras.length > 0 && <Tile key="ex" icon="checkCircle" label="Extras" wide><PillList items={d.extras} /></Tile>,
        needsDiet(d) && d.dietary.trim() && <Tile key="di" icon="utensils" label="Dietary needs">{d.dietary.trim()}</Tile>,
        d.access.trim() && <Tile key="ac" icon="access" label="Accessibility">{d.access.trim()}</Tile>,
      ],
    },
    {
      id: "experiences",
      title: "Experiences",
      tiles: wantsExperiences(d)
        ? [
            d.experiences.length > 0 && <Tile key="xp" icon="compass" label="Experiences" wide><PillList items={d.experiences} /></Tile>,
            d.expNote.trim() && <Tile key="xn" icon="note" label="What you have in mind" wide><span className="ht-sum-notes">{d.expNote.trim()}</span></Tile>,
          ]
        : [],
    },
    {
      id: "travel",
      title: "Travel",
      tiles: [
        d.arrival && !flight && !ferry && <Tile key="ab" icon="pin" label="Arriving">{d.arrival}</Tile>,
        (flight || ferry) && (
          <Tile key="in" icon={flight ? "plane" : "ship"} label={flight ? "Flight in" : "Ferry in"}>
            <Lines
              lines={[
                fmtWhen(d.arrDate, d.arrTime),
                join([d.arrPlace && `${d.arrPlace} ${flight ? "airport" : "port"}`, ferry && d.ferryCo.trim(), d.arrRef.trim() && (flight ? `Flight ${d.arrRef.trim()}` : `Booking ${d.arrRef.trim()}`)]),
              ]}
            />
          </Tile>
        ),
        (flight || ferry) && (d.depDate || d.depTime || d.depPlace || d.depRef) && (
          <Tile key="out" icon={flight ? "plane" : "ship"} label={flight ? "Flight out" : "Ferry out"}>
            <Lines lines={[fmtWhen(d.depDate, d.depTime), join([d.depPlace && `${d.depPlace} ${flight ? "airport" : "port"}`, flight && d.depRef.trim() && `Flight ${d.depRef.trim()}`])]} />
          </Tile>
        ),
        (flight || ferry) && (d.transfer || (flight ? d.rentCar : d.ownCar)) && (
          <Tile key="tr" icon="car" label="Getting around">
            <Lines
              lines={[
                d.transfer && (d.transfer === "Yes" ? "Transfer needed" : "No transfer needed"),
                flight && d.rentCar && (d.rentCar === "Yes" ? "Renting a car" : d.rentCar === "No" ? "Not renting a car" : "Not sure about a rental car"),
                ferry && d.ownCar && (d.ownCar === "Yes" ? "Travelling with their own car" : "No car on the ferry"),
              ]}
            />
          </Tile>
        ),
      ],
    },
    {
      id: "extra",
      title: "Anything else",
      tiles: [
        d.occasion && <Tile key="oc" icon="gift" label="Occasion">{d.occasion}</Tile>,
        d.notes.trim() && <Tile key="no" icon="note" label="Notes" wide><span className="ht-sum-notes">{d.notes.trim()}</span></Tile>,
      ],
    },
  ];
  return g.map((x) => ({ ...x, tiles: x.tiles.filter(Boolean) })).filter((x) => x.tiles.length > 0);
}

function Summary({ data, onEdit }: { data: Fields; onEdit?: (id: StepId) => void }) {
  return (
    <div className="ht-sum-groups">
      {summaryGroups(data).map((g) => (
        <section key={g.id} className="ht-sum-group" aria-label={g.title}>
          <div className="ht-sum-head">
            <h4 className="ht-sum-title">{g.title}</h4>
            {onEdit && (
              <button type="button" className="ht-edit" onClick={() => onEdit(g.id)} aria-label={`Edit ${g.title.toLowerCase()}`}>
                <HIcon name="pencil" size={14} />
                Edit
              </button>
            )}
          </div>
          <div className="ht-sum">{g.tiles}</div>
        </section>
      ))}
    </div>
  );
}

function ThankYou({ data: d, onStays, onReset }: { data: Fields; onStays: () => void; onReset: () => void }) {
  const first = capitalise(d.name.trim().split(/\s+/)[0] ?? "");
  return (
    <div className="ht-thanks" role="status">
      <div className="ht-thanks-head">
        <span className="ht-thanks-icon"><HIcon name="check" size={26} strokeWidth={2} /></span>
        <div>
          <h3 className="ht-thanks-title">Thank you, {first}</h3>
          <p className="ht-thanks-sub">Your request is in. We reply by email with options for your dates.</p>
        </div>
      </div>

      <h4 className="ht-thanks-kicker">Your request</h4>
      <Summary data={d} />

      <h4 className="ht-thanks-kicker">What happens next</h4>
      <ol className="ht-next">
        <li>
          <span className="ht-sum-icon"><HIcon name="calendarCheck" size={18} /></span>
          <strong>We check availability</strong>
          <span>With the places that fit your request.</span>
        </li>
        <li>
          <span className="ht-sum-icon"><HIcon name="mail" size={18} /></span>
          <strong>You get options by email</strong>
          <span>With real prices for your dates.</span>
        </li>
        <li>
          <span className="ht-sum-icon"><HIcon name="checkCircle" size={18} /></span>
          <strong>You choose and confirm</strong>
          <span>Nothing is booked until then.</span>
        </li>
      </ol>

      <div className="ct-thanks-actions ht-thanks-actions">
        <TealButton onClick={onStays}>Back to the stays</TealButton>
        <button type="button" className="ct-back" onClick={onReset}>
          Send another request
        </button>
      </div>
    </div>
  );
}

/* ---------- The form ---------- */

export function HotelRequestForm({ snapshot, today }: { snapshot: SearchSnapshot | null; today: string }) {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  // The request as it was sent; shown in the thank you summary.
  const [sent, setSent] = useState<Fields | null>(null);
  const [step, setStep] = useState(0);
  // True while changing one step from the review; "Back to review" returns there.
  const [editing, setEditing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Partial<Record<StepId, HTMLDivElement | null>>>({});
  const viewRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const steps = stepsFor(f);
  const LAST = steps.length - 1;
  const id = steps[Math.min(step, LAST)];

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((p) => ({ ...p, [k]: v }));
  // Changing a field clears its error straight away.
  const clearError = (...keys: string[]) =>
    setErrors((prev) => {
      if (!keys.some((k) => prev[k])) return prev;
      const out = { ...prev };
      for (const k of keys) delete out[k];
      return out;
    });
  const put = <K extends keyof Fields>(k: K, v: Fields[K], ...errKeys: string[]) => {
    set(k, v);
    clearError(k as string, ...errKeys);
  };
  const setLeg = (i: number, patch: Partial<Leg>) => {
    setF((p) => ({ ...p, legs: p.legs.map((l, j) => (j === i ? { ...l, ...patch } : l)) }));
    clearError(...Object.keys(patch).map((k) => `leg${i}${k === "in" ? "In" : k === "out" ? "Out" : ""}`));
  };

  // Carry what was chosen in the hero search into the form.
  useEffect(() => {
    if (!snapshot) return;
    setF((p) => ({
      ...p,
      area: snapshot.area || p.area,
      stayType: snapshot.type || p.stayType,
      checkIn: snapshot.checkIn || p.checkIn,
      checkOut: snapshot.checkOut || p.checkOut,
      adults: snapshot.adults,
      children: snapshot.children,
      rooms: snapshot.rooms,
    }));
  }, [snapshot]);

  // The values as they are in the inputs right now. Browser autofill (Safari
  // in particular) can fill a field without an input event, so the state may
  // lag behind what the guest sees.
  const live = (): Fields => {
    const el = formRef.current?.elements;
    const val = (n: string) => (el?.namedItem(n) as HTMLInputElement | null)?.value;
    return { ...f, name: val("name") ?? f.name, email: val("email") ?? f.email, phone: val("phone") ?? f.phone };
  };

  const refresh = () => {
    const st = (window as unknown as { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger;
    requestAnimationFrame(() => st?.refresh());
  };

  // The step box has its natural height (only the active step is in the flow),
  // so it always fits its content: errors, conditional fields, fonts and
  // resizes included. A step change animates from the old height to the new one.
  const goTo = (i: number) => {
    const view = viewRef.current;
    const from = view?.offsetHeight ?? 0;
    flushSync(() => setStep(i));
    const to = view?.offsetHeight ?? 0;
    if (view && from && to && from !== to && typeof view.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      view.classList.add("is-animating");
      const anim = view.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      const done = () => view.classList.remove("is-animating");
      anim.onfinish = done;
      anim.oncancel = done;
    }
    requestAnimationFrame(() => revealCard(cardRef.current));
    window.setTimeout(refresh, 450);
  };

  // Focus the first field with an error. If the card top is off screen, scroll
  // first and focus once the scroll has settled (ScrollSmoother would
  // otherwise cancel the scroll when focus moves).
  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const field = panelRefs.current[id]?.querySelector<HTMLElement>("[aria-invalid='true']");
      const top = cardRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 110) {
        revealCard(cardRef.current);
        window.setTimeout(() => field?.focus({ preventScroll: true }), 700);
      } else field?.focus({ preventScroll: true });
    });

  // Check the current step; returns false (and shows the errors) when something is missing.
  const checkStep = () => {
    const now = live();
    // Bring autofilled values into the state so later steps and the summary see them.
    setF(now);
    const e = stepErrors(id, now);
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirstError();
      return false;
    }
    return true;
  };

  const next = () => {
    if (checkStep()) goTo(Math.min(LAST, step + 1));
  };
  const back = () => {
    setErrors({});
    goTo(Math.max(0, step - 1));
  };
  const toReview = () => {
    if (!checkStep()) return;
    setEditing(false);
    goTo(stepsFor(live()).indexOf("review"));
  };
  const edit = (target: StepId) => {
    setEditing(true);
    setErrors({});
    goTo(steps.indexOf(target));
  };

  // Autofill can fill fields without any typing. When it happens (or a field
  // loses focus) bring the live values into the state and drop errors that no
  // longer apply. This only clears errors; it never adds new ones.
  const syncLive = () => {
    if (id !== "about") return;
    const now = live();
    setF(now);
    const e = stepErrors("about", now);
    const ok = ["name", "email", "phone"].filter((k) => !e[k]);
    if (ok.length) clearError(...ok);
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    // Enter in a field before the review works like Next (or Back to review).
    if (id !== "review") {
      if (editing) toReview();
      else next();
      return;
    }
    const now = live();
    setF(now);
    const all = stepsFor(now);
    const bad = all.find((s) => Object.keys(stepErrors(s, now)).length);
    if (bad) {
      // Normally never needed: every step is checked before the review.
      setErrors(stepErrors(bad, now));
      goTo(all.indexOf(bad));
      return;
    }
    // TODO: send the request to the booking backend (none yet). Front end only:
    // the payload is built here and the thank you state is shown.
    console.info("[hotels] Stay request (email delivery not connected yet):", buildPayload(now));
    setSent(now);
    setEditing(false);
    refresh();
    requestAnimationFrame(() => revealCard(cardRef.current));
  };

  const reset = () => {
    setF(EMPTY);
    setErrors({});
    setSent(null);
    setEditing(false);
    setStep(0);
    refresh();
    requestAnimationFrame(() => revealCard(cardRef.current));
  };

  const setArrival = (v: Fields["arrival"]) =>
    setF((p) => ({ ...p, arrival: v, arrPlace: p.arrival === v ? p.arrPlace : "", depPlace: p.arrival === v ? p.depPlace : "" }));
  const setChildren = (n: number) => setF((p) => ({ ...p, children: n, childAges: Array.from({ length: n }, (_, i) => p.childAges[i] ?? "") }));

  const flight = f.arrival === "Flight";
  const ferry = f.arrival === "Ferry";
  const places = flight ? AIRPORTS : PORTS;
  const tripMin = f.checkIn || today || undefined;
  const tripMax = f.checkOut || undefined;

  const panels: Record<StepId, ReactNode> = {
    about: (
      <>
        <fieldset className="ct-group ht-group">
          <legend className="ct-legend ht-legend">What are you looking for?</legend>
          <Pills label="What are you looking for" options={LOOKING} value={f.lookingFor} onChange={(v) => set("lookingFor", v)} icons={{ "Just the stay": "bed", "Stay plus experiences": "compass" }} />
          <p className="ht-aside">
            Planning a whole trip with several stops and activities? <a href={FULL_TRIP_FORM}>Use our full trip form</a>
          </p>
        </fieldset>
        <fieldset className="ct-group ht-group">
          <legend className="ct-legend ht-legend">About you</legend>
          <div className="ct-row">
            <label className="ct-field">
              <span className="ct-field-label">Name</span>
              <input type="text" name="name" autoComplete="name" value={f.name} aria-invalid={!!errors.name} onChange={(e) => put("name", e.target.value)} />
              <Err msg={errors.name} />
            </label>
            <label className="ct-field">
              <span className="ct-field-label">Email</span>
              <input type="email" name="email" autoComplete="email" inputMode="email" value={f.email} aria-invalid={!!errors.email} onChange={(e) => put("email", e.target.value)} />
              <Err msg={errors.email} />
            </label>
          </div>
          <label className="ct-field">
            <span className="ct-field-label">
              Phone or WhatsApp {f.reach !== "WhatsApp" && <em>(optional)</em>}
            </span>
            <span className="ct-field-hint">With your country code, for example +1 for the United States.</span>
            <input type="tel" name="phone" autoComplete="tel" inputMode="tel" value={f.phone} aria-invalid={!!errors.phone} onChange={(e) => put("phone", e.target.value)} />
            <Err msg={errors.phone} />
          </label>
          <Field label="Best way to reach you" as="div">
            <Pills label="Best way to reach you" options={REACH} value={f.reach} onChange={(v) => put("reach", v, "phone")} icons={{ Email: "mail", WhatsApp: "message" }} />
          </Field>
          <Field label="Language for our reply" as="div">
            <Pills label="Language for our reply" options={LANGS} value={f.lang} onChange={(v) => set("lang", v)} />
            {f.lang === "Other" && <input type="text" aria-label="Which language" placeholder="Which language?" value={f.langOther} onChange={(e) => set("langOther", e.target.value)} />}
          </Field>
        </fieldset>
      </>
    ),
    trip: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your trip</legend>
        <p className="ht-step-intro">The days you are in Sardinia.</p>
        <div className="ct-row">
          <label className="ct-field">
            <span className="ct-field-label">Arrive</span>
            <input
              type="date"
              name="checkIn"
              value={f.checkIn}
              min={today || undefined}
              aria-invalid={!!errors.checkIn}
              onChange={(e) => (setF((p) => ({ ...p, checkIn: e.target.value, checkOut: p.checkOut && p.checkOut <= e.target.value ? "" : p.checkOut })), clearError("checkIn", "checkOut"))}
            />
            <Err msg={errors.checkIn} />
          </label>
          <label className="ct-field">
            <span className="ct-field-label">Leave</span>
            <input type="date" name="checkOut" value={f.checkOut} min={tripMin} aria-invalid={!!errors.checkOut} onChange={(e) => put("checkOut", e.target.value)} />
            <Err msg={errors.checkOut} />
          </label>
        </div>
        <Field label="How fixed are your dates?" as="div">
          <Pills label="How fixed are your dates" options={FLEX} value={f.flex} onChange={(v) => set("flex", v)} />
        </Field>
        <div className="ct-steppers">
          <Stepper label="Adults" sub="13 and older" value={f.adults} min={1} max={16} onChange={(n) => set("adults", n)} />
          <Stepper label="Children" sub="Up to 12" value={f.children} min={0} max={10} onChange={setChildren} />
          <Stepper label="Rooms" value={f.rooms} min={1} max={8} onChange={(n) => set("rooms", n)} />
        </div>
        {f.children > 0 && (
          <Field label="Children's ages" hint="So we can check beds and family rooms." as="div">
            <div className="ht-ages">
              {ages(f).map((a, i) => (
                <label key={i} className="ht-age">
                  <span>Child {i + 1}</span>
                  <select value={a} onChange={(e) => setF((p) => ({ ...p, childAges: ages(p).map((x, j) => (j === i ? e.target.value : x)) }))}>
                    <option value="">Age</option>
                    {AGES.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </Field>
        )}
      </fieldset>
    ),
    stay: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Where you stay</legend>
        <Field label="Would you like more than one stay?" hint="For example a few nights in the north, then the south." as="div">
          <Pills label="Would you like more than one stay" options={MULTI} value={f.multi} onChange={(v) => set("multi", v)} />
        </Field>
        {manyStays(f) ? (
          <div className="ht-legs">
            {f.legs.map((l, i) => (
              <div key={i} className="ht-leg">
                <div className="ht-leg-head">
                  <span className="ht-leg-title">Stay {i + 1}</span>
                  {i >= 2 && (
                    <button type="button" className="ht-edit" onClick={() => setF((p) => ({ ...p, legs: p.legs.filter((_, j) => j !== i) }))}>
                      Remove
                    </button>
                  )}
                </div>
                <Pills label={`Area for stay ${i + 1}`} options={AREAS.map((a) => a.id)} value={l.area as Area | ""} onChange={(v) => setLeg(i, { area: v })} />
                <div className="ct-row">
                  <label className="ct-field">
                    <span className="ct-field-label">Check in</span>
                    <input type="date" value={l.in} min={tripMin} max={tripMax} aria-invalid={!!errors[`leg${i}In`]} onChange={(e) => setLeg(i, { in: e.target.value })} />
                    <Err msg={errors[`leg${i}In`]} />
                  </label>
                  <label className="ct-field">
                    <span className="ct-field-label">Check out</span>
                    <input type="date" value={l.out} min={l.in || tripMin} max={tripMax} aria-invalid={!!errors[`leg${i}Out`]} onChange={(e) => setLeg(i, { out: e.target.value })} />
                    <Err msg={errors[`leg${i}Out`]} />
                  </label>
                </div>
              </div>
            ))}
            {f.legs.length < MAX_LEGS && (
              <button type="button" className="ct-back ht-add" onClick={() => setF((p) => ({ ...p, legs: [...p.legs, EMPTY_LEG] }))}>
                <HIcon name="plus" size={16} />
                Add another stay
              </button>
            )}
          </div>
        ) : (
          <>
            <Field label="Area" as="div">
              <Pills label="Area" options={[...AREAS.map((a) => a.id), "Not sure"] as const} value={f.area} onChange={(v) => set("area", v)} />
            </Field>
            <Field label="Do you need the place for your whole trip?" as="div">
              <Pills label="Do you need the place for your whole trip" options={WHOLE} value={f.whole} onChange={(v) => set("whole", v)} />
            </Field>
            {someNights(f) && (
              <div className="ct-row">
                <label className="ct-field">
                  <span className="ct-field-label">Check in</span>
                  <input type="date" value={f.stayIn} min={tripMin} max={tripMax} aria-invalid={!!errors.stayIn} onChange={(e) => put("stayIn", e.target.value)} />
                  <Err msg={errors.stayIn} />
                </label>
                <label className="ct-field">
                  <span className="ct-field-label">Check out</span>
                  <input type="date" value={f.stayOut} min={f.stayIn || tripMin} max={tripMax} aria-invalid={!!errors.stayOut} onChange={(e) => put("stayOut", e.target.value)} />
                  <Err msg={errors.stayOut} />
                </label>
              </div>
            )}
          </>
        )}
      </fieldset>
    ),
    place: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your place</legend>
        <Field label="Type of stay" as="div">
          <Pills label="Type of stay" options={[...STAY_TYPES.map((t) => t.id), "Any"] as const} value={f.stayType} onChange={(v) => set("stayType", v)} />
        </Field>
        <Field label="Budget per night" as="div">
          <Pills label="Budget per night" options={BUDGETS} value={f.budget} onChange={(v) => set("budget", v)} />
        </Field>
        <Field label="Beds" optional as="div">
          <MultiPills label="Beds" options={BEDS.map((label) => ({ label }))} value={f.beds} onChange={(v) => set("beds", v)} />
        </Field>
        <Field label="Extras you'd like" optional as="div">
          <MultiPills label="Extras you'd like" className="ht-extras" options={EXTRAS} value={f.extras} onChange={(v) => set("extras", v)} />
        </Field>
        {needsDiet(f) && (
          <Field label="Dietary needs" optional>
            <input type="text" placeholder="For example vegetarian, gluten free, a nut allergy" value={f.dietary} onChange={(e) => set("dietary", e.target.value)} />
          </Field>
        )}
        <div className="ht-toggles">
          <Toggle label="Early check in" sub="If you arrive in the morning" on={f.earlyIn} onChange={(v) => set("earlyIn", v)} />
          <Toggle label="Late check out" sub="If you leave in the evening" on={f.lateOut} onChange={(v) => set("lateOut", v)} />
        </div>
        <Field label="Accessibility needs" optional>
          <input type="text" placeholder="For example step free access or a walk in shower" value={f.access} onChange={(e) => set("access", e.target.value)} />
        </Field>
      </fieldset>
    ),
    experiences: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Experiences</legend>
        <Field label="What would you like to do?" optional as="div">
          <MultiPills label="Experiences" className="ht-extras" options={EXPERIENCES} value={f.experiences} onChange={(v) => set("experiences", v)} />
        </Field>
        <Field label="Tell us what you have in mind" optional>
          <input type="text" placeholder="For example a sunset boat trip or a cooking class" value={f.expNote} onChange={(e) => set("expNote", e.target.value)} />
        </Field>
      </fieldset>
    ),
    travel: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Travel</legend>
        <Field label="How do you arrive?" as="div">
          <Pills label="How do you arrive" options={ARRIVALS} value={f.arrival} onChange={setArrival} icons={{ Flight: "plane", Ferry: "ship" }} />
        </Field>
        {(flight || ferry) && (
          <>
            <div className="ht-sub">
              <p className="ht-sub-title">{flight ? "Your flight in" : "Your ferry in"}</p>
              <Field label={flight ? "Airport" : "Port"} as="div">
                <Pills label={flight ? "Arrival airport" : "Arrival port"} options={places} value={f.arrPlace} onChange={(v) => set("arrPlace", v)} />
              </Field>
              <div className="ct-row">
                <label className="ct-field">
                  <span className="ct-field-label">Date{ferry && <em> (optional)</em>}</span>
                  <input type="date" value={f.arrDate} min={today || undefined} aria-invalid={!!errors.arrDate} onChange={(e) => put("arrDate", e.target.value, "depDate")} />
                  <Err msg={errors.arrDate} />
                </label>
                <label className="ct-field">
                  <span className="ct-field-label">Time <em>(optional)</em></span>
                  <input type="time" value={f.arrTime} onChange={(e) => set("arrTime", e.target.value)} />
                </label>
              </div>
              <div className="ct-row">
                {ferry && (
                  <Field label="Ferry company" optional>
                    <input type="text" value={f.ferryCo} onChange={(e) => set("ferryCo", e.target.value)} />
                  </Field>
                )}
                <Field label={flight ? "Flight number" : "Ferry or booking number"} optional>
                  <input type="text" value={f.arrRef} placeholder={flight ? "For example AZ 1234" : undefined} onChange={(e) => set("arrRef", e.target.value)} />
                </Field>
              </div>
            </div>
            <div className="ht-sub">
              <p className="ht-sub-title">{flight ? "Your flight out" : "Your ferry out"}</p>
              <Field label={flight ? "Airport" : "Port"} as="div">
                <Pills label={flight ? "Departure airport" : "Departure port"} options={places} value={f.depPlace} onChange={(v) => set("depPlace", v)} />
              </Field>
              <div className="ct-row">
                <label className="ct-field">
                  <span className="ct-field-label">Date{ferry && <em> (optional)</em>}</span>
                  <input type="date" value={f.depDate} min={f.arrDate || today || undefined} aria-invalid={!!errors.depDate} onChange={(e) => put("depDate", e.target.value)} />
                  <Err msg={errors.depDate} />
                </label>
                <label className="ct-field">
                  <span className="ct-field-label">Time <em>(optional)</em></span>
                  <input type="time" value={f.depTime} onChange={(e) => set("depTime", e.target.value)} />
                </label>
              </div>
              {flight && (
                <Field label="Flight number" optional>
                  <input type="text" value={f.depRef} onChange={(e) => set("depRef", e.target.value)} />
                </Field>
              )}
            </div>
            <Field label={flight ? "Do you need a transfer from the airport?" : "Do you need a transfer from the port?"} as="div">
              <Pills label="Transfer needed" options={YES_NO} value={f.transfer} onChange={(v) => set("transfer", v)} />
            </Field>
            {flight ? (
              <Field label="Will you rent a car?" as="div">
                <Pills label="Will you rent a car" options={YES_NO_MAYBE} value={f.rentCar} onChange={(v) => set("rentCar", v)} />
              </Field>
            ) : (
              <Field label="Travelling with your own car?" as="div">
                <Pills label="Travelling with your own car" options={YES_NO} value={f.ownCar} onChange={(v) => set("ownCar", v)} />
              </Field>
            )}
          </>
        )}
      </fieldset>
    ),
    extra: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Anything else</legend>
        <Field label="Is it a special occasion?" optional as="div">
          <Pills label="Occasion" options={OCCASIONS} value={f.occasion} onChange={(v) => set("occasion", v)} />
        </Field>
        <Field label="Notes" optional hint="Anything else you need? For example a crib, a chef for one evening.">
          <textarea value={f.notes} placeholder="A view you would love, pets, anything we should know" onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </fieldset>
    ),
    review: (
      <div className="ht-review">
        <div>
          <h3 className="ct-legend ht-legend">Check your request</h3>
          <p className="ht-step-intro">Nothing is sent yet. Use Edit to change anything.</p>
        </div>
        <Summary data={f} onEdit={edit} />
      </div>
    ),
  };

  return (
    <section className="ht-section ht-request" id="request" aria-labelledby="ht-request-title">
      <div className="ht-inner">
        <div className="ht-request-grid">
          <div className="ht-request-intro">
            <p className="ht-kicker">Request a stay</p>
            <h2 id="ht-request-title" className="ht-title">Tell us everything in one go</h2>
            <p className="ht-lead">
              Many of our guests write from another time zone. When the details are all here, our first reply can already include real options, without days of back and forth.
            </p>
            <ul className="ht-request-points">
              <li><HIcon name="clock" size={20} />Takes about five minutes</li>
              <li><HIcon name="calendarCheck" size={20} />We check availability for your dates</li>
              <li><HIcon name="checkCircle" size={20} />Nothing is booked until you confirm</li>
            </ul>
          </div>

          <div className="ht-form" ref={cardRef}>
            {sent !== null ? (
              <ThankYou data={sent} onStays={() => scrollToEl(document.getElementById("stays"))} onReset={reset} />
            ) : (
              <form ref={formRef} noValidate onSubmit={submit} onBlur={syncLive} onAnimationStart={(e) => e.animationName === "ht-autofill" && syncLive()} aria-label="Stay request">
                <div className="ht-progress">
                  <p className="ht-progress-label" aria-live="polite">
                    Step {step + 1} of {steps.length}
                    <span className="ht-progress-name">{STEP_TITLES[id]}</span>
                  </p>
                  <div
                    className="ht-progress-bar"
                    style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
                    role="progressbar"
                    aria-label="Form progress"
                    aria-valuemin={1}
                    aria-valuemax={steps.length}
                    aria-valuenow={step + 1}
                  >
                    {steps.map((s, i) => (
                      <span key={s} className={i <= step ? "is-on" : undefined} />
                    ))}
                  </div>
                </div>

                <div className="ht-steps-view" ref={viewRef}>
                  {steps.map((s, i) => (
                    <div
                      key={s}
                      ref={(el) => {
                        panelRefs.current[s] = el;
                      }}
                      data-step={s}
                      className={`ht-step-panel${i === step ? " is-active" : i < step ? " is-before" : " is-after"}`}
                      inert={i !== step}
                      aria-hidden={i !== step}
                    >
                      {panels[s]}
                    </div>
                  ))}
                </div>

                {Object.keys(errors).length > 0 && (
                  <p className="ct-error ht-form-error" role="alert">
                    A few details are missing. Please check the fields marked above.
                  </p>
                )}
                <div className="ht-form-foot">
                  {step > 0 && !editing ? (
                    <button type="button" className="ct-back" onClick={back}>
                      Back
                    </button>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {/* Separate keys: the Next button must not turn into the submit button
                      during its own click, or that click would also send the form. */}
                  {id === "review" ? (
                    <TealButton key="send" type="submit">
                      Send request
                    </TealButton>
                  ) : editing ? (
                    <TealButton key="review" onClick={toReview}>
                      Back to review
                    </TealButton>
                  ) : (
                    <TealButton key="next" onClick={next}>
                      {step === LAST - 1 ? "Review" : "Next"}
                    </TealButton>
                  )}
                </div>
                {id === "review" && <p className="ht-form-note">We only use these details to answer your request.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
