"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, SamplePackage, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";
import { HIcon } from "../hotels/icons";

const ZONE_IMAGE: Record<ZoneId, string> = {
  nord: "/destinations/north/nd-costa-smeralda.webp",
  sud: "/destinations/south-sardinia.png",
  est: "/off-road/hero-supramonte-track.webp",
  ovest: "/destinations/west-sardinia.png",
  interno: "/destinations/interlands.png",
};

export function PackagesView() {
  const lang = useSiteLang();
  const t = PK[lang];
  const root = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [overFooter, setOverFooter] = useState(false);
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

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setOverFooter(entry.isIntersecting), { threshold: 0 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const updateArrows = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setCanPrev(t.scrollLeft > 4);
    setCanNext(t.scrollLeft + t.clientWidth < t.scrollWidth - 4);
  }, []);
  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);
  const snapTimer = useRef<number | undefined>(undefined);
  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>(".ht-card");
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    const size = card ? card.offsetWidth + gap : t.clientWidth;
    const max = t.scrollWidth - t.clientWidth;
    const target = Math.max(0, Math.min(max, (Math.round(t.scrollLeft / size) + dir) * size));
    t.style.scrollSnapType = "none";
    t.scrollTo({ left: target, behavior: "smooth" });
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => {
      t.style.scrollSnapType = "";
    }, 700);
  };
  const drag = useRef<{ x: number; left: number; moved: boolean; id: number; k: number } | null>(null);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const t = trackRef.current;
    if (!t) return;
    const w = t.getBoundingClientRect().width;
    drag.current = { x: e.clientX, left: t.scrollLeft, moved: false, id: e.pointerId, k: w > 0 ? t.clientWidth / w : 1 };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const t = trackRef.current;
    if (!d || !t) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      t.classList.add("is-dragging");
      t.setPointerCapture(d.id);
    }
    if (d.moved) t.scrollLeft = d.left - dx * d.k;
  };
  const endDrag = () => {
    const d = drag.current;
    const t = trackRef.current;
    drag.current = null;
    if (!d || !t || !d.moved) return;
    t.classList.remove("is-dragging");
    const stop = (ev: MouseEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    t.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(() => t.removeEventListener("click", stop, { capture: true }), 0);
  };
  const toggleSaved = (id: string) => setSaved((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  function pickZone(id: ZoneId) {
    setZone(id);
    document.getElementById("pk-packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hero = PACKAGES[0]?.images[0];
  const search = (
    <div className={`pk-search${stuck ? " is-stuck" : ""}${filtersOpen ? " is-open" : ""}${stuck && overFooter ? " is-hidden" : ""}`}>
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

      <div className="ht-page pk-examples" data-reveal>
        <section className="ht-section ht-stays" aria-labelledby="pk-examples-title">
          <div className="ht-inner">
            <div className="ht-head ht-head--stays">
              <div>
                <p className="ht-kicker">{t.examples}</p>
                <h2 id="pk-examples-title" className="ht-title">{t.deals}</h2>
                <p className="ht-lead">{t.intro}</p>
              </div>
              <div className="ht-stays-side">
                <div className="ht-arrows">
                  <button type="button" className="ht-arrow" aria-label={lang === "it" ? "Esempi precedenti" : "Previous examples"} disabled={!canPrev} onClick={() => step(-1)}>
                    <HIcon name="arrowLeft" size={20} />
                  </button>
                  <button type="button" className="ht-arrow" aria-label={lang === "it" ? "Esempi successivi" : "Next examples"} disabled={!canNext} onClick={() => step(1)}>
                    <HIcon name="arrowRight" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="ht-track"
            ref={trackRef}
            role="list"
            aria-label={t.deals}
            onScroll={updateArrows}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(e) => e.preventDefault()}
          >
            {PACKAGES.map((p) => (
              <DealCard key={p.slug} pkg={p} lang={lang} saved={saved.has(p.slug)} onSave={() => toggleSaved(p.slug)} />
            ))}
          </div>
        </section>
      </div>

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

const CHIPS: Record<ThemeId, { icon: string; it: string; en: string }[]> = {
  mare: [
    { icon: "ship", it: "Barca", en: "Boat" },
    { icon: "seaview", it: "Vista mare", en: "Sea view" },
    { icon: "parking", it: "Parcheggio", en: "Parking" },
  ],
  natura: [
    { icon: "mountain", it: "Trekking", en: "Hiking" },
    { icon: "seaview", it: "Natura", en: "Nature" },
    { icon: "users", it: "Privato", en: "Private" },
  ],
  enogastronomia: [
    { icon: "breakfast", it: "Cibo", en: "Food" },
    { icon: "wine", it: "Vino", en: "Wine" },
    { icon: "pin", it: "Locale", en: "Local" },
  ],
  cultura: [
    { icon: "landmark", it: "Cultura", en: "Culture" },
    { icon: "note", it: "Storia", en: "History" },
    { icon: "mountain", it: "Natura", en: "Nature" },
  ],
};

function shortTitle(title: string) {
  return title.replace(/^(Esempio|Example):\s*/i, "");
}

function euroMark(amount: number) {
  return `€${formatEuro(amount).replace(/\s*€$/, "")}`;
}

function DealCard({ pkg, lang, saved, onSave }: { pkg: SamplePackage; lang: "it" | "en"; saved: boolean; onSave: () => void }) {
  const t = PK[lang];
  const copy = pkg[lang];
  const zone = ZONES.find((z) => z.id === pkg.zone)?.[lang] ?? "";
  return (
    <article className="ht-card" role="listitem" aria-label={shortTitle(copy.title)}>
      <img className="ht-card-img" src={pkg.images[0]} alt="" loading="lazy" decoding="async" draggable={false} />
      <div className="ht-card-shade" aria-hidden="true" />
      <div className="ht-card-top">
        <span className="pk-badge">{t.example}</span>
        <button type="button" className={`ht-heart${saved ? " is-on" : ""}`} aria-pressed={saved} aria-label={lang === "it" ? `Salva ${shortTitle(copy.title)}` : `Save ${shortTitle(copy.title)}`} onClick={onSave}>
          <HIcon name="heart" size={18} />
        </button>
      </div>
      <div className="ht-card-body">
        <h3 className="ht-card-title">{shortTitle(copy.title)}</h3>
        <p className="ht-card-meta"><HIcon name="clock" size={16} />{t.nights(pkg.days, pkg.nights)} · {zone}</p>
        <p className="ht-card-text">{copy.intro}</p>
        <ul className="ht-amen">
          {CHIPS[pkg.theme].map((chip) => (
            <li key={chip.icon}><HIcon name={chip.icon} size={16} />{chip[lang]}</li>
          ))}
        </ul>
        <div className="pk-card-foot">
          <p className="ht-price">
            <span className="ht-price-from">{t.from}</span>
            <strong>{euroMark(pkg.priceFrom)}</strong>
            <span className="ht-price-night">/ {t.per}</span>
          </p>
          <a className="ht-arrow" href={`/pacchetti/${pkg.slug}`} aria-label={t.discover}><HIcon name="arrowRight" size={18} /></a>
        </div>
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
