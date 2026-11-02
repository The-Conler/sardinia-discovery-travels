import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "../../seo";
import { SiteHeader } from "../../SiteHeader";
import { SiteFooter } from "../../SiteFooter";
import { FloatingActions } from "../../FloatingActions";
import { TOURS, tourBySlug } from "../offRoadData";
import { TourDetail } from "../TourDetail";
import "../../contact/contact.css";
import "../../hotels/hotels.css";
import "../offroad.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOURS.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = tourBySlug((await params).slug);
  if (!t) return {};
  return pageMeta({
    title: `${t.name} | Off road in Sardinia | Sardinia Discovery Travels`,
    description: `${t.meta}. ${t.text}`.trim(),
    path: `/off-road/${t.id}`,
  });
}

export default async function TourPage({ params }: Props) {
  const t = tourBySlug((await params).slug);
  if (!t) notFound();
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <TourDetail tour={t} />
          </main>
          <SiteFooter />
        </div>
      </div>
      <FloatingActions />
    </>
  );
}
