"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguageMenu } from "./useLanguageMenu";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import { SiteFooter } from "./SiteFooter";
import { MosaicReveal } from "./MosaicReveal";
import { GoogleReviews } from "./GoogleReviews";
import { CinematicHero } from "./CinematicHero";
import { FloatingActions } from "./FloatingActions";
import { textReveal02 } from "./textReveal02";
import { readSiteLang, writeSiteLang } from "./siteLang";

declare global {
  interface Window {
    gsap?: {
      timeline: (vars?: Record<string, unknown>) => {
        fromTo: (t: unknown, from: Record<string, unknown>, to: Record<string, unknown>, position?: number | string) => unknown;
        scrollTrigger?: { kill: () => void } | null;
      };
      to: (t: unknown, vars: Record<string, unknown>) => {
        scrollTrigger?: { kill: () => void } | null;
        kill: () => void;
      };
      fromTo: (t: unknown, from: Record<string, unknown>, to: Record<string, unknown>) => unknown;
      registerPlugin?: (...plugins: unknown[]) => void;
      set: (t: unknown, vars: Record<string, unknown>) => unknown;
      ticker?: {
        add: (callback: () => void) => void;
        remove: (callback: () => void) => void;
      };
    };
    ScrollTrigger?: {
      create: (vars: Record<string, unknown>) => { kill: () => void };
      refresh: () => void;
    };
    ScrollSmoother?: { get?: () => { scrollTop?: () => number } | undefined };
  }
}

const exploreItems = [
  {
    title: "blue zone",
    description: "Culture, longevity, and authentic local living.",
    image: "/explore/blue-zone.png",
  },
  {
    title: "Tailor Made Tours",
    description: "Custom routes designed around your pace and interests.",
    image: "/explore/tailor-made-tours.png",
  },
  {
    title: "private transfer",
    description: "Smooth private rides across the island.",
    image: "/explore/private-transfer.png",
  },
  {
    title: "food expierences",
    description: "Traditional flavors, shared tables, and local stories.",
    image: "/explore/food-expierences.png",
  },
];

const experienceItems = [
  {
    title: "off road",
    description: "Rugged routes through wild Sardinian landscapes.",
    image: "/experiences/off-road.png",
  },
  {
    title: "Escursioni",
    description: "Guided discoveries across coast, peaks, and trails.",
    image: "/experiences/escursioni.png",
  },
  {
    title: "hotel",
    description: "Character stays, quiet comfort, and island charm.",
    image: "/experiences/hotel.png",
  },
  {
    title: "Cooking class",
    description: "Hands-on local flavors, recipes, and table rituals.",
    image: "/experiences/cooking-class.png",
  },
  {
    title: "boat tour",
    description: "Clear-water routes, hidden coves, and sea caves.",
    image: "/experiences/boat-tour.webp",
  },
];

const destinationItems = [
  {
    title: "North Sardinia",
    description: "Granite coastlines, refined towns, and luminous bays.",
    image: "/destinations/north-sardinia.png",
  },
  {
    title: "South Sardinia",
    description: "Soft beaches, ancient routes, and sun-warmed villages.",
    image: "/destinations/south-sardinia.png",
  },
  {
    title: "West Sardinia",
    description: "Wild cliffs, surf horizons, and untouched shores.",
    image: "/destinations/west-sardinia.png",
  },
  {
    title: "East Sardinia",
    description: "Blue coves, mountain trails, and dramatic sea roads.",
    image: "/destinations/east-sardinia.png",
  },
  {
    title: "Interlands",
    description: "Mountain villages, vineyards, and slow inland rituals.",
    image: "/destinations/interlands.png",
  },
  {
    title: "Islands",
    description: "Boat days, quiet archipelagos, and crystalline water.",
    image: "/destinations/islands.png",
  },
];

