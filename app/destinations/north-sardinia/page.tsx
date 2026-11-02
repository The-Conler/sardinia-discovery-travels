import type { Metadata } from "next";
import { pageMeta } from "../../seo";
import { SiteHeader } from "../../SiteHeader";
import { SiteFooter } from "../../SiteFooter";
import { FloatingActions } from "../../FloatingActions";
import "./north-sardinia.css";
import { ExperienceBrowser } from "./ExperienceBrowser";
import { NorthDestinations } from "./NorthDestinations";
import { BookingSteps } from "./BookingSteps";
import { highlights } from "./highlights";

export const metadata: Metadata = pageMeta({
  title: "North Sardinia | Sardinia Discovery Travels",
  description:
    "Explore Costa Smeralda, the La Maddalena Archipelago, Gallura, Alghero, Castelsardo and Stintino. Find stays, boat trips and local experiences in the north of the island.",
  path: "/destinations/north-sardinia",
});

// "What you'll find in the north" cards. Photos: Pexels, credits in /workspace/north/source.md.
// TODO(links): there are no pages for these places yet, so each card links to "#".
const destinations = [
  { name: "Costa Smeralda", line: "Beaches and harbours", image: "/destinations/north/nd-costa-smeralda.webp", href: "#" },
  { name: "La Maddalena Archipelago", line: "Islands and boat days", image: "/destinations/north/nd-la-maddalena.webp", href: "#" },
  { name: "Gallura", line: "Granite, vineyards and villages", image: "/destinations/north/nd-gallura.webp", href: "#" },
  { name: "Alghero", line: "Old town and sea walls", image: "/destinations/north/nd-alghero.webp", href: "#" },
  { name: "Stintino", line: "Beaches and shallow water", image: "/destinations/north/nd-stintino.webp", href: "#" },
];
const experiences = [
  { title: "4×4 Tours", image: "/experiences/off-road.png", text: "Head inland for an off-road discovery of northern Sardinia." },
  { title: "Boat Rentals", image: "/experiences/boat-tour.webp", text: "Choose your day at sea: yacht, catamaran, or gommone (RIB)." },
  { title: "Cooking Classes", image: "/experiences/cooking-class.png", text: "Get hands-on with local recipes and share the pleasure of a Sardinian table." },
  { title: "Hotels", image: "/experiences/hotel.png", text: "Find a base that suits your route, from coastal days to inland discoveries." },
  { title: "Private Transfers", image: "/explore/private-transfer.png", text: "Connect your airport, ferry port, hotel, and experiences with a private transfer." },
  { title: "Wine Tasting", image: "/explore/food-expierences.png", text: "Make time for local wines and the stories behind them." },
];
export default function NorthSardiniaPage() {
  return <>
    <SiteHeader />
    {/* WhatsApp, Instagram and Contact bar, same as the other pages (outside the smooth scroller so it stays fixed). */}
    <FloatingActions />
    <div id="smooth-wrapper"><div id="smooth-content">
      <main className="north-page">
        <section className="north-discovery north-discovery--hero" aria-labelledby="north-title">
          <div className="north-hero-bg" aria-hidden="true">
            <picture>
              <source media="(max-width: 640px)" srcSet="/destinations/north/ns-hero-phone.webp" />
              <img src="/destinations/north/ns-hero.webp" alt="" fetchPriority="high" decoding="async" />
            </picture>
          </div>
          <div className="north-discovery-content">
            <ExperienceBrowser
              experiences={experiences}
              highlights={highlights}
              heading={<div className="north-discovery-heading"><h1 id="north-title">North Sardinia</h1><p>Find your next island experience.</p></div>}
            />
          </div>
        </section>
        <NorthDestinations items={destinations} />
        <BookingSteps />
      </main>
      <SiteFooter />
    </div></div>
  </>;
}
