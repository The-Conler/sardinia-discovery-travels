"use client";

import { useSiteLang } from "../siteLang";

const COPY = {
  en: {
    phone: "Phone number",
    email: "Email",
    message: "write something",
    file: "PDF or picture",
    send: "Send",
  },
  it: {
    phone: "Numero di telefono",
    email: "Email",
    message: "Scrivi qualcosa",
    file: "PDF o foto",
    send: "Invia",
  },
} as const;

export function ContactForm() {
  const t = COPY[useSiteLang()];
  return (
    <div className="ct-wizard">
      <form className="ct-split" onSubmit={(event) => event.preventDefault()}>
        <div className="ct-head">
          <h1 className="ct-title">Contact</h1>
        </div>
        <div className="ct-split-body">
          <label className="ct-field">
            <span className="ct-field-label">{t.phone}</span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
          <label className="ct-field">
            <span className="ct-field-label">{t.email}</span>
            <input type="email" name="email" autoComplete="email" />
          </label>
          <label className="ct-field">
            <span className="ct-field-label">{t.message}</span>
            <textarea name="message" rows={6} />
          </label>
          <label className="ct-field">
            <span className="ct-field-label">{t.file}</span>
            <input type="file" name="file" accept="application/pdf,image/*" />
          </label>
          <button className="button-02 button-02--teal ct-btn" type="submit">
            <span className="inner">{t.send}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
