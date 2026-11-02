import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import "./partner.css";

export const metadata: Metadata = pageMeta({
  title: "Become a partner | Sardinia Discovery Travels",
  description:
    "Do you offer stays, food, boat trips, guided tours or transport in Sardinia? Apply to work with us and meet travelers who plan their trip with our team.",
  path: "/partner",
});

// The partner application form is a self-contained static app
// (public/partner-form/index.html). It runs in a full-screen frame under the
// site header; ?embed=1 hides its own header, ?lang passes the site language.
export default async function PartnerPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const lang = params.lang === "it" ? "it" : "en";
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="pf-page">
            <h1 className="sr-only">{lang === "it" ? "Diventa partner di Sardinia Discovery Travels" : "Become a Sardinia Discovery Travels partner"}</h1>
            <iframe
              className="pf-frame"
              src={`/partner-form/index.html?embed=1&lang=${lang}`}
              title={lang === "it" ? "Candidatura partner" : "Partner application"}
            />
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
