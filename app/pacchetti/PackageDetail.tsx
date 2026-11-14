"use client";

import { useEffect, useRef, useState } from "react";
import { PK } from "./copy";
import { THEMES, ZONES, formatEuro } from "./packages";
import type { SamplePackage } from "./packages";
import { useSiteLang } from "../siteLang";

export function PackageDetail({ pkg }: { pkg: SamplePackage }) {
  const lang = useSiteLang();
  const t = PK[lang];
  const copy = pkg[lang];
  const root = useRef<HTMLElement>(null);
  const [photo, setPhoto] = useState(0);
  const [open, setOpen] = useState(0);
  const [bar, setBar] = useState(false);
  const theme = THEMES.find((th) => th.id === pkg.theme)?.[lang] ?? "";
  const zone = ZONES.find((z) => z.id === pkg.zone)?.[lang] ?? "";
  const contact = `/contact?package=${pkg.slug}&lang=${lang}`;

  useEffect(() => {
    const hero = root.current?.querySelector(".pk-dhero");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setBar(!entry.isIntersecting), { threshold: 0.2 });
    io.observe(hero);
    return () => io.disconnect();
  }, [pkg.slug]);

  return (
    <article className="pk-detail" ref={root}>
      <header className="pk-dhero">
        <img src={pkg.images[photo]} alt="" />
        <div className="pk-shade" />
        <div className="pk-hero-copy">
          <p className="pk-kicker">✦ {t.kicker} ✦</p>
          <h1>{copy.title}</h1>
          <span className="pk-badge">{t.example}</span>
          <p className="pk-facts">{t.nights(pkg.days, pkg.nights)} · {zone} · {theme}</p>
        </div>
      </header>

      <div className="pk-dlayout">
        <div className="pk-dbody">
        <p className="pk-lead">{copy.intro}</p>

        <ul className="pk-tiles">
          <li><span>{t.duration}</span><strong>{t.nights(pkg.days, pkg.nights)}</strong></li>
          <li><span>{t.zone}</span><strong>{zone}</strong></li>
          <li><span>{t.theme}</span><strong>{theme}</strong></li>
          <li><span>{t.from}</span><strong>{formatEuro(pkg.priceFrom)}</strong></li>
        </ul>

        <div className="pk-thumbs" role="group" aria-label={t.gallery}>
          {pkg.images.map((src, i) => (
            <button key={src} type="button" className={i === photo ? "is-on" : ""} aria-pressed={i === photo} onClick={() => setPhoto(i)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>

        <ol className="pk-days">
          {copy.days.map((day, i) => {
            const on = open === i;
            return (
              <li key={day.title} className={on ? "is-open" : ""}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                  <span>{t.day(i + 1)}</span>
                  <strong>{day.title}</strong>
                  <i aria-hidden="true">{on ? "–" : "+"}</i>
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
          <ul>{pkg.dates.map((d) => <li key={d.en}>{d[lang]}</li>)}</ul>
          <p className="pk-price">{t.from} {formatEuro(pkg.priceFrom)} {t.per}</p>
          <p className="pk-note">{t.priceNote}</p>
        </section>
        </div>

        <aside className={`pk-pricebox${bar ? " is-on" : ""}`}>
          <span className="pk-badge">{t.example}</span>
          <p className="pk-price">{t.from} {formatEuro(pkg.priceFrom)}</p>
          <p className="pk-per">{t.per}</p>
          <p className="pk-meta">{t.nights(pkg.days, pkg.nights)} · {zone}</p>
          <p className="pk-note">{t.priceNote}</p>
          <a className="pk-pill" href={contact}>{t.request}</a>
        </aside>
      </div>

      <div className={`pk-buybar${bar ? " is-on" : ""}`}>
        <div>
          <strong>{copy.title}</strong>
          <span>{t.from} {formatEuro(pkg.priceFrom)} {t.per}</span>
        </div>
        <a className="pk-pill" href={contact}>{t.request}</a>
      </div>
    </article>
  );
}
