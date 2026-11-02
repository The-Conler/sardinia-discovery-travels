"use client";
import { useEffect, useRef, useState } from "react";

export type Destination = { name: string; line: string; image: string; href: string };

const arrowProps = { viewBox: "0 0 24 24", width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
const ArrowRight = () => <svg {...arrowProps}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const ChevronLeft = () => <svg {...arrowProps}><path d="m15 18-6-6 6-6" /></svg>;
const ChevronRight = () => <svg {...arrowProps}><path d="m9 18 6-6-6-6" /></svg>;

// "What you'll find in the north": a row of tall photo cards over an aerial
// coast photo. Replaces the old pinned polaroid gallery (AreaGallery.tsx).
// Desktop: side arrows scroll the row one card at a time. Phone: swipe row.
export function NorthDestinations({ items }: { items: Destination[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => { el.removeEventListener("scroll", update); ro?.disconnect(); };
  }, []);

  const go = (dir: number) => {
    const el = rowRef.current;
    if (!el || !el.children.length) return;
    // scrollWidth, clientWidth and scrollLeft share one unit system, so this
    // stays right under the desktop site zoom too.
    const stepSize = el.scrollWidth / el.children.length;
    el.scrollBy({ left: dir * stepSize, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="north-dest" aria-labelledby="areas-title">
      <div className="north-dest-bg" aria-hidden="true">
        <img src="/destinations/north/nd-bg.webp" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="north-dest-head">
        <p className="north-dest-label">Coast, islands and inland</p>
        <h2 id="areas-title">What you&apos;ll find in the north.</h2>
        <p className="north-dest-sub">Five places to start planning around, from the harbours of the northeast to the beaches of the northwest.</p>
      </div>
      <div className={`north-dest-stage${edge.start && edge.end ? " is-static" : ""}`}>
        <button type="button" className="north-dest-arrow prev" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous places"><ChevronLeft /></button>
        <div className="north-dest-row" ref={rowRef}>
          {items.map(item => (
            <a className="north-dest-card" href={item.href} key={item.name}>
              <img src={item.image} alt="" loading="lazy" decoding="async" />
              <span className="north-dest-shade" aria-hidden="true" />
              <span className="north-dest-copy">
                <strong>{item.name}</strong>
                <span>{item.line}</span>
              </span>
              <span className="north-dest-go" aria-hidden="true"><ArrowRight /></span>
            </a>
          ))}
        </div>
        <button type="button" className="north-dest-arrow next" onClick={() => go(1)} disabled={edge.end} aria-label="Next places"><ChevronRight /></button>
      </div>
      <div className="north-dest-cta-wrap">
        <a className="north-dest-cta" href="/destinations">Explore all destinations <ArrowRight /></a>
      </div>
    </section>
  );
}
