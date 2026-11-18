"use client";

import { useMemo, useState } from "react";
import { useSiteLang } from "../siteLang";

/**
 * Placeholder bookable window. No office hours are defined in the repo.
 * Change APPOINTMENT_END to move the last slot. Slots run every 30 minutes
 * from APPOINTMENT_START through APPOINTMENT_END, Monday to Saturday.
 */
const APPOINTMENT_START = "09:00";
const APPOINTMENT_END = "18:00";
const APPOINTMENT_STEP = 30;

const APP_STORE = "https://apps.apple.com/app/whatsapp-messenger/id310633997";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.whatsapp";

const COPY = {
  en: {
    kicker: "Sardinia Discovery Travels",
    title: "Contact",
    phone: "Phone number",
    email: "Email",
    message: "Write something",
    file: "PDF or picture",
    choose: "Choose a file",
    none: "No file chosen",
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
    book: "Book an appointment",
    date: "Date",
    time: "Time",
    pickDate: "Choose a date to see the times.",
    method: "How would you like to be contacted?",
    whatsappOpt: "WhatsApp",
    emailOpt: "Email",
    video: "Video call",
    details: "Contact details",
    phonePh: "[phone to be added]",
    emailPh: "[email to be added]",
    legal: "Legal information",
    prev: "Previous month",
    next: "Next month",
    week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  it: {
    kicker: "Sardinia Discovery Travels",
    title: "Contatto",
    phone: "Numero di telefono",
    email: "Email",
    message: "Scrivi qualcosa",
    file: "PDF o foto",
    choose: "Scegli un file",
    none: "Nessun file selezionato",
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
    book: "Prenota un appuntamento",
    date: "Data",
    time: "Orario",
    pickDate: "Scegli una data per vedere gli orari.",
    method: "Come preferisci essere contattato?",
    whatsappOpt: "WhatsApp",
    emailOpt: "Email",
    video: "Videochiamata",
    details: "Recapiti",
    phonePh: "[telefono da inserire]",
    emailPh: "[email da inserire]",
    legal: "Informazioni legali",
    prev: "Mese precedente",
    next: "Mese successivo",
    week: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
  },
} as const;

const LEGAL = [
  "Sardinia Discovery Travels di Claudio Alias",
  "P.IVA 03012880906",
  "Cod. Fisc. LSACLD95H16L093P",
  "Via Giovanni XXIII 2/a, 07029 Tempio Pausania (SS)",
  "Bacino SUAP Tempio Pausania N. Protocollo 4894",
  "REVO Speciality Liability – Travel Agencies N. OX00052607",
  "Allianz Enterprise RC N. 506336849",
];

type Method = "" | "phone" | "whatsapp" | "email" | "video" | "other";

function parseClock(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function slots() {
  const end = parseClock(APPOINTMENT_END);
  const out: string[] = [];
  for (let minute = parseClock(APPOINTMENT_START); minute <= end; minute += APPOINTMENT_STEP) {
    out.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
  }
  return out;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isBookable(date: Date, today: Date) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const probe = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return probe >= start && date.getDay() !== 0;
}

export function ContactForm() {
  const t = COPY[useSiteLang()];
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [fileName, setFileName] = useState("");
  const [whatsapp, setWhatsapp] = useState<"" | "yes" | "no">("");
  const [method, setMethod] = useState<Method>("");
  const [otherAppName, setOtherAppName] = useState("");

  const times = slots();
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: count }, (_, index) => new Date(year, month, index + 1)),
  ];

  const chooseWhatsapp = (value: "yes" | "no") => {
    setWhatsapp(value);
    if (value === "yes" && method === "other") setMethod("");
  };

  return (
    <div className="cf">
      <header className="cf-hero">
        <img src="/contact/sunset-hero-1200.webp" alt="" />
        <div className="cf-hero-copy">
          <p className="cf-kicker">{t.kicker}</p>
          <h1>{t.title}</h1>
        </div>
      </header>

      <div className="cf-layout">
        <form className="cf-card" onSubmit={(event) => event.preventDefault()}>
          <label className="cf-field">
            <span>{t.phone}</span>
            <input type="tel" name="phone" autoComplete="tel" />
          </label>
          <label className="cf-field">
            <span>{t.email}</span>
            <input type="email" name="email" autoComplete="email" />
          </label>
          <label className="cf-field">
            <span>{t.message}</span>
            <textarea name="message" rows={6} />
          </label>
          <div className="cf-field">
            <span>{t.file}</span>
            <label className="cf-file">
              <input
                type="file"
                name="file"
                accept="application/pdf,image/*"
                onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
              />
              <span className="cf-file-btn">{t.choose}</span>
              <span className="cf-file-name">{fileName || t.none}</span>
            </label>
          </div>

          <fieldset className="cf-block">
            <legend>{t.whatsapp}</legend>
            <div className="cf-pills" role="radiogroup" aria-label={t.whatsapp}>
              {(["yes", "no"] as const).map((value) => (
                <button key={value} type="button" role="radio" aria-checked={whatsapp === value} className={whatsapp === value ? "is-on" : ""} onClick={() => chooseWhatsapp(value)}>
                  {t[value]}
                </button>
              ))}
            </div>
            <input type="hidden" name="whatsapp" value={whatsapp} />
          </fieldset>
          {whatsapp === "no" && (
            <>
              <p className="cf-note">
                {t.note}{" "}
                <a href={APP_STORE} target="_blank" rel="noreferrer noopener">{t.appStore}</a>
                {" · "}
                <a href={PLAY_STORE} target="_blank" rel="noreferrer noopener">{t.play}</a>
              </p>
              <fieldset className="cf-block">
                <legend>{t.rather}</legend>
                <div className="cf-pills">
                  <button type="button" className={method === "phone" ? "is-on" : ""} onClick={() => setMethod("phone")}>{t.phoneCall}</button>
                  <button type="button" className={method === "other" ? "is-on" : ""} onClick={() => setMethod("other")}>{t.otherApp}</button>
                </div>
              </fieldset>
              {method === "other" && (
                <label className="cf-field">
                  <span>{t.whichApp}</span>
                  <input name="otherApp" value={otherAppName} onChange={(event) => setOtherAppName(event.target.value)} />
                </label>
              )}
            </>
          )}

          <fieldset className="cf-block">
            <legend>{t.book}</legend>
            <p className="cf-label">{t.date}</p>
            <div className="cf-cal">
              <div className="cf-cal-bar">
                <button type="button" aria-label={t.prev} onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</button>
                <strong>{t.months[month]} {year}</strong>
                <button type="button" aria-label={t.next} onClick={() => setCursor(new Date(year, month + 1, 1))}>›</button>
              </div>
              <div className="cf-cal-week">
                {t.week.map((day) => <span key={day}>{day}</span>)}
              </div>
              <div className="cf-cal-grid">
                {cells.map((cell, index) => cell ? (
                  <button
                    key={dayKey(cell)}
                    type="button"
                    disabled={!isBookable(cell, today)}
                    className={date && dayKey(date) === dayKey(cell) ? "is-on" : ""}
                    onClick={() => { setDate(cell); setTime(""); }}
                  >
                    {cell.getDate()}
                  </button>
                ) : <span key={`e${index}`} />)}
              </div>
            </div>
            <p className="cf-label">{t.time}</p>
            {date ? (
              <div className="cf-pills cf-slots">
                {times.map((slot) => (
                  <button key={slot} type="button" className={time === slot ? "is-on" : ""} onClick={() => setTime(slot)}>{slot}</button>
                ))}
              </div>
            ) : <p className="cf-hint">{t.pickDate}</p>}
            <input type="hidden" name="date" value={date ? date.toISOString().slice(0, 10) : ""} />
            <input type="hidden" name="time" value={time} />
          </fieldset>

          <fieldset className="cf-block">
            <legend>{t.method}</legend>
            <div className="cf-pills" role="radiogroup" aria-label={t.method}>
              {([
                ["phone", t.phoneCall],
                ["whatsapp", t.whatsappOpt],
                ["email", t.emailOpt],
                ["video", t.video],
              ] as const).map(([value, label]) => (
                <button key={value} type="button" role="radio" aria-checked={method === value} className={method === value ? "is-on" : ""} onClick={() => setMethod(value)}>
                  {label}
                </button>
              ))}
            </div>
            <input type="hidden" name="contactVia" value={method} />
          </fieldset>

          <button className="cf-send" type="submit">{t.send}</button>
        </form>

        <aside className="cf-side">
          <section className="cf-card">
            <h2>{t.details}</h2>
            <p className="cf-placeholder">{t.phonePh}</p>
            <p className="cf-placeholder">{t.emailPh}</p>
            <p>Via Giovanni XXIII 2/a, 07029 Tempio Pausania (SS)</p>
          </section>
          <section className="cf-card">
            <h2>{t.legal}</h2>
            <ul>
              {LEGAL.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
