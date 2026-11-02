"use client";
import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How is the price calculated?",
    a: "Every transfer is a fixed price based on the distance between your pickup and drop-off and the vehicle you choose. The total you see before booking is the total you pay — there are no surge fees, night surcharges or hidden extras.",
  },
  {
    q: "What happens when my flight is delayed?",
    a: "We track your flight in real time and adjust the pickup automatically, so your driver is always there when you land. For airport pickups you get up to 60 minutes of free waiting time; for ferry ports, 30 minutes.",
  },
  {
    q: "Where will I meet my driver?",
    a: "For airport and ferry pickups your driver waits in the arrivals hall with a name sign — a full meet & greet. For hotels, villas and other addresses, the driver arrives at the door at the agreed time.",
  },
  {
    q: "Can I bring extra luggage, a bike or sports gear?",
    a: "Yes. Standard luggage is included with every vehicle; oversized items such as bikes, golf bags or extra suitcases can be added as extras when you book so we send a vehicle with enough space.",
  },
  {
    q: "Do you provide child and booster seats?",
    a: "We do. Infant seats, toddler seats and boosters can be added for free-of-charge fitting during booking. Just tell us the ages and we prepare the right seats for your ride.",
  },
  {
    q: "How and when do I pay?",
    a: "You confirm your booking with us first and receive a written confirmation with the fixed price. Payment can be made in advance by card or in cash to the driver — your choice, agreed at confirmation.",
  },
  {
    q: "Can I add a stop along the way?",
    a: "Of course. Add a short stop — a supermarket, a viewpoint, a winery — in the notes when you book and we include it in your route and quote.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 24 hours before your pickup time for a full refund. Inside 24 hours, please contact us directly and we will do our best to help.",
  },
];

export function TransferFaq() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  const midpoint = Math.ceil(FAQS.length / 2);
  const columns = [FAQS.slice(0, midpoint), FAQS.slice(midpoint)];
  return (
    <div className="pt-faq-cols">
      {columns.map((col, c) => (
        <ul className="pt-faq-list" key={c}>
          {col.map((f, index) => {
            const i = c * midpoint + index;
            const isOpen = open.has(i);
            return (
              <li key={i} className={isOpen ? "is-open" : ""}>
                <button type="button" aria-expanded={isOpen} onClick={() => toggle(i)}>
                  <span>{f.q}</span>
                  <em aria-hidden="true">+</em>
                </button>
                <div className="pt-faq-a" aria-hidden={!isOpen}><div className="pt-faq-a-inner"><p>{f.a}</p></div></div>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
