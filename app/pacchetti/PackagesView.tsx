"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";
import { textReveal02 } from "../textReveal02";

export function PackagesView() {
  const lang = useSiteLang();
  const t = PK[lang];
  const root = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<DurationId | "all">("all");
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const [theme, setTheme] = useState<ThemeId | "all">("all");

  const list = useMemo(() => PACKAGES.filter((p) => {
    if (duration !== "all" && durationBand(p.nights) !== duration) return false;
    if (zone !== "all" && p.zone !== zone) return false;
    if (theme !== "all" && p.theme !== theme) return false;
    return true;
  }), [duration, zone, theme]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    textReveal02(el);
    const w = window as unknown as { gsap?: { fromTo: (t: unknown, a: object, b: object) => { kill: () => void; scrollTrigger?: { kill: () => void } } }; ScrollTrigger?: { refresh: () => void } };
    const gsap = w.gsap;
    if (!gsap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = [...el.querySelectorAll(".pk-tilt")];
    if (reduce) return;
    const tweens = cards.map((card) => gsap.fromTo(card, { autoAlpha: 0, y: 64 }, {
      autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%", once: true },
    }));
    w.ScrollTrigger?.refresh();
    return () => tweens.forEach((tw) => { tw.scrollTrigger?.kill(); tw.kill(); });
  }, [lang, list]);

  return (
    <div className="pk-page" ref={root}>
      <header className="service-stories-header pk-head">
        <p data-reveal-02="words">✦ {t.kicker} ✦</p>
        <h1 data-reveal-02="lines">{t.title}</h1>
        <p className="pk-lead">{t.intro}</p>
      </header>

      <div className="pk-filters">
        <Filter label={t.duration} value={duration} onChange={setDuration} options={[{ id: "all" as const, label: t.all }, ...DURATIONS.map((d) => ({ id: d.id, label: d[lang] }))]} />
        <Filter label={t.zone} value={zone} onChange={setZone} options={[{ id: "all" as const, label: t.all }, ...ZONES.map((z) => ({ id: z.id, label: z[lang] }))]} />
        <Filter label={t.theme} value={theme} onChange={setTheme} options={[{ id: "all" as const, label: t.all }, ...THEMES.map((th) => ({ id: th.id, label: th[lang] }))]} />
      </div>

      {list.length === 0 ? <p className="pk-empty">{t.empty}</p> : (
        <ol className="pk-stack">
          {list.map((p, i) => {
            const copy = p[lang];
            const themeLabel = THEMES.find((th) => th.id === p.theme)?.[lang] ?? "";
            const zoneLabel = ZONES.find((z) => z.id === p.zone)?.[lang] ?? "";
            const side = i % 2 === 0 ? "is-left" : "is-right";
            return (
              <li className={`pk-tilt ${side}`} key={p.slug} style={{ zIndex: i + 1 }}>
                <a className="pk-photo service-story-card" href={`/pacchetti/${p.slug}`} aria-label={copy.title}>
                  <img src={p.images[0]} alt="" />
                  <span className="service-card-overlay" />
                  <span className="pk-badge">{t.example}</span>
                  <span className="pk-cap">{copy.title}</span>
                  <span className="pk-plus" aria-hidden="true">+</span>
                </a>
                <p className="pk-facts">
                  <span>{t.nights(p.days, p.nights)}</span>
                  <span>{zoneLabel}</span>
                  <span>{themeLabel}</span>
                  <strong>{t.from} {formatEuro(p.priceFrom)} {t.per}</strong>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function Filter<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { id: T; label: string }[] }) {
  return (
    <div className="pk-filter">
      <span>{label}</span>
      <div className="pk-chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={`pk-chip${value === o.id ? " is-on" : ""}`} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
