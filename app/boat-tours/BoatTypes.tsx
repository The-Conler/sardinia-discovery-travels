"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { siteZoom } from "../siteZoom";

// Line icons: paths from Lucide (https://lucide.dev), ISC licence
const c = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const ICONS: Record<string, string[]> = {
  sun: [c(12, 12, 4), "M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"],
  waves: ["M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1", "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1", "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"],
  fish: ["M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z", "M18 12v.5", "M16 17.93a9.77 9.77 0 0 1 0-11.86", "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33", "M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4", "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"],
  sailboat: ["M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z", "M21 14 10 2 3 14h18Z", "M10 2v16"],
  anchor: ["M12 22V8", "M5 12H2a10 10 0 0 0 20 0h-3", c(12, 5, 3)],
  wind: ["M12.8 19.6A2 2 0 1 0 14 16H2", "M17.5 8a2.5 2.5 0 1 1 2 4H2", "M9.8 4.4A2 2 0 1 1 11 8H2"],
  zap: ["M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"],
  mountain: ["m8 3 4 8 5-5 5 15H2L8 3z"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", c(9, 7, 4), "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  key: ["m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", "m21 2-9.6 9.6", c(7.5, 15.5, 5.5)],
  armchair: ["M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3", "M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z", "M5 18v2", "M19 18v2"],
};
const Icon = ({ name }: { name: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {(ICONS[name] ?? []).map((d) => <path key={d} d={d} />)}
  </svg>
);

const P = "/experiences/boat-types/";
const boats = [
  { name: "Catamaran", perks: [["sun","Sun & shade"],["waves","Swimming stops"],["fish","Snorkelling"]], places: ["Santa Teresa","Stintino","Olbia","Palau","Alghero","Cagliari"], img: P + "catamaran.webp", alt: "White sailing catamaran on bright turquoise water",
    body: "A wide, stable deck with room to spread out in the sun or the shade. The day runs at an easy pace, with stops in sheltered bays for swimming and snorkelling. Departures from Santa Teresa, Stintino, Olbia, Palau, Alghero and Cagliari." },
  { name: "Sailboat", perks: [["sailboat","Under sail"],["anchor","Clear anchorages"],["wind","Quiet coast"]], places: ["Santa Teresa","Porto Torres","Golfo Aranci","Arbatax","Alghero","Cagliari"], img: P + "sailboat.webp", alt: "Aerial view of a sailboat on clear turquoise sea",
    body: "Engine off, sails up. A quieter way to follow the coast, moving with the wind and dropping anchor where the water is clearest. Departures from Santa Teresa, Porto Torres, Golfo Aranci, Arbatax, Alghero and Cagliari." },
  { name: "RIB", perks: [["zap","Fast & light"],["mountain","Coves & caves"],["users","Small group"]], places: ["La Maddalena","Alghero","Cala Gonone","Cagliari"], img: P + "rib.webp", alt: "Aerial view of a speedboat cutting through turquoise water",
    body: "Fast, light and close to the water. A small group, a nimble boat and the freedom to reach coves and caves that larger boats pass by. Areas include La Maddalena, Alghero, Cala Gonone and Cagliari." },
  { name: "Yacht", perks: [["key","Private day"],["armchair","Comfort on deck"],["anchor","Calm anchorages"]], places: ["Santa Maria Navarrese","Baunei coast"], img: P + "yacht.webp", alt: "Motor yacht anchored in calm blue water below green hills",
    body: "A private day aboard, shaped around your group. Comfort on deck, calm anchorages and time to take in the coastline at your own rhythm. Departing from Santa Maria Navarrese along the Baunei coast." },
];

export function BoatTypes() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [step, setStep] = useState(0);
  const [maxShift, setMaxShift] = useState(Infinity);
  const start = useRef<number | null>(null);
  const firstPair = useRef<HTMLDivElement>(null);
  const go = (n: number) => setIndex(Math.max(0, Math.min(boats.length - 1, step ? Math.ceil(maxShift / step) : boats.length - 1, n)));

  useEffect(() => {
    const measure = () => {
      const el = firstPair.current;
      if (!el) return;
      const gap = parseFloat(getComputedStyle(el.parentElement!).columnGap) || 0;
      setStep(el.offsetWidth + gap);
      const track = el.parentElement!; const vp = track.parentElement!;
      const cs = getComputedStyle(vp);
      const inner = vp.clientWidth - (parseFloat(cs.paddingLeft) || 0) - Math.max(24, parseFloat(cs.paddingLeft) || 0);
      setMaxShift(Math.max(0, track.scrollWidth - inner));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };
  const onDown = (e: PointerEvent) => { start.current = e.clientX; };
  const onMove = (e: PointerEvent) => { if (start.current !== null) setDrag((e.clientX - start.current) / siteZoom()); };
  const onUp = () => {
    if (start.current === null) return;
    if (Math.abs(drag) > 60) go(index + (drag < 0 ? 1 : -1));
    start.current = null;
    setDrag(0);
  };

  return (
    <section className="boatfleets" aria-labelledby="boatfleets-title">
      <p className="boatfleets-label">Boat experiences</p>
      <h2 id="boatfleets-title">Four boats. One coastline.</h2>

      <div className="boatfleets-stage">
        <div
          className="boatfleets-viewport"
          role="region"
          aria-roledescription="carousel"
          aria-label="Boat experiences"
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
        >
          <div
            className={`boatfleets-track${start.current !== null && drag ? " is-dragging" : ""}`}
            style={{ transform: `translateX(${-Math.min(index * step, maxShift) + drag}px)` }}
          >
            {boats.map((b, i) => (
              <div className="boatfleet-pair" key={b.name} ref={i === 0 ? firstPair : undefined} aria-hidden={i !== index}>
                <div className="boatfleet-photo">
                  <img src={b.img} alt={b.alt} draggable={false} loading="lazy" />
                </div>
                <article className="boatfleet-text">
                  <p className="boatfleet-kicker">{b.name}</p>
                  <ul className="boatfleet-places">{b.places.map((p) => <li key={p}>{p}</li>)}</ul>
                  <ul className="boatfleet-perks">{b.perks.map(([i, t]) => <li key={t}><span aria-hidden="true"><Icon name={i} /></span>{t}</li>)}</ul>
                  <div>
                    <h3>{b.name}</h3>
                    <p className="boatfleet-body">{b.body}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
        <button className="boatfleets-prev" type="button" aria-label="Previous boat" disabled={index === 0} onClick={() => go(index - 1)}>←</button>
        <button className="boatfleets-next" type="button" aria-label="Next boat" disabled={index === boats.length - 1 || index * step >= maxShift} onClick={() => go(index + 1)}>→</button>
      </div>

      <div className="boatfleets-progress" aria-hidden="true">
        <i style={{ width: `${((index + 1) / boats.length) * 100}%` }} />
      </div>
    </section>
  );
}
