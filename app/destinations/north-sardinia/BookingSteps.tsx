"use client";
import { Fragment, useState, type ReactNode } from "react";

// "How booking works": four tall cards, one expanded at a time (hover, focus
// or tap), after the step cards on Calendly's homepage, in the site's dark style.
// Replaces the old "Getting here" arrival panels on this page.
//
// TODO(copy): confirm with the team before launch
//  - that the reply with a plan and prices usually arrives by the next morning
//    for clients in the US (the time zone note in step 2);
//  - the deposit: no amount or refund policy is stated on purpose; add the
//    real figure and terms here once they are fixed (step 3);
//  - that the pickup and the local contact during the trip apply to every
//    booking (step 4);
//  - that each part is booked with local partners (step 3).
// All names in the small mock screens (Emma, Marco) are example names.

type IconKind = "calendar" | "users" | "plane" | "chat" | "clock" | "tag" | "check" | "card" | "file" | "car" | "phone" | "pin";

function Ico({ kind }: { kind: IconKind }) {
  const p = { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (kind) {
    case "calendar": return <svg {...p}><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>;
    case "users": return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg>;
    case "plane": return <svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>;
    case "chat": return <svg {...p}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
    case "tag": return <svg {...p}><path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" /><circle cx="7.5" cy="7.5" r=".5" /></svg>;
    case "card": return <svg {...p}><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>;
    case "file": return <svg {...p}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m9 15 2 2 4-4" /></svg>;
    case "car": return <svg {...p}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>;
    case "phone": return <svg {...p}><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></svg>;
    case "pin": return <svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
    default: return <svg {...p}><path d="M20 6 9 17l-5-5" /></svg>;
  }
}

type Step = { n: string; title: string; line: string; text: string; checks: { icon: IconKind; tone: "teal" | "cyan" | "sand"; label: string }[]; mock: ReactNode };

const steps: Step[] = [
  {
    n: "1",
    title: "Ask",
    line: "One request with everything we need.",
    text: "Send one request with your dates, who is travelling and how you arrive. The form covers all of it, so there is no back and forth.",
    checks: [
      { icon: "calendar", tone: "teal", label: "Your dates and group size" },
      { icon: "plane", tone: "cyan", label: "How you arrive, by plane or ferry" },
      { icon: "pin", tone: "sand", label: "What you would like to do" },
    ],
    mock: (
      <div className="north-mock">
        <div className="north-mock-head"><span className="north-mock-avatar">E</span><div><strong>New request</strong><span>Emma, from the contact form</span></div></div>
        <div className="north-mock-rows">
          <span><Ico kind="calendar" /> 12 to 19 June</span>
          <span><Ico kind="users" /> 2 adults, 2 children</span>
          <span><Ico kind="plane" /> Olbia Airport</span>
        </div>
      </div>
    ),
  },
  {
    n: "2",
    title: "Plan",
    line: "A plan with prices, ready when you wake up.",
    text: "We reply with a plan and prices for your days. Many of our clients are in the US, so the reply is usually waiting for you in the morning.",
    checks: [
      { icon: "file", tone: "teal", label: "A day by day plan" },
      { icon: "tag", tone: "cyan", label: "Prices for each part" },
      { icon: "clock", tone: "sand", label: "Usually there by morning" },
    ],
    mock: (
      <div className="north-mock">
        <div className="north-mock-head"><span className="north-mock-avatar is-brand">S</span><div><strong>Sardinia Discovery Travels</strong><span>to Emma</span></div></div>
        <p className="north-mock-text">Here is a plan for your week in the north, with prices. Which day suits you for the boat trip?</p>
        <div className="north-mock-chips"><span>Tue 16 June</span><span>Wed 17 June</span><span>Thu 18 June</span></div>
      </div>
    ),
  },
  {
    n: "3",
    title: "Book",
    line: "Confirm the plan and pay a deposit.",
    text: "When the plan feels right, confirm it and pay a deposit to hold your dates. We then book each part with our local partners.",
    checks: [
      { icon: "check", tone: "teal", label: "Confirm the plan" },
      { icon: "card", tone: "cyan", label: "Pay a deposit" },
      { icon: "file", tone: "sand", label: "Get your booking summary" },
    ],
    mock: (
      <div className="north-mock">
        <div className="north-mock-head"><span className="north-mock-avatar is-brand">S</span><div><strong>Booking summary</strong><span>Emma, 12 to 19 June</span></div></div>
        <ul className="north-mock-list">
          <li><Ico kind="check" /> Catamaran day, La Maddalena</li>
          <li><Ico kind="check" /> Private transfer from Olbia</li>
          <li className="is-muted"><Ico kind="card" /> Deposit received</li>
        </ul>
      </div>
    ),
  },
  {
    n: "4",
    title: "Travel",
    line: "Pickup on arrival and a local contact.",
    text: "Your driver meets you when you land or come off the ferry, and you have a local contact to message for the whole trip.",
    checks: [
      { icon: "car", tone: "teal", label: "Pickup at the airport or port" },
      { icon: "phone", tone: "cyan", label: "One local contact to message" },
      { icon: "chat", tone: "sand", label: "Your plan, day by day" },
    ],
    mock: (
      <div className="north-mock">
        <div className="north-mock-head"><span className="north-mock-avatar">M</span><div><strong>Marco, your driver</strong><span>Olbia Airport, arrivals</span></div></div>
        <p className="north-mock-bubble">Welcome to Sardinia. I am at arrivals with your name on a sign.</p>
      </div>
    ),
  },
];

export function BookingSteps() {
  const [active, setActive] = useState(0);
  const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 1024px)").matches;
  return (
    <section className="north-steps" aria-labelledby="steps-title">
      <div className="north-steps-head">
        <p className="north-steps-label">How booking works</p>
        <h2 id="steps-title">From first message to <span className="north-steps-accent">the island</span>.</h2>
        <p className="north-steps-sub">What happens after you write to us, and what you get at each step.</p>
      </div>
      <ol className="north-steps-row">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <Fragment key={s.n}>
            <li className={`north-step${on ? " is-active" : ""}`} onMouseEnter={() => { if (canHover()) setActive(i); }}>
              <button type="button" className="north-step-hit" aria-expanded={on} aria-controls={`north-step-${s.n}`} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
                <span className="north-step-n">{s.n}</span>
                <span className="north-step-title">{s.title}</span>
              </button>
              <div className="north-step-body">
              <p className="north-step-line" aria-hidden={on}>{s.line}</p>
              <div className="north-step-more" id={`north-step-${s.n}`} aria-hidden={!on}>
                <div className="north-step-more-inner">
                  <p className="north-step-text">{s.text}</p>
                  <ul className="north-step-checks">
                    {s.checks.map(c => <li key={c.label}><span className={`north-step-ico is-${c.tone}`}><Ico kind={c.icon} /></span>{c.label}</li>)}
                  </ul>
                  <div className="north-step-mock">{s.mock}</div>
                </div>
              </div>
              </div>
              <span className="north-step-glow" aria-hidden="true" />
            </li>
            {/* Bridges that join this card to the next one into one shape.
                They sit in the flex row, so they follow the cards while one expands. */}
            {i < steps.length - 1 && (
              <li className={`north-step-bridge${active === i || active === i + 1 ? " is-near-active" : ""}`} aria-hidden="true" role="presentation">
                <span className="north-step-neck is-a" />
                <span className="north-step-neck is-b" />
              </li>
            )}
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}
