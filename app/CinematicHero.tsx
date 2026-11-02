"use client";

import { useEffect, useRef } from "react";

// Site adapter only: the section itself is a standalone vanilla web component.
export function CinematicHero() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!document.querySelector('script[data-cinematic-hero]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/cinematic-hero/hero.js';
      script.dataset.cinematicHero = '';
      document.head.append(script);
    }
    const section = document.createElement('cinematic-hero');
    host.current?.append(section);
    return () => section.remove();
  }, []);
  return <><link rel="stylesheet" href="/cinematic-hero/theme.css" /><div id="featured-journeys" ref={host} style={{ minHeight: 'calc(100 * var(--vh))' }} /></>;
}
