"use client";

import { useEffect, useRef, useState } from "react";

// Guest-stories carousel (inspired by ohmd.com): a sliding track of images with
// a light quote card overlaid on the left. The image track slides smoothly and
// auto-advances; the quote cross-fades. Restyled for the cream OhMD look with a
// teal accent.

const stories = [
  {
    quote:
      "We anchored in a cove near Baunei with no one else in sight — swam straight off the deck, ate slowly, and completely lost track of time.",
    name: "Sofia & Marco",
    role: "Milan · Maddalena route",
    image: "/destinations/east-sardinia.png",
  },
  {
    quote:
      "Our skipper knew every hidden beach and sea cave. It felt less like a tour and more like a friend showing us their island.",
    name: "The Bennett Family",
    role: "London · Tavolara route",
    image: "/experiences/boat-tour.webp",
  },
  {
    quote:
      "Sunset aperitivo on the water off Alghero — quietly the most beautiful evening of our whole trip to Sardinia.",
    name: "Anke van Dijk",
    role: "Amsterdam · Alghero route",
    image: "/destinations/west-sardinia.png",
  },
  {
    quote:
      "Everything was handled — the route, the timing, the food. We just stepped on board and let the day unfold.",
    name: "James & Olivia",
    role: "Dublin · Cagliari route",
    image: "/destinations/islands.png",
  },
];

export function BoatStories() {
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = stories.length;

  // Slide the track so the active image sits at ~66% of the viewport width
  // (leaving the left third for the quote card).
  useEffect(() => {
    const compute = () => {
      const vp = viewportRef.current;
      const track = trackRef.current;
      if (!vp || !track) return;
      const slide = track.children[active] as HTMLElement | undefined;
      if (!slide) return;
      setOffset(vp.clientWidth * 0.66 - (slide.offsetLeft + slide.offsetWidth / 2));
    };
    compute();
    const t = window.setTimeout(compute, 320); // after fonts/layout settle
    window.addEventListener("resize", compute);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", compute);
    };
  }, [active]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), 5500);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const story = stories[active];

  return (
    <section
      className="boat-stories"
      aria-labelledby="boat-stories-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="boat-section-heading">
        <p>Guest stories</p>
        <h2 id="boat-stories-title">Days people still talk about.</h2>
      </div>

      <div className="boat-stories-viewport" ref={viewportRef}>
        <div
          className="boat-stories-track"
          ref={trackRef}
          style={{ transform: `translateX(${offset}px)` }}
        >
          {stories.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className={`boat-story-imgslide ${i === active ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${s.image})` }}
              aria-label={`View story from ${s.name}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <article className="boat-story-card" key={active}>
          <div
            className="boat-story-card-mobile-img"
            style={{ backgroundImage: `url(${story.image})` }}
            aria-hidden="true"
          />
          <blockquote>“{story.quote}”</blockquote>
          <div className="boat-story-author">
            <p>{story.name}</p>
            <span>{story.role}</span>
          </div>
          <div className="boat-story-actions">
            <button className="boat-story-read" type="button">
              Read story
            </button>
            <button className="boat-story-read-circle" type="button" aria-label="Read story">
              →
            </button>
          </div>
        </article>
      </div>

      <div className="boat-story-dots" role="tablist" aria-label="Choose a story">
        {stories.map((s, i) => (
          <button
            key={s.name}
            className={`boat-story-dot ${i === active ? "is-active" : ""}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Story ${i + 1}: ${s.name}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  );
}
