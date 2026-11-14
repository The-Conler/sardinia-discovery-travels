"use client";

import { useMemo, useState } from "react";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";

export function PackagesView() {
  const lang = useSiteLang();
  const t = PK[lang];
  const [duration, setDuration] = useState<DurationId | "all">("all");
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const [theme, setTheme] = useState<ThemeId | "all">("all");

  const list = useMemo(() => PACKAGES.filter((p) => {
    if (duration !== "all" && durationBand(p.nights) !== duration) return false;
    if (zone !== "all" && p.zone !== zone) return false;
    if (theme !== "all" && p.theme !== theme) return false;
    return true;
  }), [duration, zone, theme]);

  return (
    <div className="pk-page">
      <header className="pk-hero">
        <p className="pk-kicker">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p className="pk-lead">{t.intro}</p>
      </header>

      <div className="pk-filters" role="group" aria-label={t.title}>
        <Filter label={t.duration} value={duration} onChange={setDuration} options={[{ id: "all", label: t.all }, ...DURATIONS.map((d) => ({ id: d.id, label: d[lang] }))]} />
        <Filter label={t.zone} value={zone} onChange={setZone} options={[{ id: "all", label: t.all }, ...ZONES.map((z) => ({ id: z.id, label: z[lang] }))]} />
        <Filter label={t.theme} value={theme} onChange={setTheme} options={[{ id: "all", label: t.all }, ...THEMES.map((th) => ({ id: th.id, label: th[lang] }))]} />
      </div>

      {list.length === 0 ? <p className="pk-empty">{t.empty}</p> : (
        <ul className="pk-grid">
          {list.map((p) => {
            const copy = p[lang];
            const themeLabel = THEMES.find((th) => th.id === p.theme)?.[lang] ?? "";
            const zoneLabel = ZONES.find((z) => z.id === p.zone)?.[lang] ?? "";
            return (
              <li key={p.slug}>
                <a className="pk-card" href={`/pacchetti/${p.slug}`}>
                  <span className="pk-card-photo">
                    <img src={p.images[0]} alt="" />
                    <span className="pk-badge">{t.example}</span>
                  </span>
                  <span className="pk-card-body">
                    <span className="pk-card-theme">{themeLabel}</span>
                    <span className="pk-card-title">{copy.title}</span>
                    <span className="pk-card-meta">{t.nights(p.days, p.nights)} · {zoneLabel}</span>
                    <span className="pk-card-price">{t.from} {formatEuro(p.priceFrom)} {t.per}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
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
