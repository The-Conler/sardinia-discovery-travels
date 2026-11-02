"use client";

import { useEffect, useRef } from "react";
import { mosaicRevealScroll } from "./mosaicRevealScroll";
import "./mosaic-reveal.css";

export type MosaicImg = { src: string; w: number; h: number; alt: string };
type Img = MosaicImg;
export type MosaicImages = { top: Img[]; middleLeft: Img; featured: Img; middleRight: Img; bottom: Img[] };
const M = "/experiences/mosaic/";
const top: Img[] = [
  { src: M + "tl-goloritze-cove.webp", w: 1600, h: 900, alt: "Turquoise water and white pebbles at Cala Goloritzè, Baunei" },
  { src: M + "tr-mariolu-cliffs.webp", w: 1600, h: 1200, alt: "Limestone cliffs dropping into clear sea at Cala Mariolu" },
];
const middleLeft: Img = { src: M + "ml-spiaggia-rosa.webp", w: 1200, h: 1601, alt: "Pink sand and granite rocks of Spiaggia Rosa on Budelli island" };
const featured: Img = { src: M + "featured-goloritze-from-sea.webp", w: 2400, h: 1600, alt: "Cala Goloritzè and its limestone spire seen from a boat on bright blue water, Baunei coast" };
const middleRight: Img = { src: M + "mr-brandinchi.webp", w: 1600, h: 1064, alt: "Shallow turquoise lagoon at Cala Brandinchi with Tavolara island behind" };
const bottom: Img[] = [
  { src: M + "bl-budelli.webp", w: 1600, h: 1065, alt: "Granite rocks and clear water on Budelli in the La Maddalena archipelago" },
  { src: M + "br-mariolu-boats.webp", w: 1600, h: 1027, alt: "Boats anchored in the blue water under the cliffs of Cala Mariolu" },
];

const homeImages: MosaicImages = { top, middleLeft, featured, middleRight, bottom };

const Tile = ({ img, eager }: { img: Img; eager?: boolean }) => (
  <div className="tile">
    <img src={img.src} width={img.w} height={img.h} alt={img.alt} loading={eager ? "eager" : "lazy"} decoding="async" />
  </div>
);

export function MosaicReveal({ images = homeImages, headline = ["Somewhere to", "slow down."] }: { images?: MosaicImages; headline?: [string, string] } = {}) {
  const { top, middleLeft, featured, middleRight, bottom } = images;
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let cleanup = () => {};
    let raf = 0;
    let tries = 0;
    let cancelled = false;
    const w = window as unknown as {
      gsap?: unknown;
      ScrollTrigger?: { refresh: () => void };
      ScrollSmoother?: { get?: () => unknown };
    };
    // The CDN gsap scripts and the ScrollSmoother.create() call in layout.tsx
    // (afterInteractive) can run after this effect, so wait for the smoother
    // to exist before creating the pin (max ~3s, then go anyway).
    const start = () => {
      if (cancelled || !ref.current) return;
      const ready = w.gsap && w.ScrollTrigger && (w.ScrollSmoother?.get?.() || !document.getElementById("smooth-wrapper"));
      if (!ready && tries++ < 180) { raf = requestAnimationFrame(start); return; }
      if (!w.gsap || !w.ScrollTrigger) return;
      cleanup = mosaicRevealScroll(ref.current);
      w.ScrollTrigger.refresh();
    };
    start();
    // Content above (images, lazy sections) keeps changing height after mount,
    // which leaves the trigger's start stale. Refresh (debounced) when the page
    // content height actually changes.
    let lastH = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const content = document.getElementById("smooth-content") ?? document.body;
    const ro = new ResizeObserver(() => {
      const h = content.offsetHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      clearTimeout(t);
      t = setTimeout(() => w.ScrollTrigger?.refresh(), 200);
    });
    ro.observe(content);
    const onLoad = () => w.ScrollTrigger?.refresh();
    window.addEventListener("load", onLoad);
    return () => { cancelled = true; cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(t); window.removeEventListener("load", onLoad); cleanup(); };
  }, []);

  return (
    <section className="mosaic-reveal" data-mosaic-reveal ref={ref}>
      <div className="camera">
        <div className="collage" data-collage>
          <div className="row outer">{top.map((i) => <Tile key={i.src} img={i} />)}</div>
          <div className="row">
            <Tile img={middleLeft} />
            <div className="tile featured" data-featured>
              <img src={featured.src} width={featured.w} height={featured.h} alt={featured.alt} decoding="async" />
            </div>
            <Tile img={middleRight} />
          </div>
          <div className="row outer">{bottom.map((i) => <Tile key={i.src} img={i} />)}</div>
        </div>
        <h2 className="headline" data-mosaic-headline>
          <span className="line">{headline[0]}</span>
          <span className="line">{headline[1]}</span>
        </h2>
      </div>
    </section>
  );
}
