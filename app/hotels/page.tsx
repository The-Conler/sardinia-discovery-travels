import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import { FloatingActions } from "../FloatingActions";
import { HotelsView } from "./HotelsView";
import "../contact/contact.css";
import "./hotels.css";

export const metadata: Metadata = pageMeta({
  title: "Hotels and stays in Sardinia | Sardinia Discovery Travels",
  description:
    "Hotels, villas, apartments, resorts and agriturismi across Sardinia. Choose an area and your dates and we check availability for you.",
  path: "/hotels",
});

export default function HotelsPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HotelsView />
          </main>
          <SiteFooter />
        </div>
      </div>
      <FloatingActions />
    </>
  );
}
