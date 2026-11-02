import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import { FloatingActions } from "../FloatingActions";
import { AboutView } from "./AboutView";
import "./about.css";

export const metadata: Metadata = pageMeta({
  title: "About us | Sardinia Discovery Travels",
  description:
    "Meet Claudio Alias and the Sardinia Discovery Travels team. An online travel agency for Sardinia vacation packages, local partners and custom itineraries.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <AboutView />
          </main>
          <SiteFooter />
        </div>
      </div>
      <FloatingActions />
    </>
  );
}
