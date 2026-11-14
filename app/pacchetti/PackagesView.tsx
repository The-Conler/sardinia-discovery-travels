"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, SamplePackage, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";
import { HIcon } from "../hotels/icons";

const ZONE_CARD: Record<ZoneId, { src: string; focus: string; glow?: boolean; icon: "waves" | "arch" | "mountains" | "nuraghe" }> = {
  nord: { src: "/destinations/north/nd-costa-smeralda.webp", focus: "center 34%", icon: "waves" },
  sud: { src: "/destinations/south-sardinia.png", focus: "center 42%", glow: true, icon: "arch" },
  est: { src: "/off-road/hero-supramonte-track.webp", focus: "center 40%", icon: "mountains" },
  ovest: { src: "/destinations/west-sardinia.png", focus: "center 48%", icon: "waves" },
  interno: { src: "/destinations/interlands.png", focus: "center 30%", glow: true, icon: "nuraghe" },
};

function zoneFrom(id: ZoneId) {
  const prices = PACKAGES.filter((p) => p.zone === id).map((p) => p.priceFrom);
  return prices.length ? Math.min(...prices) : null;
}

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

  const hero = "/destinations/north/nd-costa-smeralda.webp";
  function explorePackages(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    const el = document.getElementById("pk-packages");
    const smoother = (window as unknown as { ScrollSmoother?: { get?: () => { scrollTo: (target: Element, smooth: boolean, pos: string) => void } | undefined } }).ScrollSmoother?.get?.();
    if (smoother && el) smoother.scrollTo(el, true, "top 80px");
    else el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const search = stuck ? (
    <div className={`pk-search is-stuck${filtersOpen ? " is-open" : ""}${overFooter ? " is-hidden" : ""}`}>
      <div className="pk-search-card">
        <button type="button" className="pk-filters-toggle trip-tab" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
          {t.filters}
        </button>
        {!filtersOpen ? (
          <p className="pk-filter-summary">
            {t.duration}: {duration === "all" ? t.summaryAll.duration : DURATIONS.find((d) => d.id === duration)?.[lang]}
            {" · "}
            {t.zone}: {zone === "all" ? t.summaryAll.zone : ZONES.find((z) => z.id === zone)?.[lang]}
            {" · "}
            {t.theme}: {theme === "all" ? t.summaryAll.theme : THEMES.find((th) => th.id === theme)?.[lang]}
          </p>
        ) : (
          <>
            <Filter label={t.duration} value={duration} onChange={setDuration} options={[{ id: "all" as const, label: t.all }, ...DURATIONS.map((d) => ({ id: d.id, label: d[lang] }))]} />
            <Filter label={t.zone} value={zone} onChange={setZone} options={[{ id: "all" as const, label: t.all }, ...ZONES.map((z) => ({ id: z.id, label: z[lang] }))]} />
            <Filter label={t.theme} value={theme} onChange={setTheme} options={[{ id: "all" as const, label: t.all }, ...THEMES.map((th) => ({ id: th.id, label: th[lang] }))]} />
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="pk-search pk-search--hero">
      <form className="pk-hero-bar" onSubmit={(event) => { event.preventDefault(); explorePackages(event); }}>
        <HeroField icon="calendar" label={t.duration} value={duration} onChange={setDuration} valueLabel={duration === "all" ? t.anyLength : DURATIONS.find((d) => d.id === duration)?.[lang] ?? t.anyLength} options={[{ id: "all" as const, label: t.anyLength }, ...DURATIONS.map((d) => ({ id: d.id, label: d[lang] }))]} />
        <HeroField icon="pin" label={t.zone} value={zone} onChange={setZone} valueLabel={zone === "all" ? t.allAreas : ZONES.find((z) => z.id === zone)?.[lang] ?? t.allAreas} options={[{ id: "all" as const, label: t.allAreas }, ...ZONES.map((z) => ({ id: z.id, label: z[lang] }))]} />
        <HeroField icon="compass" label={t.theme} value={theme} onChange={setTheme} valueLabel={theme === "all" ? t.allThemes : THEMES.find((th) => th.id === theme)?.[lang] ?? t.allThemes} options={[{ id: "all" as const, label: t.allThemes }, ...THEMES.map((th) => ({ id: th.id, label: th[lang] }))]} />
        <button type="submit" className="pk-hero-search" aria-label={t.heroCta}>
          <HIcon name="search" size={18} />
        </button>
      </form>
    </div>
  );
  const bar = stuck && typeof document !== "undefined" ? createPortal(search, document.body) : search;

  return (
    <div className="pk-page" ref={root}>
      <section className="pk-hero pk-hero-home">
        <img src={hero} alt="" />
        <div className="pk-hero-halo" aria-hidden="true" />
        <div className="pk-shade" />
        <div className="pk-hero-copy">
          <p className="pk-hero-kicker">
            <span>{t.kicker}</span>
            <span className="pk-hero-rule" aria-hidden="true">
              <i />
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M3 13h11l-2 3M14 13l7-5-3 8-4-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </span>
          </p>
          <h1>{t.title}</h1>
          <p className="pk-hero-sub">{t.heroSub}</p>
          <a className="pk-hero-cta" href="#pk-packages" onClick={explorePackages}>
            <span>{t.heroCta}</span>
            <span className="pk-hero-cta-go" aria-hidden="true">
              <span className="pk-hero-cta-rail">
                <span>→</span>
                <span>→</span>
              </span>
            </span>
          </a>
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
                <div className="pk-examples-titleline">
                  <h2 id="pk-examples-title" className="ht-title">{t.deals}</h2>
                  <div className="ht-arrows">
                    <button type="button" className="ht-arrow" aria-label={lang === "it" ? "Esempi precedenti" : "Previous examples"} disabled={!canPrev} onClick={() => step(-1)}>
                      <HIcon name="arrowLeft" size={16} />
                    </button>
                    <button type="button" className="ht-arrow" aria-label={lang === "it" ? "Esempi successivi" : "Next examples"} disabled={!canNext} onClick={() => step(1)}>
                      <HIcon name="arrowRight" size={16} />
                    </button>
                  </div>
                </div>
                <p className="ht-lead">{t.intro}</p>
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
          </div>
        </section>
      </div>

      <section className="pk-block ht-page pk-areas" data-reveal>
        <div className="pk-areas-inner">
          <h2 className="pk-areas-title">{t.zones}</h2>
          <div className="pk-areas-track" role="list">
            {ZONES.map((z) => {
              const card = ZONE_CARD[z.id];
              const from = zoneFrom(z.id);
              return (
                <button key={z.id} type="button" className={`pk-area pk-area--${z.id}${zone === z.id ? " is-on" : ""}`} role="listitem" onClick={() => pickZone(z.id)}>
                  <span className={`pk-area-photo${card.glow ? " has-glow" : ""}`}>
                    <img src={card.src} alt="" style={{ objectPosition: card.focus }} />
                  </span>
                  <svg className="pk-area-wave" viewBox="0 0 300 56" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 36C34 10 62 48 104 26 146 4 176 46 220 24 258 6 280 32 300 20V56H0Z" />
                  </svg>
                  <span className="pk-area-body">
                    <ZoneIcon name={card.icon} />
                    <strong>{z[lang]}</strong>
                    {from != null && <em>{t.from} {formatEuro(from)}</em>}
                    <span className="pk-area-go" aria-hidden="true">
                      <span className="pk-area-go-rail">
                        <span><HIcon name="arrowRight" size={14} /></span>
                        <span><HIcon name="arrowRight" size={14} /></span>
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pk-block ht-page pk-reco" id="pk-packages" data-reveal>
        <div className="pk-reco-inner">
          <h2 className="pk-reco-title">
            {t.recoLead}{" "}
            <span className="pk-reco-word">
              {t.recoWord}
              <svg className="pk-reco-swoosh" viewBox="0 0 160 16" aria-hidden="true">
                <path d="M2 10c16-8 30 7 48-1 16-7 26 8 44 1 16-6 28 5 46-2 8-2 14 2 18 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <div className="pk-reco-track" role="list">
            {PACKAGES.map((p) => <PackageCard key={p.slug} pkg={p} lang={lang} />)}
          </div>
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
    </div>
  );
}

const CHIPS: Record<ThemeId, { icon: string; it: string; en: string }[]> = {
  mare: [
    { icon: "ship", it: "Barca", en: "Boat" },
    { icon: "seaview", it: "Mare", en: "Sea view" },
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

function euroMark(amount: number) {
  return `€${formatEuro(amount).replace(/\s*€$/, "")}`;
}

const TICKET_NAME: Record<string, { it: string; en: string }> = {
  "esempio-costa-smeralda": { it: "Costa Smeralda", en: "Costa Smeralda" },
  "esempio-supramonte": { it: "Sentieri del Supramonte", en: "Supramonte trails" },
  "esempio-tavola-gallura": { it: "Tavola in Gallura", en: "A Gallura table" },
  "esempio-nuraghi": { it: "Nuraghi e paesi", en: "Nuraghi and villages" },
};

const CARD_FOCUS: Record<string, string> = {
  "esempio-costa-smeralda": "center 46%",
  "esempio-supramonte": "center 40%",
  "esempio-tavola-gallura": "center 72%",
  "esempio-nuraghi": "center 30%",
};

function ZoneIcon({ name }: { name: "waves" | "arch" | "mountains" | "nuraghe" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="pk-area-icon" viewBox="0 0 24 24" aria-hidden="true">
      {name === "waves" && (
        <>
          <path d="M2 8c1.2 1 2.2 1.4 3.4 1.4 2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2c1.2 0 2.2.4 3.4 1.4" {...common} />
          <path d="M2 14c1.2 1 2.2 1.4 3.4 1.4 2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2c1.2 0 2.2.4 3.4 1.4" {...common} />
        </>
      )}
      {name === "arch" && <path d="M4 20V11a8 8 0 0 1 16 0v9M4 20h16" {...common} />}
      {name === "mountains" && <path d="M3 19 9 8l4 6 2.5-3.5L21 19H3z" {...common} />}
      {name === "nuraghe" && (
        <>
          <path d="M7 20V12a5 5 0 0 1 10 0v8M6 20h12" {...common} />
          <path d="M9 16h.01M12 14h.01M15 16h.01" {...common} />
        </>
      )}
    </svg>
  );
}

function DealCard({ pkg, lang, saved, onSave }: { pkg: SamplePackage; lang: "it" | "en"; saved: boolean; onSave: () => void }) {
  const t = PK[lang];
  const copy = pkg[lang];
  const zone = ZONES.find((z) => z.id === pkg.zone)?.[lang] ?? "";
  return (
    <article className="ht-card" role="listitem" aria-label={copy.title}>
      <img className="ht-card-img" src={pkg.images[0]} alt="" loading="lazy" decoding="async" draggable={false} style={{ objectPosition: CARD_FOCUS[pkg.slug] ?? "center" }} />
      <div className="ht-card-shade" aria-hidden="true" />
      <div className="ht-card-top">
        <span className="pk-badge">{t.example}</span>
        <button type="button" className={`ht-heart${saved ? " is-on" : ""}`} aria-pressed={saved} aria-label={lang === "it" ? `Salva ${copy.title}` : `Save ${copy.title}`} onClick={onSave}>
          <HIcon name="heart" size={13} />
        </button>
      </div>
      <div className="ht-card-body">
        <h3 className="ht-card-title">{copy.title}</h3>
        <p className="ht-card-meta"><HIcon name="clock" size={12} />{t.nights(pkg.days, pkg.nights)} · {zone}</p>
        <p className="ht-card-text">{copy.intro}</p>
        <ul className="ht-amen">
          {CHIPS[pkg.theme].map((chip) => (
            <li key={chip.icon}><HIcon name={chip.icon} size={12} />{chip[lang]}</li>
          ))}
        </ul>
        <div className="pk-card-foot">
          <p className="ht-price">
            <span className="ht-price-from">{t.from}</span>
            <strong>{euroMark(pkg.priceFrom)}</strong>
            <span className="ht-price-night">/ {t.per}</span>
          </p>
          <a className="ht-arrow pk-card-go" href={`/pacchetti/${pkg.slug}`} aria-label={t.discover}>
            <span className="pk-card-go-rail">
              <span><HIcon name="arrowRight" size={14} /></span>
              <span><HIcon name="arrowRight" size={14} /></span>
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

function PackageCard({ pkg, lang }: { pkg: SamplePackage; lang: "it" | "en" }) {
  const t = PK[lang];
  const copy = pkg[lang];
  return (
    <article className="pk-ticket" role="listitem">
      <img src={pkg.images[0]} alt="" style={{ objectPosition: CARD_FOCUS[pkg.slug] ?? "center" }} />
      <div className="pk-ticket-shade" aria-hidden="true" />
      <div className="pk-ticket-lower">
        <h3>{TICKET_NAME[pkg.slug]?.[lang] ?? copy.title}</h3>
        <p className="pk-ticket-when"><HIcon name="calendar" size={14} />{t.nights(pkg.days, pkg.nights)}</p>
        <p className="pk-ticket-from">{t.from}</p>
        <p className="pk-ticket-price">{formatEuro(pkg.priceFrom)}</p>
        <p className="pk-ticket-per">{t.per}</p>
        <a className="pk-ticket-cta" href={`/pacchetti/${pkg.slug}`}>
          {t.discover}
          <span className="pk-ticket-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function HeroField<T extends string>({ icon, label, value, valueLabel, options, onChange }: { icon: "calendar" | "pin" | "compass"; label: string; value: T; valueLabel: string; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div className={`pk-hero-field${open ? " is-open" : ""}`} ref={ref}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <HIcon name={icon} size={18} />
        <span>
          <small>{label}</small>
          <strong>{valueLabel}</strong>
        </span>
        <HIcon name="chevronDown" size={16} />
      </button>
      {open && (
        <ul>
          {options.map((option) => (
            <li key={option.id}>
              <button type="button" aria-pressed={option.id === value} onClick={() => { onChange(option.id); setOpen(false); }}>
                {option.label}
              </button>
            </li>
          ))}
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
          <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={`pk-chip trip-tab${value === o.id ? " is-on is-active" : ""}`} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
