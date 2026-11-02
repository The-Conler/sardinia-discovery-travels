"use client";

import { useEffect, useRef } from "react";

// Site adapter only; the accordion is a standalone vanilla web component.
export function FaqSection() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!document.querySelector('script[data-faq-section]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/faq/faq.js';
      script.dataset.faqSection = '';
      document.head.append(script);
    }
    const section = document.createElement('faq-section');
    host.current?.append(section);
    return () => section.remove();
  }, []);
  return <><link rel="stylesheet" href="/faq/theme.css" /><div id="faq" ref={host} /></>;
}
