"use client";
import { useEffect, useRef } from "react";
import { siteZoom } from "../../siteZoom";

type Area = { name: string; label: string; text: string; image: string };

// gsap + ScrollTrigger are loaded globally in app/layout.tsx.
declare global {
  interface Window {
    gsap?: { to: (t: unknown, v: Record<string, unknown>) => unknown; context: (fn: () => void, scope?: unknown) => { revert: () => void } };
    ScrollTrigger?: { refresh: () => void };
  }
}

const rotations = [-4, 3, -2.5, 3.5, -3, 2.5];

export function AreaGallery({ areas }: { areas: Area[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enableManualScroll = () => { if (viewportRef.current) viewportRef.current.style.overflowX = "auto"; };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On small screens or with reduced motion, fall back to a plain swipe row.
    if (reduce || window.innerWidth < 900) { enableManualScroll(); return; }

    let ctx: { revert: () => void } | undefined;
    let raf = 0;
    let tries = 0;
    const setup = () => {
      const gsap = window.gsap;
      const ST = window.ScrollTrigger;
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!gsap || !ST || !track || !section) {
        if (tries++ < 90) { raf = requestAnimationFrame(setup); } else { enableManualScroll(); }
        return;
      }
      // If everything already fits on screen, leave the row centered (no pin).
      if (track.scrollWidth - section.clientWidth / siteZoom() <= 4) return;
      ctx = gsap.context(() => {
        // The section is kept unzoomed and the track inside it is zoomed (SITE ZOOM in globals.css).
        const rel = () => siteZoom();
        const amount = () => Math.max(0, track.scrollWidth - section.clientWidth / rel());
        gsap.to(track, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + amount() * rel(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      ST.refresh();
    };
    setup();
    return () => { if (raf) cancelAnimationFrame(raf); if (ctx) ctx.revert(); };
  }, [areas.length]);

  return (
    <section className="north-gallery" ref={sectionRef} aria-labelledby="areas-title">
      <div className="north-gallery-head">
        <p className="north-eyebrow">Coast, islands &amp; inland</p>
        <h2 id="areas-title">What you&apos;ll find in the north.</h2>
      </div>
      <div className="north-gallery-viewport" ref={viewportRef}>
        <div className="north-gallery-track" ref={trackRef}>
          {areas.map((area, i) => (
            <figure className="north-polaroid" key={area.name} style={{ ["--rot" as string]: `${rotations[i % rotations.length]}deg` } as React.CSSProperties}>
              <div className="north-polaroid-img"><img src={area.image} alt={area.name} loading="lazy" decoding="async" /></div>
              <figcaption><strong>{area.name}</strong></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
