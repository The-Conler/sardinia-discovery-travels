/* Site zoom helper. The zoom factor itself lives in app/globals.css
 * (--site-zoom, see the SITE ZOOM block). Zoomed layout pixels are smaller
 * than screen pixels, so any code that takes a screen measurement
 * (getBoundingClientRect, clientX, scroll distance) and writes it back as a
 * CSS length inside a zoomed element divides by this, and the reverse. */
export function siteZoom(): number {
  if (typeof window === "undefined") return 1;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-zoom"));
  return v > 0 ? v : 1;
}
