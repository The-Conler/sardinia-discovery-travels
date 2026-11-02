"use client";

// One page per off road tour (/off-road/[slug]), driven by the tour data.
// Hero, overview, route, what is included, good to know, gallery, the
// request form with the tour locked, and other tours.
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { HIcon } from "../hotels/icons";
import { scrollToEl } from "../hotels/ui";
import { detailsFor, galleryFor, otherTours } from "./offRoadData";
import type { GalleryItem, Tour } from "./offRoadData";
import { OffRoadRequestForm } from "./OffRoadRequestForm";
import { TourCard, useSavedTours } from "./TourCard";

type W = {
  gsap?: {
    fromTo: (t: unknown, a: Record<string, unknown>, b: Record<string, unknown>) => unknown;
    set: (t: unknown, v: Record<string, unknown>) => void;
  };
  ScrollTrigger?: { refresh: () => void };
  ScrollSmoother?: { get: () => { paused: (v?: boolean) => boolean } | undefined };
};
const win = () => window as unknown as W;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shown where the client has not sent the information yet. Neutral on purpose.
const PENDING = "Confirmed in our reply.";

// TODO: generic placeholder stops, the same on every tour. Replace with each
// tour's real stops (TOUR_DETAILS in offRoadData.ts) once the client sends them.
const ROUTE_PLACEHOLDER = [
  { icon: "pin", label: "Scenic viewpoints" },
  { icon: "landmark", label: "Historic sites" },
  { icon: "tree", label: "Nature stops" },
  { icon: "camera", label: "Photo spots" },
];

