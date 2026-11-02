import type { Metadata } from "next";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import "./not-found.css";

export const metadata: Metadata = {
  title: "Page not found | Sardinia Discovery Travels",
  description: "We couldn't find this page. Go back to the home page or tell us what you are looking for.",
};

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="nf-page">
            <section className="nf-hero" aria-labelledby="nf-title">
              <p className="nf-code">Error 404</p>
              <h1 id="nf-title" className="nf-title">We couldn&apos;t find this page</h1>
              <p className="nf-text">
                The link may be old or the page has moved. Start again from the home page, or tell us what you
                are looking for and we will point you the right way.
              </p>
              <div className="nf-actions">
                <a className="button-02 button-02--teal nf-btn" href="/">
                  <span className="inner">Home</span>
                  <span className="circle"><Arrow /></span>
                </a>
                <a className="button-02 nf-btn" href="/contact">
                  <span className="inner">Contact</span>
                  <span className="circle"><Arrow /></span>
                </a>
              </div>
            </section>
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
