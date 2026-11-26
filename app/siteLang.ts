"use client";

import { useEffect, useState } from "react";

/** Site language for pages that have Italian and English copy. Dutch falls back to English. */
export type SiteLang = "it" | "en";

export const SITE_LANG_KEY = "sdt-site-lang";
export const SITE_LANG_EVENT = "sdt-lang";

export function readSiteLang(): SiteLang {
  if (typeof window === "undefined") return "en";
  const q = new URLSearchParams(window.location.search).get("lang");
  if (q === "it" || q === "en") return q;
  try {
    const saved = window.localStorage.getItem(SITE_LANG_KEY);
    if (saved === "it" || saved === "en") return saved;
  } catch { /* private mode */ }
  return "en";
}

export function writeSiteLang(code: string) {
  const lang: SiteLang = code === "it" ? "it" : "en";
  try { window.localStorage.setItem(SITE_LANG_KEY, lang); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(SITE_LANG_EVENT, { detail: lang }));
}

export function useSiteLang(): SiteLang {
  const [lang, setLang] = useState<SiteLang>("en");
  useEffect(() => {
    const apply = () => setLang(readSiteLang());
    apply();
    window.addEventListener(SITE_LANG_EVENT, apply);
    return () => window.removeEventListener(SITE_LANG_EVENT, apply);
  }, []);
  return lang;
}
