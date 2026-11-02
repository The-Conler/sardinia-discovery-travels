import type { Metadata } from "next";
import { pageMeta } from "../seo";

// The boat tours page is a client component, so its metadata lives here.
export const metadata: Metadata = pageMeta({
  title: "Boat tours in Sardinia | Sardinia Discovery Travels",
  description:
    "Days at sea by yacht or RIB along the Sardinian coast, from La Maddalena and Asinara to Baunei, Alghero and Cagliari. Tell us your dates and we suggest the right boat.",
  path: "/boat-tours",
});

export default function BoatToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
