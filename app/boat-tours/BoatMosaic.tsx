"use client";

import { MosaicReveal } from "../MosaicReveal";
import type { MosaicImages } from "../MosaicReveal";

const M = "/experiences/boat-mosaic/";
const images: MosaicImages = {
  top: [
    { src: M + "corsica.webp", w: 2400, h: 1600, alt: "White limestone cliffs and sea stacks of Bonifacio, Corsica, above blue water" },
    { src: M + "maddalena.webp", w: 2400, h: 1800, alt: "Boats anchored in clear turquoise water in the La Maddalena archipelago" },
  ],
  middleLeft: { src: M + "tavolara.webp", w: 2400, h: 1715, alt: "Tavolara island rising from the sea, seen from the rocky shore at Porto San Paolo" },
  featured: { src: M + "asinara.webp", w: 2400, h: 1800, alt: "Turquoise bay of Cala Sabina framed by green scrub on Asinara island" },
  middleRight: { src: M + "baunei.webp", w: 2400, h: 1600, alt: "Swimmers in the clear turquoise water of Cala Goloritzè on the Baunei coast" },
  bottom: [
    { src: M + "alghero.webp", w: 2400, h: 1591, alt: "Boats anchored below the green headlands on the coast road between Alghero and Bosa" },
    { src: M + "cagliari.webp", w: 2400, h: 1717, alt: "Aerial view of a marina and turquoise bay on the coast near Cagliari" },
  ],
};

export function BoatMosaic() {
  return <div className="boat-mosaic"><MosaicReveal images={images} headline={["Somewhere to", "slow down."]} /></div>;
}
