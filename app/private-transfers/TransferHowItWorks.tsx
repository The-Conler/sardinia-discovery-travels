"use client";

import { useState } from "react";

const journeys = [
  { label: "Airport → Hotel", steps: [
    ["Book your airport transfer", "Choose your airport, accommodation and vehicle. Add your arrival date, flight number and any extras."],
    ["We follow your flight", "We use your flight details to coordinate your pickup if your arrival time changes."],
    ["Meet in arrivals", "Find your private driver in the arrivals hall with a name sign, ready to help with your luggage."],
    ["Arrive at your hotel", "Settle into your Mercedes and travel directly to your hotel, villa or apartment."]
  ] },
  { label: "Hotel → Airport", steps: [
    ["Plan your departure", "Enter your accommodation, departure airport and pickup time. Add your flight details when booking."],
    ["Confirm your pickup", "We confirm the meeting point and journey details so you can plan your departure."],
    ["Meet at your hotel", "Your driver meets you at the agreed entrance and helps load your luggage."],
    ["Travel to your terminal", "Enjoy a private ride directly to the airport departure terminal."]
  ] },
  { label: "Hotel → Activity", steps: [
    ["Choose your experience", "Enter your hotel and the activity meeting point, from a boat departure to a winery or guided tour."],
    ["Set your timing", "Choose a pickup time to suit your activity. Select a return journey if you also need a ride back."],
    ["Meet your driver", "Your driver picks you up at the agreed hotel entrance, ready for your day out."],
    ["Enjoy your day", "Arrive at your activity meeting point. If booked, your return transfer brings you back afterwards."]
  ] },
  { label: "Hotel → Ferry", steps: [
    ["Book your port transfer", "Choose your accommodation, ferry port and pickup time. Share your sailing details in the booking notes."],
    ["Confirm the details", "We confirm the pickup point and destination terminal before your journey."],
    ["Leave from your hotel", "Meet your driver at your accommodation with your luggage ready to go."],
    ["Arrive at the port", "Travel directly to your ferry terminal, with time planned around your check-in requirements."]
  ] },
  { label: "Ferry → Hotel", steps: [
    ["Choose your arrival port", "Select your ferry port and accommodation. Add your arrival time and sailing details in the booking notes."],
    ["Arrange your meeting", "We confirm where to meet your driver at the port. Let us know if your sailing time changes."],
    ["Meet at the terminal", "Your driver welcomes you at the agreed meeting point and helps with your bags."],
    ["Relax on the way", "Travel privately from the port straight to your hotel, villa or apartment."]
  ] }
];
const stock = {
  airport: "/transfers/situations/airport.jpg",
  hotel: "/transfers/situations/hotel.jpg",
  ferry: "/transfers/situations/ferry.jpg",
  activity: "/transfers/situations/activity.jpg",
  car: "/transfers/vclass-long.jpg",
  cabin: "/transfers/interiors/cabin.jpg",
};
const journeyImages = [
  [stock.airport, stock.airport, stock.car, stock.hotel],
  [stock.hotel, stock.cabin, stock.car, stock.airport],
  [stock.activity, stock.activity, stock.car, stock.activity],
  [stock.hotel, stock.ferry, stock.car, stock.ferry],
  [stock.ferry, stock.ferry, stock.car, stock.hotel],
];
const paths = ["M8 2v4M16 2v4M3 10h18M9 16l2 2 4-4", "M12 7v5l3 2", "M3 11h18M5 17H3v-6l3-6h12l3 6v6h-2M9 17h6", "m8 12 3 3 5-6"];

export function TransferHowItWorks() {
  const [category, setCategory] = useState(0);
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="pt-hiw-categories" role="group" aria-label="Transfer journey">
        {journeys.map((journey, i) => (
          <button key={journey.label} type="button" aria-pressed={category === i} onClick={() => { setCategory(i); setActive(0); }}>{journey.label}</button>
        ))}
      </div>
      <div className="pt-hiw-grid" style={{ gridTemplateColumns: journeys[category].steps.map((_, i) => active === i ? "1.5fr" : "1fr").join(" ") }}>
        {journeys[0].steps.map((_, i) => (
          <button type="button" className={`pt-hiw-card${active === i ? " is-featured" : ""}`} key={i} aria-expanded={active === i} aria-controls={`transfer-step-${i}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
            <span className="pt-hiw-media" aria-hidden="true">
              {[...new Set(journeyImages.map(images => images[i]))].map(src => (
                <img key={src} className={src === journeyImages[category][i] ? "is-current" : ""} src={src} alt="" loading="eager" decoding="async" />
              ))}
            </span>
            <span className="pt-hiw-num" aria-hidden="true">0{i + 1}</span>
            <span className="pt-hiw-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{i === 0 && <rect x="3" y="4" width="18" height="18" rx="2" />}{i === 1 && <circle cx="12" cy="12" r="9" />}{i === 2 && <><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>}{i === 3 && <path d="m12 3 9 4v5c0 5-9 9-9 9s-9-4-9-9V7Z" />}<path d={paths[i]} /></svg></span>
            <span className="pt-hiw-title pt-hiw-copy-stack">
              {journeys.map((journey, j) => <span key={journey.label} className={category === j ? "is-current" : ""} aria-hidden={category !== j}>{journey.steps[i][0]}</span>)}
            </span>
            <span className="pt-hiw-description-reveal" id={`transfer-step-${i}`} aria-hidden={active !== i}>
              <span className="pt-hiw-description-inner">
                <span className="pt-hiw-description pt-hiw-copy-stack">
                  {journeys.map((journey, j) => <span key={journey.label} className={category === j ? "is-current" : ""} aria-hidden={category !== j}>{journey.steps[i][1]}</span>)}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
