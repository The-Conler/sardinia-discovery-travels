"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { PK } from "./copy";
import { DURATIONS, PACKAGES, THEMES, ZONES, durationBand, formatEuro } from "./packages";
import type { DurationId, SamplePackage, ThemeId, ZoneId } from "./packages";
import { useSiteLang } from "../siteLang";
import { HIcon } from "../hotels/icons";

const ZONE_CARD: Record<ZoneId, { src: string; focus: string; icon: "waves" | "arch" | "mountains" | "cliff" | "nuraghe"; shape: string }> = {
  nord: { src: "/destinations/north/nd-costa-smeralda.webp", focus: "center 34%", icon: "waves", shape: "M18 108C8 62 62 18 108 64c28 28 8 78-28 74-22-2-48-6-62-30z" },
  sud: { src: "/destinations/south-sardinia.png", focus: "center 42%", icon: "arch", shape: "M118 28c48-8 78 48 42 92-28 34-86 18-98-22-8-28 18-62 56-70z" },
  est: { src: "/off-road/hero-supramonte-track.webp", focus: "center 40%", icon: "mountains", shape: "M12 96C28 42 96 16 146 72c28 32-6 86-58 78C42 142-2 128 12 96z" },
  ovest: { src: "/destinations/west-sardinia.png", focus: "center 48%", icon: "cliff", shape: "M46 36c52-28 118 8 102 68-14 48-92 62-124 18C8 90 14 52 46 36z" },
  interno: { src: "/destinations/interlands.png", focus: "center 30%", icon: "nuraghe", shape: "M86 22c52 8 74 62 40 104-32 40-96 8-104-40-6-34 22-72 64-64z" },
};

/* Destination one-liners already on the site. English only; the Italian
   packages view uses the same sentences because no Italian version exists. */