// A few line icons the shared icon set does not have.
const EXTRA: Record<string, string[]> = {
  tree: ["M12 2 6 10h3l-4 6h14l-4-6h3z", "M12 16v6"],
  camera: ["M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z", "M12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6"],
  bag: ["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", "M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"],
  chevronRight: ["m9 18 6-6-6-6"],
};
function Ico({ name }: { name: string }) {
  const paths = EXTRA[name];
  if (!paths) return <HIcon name={name} size={20} />;
  return (
    <svg className="ht-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** A row tile that opens to show its detail text. */
function Row({ id, icon, title, text, open, setOpen, accent }: { id: string; icon: string; title: string; text?: string; open: string | null; setOpen: (v: string | null) => void; accent?: boolean }) {
  const on = open === id;
  const pid = `ort-row-${id.replace(/\W+/g, "-")}`;
  return (
    <li className={`ort-row${on ? " is-open" : ""}`}>
      <button type="button" className="ort-row-btn" aria-expanded={on} aria-controls={pid} onClick={() => setOpen(on ? null : id)}>
        <span className={`ort-row-icon${accent ? " is-accent" : ""}`}><Ico name={icon} /></span>
        <span className="ort-row-title">{title}</span>
        <span className="ort-row-chev"><Ico name="chevronRight" /></span>
      </button>
      <div className="ort-row-more" id={pid} role="region" aria-label={title}>
        <div><p>{text ?? PENDING}</p></div>
      </div>
    </li>
  );
}

export function TourDetail({ tour: t }: { tour: Tour }) {
  const d = detailsFor(t);
  const gallery = galleryFor(t);
  const others = otherTours(t);
  const { saved, toggle } = useSavedTours();
  const [today, setToday] = useState("");
  const [shown, setShown] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const chips = [...t.facts, ...(t.price ? [{ icon: "wallet", label: t.price }] : [])];
  const fact = (...icons: string[]) => t.facts.find((f) => icons.includes(f.icon))?.label;
  const level = fact("mountain");
  const distance = fact("route");
  const seats = fact("users", "user");
  // Fact tiles: type, level, duration, distance (or seats) and the price when known.
  const stats = [
    { icon: "car", label: "Type", value: t.meta },
    level && { icon: "mountain", label: "Level", value: level },
    { icon: "clock", label: "Duration", value: fact("clock") ?? t.length },
    distance ? { icon: "route", label: "Distance", value: distance } : seats && { icon: "users", label: "Seats", value: seats },
    t.price && { icon: "wallet", label: "Price", value: t.price },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];
  const route = d.stops.length ? d.stops.map((x) => ({ icon: "pin", label: x.title })) : ROUTE_PLACEHOLDER;
  const included = d.included.length ? d.included : [{ icon: "check", title: "What the price includes", text: PENDING }];
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  // Arriving from a card's "Ask about this": go to the form once the page is ready.
  useEffect(() => {
    if (window.location.hash !== "#ask") return;
    let tries = 0;
    const go = () => {
      const ready = win().ScrollSmoother?.get();
      if (!ready && tries++ < 60) return void window.setTimeout(go, 50);
      window.setTimeout(() => scrollToEl(document.getElementById("ask")), 150);
    };
    go();
  }, []);

  // GSAP reveals: the hero on load, the sections as they scroll in.
  useEffect(() => {
    if (reduced()) return;
    let tries = 0;
    let timer = 0;
    const run = () => {
      const w = win();
      if (!w.gsap || !w.ScrollTrigger || !w.ScrollSmoother?.get()) {
        if (tries++ < 80) timer = window.setTimeout(run, 50);
        return;
      }
      const g = w.gsap;
      const root = rootRef.current;
      if (!root) return;
      g.fromTo(root.querySelectorAll(".ort-hero [data-rv]"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, clearProps: "transform" });
      g.fromTo(root.querySelector(".ort-hero-img"), { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power2.out" });
      root.querySelectorAll<HTMLElement>("[data-rv-group]").forEach((grp) => {
        g.fromTo(
          grp.querySelectorAll("[data-rv-item]"),
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, clearProps: "transform", scrollTrigger: { trigger: grp, start: "top 85%", once: true } },
        );
      });
      w.ScrollTrigger.refresh();
    };
    run();
    return () => window.clearTimeout(timer);
  }, []);

  const toAsk = () => scrollToEl(document.getElementById("ask"));

  return (
    <div className="ht-page or-page or-tour" ref={rootRef}>
      {/* Hero */}
      <section className="ort-hero" aria-labelledby="ort-title">
        <div className="ort-hero-media" aria-hidden="true">
          <img className="ort-hero-img" src={t.img} alt="" decoding="async" fetchPriority="high" style={t.pos ? { objectPosition: t.pos } : undefined} />
          <div className="ort-hero-shade" />
        </div>
        <div className="ort-hero-inner">
          <a className="ort-back" href="/off-road" data-rv>
            <HIcon name="arrowLeft" size={16} />
            All off road tours
          </a>
          <p className="or-card-type ort-type" data-rv>
            <HIcon name="car" size={18} />
            {t.meta}
          </p>
          <h1 id="ort-title" className="ort-title" data-rv>{t.name}</h1>
          {t.text && <p className="ort-lead" data-rv>{t.text}</p>}
          <ul className="or-chips ort-chips" aria-label="Details" data-rv>
            {chips.map((f) => (
              <li key={f.label}>
                <HIcon name={f.icon} size={16} />
                {f.label}
              </li>
            ))}
          </ul>
          <div className="ort-actions" data-rv>
            <a className="or-ty-home" href="#ask" onClick={(e) => { e.preventDefault(); toAsk(); }}>
              Ask about this tour
              <HIcon name="arrowRight" size={16} />
            </a>
            {t.book && (
              <a className="ort-ghost" href={t.book} target="_blank" rel="noopener noreferrer" aria-label={`Check availability for ${t.name} (opens in a new tab)`}>
                Check availability
              </a>
            )}
            <button type="button" className={`ht-heart ort-heart${saved.has(t.id) ? " is-on" : ""}`} aria-pressed={saved.has(t.id)} aria-label={`Save ${t.name}`} onClick={() => toggle(t.id)}>
              <HIcon name="heart" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Info: about, facts, route, included and good to know. Fits one screen on desktop. */}
      <section className="ht-section ort-info" aria-labelledby="ort-overview">
        <div className="ht-inner" data-rv-group>
          <div className="ort-info-about" data-rv-item>
            <h2 id="ort-overview" className="ht-title ort-h2">About this tour</h2>
            {/* TODO: a longer description of the tour from the client. Only the one line is known. */}
            {t.text && <p className="ort-info-lead">{t.text}</p>}
          </div>
          <ul className="ort-stats" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }} data-rv-item>
            {stats.map((x) => (
              <li key={x.label} className="ort-stat">
                <span className="ort-stat-icon"><Ico name={x.icon} /></span>
                <span className="ort-stat-text">
                  <strong>{x.value}</strong>
                  <span>{x.label}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="ort-rule" />

          <div className="ort-route" data-rv-item>
            <div className="ort-route-head">
              <div>
                <h2 className="ht-title ort-h2 ort-h2--sm">What you will see</h2>
                <p className="ort-info-sub">The full route and its stops are confirmed in our reply.</p>
              </div>
              <button type="button" className="ort-round" aria-label="See the photos" onClick={() => scrollToEl(document.getElementById("ort-gallery"))}>
                <Ico name="chevronRight" />
              </button>
            </div>
            {/* TODO: these four stops are generic placeholders. Replace them with the real
                stops of each tour (TOUR_DETAILS[id].stops) once the client sends them. */}
            <ol className="ort-stops">
              {route.map((r) => (
                <li key={r.label}>
                  <span className="ort-stop-icon"><Ico name={r.icon} /></span>
                  <span className="ort-stop-label">{r.label}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="ort-rule" />

          <div className="ort-cols" data-rv-item>
            <div className="ort-col">
              <h3 className="ort-col-title">Included</h3>
              {/* TODO: what the price includes for this tour (not sent yet, except the full day tour). */}
              <ul className="ort-rows">
                {included.map((x) => (
                  <Row key={x.title} id={`inc-${x.title}`} icon={x.icon} title={x.title} text={x.text} open={open} setOpen={setOpen} accent />
                ))}
              </ul>
            </div>
            <div className="ort-col">
              <h3 className="ort-col-title">Good to know</h3>
              {/* TODO: age and licence rules, what to bring and the meeting point for this tour. */}
              <ul className="ort-rows">
                <Row id="rules" icon="user" title="Ages and driving licence" text={d.rules ?? PENDING} open={open} setOpen={setOpen} />
                <Row id="bring" icon="bag" title="What to bring" text={d.bring ?? PENDING} open={open} setOpen={setOpen} />
                <Row id="meet" icon="pin" title="Meeting point" text={d.meeting ?? PENDING} open={open} setOpen={setOpen} />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="ht-section ort-section" id="ort-gallery" aria-labelledby="ort-gal">
        <div className="ht-inner" data-rv-group>
          <div className="ort-head" data-rv-item>
            <p className="ht-kicker">Photos</p>
            <h2 id="ort-gal" className="ht-title ort-h2">Gallery</h2>
          </div>
          {/* TODO: the photos after the first are stock (see STOCK in offRoadData.ts).
              Replace them with the client's own photos and a video of this tour. */}
          <div className={`ort-gallery n${gallery.length}`}>
            {gallery.map((g, i) => (
              <button key={g.src} type="button" className="ort-shot" data-rv-item onClick={() => setShown(i)} aria-label={`Open photo ${i + 1} of ${gallery.length}: ${g.alt}`}>
                <img src={g.src} alt="" loading="lazy" decoding="async" style={g.pos ? { objectPosition: g.pos } : undefined} />
              </button>
            ))}
            {d.video && (
              <video className="ort-video" src={d.video} controls playsInline preload="metadata" data-rv-item />
            )}
          </div>
          <p className="ort-credits">
            The first photo is from this tour. The others are stock photos of similar tours, from{" "}
            {gallery
              .filter((g) => g.credit)
              .map((g, i, all) => (
                <span key={g.src}>
                  <a href={g.credit!.url} target="_blank" rel="noopener noreferrer">{g.credit!.author}</a>
                  {i < all.length - 2 ? ", " : i === all.length - 2 ? " and " : ""}
                </span>
              ))}{" "}
            on Pexels.
          </p>
        </div>
      </section>

      <OffRoadRequestForm snapshot={null} today={today} lockTour={t} sectionId="ask" />

      {/* Other tours */}
      <section className="ht-section ort-section ort-others" aria-labelledby="ort-more">
        <div className="ht-inner">
          <div className="ort-head">
            <p className="ht-kicker">More off road</p>
            <h2 id="ort-more" className="ht-title ort-h2">Other tours</h2>
          </div>
        </div>
        <div className="ht-track ort-track" role="list" aria-label="Other tours">
          {others.map((o) => (
            <TourCard key={o.id} tour={o} saved={saved.has(o.id)} onToggle={toggle} />
          ))}
        </div>
      </section>

      {shown !== null && <Lightbox items={gallery} index={shown} onIndex={setShown} onClose={() => setShown(null)} />}
    </div>
  );
}

function Lightbox({ items, index, onIndex, onClose }: { items: GalleryItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const n = items.length;
  const go = (dir: 1 | -1) => onIndex((index + dir + n) % n);
  const closeRef = useRef<HTMLButtonElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const sm = win().ScrollSmoother?.get();
    sm?.paused(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      sm?.paused(false);
      prev?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const g = win().gsap;
    if (g && imgRef.current && !reduced()) g.fromTo(imgRef.current, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" });
  }, [index]);

  const down = (e: ReactPointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const up = (e: ReactPointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div className="ort-lb" role="dialog" aria-modal="true" aria-label="Photo gallery" onClick={(e) => e.target === e.currentTarget && onClose()} onPointerDown={down} onPointerUp={up}>
      <button ref={closeRef} type="button" className="ort-lb-btn ort-lb-close" aria-label="Close gallery" onClick={onClose}>
        <HIcon name="plus" size={22} />
      </button>
      <figure className="ort-lb-fig">
        <img ref={imgRef} key={items[index].src} src={items[index].src} alt={items[index].alt} draggable={false} />
        <figcaption>
          {items[index].credit ? `Stock photo by ${items[index].credit!.author} on Pexels` : items[index].alt}
          <span>{index + 1} of {n}</span>
        </figcaption>
      </figure>
      {n > 1 && (
        <>
          <button type="button" className="ort-lb-btn ort-lb-prev" aria-label="Previous photo" onClick={() => go(-1)}>
            <HIcon name="arrowLeft" size={22} />
          </button>
          <button type="button" className="ort-lb-btn ort-lb-next" aria-label="Next photo" onClick={() => go(1)}>
            <HIcon name="arrowRight" size={22} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
