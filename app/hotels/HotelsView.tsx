"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { HIcon } from "./icons";
import { Stepper, scrollToEl } from "./ui";
import { AREAS, AMENITY_LABEL, STAY_TYPES, STAYS } from "./hotelsData";
import type { Area, StayType } from "./hotelsData";
import { HotelRequestForm } from "./HotelRequestForm";
import type { SearchSnapshot } from "./HotelRequestForm";

const typeOne = (t: StayType) => STAY_TYPES.find((s) => s.id === t)?.one ?? t;
const where = (a: Area) => (a === "Inland" ? "inland" : `in the ${a}`);



function Kicker({ children }: { children: ReactNode }) {
  return <p className="ht-kicker">{children}</p>;
}

export function HotelsView() {
  // Search panel (draft) and the filters applied to the stay cards.
  const [area, setArea] = useState<Area | "">("");
  const [type, setType] = useState<StayType | "">("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [applied, setApplied] = useState<{ area: Area | ""; type: StayType | "" }>({ area: "", type: "" });
  const [snapshot, setSnapshot] = useState<SearchSnapshot | null>(null);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const [today, setToday] = useState("");

  const guestsRef = useRef<HTMLDivElement>(null);
  const staysRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = new Date();
    setToday(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  // Close the guests panel on outside click or Escape.
  useEffect(() => {
    if (!guestsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setGuestsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGuestsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [guestsOpen]);

  const guestsSummary = `${adults} ${adults === 1 ? "adult" : "adults"}${children ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}, ${rooms} ${rooms === 1 ? "room" : "rooms"}`;

  const visible = useMemo(
    () => STAYS.filter((s) => (!applied.area || s.area === applied.area) && (!applied.type || s.type === applied.type)),
    [applied],
  );

  const resetTrack = () => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  };

  const runSearch = (e?: FormEvent) => {
    e?.preventDefault();
    setGuestsOpen(false);
    setApplied({ area, type });
    setSnapshot({ area, type, checkIn, checkOut, adults, children, rooms, at: Date.now() });
    resetTrack();
    requestAnimationFrame(() => scrollToEl(staysRef.current));
  };

  const pickArea = (a: Area) => {
    const next = applied.area === a ? "" : a;
    setArea(next);
    setApplied((p) => ({ ...p, area: next }));
    setSnapshot({ area: next, type, checkIn, checkOut, adults, children, rooms, at: Date.now() });
    resetTrack();
    if (next) requestAnimationFrame(() => scrollToEl(staysRef.current));
  };

  const clearFilters = () => {
    setArea("");
    setType("");
    setApplied({ area: "", type: "" });
    resetTrack();
  };

  const staysTitle = applied.type
    ? applied.area
      ? `${applied.type} ${where(applied.area)}`
      : applied.type
    : applied.area
      ? `Stays ${where(applied.area)}`
      : "Places to stay";

  /* ---------- carousel: arrows, mouse drag, touch swipe (native) ---------- */
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const updateArrows = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setCanPrev(t.scrollLeft > 4);
    setCanNext(t.scrollLeft + t.clientWidth < t.scrollWidth - 4);
  }, []);
  useEffect(() => {
    // New filter results start at the first card (Chromium would otherwise
    // re-snap to the card that was showing before the list changed).
    const t = trackRef.current;
    if (t) requestAnimationFrame(() => (t.scrollLeft = 0));
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, visible]);

  // One card per click. Snapping is paused during the smooth scroll, because
  // older Safari otherwise snaps one card too far.
  const snapTimer = useRef<number | undefined>(undefined);
  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>(".ht-card");
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    const size = card ? card.offsetWidth + gap : t.clientWidth * 0.8;
    const max = t.scrollWidth - t.clientWidth;
    const target = Math.max(0, Math.min(max, (Math.round(t.scrollLeft / size) + dir) * size));
    t.style.scrollSnapType = "none";
    t.scrollTo({ left: target, behavior: "smooth" });
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      t.style.scrollSnapType = "";
    }, 700);
  };

  // `k` converts screen pixels to the track's own pixels (2 inside the 0.5 site zoom).
  const drag = useRef<{ x: number; left: number; moved: boolean; id: number; k: number } | null>(null);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const t = trackRef.current;
    if (!t) return;
    const w = t.getBoundingClientRect().width;
    drag.current = { x: e.clientX, left: t.scrollLeft, moved: false, id: e.pointerId, k: w > 0 ? t.clientWidth / w : 1 };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const t = trackRef.current;
    if (!d || !t) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      t.classList.add("is-dragging");
      t.setPointerCapture(d.id);
    }
    if (d.moved) t.scrollLeft = d.left - dx * d.k;
  };
  const endDrag = () => {
    const d = drag.current;
    const t = trackRef.current;
    drag.current = null;
    if (!d || !t || !d.moved) return;
    t.classList.remove("is-dragging");
    // Swallow the click that ends a drag so a button under the cursor is not pressed.
    const stop = (ev: MouseEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    t.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(() => t.removeEventListener("click", stop, { capture: true }), 0);
  };

  const toggleSaved = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="ht-page">
      {/* 1. Hero with the search panel */}
      <section className="ht-hero" aria-labelledby="ht-hero-title">
        <div className="ht-hero-media" aria-hidden="true">
          <img src="/hotels/hero-beach-terrace.webp" alt="" decoding="async" fetchPriority="high" />
          <div className="ht-hero-shade" />
        </div>
        <div className="ht-hero-inner">
          <div className="ht-hero-copy">
            <Kicker>Hotels and stays</Kicker>
            <h1 id="ht-hero-title" className="ht-title ht-title--xl">
              Find a place to stay in Sardinia
            </h1>
            <p className="ht-lead ht-hero-lead">
              Hotels, villas, apartments and farm stays in every part of the island. Choose an area and your dates, and we check what is free for you.
            </p>
          </div>

          <form className="ht-search" role="search" aria-label="Search stays" onSubmit={runSearch}>
            <div className="ht-search-fields">
              <label className="ht-sf">
                <span className="ht-sf-label">Area</span>
                <span className="ht-sf-box">
                  <HIcon name="pin" size={20} />
                  <select value={area} onChange={(e) => setArea(e.target.value as Area | "")} aria-label="Area">
                    <option value="">Any area</option>
                    {AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id}
                      </option>
                    ))}
                  </select>
                  <span className="ht-sf-chev"><HIcon name="chevronDown" size={18} /></span>
                </span>
              </label>

              <div className="ht-sf" role="group" aria-labelledby="ht-dates-label">
                <span className="ht-sf-label" id="ht-dates-label">Check in and check out</span>
                <span className="ht-sf-box ht-sf-dates">
                  <HIcon name="calendar" size={20} />
                  <input
                    type="date"
                    aria-label="Check in"
                    value={checkIn}
                    min={today || undefined}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value && checkOut <= e.target.value) setCheckOut("");
                    }}
                  />
                  <span className="ht-sf-sep" aria-hidden="true">to</span>
                  <input type="date" aria-label="Check out" value={checkOut} min={checkIn || today || undefined} onChange={(e) => setCheckOut(e.target.value)} />
                </span>
              </div>

              <div className="ht-sf ht-sf--guests" ref={guestsRef}>
                <span className="ht-sf-label" id="ht-guests-label">Guests and rooms</span>
                <button
                  type="button"
                  className="ht-sf-box ht-sf-btn"
                  aria-haspopup="dialog"
                  aria-expanded={guestsOpen}
                  aria-labelledby="ht-guests-label ht-guests-value"
                  onClick={() => setGuestsOpen((o) => !o)}
                >
                  <HIcon name="users" size={20} />
                  <span id="ht-guests-value" className="ht-sf-value">{guestsSummary}</span>
                  <span className="ht-sf-chev"><HIcon name="chevronDown" size={18} /></span>
                </button>
                {guestsOpen && (
                  <div className="ht-guests" role="dialog" aria-label="Guests and rooms">
                    <div className="ct-steppers">
                      <Stepper label="Adults" sub="13 and older" value={adults} min={1} max={16} onChange={setAdults} />
                      <Stepper label="Children" sub="Up to 12" value={children} min={0} max={10} onChange={setChildren} />
                      <Stepper label="Rooms" value={rooms} min={1} max={8} onChange={setRooms} />
                    </div>
                    <button type="button" className="ht-guests-done" onClick={() => setGuestsOpen(false)}>
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="ht-search-foot">
              <div className="ht-filter" role="group" aria-label="Type of stay">
                <span className="ht-filter-label" aria-hidden="true">Filter</span>
                {STAY_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`ht-fpill${type === t.id ? " is-on" : ""}`}
                    aria-pressed={type === t.id}
                    onClick={() => setType((cur) => (cur === t.id ? "" : t.id))}
                  >
                    {t.id}
                  </button>
                ))}
              </div>
              <button type="submit" className="ht-search-btn">
                <HIcon name="search" size={18} />
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Areas */}
      <section className="ht-section" id="areas" aria-labelledby="ht-areas-title">
        <div className="ht-inner">
          <div className="ht-head">
            <div>
              <Kicker>Areas</Kicker>
              <h2 id="ht-areas-title" className="ht-title">
                Discover <span className="ht-title-muted">your area</span>
              </h2>
            </div>
            <p className="ht-lead">Five parts of the island, each with its own pace. Choose one to see the stays there.</p>
          </div>
          <div className="ht-areas" role="list">
            {AREAS.map((a) => (
              <div key={a.id} role="listitem" className="ht-area-item">
                <button
                  type="button"
                  className={`ht-area${applied.area === a.id ? " is-on" : ""}`}
                  aria-pressed={applied.area === a.id}
                  onClick={() => pickArea(a.id)}
                >
                  <img className="ht-area-img" src={a.img} alt="" loading="lazy" decoding="async" style={a.pos ? { objectPosition: a.pos } : undefined} />
                  <span className="ht-area-shade" aria-hidden="true" />
                  <span className="ht-area-body">
                    <span className="ht-area-text">
                      <span className="ht-area-label" aria-hidden="true">{a.id}</span>
                      <span className="ht-area-name">{a.id}</span>
                      <span className="ht-area-desc">{a.text}</span>
                    </span>
                    <span className="ht-area-arrow" aria-hidden="true">
                      <HIcon name="arrowRight" size={18} />
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stays carousel (example content, see hotelsData.ts) */}
      <section className="ht-section ht-stays" id="stays" ref={staysRef} aria-labelledby="ht-stays-title">
        <div className="ht-inner">
          <div className="ht-head ht-head--stays">
            <div>
              <h2 id="ht-stays-title" className="ht-title">{staysTitle}</h2>
            </div>
            <div className="ht-stays-side">
              <div className="ht-stays-tools">
                {(applied.area || applied.type) && (
                  <button type="button" className="ht-clear" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
                <div className="ht-arrows">
                  <button type="button" className="ht-arrow" aria-label="Previous stays" disabled={!canPrev || !visible.length} onClick={() => step(-1)}>
                    <HIcon name="arrowLeft" size={20} />
                  </button>
                  <button type="button" className="ht-arrow" aria-label="Next stays" disabled={!canNext || !visible.length} onClick={() => step(1)}>
                    <HIcon name="arrowRight" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {visible.length ? (
          <div
            className="ht-track"
            ref={trackRef}
            role="list"
            aria-label={staysTitle}
            onScroll={updateArrows}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(e) => e.preventDefault()}
          >
            {visible.map((s) => (
              <article className="ht-card" role="listitem" key={s.id} aria-label={s.name}>
                <img className="ht-card-img" src={s.img} alt="" loading="lazy" decoding="async" draggable={false} style={s.pos ? { objectPosition: s.pos } : undefined} />
                <div className="ht-card-shade" aria-hidden="true" />
                <div className="ht-card-top">
                  <button
                    type="button"
                    className={`ht-heart${saved.has(s.id) ? " is-on" : ""}`}
                    aria-pressed={saved.has(s.id)}
                    aria-label={`Save ${s.name}`}
                    onClick={() => toggleSaved(s.id)}
                  >
                    <HIcon name="heart" size={18} />
                  </button>
                </div>
                <div className="ht-card-body">
                  <h3 className="ht-card-title">{s.name}</h3>
                  <p className="ht-card-meta">
                    <HIcon name="pin" size={16} />
                    {typeOne(s.type)}, {s.area}
                  </p>
                  <p className="ht-card-text">{s.text}</p>
                  <ul className="ht-amen" aria-label="Amenities">
                    {s.amenities.map((a) => (
                      <li key={a}>
                        <HIcon name={a} size={16} />
                        {AMENITY_LABEL[a]}
                      </li>
                    ))}
                  </ul>
                  <p className="ht-price">
                    <span className="ht-price-from">from</span>
                    <strong>€{s.from}</strong>
                    <span className="ht-price-night">/night</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ht-inner">
            <div className="ht-empty">
              <p>No example stays match these filters yet. Send us a request and we look for real options for you.</p>
              <div className="ht-empty-actions">
                <button type="button" className="ht-clear" onClick={clearFilters}>
                  Clear filters
                </button>
                <button type="button" className="ht-clear ht-clear--solid" onClick={() => scrollToEl(document.getElementById("request"))}>
                  Request a stay
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. How booking works */}
      <section className="ht-section" id="how-booking-works" aria-labelledby="ht-how-title">
        <div className="ht-inner">
          <div className="ht-head">
            <div>
              <Kicker>Booking</Kicker>
              <h2 id="ht-how-title" className="ht-title">How booking works</h2>
            </div>
          </div>
          <ol className="ht-steps">
            {[
              { icon: "bed", title: "Choose a stay", text: "Pick a stay you like, or tell us the area, dates and budget you have in mind." },
              { icon: "calendarCheck", title: "We check availability", text: "We contact the places that fit and come back with real prices for your dates." },
              { icon: "checkCircle", title: "You confirm", text: "You choose the option you want, and we book it and send you every detail." },
            ].map((s) => (
              <li className="ht-step" key={s.title}>
                <span className="ht-step-top">
                  <span className="ht-step-badge"><HIcon name={s.icon} size={26} /></span>
                </span>
                <h3 className="ht-step-title">{s.title}</h3>
                <p className="ht-step-text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Request form */}
      <HotelRequestForm snapshot={snapshot} today={today} />
    </div>
  );
}
