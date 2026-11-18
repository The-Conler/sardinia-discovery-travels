"use client";

import { useState } from "react";
import { useSiteLang } from "../siteLang";

const COPY = {
  en: {
    phone: "Phone number",
    email: "Email",
    message: "write something",
    file: "PDF or picture",
    send: "Send",
    whatsapp: "Do you have WhatsApp?",
    yes: "Yes",
    no: "No",
    note: "We mainly communicate via WhatsApp. Please download it before your appointment.",
    appStore: "App Store",
    play: "Google Play",
    rather: "Or would you rather be contacted by phone call?",
    phoneCall: "Phone call",
    otherApp: "Another messaging app",
    whichApp: "Which app do you use?",
  },
  it: {
    phone: "Numero di telefono",
    email: "Email",
    message: "Scrivi qualcosa",
    file: "PDF o foto",
    send: "Invia",
    whatsapp: "Hai WhatsApp?",
    yes: "Sì",
    no: "No",
    note: "Comunichiamo principalmente tramite WhatsApp. Ti chiediamo di scaricarlo prima dell’appuntamento.",
    appStore: "App Store",
    play: "Google Play",
    rather: "Oppure preferisci essere contattato con una telefonata?",
    phoneCall: "Telefonata",
    otherApp: "Un’altra app di messaggistica",
    whichApp: "Quale app usi?",
  },
} as const;

const APP_STORE = "https://apps.apple.com/app/whatsapp-messenger/id310633997";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.whatsapp";

export function ContactForm() {
  const t = COPY[useSiteLang()];
  const [whatsapp, setWhatsapp] = useState<"" | "yes" | "no">("");
  const [contactVia, setContactVia] = useState<"" | "phone" | "other">("");
  const [otherAppName, setOtherAppName] = useState("");

  const chooseWhatsapp = (value: "yes" | "no") => {
    setWhatsapp(value);
    if (value === "yes") setContactVia("");
  };

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
          <fieldset className="ct-group">
            <legend className="ct-legend">{t.whatsapp}</legend>
            <div className="ct-pills" role="radiogroup" aria-label={t.whatsapp}>
              {(["yes", "no"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={whatsapp === value}
                  className={`ct-pill${whatsapp === value ? " is-on" : ""}`}
                  onClick={() => chooseWhatsapp(value)}
                >
                  {t[value]}
                </button>
              ))}
            </div>
            <input type="hidden" name="whatsapp" value={whatsapp} />
          </fieldset>
          {whatsapp === "no" && (
            <>
              <p className="ct-note">
                {t.note}{" "}
                <a href={APP_STORE} target="_blank" rel="noreferrer noopener">{t.appStore}</a>
                {" · "}
                <a href={PLAY_STORE} target="_blank" rel="noreferrer noopener">{t.play}</a>
              </p>
              <fieldset className="ct-group">
                <legend className="ct-legend">{t.rather}</legend>
                <div className="ct-pills" role="radiogroup" aria-label={t.rather}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={contactVia === "phone"}
                    className={`ct-pill${contactVia === "phone" ? " is-on" : ""}`}
                    onClick={() => setContactVia("phone")}
                  >
                    {t.phoneCall}
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={contactVia === "other"}
                    className={`ct-pill${contactVia === "other" ? " is-on" : ""}`}
                    onClick={() => setContactVia("other")}
                  >
                    {t.otherApp}
                  </button>
                </div>
                <input type="hidden" name="contactVia" value={contactVia === "phone" ? "phone" : contactVia === "other" ? "other" : ""} />
              </fieldset>
              {contactVia === "other" && (
                <label className="ct-field">
                  <span className="ct-field-label">{t.whichApp}</span>
                  <input name="otherApp" value={otherAppName} onChange={(event) => setOtherAppName(event.target.value)} />
                </label>
              )}
            </>
          )}
          <button className="button-02 button-02--teal ct-btn" type="submit">
            <span className="inner">{t.send}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