const serviceCards = [
  {
    eyebrow: "Sea Routes",
    title: "Boat Tours",
    description: "Hidden coves, crystalline water, and slow coastal days.",
    image: "/experiences/boat-tour.webp",
  },
  {
    eyebrow: "Local Table",
    title: "Cooking Classes",
    description: "Hands-on recipes, island ingredients, and family traditions.",
    image: "/experiences/cooking-class.png",
  },
  {
    eyebrow: "Wild Roads",
    title: "4x4 Off Road",
    description: "Rugged routes through Sardinia’s untamed landscapes.",
    image: "/experiences/off-road.png",
  },
  {
    eyebrow: "Guided Days",
    title: "Escursioni",
    description: "Coastlines, viewpoints, and trails shaped around your pace.",
    image: "/experiences/escursioni.png",
  },
  {
    eyebrow: "Curated Stays",
    title: "Hotel",
    description: "Character stays with quiet comfort and island charm.",
    image: "/experiences/hotel.png",
  },
  {
    eyebrow: "Smooth Arrival",
    title: "Private Transfers",
    description: "Seamless private rides from airport to coast, town, or retreat.",
    image: "/explore/private-transfer.png",
  },
];

type DropdownKey = "explore" | "experiences" | "destinations";
type TripFieldKey = "where" | "type" | "when" | "travel";

const languages = [
  { code: "en", label: "English", shortLabel: "EN", flag: "🇬🇧" },
  { code: "it", label: "Italian", shortLabel: "IT", flag: "🇮🇹" },
  { code: "nl", label: "Dutch", shortLabel: "NL", flag: "🇳🇱" },
];

const tripFinderTabs = ["Experiences", "Tours", "Stays"];

const tripFinderFields = [
  { key: "type", label: "Activity / Goal" },
  { key: "where", label: "Location" },
  { key: "when", label: "Dates" },
  { key: "travel", label: "Budget" },
] as const;

const tripTypeOptions: Record<string, string[]> = {
  Experiences: ["Boat tour", "Cooking class", "Off road", "Escursioni", "Blue zone"],
  Tours: ["Tailor made tour", "Private transfer", "Food experience", "Island route"],
  Stays: ["Boutique hotel", "Sea-view retreat", "Countryside stay", "Luxury villa"],
};

const tripFieldOptions: Record<Exclude<TripFieldKey, "type">, string[]> = {
  where: [
    "North Sardinia",
    "South Sardinia",
    "West Sardinia",
    "East Sardinia",
    "Interlands",
    "Islands",
  ],
  when: ["Flexible dates", "This month", "Next month", "Summer 2027", "Custom dates"],
  // Placeholder budget bands, to be confirmed by the team.
  travel: ["€0 to €900", "€900 to €2,000", "€2,000 to €5,000", "€5,000+", "Not sure yet"],
};

