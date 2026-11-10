"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { createPortal, flushSync } from "react-dom";
import { Icon } from "./icons";
import {
  AIRPORTS, ALL_STEPS, ARRIVAL_METHODS, BOAT_STYLES, BOAT_TYPES, CAR_SEATS, CAR_SIZES, CAR_TYPES,
  CELEBRATIONS, COUNTRY_SUGGESTIONS, DURATIONS, DURATIONS_OTHER, HEARD_FROM, INTERESTS, LOCATIONS, NEEDS,
  GROUP_TYPES, PLACE_SUGGESTIONS, PORTS, QUICK_TOPICS, RENTAL_CAR, REPLY_VIA, STAY_AMENITIES, STAY_BOARD, STAY_ROOMS,
  STAY_ROOMS_COUNT, STAY_TYPES, SWIMMING, TRANSFER_ITEMS, TRANSFER_TRIPS, YES_NO,
  activeSteps, asksPickup, emptyData, isEmail, isLargeGroup, stepValid, wantsBoat, wantsTransfer,
} from "./contactData";
import type { ContactData, Opt, StepId } from "./contactData";
import { labelOf } from "./contactData";
import { submitContactRequest } from "./submit";
import { buildReviewTiles } from "./reviewTiles";
import { BudgetSlider } from "./BudgetSlider";

const STORAGE_KEY = "sdt-contact-request-v1";

/* ---------- small building blocks ---------- */

// Visitor typed text shown back on the thank you screen: trim, collapse spaces, cap length.
const cleanText = (s: string, max = 80) => s.replace(/\s+/g, " ").trim().slice(0, max);
// First name only: first word of the field, letters and apostrophes or inner hyphens, first letter capitalised.
function firstNameOnly(raw: string) {
  const word = raw.trim().split(/[\s,;/]+/).find((w) => /\p{L}/u.test(w)) ?? "";
  const clean = word.replace(/[^\p{L}'\u2019-]/gu, "").replace(/^[-'\u2019]+|[-'\u2019]+$/g, "").slice(0, 30);
  return clean ? clean.charAt(0).toLocaleUpperCase() + clean.slice(1) : "";
}

/** The site's teal button-02 (same as "Discover the tour"), as a <button> or link. */
function TealButton({ children, onClick, disabled, href, className = "" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; href?: string; className?: string }) {
  const inner = (
    <>
      <span className="inner">{children}</span>
      <span className="circle" aria-hidden="true"><span>→</span></span>
    </>
  );
  const cls = `button-02 button-02--teal ct-btn ${className}`.trim();
  if (href) return <a className={cls} href={href}>{inner}</a>;
  return <button type="button" className={cls} onClick={onClick} disabled={disabled}>{inner}</button>;
}

function OptionCard({ opt, on, multi, onToggle }: { opt: Opt; on: boolean; multi?: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={on}
      className={`ct-card${on ? " is-on" : ""}`}
      onClick={onToggle}
    >
      {opt.icon && <span className="ct-card-icon"><Icon name={opt.icon} size={24} /></span>}
      <span className="ct-card-text">
        <span className="ct-card-label">{opt.label}</span>
        {opt.hint && <span className="ct-card-hint">{opt.hint}</span>}
      </span>
      <span className={`ct-card-check${multi ? " is-square" : ""}`} aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.4} /></span>
    </button>
  );
}

/** Large photo card used on the interests step. */
function ImageCard({ opt, on, onToggle }: { opt: Opt; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} className={`ct-photo${on ? " is-on" : ""}`} onClick={onToggle}>
      {opt.image && <img className="ct-photo-img" src={opt.image} alt="" loading="lazy" decoding="async" />}
      <span className="ct-photo-shade" aria-hidden="true" />
      <span className="ct-photo-check" aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.4} /></span>
      <span className="ct-photo-body">
        {opt.icon && <span className="ct-photo-icon"><Icon name={opt.icon} size={24} /></span>}
        <span className="ct-photo-label">{opt.label}</span>
        {opt.hint && <span className="ct-photo-hint">{opt.hint}</span>}
      </span>
    </button>
  );
}

