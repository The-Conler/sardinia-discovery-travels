import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import "./contact.css";
import { ContactWizard } from "./ContactWizard";

export const metadata: Metadata = pageMeta({
  title: "Contact | Sardinia Discovery Travels",
  description:
    "Tell us what you'd like to do in Sardinia, when you're coming and who's in your group. We reply with everything in one message.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper"><div id="smooth-content">
        <main className="ct-page">
          <ContactWizard />
        </main>
        <SiteFooter />
      </div></div>
    </>
  );
}