const ZONE_LINE: Record<ZoneId, string> = {
  nord: "Granite coastlines, refined towns, and luminous bays.",
  sud: "Soft beaches, ancient routes, and sun-warmed villages.",
  est: "Blue coves, mountain trails, and dramatic sea roads.",
  ovest: "Wild cliffs, surf horizons, and untouched shores.",
  interno: "Mountain villages, vineyards, and slow inland rituals.",
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
  const stuckBar = (
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
  );
  const bar = stuck && typeof document !== "undefined" ? createPortal(stuckBar, document.body) : null;

  return (
    <div className="pk-page" ref={root}>
      <section className="pk-hero pk-hero-home ht-page">
        <img src={hero} alt="" />
        <div className="pk-shade" />
        <div className="ht-hero-inner">
          <div className="pk-hero-copy">
            <p className="ht-kicker">{t.kicker}</p>
            <h1 className="ht-title ht-title--xl">{t.title}</h1>
            <p className="ht-lead">{t.heroSub}</p>
            <a className="button-02" href="#pk-packages" onClick={explorePackages}>
              <span className="inner">{t.heroCta}</span>
              <span className="circle" aria-hidden="true"><span>→</span></span>
            </a>
          </div>
          <form className="ht-search" role="search" aria-label={t.search} onSubmit={(event) => { event.preventDefault(); explorePackages(event); }}>
            <div className="ht-search-fields">
              <label className="ht-sf">
                <span className="ht-sf-label">{t.duration}</span>
                <span className="ht-sf-box">
                  <HIcon name="calendar" size={20} />
                  <select value={duration} aria-label={t.duration} onChange={(event) => setDuration(event.target.value as DurationId | "all")}>
                    <option value="all">{t.anyLength}</option>
                    {DURATIONS.map((item) => <option key={item.id} value={item.id}>{item[lang]}</option>)}
                  </select>
                  <span className="ht-sf-chev"><HIcon name="chevronDown" size={18} /></span>
                </span>
              </label>
              <label className="ht-sf">
                <span className="ht-sf-label">{t.zone}</span>
                <span className="ht-sf-box">
                  <HIcon name="pin" size={20} />
                  <select value={zone} aria-label={t.zone} onChange={(event) => setZone(event.target.value as ZoneId | "all")}>
                    <option value="all">{t.allAreas}</option>
                    {ZONES.map((item) => <option key={item.id} value={item.id}>{item[lang]}</option>)}
                  </select>
                  <span className="ht-sf-chev"><HIcon name="chevronDown" size={18} /></span>
                </span>
              </label>
              <label className="ht-sf">
                <span className="ht-sf-label">{t.theme}</span>
                <span className="ht-sf-box">
                  <HIcon name="mountain" size={20} />
                  <select value={theme} aria-label={t.theme} onChange={(event) => setTheme(event.target.value as ThemeId | "all")}>
                    <option value="all">{t.allThemes}</option>
                    {THEMES.map((item) => <option key={item.id} value={item.id}>{item[lang]}</option>)}
                  </select>
                  <span className="ht-sf-chev"><HIcon name="chevronDown" size={18} /></span>
                </span>
              </label>
            </div>
            <div className="ht-search-foot">
              <button type="submit" className="ht-search-btn">
                <HIcon name="search" size={18} />
                {t.search}
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="pk-search-sentinel" ref={sentinel} aria-hidden="true" />
      {bar}

      <div className="ht-page pk-examples">
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
                    <HIcon name="arrowLeft" size={16} />
                  </button>
                  <button type="button" className="ht-arrow" aria-label={lang === "it" ? "Esempi successivi" : "Next examples"} disabled={!canNext} onClick={() => step(1)}>
                    <HIcon name="arrowRight" size={16} />
                  </button>
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
          </div>
        </section>
      </div>

      <section className="pk-block ht-section ht-page pk-areas">
        <div className="pk-areas-inner">
          <div className="ht-head">
            <div>
              <p className="ht-kicker">{lang === "it" ? "Zone" : "Areas"}</p>
              <h2 className="ht-title">{t.zones}</h2>
              <p className="ht-lead">{t.zonesLead}</p>
            </div>
          </div>
          <div className="pk-areas-track" role="list">
            {ZONES.map((z) => {
              const card = ZONE_CARD[z.id];
              return (
                <button key={z.id} type="button" className={`pk-area pk-area--${z.id}${zone === z.id ? " is-on" : ""}`} role="listitem" onClick={() => pickZone(z.id)}>
                  <span className="pk-area-photo">
                    <img src={card.src} alt="" style={{ objectPosition: card.focus }} />
                  </span>
                  <span className="pk-area-shade" aria-hidden="true" />
                  <span className="pk-area-body">
                    <ZoneIcon name={card.icon} />
                    <strong>{z[lang]}</strong>
                    <span className="pk-area-line">
                      <em>{ZONE_LINE[z.id]}</em>
                      <span className="pk-area-go" aria-hidden="true">
                        <HIcon name="arrowRight" size={16} />
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pk-block ht-section ht-page pk-reco" id="pk-packages">
        <div className="pk-reco-inner">
          <div className="ht-head">
            <div>
              <p className="ht-kicker">{t.examples}</p>
              <h2 className="ht-title">{t.recoTitle}</h2>
            </div>
          </div>
          <div className="pk-reco-track" role="list">
            {PACKAGES.map((p) => <PackageCard key={p.slug} pkg={p} lang={lang} />)}
          </div>
        </div>
      </section>

      <section className="pk-block ht-section ht-page">
        <div className="ht-inner">
          <div className="ht-head">
            <div>
              <p className="ht-kicker">{t.nav}</p>
              <h2 className="ht-title">{t.why}</h2>
            </div>
          </div>
          <ol className="ht-steps">
            {t.whyItems.map((item) => (
              <li className="ht-step" key={item.title}>
                <span className="ht-step-top">
                  <span className="ht-step-badge"><HIcon name={item.icon} size={26} /></span>
                </span>
                <h3 className="ht-step-title">{item.title}</h3>
                <p className="ht-step-text">{item.text}</p>
              </li>
            ))}
          </ol>
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

function ZoneIcon({ name }: { name: "waves" | "arch" | "mountains" | "cliff" | "nuraghe" }) {
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
      {name === "cliff" && (
        <>
          <path d="M14 17 18 6l3 2v9" {...common} />
          <path d="M3 17c1.2 1 2.2 1.4 3.4 1.4C8.6 18.4 8.6 16.4 11 16.4s2.4 2 4.6 2" {...common} />
        </>
      )}
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
        <p className="ht-card-meta"><HIcon name="clock" size={16} />{t.nights(pkg.days, pkg.nights)}, {zone}</p>
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
            <span className="ht-price-night">/{lang === "it" ? "persona" : "person"}</span>
          </p>
          <a className="ht-arrow" href={`/pacchetti/${pkg.slug}`} aria-label={t.discover}>
            <HIcon name="arrowRight" size={16} />
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
