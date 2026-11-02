"use client";

// Off road tour request. Same steps UI, progress bar, height animation,
// review and thank you as app/hotels/HotelRequestForm.tsx.
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { FormEvent, ReactNode } from "react";
import { HIcon } from "../hotels/icons";
import { Stepper, scrollToEl } from "../hotels/ui";
import { BUDGETS, STAY_AREAS, STAY_TYPES, TOURS } from "./offRoadData";
import type { Area, Tour, TourKind } from "./offRoadData";

export type SearchSnapshot = {
  area: Area | "";
  kind: TourKind | "";
  date: string;
  adults: number;
  children: number;
  /** Set when the guest pressed "Ask about this" on a tour card. */
  tour: string;
  at: number;
};

/* ---------- Choices ---------- */

const LOOKING = ["Just the tour", "Tour plus a stay"] as const;
const REACH = ["Email", "WhatsApp"] as const;
const LANGS = ["English", "Italian", "Other"] as const;
const FLEX = ["This date only", "A few days either way"] as const;
const NOT_SURE = "Not sure yet";
const TOUR_OPTIONS = [...TOURS.map((t) => t.name), NOT_SURE];
const PICKUP = ["Yes, pick us up", "We meet you there"] as const;
const TIMES = ["Morning", "Afternoon", "No preference"] as const;
const LEVELS = ["First time off road", "Some experience", "Happy on rough tracks"] as const;
const YES_NO = ["Yes", "No"] as const;
const OCCASIONS = ["Birthday", "Family trip", "Friends trip", "Company group", "Other"] as const;
const AGES = ["Under 1", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const INTERESTS: { label: string; icon: string }[] = [
  { label: "Views and photo stops", icon: "mountain" },
  { label: "Nuraghi and old sites", icon: "landmark" },
  { label: "Mountain villages", icon: "compass" },
  { label: "Local food", icon: "utensils" },
  { label: "A short walk", icon: "route" },
  { label: "Something else", icon: "dots" },
];
// The site's main trip planning form (the guided contact wizard).
const FULL_TRIP_FORM = "/contact";

type Choice<T extends readonly string[]> = T[number] | "";

type Fields = {
  lookingFor: Choice<typeof LOOKING>;
  name: string;
  email: string;
  phone: string;
  reach: Choice<typeof REACH>;
  lang: Choice<typeof LANGS>;
  langOther: string;
  tour: string;
  date: string;
  flex: Choice<typeof FLEX>;
  adults: number;
  children: number;
  childAges: string[];
  /** Quads or buggies wanted; only asked on a quad or buggy tour page. */
  vehicles: number;
  pickup: Choice<typeof PICKUP>;
  stayPlace: string;
  time: Choice<typeof TIMES>;
  level: Choice<typeof LEVELS>;
  interests: string[];
  motion: Choice<typeof YES_NO>;
  access: string;
  stayArea: string;
  stayIn: string;
  stayOut: string;
  stayType: string;
  budget: string;
  occasion: Choice<typeof OCCASIONS>;
  notes: string;
};

const EMPTY: Fields = {
  lookingFor: "",
  name: "",
  email: "",
  phone: "",
  reach: "",
  lang: "",
  langOther: "",
  tour: "",
  date: "",
  flex: "",
  adults: 2,
  children: 0,
  childAges: [],
  vehicles: 1,
  pickup: "",
  stayPlace: "",
  time: "",
  level: "",
  interests: [],
  motion: "",
  access: "",
  stayArea: "",
  stayIn: "",
  stayOut: "",
  stayType: "",
  budget: "",
  occasion: "",
  notes: "",
};

/* ---------- Steps ---------- */

type StepId = "about" | "reach" | "tour" | "group" | "pickup" | "level" | "wishes" | "stay" | "stayMore" | "extra" | "review";
const STEP_TITLES: Record<StepId, string> = {
  about: "About you",
  reach: "How to reach you",
  tour: "Your tour",
  group: "Your group",
  pickup: "Pickup",
  level: "Experience",
  wishes: "Your wishes",
  stay: "Your stay",
  stayMore: "Type of stay",
  extra: "Anything else",
  review: "Review",
};
const wantsStay = (d: Fields) => d.lookingFor === "Tour plus a stay";
// The stay step only exists when the guest wants a stay as well.
// On a tour page (split) the long steps are split so each one fits the fixed card.
const stepsFor = (d: Fields, split = false): StepId[] =>
  (split
    ? (["about", "reach", "tour", "group", "pickup", "level", "wishes", "stay", "stayMore", "extra", "review"] as StepId[])
    : (["about", "tour", "pickup", "level", "stay", "extra", "review"] as StepId[])
  ).filter((s) => (s !== "stay" && s !== "stayMore") || wantsStay(d));

type Errors = Record<string, string>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ages = (d: Fields) => Array.from({ length: d.children }, (_, i) => d.childAges[i] ?? "");
const needsPickup = (d: Fields) => d.pickup === "Yes, pick us up";
/** "Quads" or "Buggies" when the chosen tour is driven by the guests, else "". */
const vehicleWord = (tourName: string) => {
  const g = TOURS.find((t) => t.name === tourName)?.group;
  return g === "Quad tours" ? "Quads" : g === "Buggy rides" ? "Buggies" : "";
};

// Required only where it matters: name, email, the tour date, and stay dates in order.
function stepErrors(id: StepId, d: Fields, split = false): Errors {
  const e: Errors = {};
  if (id === "about") {
    if (!d.name.trim()) e.name = "Please add your name.";
    if (!EMAIL_RE.test(d.email.trim())) e.email = "Please add a valid email address.";
  }
  if (id === (split ? "reach" : "about")) {
    if (d.reach === "WhatsApp" && !d.phone.trim()) e.phone = "Please add your WhatsApp number so we can reach you there.";
  }
  if (id === "tour") {
    if (!d.date) e.date = "Please choose the day of your tour.";
  }
  if (id === "stay") {
    if (d.stayIn && d.stayOut && d.stayOut <= d.stayIn) e.stayOut = "Check out needs to be after check in.";
  }
  return e;
}

/* ---------- Formatting ---------- */

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
  return clean({
    lookingFor: d.lookingFor,
    contact: clean({ name: d.name, email: d.email, phone: d.phone, reachBy: d.reach, replyLanguage: d.lang === "Other" ? d.langOther || "Other" : d.lang }),
    tour: clean({
      tour: d.tour,
      date: d.date,
      dateFlexibility: d.flex,
      adults: d.adults,
      children: d.children || null,
      childAges: d.children ? ages(d) : [],
      vehicles: vehicleWord(d.tour) ? d.vehicles : null,
    }),
    pickup: clean({ pickup: d.pickup, stayingAt: needsPickup(d) ? d.stayPlace : "", timeOfDay: d.time }),
    experience: clean({ level: d.level, interests: d.interests, motionSickness: d.motion, accessibility: d.access }),
    stay: wantsStay(d) ? clean({ area: d.stayArea, checkIn: d.stayIn, checkOut: d.stayOut, type: d.stayType, budgetPerNight: d.budget }) : {},
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
  const reply = join([d.reach && `By ${d.reach === "Email" ? "email" : "WhatsApp"}`, d.lang && `in ${d.lang === "Other" ? d.langOther.trim() || "another language" : d.lang}`]);
  const childAges = ages(d).filter(Boolean);
  const stayNights = d.stayIn && d.stayOut && d.stayOut > d.stayIn ? nightsBetween(d.stayIn, d.stayOut) : 0;
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
      id: "tour",
      title: "Your tour",
      tiles: [
        d.tour && <Tile key="to" icon="car" label="Tour">{d.tour}</Tile>,
        d.date && (
          <Tile key="da" icon="calendar" label="Date">
            <Lines lines={[fmtDay(d.date), d.flex]} />
          </Tile>
        ),
        vehicleWord(d.tour) && <Tile key="ve" icon="car" label={vehicleWord(d.tour)}>{d.vehicles}</Tile>,
        <Tile key="gr" icon="users" label="Group">
          <Lines
            lines={[
              join([plural(d.adults, "adult", "adults"), d.children > 0 && plural(d.children, "child", "children")]),
              childAges.length > 0 && `Children aged ${childAges.map(ageText).join(", ")}`,
            ]}
          />
        </Tile>,
      ],
    },
    {
      id: "pickup",
      title: "Pickup",
      tiles: [
        d.pickup && (
          <Tile key="pu" icon="pin" label="Pickup">
            <Lines lines={[d.pickup, needsPickup(d) && d.stayPlace.trim() && `From ${d.stayPlace.trim()}`]} />
          </Tile>
        ),
        d.time && <Tile key="ti" icon="clock" label="Time of day">{d.time}</Tile>,
      ],
    },
    {
      id: "level",
      title: "Experience",
      tiles: [
        d.level && <Tile key="lv" icon="mountain" label="Off road experience">{d.level}</Tile>,
        d.motion && <Tile key="mo" icon="car" label="Car sickness">{d.motion === "Yes" ? "Someone gets car sick" : "No car sickness"}</Tile>,
        d.interests.length > 0 && <Tile key="in" icon="compass" label="Interests" wide><PillList items={d.interests} /></Tile>,
        d.access.trim() && <Tile key="ac" icon="access" label="Accessibility or health">{d.access.trim()}</Tile>,
      ],
    },
    {
      id: "stay",
      title: "Your stay",
      tiles: wantsStay(d)
        ? [
            d.stayArea && <Tile key="sa" icon="pin" label="Area">{d.stayArea}</Tile>,
            (d.stayIn || d.stayOut) && (
              <Tile key="sd" icon="bed" label="Nights">
                <Lines lines={[`${fmtDay(d.stayIn)} to ${fmtDay(d.stayOut)}`, stayNights > 0 && plural(stayNights, "night", "nights")]} />
              </Tile>
            ),
            d.stayType && <Tile key="st" icon="bed" label="Type of stay">{d.stayType}</Tile>,
            d.budget && <Tile key="bu" icon="wallet" label="Budget per night">{d.budget}</Tile>,
          ]
        : [],
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

function firstName(raw: string) {
  const word = raw.trim().split(/[\s,;/]+/).find((w) => /\p{L}/u.test(w)) ?? "";
  return capitalise(word.replace(/[^\p{L}'\u2019-]/gu, "").slice(0, 30));
}

function ThankYou({ data: d, onTours, onReset }: { data: Fields; onTours: () => void; onReset: () => void }) {
  const first = firstName(d.name);
  const by = d.reach === "WhatsApp" ? "on WhatsApp" : "by email";
  return (
    <div className="ht-thanks" role="status">
      <div className="ht-thanks-head">
        <span className="ht-thanks-icon"><HIcon name="check" size={26} strokeWidth={2} /></span>
        <div>
          <h3 className="ht-thanks-title">{first ? `Thank you, ${first}` : "Thank you"}</h3>
          <p className="ht-thanks-sub">Your request is in. We reply {by} with the details for your date.</p>
        </div>
      </div>

      <h4 className="ht-thanks-kicker">Your request</h4>
      <Summary data={d} />

      <h4 className="ht-thanks-kicker">What happens next</h4>
      <ol className="ht-next">
        <li>
          <span className="ht-sum-icon"><HIcon name="calendarCheck" size={18} /></span>
          <strong>We check the date</strong>
          <span>With the guide, for your group and your route.</span>
        </li>
        <li>
          <span className="ht-sum-icon"><HIcon name={d.reach === "WhatsApp" ? "message" : "mail"} size={18} /></span>
          <strong>You get the details {by}</strong>
          <span>Meeting point, timing and the price.</span>
        </li>
        <li>
          <span className="ht-sum-icon"><HIcon name="checkCircle" size={18} /></span>
          <strong>You choose and confirm</strong>
          <span>Nothing is booked until then.</span>
        </li>
      </ol>

      <div className="ct-thanks-actions ht-thanks-actions">
        <TealButton onClick={onTours}>Back to the tours</TealButton>
        <button type="button" className="ct-back" onClick={onReset}>
          Send another request
        </button>
      </div>
    </div>
  );
}

/** Thank you on a tour page, in the style of the contact page thank you. */
function TourThanks({ data: d, onReset }: { data: Fields; onReset: () => void }) {
  const first = firstName(d.name);
  const by = d.reach === "WhatsApp" ? "on WhatsApp" : "by email";
  const next = [
    { title: "We check the date", text: "With the guide, for your group." },
    { title: `We reply ${by}`, text: "With the details for your day." },
    { title: "You choose and confirm", text: "Nothing is booked until then." },
  ];
  return (
    <div className="or-ty" role="status">
      <p className="or-ty-badge">
        <span className="or-ty-check"><HIcon name="check" size={16} strokeWidth={2.2} /></span>
        Request sent
      </p>
      <h3 className="or-ty-title">{first ? <>Thank you,{" "}<br />{first}.</> : "Thank you."}</h3>
      <p className="or-ty-lead">We have your request for {d.tour} and will reply {by}.</p>
      <ol className="or-ty-next">
        {next.map((x, i) => (
          <li key={x.title}>
            <span className="or-ty-no">{i + 1}</span>
            <strong>{x.title}</strong>
            <span>{x.text}</span>
          </li>
        ))}
      </ol>
      <h4 className="ht-thanks-kicker">What you sent us</h4>
      <Summary data={d} />
      <div className="or-ty-actions">
        <a className="or-ty-home" href="/off-road">
          Back to the tours
          <HIcon name="arrowRight" size={16} />
        </a>
        <button type="button" className="ct-back" onClick={onReset}>
          Send another request
        </button>
      </div>
    </div>
  );
}

/* ---------- The form ---------- */

export function OffRoadRequestForm({ snapshot, today, lockTour, sectionId = "request" }: { snapshot: SearchSnapshot | null; today: string; lockTour?: Tour; sectionId?: string }) {
  // On a tour page the tour is chosen already and cannot be changed here.
  const start: Fields = lockTour ? { ...EMPTY, tour: lockTour.name } : EMPTY;
  // Tour pages: fixed height card, long steps split in two.
  const split = !!lockTour;
  const [f, setF] = useState<Fields>(start);
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

  const steps = stepsFor(f, split);
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

  // Carry what was chosen in the hero search (or the tour card) into the form.
  useEffect(() => {
    if (!snapshot) return;
    setF((p) => ({
      ...p,
      tour: lockTour ? lockTour.name : snapshot.tour || p.tour,
      date: snapshot.date || p.date,
      adults: snapshot.adults,
      children: snapshot.children,
      childAges: Array.from({ length: snapshot.children }, (_, i) => p.childAges[i] ?? ""),
    }));
    if (snapshot.date) clearError("date");
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
    if (view) view.scrollTop = 0;
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
      // Fixed height card: bring the field into view inside the step box.
      const view = viewRef.current;
      if (split && view && field) view.scrollTop += field.getBoundingClientRect().top - view.getBoundingClientRect().top - 60;
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
    const e = stepErrors(id, now, split);
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
    goTo(stepsFor(live(), split).indexOf("review"));
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
    const e = stepErrors("about", now, split);
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
    const all = stepsFor(now, split);
    const bad = all.find((s) => Object.keys(stepErrors(s, now, split)).length);
    if (bad) {
      setErrors(stepErrors(bad, now, split));
      goTo(all.indexOf(bad));
      return;
    }
    // TODO: send the request to the booking backend (none yet). Front end only:
    // the payload is built here and the thank you state is shown.
    console.info("[off-road] Tour request (email delivery not connected yet):", buildPayload(now));
    setSent(now);
    setEditing(false);
    refresh();
    requestAnimationFrame(() => revealCard(cardRef.current));
  };

  const reset = () => {
    setF(start);
    setErrors({});
    setSent(null);
    setEditing(false);
    setStep(0);
    refresh();
    requestAnimationFrame(() => revealCard(cardRef.current));
  };

  const setChildren = (n: number) => setF((p) => ({ ...p, children: n, childAges: Array.from({ length: n }, (_, i) => p.childAges[i] ?? "") }));

  // Pieces of the steps. On a tour page (lockTour) the long steps are split in
  // two so every step fits the fixed height of the form card.
  const lookingFS = (
        <fieldset className="ct-group ht-group">
          <legend className="ct-legend ht-legend">What are you looking for?</legend>
          <Pills label="What are you looking for" options={LOOKING} value={f.lookingFor} onChange={(v) => set("lookingFor", v)} icons={{ "Just the tour": "car", "Tour plus a stay": "bed" }} />
          <p className="ht-aside">
            Planning a whole trip with several stops and activities? <a href={FULL_TRIP_FORM}>Use our full trip form</a>
          </p>
        </fieldset>
  );
  const nameEmail = (
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
  );
  const contactFields = (
    <>
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
    </>
  );
  const tourFields = (
    <>
        {lockTour ? (
          <div className="or-locked">
            <span className="ht-sum-icon"><HIcon name="car" size={18} /></span>
            <span className="or-locked-text">
              <span className="ht-sum-label">Tour</span>
              <strong>{lockTour.name}</strong>
            </span>
          </div>
        ) : (
          <Field label="Which tour?" as="div">
            <Pills label="Which tour" options={TOUR_OPTIONS} value={f.tour} onChange={(v) => set("tour", v)} />
          </Field>
        )}
        <div className="ct-row">
          <label className="ct-field">
            <span className="ct-field-label">Date</span>
            <input type="date" name="date" value={f.date} min={today || undefined} aria-invalid={!!errors.date} onChange={(e) => put("date", e.target.value)} />
            <Err msg={errors.date} />
          </label>
        </div>
        <Field label="How fixed is the date?" as="div">
          <Pills label="How fixed is the date" options={FLEX} value={f.flex} onChange={(v) => set("flex", v)} />
        </Field>
    </>
  );
  const groupFields = (
    <>
        <div className="ct-steppers">
          <Stepper label="Adults" sub="13 and older" value={f.adults} min={1} max={16} onChange={(n) => set("adults", n)} />
          <Stepper label="Children" sub="Up to 12" value={f.children} min={0} max={10} onChange={setChildren} />
          {vehicleWord(f.tour) && (
            <Stepper label={vehicleWord(f.tour)} sub="How many vehicles" value={f.vehicles} min={1} max={10} onChange={(n) => set("vehicles", n)} />
          )}
        </div>
        {f.children > 0 && (
          <Field label="Children's ages" hint="So we can bring the right child seats." as="div">
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
    </>
  );
  const levelMain = (
    <>
        <Field label="How used are you to off road trips?" hint="So we can choose tracks that suit your group." as="div">
          <Pills label="Off road experience" options={LEVELS} value={f.level} onChange={(v) => set("level", v)} />
        </Field>
        <Field label="Does anyone get car sick?" optional as="div">
          <Pills label="Does anyone get car sick" options={YES_NO} value={f.motion} onChange={(v) => set("motion", v)} />
        </Field>
    </>
  );
  const levelWishes = (
    <>
        <Field label="What would you like to see?" optional as="div">
          <MultiPills label="What would you like to see" className="ht-extras" options={INTERESTS} value={f.interests} onChange={(v) => set("interests", v)} />
        </Field>
        <Field label="Accessibility or health needs" optional>
          <input type="text" placeholder="For example back problems or limited mobility" value={f.access} onChange={(e) => set("access", e.target.value)} />
        </Field>
    </>
  );
  const stayWhere = (
    <>
        <p className="ht-step-intro">We can look for a place to stay around your tour.</p>
        <Field label="Area" as="div">
          <Pills label="Area" options={STAY_AREAS} value={f.stayArea as (typeof STAY_AREAS)[number] | ""} onChange={(v) => set("stayArea", v)} />
        </Field>
        <div className="ct-row">
          <label className="ct-field">
            <span className="ct-field-label">Check in <em>(optional)</em></span>
            <input type="date" value={f.stayIn} min={today || undefined} onChange={(e) => put("stayIn", e.target.value, "stayOut")} />
          </label>
          <label className="ct-field">
            <span className="ct-field-label">Check out <em>(optional)</em></span>
            <input type="date" value={f.stayOut} min={f.stayIn || today || undefined} aria-invalid={!!errors.stayOut} onChange={(e) => put("stayOut", e.target.value)} />
            <Err msg={errors.stayOut} />
          </label>
        </div>
    </>
  );
  const stayWhat = (
    <>
        <Field label="Type of stay" optional as="div">
          <Pills label="Type of stay" options={STAY_TYPES} value={f.stayType as (typeof STAY_TYPES)[number] | ""} onChange={(v) => set("stayType", v)} />
        </Field>
        <Field label="Budget per night" optional as="div">
          <Pills label="Budget per night" options={BUDGETS} value={f.budget} onChange={(v) => set("budget", v)} />
        </Field>
        <p className="ht-aside">
          Looking only for a place to stay? <a href="/hotels">See our stays</a>
        </p>
    </>
  );

  const panels: Record<StepId, ReactNode> = {
    about: (
      <>
        {lookingFS}
        <fieldset className="ct-group ht-group">
          <legend className="ct-legend ht-legend">About you</legend>
          {nameEmail}
          {!split && contactFields}
        </fieldset>
      </>
    ),
    reach: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">How to reach you</legend>
        {contactFields}
      </fieldset>
    ),
    tour: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your tour</legend>
        <p className="ht-step-intro">{lockTour ? "The day you want to go." : "The tour you like and the day you want to go."}</p>
        {tourFields}
        {!split && groupFields}
      </fieldset>
    ),
    group: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your group</legend>
        {groupFields}
      </fieldset>
    ),
    pickup: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Pickup</legend>
        <Field
          label={lockTour ? "Pickup or meeting point?" : "Would you like us to pick you up?"}
          hint={!lockTour || lockTour.id === "mountain-full-day" ? "The full day tour includes a transfer from where you stay." : undefined}
          as="div"
        >
          <Pills label="Would you like us to pick you up" options={PICKUP} value={f.pickup} onChange={(v) => set("pickup", v)} icons={{ "Yes, pick us up": "car", "We meet you there": "pin" }} />
        </Field>
        {needsPickup(f) && (
          <Field label="Where are you staying?" optional hint="The name of the hotel or the town is enough.">
            <input type="text" value={f.stayPlace} placeholder="For example a hotel in Tempio Pausania" onChange={(e) => set("stayPlace", e.target.value)} />
          </Field>
        )}
        {/* TODO: add start times once confirmed. The old hint ("The half day tour starts at 9:30 or 15:30")
            belonged to the removed Monte Limbara half day tour. */}
        <Field label="Morning or afternoon?" optional as="div">
          <Pills label="Morning or afternoon" options={TIMES} value={f.time} onChange={(v) => set("time", v)} />
        </Field>
      </fieldset>
    ),
    level: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Experience</legend>
        {levelMain}
        {!split && levelWishes}
      </fieldset>
    ),
    wishes: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your wishes</legend>
        {levelWishes}
      </fieldset>
    ),
    stay: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your stay</legend>
        {stayWhere}
        {!split && stayWhat}
      </fieldset>
    ),
    stayMore: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Your stay</legend>
        {stayWhat}
      </fieldset>
    ),
    extra: (
      <fieldset className="ct-group ht-group">
        <legend className="ct-legend ht-legend">Anything else</legend>
        <Field label="Is it a special occasion?" optional as="div">
          <Pills label="Occasion" options={OCCASIONS} value={f.occasion} onChange={(v) => set("occasion", v)} />
        </Field>
        <Field label="Notes" optional hint="Anything we should know about your group or the day.">
          <textarea value={f.notes} placeholder="A place you would love to see, a dog in the group, anything we should know" onChange={(e) => set("notes", e.target.value)} />
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
    <section className="ht-section ht-request" id={sectionId} aria-labelledby="ht-request-title">
      <div className="ht-inner">
        <div className="ht-request-grid">
          <div className="ht-request-intro">
            <p className="ht-kicker">{lockTour ? "Ask about this tour" : "Request a tour"}</p>
            <h2 id="ht-request-title" className="ht-title">{lockTour ? lockTour.name : "Plan your day off road"}</h2>
            <p className="ht-lead">
              {lockTour
                ? "Tell us the date and your group. We check it with the guide and reply with the details for your day."
                : "Tell us the date, your group and how adventurous you feel. With everything here, our first reply can already include the details for your day."}
            </p>
            <ul className="ht-request-points">
              <li><HIcon name="clock" size={20} />Takes a few minutes</li>
              <li><HIcon name="calendarCheck" size={20} />We check the date with the guide</li>
              <li><HIcon name="checkCircle" size={20} />Nothing is booked until you confirm</li>
            </ul>
          </div>

          <div className={`ht-form${split ? " or-form-fixed" : ""}`} ref={cardRef}>
            {sent !== null && lockTour ? (
              <TourThanks data={sent} onReset={reset} />
            ) : sent !== null ? (
              <ThankYou data={sent} onTours={() => scrollToEl(document.getElementById("tours"))} onReset={reset} />
            ) : (
              <form ref={formRef} noValidate onSubmit={submit} onBlur={syncLive} onAnimationStart={(e) => e.animationName === "ht-autofill" && syncLive()} aria-label="Tour request">
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
                {(id === "review" || split) && <p className="ht-form-note">We only use these details to answer your request.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
