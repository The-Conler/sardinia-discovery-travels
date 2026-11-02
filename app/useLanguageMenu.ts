"use client";

import { useEffect, useRef } from "react";

/**
 * Open and close behaviour for the header language switcher: a tap or click
 * outside, Escape, or focus moving elsewhere closes it. Escape returns focus
 * to the EN button. The options themselves are hidden from Tab while closed
 * by CSS (visibility on .language-menu in globals.css).
 */
export function useLanguageMenu(open: boolean, setOpen: (open: boolean) => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) =>
      !!ref.current && target instanceof Node && ref.current.contains(target);
    const onPointerDown = (event: PointerEvent) => {
      if (!inside(event.target)) setOpen(false);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!inside(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      ref.current?.querySelector<HTMLElement>(".language-button")?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  /** After a choice, give focus back to the EN button so keyboard users keep their place. */
  const focusButton = () => ref.current?.querySelector<HTMLElement>(".language-button")?.focus();

  return { ref, focusButton };
}
