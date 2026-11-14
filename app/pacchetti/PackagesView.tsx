"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, SamplePackage, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";

const ZONE_IMAGE: Record<ZoneId, string> = {
  nord: "/destinations/north/nd-costa-smeralda.webp",
  sud: "/destinations/south-sardinia.png",
  est: "/off-road/hero-supramonte-track.webp",
  ovest: "/destinations/west-sardinia.png",
  interno: "/destinations/interlands.png",
};

const THEME_IMAGE: Record<ThemeId, string> = {
  mare: "/experiences/boat-tour.webp",
  natura: "/off-road/area-supramonte.webp",
  enogastronomia: "/destinations/north/ns-wine.webp",
  cultura: "/about/tile-culture-traditions.webp",
};

export function PackagesView() {
  const lang = useSiteLang();
  const t = PK[lang];
  const root = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    el.classList.add("pk-animate");
    const nodes = [...el.querySelectorAll("[data-reveal]")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    }, { rootMargin: "0px 0px 30% 0px", threshold: 0 });
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [list, lang]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      const next = !entry.isIntersecting;
      setStuck(next);
      if (!next) setFiltersOpen(false);
    }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function pickZone(id: ZoneId) {
    setZone(id);
    document.getElementById("pk-packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function pickTheme(id: ThemeId) {
    setTheme(id);
    document.getElementById("pk-packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hero = PACKAGES[0]?.images[0];
  const search = (
    <div className={`pk-search${stuck ? " is-stuck" : ""}${filtersOpen ? " is-open" : ""}`}>
      <div className="pk-search-card">
        {stuck && (
            <button type="button" className="pk-filters-toggle trip-tab" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
            {t.filters}
          </button>
        )}
        <Filter label={t.duration} value={duration} onChange={setDuration} options={[{ id: "all" as const, label: t.all }, ...DURATIONS.map((d) => ({ id: d.id, label: d[lang] }))]} />
        <Filter label={t.zone} value={zone} onChange={setZone} options={[{ id: "all" as const, label: t.all }, ...ZONES.map((z) => ({ id: z.id, label: z[lang] }))]} />
        <Filter label={t.theme} value={theme} onChange={setTheme} options={[{ id: "all" as const, label: t.all }, ...THEMES.map((th) => ({ id: th.id, label: th[lang] }))]} />
      </div>
    </div>
  );
  const bar = stuck && typeof document !== "undefined" ? createPortal(search, document.body) : search;

  return (
    <div className="pk-page" ref={root}>
      <section className="pk-hero">
        {hero && <img src={hero} alt="" />}
        <div className="pk-shade" />
        <div className="pk-hero-copy">
          <p className="pk-kicker">✦ {t.kicker} ✦</p>
          <h1>{t.title}</h1>
          <p className="pk-sub">{t.sub}</p>
        </div>
      </section>

      <div className="pk-search-sentinel" ref={sentinel} aria-hidden="true" />
      {stuck && <div className="pk-search-spacer" aria-hidden="true" />}
      {bar}

      <section className="pk-block" data-reveal>
        <h2>{t.deals}</h2>
        <p className="pk-intro">{t.intro}</p>
        <div className="pk-deals">
          {PACKAGES.map((p) => <DealCard key={p.slug} pkg={p} lang={lang} />)}
        </div>
      </section>

      <section className="pk-block pk-block--lift" data-reveal>
        <h2>{t.zones}</h2>
        <div className="pk-zones">
          {ZONES.map((z) => {
            const inZone = PACKAGES.filter((p) => p.zone === z.id);
            const cheapest = inZone.reduce((min, p) => Math.min(min, p.priceFrom), Number.POSITIVE_INFINITY);
            return (
              <button key={z.id} type="button" className={`pk-zone service-story-card${zone === z.id ? " is-on" : ""}`} onClick={() => pickZone(z.id)}>
                <img src={ZONE_IMAGE[z.id]} alt="" />
                <span>
                  <strong>{z[lang]}</strong>
                  {inZone.length > 0 && <em>{t.from} {formatEuro(cheapest)}</em>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="pk-block" id="pk-packages" data-reveal>
        <h2>{t.recommended}</h2>
        {list.length === 0 ? <p className="pk-empty">{t.empty}</p> : (
          <div className="pk-grid">
            {list.map((p) => <PackageCard key={p.slug} pkg={p} lang={lang} />)}
          </div>
        )}
      </section>

      <section className="pk-block pk-block--lift" data-reveal>
        <h2>{t.themes}</h2>
        <div className="pk-themes">
          {THEMES.map((th) => (
            <button key={th.id} type="button" className={`pk-theme service-story-card${theme === th.id ? " is-on" : ""}`} onClick={() => pickTheme(th.id)}>
              <img src={THEME_IMAGE[th.id]} alt="" />
              <strong>{th[lang]}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="pk-block" data-reveal>
        <h2>{t.why}</h2>
        <div className="pk-why">
          {t.whyItems.map((item) => (
            <article className="ct-tile" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pk-close" data-reveal>
        <h2>{t.closing}</h2>
        <p>{t.closingText}</p>
        <SiteButton href={`/contact?lang=${lang}`}>{t.closingCta}</SiteButton>
      </section>
    </div>
  );
}

function SiteButton({ href, children }: { href: string; children: string }) {
  return (
    <a className="button-02 button-02--teal" href={href}>
      <span className="inner">{children}</span>
      <span className="circle" aria-hidden="true"><span>→</span></span>
    </a>
  );
}

function ArrowLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="arrow_link white" href={href}>
      <span>
        {children}
        <svg xmlns="http://www.w3.org/2000/svg" width="50.987" height="14.208" viewBox="0 0 50.987 14.208" aria-hidden="true">
          <g transform="translate(-1143 -7586.331)">
            <g transform="translate(1164.072 7575.435)">
              <path d="M7.5,18H57.073" transform="translate(-28.573)" fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="2" />
              <path d="M18,7.5l6.4,6.4-6.4,6.4" transform="translate(4.103 4.103)" fill="none" stroke="#fff" strokeWidth="2" />
            </g>
          </g>
        </svg>
      </span>
    </a>
  );
}

function DealCard({ pkg, lang }: { pkg: SamplePackage; lang: "it" | "en" }) {
  const t = PK[lang];
  const copy = pkg[lang];
  const zone = ZONES.find((z) => z.id === pkg.zone)?.[lang] ?? "";
  return (
    <article className="pk-deal">
      <a className="pk-deal-photo service-story-card" href={`/pacchetti/${pkg.slug}`}>
        <img src={pkg.images[0]} alt="" />
        <span className="pk-badge">{t.example}</span>
      </a>
      <div className="pk-deal-body">
        <h3>{copy.title}</h3>
        <p className="pk-meta">{t.nights(pkg.days, pkg.nights)} · {zone}</p>
        <p>{copy.intro}</p>
        <p className="pk-price">{t.from} {formatEuro(pkg.priceFrom)} {t.per}</p>
        <ArrowLink href={`/pacchetti/${pkg.slug}`}>{t.discover}</ArrowLink>
      </div>
    </article>
  );
}

function PackageCard({ pkg, lang }: { pkg: SamplePackage; lang: "it" | "en" }) {
  const t = PK[lang];
  const copy = pkg[lang];
  const zone = ZONES.find((z) => z.id === pkg.zone)?.[lang] ?? "";
  const theme = THEMES.find((th) => th.id === pkg.theme)?.[lang] ?? "";
  return (
    <article className="pk-card">
      <a className="pk-card-photo service-story-card" href={`/pacchetti/${pkg.slug}`}>
        <img src={pkg.images[0]} alt="" />
        <span className="pk-badge">{t.example}</span>
        <span className="pk-nights">{t.nights(pkg.days, pkg.nights)}</span>
      </a>
      <div className="pk-card-body">
        <h3>{copy.title}</h3>
        <p className="pk-meta">{zone} · {theme}</p>
        <p className="pk-price">{t.from} {formatEuro(pkg.priceFrom)}</p>
        <p className="pk-per">{t.per}</p>
        <div className="pk-actions">
          <SiteButton href={`/pacchetti/${pkg.slug}`}>{t.discover}</SiteButton>
          <ArrowLink href={`/contact?package=${pkg.slug}&lang=${lang}`}>{t.request}</ArrowLink>
        </div>
      </div>
    </article>
  );
}

function Filter<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { id: T; label: string }[] }) {
  return (
    <div className="pk-filter">
      <span>{label}</span>
      <div className="pk-chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={`pk-chip trip-tab${value === o.id ? " is-on is-active" : ""}`} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
