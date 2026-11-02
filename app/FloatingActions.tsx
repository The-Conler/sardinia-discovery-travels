"use client";

// Fixed liquid-glass action buttons (bottom-right): WhatsApp, Instagram, Contact.
// Matches the header pill glass style. Placed outside #smooth-content so the
// ScrollSmoother transform doesn't break `position: fixed`.
//
// Phones (max-width 640px): the bar tucks into the right edge so it never sits
// over content you are using: while you scroll down, while a form is in the
// middle of the screen, and while a field has focus (keyboard open). It comes
// back when you scroll up or reach the top, and a small glass tab on the edge
// brings it back at any time with one tap.

import { useEffect, useRef, useState } from "react";

const PHONE = "(max-width: 640px)";
// Areas the bar must not cover on phones.
const AVOID = "form, .ht-request, [data-floating-avoid]";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.892-11.893A11.821 11.821 0 0 0 20.463 3.488" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}

export function FloatingActions() {
  const [tucked, setTucked] = useState(false);
  const manual = useRef<{ y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    let lastY = window.scrollY;
    let scrollTuck = false;
    let formInView = false;
    let fieldFocused = false;
    let raf = 0;

    const isField = (el: Element | null) =>
      !!el && el.matches("input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select, [contenteditable=true]");

    const apply = () => {
      if (!mq.matches) { setTucked(false); return; }
      // A tap on the edge tab keeps the bar out until you scroll a little or type.
      if (manual.current && !fieldFocused && Math.abs(window.scrollY - manual.current.y) < 160) { setTucked(false); return; }
      manual.current = null;
      setTucked(scrollTuck || formInView || fieldFocused);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const dy = y - lastY;
        if (y < 80) scrollTuck = false;
        else if (dy > 6) scrollTuck = true;
        else if (dy < -6) scrollTuck = false;
        if (Math.abs(dy) > 6) lastY = y;
        apply();
      });
    };

    // A form counts as "in view" when it crosses the middle band of the screen,
    // where the bar sits.
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        formInView = visible.size > 0;
        apply();
      },
      { rootMargin: "-22% 0px -22% 0px" },
    );
    const watched = new Set<Element>();
    const watch = () => {
      document.querySelectorAll(AVOID).forEach((el) => {
        if (el.closest(".site-header, .travel-header, #site-menu-panel") || watched.has(el)) return;
        // Only watch the outermost avoid area.
        if (el.parentElement?.closest(AVOID)) return;
        watched.add(el);
        io.observe(el);
      });
    };
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });

    const onFocusIn = (e: FocusEvent) => { fieldFocused = isField(e.target as Element); apply(); };
    const onFocusOut = () => {
      window.setTimeout(() => { fieldFocused = isField(document.activeElement); apply(); }, 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    mq.addEventListener("change", apply);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      mq.removeEventListener("change", apply);
      io.disconnect();
      mo.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const reveal = () => {
    manual.current = { y: window.scrollY };
    setTucked(false);
  };

  const linkTab = tucked ? -1 : undefined;

  return (
    <div className={`floating-actions${tucked ? " is-tucked" : ""}`} aria-label="Contact and social">
      <button
        className="floating-actions-tab"
        type="button"
        aria-label="Show contact options"
        tabIndex={tucked ? 0 : -1}
        aria-hidden={!tucked}
        onClick={reveal}
      />
      <a
        className="floating-action"
        tabIndex={linkTab}
        href="https://wa.me/393000000000"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Message us on WhatsApp"
      >
        <WhatsAppIcon />
        <span className="sr-only">WhatsApp</span>
      </a>
      <a
        className="floating-action"
        tabIndex={linkTab}
        href="https://www.instagram.com/"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Follow us on Instagram"
      >
        <InstagramIcon />
        <span className="sr-only">Instagram</span>
      </a>
      <a className="floating-action" href="/contact" aria-label="Contact us" tabIndex={linkTab}>
        <ContactIcon />
        <span className="sr-only">Contact us</span>
      </a>
    </div>
  );
}
