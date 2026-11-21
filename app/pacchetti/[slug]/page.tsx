import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "../../seo";
import { SiteHeader } from "../../SiteHeader";
import { SiteFooter } from "../../SiteFooter";
import { PACKAGES, packageBySlug } from "../packages";
import { PackageDetail } from "../PackageDetail";
import "../pacchetti.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = packageBySlug((await params).slug);
  if (!pkg) return {};
  return pageMeta({
    title: `${pkg.en.title} | Sardinia Discovery Travels`,
    description: pkg.en.intro,
    path: `/pacchetti/${pkg.slug}`,
  });
}

export default async function PackagePage({ params }: Props) {
  const pkg = packageBySlug((await params).slug);
  if (!pkg) notFound();
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <PackageDetail pkg={pkg} />
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
