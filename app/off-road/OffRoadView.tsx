"use client";

// Off road page. Same layout, components and motion as the hotels page
// (app/hotels/HotelsView.tsx), adapted to 4x4 tours.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { HIcon } from "../hotels/icons";
import { Stepper, scrollToEl } from "../hotels/ui";
import { AREAS, INCLUDED, PHOTO_CREDITS, TOUR_GROUPS, TOUR_KINDS, TOURS } from "./offRoadData";
import type { Area, TourGroup, TourKind } from "./offRoadData";
import { OffRoadRequestForm } from "./OffRoadRequestForm";
import { TourCard, useSavedTours } from "./TourCard";
import type { SearchSnapshot } from "./OffRoadRequestForm";

function Kicker({ children }: { children: ReactNode }) {
  return <p className="ht-kicker">{children}</p>;
}

export function OffRoadView() {
  const [area, setArea] = useState<Area | "">("");
  const [kind, setKind] = useState<TourKind | "">("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [applied, setApplied] = useState<{ area: Area | ""; kind: TourKind | "" }>({ area: "", kind: "" });
  const [group, setGroup] = useState<TourGroup | "">("");
  const [snapshot, setSnapshot] = useState<SearchSnapshot | null>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const { saved, toggle: toggleSaved } = useSavedTours();
  const [today, setToday] = useState("");

  const groupRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = new Date();
    setToday(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!groupOpen) return;
    const onDown = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setGroupOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGroupOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [groupOpen]);

  const groupSummary = `${adults} ${adults === 1 ? "adult" : "adults"}${children ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}`;

  const visible = useMemo(
    () => TOURS.filter((t) => (!group || t.group === group) && (!applied.area || t.area === applied.area) && (!applied.kind || t.kind === applied.kind)),
    [applied, group],
  );

  const resetTrack = () => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  };

  const runSearch = (e?: FormEvent) => {
    e?.preventDefault();
    setGroupOpen(false);
    setApplied({ area, kind });
    setSnapshot({ area, kind, date, adults, children, tour: "", at: Date.now() });
    resetTrack();
    requestAnimationFrame(() => scrollToEl(toursRef.current));
  };

  const pickArea = (a: Area) => {
    const next = applied.area === a ? "" : a;
    setArea(next);
    setApplied((p) => ({ ...p, area: next }));
    setSnapshot({ area: next, kind, date, adults, children, tour: "", at: Date.now() });
    resetTrack();
    if (next) requestAnimationFrame(() => scrollToEl(toursRef.current));
  };

  const clearFilters = () => {
    setGroup("");
    setArea("");
    setKind("");
    setApplied({ area: "", kind: "" });
    resetTrack();
  };

  const toursTitle = group && !applied.kind && !applied.area
    ? group
    : applied.kind
    ? applied.area
      ? `${applied.kind} tours in ${applied.area}`
      : `${applied.kind} tours`
    : applied.area
      ? `Tours in ${applied.area}`
      : "Off road tours";

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
    const t = trackRef.current;
    if (t) requestAnimationFrame(() => (t.scrollLeft = 0));
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, visible]);

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
    const stop = (ev: MouseEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    t.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(() => t.removeEventListener("click", stop, { capture: true }), 0);
  };

  return (
    <div className="ht-page or-page">
      {/* 1. Hero with the search panel */}
      <section className="ht-hero" aria-labelledby="ht-hero-title">
        <div className="ht-hero-media" aria-hidden="true">
          <img src="/off-road/hero-supramonte-track.webp" alt="" decoding="async" fetchPriority="high" />
          <div className="ht-hero-shade" />
        </div>
        <div className="ht-hero-inner">
          <div className="ht-hero-copy">
            <Kicker>Off road</Kicker>
            <h1 id="ht-hero-title" className="ht-title ht-title--xl">
              Sardinia by 4x4
            </h1>
            <p className="ht-lead ht-hero-lead">
              Dirt tracks, mountain passes and quiet villages you rarely reach by car. Choose an area and a date, and we plan the day with you.
            </p>
          </div>

          <form className="ht-search" role="search" aria-label="Search off road tours" onSubmit={runSearch}>
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

              <label className="ht-sf">
                <span className="ht-sf-label">Date</span>
                <span className="ht-sf-box ht-sf-dates">
                  <HIcon name="calendar" size={20} />
                  <input type="date" aria-label="Date" value={date} min={today || undefined} onChange={(e) => setDate(e.target.value)} />
                </span>
              </label>

              <div className="ht-sf ht-sf--guests" ref={groupRef}>
                <span className="ht-sf-label" id="ht-guests-label">Group</span>
                <button
                  type="button"
                  className="ht-sf-box ht-sf-btn"
                  aria-haspopup="dialog"
                  aria-expanded={groupOpen}
                  aria-labelledby="ht-guests-label ht-guests-value"
                  onClick={() => setGroupOpen((o) => !o)}
                >
                  <HIcon name="users" size={20} />
                  <span id="ht-guests-value" className="ht-sf-value">{groupSummary}</span>
                  <span className="ht-sf-chev"><HIcon name="chevronDown" size={18} /></span>
                </button>
                {groupOpen && (
                  <div className="ht-guests" role="dialog" aria-label="Group">
                    <div className="ct-steppers">
                      <Stepper label="Adults" sub="13 and older" value={adults} min={1} max={16} onChange={setAdults} />
                      <Stepper label="Children" sub="Up to 12" value={children} min={0} max={10} onChange={setChildren} />
                    </div>
                    <button type="button" className="ht-guests-done" onClick={() => setGroupOpen(false)}>
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="ht-search-foot">
              <div className="ht-filter" role="group" aria-label="Length of tour">
                <span className="ht-filter-label" aria-hidden="true">Filter</span>
                {TOUR_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`ht-fpill${kind === k ? " is-on" : ""}`}
                    aria-pressed={kind === k}
                    onClick={() => setKind((cur) => (cur === k ? "" : k))}
                  >
                    {k}
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
                Where the <span className="ht-title-muted">tracks go</span>
              </h2>
            </div>
            <p className="ht-lead">Four parts of the island with mountain roads and open ground. Choose one to see the tours there.</p>
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

      {/* 3. Tours carousel (see offRoadData.ts for which tours are real) */}
      <section className="ht-section ht-stays" id="tours" ref={toursRef} aria-labelledby="ht-stays-title">
        <div className="ht-inner">
          <div className="ht-head ht-head--stays">
            <div>
              <h2 id="ht-stays-title" className="ht-title">{toursTitle}</h2>
              <div className="ht-filter or-groups" role="group" aria-label="Type of tour">
                {(["", ...TOUR_GROUPS] as (TourGroup | "")[]).map((g) => (
                  <button
                    key={g || "all"}
                    type="button"
                    className={`ht-fpill${group === g ? " is-on" : ""}`}
                    aria-pressed={group === g}
                    onClick={() => {
                      setGroup(g);
                      resetTrack();
                    }}
                  >
                    {g || "All"}
                  </button>
                ))}
              </div>
            </div>
            <div className="ht-stays-side">
              <div className="ht-stays-tools">
                {(applied.area || applied.kind || group) && (
                  <button type="button" className="ht-clear" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
                <div className="ht-arrows">
                  <button type="button" className="ht-arrow" aria-label="Previous tours" disabled={!canPrev || !visible.length} onClick={() => step(-1)}>
                    <HIcon name="arrowLeft" size={20} />
                  </button>
                  <button type="button" className="ht-arrow" aria-label="Next tours" disabled={!canNext || !visible.length} onClick={() => step(1)}>
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
            aria-label={toursTitle}
            onScroll={updateArrows}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(e) => e.preventDefault()}
          >
            {visible.map((t) => (
              <TourCard key={t.id} tour={t} saved={saved.has(t.id)} onToggle={toggleSaved} />
            ))}
          </div>
        ) : (
          <div className="ht-inner">
            <div className="ht-empty">
              <p>No tours match these filters yet. Send us a request and we plan a route for you.</p>
              <div className="ht-empty-actions">
                <button type="button" className="ht-clear" onClick={clearFilters}>
                  Clear filters
                </button>
                <button type="button" className="ht-clear ht-clear--solid" onClick={() => scrollToEl(document.getElementById("request"))}>
                  Request a tour
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. What is included */}
      <section className="ht-section" id="included" aria-labelledby="or-included-title">
        <div className="ht-inner">
          <div className="ht-head">
            <div>
              <Kicker>On the tour</Kicker>
              <h2 id="or-included-title" className="ht-title">What is included</h2>
            </div>
            <p className="ht-lead">What our current 4x4 tours list. For a tailored tour we agree everything with you before you book.</p>
          </div>
          <ol className="ht-steps">
            {INCLUDED.map((s) => (
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

      {/* 5. How booking works */}
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
              { icon: "car", title: "Choose a tour", text: "Pick a tour you like, or tell us the area, the date and the kind of day you want." },
              { icon: "calendarCheck", title: "We check the date", text: "We check the day with the guide and come back with the details and the price." },
              { icon: "checkCircle", title: "You confirm", text: "You choose, we book it and send you the meeting point and every detail." },
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

      {/* 6. Request form */}
      <OffRoadRequestForm snapshot={snapshot} today={today} />

      {/* Photo credits (Wikimedia Commons licences ask for attribution) */}
      <section className="or-credits" aria-label="Photo credits">
        <div className="ht-inner">
          <details>
            <summary>Photo credits</summary>
            <ul>
              {PHOTO_CREDITS.map((c) => (
                <li key={c.file}>
                  {c.file}: <a href={c.url} target="_blank" rel="noreferrer noopener">{c.title}</a>, {c.author}, {c.license}, via Wikimedia Commons
                </li>
              ))}
              <li>Tailored 4x4 tour: Sardinia Discovery Travels</li>
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
