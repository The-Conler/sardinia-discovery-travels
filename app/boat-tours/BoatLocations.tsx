"use client";

import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

const P = "/experiences/boat-locations/";
const slides = [
  { name: "La Maddalena", img: P + "la-maddalena.webp", alt: "Boats anchored in clear turquoise shallows in the La Maddalena archipelago",
    text: "Explore the La Maddalena archipelago by catamaran, sailboat or RIB, departing from Palau, Cannigione, Santa Teresa and more." },
  { name: "Baunei", img: P + "baunei.webp", alt: "Swimmers in turquoise water at the white pebble beach of Cala Goloritzè, Baunei coast",
    text: "Reach the coves of the Baunei coast by yacht from Santa Maria Navarrese, sailboat from Arbatax or RIB from Cala Gonone." },
  { name: "Tavolara", img: P + "tavolara.webp", alt: "Tavolara island rising from the blue sea beyond the red granite rocks of the shore",
    text: "Discover Tavolara by catamaran from Olbia or by sailboat from Golfo Aranci and San Teodoro. Out on the water from 09:30 to 17:30." },
  { name: "Asinara", img: P + "asinara.webp", alt: "Turquoise bay of Cala Sabina framed by green maquis on Asinara island",
    text: "Sail to the wild national park of Asinara: by catamaran from Stintino, 09:00 to 15:00, or by sailboat from Porto Torres, 10:00 to 17:00." },
  { name: "Alghero", img: P + "alghero.webp", alt: "The sheer limestone headland of Capo Caccia rising from the sea near Alghero",
    text: "Follow the Capo Caccia coastline by catamaran, sailboat or RIB from Alghero port, 10:00 to 17:00." },
  { name: "Cagliari", img: P + "cagliari.webp", alt: "Poetto beach in Cagliari with the Sella del Diavolo headland across the water",
    text: "See the south coast around Cagliari by catamaran, sailboat or RIB, on a half-day or full-day trip." },
  { name: "Corsica", img: P + "corsica.webp", alt: "White limestone cliffs and sea stacks above turquoise water at Bonifacio, Corsica",
    text: "Cross the strait to Corsica by catamaran or sailboat from Santa Teresa. A full day at sea, 09:30 to 17:30." },
];
const pad = (n: number) => String(n).padStart(2, "0");

export function BoatLocations() {
  const [index, setIndex] = useState(0);
  const [moved, setMoved] = useState(false);
  const startX = useRef<number | null>(null);
  const go = useCallback((n: number) => { setMoved(true); setIndex(Math.max(0, Math.min(slides.length - 1, n))); }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };
  const onDown = (e: PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };
  const slide = slides[index];

  return (
    <section
      className="boat-loc"
      aria-roledescription="carousel"
      aria-label="Boat tour destinations"
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => { startX.current = null; }}
    >
      <div className="boat-loc-panel">
        {slides.map((s, i) => (
          <img
            key={s.name}
            className={`boat-loc-bg${i === index ? " is-active" : ""}`}
            src={s.img}
            alt={i === index ? s.alt : ""}
            aria-hidden={i !== index}
            loading={i < 2 ? "eager" : "lazy"}
            draggable={false}
          />
        ))}
        <div className="boat-loc-shade" aria-hidden="true" />

        <p className="boat-loc-count" aria-live="polite">
          <span>{pad(index + 1)}</span><span aria-hidden="true">/</span><span>{pad(slides.length)}</span>
        </p>

        <div className="boat-loc-stage">
          <div className="boat-loc-track" style={{ transform: `translateX(calc(${-(index + 0.5)} * var(--boat-loc-item)))` }}>
            {slides.map((s, i) => (
              <h3
                key={s.name}
                className={`boat-loc-title${i === index ? " is-active" : ""}${i === index - 1 ? " is-prev" : ""}`}
                aria-hidden={i !== index}
              >
                <span key={moved && i === index ? `${s.name}-${index}` : s.name} data-reveal-06 className={moved && i === index ? "is-revealed" : undefined}>{s.name}</span>
              </h3>
            ))}
          </div>
          <button type="button" className="boat-loc-arrow is-left" aria-label="Previous destination" onClick={() => go(index - 1)} disabled={index === 0}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" className="boat-loc-arrow is-right" aria-label="Next destination" onClick={() => go(index + 1)} disabled={index === slides.length - 1}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        <div className="boat-loc-copy" key={slide.name}>
          <p>{slide.text}</p>
          <a className="button-02 button-02--teal" href="#book"><span className="inner">Discover the tour</span><span className="circle" aria-hidden="true"><span>→</span></span></a>
        </div>
      </div>
    </section>
  );
}
