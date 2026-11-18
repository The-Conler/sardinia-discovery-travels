import type { Metadata } from "next";
import { pageMeta } from "../seo";
import { SiteHeader } from "../SiteHeader";
import { SiteFooter } from "../SiteFooter";
import "./contact.css";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = pageMeta({
  title: "Contact | Sardinia Discovery Travels",
  description:
    "Book an appointment or send a note to Sardinia Discovery Travels.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <div id="smooth-wrapper"><div id="smooth-content">
        <main className="ct-page">
          <ContactForm />
        </main>
        <SiteFooter />
      </div></div>
    </>
  );
}
