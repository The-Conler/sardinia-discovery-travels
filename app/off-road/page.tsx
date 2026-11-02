import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import { FloatingActions } from "../FloatingActions";
import { OffRoadView } from "./OffRoadView";
import "../contact/contact.css";
import "../hotels/hotels.css";
import "./offroad.css";

export const metadata: Metadata = pageMeta({
  title: "4x4 off road tours in Sardinia | Sardinia Discovery Travels",
  description:
    "Half day and full day 4x4 tours on Sardinia's mountain tracks, or a route planned with you. Choose an area and a date and we check it with the guide.",
  path: "/off-road",
});

export default function OffRoadPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <OffRoadView />
          </main>
          <SiteFooter />
        </div>
      </div>
      <FloatingActions />
    </>
  );
}
