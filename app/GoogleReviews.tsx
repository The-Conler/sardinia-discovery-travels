"use client";

import { useEffect, useRef } from "react";

// Site adapter: all review markup and behavior live in the standalone vanilla module.
export function GoogleReviews() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!document.querySelector('script[data-google-reviews]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/google-reviews/reviews.js';
      script.dataset.googleReviews = '';
      document.head.append(script);
    }
    const section = document.createElement('google-reviews');
    host.current?.append(section);
    return () => section.remove();
  }, []);
  return <><link rel="stylesheet" href="/google-reviews/theme.css" /><div id="google-reviews" ref={host} /></>;
}