function Choice({ legend, sub, options, value, onChange, layout = "cards" }: {
  legend: string; sub?: string; options: Opt[]; value: string; onChange: (v: string) => void; layout?: "cards" | "rows" | "pills" | "wide" | "four";
}) {
  return (
    <fieldset className="ct-group">
      <legend className="ct-legend">{legend}</legend>
      {sub && <p className="ct-legend-sub">{sub}</p>}
      {layout === "pills" ? (
        <div className="ct-pills" role="radiogroup" aria-label={legend}>
          {options.map((o) => (
            <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={`ct-pill${value === o.value ? " is-on" : ""}`} onClick={() => onChange(value === o.value ? "" : o.value)}>
              {o.icon && <Icon name={o.icon} size={18} />}{o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="ct-grid" data-n={options.length} data-hints={options.some((o) => o.hint) ? "" : undefined} role="radiogroup" aria-label={legend}>
          {options.map((o) => <OptionCard key={o.value} opt={o} on={value === o.value} onToggle={() => onChange(o.value)} />)}
        </div>
      )}
    </fieldset>
  );
}

function MultiChoice({ legend, sub, options, values, onToggle: toggle, layout = "cards" }: {
  legend: string; sub?: string; options: Opt[]; values: string[]; onToggle: (v: string) => void; layout?: "cards" | "pills" | "wide" | "four" | "photos";
}) {
  return (
    <fieldset className="ct-group">
      <legend className="ct-legend">{legend}</legend>
      {sub && <p className="ct-legend-sub">{sub}</p>}
      {layout === "pills" ? (
        <div className="ct-pills">
          {options.map((o) => (
            <button key={o.value} type="button" role="checkbox" aria-checked={values.includes(o.value)} className={`ct-pill${values.includes(o.value) ? " is-on" : ""}`} onClick={() => toggle(o.value)}>
              {o.icon && <Icon name={o.icon} size={18} />}{o.label}
            </button>
          ))}
        </div>
      ) : layout === "photos" ? (
        <div className="ct-photos">
          {options.map((o) => <ImageCard key={o.value} opt={o} on={values.includes(o.value)} onToggle={() => toggle(o.value)} />)}
        </div>
      ) : (
        <div className="ct-grid" data-n={options.length} data-hints={options.some((o) => o.hint) ? "" : undefined}>
          {options.map((o) => <OptionCard key={o.value} opt={o} multi on={values.includes(o.value)} onToggle={() => toggle(o.value)} />)}
        </div>
      )}
    </fieldset>
  );
}

function Field({ label, optional, hint, children }: { label: string; optional?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="ct-field">
      <span className="ct-field-label">{label}{optional && <em> (optional)</em>}</span>
      {children}
      {hint && <span className="ct-field-hint">{hint}</span>}
    </label>
  );
}

function Stepper({ label, sub, value, min, max, onChange }: { label: string; sub?: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="ct-stepper">
      <div className="ct-stepper-text">
        <span className="ct-stepper-label">{label}</span>
        {sub && <span className="ct-stepper-sub">{sub}</span>}
      </div>
      <div className="ct-stepper-ctrl">
        <button type="button" className="ct-step-btn" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}><Icon name="minus" size={18} /></button>
        <output className="ct-step-val" aria-live="polite" aria-label={`${label}: ${value}`}>{value}</output>
        <button type="button" className="ct-step-btn" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}><Icon name="plus" size={18} /></button>
      </div>
    </div>
  );
}

function Toggle({ label, sub, on, onChange }: { label: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} className={`ct-toggle${on ? " is-on" : ""}`} onClick={() => onChange(!on)}>
      <span className="ct-toggle-text"><span className="ct-toggle-label">{label}</span>{sub && <span className="ct-toggle-sub">{sub}</span>}</span>
      <span className="ct-toggle-track" aria-hidden="true"><span className="ct-toggle-knob" /></span>
    </button>
  );
}

const todayISO = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

function scrollToTop() {
  const w = window as unknown as { ScrollSmoother?: { get?: () => { scrollTo: (y: number, smooth?: boolean) => void } | undefined } };
  const smoother = w.ScrollSmoother?.get?.();
  if (smoother) smoother.scrollTo(0, false);
  else window.scrollTo(0, 0);
}

/* ---------- the wizard ---------- */

export function ContactWizard() {
  const [data, setData] = useState<ContactData>(emptyData);
  const [step, setStep] = useState<StepId>("intro");
  const [editing, setEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [sent, setSent] = useState<{ name: string; via: string; data: ContactData } | null>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  // "What happens next" cards: one is always open (the first by default).
  const [nextOn, setNextOn] = useState(0);
  const nextListRef = useRef<HTMLOListElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);

  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => setData((d) => ({ ...d, [k]: v }));
  type ListKey = "interests" | "transferItems" | "needs" | "quickTopics" | "stayAmenities";
  const toggleIn = (k: ListKey) => (v: string) =>
    setData((d) => ({ ...d, [k]: d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v] }));

  // Restore saved progress, read ?step=N (dev preview) and detect the time zone.
  useEffect(() => {
    let restored: ContactData = { ...emptyData };
    let restoredStep: StepId = "intro";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { data?: Partial<ContactData>; step?: StepId };
        restored = { ...emptyData, ...saved.data };
        if (saved.step && ALL_STEPS.includes(saved.step) && saved.step !== "thanks") restoredStep = saved.step;
      }
    } catch { /* ignore broken storage */ }
    if (!restored.timeZone) {
      try { restored.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* ignore */ }
    }
    const q = new URLSearchParams(window.location.search).get("step");
    if (q) {
      const byId = ALL_STEPS.find((s) => s === q);
      const n = Number(q);
      let target: StepId | undefined = byId;
      if (!target && Number.isInteger(n)) {
        // Numbers index the full step list so every screen can be previewed.
        target = ALL_STEPS[Math.max(0, Math.min(ALL_STEPS.length - 1, n - 1))];
      }
      if (target) {
        if ((target === "boatWhere" || target === "boatHow") && !restored.interests.includes("boat")) restored.interests = [...restored.interests, "boat"];
        if (target === "transfer" && !restored.interests.includes("transfer")) restored.interests = [...restored.interests, "transfer"];
        restoredStep = target;
      }
    }
    if (restored.rentalCar === "yes") restored.rentalCar = "myself";
    if (!isLargeGroup(restored)) { restored.groupType = ""; restored.groupNotes = ""; }
    setData(restored);
    setStep(restoredStep);
    setReady(true);
    setMounted(true);
  }, []);

  // Persist progress.
  useEffect(() => {
    if (!ready || step === "thanks") return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step })); } catch { /* storage full or blocked */ }
  }, [data, step, ready]);

  // Group questions exist only for parties of 13 or more.
  useEffect(() => {
    if (!ready || isLargeGroup(data) || (!data.groupType && !data.groupNotes)) return;
    setData((d) => (isLargeGroup(d) ? d : { ...d, groupType: "", groupNotes: "" }));
  }, [ready, data]);

  // Hide the fixed bottom bar once the footer scrolls into view.
  useEffect(() => {
    if (!mounted) return;
    const footer = document.getElementById("main-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, [mounted]);

  // Move focus to the new question after navigating (screen readers + keyboard).
  useEffect(() => {
    if (!navigated.current) return;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Thank you screen: soft staggered entrance like the rest of the site.
  useEffect(() => {
    if (step !== "thanks") return;
    const root = thanksRef.current;
    const g = (window as unknown as { gsap?: { fromTo: (t: unknown, a: object, b: object) => void } }).gsap;
    if (!root || !g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    g.fromTo(root.querySelector(".ct-thanks-bg img"), { scale: 1.08 }, { scale: 1, duration: 2.2, ease: "power2.out", clearProps: "transform" });
    g.fromTo(root.querySelectorAll("[data-ty]"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, delay: 0.1, clearProps: "transform,opacity,visibility" });
  }, [step]);

  useEffect(() => {
    if (step === "thanks") setNextOn(0);
  }, [step]);

  // Open one "What happens next" card. Desktop: the card grows and turns cream
  // with CSS transitions (timing taken from the Yucca reference on Details).
  // Phone: the cards stack and GSAP animates the height change like an accordion.
  const openNext = (i: number) => {
    if (i === nextOn) return;
    const list = nextListRef.current;
    const g = (window as unknown as { gsap?: { fromTo: (t: unknown, a: object, b: object) => void } }).gsap;
    const phone = window.matchMedia("(max-width: 860px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!list || !g || !phone || still) {
      setNextOn(i);
      return;
    }
    const cards = Array.from(list.querySelectorAll<HTMLElement>(".ct-next-card"));
    const before = cards.map((c) => c.offsetHeight);
    flushSync(() => setNextOn(i));
    cards.forEach((c, k) => {
      const after = c.offsetHeight;
      if (after !== before[k]) g.fromTo(c, { height: before[k] }, { height: after, duration: 0.6, ease: "power3.out", clearProps: "height" });
    });
    g.fromTo(cards[i].querySelectorAll(".ct-next-more > *"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06, delay: 0.08, clearProps: "transform,opacity,visibility" });
  };

  const steps = useMemo(() => activeSteps(data), [data]);
  const idx = steps.indexOf(step);
  const questionSteps: StepId[] = steps.filter((s) => s !== "intro" && s !== "thanks");
  const qIdx = questionSteps.indexOf(step);
  const progress = step === "thanks" || step === "quick" ? 1 : Math.max(0, (qIdx + 1) / questionSteps.length);
  const valid = stepValid(step, data);

  const go = (s: StepId) => {
    navigated.current = true;
    setStep(s);
    scrollToTop();
  };

  const send = async () => {
    if (sending) return;
    setSending(true);
    try {
      await submitContactRequest({ ...data, mode: step === "quick" ? "quick" : "guided" });
      setSent({ name: firstNameOnly(data.firstName), via: data.replyVia, data: { ...data, mode: step === "quick" ? "quick" : "guided" } });
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      setEditing(false);
      go("thanks");
    } finally {
      setSending(false);
    }
  };

  const startGuided = () => { set("mode", "guided"); go(steps[1]); };
  const startQuick = () => { set("mode", "quick"); go("quick"); };

  const next = () => {
    if (!valid) return;
    if (step === "review" || step === "quick") { void send(); return; }
    if (editing) { setEditing(false); go("review"); return; }
    const n = steps[idx + 1];
    if (n) go(n);
  };

  const back = () => {
    if (step === "quick") { go("intro"); return; }
    if (editing) { setEditing(false); go("review"); return; }
    const p = steps[idx - 1];
    if (p) go(p);
  };

  const editStep = (s: StepId) => { setEditing(true); go(s); };

  const startOver = () => {
    setData({ ...emptyData, timeZone: data.timeZone });
    setSent(null);
    go("intro");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "A" || tag === "SELECT") return;
    if (step === "intro") { e.preventDefault(); startGuided(); return; }
    if (step === "thanks" || step === "review") return;
    e.preventDefault();
    next();
  };

  const nextLabel = step === "review" || step === "quick" ? (sending ? "Sending" : "Send request") : editing ? "Save & review" : step === "about" ? "Review" : "Next";
  const showBar = step !== "intro" && step !== "thanks";
  const stepNo = qIdx + 1;

  let headNode: ReactNode = null;
  const head = (title: string, sub?: string): null => {
    headNode = (
      <>
        {qIdx >= 0 && step !== "review" && <p className="ct-count">Step {stepNo} of {questionSteps.length - 1}</p>}
        {step === "review" && <p className="ct-count">Last step</p>}
        <h1 className="ct-title" ref={headingRef} tabIndex={-1}>{title}</h1>
        {sub && <p className="ct-sub">{sub}</p>}
      </>
    );
    return null;
  };

  let body: ReactNode = null;
  switch (step) {
    case "intro":
      body = (
        <div className="ct-intro">
          <div className="ct-intro-bg" aria-hidden="true">
            <img
              src="/contact/sunset-hero.webp"
              srcSet="/contact/sunset-hero-1200.webp 1200w, /contact/sunset-hero.webp 2400w"
              sizes="100vw"
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="ct-intro-main">
            <h1 className="ct-title ct-title--xl" ref={headingRef} tabIndex={-1}>Plan your <br />Sardinia trip</h1>
            <p className="ct-sub">Answer a few questions and we can reply with everything you need in one message.</p>
            <div className="ct-intro-actions">
              <div className="ct-intro-choice">
                <TealButton className="ct-start" onClick={startGuided}>
                  {data.interests.length && data.mode !== "quick" ? "Continue where you left off" : "Let us guide you"}
                </TealButton>
                <p className="ct-intro-note">A few short questions, one full reply.</p>
              </div>
              <div className="ct-intro-choice">
                <button type="button" className="ct-back ct-quick-btn" onClick={startQuick}>Quick request</button>
                <p className="ct-intro-note">Just your details and a message.</p>
              </div>
            </div>
          </div>
          <div className="ct-intro-side">
          <p className="ct-intro-side-title">How the guided request works</p>
          <ol className="ct-intro-list">
            {[
              ["compass", "boat", "What you'd like to do", "Boat tours, transfers or a full trip."],
              ["calendar", "calendar", "When and who", "Your dates and your group."],
              ["plane", "plane", "How you're arriving", "Flights, ferries and where you're staying."],
              ["send", "coast", "Review and send", "Check your answers, then send."],
            ].map(([icon, img, t, s]) => (
              <li key={t}>
                <img className="ct-intro-thumb" src={`/contact/thumb-${img}.webp`} alt="" width={64} height={64} loading="lazy" decoding="async" />
                <span className="ct-intro-text"><strong>{t}</strong><span>{s}</span></span>
                <span className="ct-intro-icon"><Icon name={icon} size={24} /></span>
              </li>
            ))}
          </ol>
          </div>
        </div>
      );
      break;

    case "interests":
      body = (
        <>
          {head("What are you interested in?")}
          <MultiChoice legend="Choose all that apply" options={INTERESTS} values={data.interests} onToggle={toggleIn("interests")} layout="photos" />
          {data.interests.includes("other") && (
            <Field label="Tell us what you have in mind">
              <textarea rows={3} value={data.interestOther} onChange={(e) => set("interestOther", e.target.value)} placeholder="For example a cooking class, a hike or a wine tasting" />
            </Field>
          )}
        </>
      );
      break;

    case "boatWhere":
      body = (
        <>
          {head("Where would you like to go by boat?")}
          <Choice legend="Location" options={LOCATIONS} value={data.boatLocation} onChange={(v) => set("boatLocation", v)} layout="rows" />
        </>
      );
      break;

    case "boatHow": {
      const durationOpts = data.boatType === "rib" ? DURATIONS : DURATIONS_OTHER;
      body = (
        <>
          {head("What kind of boat day?")}
          <Choice legend="Boat type" options={BOAT_TYPES} value={data.boatType} onChange={(v) => {
            setData((d) => ({
              ...d,
              boatType: v,
              boatDuration: v !== "rib" && d.boatDuration === "half" ? "" : d.boatDuration,
            }));
          }} />
          <Choice legend="How long?" options={durationOpts} value={data.boatDuration} onChange={(v) => set("boatDuration", v)} />
          <Choice legend="Shared or private?" options={BOAT_STYLES} value={data.boatStyle} onChange={(v) => set("boatStyle", v)} layout="wide" />
        </>
      );
      break;
    }

    case "transfer":
      body = (
        <>
          {head("Tell us about your transfer")}
          <datalist id="ct-places">{PLACE_SUGGESTIONS.map((p) => <option key={p} value={p} />)}</datalist>
          <div className="ct-row">
            <Field label="From"><input list="ct-places" value={data.transferFrom} onChange={(e) => set("transferFrom", e.target.value)} placeholder="e.g. Olbia Airport" autoComplete="off" /></Field>
            <Field label="To"><input list="ct-places" value={data.transferTo} onChange={(e) => set("transferTo", e.target.value)} placeholder="e.g. your hotel in Porto Cervo" autoComplete="off" /></Field>
          </div>
          <Choice legend="One-way or return?" options={TRANSFER_TRIPS} value={data.transferTrip} onChange={(v) => set("transferTrip", v)} layout="wide" />
          <fieldset className="ct-group">
            <legend className="ct-legend">Luggage</legend>
            <div className="ct-steppers">
              <Stepper label="Large bags" sub="Suitcases that go in the boot" value={data.transferBags} min={0} max={30} onChange={(n) => set("transferBags", n)} />
            </div>
          </fieldset>
          <MultiChoice legend="Any special items?" sub="Optional" options={TRANSFER_ITEMS} values={data.transferItems} onToggle={toggleIn("transferItems")} layout="pills" />
        </>
      );
      break;

    case "dates":
      body = (
        <>
          {head("When are you coming?", "So we can plan around your arrival and departure.")}
          <div className="ct-row">
            <Field label="Arrive in Sardinia"><input type="date" min={todayISO()} value={data.tripArrival} onChange={(e) => set("tripArrival", e.target.value)} /></Field>
            <Field label="Leave Sardinia"><input type="date" min={data.tripArrival || todayISO()} value={data.tripDeparture} onChange={(e) => set("tripDeparture", e.target.value)} /></Field>
          </div>
          {data.tripArrival && data.tripDeparture && data.tripDeparture < data.tripArrival && <p className="ct-error" role="alert">The departure date is before the arrival date.</p>}
          <div className="ct-row">
            <Field label={wantsBoat(data) ? "Preferred boat tour date" : wantsTransfer(data) && data.interests.length === 1 ? "Transfer date" : "Preferred activity date"} optional>
              <input type="date" min={data.tripArrival || todayISO()} max={data.tripDeparture || undefined} value={data.activityDate1} onChange={(e) => set("activityDate1", e.target.value)} />
            </Field>
            <Field label="Alternative date" optional>
              <input type="date" min={data.tripArrival || todayISO()} max={data.tripDeparture || undefined} value={data.activityDate2} onChange={(e) => set("activityDate2", e.target.value)} />
            </Field>
          </div>
          <Toggle label="My dates are flexible" sub="We'll suggest the days with the best weather and sea." on={data.datesFlexible} onChange={(v) => set("datesFlexible", v)} />
          {data.datesFlexible && (
            <Field label="Roughly when?" optional={!!(data.tripArrival && data.tripDeparture)} hint="For example: two weeks in mid-June.">
              <input value={data.datesNote} onChange={(e) => set("datesNote", e.target.value)} />
            </Field>
          )}
        </>
      );
      break;

    case "guests":
      body = (
        <>
          {head("Who's coming?")}
          <div className="ct-steppers">
            <Stepper label="Adults" sub="13 and older" value={data.adults} min={1} max={40} onChange={(n) => set("adults", n)} />
            <Stepper label="Children" sub="Ages 2 to 12" value={data.children} min={0} max={20} onChange={(n) => setData((d) => ({ ...d, children: n, childAges: Array.from({ length: n }, (_, i) => d.childAges[i] ?? "") }))} />
            <Stepper label="Infants" sub="Under 2" value={data.infants} min={0} max={10} onChange={(n) => set("infants", n)} />
          </div>
          {data.children > 0 && (
            <fieldset className="ct-group">
              <legend className="ct-legend">Children&apos;s ages</legend>
              <div className="ct-ages">
                {data.childAges.map((age, i) => (
                  <Field key={i} label={`Child ${i + 1}`}>
                    <select value={age} onChange={(e) => setData((d) => ({ ...d, childAges: d.childAges.map((a, j) => (j === i ? e.target.value : a)) }))}>
                      <option value="">Age</option>
                      {Array.from({ length: 11 }, (_, k) => k + 2).map((a) => <option key={a} value={String(a)}>{a}</option>)}
                    </select>
                  </Field>
                ))}
              </div>
            </fieldset>
          )}
          {wantsBoat(data) && <Choice legend="Is everyone comfortable swimming?" options={SWIMMING} value={data.swimming} onChange={(v) => set("swimming", v)} />}
          {isLargeGroup(data) && (
            <>
              <p className="ct-note" role="note">
                Groups of 13 or more are planned as a tailor-made trip. Our standard experiences are for up to 12 guests.
              </p>
              <Choice legend="What kind of group is this?" options={GROUP_TYPES} value={data.groupType} onChange={(v) => set("groupType", v)} layout="pills" />
              <Field label="Notes about the group" optional hint="Anything that helps us plan for a group this size.">
                <textarea rows={3} value={data.groupNotes} onChange={(e) => set("groupNotes", e.target.value)} placeholder="For example a school trip, or a company off-site" />
              </Field>
            </>
          )}
        </>
      );
      break;

    case "arrival":
      body = (
        <>
          {head("How are you getting to Sardinia?")}
          <Choice legend="Arriving by" options={ARRIVAL_METHODS} value={data.arrivalMethod} onChange={(v) => set("arrivalMethod", v)} />
          {data.arrivalMethod === "plane" && (
            <>
              <Choice legend="Which airport?" options={AIRPORTS} value={data.airport} onChange={(v) => set("airport", v)} layout="pills" />
              <div className="ct-row ct-row--3">
                <Field label="Flight number" optional hint="If you have it"><input value={data.flightNumber} onChange={(e) => set("flightNumber", e.target.value)} placeholder="e.g. AZ 1554" autoComplete="off" /></Field>
                <Field label="Arrival date" optional><input type="date" min={todayISO()} value={data.arrivalDate || data.tripArrival} onChange={(e) => set("arrivalDate", e.target.value)} /></Field>
                <Field label="Arrival time" optional><input type="time" value={data.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} /></Field>
              </div>
              <p className="ct-note" role="note">We do not book flight tickets. Share your flight details so we can plan pickups and the days around your arrival.</p>
            </>
          )}
          {data.arrivalMethod === "ferry" && (
            <>
              <Choice legend="Which port?" options={PORTS} value={data.port} onChange={(v) => set("port", v)} layout="pills" />
              <div className="ct-row">
                <Field label="Arrival date" optional><input type="date" min={todayISO()} value={data.arrivalDate || data.tripArrival} onChange={(e) => set("arrivalDate", e.target.value)} /></Field>
                <Field label="Arrival time" optional><input type="time" value={data.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} /></Field>
              </div>
            </>
          )}
          <Choice legend="Rental car" sub="We can arrange one through our partners. The request is sent by email." options={RENTAL_CAR} value={data.rentalCar} onChange={(v) => setData((d) => ({
            ...d,
            rentalCar: v,
            rentalCarType: v === "for_me" ? d.rentalCarType : "",
            rentalCarSeats: v === "for_me" ? d.rentalCarSeats : "",
            rentalCarSize: v === "for_me" ? d.rentalCarSize : "",
          }))} layout="pills" />
          {data.rentalCar === "for_me" && (
            <>
              <Choice legend="What kind of car? (required)" options={CAR_TYPES} value={data.rentalCarType} onChange={(v) => set("rentalCarType", v)} layout="pills" />
              <Choice legend="How many seats? (required)" options={CAR_SEATS} value={data.rentalCarSeats} onChange={(v) => set("rentalCarSeats", v)} layout="pills" />
              <Choice legend="Size (required)" options={CAR_SIZES} value={data.rentalCarSize} onChange={(v) => set("rentalCarSize", v)} layout="pills" />
              {(!data.rentalCarType || !data.rentalCarSeats || !data.rentalCarSize) && (
                <p className="ct-error" role="status">Choose a car type, number of seats and size to continue.</p>
              )}
            </>
          )}
          {asksPickup(data) && <Choice legend="Do you need a pickup to the boat or tour?" options={YES_NO} value={data.pickup} onChange={(v) => set("pickup", v)} layout="pills" />}
        </>
      );
      break;

    case "stay":
      body = (
        <>
          {head("Where are you staying?", "So we can plan pickups and suggest what's close by.")}
          <Toggle label="Not booked yet" sub="We can suggest where to stay." on={data.stayNotBooked} onChange={(v) => set("stayNotBooked", v)} />
          {!data.stayNotBooked && (
            <>
              <div className="ct-row">
                <Field label="Area or town"><input value={data.stayArea} onChange={(e) => set("stayArea", e.target.value)} placeholder="e.g. Porto Cervo, Alghero, Cagliari" /></Field>
                <Field label="Hotel or address" optional><input value={data.stayAddress} onChange={(e) => set("stayAddress", e.target.value)} placeholder="Hotel name or street address" /></Field>
              </div>
            </>
          )}
          {data.stayNotBooked && (
            <>
              <Choice legend="Type of stay" options={STAY_TYPES} value={data.stayType} onChange={(v) => set("stayType", v)} layout="pills" />
              <Choice legend="Room type" options={STAY_ROOMS} value={data.stayRoom} onChange={(v) => set("stayRoom", v)} layout="pills" />
              <Choice legend="Number of rooms" options={STAY_ROOMS_COUNT} value={data.stayRoomsCount} onChange={(v) => set("stayRoomsCount", v)} layout="pills" />
              <Choice legend="Board" options={STAY_BOARD} value={data.stayBoard} onChange={(v) => set("stayBoard", v)} layout="pills" />
              <MultiChoice legend="Nice to have" sub="Optional" options={STAY_AMENITIES} values={data.stayAmenities} onToggle={toggleIn("stayAmenities")} layout="pills" />
              <Field label="Other request" optional hint="Anything else about the stay">
                <input value={data.stayRequest} onChange={(e) => set("stayRequest", e.target.value)} />
              </Field>
              <p className="ct-note" role="note">Budget for activities is on the next step. Tell us your stay preferences here and we will suggest options.</p>
            </>
          )}
        </>
      );
      break;

    case "extras":
      body = (
        <>
          {head("Anything we should know?")}
          <MultiChoice legend="Select any that apply" sub="Optional" options={NEEDS} values={data.needs} onToggle={toggleIn("needs")} layout="pills" />
          {data.needs.includes("celebration") && <Choice legend="What are you celebrating?" options={CELEBRATIONS} value={data.celebration} onChange={(v) => set("celebration", v)} layout="pills" />}
          {data.needs.length > 0 && (
            <Field label="Tell us a little more" optional hint="Allergies, mobility, the date of the celebration">
              <input value={data.needsDetail} onChange={(e) => set("needsDetail", e.target.value)} />
            </Field>
          )}
          <BudgetSlider legend="Budget per person" sub="For the activities you're asking about." value={data.budget} onChange={(v) => set("budget", v)} />
          <Field label="Your message" optional>
            <textarea rows={5} value={data.message} onChange={(e) => set("message", e.target.value)} placeholder="Anything else we should know" />
          </Field>
        </>
      );
      break;

    case "about":
      body = (
        <>
          {head("About you", "So we know who to reply to, and when.")}
          <datalist id="ct-countries">{COUNTRY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}</datalist>
          <div className="ct-row">
            <Field label="First name"><input value={data.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" /></Field>
            <Field label="Last name"><input value={data.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" /></Field>
          </div>
          <div className="ct-row">
            <Field label="Email"><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" /></Field>
            <Field label="Phone / WhatsApp" hint="Include your country code"><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+1 555 123 4567" /></Field>
          </div>
          {data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()) && <p className="ct-error" role="alert">Please check your email address.</p>}
          <div className="ct-row">
            <Field label="Country"><input list="ct-countries" value={data.country} onChange={(e) => set("country", e.target.value)} autoComplete="country-name" /></Field>
            <Field label="Time zone" hint="Detected automatically. Change it if it's wrong."><input value={data.timeZone} onChange={(e) => set("timeZone", e.target.value)} /></Field>
          </div>
          <Choice legend="How should we reply?" options={REPLY_VIA} value={data.replyVia} onChange={(v) => set("replyVia", v)} layout="wide" />
          <Choice legend="How did you hear about us?" sub="Optional" options={HEARD_FROM} value={data.heardFrom} onChange={(v) => set("heardFrom", v)} layout="pills" />
        </>
      );
      break;

    case "review":
      body = (
        <>
          {head("Here's your trip", "Check everything looks right, then send it to us.")}
          <div className="ct-bento">
            {buildReviewTiles(data).map((t) => (
              <section className={`ct-tile${t.wide ? " ct-tile--wide" : ""}`} key={t.step} aria-label={t.title}>
                <div className="ct-tile-top">
                  <span className="ct-tile-badge"><Icon name={t.icon} size={24} /></span>
                  <button type="button" className="ct-tile-edit" onClick={() => editStep(t.step)} aria-label={`Edit ${t.title.toLowerCase()}`}>
                    <Icon name="pencil" size={14} />Edit
                  </button>
                </div>
                <p className="ct-tile-title">{t.title}</p>
                <h2 className="ct-tile-headline">{t.headline}</h2>
                {t.details.length > 0 && (t.lines
                  ? <p className="ct-tile-details ct-tile-details--lines">{t.details.map((x, i) => <span key={i}>{x}</span>)}</p>
                  : <p className="ct-tile-details">{t.details.join(" ")}</p>)}
                {t.quote && <blockquote className="ct-tile-quote">&ldquo;{t.quote}&rdquo;</blockquote>}
              </section>
            ))}
          </div>
        </>
      );
      break;

    case "quick":
      body = (
        <>
          {head("Send us a quick request", "Tell us who you are and what you have in mind. We reply with everything in one message.")}
          <div className="ct-row">
            <Field label="First name"><input value={data.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" /></Field>
            <Field label="Last name"><input value={data.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" /></Field>
          </div>
          <div className="ct-row">
            <Field label="Email"><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" /></Field>
            <Field label="Phone / WhatsApp" hint="Include your country code"><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+1 555 123 4567" /></Field>
          </div>
          {data.email && !isEmail(data.email) && <p className="ct-error" role="alert">Please check your email address.</p>}
          <Choice legend="How should we reply?" options={REPLY_VIA} value={data.replyVia} onChange={(v) => set("replyVia", v)} layout="pills" />
          <MultiChoice legend="What is it about?" sub="Optional" options={QUICK_TOPICS} values={data.quickTopics} onToggle={toggleIn("quickTopics")} layout="pills" />
          <Field label="Rough dates" optional><input value={data.quickDates} onChange={(e) => set("quickDates", e.target.value)} placeholder="For example a week in mid June" /></Field>
          <div className="ct-steppers">
            <Stepper label="Number of people" sub="Optional" value={data.quickPeople} min={0} max={50} onChange={(n) => set("quickPeople", n)} />
          </div>
          <Field label="Your message">
            <textarea rows={5} value={data.message} onChange={(e) => set("message", e.target.value)} placeholder="What would you like to do, and anything we should know" />
          </Field>
        </>
      );
      break;

    case "thanks": {
      const sd = sent?.data;
      const viaWhatsApp = sent?.via === "whatsapp";
      const channel = viaWhatsApp ? "on WhatsApp" : "by email";
      const rows: { icon: string; label: string; value: string }[] = [];
      if (sd) {
        const last = cleanText(sd.lastName, 40);
        const fullName = [firstNameOnly(sd.firstName), last.charAt(0).toLocaleUpperCase() + last.slice(1)].filter(Boolean).join(" ");
        if (fullName) rows.push({ icon: "user", label: "Name", value: fullName });
        if (sd.mode === "quick") {
          const topics = sd.quickTopics.map((v) => labelOf(QUICK_TOPICS, v));
          if (topics.length) rows.push({ icon: "compass", label: "About", value: topics.join(", ") });
          if (cleanText(sd.quickDates)) rows.push({ icon: "calendar", label: "Dates", value: cleanText(sd.quickDates) });
          if (sd.quickPeople > 0) rows.push({ icon: "users", label: "Group", value: `${sd.quickPeople} ${sd.quickPeople === 1 ? "person" : "people"}` });
        } else {
          const tiles = buildReviewTiles(sd);
          const pick = (id: StepId) => tiles.find((t) => t.step === id)?.headline ?? "";
          const what = sd.interests.map((v) => labelOf(INTERESTS, v));
          if (what.length) rows.push({ icon: "compass", label: "Interested in", value: what.join(", ") });
          if (pick("dates")) rows.push({ icon: "calendar", label: "Dates", value: pick("dates") });
          if (pick("guests")) rows.push({ icon: "users", label: "Group", value: pick("guests") });
        }
        const contact = viaWhatsApp ? cleanText(sd.phone) : cleanText(sd.email);
        rows.push({ icon: viaWhatsApp ? "message" : "mail", label: "Reply", value: contact ? `${viaWhatsApp ? "WhatsApp" : "Email"}, ${contact}` : viaWhatsApp ? "WhatsApp" : "Email" });
      }
      // TODO: confirm with the team that the first reply always includes options and prices (same wording as the North Sardinia booking steps).
      const next = [
        { icon: "check", title: "We read your request", text: "We go through everything you sent, from your dates to your group.", foot: "Request received" },
        { icon: viaWhatsApp ? "message" : "mail", title: "We reply with a plan", text: `You get one message ${channel} with options and prices for your trip.`, foot: viaWhatsApp ? "Reply on WhatsApp" : "Reply by email" },
        { icon: "calendar", title: "You choose and confirm", text: "Ask anything, change what you like, then confirm when it feels right.", foot: "You decide when" },
      ];
      body = (
        <div className="ct-thanks" ref={thanksRef}>
          <div className="ct-thanks-bg" aria-hidden="true">
            <img src="/contact/sunset-hero.webp" srcSet="/contact/sunset-hero-1200.webp 1200w, /contact/sunset-hero.webp 2400w" sizes="100vw" alt="" decoding="async" />
          </div>
          <div className="ct-thanks-top">
            <div className="ct-thanks-main">
              <p className="ct-thanks-badge" data-ty><span className="ct-thanks-icon"><Icon name="check" size={18} strokeWidth={2.4} /></span>Request sent</p>
              <h1 className="ct-title ct-title--xl" ref={headingRef} tabIndex={-1} data-ty>{sent?.name ? <>Thank you,<br />{sent.name}.</> : "Thank you."}</h1>
              <p className="ct-sub" data-ty>We have your request and will reply {channel}.</p>
              <div className="ct-thanks-actions" data-ty>
                <a className="ct-thanks-home" href="/">Back to the homepage<Icon name="arrowRight" size={18} /></a>
                <button type="button" className="ct-back" onClick={startOver}>Start a new request</button>
              </div>
            </div>
            {rows.length > 0 && (
              <section className="ct-thanks-summary" aria-labelledby="ct-thanks-summary-title" data-ty>
                <h2 id="ct-thanks-summary-title">What you sent us</h2>
                <dl>
                  {rows.map((r) => (
                    <div className="ct-thanks-row" key={r.label}>
                      <span className="ct-thanks-row-icon" aria-hidden="true"><Icon name={r.icon} size={20} /></span>
                      <dt>{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
          <section className="ct-thanks-next" aria-labelledby="ct-thanks-next-title">
            <h2 id="ct-thanks-next-title" data-ty>What happens next</h2>
            <ol className="ct-next" ref={nextListRef}>
              {next.map((n, i) => {
                const on = i === nextOn;
                return (
                  <li key={n.title} className={`ct-next-item${on ? " is-on" : ""}`} data-ty>
                    <button
                      type="button"
                      className="ct-next-card"
                      aria-expanded={on}
                      aria-controls={`ct-next-more-${i}`}
                      onMouseEnter={() => window.matchMedia("(hover: hover)").matches && openNext(i)}
                      onFocus={() => openNext(i)}
                      onClick={() => openNext(i)}
                    >
                      <span className="ct-next-label" aria-hidden="true"><span>{n.title}</span></span>
                      <span className="ct-next-body">
                        <span className="ct-next-head">
                          <span className="ct-next-no">{i + 1}</span>
                          <span className="ct-next-title"><span>{n.title}</span></span>
                          <span className="ct-next-toggle" aria-hidden="true"><Icon name={on ? "minus" : "plus"} size={18} /></span>
                        </span>
                        <span className="ct-next-more" id={`ct-next-more-${i}`}>
                          <span className="ct-next-text"><span>{n.text}</span></span>
                          <span className="ct-next-foot">
                            <span className="ct-next-rule" aria-hidden="true" />
                            <span className="ct-next-foot-row"><span>{n.foot}</span><Icon name={n.icon} size={20} /></span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      );
      break;
    }
  }

  const bar = (
    <div className={`ct-bar${showBar ? "" : " is-hidden"}`} aria-hidden={!showBar}>
      <div className="ct-progress" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        <span style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="ct-bar-inner">
        <button type="button" className="ct-back" onClick={back} tabIndex={showBar ? 0 : -1}>
          {editing ? "Cancel" : "Back"}
        </button>
        <TealButton onClick={next} disabled={!valid || sending}>{nextLabel}</TealButton>
      </div>
    </div>
  );

  return (
    <div className={`ct-wizard${ready ? " is-ready" : ""}${step === "intro" ? " is-intro" : ""}${step === "thanks" ? " is-thanks" : ""}${step === "interests" || step === "quick" ? " has-bg" : ""}`} onKeyDown={onKeyDown}>
      {(step === "interests" || step === "quick") && (
        <div className={`ct-bg ct-bg--${step}`} aria-hidden="true">
          <img src={step === "interests" ? "/experiences/mosaic/tr-mariolu-cliffs.webp" : "/contact/sunset-hero-1200.webp"} alt="" decoding="async" />
        </div>
      )}
      <div className={`ct-stage ct-stage--${step}`} key={step}>
        {step === "intro" || step === "thanks" ? body : step === "review" ? (
          <>
            <div className="ct-head">{headNode}</div>
            {body}
          </>
        ) : (
          <div className="ct-split">
            <div className="ct-head">{headNode}</div>
            <div className="ct-split-body">{body}</div>
          </div>
        )}
      </div>
      {mounted && createPortal(bar, document.body)}
    </div>
  );
}