export function HomeView() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
  const [renderedDropdown, setRenderedDropdown] = useState<DropdownKey | null>(null);
  const [isDropdownSwitching, setIsDropdownSwitching] = useState(false);
  const [activeExplore, setActiveExplore] = useState(0);
  const [activeDestination, setActiveDestination] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageMenu = useLanguageMenu(isLanguageOpen, setIsLanguageOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuOrigin, setMenuOrigin] = useState<CSSProperties>({});
  const [activeTripTab, setActiveTripTab] = useState(tripFinderTabs[0]);
  const [openTripField, setOpenTripField] = useState<TripFieldKey | null>(null);
  const [tripSelections, setTripSelections] = useState<Record<TripFieldKey, string>>({
    where: "Sardinia area",
    type: tripTypeOptions[tripFinderTabs[0]][0],
    when: "Flexible dates",
    travel: "€0 to €900",
  });
  const closeTimer = useRef<number | null>(null);
  const switchTimer = useRef<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const serviceRailRef = useRef<HTMLDivElement | null>(null);
  const serviceRailReturnTimer = useRef<number | null>(null);
  const isServiceRailHeld = useRef(false);

  useEffect(() => {
    const code = readSiteLang();
    const found = languages.find((language) => language.code === code);
    if (found) setSelectedLanguage(found);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0 });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
      setActiveDropdown(null);
      setOpenTripField(null);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const rail = serviceRailRef.current;

    if (!rail) {
      return;
    }

    const centerRail = () => {
      // Force an instant jump to the exact midpoint. scroll-behavior smooth
      // animates via rAF (can stall on load), and scroll-snap would nudge us
      // off-center — disable both for the jump, then restore for swiping.
      const prevBehavior = rail.style.scrollBehavior;
      const prevSnap = rail.style.scrollSnapType;
      rail.style.scrollBehavior = "auto";
      rail.style.scrollSnapType = "none";
      rail.scrollLeft = (rail.scrollWidth - rail.clientWidth) / 2;
      rail.style.scrollSnapType = prevSnap;
      rail.style.scrollBehavior = prevBehavior;
    };

    // Re-center across the moments the rail's width can still change (fonts,
    // lazy card images, ScrollSmoother layout) so it opens on the middle cards.
    window.requestAnimationFrame(centerRail);
    const timers = [120, 400, 900].map((ms) => window.setTimeout(centerRail, ms));
    if (document.fonts?.ready) document.fonts.ready.then(centerRail);
    window.addEventListener("resize", centerRail);
    window.addEventListener("load", centerRail);

    return () => {
      window.removeEventListener("resize", centerRail);
      window.removeEventListener("load", centerRail);
      timers.forEach((t) => window.clearTimeout(t));
      if (serviceRailReturnTimer.current) {
        window.clearTimeout(serviceRailReturnTimer.current);
      }
    };
  }, []);

  const returnServiceRailToMiddle = (delay = 480) => {
    if (serviceRailReturnTimer.current) {
      window.clearTimeout(serviceRailReturnTimer.current);
    }

    serviceRailReturnTimer.current = window.setTimeout(() => {
      const rail = serviceRailRef.current;

      if (!rail || isServiceRailHeld.current) {
        return;
      }

      rail.scrollTo({
        left: (rail.scrollWidth - rail.clientWidth) / 2,
        behavior: "smooth",
      });
    }, delay);
  };

  const captureMenuOrigin = () => {
    const button = menuButtonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    setMenuOrigin(
      {
        "--menu-pill-top": `${rect.top}px`,
        "--menu-pill-right": `${window.innerWidth - rect.right}px`,
        "--menu-pill-width": `${rect.width}px`,
        "--menu-pill-height": `${rect.height}px`,
      } as CSSProperties,
    );
  };

  const openSiteMenu = () => {
    captureMenuOrigin();
    setActiveDropdown(null);
    setIsLanguageOpen(false);
    setOpenTripField(null);
    window.requestAnimationFrame(() => setIsMenuOpen(true));
  };

  const closeSiteMenu = () => {
    captureMenuOrigin();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (switchTimer.current) {
      window.clearTimeout(switchTimer.current);
    }

    if (!activeDropdown) {
      setIsDropdownSwitching(true);
      switchTimer.current = window.setTimeout(() => {
        setRenderedDropdown(null);
        setIsDropdownSwitching(false);
      }, 220);
      return;
    }

    if (!renderedDropdown) {
      setRenderedDropdown(activeDropdown);
      setIsDropdownSwitching(false);
      return;
    }

    if (renderedDropdown !== activeDropdown) {
      setIsDropdownSwitching(true);
      switchTimer.current = window.setTimeout(() => {
        setRenderedDropdown(activeDropdown);
        window.requestAnimationFrame(() => setIsDropdownSwitching(false));
      }, 190);
    }
  }, [activeDropdown, renderedDropdown]);

  useEffect(() => {
    setMenuMounted(true);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const panel = document.getElementById("site-menu-panel");
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null)
        : [];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = focusables();
      if (!items.length) return;
      // Move focus ourselves on every Tab so it can never leave the open
      // menu (Safari skips links on Tab by default, so a first/last check
      // alone lets focus escape).
      event.preventDefault();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const nextIndex = event.shiftKey
        ? index <= 0 ? items.length - 1 : index - 1
        : index === -1 || index === items.length - 1 ? 0 : index + 1;
      items[nextIndex].focus();
    };

    window.addEventListener("keydown", onKeyDown);

    const w = window as unknown as {
      ScrollSmoother?: { get?: () => { paused: (v: boolean) => void } | undefined };
    };
    const smoother = w.ScrollSmoother?.get?.();
    smoother?.paused(true);
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      const closeBtn = panel?.querySelector<HTMLElement>(".site-menu-close");
      (closeBtn || focusables()[0])?.focus();
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      smoother?.paused(false);
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      (menuButtonRef.current ?? previouslyFocused)?.focus?.({ preventScroll: true });
    };
  }, [isMenuOpen]);

  // Elegant overlap-slide transition between section 2 (#home_about) and the
  // cards section (.service-stories): the cards rise as a lifted sheet over the
  // text, which drifts slightly slower behind it (parallax). GSAP/ScrollTrigger
  // are the global CDN build registered in app/layout.tsx; the sheet look
  // (negative margin, shadow, radius, z-index) lives in globals.css.
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let rafId = 0;
    let cancelled = false;

    const build = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      const cards = document.querySelector<HTMLElement>(".service-stories");
      const text = document.querySelector<HTMLElement>("#home_about .info");
      if (!gsap || !ScrollTrigger || !cards) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cleanup = () => {};
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: cards,
          start: "top bottom",
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Primary, clearly visible motion: the cards sheet rises into place,
      // deepening its overlap over the section above as you scroll in.
      timeline.fromTo(cards, { yPercent: 10 }, { yPercent: 0, ease: "none" }, 0);

      // Secondary parallax: the text block drifts down/slower behind the sheet.
      if (text) {
        timeline.fromTo(text, { yPercent: 0 }, { yPercent: 14, ease: "none" }, 0);
      }

      // Repeat the same lifted-sheet transition from the cards into the hero.
      // Animate the site wrapper only; the vanilla slider's image motion stays independent.
      const hero = document.querySelector<HTMLElement>("#featured-journeys");
      const rail = cards.querySelector<HTMLElement>(".service-card-rail");
      const heroTimeline = hero ? gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top bottom",
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }) : null;
      if (heroTimeline && hero) {
        heroTimeline.fromTo(hero, { yPercent: 10 }, { yPercent: 0, ease: "none" }, 0);
        if (rail) {
          heroTimeline.fromTo(rail, { yPercent: 0 }, { yPercent: 3, ease: "none" }, 0);
        }
      }

      // Reviews rise over the hero; only the photo position drifts behind them.
      // Keep the headline fixed inside its reserved, unobstructed space.
      const reviews = document.querySelector<HTMLElement>("#google-reviews");
      const heroVisual = hero?.querySelector<HTMLElement>("cinematic-hero");
      const reviewsTimeline = reviews ? gsap.timeline({
        scrollTrigger: {
          trigger: reviews,
          start: "top bottom",
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }) : null;
      if (reviewsTimeline && reviews) {
        reviewsTimeline.fromTo(reviews, { yPercent: 10 }, { yPercent: 0, ease: "none" }, 0);
        if (heroVisual) {
          reviewsTimeline.fromTo(heroVisual, { "--hero-background-position": "50%" }, { "--hero-background-position": "64%", ease: "none" }, 0);
        }
      }

      ScrollTrigger.refresh();
      const reviewsTl = reviewsTimeline as unknown as { scrollTrigger?: { kill: () => void }; kill: () => void } | null;
      const heroTl = heroTimeline as unknown as { scrollTrigger?: { kill: () => void }; kill: () => void } | null;
      const tl = timeline as unknown as { scrollTrigger?: { kill: () => void }; kill: () => void };
      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        heroTl?.scrollTrigger?.kill();
        heroTl?.kill();
        reviewsTl?.scrollTrigger?.kill();
        reviewsTl?.kill();
        if (heroVisual) gsap.set(heroVisual, { clearProps: "--hero-background-position" });
        gsap.set([cards, text, hero, rail, reviews].filter(Boolean), {
          clearProps: "transform",
        });
      };
    };

    // Wait until GSAP is present and the layout has a real width (a hidden tab
    // can report 0), so the parallax measures correctly.
    const buildWhenReady = () => {
      if (cancelled) return;
      const cards = document.querySelector(".service-stories");
      if (window.gsap && window.ScrollTrigger && cards && cards.getBoundingClientRect().width > 0) {
        build();
        return;
      }
      rafId = window.requestAnimationFrame(buildWhenReady);
    };

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(buildWhenReady);
    } else {
      buildWhenReady();
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      cleanup?.();
    };
  }, []);

  // Text Reveal 02 — still used by the about and card headlines.
  useEffect(() => {
    let rafId = 0;
    let cancelled = false;
    let attempts = 0;

    const ready = () =>
      !!(window as unknown as { gsap?: unknown; SplitText?: unknown }).gsap &&
      !!(window as unknown as { SplitText?: unknown }).SplitText;

    const run = () => {
      if (cancelled) return;
      if (ready()) {
        textReveal02();
        window.ScrollTrigger?.refresh();
        return;
      }
      if (attempts++ > 180) {
        document
          .querySelectorAll<HTMLElement>("[data-reveal-02]")
          .forEach((el) => (el.style.visibility = "visible"));
        return;
      }
      rafId = window.requestAnimationFrame(run);
    };

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(run);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const openDropdown = (menu: DropdownKey) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    if (menu === "explore" && activeDropdown !== "explore") {
      setActiveExplore(0);
    }
    if (menu === "destinations" && activeDropdown !== "destinations") {
      setActiveDestination(0);
    }
    setIsLanguageOpen(false);
    setOpenTripField(null);
    closeSiteMenu();
    setActiveDropdown(menu);
  };

  const scheduleClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
  };

  return (
    <>
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main
          className={`site-shell ${isMenuOpen ? "menu-open" : ""} ${
            isScrolled ? "is-scrolled" : "is-top"
          }`}
        >
          <section className="hero-section">
        <div className="hero-vignette" />

        <header
          className={`travel-header ${isScrolled ? "is-scrolled" : "is-top"}`}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <nav className="nav-pill" aria-label="Primary navigation">
            <a className="brand-mark" href="#" aria-label="Sardinia Discovery Travels home">
              <img src="/sardinia-logo.webp" alt="Sardinia Discovery Travels" />
            </a>

            <div className="nav-links">
              <a className="nav-link nav-link-static" href="/pacchetti">
                {selectedLanguage.code === "it" ? "Pacchetti" : "Packages"}
              </a>
              <NavButton
                label="Explore"
                active={activeDropdown === "explore"}
                onOpen={() => openDropdown("explore")}
              />
              <NavButton
                label="Experiences"
                active={activeDropdown === "experiences"}
                onOpen={() => openDropdown("experiences")}
              />
              <NavButton
                label="Destinations"
                active={activeDropdown === "destinations"}
                onOpen={() => openDropdown("destinations")}
              />
              <a className="nav-link nav-link-static" href="/about">
                About
              </a>
            </div>

            <div className="nav-actions">
              <a
                className="partner-pill"
                href={`/partner?lang=${selectedLanguage.code === "it" ? "it" : "en"}`}
              >
                <span className="menu-trigger-label"><span className="menu-trigger-roll"><span>Partner</span><span aria-hidden="true">Partner</span></span></span>
              </a>
              <div
                ref={languageMenu.ref}
              className={`language-switcher ${isLanguageOpen ? "is-open" : ""}`}
                onMouseLeave={() => setIsLanguageOpen(false)}
              >
                <button
                  className="language-button"
                  type="button"
                  aria-expanded={isLanguageOpen}
                  aria-haspopup="menu"
                aria-label={`Current language: ${selectedLanguage.label}`}
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsLanguageOpen((open) => !open);
                  }}
                >
                  <span>{selectedLanguage.shortLabel}</span>
                  <span className="language-chevron" aria-hidden="true" />
                </button>

                <div className="language-menu" role="menu">
                  {languages.map((language) => (
                    <button
                      className={`language-option ${
                        selectedLanguage.code === language.code ? "is-selected" : ""
                      }`}
                      key={language.code}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setSelectedLanguage(language);
                        writeSiteLang(language.code);
                      setIsLanguageOpen(false);
                      languageMenu.focusButton();
                      }}
                    >
                      <span className="language-flag">{language.flag}</span>
                      <span>{language.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                ref={menuButtonRef}
                className={`menu-trigger ${isMenuOpen ? "is-open" : ""}`}
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="site-menu-panel"
                onClick={() => {
                  if (isMenuOpen) {
                    closeSiteMenu();
                    return;
                  }

                  openSiteMenu();
                }}
              >
                <span className="menu-trigger-label"><span className="menu-trigger-roll"><span>Menu</span><span aria-hidden="true">Menu</span></span></span>
                <span className="menu-plus" aria-hidden="true" />
              </button>
            </div>
          </nav>

          <div
            className={`dropdown-layer ${activeDropdown && renderedDropdown ? "is-open" : ""} ${
              isDropdownSwitching ? "is-switching" : ""
            }`}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {renderedDropdown === "explore" && (
              <div className="dropdown-panel explore-panel">
                <div className="explore-list">
                  {exploreItems.map((item, index) => (
                    <button
                      className={`explore-option ${activeExplore === index ? "is-active" : ""}`}
                      key={item.title}
                      onFocus={() => setActiveExplore(index)}
                      onMouseEnter={() => setActiveExplore(index)}
                      type="button"
                    >
                      <span>{item.title}</span>
                      <small>{item.description}</small>
                    </button>
                  ))}
                </div>
                <div className="explore-image" aria-hidden="true">
                  {exploreItems.map((item, index) => (
                    <div
                      className={`explore-image-layer ${
                        activeExplore === index ? "is-visible" : ""
                      }`}
                      key={item.image}
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {renderedDropdown === "experiences" && (
              <div className="dropdown-panel experiences-panel">
                {experienceItems.map((item) => (
                  <a
                    className="experience-card"
                    href={item.title === "hotel" ? "/hotels" : item.title === "off road" ? "/off-road" : "#experiences"}
                    key={item.title}
                  >
                    <span
                      className="experience-card-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <span className="experience-card-title">{item.title}</span>
                    <small>{item.description}</small>
                  </a>
                ))}
              </div>
            )}

            {renderedDropdown === "destinations" && (
              <div className="dropdown-panel destinations-panel">
                <div className="destination-list">
                  {destinationItems.map((item, index) => (
                    <a
                      className={`destination-option ${
                        activeDestination === index ? "is-active" : ""
                      }`}
                      href={item.title === "North Sardinia" ? "/destinations/north-sardinia" : undefined}
                      aria-disabled={item.title !== "North Sardinia"}
                      key={item.title}
                      onFocus={() => setActiveDestination(index)}
                      onMouseEnter={() => setActiveDestination(index)}
                    >
                      <span>{item.title}</span>
                      <small>{item.description}</small>
                    </a>
                  ))}
                </div>

                <div className="destination-image" aria-hidden="true">
                  {destinationItems.map((item, index) => (
                    <div
                      className={`destination-image-layer ${
                        activeDestination === index ? "is-visible" : ""
                      }`}
                      key={item.image}
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {menuMounted && createPortal(
          <div
          className={`site-menu-overlay ${isMenuOpen ? "is-open" : ""}`}
          style={menuOrigin}
        >
          <button
            className="site-menu-backdrop"
            type="button"
            aria-label="Close menu"
            onClick={closeSiteMenu}
          />
          <aside
            className="site-menu-panel"
            id="site-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen}
          >
            <button
              className="site-menu-close"
              type="button"
              aria-label="Close menu"
              onClick={closeSiteMenu}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />
              </svg>
            </button>

            <div className="site-menu-content">
              <p className="site-menu-kicker"><span className="item-reveal">Navigation</span></p>
              <nav className="site-menu-links" aria-label="Expanded navigation">
                {(
                  [
                    { label: selectedLanguage.code === "it" ? "Pacchetti" : "Packages", href: "/pacchetti" },
                    { label: "Home", href: "#" },
                    { label: "Explore", href: "#explore" },
                    { label: "Experiences", href: "#experiences" },
                    { label: "About", href: "/about" },
                    { label: "Contact", href: "/contact" },
                    { label: "Partner", href: `/partner?lang=${selectedLanguage.code === "it" ? "it" : "en"}` },
                  ] as const
                ).map((item, index) => (
                  <a
                    href={item.href}
                    key={item.label}
                    data-drawer-item=""
                    className={item.label === "Partner" ? "site-menu-link-partner" : undefined}
                    style={{ "--item-index": index } as CSSProperties}
                    onClick={closeSiteMenu}
                  >
                    <span className="item-reveal"><span className="item-label">{item.label}</span></span>
                  </a>
                ))}
              </nav>

              <div className="site-menu-divider" aria-hidden="true" />

              <div className="site-menu-social">
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener" data-drawer-item="" style={{ "--item-index": 8 } as CSSProperties}>
                  <span className="item-reveal"><span className="item-label">Instagram</span></span>
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopener" data-drawer-item="" style={{ "--item-index": 8 } as CSSProperties}>
                  <span className="item-reveal"><span className="item-label">Facebook</span></span>
                </a>
              </div>

              <div className="site-menu-copy">
                <p className="site-menu-tagline">Discover Sardinia, beyond the ordinary.</p>
                <p className="site-menu-sub">
                  Authentic experiences, local people and untouched places.
                </p>
              </div>
            </div>

            <a className="site-menu-cta" href="/contact" onClick={closeSiteMenu}>
              <span className="site-menu-cta-inner">
                <span className="site-menu-cta-mask"><span className="site-menu-cta-label">Book an appointment</span></span>
              </span>
              <span className="site-menu-cta-circle" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
              </span>
            </a>
          </aside>
        </div>
        , document.body)}

        <div className="hero-content">
          <p className="hero-eyebrow">Sardinia, designed for you</p>
          <h1>
            <span className="hero-title-line">Experience Sardinia,</span>{" "}
            <em className="hero-title-serif">designed around you</em>
          </h1>
          <div className="trip-finder" aria-label="Plan your Sardinia trip">
            <div className="trip-tabs" role="tablist" aria-label="Trip category">
              {tripFinderTabs.map((tab) => (
                <button
                  aria-selected={activeTripTab === tab}
                  className={`trip-tab ${activeTripTab === tab ? "is-active" : ""}`}
                  key={tab}
                  onClick={() => {
                    setActiveTripTab(tab);
                    setOpenTripField(null);
                    setTripSelections((current) => ({
                      ...current,
                      type: tripTypeOptions[tab][0],
                    }));
                  }}
                  role="tab"
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="trip-search-row">
              {tripFinderFields.map((field) => (
                <div
                  className={`trip-field-wrap ${
                    openTripField === field.key ? "is-open" : ""
                  }`}
                  key={field.key}
                >
                  <button
                    aria-expanded={openTripField === field.key}
                    className="trip-field"
                    onClick={() =>
                      setOpenTripField((current) =>
                        current === field.key ? null : field.key,
                      )
                    }
                    type="button"
                  >
                    <span className="trip-field-copy">
                      <span className="trip-field-label">{field.label}</span>
                      <span className="trip-field-value">
                        {tripSelections[field.key]}
                      </span>
                    </span>
                    <span className="trip-field-chevron" aria-hidden="true" />
                  </button>

                  <div className="trip-field-menu">
                    {(field.key === "type"
                      ? tripTypeOptions[activeTripTab]
                      : tripFieldOptions[field.key]
                    ).map((option) => (
                      <button
                        className={`trip-field-option ${
                          tripSelections[field.key] === option ? "is-selected" : ""
                        }`}
                        key={option}
                        onClick={() => {
                          setTripSelections((current) => ({
                            ...current,
                            [field.key]: option,
                          }));
                          setOpenTripField(null);
                        }}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button className="trip-search-button" type="button">
                <span>Explore</span>
                <span className="trip-search-chevron" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
          </section>

          <section id="home_about">
            <div className="home_about_wrapper">
              <div className="image" data-aos="custom">
                <img
                  width="1280"
                  height="1920"
                  src="images/la-pelosa.png"
                  className="home-about-img"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
              <div className="info">
                <div className="title">
                  <h2 data-reveal-02="words" data-scroll="scrub">
                    Struggling to Find{" "}
                    <span className="home-about-title-accent">
                      the Perfect Sardinia Experience?
                    </span>
                  </h2>
                </div>
                <div className="text">
                  <p data-reveal-02="words" data-scroll="scrub">
                    <strong>OVERWHELMED BY CHOICES?</strong>
                    <br />
                    Planning a trip to Sardinia can feel overwhelming—too many choices,
                    too little time. How do you avoid the tourist traps and truly immerse
                    yourself in the island’s authentic charm? With Sardinia Discovery
                    Travels, you don’t have to worry. We craft tailor-made itineraries that
                    transform confusion into clarity, offering you a seamless,
                    unforgettable journey where every detail is taken care of.
                  </p>
                  <a href="#" className="arrow_link white">
                    <span>
                      scopri di più
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50.987"
                        height="14.208"
                        viewBox="0 0 50.987 14.208"
                      >
                        <g transform="translate(-1143 -7586.331)">
                          <g transform="translate(1164.072 7575.435)">
                            <path
                              d="M7.5,18H57.073"
                              transform="translate(-28.573)"
                              fill="none"
                              stroke="#fff"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              d="M18,7.5l6.4,6.4-6.4,6.4"
                              transform="translate(4.103 4.103)"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2"
                            />
                          </g>
                        </g>
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="service-stories" id="experiences">
            <div className="service-stories-header">
              <p data-reveal-02="words" data-scroll="scrub">Curated Sardinia Experiences</p>
              <h2 data-reveal-02="lines" data-scroll="scrub">
                Six ways to discover
                <br />
                the island your way.
              </h2>
            </div>

            <div
              ref={serviceRailRef}
              className="service-card-rail"
              aria-label="Featured experiences"
              onPointerDown={() => {
                isServiceRailHeld.current = true;
                if (serviceRailReturnTimer.current) {
                  window.clearTimeout(serviceRailReturnTimer.current);
                }
              }}
              onPointerLeave={() => {
                isServiceRailHeld.current = false;
                returnServiceRailToMiddle(220);
              }}
              onPointerUp={() => {
                isServiceRailHeld.current = false;
                returnServiceRailToMiddle(220);
              }}
              onScroll={() => {
                if (!isServiceRailHeld.current) {
                  returnServiceRailToMiddle();
                }
              }}
            >
              {serviceCards.map((card) =>
                card.title === "Boat Tours" || card.title === "Hotel" || card.title === "4x4 Off Road" ? (
                  <a className="service-story-card" href={card.title === "Hotel" ? "/hotels" : card.title === "4x4 Off Road" ? "/off-road" : "/boat-tours"} key={card.title}>
                    <img src={card.image} alt="" loading="lazy" decoding="async" />
                    <div className="service-card-overlay" />
                    <div className="service-card-copy">
                      <p>{card.eyebrow}</p>
                      <h3>{card.title}</h3>
                      <span>{card.description}</span>
                    </div>
                  </a>
                ) : (
                  <article className="service-story-card" key={card.title}>
                    <img src={card.image} alt="" loading="lazy" decoding="async" />
                    <div className="service-card-overlay" />
                    <div className="service-card-copy">
                      <p>{card.eyebrow}</p>
                      <h3>{card.title}</h3>
                      <span>{card.description}</span>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          <CinematicHero />

          <GoogleReviews />

          <MosaicReveal />

        </main>
        <SiteFooter />
      </div>
    </div>
    <FloatingActions />
    </>
  );
}

function NavButton({
  label,
  active,
  onOpen,
}: {
  label: string;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      className={`nav-link nav-button ${active ? "is-active" : ""}`}
      onClick={onOpen}
      onFocus={onOpen}
      onMouseEnter={onOpen}
      type="button"
    >
      <span>{label}</span>
      <span className="chevron" aria-hidden="true" />
    </button>
  );
}

function TripIcon({ name }: { name: TripFieldKey | "search" }) {
  if (name === "where") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
        <path d="M12 12.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
      </svg>
    );
  }

  if (name === "type") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 9.5 12 4l7.5 5.5v8.2a1.8 1.8 0 0 1-1.8 1.8H6.3a1.8 1.8 0 0 1-1.8-1.8V9.5Z" />
        <path d="M9 19.5v-5.2h6v5.2" />
      </svg>
    );
  }

  if (name === "when") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 4.5v3M17 4.5v3M5 9.5h14" />
        <path d="M6.8 6.5h10.4A2.3 2.3 0 0 1 19.5 8.8v8.4a2.3 2.3 0 0 1-2.3 2.3H6.8a2.3 2.3 0 0 1-2.3-2.3V8.8a2.3 2.3 0 0 1 2.3-2.3Z" />
      </svg>
    );
  }

  if (name === "travel") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8.7 11.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2ZM15.8 12.2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M3.9 19.2c.7-3.2 2.4-5 4.8-5s4.1 1.8 4.8 5M13 18.4c.6-2.3 1.8-3.6 3.6-3.6 1.7 0 2.9 1.2 3.5 3.6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10.8 18.1a7.3 7.3 0 1 0 0-14.6 7.3 7.3 0 0 0 0 14.6Z" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}
