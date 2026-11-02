"use client";

import type { MouseEvent, ReactNode } from "react";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

// Smooth scroll to an in-page section through ScrollSmoother when it runs
// (the page is moved by a transform, so a plain hash jump would not scroll).
function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
  const id = event.currentTarget.getAttribute("href")?.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  event.preventDefault();
  const smoother = (window as unknown as { ScrollSmoother?: { get: () => { scrollTo: (t: Element, smooth: boolean, pos: string) => void } | undefined } }).ScrollSmoother?.get();
  if (smoother) smoother.scrollTo(target, true, "top top");
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const travelers = [
  {
    title: "Sea lovers",
    href: "/boat-tours",
    img: "/about/tile-sea-lovers.webp",
    text: "Clear water days, quiet coves, and coast routes planned around how you like to swim and sail.",
    icon: (
      <Icon>
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </Icon>
    ),
  },
  {
    title: "Inland explorers",
    href: "/contact",
    img: "/about/tile-inland-explorers.webp",
    text: "Mountain villages, quiet roads, and inland places that show another side of the island.",
    icon: (
      <Icon>
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </Icon>
    ),
  },
  {
    title: "Food lovers",
    href: "/contact",
    img: "/about/tile-food-lovers.webp",
    pos: "50% 78%",
    text: "Sardinian gastronomy at shared tables, local kitchens, and food stops chosen with care.",
    icon: (
      <Icon>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </Icon>
    ),
  },
  {
    title: "Outdoor adventure",
    href: "/contact",
    img: "/about/tile-outdoor-adventure.webp",
    text: "Hikes, off-road routes, and active days shaped around your pace and fitness.",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
      </Icon>
    ),
  },
  {
    title: "Family holidays",
    href: "/contact",
    img: "/about/tile-family-holidays.webp",
    pos: "50% 22%",
    text: "Trips that work for mixed ages, with room to rest, play, and explore without rush.",
    icon: (
      <Icon>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </Icon>
    ),
  },
  {
    title: "Culture and traditions",
    href: "/contact",
    img: "/about/tile-culture-traditions.webp",
    text: "Experiential tours that open local festivals, crafts, and centuries-old island traditions.",
    icon: (
      <Icon>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
      </Icon>
    ),
  },
];

const work = [
  {
    title: "Local knowledge",
    text: "Deep knowledge of the territory, built on years of living and working on the island.",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </Icon>
    ),
  },
  {
    title: "Selected local partners",
    text: "A network of selected local partners for stays, boats, guides, and on-the-ground help.",
    icon: (
      <Icon>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </Icon>
    ),
  },
  {
    title: "Stress-free planning",
    text: "Attention to every detail, clear plans, and services chosen around what you actually need.",
    icon: (
      <Icon>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </Icon>
    ),
  },
  {
    title: "With you on the trip",
    text: "Our team stays by your side during the journey, with constant attention to your needs.",
    icon: (
      <Icon>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </Icon>
    ),
  },
];

const portalBits = [
  {
    label: "Beaches and coastlines",
    icon: (
      <Icon>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </Icon>
    ),
  },
  {
    label: "Historical landmarks",
    icon: (
      <Icon>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
      </Icon>
    ),
  },
  {
    label: "Architecture",
    icon: (
      <Icon>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 22V12h6v10" />
      </Icon>
    ),
  },
  {
    label: "Villages and ruins",
    icon: (
      <Icon>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </Icon>
    ),
  },
];

