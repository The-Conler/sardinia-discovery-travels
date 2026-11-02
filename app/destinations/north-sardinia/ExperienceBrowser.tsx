"use client";
import { useState, useEffect, useLayoutEffect, useCallback, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { siteZoom } from "../../siteZoom";

type Experience = { title: string; image: string; text: string };
import type { Highlight, PerkIconKind } from "./highlights";

const iconProps = {
  className: "north-hot-icon",
  viewBox: "0 0 24 24",
  width: 16,
  height: 16,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Real icons from the Lucide icon set (ISC-licensed), inlined verbatim.
function UsersIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PerkIcon({ kind }: { kind: PerkIconKind }) {
  if (kind === "wine") {
    return (
      <svg {...iconProps}>
        <path d="M8 22h8" />
        <path d="M7 10h10" />
        <path d="M12 15v7" />
        <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-1-8H8c-.5 4-1 6-1 8a5 5 0 0 0 5 5Z" />
      </svg>
    );
  }
  if (kind === "drink") {
    return (
      <svg {...iconProps}>
        <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" />
        <path d="M5 8h14" />
        <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
        <path d="m12 8 1-6h2" />
      </svg>
    );
  }
  if (kind === "snorkel") {
    return (
      <svg {...iconProps}>
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }
  if (kind === "basket") {
    return (
      <svg {...iconProps}>
        <path d="m15 11-1 9" />
        <path d="m19 11-4-7" />
        <path d="M2 11h20" />
        <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
        <path d="M4.5 15.5h15" />
        <path d="m5 11 4-7" />
        <path d="m9 11 1 9" />
      </svg>
    );
  }
  if (kind === "luggage") {
    return (
      <svg {...iconProps}>
        <path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
        <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" />
        <path d="M10 20h4" />
        <circle cx="16" cy="20" r="2" />
        <circle cx="8" cy="20" r="2" />
      </svg>
    );
  }
  if (kind === "breakfast") {
    return (
      <svg {...iconProps}>
        <path d="M10 2v2" />
        <path d="M14 2v2" />
        <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
        <path d="M6 2v2" />
      </svg>
    );
  }
  if (kind === "gear") {
    return (
      <svg {...iconProps}>
        <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
        <path d="M8 10h8" />
      </svg>
    );
  }
  return (
    <svg {...iconProps}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function CatIcon({ name }: { name: string }) {
  const p = { className: "north-cat-icon", viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "4×4 Tours":
      return <svg {...p}><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>;
    case "Boat Rentals":
      return <svg {...p}><path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" /><path d="M21 14 10 2 3 14h18Z" /><path d="M10 2v16" /></svg>;
    case "Cooking Classes":
      return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
    case "Hotels":
      return <svg {...p}><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>;
    case "Private Transfers":
      return <svg {...p}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>;
    case "Wine Tasting":
      return <svg {...p}><path d="M8 22h8" /><path d="M7 10h10" /><path d="M12 15v7" /><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-1-8H8c-.5 4-1 6-1 8a5 5 0 0 0 5 5Z" /></svg>;
    default: // Highlights
      return <svg {...p}><path d="M11.5 2.3a.5.5 0 0 1 .9 0l2.3 4.7a2 2 0 0 0 1.5 1.1l5.2.8a.5.5 0 0 1 .3.9l-3.7 3.6a2 2 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2 2 0 0 0-2 0L6.4 21a.5.5 0 0 1-.8-.6l.9-5.1a2 2 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2 2 0 0 0 1.6-1.1z" /></svg>;
  }
}

function HeartIcon() {
  return (
    <svg className="north-heart-icon" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function Lightbox({ images, index, onClose, onNav }: { images: string[]; index: number; onClose: () => void; onNav: (dir: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNav(1);
      else if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);
  return createPortal(
    <div className="north-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="north-lightbox-close" onClick={onClose} aria-label="Close">×</button>
      <button type="button" className="north-lightbox-nav prev" onClick={e => { e.stopPropagation(); onNav(-1); }} aria-label="Previous image">‹</button>
      <img className="north-lightbox-img" src={images[index]} alt="" onClick={e => e.stopPropagation()} />
      <button type="button" className="north-lightbox-nav next" onClick={e => { e.stopPropagation(); onNav(1); }} aria-label="Next image">›</button>
      <div className="north-lightbox-count">{index + 1} / {images.length}</div>
    </div>,
    document.body,
  );
}

// Small line icons from the Lucide set (ISC licence), inlined.
const lineProps = { viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
type LineName = "arrow" | "left" | "right" | "clock" | "timer" | "users" | "pin" | "globe" | "check-circle" | "undo" | "calendar" | "check";
function Line({ name, className }: { name: LineName; className?: string }) {
  const p = { ...lineProps, className };
  switch (name) {
    case "arrow": return <svg {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
    case "left": return <svg {...p}><path d="m15 18-6-6 6-6" /></svg>;
    case "right": return <svg {...p}><path d="m9 18 6-6-6-6" /></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
    case "timer": return <svg {...p}><path d="M10 2h4" /><path d="m12 14 3-3" /><circle cx="12" cy="14" r="8" /></svg>;
    case "users": return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "pin": return <svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "globe": return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>;
    case "check-circle": return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
    case "undo": return <svg {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
    case "calendar": return <svg {...p}><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>;
    default: return <svg {...p}><path d="M20 6 9 17l-5-5" /></svg>;
  }
}

function SplitCard({ h, active, saved, onSelect, onToggleSave }: { h: Highlight; active: boolean; saved: boolean; onSelect: (h: Highlight) => void; onToggleSave: (title: string) => void }) {
  return (
    <article data-flip={h.title} className={`north-split-card${active ? " is-active" : ""}`}>
      <img src={h.image} alt="" loading="lazy" decoding="async" />
      <div className="north-split-shade" />
      {/* The whole card selects it; the heart sits above this button. */}
      <button type="button" className="north-split-open" aria-pressed={active} aria-label={`${h.title}, show details`} onClick={() => onSelect(h)} />
      <span className="north-hot-tag"><CatIcon name={h.category} /> {h.category}</span>
      <button type="button" className={`north-hot-heart${saved ? " is-saved" : ""}`} aria-pressed={saved} aria-label={saved ? `Remove ${h.title} from saved` : `Save ${h.title}`} onClick={() => onToggleSave(h.title)}>
        <HeartIcon />
      </button>
      <div className="north-split-copy">
        <h3>{h.title}</h3>
        <p className="north-split-price">From <strong>€{h.price}</strong> {h.unit}</p>
      </div>
      <span className="north-split-go" aria-hidden="true"><Line name="arrow" /></span>
    </article>
  );
}

type Tab = "itinerary" | "included" | "gallery" | "see";

function DetailPanel({ h, sheet, onClose, ghost }: { h: Highlight; sheet?: boolean; onClose?: () => void; ghost?: string | null }) {
  const d = h.detail;
  const n = d.gallery.length;
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<Tab>("itinerary");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const step = (dir: number) => setSlide(i => (i + dir + n) % n);
  const nav = (dir: number) => setLightbox(i => (i === null ? i : (i + dir + n) % n));
  const tabs: [Tab, string][] = [["itinerary", "Itinerary"], ["included", "What's included"], ["gallery", "Gallery"], ["see", "What you'll see"]];
  return (
    <aside className={`nsp${sheet ? " is-sheet" : ""}`} aria-label={`${h.title} details`}>
      {onClose && (
        <button type="button" className="nsp-close" onClick={onClose} aria-label={`Close details for ${h.title}`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      )}
      <div className="nsp-top">
        <div className="nsp-carousel">
          <button type="button" className="nsp-slide" onClick={() => setLightbox(slide)} aria-label={`Open photo ${slide + 1} of ${n}`}>
            {d.gallery.map((src, i) => <img key={src + i} src={src} alt="" className={i === slide ? "is-on" : ""} loading={i === 0 ? "eager" : "lazy"} decoding="async" />)}
            {/* The previous card's photo, faded out over the new one (crossfade). */}
            {ghost && <img src={ghost} alt="" className="nsp-ghost" />}
          </button>
          {n > 1 && <>
            <button type="button" className="nsp-arrow prev" onClick={() => step(-1)} aria-label="Previous photo"><Line name="left" /></button>
            <button type="button" className="nsp-arrow next" onClick={() => step(1)} aria-label="Next photo"><Line name="right" /></button>
          </>}
          <span className="nsp-count" aria-live="polite">{slide + 1} / {n}</span>
        </div>
        <div className="nsp-intro">
          {/* No star rating: the ratings in highlights.ts are sample data, not real reviews. */}
          <h3 data-anim className="nsp-title">{h.title}</h3>
          <p data-anim className="nsp-cat">{h.category}</p>
          <p data-anim className="nsp-summary">{d.summary}</p>
          <dl className="nsp-facts">
            <div data-anim><dt><Line name="timer" /> Duration</dt><dd>{d.duration}</dd></div>
            <div data-anim><dt><Line name="clock" /> Start times</dt><dd>{d.times.join(" · ")}</dd></div>
            <div data-anim><dt><Line name="users" /> Group size</dt><dd>Max {h.maxGuests}</dd></div>
          </dl>
        </div>
      </div>
      <div data-anim className="nsp-tabs" role="tablist" aria-label="Experience details">
        {tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className="nsp-tab" onClick={() => setTab(id)}>{label}</button>)}
      </div>
      <div className="nsp-mid">
        <div data-anim className="nsp-tabbody" key={tab}>
          {tab === "itinerary" && (
            <ol className="nsp-timeline">
              {d.itinerary.map((s, i) => (
                <li key={i}><span className="t">{s.time}</span><span className="dot" aria-hidden="true" /><div className="c"><strong>{s.title}</strong><p>{s.text}</p></div></li>
              ))}
            </ol>
          )}
          {tab === "included" && <ul className="nsp-list">{d.included.map(item => <li key={item}><Line name="check" /> {item}</li>)}</ul>}
          {tab === "gallery" && (
            <div className="nsp-gallery">
              {d.gallery.map((src, i) => <button type="button" key={src + i} onClick={() => setLightbox(i)} aria-label={`Open photo ${i + 1} of ${n}`}><img src={src} alt="" loading="lazy" /></button>)}
            </div>
          )}
          {tab === "see" && <ul className="nsp-list">{d.highlights.map(item => <li key={item}><Line name="pin" /> {item}</li>)}</ul>}
        </div>
        <div data-anim className="nsp-notes">
          <h4>Good to know</h4>
          {/* TODO(policies): languages, confirmation and cancellation terms are
              example text, not confirmed with partners. Same for the three
              check items in the bottom bar. */}
          <dl>
            <div><dt><Line name="pin" /> Departure</dt><dd>{d.meetingPoint}</dd></div>
            <div><dt><Line name="globe" /> Languages</dt><dd>English and Italian</dd></div>
            <div><dt><Line name="check-circle" /> Confirmation</dt><dd>Within 24 hours</dd></div>
            <div><dt><Line name="undo" /> Cancellation</dt><dd>Free up to 24 hours before</dd></div>
          </dl>
        </div>
      </div>
      <div data-anim className="nsp-foot">
        {/* TODO(booking): there is no booking flow yet, so both buttons go to the contact page. */}
        <a className="nsp-reserve" href="/contact">Reserve now <Line name="arrow" /></a>
        <a className="nsp-avail" href="/contact"><Line name="calendar" /> View availability</a>
        <ul className="nsp-checks">
          <li><Line name="check" /> Free cancellation up to 24 hours before</li>
          <li><Line name="check" /> Confirmation within 24 hours</li>
          <li><Line name="check" /> Reserve now, pay later</li>
        </ul>
      </div>
      {lightbox !== null && typeof document !== "undefined" && <Lightbox images={d.gallery} index={lightbox} onClose={() => setLightbox(null)} onNav={nav} />}
    </aside>
  );
}

// gsap and ScrollSmoother are loaded globally (app/layout.tsx); read them
// through a cast so this file does not redeclare the Window types.
type Tween = { kill: () => void };
type GsapSet = (t: unknown, v: Record<string, unknown>) => void;
type GsapLite = {
  to: (t: unknown, v: Record<string, unknown>) => Tween;
  fromTo: (t: unknown, a: Record<string, unknown>, b: Record<string, unknown>) => Tween;
  killTweensOf: (t: unknown) => void;
  set: GsapSet;
};
type Smoother = { paused: (v?: boolean) => boolean };
const getGsap = () => (typeof window === "undefined" ? undefined : (window as unknown as { gsap?: GsapLite }).gsap);
const getSmoother = () => (typeof window === "undefined" ? undefined : (window as unknown as { ScrollSmoother?: { get: () => Smoother | undefined } }).ScrollSmoother?.get());
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Phone and tablet: the detail opens as a bottom sheet that slides up.
function DetailSheet({ h, closing, onClosed, onRequestClose }: { h: Highlight; closing: boolean; onClosed: () => void; onRequestClose: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const g = getGsap();
    if (!g || reducedMotion()) return;
    g.fromTo(backRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    g.fromTo(bodyRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
  }, []);
  useEffect(() => {
    if (!closing) return;
    const g = getGsap();
    if (!g || reducedMotion()) { onClosed(); return; }
    g.to(backRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.in" });
    g.to(bodyRef.current, { yPercent: 100, duration: 0.45, ease: "power3.in", onComplete: onClosed });
  }, [closing, onClosed]);
  // Swipe down to close: only when the sheet is scrolled to its top.
  const closeRef = useRef(onRequestClose);
  closeRef.current = onRequestClose;
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let y0 = 0, dy = 0, active = false;
    const inside = (e: TouchEvent) => e.target instanceof Node && body.contains(e.target);
    const start = (e: TouchEvent) => { if (!inside(e)) return; active = body.scrollTop <= 0; y0 = e.touches[0]?.clientY ?? 0; dy = 0; };
    const move = (e: TouchEvent) => {
      if (!active) return;
      dy = Math.max(0, (e.touches[0]?.clientY ?? y0) - y0);
      body.style.transform = dy > 0 ? `translateY(${dy}px)` : "";
    };
    const end = () => {
      if (!active) return;
      active = false;
      if (dy > 90) { closeRef.current(); return; }
      const g = getGsap();
      if (dy > 0 && g && !reducedMotion()) g.to(body, { y: 0, duration: 0.4, ease: "power3.out", onComplete: () => { body.style.transform = ""; } });
      else body.style.transform = "";
    };
    // Window, capture phase: the page's smooth scroller stops touch events
    // from bubbling, so listeners on the sheet itself never hear them.
    const opts = { capture: true, passive: true } as const;
    window.addEventListener("touchstart", start, opts);
    window.addEventListener("touchmove", move, opts);
    window.addEventListener("touchend", end, true);
    window.addEventListener("touchcancel", end, true);
    return () => {
      window.removeEventListener("touchstart", start, opts);
      window.removeEventListener("touchmove", move, opts);
      window.removeEventListener("touchend", end, true);
      window.removeEventListener("touchcancel", end, true);
    };
  }, []);
  return createPortal(
    <div className="north-sheet" role="dialog" aria-modal="true" aria-label={`${h.title} details`}>
      <div className="north-sheet-backdrop" ref={backRef} onClick={onRequestClose} />
      <div className="north-sheet-body" ref={bodyRef}>
        <DetailPanel h={h} sheet onClose={onRequestClose} />
      </div>
    </div>,
    document.body,
  );
}

export function ExperienceBrowser({ experiences, highlights, heading }: { experiences: Experience[]; highlights: Highlight[]; heading?: ReactNode }) {
  const [category, setCategory] = useState("Highlights");
  const isHighlights = category === "Highlights";
  // "Highlights" shows every card (featured ones first, in data order); a category pill shows every product in it.
  const listFor = (cat: string) => (cat === "Highlights" ? [...highlights.filter(h => h.featured), ...highlights.filter(h => !h.featured)] : highlights.filter(h => h.category === cat));
  const visible = listFor(category);
  const count = visible.length;
  // Nothing is selected on load: the cards use the full width and the panel is closed.
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(undefined);
  const selected = visible.find(h => h.title === selectedTitle);
  // Desktop panel content: `shownTitle` trails `selectedTitle` by the fade-out.
  const [shownTitle, setShownTitle] = useState<string | undefined>(undefined);
  const shown = highlights.find(h => h.title === shownTitle);
  const paneOpen = !!shown;
  const [ghost, setGhost] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const toggleSave = (title: string) => setSaved(list => (list.includes(title) ? list.filter(t => t !== title) : [...list, title]));
  const listRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const latest = useRef(selected?.title);
  latest.current = selected?.title;
  const fromHeight = useRef<number | null>(null);
  const outTween = useRef<Tween | null>(null);
  const flipFrom = useRef<Map<string, DOMRect> | null>(null);
  const returnFocus = useRef<string | undefined>(undefined);

  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
  const cards = () => Array.from(document.querySelectorAll<HTMLElement>(".north-split [data-flip]"));
  // FLIP, step 1: remember where every card is before the grid changes.
  const captureRects = () => {
    const m = new Map<string, DOMRect>();
    cards().forEach(n => m.set(n.getAttribute("data-flip")!, n.getBoundingClientRect()));
    flipFrom.current = m;
  };
  const focusCard = (title?: string) => {
    if (!title) return;
    const card = cards().find(n => n.getAttribute("data-flip") === title);
    card?.querySelector<HTMLButtonElement>(".north-split-open")?.focus({ preventScroll: true });
  };

  const closeDetail = () => {
    const g = getGsap();
    const el = paneRef.current;
    returnFocus.current = selectedTitle;
    outTween.current?.kill();
    const finish = () => {
      captureRects();
      setSelectedTitle(undefined);
      setShownTitle(undefined);
      setGhost(null);
      requestAnimationFrame(() => focusCard(returnFocus.current));
    };
    if (!g || !el || reducedMotion()) { flipFrom.current = null; setSelectedTitle(undefined); setShownTitle(undefined); setGhost(null); requestAnimationFrame(() => focusCard(returnFocus.current)); return; }
    outTween.current = g.to(el, { autoAlpha: 0, x: 40, duration: 0.35, ease: "power2.in", onComplete: finish });
  };

  const pickCategory = (next: string) => {
    setCategory(next);
    const list = listFor(next);
    if (selectedTitle && !list.some(h => h.title === selectedTitle)) setSelectedTitle(list[0]?.title);
    listRef.current?.scrollTo({ top: 0, left: 0 });
  };
  const selectCard = (h: Highlight) => {
    if (!isDesktop()) {
      // Phone and tablet: the details open as a bottom sheet.
      setSelectedTitle(h.title);
      setSheetClosing(false);
      setSheetOpen(true);
      return;
    }
    if (paneOpen && h.title === selectedTitle) { closeDetail(); return; } // second click closes
    if (!paneOpen && !reducedMotion()) captureRects();
    setSelectedTitle(h.title);
  };
  const closeSheet = () => { returnFocus.current = latest.current; setSheetClosing(true); };
  const sheetClosed = useCallback(() => {
    setSheetOpen(false);
    setSheetClosing(false);
    setSelectedTitle(undefined);
    requestAnimationFrame(() => focusCard(returnFocus.current));
  }, []);

  // Panel swap, step 1: fade the current content out, then switch.
  const target = selected?.title;
  useEffect(() => {
    if (!target || target === shownTitle || !isDesktop()) return;
    const g = getGsap();
    const el = paneRef.current;
    outTween.current?.kill();
    if (!g || !el || el.offsetParent === null || reducedMotion()) { setShownTitle(target); return; }
    const parts = el.querySelectorAll("[data-anim]");
    const current = el.querySelector<HTMLImageElement>(".nsp-slide img.is-on");
    fromHeight.current = el.offsetHeight;
    outTween.current = g.to(parts, {
      autoAlpha: 0, y: -6, duration: 0.2, ease: "power2.in",
      onComplete: () => { setGhost(current?.getAttribute("src") ?? null); setShownTitle(latest.current); },
    });
  }, [target, shownTitle]);
  // Step 2 (before paint): animate the height and stagger the new lines in.
  useLayoutEffect(() => {
    const g = getGsap();
    const el = paneRef.current;
    if (!g || !el || fromHeight.current === null) return;
    const from = fromHeight.current;
    fromHeight.current = null;
    const to = el.offsetHeight;
    if (Math.abs(to - from) > 1) g.fromTo(el, { height: from }, { height: to, duration: 0.65, ease: "power3.out", clearProps: "height" });
    g.fromTo(el.querySelectorAll("[data-anim]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.04, clearProps: "transform,opacity,visibility" });
    const gh = el.querySelector(".nsp-ghost");
    if (gh) g.to(gh, { autoAlpha: 0, duration: 0.6, ease: "power2.out", onComplete: () => setGhost(null) });
  }, [shownTitle]);

  // Open / close (before paint): FLIP the cards between 4 and 2 columns and
  // slide the panel in from the right.
  useLayoutEffect(() => {
    const g = getGsap();
    const from = flipFrom.current;
    flipFrom.current = null;
    if (!g || reducedMotion()) return;
    if (from) {
      const z = siteZoom();
      cards().forEach(n => {
        const prev = from.get(n.getAttribute("data-flip")!);
        if (!prev) return;
        const nx = n.getBoundingClientRect();
        const dx = (prev.left - nx.left) / z;
        const dy = (prev.top - nx.top) / z;
        const sx = nx.width ? prev.width / nx.width : 1;
        const sy = nx.height ? prev.height / nx.height : 1;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
        g.fromTo(n, { x: dx, y: dy, scaleX: sx, scaleY: sy, transformOrigin: "0 0" }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.75, ease: "power3.out", clearProps: "transform,transformOrigin" });
      });
    }
    const el = paneRef.current;
    if (paneOpen && el) {
      g.fromTo(el, { autoAlpha: 0, x: 48 }, { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.06, clearProps: "transform,opacity,visibility" });
      g.fromTo(el.querySelectorAll("[data-anim]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.16, stagger: 0.04, clearProps: "transform,opacity,visibility" });
    }
  }, [paneOpen]);

  // Desktop: Escape closes the panel (unless the photo lightbox is open; it closes first).
  useEffect(() => {
    if (!paneOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || document.querySelector(".north-lightbox")) return;
      closeDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Sheet: lock page scroll, close on Escape or when the window grows to desktop.
  useEffect(() => {
    if (!sheetOpen) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const smoother = getSmoother();
    smoother?.paused(true);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !document.querySelector(".north-lightbox")) { returnFocus.current = latest.current; setSheetClosing(true); } };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => { if (mq.matches) sheetClosed(); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      root.style.overflow = prev;
      smoother?.paused(false);
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [sheetOpen, sheetClosed]);

  return <div className="north-browser north-split" id="north-experiences">
    <div className="north-split-top">
      {heading}
      <div className="north-categories" role="group" aria-label="Experience categories">
        <button type="button" className="north-category north-category-highlight" aria-pressed={isHighlights} onClick={() => pickCategory("Highlights")}>
          <CatIcon name="Highlights" />
          <span className="north-category-label"><span>Highlights</span></span>
        </button>
        {experiences.map((item, index) => <button type="button" className={`north-category north-category-${index}`} key={item.title} aria-pressed={category === item.title} onClick={() => pickCategory(item.title)}>
          <CatIcon name={item.title} />
          <span className="north-category-label"><span>{item.title}</span></span>
        </button>)}
      </div>
    </div>
    <div className={`north-split-body${paneOpen ? " is-open" : ""}`}>
      <div className="north-split-left">
        <div className="north-split-left-inner">
          <div className="north-results-heading">
            <h2>{isHighlights ? "Our highlights" : category}</h2>
            <p className="sr-only" role="status" aria-live="polite">{count} {count === 1 ? "experience" : "experiences"}</p>
            <a className="north-view-all" href="/#experiences">View all experiences <span aria-hidden="true">→</span></a>
          </div>
          <div className="north-split-list" ref={listRef} key={category}>
            {visible.map(h => <SplitCard key={h.title} h={h} active={(paneOpen || sheetOpen) && selected?.title === h.title} saved={saved.includes(h.title)} onSelect={selectCard} onToggleSave={toggleSave} />)}
          </div>
        </div>
      </div>
      {shown && (
        <div className="nsp-pane" ref={paneRef}>
          <DetailPanel key={shown.title} h={shown} ghost={ghost} onClose={closeDetail} />
        </div>
      )}
    </div>
    {sheetOpen && selected && typeof document !== "undefined" && <DetailSheet key={selected.title} h={selected} closing={sheetClosing} onClosed={sheetClosed} onRequestClose={closeSheet} />}
  </div>;
}
