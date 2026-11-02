import type { Metadata } from "next";
import { pageMeta } from "./seo";
import { HomeView } from "./HomeView";

// The home page itself is a client component (HomeView.tsx); this server
// wrapper only adds the page metadata.
export const metadata: Metadata = pageMeta({
  title: "Sardinia Discovery Travels | Trips, boat tours and stays in Sardinia",
  description:
    "Plan your Sardinia trip with a local team: boat tours, hotels and villas, private transfers and day trips, arranged around your dates and your group.",
  path: "/",
});

export default function Home() {
  return <HomeView />;
}