export function AboutView() {
  return (
    <div className="ab-page">
      <section className="ab-hero" aria-labelledby="ab-hero-title">
        <div className="ab-hero-media" aria-hidden="true">
          <img
            src="/about/hero.webp"
            alt=""
            decoding="async"
            fetchPriority="high"
          />
          <div className="ab-hero-shade" />
        </div>
        <div className="ab-hero-copy">
          <p className="ab-kicker">About us</p>
          <h1 id="ab-hero-title" className="ab-title ab-title--xl">
            An island team that plans your Sardinia trip with you
          </h1>
          <p className="ab-lead">
            Sardinia Discovery Travels is an online travel agency for Sardinia vacation packages, built around how you like to travel.
          </p>
          <a className="ab-story-btn" href="#who-we-are" onClick={scrollToSection}>
            Our story
            <ArrowIcon />
          </a>
        </div>
        <p className="ab-hero-note">
          Sardinia,
          <br />
          beyond the ordinary.
        </p>
      </section>

      <section className="ab-section" id="who-we-are" aria-labelledby="ab-who-title">
        <div className="ab-inner">
          <div className="ab-mission">
            <div>
              <p className="ab-kicker">Who we are</p>
              <h2 id="ab-who-title" className="ab-title ab-who-title">
                <span>We help you</span> <span>discover the island</span>{" "}
                <span className="ab-who-muted">in all its beauty.</span>
              </h2>
            </div>
            <div className="ab-mission-side">
              <p className="ab-body">
                We organize Sardinia vacation packages and custom itineraries for people who want to see the island clearly, from the coast to inland villages.
              </p>
              <a className="ab-more-link" href="#how-we-work" onClick={scrollToSection}>
                Learn more about us
                <ArrowUpRightIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-section ab-section--tight ab-founder-section" aria-labelledby="ab-founder-title">
        <div className="ab-inner ab-founder-row">
          <div className="ab-founder">
            <figure className="ab-founder-photo">
              <img
                src="/about/claudio-alias.jpg"
                alt="Claudio Alias, founder of Sardinia Discovery Travels"
                width={1000}
                height={1000}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="ab-founder-copy">
              <p className="ab-kicker">Founder</p>
              <h2 id="ab-founder-title" className="ab-founder-name">Claudio Alias</h2>
              <p className="ab-founder-role">Founder of Sardinia Discovery Travels</p>
              <span className="ab-founder-rule" aria-hidden="true" />
              <p className="ab-body" style={{ marginTop: 0 }}>
                Born and raised on this island, I have always been passionate about tourism. After earning my degree in Tourism from the University of Cagliari, I dedicated years to the industry, working closely with travelers and learning what makes a journey work.
              </p>
              <p className="ab-body">
                With Sardinia Discovery Travels, I turn my deep knowledge of the territory and that experience into itineraries designed to show authentic and carefully chosen sides of Sardinia.
              </p>
            </div>
          </div>
          <figure className="ab-founder-side" aria-hidden="true">
            <img src="/experiences/mosaic/tl-goloritze-cove.webp" alt="" loading="lazy" decoding="async" />
          </figure>
        </div>
        <div className="ab-inner ab-who-more">
              <p className="ab-body">
                Our goal is to turn every trip into a unique experience of places, centuries-old traditions, and strong island moments. Thanks to deep knowledge of the territory and a network of selected local partners, we build routes for every kind of traveler.
              </p>
              <p className="ab-body">
                We aim for a stress-free trip, with attention to every detail, carefully chosen services, and constant attention to your needs.
              </p>
            </div>
      </section>

      <section className="ab-section" aria-labelledby="ab-plan-title">
        <div className="ab-inner ab-inner--wide">
          <div className="ab-section-head">
            <p className="ab-kicker">What we plan</p>
            <h2 id="ab-plan-title" className="ab-title">
              Trips shaped around how you like to travel
            </h2>
            <p className="ab-lead">
              From lovers of the sea to inland explorers, from Sardinian gastronomy to outdoor adventure, we build the days around you.
            </p>
          </div>
          <div className="ab-grid ab-grid--trips">
            {travelers.map((item) => (
              <a className="ab-trip" href={item.href} key={item.title}>
                <span className="ab-trip-media" aria-hidden="true"><img className="ab-trip-img" src={item.img} alt="" loading="lazy" decoding="async" style={"pos" in item && item.pos ? { objectPosition: item.pos } : undefined} /></span>
                <span className="ab-trip-icon">{item.icon}</span>
                <span className="ab-trip-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </span>
                <span className="ab-trip-arrow"><ArrowIcon /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-section ab-section--tight" id="how-we-work" aria-labelledby="ab-work-title">
        <div className="ab-inner ab-inner--wide">
          <div className="ab-section-head">
            <p className="ab-kicker">How we work</p>
            <h2 id="ab-work-title" className="ab-title">
              Clear plans, local partners, and steady support
            </h2>
          </div>
          <div className="ab-grid ab-grid--work">
            {work.map((item) => (
              <article className="ab-tile" key={item.title}>
                <span className="ab-tile-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-section" aria-labelledby="ab-portal-title">
        <div className="ab-inner">
          <div className="ab-portal">
            <div className="ab-portal-copy">
              <p className="ab-kicker">Our portal</p>
              <h2 id="ab-portal-title" className="ab-title">
                Explore the beauty of Sardinia through our portal
              </h2>
              <p className="ab-body">
                Your gateway to the island&apos;s beaches, historical landmarks, and architectural treasures. Whether you want pristine coastlines, ancient ruins, or charming villages, Sardinia Discovery Travels offers a curated guide to the best destinations the island has to offer.
              </p>
              <ul className="ab-portal-list">
                {portalBits.map((bit) => (
                  <li key={bit.label}>
                    {bit.label}
                    <span className="ab-chip-arrow"><ArrowIcon /></span>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="ab-portal-media">
              <img
                src="/about/gruppo-folk.webp"
                alt="Traditional Sardinian folk group in costume"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="ab-section ab-section--tight" aria-labelledby="ab-cta-title">
        <div className="ab-inner">
          <div className="ab-cta">
            <div className="ab-cta-media" aria-hidden="true">
              <img src="/menu/cliffs-dusk.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <p className="ab-kicker">Plan with Claudio</p>
            <h2 id="ab-cta-title" className="ab-title">
              Ready to experience Sardinia with us?
            </h2>
            <p className="ab-lead">
              Tell us when you are coming and what you want to do. Claudio and the team will help you shape a journey that fits.
            </p>
            <a className="ab-cta-btn" href="/contact">
              <span className="ab-cta-btn-text" aria-hidden="true">
                <span className="ab-cta-btn-roller">
                  <span className="ab-cta-btn-line">Book an appointment</span>
                  <span className="ab-cta-btn-line">Book an appointment</span>
                </span>
                <span className="ab-cta-btn-ico"><ArrowIcon /></span>
              </span>
              <span className="sr-only">Book an appointment</span>
              <span className="ab-cta-btn-arrow" aria-hidden="true"><ArrowIcon /></span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
