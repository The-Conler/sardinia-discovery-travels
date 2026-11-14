"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";

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

  const hero = PACKAGES[0]?.images[0];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    el.classList.add("pk-animate");
    const bands = [...el.querySelectorAll(".pk-band")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    }, { threshold: 0.28 });
    bands.forEach((band) => io.observe(band));
    return () => io.disconnect();
  }, [list]);

  return (
    <div className="pk-page" ref={root}>
      <section className="pk-hero">
        {hero && <img src={hero} alt="" />}
        <div className="pk-shade" />
        <div className="pk-hero-copy">
          <p className="pk-kicker">✦ {t.kicker} ✦</p>
          <h1>{t.title}</h1>
          <p className="pk-sub">{t.sub}</p>
          <p className="pk-disclaimer">{t.intro}</p>
        </div>
        <button
          type="button"
          className="pk-cue"
          onClick={() => document.getElementById("pk-list")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span>{t.scroll}</span>
          <i aria-hidden="true" />
        </button>
      </section>

      <div className="pk-filters" id="pk-list">
        <div className="pk-bar">
          <Filter label={t.duration} value={duration} onChange={setDuration} options={[{ id: "all" as const, label: t.all }, ...DURATIONS.map((d) => ({ id: d.id, label: d[lang] }))]} />
          <Filter label={t.zone} value={zone} onChange={setZone} options={[{ id: "all" as const, label: t.all }, ...ZONES.map((z) => ({ id: z.id, label: z[lang] }))]} />
          <Filter label={t.theme} value={theme} onChange={setTheme} options={[{ id: "all" as const, label: t.all }, ...THEMES.map((th) => ({ id: th.id, label: th[lang] }))]} />
        </div>
      </div>

      {list.length === 0 ? <p className="pk-empty">{t.empty}</p> : list.map((p) => {
        const copy = p[lang];
        const themeLabel = THEMES.find((th) => th.id === p.theme)?.[lang] ?? "";
        const zoneLabel = ZONES.find((z) => z.id === p.zone)?.[lang] ?? "";
        const tagline = copy.intro.split(". ")[0].replace(/\.$/, "");
        return (
          <section className="pk-band" key={p.slug}>
            <div className="pk-band-copy">
              <span className="pk-badge">{t.example}</span>
              <h2>{copy.title}</h2>
              <p className="pk-tag">{tagline}.</p>
              <p className="pk-facts">{t.nights(p.days, p.nights)} · {zoneLabel} · {themeLabel}</p>
              <p className="pk-price">{t.from} {formatEuro(p.priceFrom)} {t.per}</p>
              <div className="pk-actions">
                <a className="pk-pill" href={`/pacchetti/${p.slug}`}>{t.discover}</a>
                <a className="pk-link" href={`/contact?package=${p.slug}&lang=${lang}`}>{t.request} ›</a>
              </div>
            </div>
            <a className="pk-frame" href={`/pacchetti/${p.slug}`} aria-label={copy.title}>
              <img src={p.images[0]} alt="" />
            </a>
          </section>
        );
      })}
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
