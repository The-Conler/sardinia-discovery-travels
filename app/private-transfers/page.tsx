import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import "./private-transfers.css";
import { TransferBooking } from "./TransferBooking";
import { TransferFaq } from "./TransferFaq";
import { TransferHowItWorks } from "./TransferHowItWorks";

export const metadata: Metadata = pageMeta({
  title: "Private transfers in North Sardinia | Sardinia Discovery Travels",
  description:
    "Door to door private transfers in North Sardinia between airports, ferry ports and your stay, with professional drivers, fixed prices and a meet and greet on arrival.",
  path: "/private-transfers",
});

// Agency-wide rating shown on every fleet card — real Google reviews, all 5-star.
const agencyRating = {
  score: "5.0",
  count: 5,
  recommend: "100%",
  avatars: [
    "/google-reviews/photos/renee-williams.png",
    "/google-reviews/photos/katelyn-hill.png",
    "/google-reviews/photos/april-arnone.png",
  ],
};

const fleet = [
  { img: "/transfers/sedan.jpg", tag: "Sedan", name: "Mercedes E-Class", pax: "1–3 guests", bags: "3 bags", price: "€100", accent: "#11b6bb", desc: "Sleek and discreet — the choice for couples and business travellers. Leather interior, climate control and a quiet, comfortable ride.", feats: ["Private driver & meet-and-greet", "Leather seats & climate control", "Bottled water & phone chargers", "Ideal for airport runs & short hops"], interiors: ["/transfers/interiors/cockpit.jpg", "/transfers/interiors/dash.jpg"] },
  { img: "/transfers/vclass-long.jpg", tag: "Van", name: "Mercedes V-Class", pax: "1–7 guests", bags: "6 bags", price: "€120", accent: "#7bd0c9", desc: "The family favourite. Seven roomy seats with space for suitcases, strollers and beach gear on every trip.", feats: ["Room for the whole family", "Child seats fitted free", "Easy step-in sliding doors", "Individual climate control"], interiors: ["/transfers/interiors/cabin.jpg", "/transfers/interiors/console.jpg"] },
  { img: "/transfers/vclass-xl.jpg", tag: "Van XL", name: "V-Class Extralong", pax: "1–7 guests", bags: "7 bags", price: "€135", accent: "#f0b64b", desc: "Extra legroom and boot space for longer stays — seven guests travel first-class with all their luggage.", feats: ["Maximum luggage capacity", "Extra legroom & recline", "USB charging on every seat", "Perfect for week-long stays"], interiors: ["/transfers/interiors/console.jpg", "/transfers/interiors/dash.jpg"] },
  { img: "/transfers/minibus.jpg", tag: "Minibus", name: "Mercedes Sprinter", pax: "8–16 guests", bags: "16 bags", price: "€190", accent: "#c88bf0", desc: "For groups and events up to sixteen. One vehicle, one price — everyone travels together, door to door.", feats: ["Groups, teams & weddings", "One fixed price for all", "Plenty of hold luggage space", "High roof, easy to board"], interiors: ["/transfers/interiors/cabin.jpg", "/transfers/interiors/cockpit.jpg"] },
];

export default function PrivateTransfersPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper"><div id="smooth-content">
        <main className="pt-page">
          <section className="pt-hero">
            <p className="pt-eyebrow">Travel your way</p>
            <h1>Private transfers{" "}<br />across the north.</h1>
            <p className="pt-hero-sub">Door-to-door rides between airports, ferry ports and your stay — professional drivers, fixed prices and a meet &amp; greet on arrival.</p>
          </section>

          <section className="pt-booking-section" aria-label="Book a transfer">
            <TransferBooking />
          </section>

          <section className="pt-block pt-fleet">
            <div className="pt-block-head pt-head-center">
              <p className="pt-eyebrow">Our fleet</p>
              <h2>The cars we drive</h2>
              <p className="pt-block-sub">A modern, spotless Mercedes fleet for every group size. Hover a car to see what&apos;s on board.</p>
            </div>
            <div className="pt-fleet-grid">
              {fleet.map(c => (
                <article className="pt-fleet-card" key={c.name} style={{ ["--accent" as string]: c.accent }} tabIndex={0}>
                  <div className="pt-fleet-inner">
                    <div className="pt-fleet-front">
                      <img className="pt-fleet-img" src={c.img} alt={c.name} loading="lazy" />
                      <div className="pt-fleet-face">
                        <div className="pt-fleet-face-top">
                          <span className="pt-fleet-tag">{c.tag}</span>
                          <div className="pt-rating pt-rating-light">
                            <span className="pt-rating-avatars">
                              {agencyRating.avatars.map(a => <img key={a} src={a} alt="" loading="lazy" />)}
                            </span>
                            <span className="pt-rating-score"><b>{agencyRating.score}</b><i aria-hidden="true">★★★★★</i></span>
                            <span className="pt-rating-recommend">{agencyRating.recommend} recommend</span>
                          </div>
                        </div>
                        <div className="pt-fleet-face-foot">
                          <div>
                            <h3>{c.name}</h3>
                            <p className="pt-fleet-spec">{c.pax} · {c.bags}</p>
                          </div>
                          <p className="pt-fleet-price"><span>from</span>{c.price}</p>
                        </div>
                        <span className="pt-fleet-fliphint" aria-hidden="true">Hover to see details ↻</span>
                      </div>
                    </div>
                    <div className="pt-fleet-back">
                      <div className="pt-fleet-panel">
                        <span className="pt-fleet-tag pt-fleet-tag-dark">{c.tag}</span>
                        <h3>{c.name}</h3>
                        <p className="pt-fleet-desc">{c.desc}</p>
                        <ul className="pt-fleet-feats">{c.feats.map(f => <li key={f}><span aria-hidden="true">✓</span>{f}</li>)}</ul>
                        <div className="pt-rating pt-rating-dark">
                          <span className="pt-rating-avatars">
                            {agencyRating.avatars.map(a => <img key={a} src={a} alt="" loading="lazy" />)}
                          </span>
                          <span className="pt-rating-score"><b>{agencyRating.score}</b><i aria-hidden="true">★★★★★</i></span>
                          <span className="pt-rating-recommend">{agencyRating.recommend} recommend · {agencyRating.count} Google reviews</span>
                        </div>
                        <div className="pt-fleet-panel-media">
                          {c.interiors.map(src => (
                            <figure key={src}>
                              <img src={src} alt={`${c.name} interior`} loading="lazy" />
                            </figure>
                          ))}
                          <figcaption className="pt-fleet-media-cap">Interior — illustrative</figcaption>
                        </div>
                        <div className="pt-fleet-panel-foot">
                          <span>{c.pax} · {c.bags}</span>
                          <strong>from {c.price}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-block pt-faq">
            <div className="pt-block-head pt-head-center">
              <p className="pt-eyebrow">Good to know</p>
              <h2>Frequently asked questions</h2>
            </div>
            <TransferFaq />
          </section>

          <section className="pt-block pt-hiw">
            <div className="pt-block-head pt-head-center">
              <p className="pt-eyebrow">How It Works</p>
              <h2>From Booking to Arrival — Simplified</h2>
              <p className="pt-block-sub">Your private transfer, arranged in a few simple steps — from your first search to your destination.</p>
            </div>
            <TransferHowItWorks />
          </section>

        </main>
        <SiteFooter />
      </div></div>
    </>
  );
}
