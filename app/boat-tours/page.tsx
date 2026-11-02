"use client";

import { FloatingActions } from "../FloatingActions";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { BoatLocations } from "./BoatLocations";
import { BoatTypes } from "./BoatTypes";
import { BoatMosaic } from "./BoatMosaic";
import { BoatReviews } from "./BoatReviews";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M4 10h16" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="2.4" />
      <circle cx="16" cy="9" r="2" />
      <path d="M4.8 18.5c.6-2.6 2.5-4 4.2-4s3.6 1.4 4.2 4" />
      <path d="M13.2 14.6c1.5-.3 3.2.5 4 2.9" />
    </svg>
  );
}

export default function BoatToursPage() {
  return (
    <>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="boat-page">
            <SiteHeader />

            <section className="boat-hero-wrap" aria-labelledby="boat-hero-title">
              <div className="boat-hero">
                <img
                  src="/experiences/boat-hero.jpg"
                  alt="Aerial view of a motor yacht crossing clear turquoise water"
                />
                <div className="boat-hero-shade" />
                <h1 id="boat-hero-title" className="boat-hero-coast">Discover the Sardinian Coast Line</h1>
              </div>

              <form className="boat-book" id="book" aria-label="Book a yacht experience">
                <div className="boat-book-field">
                  <PinIcon />
                  <span>
                    <small>Departure from</small>
                    <strong>Monaco</strong>
                  </span>
                </div>
                <div className="boat-book-field">
                  <PinIcon />
                  <span>
                    <small>Arrival at</small>
                    <strong>Marseille</strong>
                  </span>
                </div>
                <div className="boat-book-field">
                  <CalendarIcon />
                  <span>
                    <small>Dates</small>
                    <strong>1–12 Aug 2021</strong>
                  </span>
                </div>
                <div className="boat-book-field">
                  <GuestsIcon />
                  <span>
                    <small>Guests</small>
                    <strong>6 adults • 2 children</strong>
                  </span>
                </div>
                <button className="boat-book-search" type="button">
                  Search
                </button>
              </form>
            </section>

            <section className="boat-next" aria-labelledby="boat-next-title">
              <h2 id="boat-next-title">Raw elegance, pristine shores</h2>
              <p>
                Rugged, wild, and undeniably beautiful, Corsica and Sardinia offer an escape into the untouched heart
                of the Mediterranean. Corsica stuns with its dramatic mountain landscapes, hidden beaches, and rich
                French-Italian culture, while Sardinia&rsquo;s Costa Smeralda is famed for its turquoise waters, luxury
                resorts, and vibrant nightlife. Whether you seek adventure or relaxation, these islands offer a perfect
                mix of nature, history, and indulgence.
              </p>
            </section>

            <BoatLocations />

            <BoatTypes />

            <BoatMosaic />

            <BoatReviews />

          </main>
          <SiteFooter />
        </div>
      </div>
      <FloatingActions />
    </>
  );
}
