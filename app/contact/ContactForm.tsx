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
    phonePhInput: "+39 ...",
    emailPhInput: "you@example.com",
    messagePh: "Your message...",
    send: "Send request",
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
    phonePhInput: "+39 ...",
    emailPhInput: "tu@esempio.com",
    messagePh: "Il tuo messaggio...",
    send: "Invia richiesta",
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

function Icon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "phone") return <svg {...common}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" /></svg>;
  if (name === "mail") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
  if (name === "pin") return <svg {...common}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  if (name === "clip") return <svg {...common}><path d="m21.4 11.1-9.2 9.2a5 5 0 0 1-7.1-7.1l9.2-9.2a3.5 3.5 0 0 1 5 5l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" /></svg>;
  if (name === "chat") return <svg {...common}><path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0Z" /></svg>;
  if (name === "wa") return <svg {...common}><path d="M21 12a8.5 8.5 0 0 1-12.7 7.4L3 21l1.7-5.1A8.5 8.5 0 1 1 21 12Z" /><path d="M9 10.5c.3 1.6 2 3.2 3.6 3.6l1.1-1.1c.2-.2.5-.2.7 0l1.2 1.2" /></svg>;
  if (name === "cam") return <svg {...common}><path d="M15 10.5 20 8v8l-5-2.5" /><rect x="3" y="7" width="12" height="10" rx="2" /></svg>;
  return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
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
          <div className="cf-row">
            <label className="cf-field">
              <span>{t.phone}</span>
              <span className="cf-input"><Icon name="phone" /><input type="tel" name="phone" autoComplete="tel" placeholder={t.phonePhInput} /></span>
            </label>
            <label className="cf-field">
              <span>{t.email}</span>
              <span className="cf-input"><Icon name="mail" /><input type="email" name="email" autoComplete="email" placeholder={t.emailPhInput} /></span>
            </label>
          </div>
          <label className="cf-field">
            <span>{t.message}</span>
            <textarea name="message" rows={2} placeholder={t.messagePh} />
          </label>
          <div className="cf-field">
            <span>{t.file}</span>
            <label className="cf-file">
              <input type="file" name="file" accept="application/pdf,image/*" onChange={(event) => setFileName(event.target.files?.[0]?.name || "")} />
              <span className="cf-file-btn"><Icon name="clip" />{t.choose}</span>
              <span className="cf-file-name">{fileName || t.none}</span>
            </label>
          </div>

          <hr className="cf-rule" />
          <div className="cf-split">
            <fieldset className="cf-block">
              <legend>{t.whatsapp}</legend>
              <div className="cf-seg" role="radiogroup" aria-label={t.whatsapp}>
                {(["yes", "no"] as const).map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={whatsapp === value} className={whatsapp === value ? "is-on" : ""} onClick={() => chooseWhatsapp(value)}>{t[value]}</button>
                ))}
              </div>
              <input type="hidden" name="whatsapp" value={whatsapp} />
            </fieldset>
            {whatsapp === "no" && (
              <fieldset className="cf-block">
                <legend>{t.rather}</legend>
                <div className="cf-pills">
                  <button type="button" className={method === "phone" ? "is-on" : ""} onClick={() => setMethod("phone")}><Icon name="phone" />{t.phoneCall}</button>
                  <button type="button" className={method === "other" ? "is-on" : ""} onClick={() => setMethod("other")}><Icon name="chat" />{t.otherApp}</button>
                </div>
              </fieldset>
            )}
          </div>
          {whatsapp === "no" && (
            <p className="cf-note">
              {t.note}{" "}
              <a href={APP_STORE} target="_blank" rel="noreferrer noopener">{t.appStore}</a>
              {" · "}
              <a href={PLAY_STORE} target="_blank" rel="noreferrer noopener">{t.play}</a>
            </p>
          )}
          {whatsapp === "no" && method === "other" && (
            <label className="cf-field">
              <span>{t.whichApp}</span>
              <input name="otherApp" value={otherAppName} onChange={(event) => setOtherAppName(event.target.value)} />
            </label>
          )}

          <hr className="cf-rule" />
          <div className="cf-foot">
            <fieldset className="cf-block">
              <legend>{t.method}</legend>
              <div className="cf-pills" role="radiogroup" aria-label={t.method}>
                {([
                  ["phone", t.phoneCall, "phone"],
                  ["whatsapp", t.whatsappOpt, "wa"],
                  ["email", t.emailOpt, "mail"],
                  ["video", t.video, "cam"],
                ] as const).map(([value, label, icon]) => (
                  <button key={value} type="button" role="radio" aria-checked={method === value} className={method === value ? "is-on" : ""} onClick={() => setMethod(value)}>
                    <Icon name={icon} />{label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="contactVia" value={method} />
            </fieldset>
            <button className="cf-send" type="submit">{t.send}<Icon name="chevron" /></button>
          </div>
          <input type="hidden" name="date" value={date ? date.toISOString().slice(0, 10) : ""} />
          <input type="hidden" name="time" value={time} />
        </form>

        <section className="cf-card cf-book-card">
          <h2>{t.book}</h2>
          <div className="cf-book">
            <div>
              <p className="cf-label">{t.date}</p>
              <div className="cf-cal">
                <div className="cf-cal-bar">
                  <button type="button" aria-label={t.prev} onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</button>
                  <strong>{t.months[month]} {year}</strong>
                  <button type="button" aria-label={t.next} onClick={() => setCursor(new Date(year, month + 1, 1))}>›</button>
                </div>
                <div className="cf-cal-week">{t.week.map((day) => <span key={day}>{day}</span>)}</div>
                <div className="cf-cal-grid">
                  {cells.map((cell, index) => {
                    if (!cell) return <span key={`e${index}`} />;
                    const open = isBookable(cell, today);
                    const on = !!date && dayKey(date) === dayKey(cell);
                    return <button key={dayKey(cell)} type="button" disabled={!open} className={`${open ? "is-open" : ""}${on ? " is-on" : ""}`} onClick={() => { setDate(cell); setTime(""); }}>{cell.getDate()}</button>;
                  })}
                </div>
              </div>
            </div>
            <div className="cf-times">
              <p className="cf-label">{t.time}</p>
              {date ? (
                <div className="cf-slots">
                  {times.map((slot) => (
                    <button key={slot} type="button" className={time === slot ? "is-on" : ""} onClick={() => setTime(slot)}>{slot}</button>
                  ))}
                </div>
              ) : <p className="cf-hint">{t.pickDate}</p>}
            </div>
          </div>
        </section>

        <aside className="cf-side">
          <section className="cf-card">
            <h2>{t.details}</h2>
            <p className="cf-line"><Icon name="phone" /><span>{t.phonePh}</span></p>
            <p className="cf-line"><Icon name="mail" /><span>{t.emailPh}</span></p>
            <p className="cf-line"><Icon name="pin" /><span>Via Giovanni XXIII 2/a<br />07029 Tempio Pausania (SS)</span></p>
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
