import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import { PackagesView } from "./PackagesView";
import "./pacchetti.css";

export const metadata: Metadata = pageMeta({
  title: "Pacchetti | Sardinia Discovery Travels",
  description: "Example ready-made trips in Sardinia. Sample prices and plans, to be replaced with real trips.",
  path: "/pacchetti",
});

export default function PackagesPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <PackagesView />
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
