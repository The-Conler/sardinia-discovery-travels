"use client";

import { useState } from "react";
import { PK } from "./copy";
import { THEMES, ZONES, formatEuro } from "./packages";
import type { SamplePackage } from "./packages";
import { useSiteLang } from "../siteLang";

export function PackageDetail({ pkg }: { pkg: SamplePackage }) {
  const lang = useSiteLang();
  const t = PK[lang];
  const copy = pkg[lang];
  const [photo, setPhoto] = useState(0);
  const [open, setOpen] = useState(0);
  const theme = THEMES.find((th) => th.id === pkg.theme)?.[lang] ?? "";
  const zone = ZONES.find((z) => z.id === pkg.zone)?.[lang] ?? "";

  return (
    <article className="pk-detail">
      <p className="pk-kicker"><a href="/pacchetti">{t.title}</a></p>
      <div className="pk-detail-head">
        <h1>{copy.title}</h1>
        <span className="pk-badge pk-badge--inline">{t.example}</span>
      </div>
      <p className="pk-lead">{copy.intro}</p>
      <p className="pk-card-meta">{t.nights(pkg.days, pkg.nights)} · {zone} · {theme}</p>

      <div className="pk-gallery">
        <img className="pk-gallery-main" src={pkg.images[photo]} alt="" />
        <div className="pk-thumbs" role="group" aria-label={t.gallery}>
          {pkg.images.map((src, i) => (
            <button key={src} type="button" className={i === photo ? "is-on" : ""} aria-pressed={i === photo} onClick={() => setPhoto(i)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      </div>

      <ol className="pk-days">
        {copy.days.map((day, i) => {
          const on = open === i;
          return (
            <li key={day.title} className={on ? "is-open" : ""}>
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                <span>{t.day(i + 1)}</span>
                <strong>{day.title}</strong>
              </button>
              {on && <p>{day.text}</p>}
            </li>
          );
        })}
      </ol>

      <div className="pk-lists">
        <section>
          <h2>{t.included}</h2>
          <ul>{copy.included.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <h2>{t.excluded}</h2>
          <ul>{copy.excluded.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>

      <section className="pk-dates">
        <h2>{t.dates}</h2>
        <ul>
          {pkg.dates.map((d) => <li key={d.en}>{d[lang]}</li>)}
        </ul>
        <p className="pk-card-price">{t.from} {formatEuro(pkg.priceFrom)} {t.per}</p>
        <p className="pk-note">{t.priceNote}</p>
        <a className="pk-cta" href={`/contact?package=${pkg.slug}&lang=${lang}`}>{t.request}</a>
      </section>
    </article>
  );
}
