"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguageMenu } from "./useLanguageMenu";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";

// Shared site header: the same nav pill + dropdowns + slide-in menu as the
// homepage, self-contained so any page can render it. Links point to /#… so
// they navigate to the homepage sections from sub-pages.

const exploreItems = [
  { title: "blue zone", description: "Culture, longevity, and authentic local living.", image: "/explore/blue-zone.png" },
  { title: "Tailor Made Tours", description: "Custom routes designed around your pace and interests.", image: "/explore/tailor-made-tours.png" },
  { title: "private transfer", description: "Smooth private rides across the island.", image: "/explore/private-transfer.png" },
  { title: "food expierences", description: "Traditional flavors, shared tables, and local stories.", image: "/explore/food-expierences.png" },
];

const experienceItems = [
  { title: "off road", description: "Rugged routes through wild Sardinian landscapes.", image: "/experiences/off-road.png" },
  { title: "Escursioni", description: "Guided discoveries across coast, peaks, and trails.", image: "/experiences/escursioni.png" },
  { title: "hotel", description: "Character stays, quiet comfort, and island charm.", image: "/experiences/hotel.png" },
  { title: "Cooking class", description: "Hands-on local flavors, recipes, and table rituals.", image: "/experiences/cooking-class.png" },
  { title: "boat tour", description: "Clear-water routes, hidden coves, and sea caves.", image: "/experiences/boat-tour.webp" },
];

const destinationItems = [
  { title: "North Sardinia", description: "Granite coastlines, refined towns, and luminous bays.", image: "/destinations/north-sardinia.png" },
  { title: "South Sardinia", description: "Soft beaches, ancient routes, and sun-warmed villages.", image: "/destinations/south-sardinia.png" },
  { title: "West Sardinia", description: "Wild cliffs, surf horizons, and untouched shores.", image: "/destinations/west-sardinia.png" },
  { title: "East Sardinia", description: "Blue coves, mountain trails, and dramatic sea roads.", image: "/destinations/east-sardinia.png" },
  { title: "Interlands", description: "Mountain villages, vineyards, and slow inland rituals.", image: "/destinations/interlands.png" },
  { title: "Islands", description: "Boat days, quiet archipelagos, and crystalline water.", image: "/destinations/islands.png" },
];

const languages = [
  { code: "en", label: "English", shortLabel: "EN", flag: "🇬🇧" },
  { code: "it", label: "Italian", shortLabel: "IT", flag: "🇮🇹" },
  { code: "nl", label: "Dutch", shortLabel: "NL", flag: "🇳🇱" },
];

type DropdownKey = "explore" | "experiences" | "destinations";

function NavButton({ label, active, onOpen }: { label: string; active: boolean; onOpen: () => void }) {
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

export function SiteHeader() {
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
  const closeTimer = useRef<number | null>(null);
  const switchTimer = useRef<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
      setActiveDropdown(null);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (switchTimer.current) window.clearTimeout(switchTimer.current);

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

  const captureMenuOrigin = () => {
    const button = menuButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMenuOrigin({
      "--menu-pill-top": `${rect.top}px`,
      "--menu-pill-right": `${window.innerWidth - rect.right}px`,
      "--menu-pill-width": `${rect.width}px`,
      "--menu-pill-height": `${rect.height}px`,
    } as CSSProperties);
  };

  const openSiteMenu = () => {
    captureMenuOrigin();
    setActiveDropdown(null);
    setIsLanguageOpen(false);
    window.requestAnimationFrame(() => setIsMenuOpen(true));
  };

  const closeSiteMenu = () => {
    captureMenuOrigin();
    setIsMenuOpen(false);
  };

  const openDropdown = (menu: DropdownKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (menu === "explore" && activeDropdown !== "explore") setActiveExplore(0);
    if (menu === "destinations" && activeDropdown !== "destinations") setActiveDestination(0);
    setIsLanguageOpen(false);
    closeSiteMenu();
    setActiveDropdown(menu);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  return (
    <>
      <header
        className={`travel-header ${isScrolled ? "is-scrolled" : "is-top"}`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <nav className="nav-pill" aria-label="Primary navigation">
          <a className="brand-mark" href="/" aria-label="Sardinia Discovery Travels home">
            <img src="/sardinia-logo.webp" alt="Sardinia Discovery Travels" />
          </a>

          <div className="nav-links">
            <NavButton label="Explore" active={activeDropdown === "explore"} onOpen={() => openDropdown("explore")} />
            <NavButton label="Experiences" active={activeDropdown === "experiences"} onOpen={() => openDropdown("experiences")} />
            <NavButton label="Destinations" active={activeDropdown === "destinations"} onOpen={() => openDropdown("destinations")} />
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
                    className={`language-option ${selectedLanguage.code === language.code ? "is-selected" : ""}`}
                    key={language.code}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedLanguage(language);
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
                    className={`explore-image-layer ${activeExplore === index ? "is-visible" : ""}`}
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
                <a className="experience-card" href={item.title === "hotel" ? "/hotels" : item.title === "off road" ? "/off-road" : "/#experiences"} key={item.title}>
                  <span className="experience-card-image" style={{ backgroundImage: `url(${item.image})` }} />
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
                    className={`destination-option ${activeDestination === index ? "is-active" : ""}`}
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
                    className={`destination-image-layer ${activeDestination === index ? "is-visible" : ""}`}
                    key={item.image}
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {menuMounted &&
        createPortal(
          <div className={`site-menu-overlay ${isMenuOpen ? "is-open" : ""}`} style={menuOrigin}>
        <button className="site-menu-backdrop" type="button" aria-label="Close menu" onClick={closeSiteMenu} />
        <aside
          className="site-menu-panel"
          id="site-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen}
        >
          <button className="site-menu-close" type="button" aria-label="Close menu" onClick={closeSiteMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />
            </svg>
          </button>

          <div className="site-menu-content">
            <p className="site-menu-kicker"><span className="item-reveal">Navigation</span></p>
            <nav className="site-menu-links" aria-label="Expanded navigation">
              {(
                [
                  { label: "Home", href: "/" },
                  { label: "Explore", href: "/#explore" },
                  { label: "Experiences", href: "/#experiences" },
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

    </>
  );
}
