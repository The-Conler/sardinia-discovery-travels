"use client";

// Off road tour card, shared by the tours carousel (OffRoadView) and the
// "Other tours" row on each tour page. The whole card opens the tour page
// (a stretched link on the title); the heart and the booking link sit above it.
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { HIcon } from "../hotels/icons";
import { barValue, cardFacts, tourHref } from "./offRoadData";
import type { Tour } from "./offRoadData";

const SAVED_KEY = "sdt-offroad-saved";
const SAVED_EVENT = "sdt-offroad-saved";

/** Saved (hearted) tours, kept in localStorage on this device only. */
export function useSavedTours() {
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    const load = () => {
      try {
        const raw = window.localStorage.getItem(SAVED_KEY);
        setSaved(new Set(raw ? (JSON.parse(raw) as string[]) : []));
      } catch {
        setSaved(new Set());
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener(SAVED_EVENT, load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener(SAVED_EVENT, load);
    };
  }, []);
  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      } catch {
        /* private mode: keep it for this visit only */
      }
      return next;
    });
  }, []);
  return { saved, toggle };
}

type Gsap = { to: (t: unknown, v: Record<string, unknown>) => unknown };
const gsapOf = () => (window as unknown as { gsap?: Gsap }).gsap;
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function TourCard({ tour: t, saved, onToggle, role = "listitem" }: { tour: Tour; saved: boolean; onToggle: (id: string) => void; role?: string }) {
  const ref = useRef<HTMLElement>(null);
  const bar = barValue(t);
  const href = tourHref(t);

  // Smooth hover: the card lifts a little and the photo zooms in slowly.
  const hover = (on: boolean) => {
    const g = gsapOf();
    const el = ref.current;
    if (!g || !el || !canHover()) return;
    g.to(el, { y: on ? -6 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    g.to(el.querySelector(".ht-card-img"), { scale: on ? 1.06 : 1, duration: 1.2, ease: "power3.out", overwrite: "auto" });
  };
  const stop = (e: ReactMouseEvent) => e.stopPropagation();

  return (
    <article ref={ref} className="ht-card or-card" role={role} aria-label={t.name} onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)}>
      <img className="ht-card-img" src={t.img} alt="" loading="lazy" decoding="async" draggable={false} style={t.pos ? { objectPosition: t.pos } : undefined} />
      <div className="ht-card-shade" aria-hidden="true" />
      <div className="or-card-top">
        {t.book ? (
          <a className="or-book" href={t.book} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label={`Check availability for ${t.name} (opens in a new tab)`}>
            Check availability
          </a>
        ) : (
          <span />
        )}
        <button type="button" className={`ht-heart${saved ? " is-on" : ""}`} aria-pressed={saved} aria-label={`Save ${t.name}`} onClick={() => onToggle(t.id)}>
          <HIcon name="heart" size={18} />
        </button>
      </div>
      <div className="ht-card-body or-card-body">
        <h3 className="ht-card-title">
          <a className="or-card-link" href={href} draggable={false}>
            {t.name}
          </a>
        </h3>
        <p className="or-card-type">
          <HIcon name="car" size={16} />
          {t.meta}
        </p>
        {t.text && <p className="ht-card-text">{t.text}</p>}
        {cardFacts(t).length > 0 && (
          <ul className="or-chips" aria-label="Details">
            {cardFacts(t).map((f) => (
              <li key={f.label}>
                <HIcon name={f.icon} size={16} />
                {f.label}
              </li>
            ))}
          </ul>
        )}
        <div className="or-bar">
          <p className="or-bar-value">
            <span>{bar.label}</span>
            <strong>{bar.value}</strong>
          </p>
          <a className="or-ask" href={`${href}#ask`} draggable={false} aria-label={`Ask about ${t.name}`}>
            Ask about this
            <HIcon name="arrowRight" size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
