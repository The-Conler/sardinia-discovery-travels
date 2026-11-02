import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Caveat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { FRAMED_TRANSITION_SCRIPT } from "./framedPageTransition";
import { SITE_ZOOM_HEAD_SCRIPT } from "./siteZoomHead";
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from "./seo";

// Marks keyboard use on <html> so text fields only show the focus ring after a
// key press (buttons and links already use :focus-visible). See globals.css.
const FOCUS_SOURCE_SCRIPT = `(function(){var d=document.documentElement;var keys={Tab:1,Enter:1," ":1,Escape:1,ArrowUp:1,ArrowDown:1,ArrowLeft:1,ArrowRight:1,Home:1,End:1};addEventListener("keydown",function(e){if(keys[e.key])d.setAttribute("data-focus-source","key")},true);["pointerdown","mousedown","touchstart"].forEach(function(t){addEventListener(t,function(){d.removeAttribute("data-focus-source")},{capture:true,passive:true})})})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Playfair_Display({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const handwritten = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    "Plan your Sardinia trip with a local team: boat tours, hotels and villas, private transfers and day trips, arranged around your dates and your group.",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE.url] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Framed Page Transition: hold the first render until the page markup is parsed. */}
        <link rel="expect" href="#vt-wipe" {...{ blocking: "render" }} />
        <script dangerouslySetInnerHTML={{ __html: FRAMED_TRANSITION_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: SITE_ZOOM_HEAD_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@1,400&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: FOCUS_SOURCE_SCRIPT }} />
        {/* Animation libraries: deferred, so they download in parallel and run
            in order once the HTML is parsed (no render blocking). The page code
            that uses them waits for them (see the boot script below). Leaflet
            is loaded only by the private transfers map (TransferBooking.tsx).
            AOS: latest stable release (2.3.4) instead of the aos@next beta. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
        <script defer src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} ${handwritten.variable} antialiased`}
      >
        {children}
        <div className="vt-backdrop" aria-hidden="true" />
        <div className="vt-wipe" id="vt-wipe" aria-hidden="true" />
        <Script id="home-about-animations" strategy="afterInteractive">
          {`
(function sdtBoot() {
// The CDN libraries are deferred: wait until they have all run.
var w = window;
if (!(w.gsap && w.ScrollTrigger && w.ScrollSmoother && w.SplitText && w.AOS)) {
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', sdtBoot, { once: true }); return; }
  sdtBoot.tries = (sdtBoot.tries || 0) + 1;
  if (sdtBoot.tries < 600) requestAnimationFrame(sdtBoot);
  return;
}
// SITE ZOOM: AOS measures elements with offsetTop, which is in unzoomed
// layout pixels inside zoomed content, so its reveal points land far too
// late on zoomed desktops. There, AOS only sets things up (once: true so it
// never hides) and a ScrollTrigger, which measures on screen, toggles
// aos-animate instead. Phones are unchanged.
var siteZoomValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-zoom')) || 1;
var siteZoomed = siteZoomValue < 1;
if (siteZoomed) {
  document.querySelectorAll('[data-aos]').forEach(function (el) { el.setAttribute('data-aos-once', 'true'); });
}

AOS.init({
  disable: false,
  startEvent: 'DOMContentLoaded',
  initClassName: 'aos-init',
  animatedClassName: 'aos-animate',
  useClassNames: false,
  disableMutationObserver: false,
  debounceDelay: 50,
  throttleDelay: 99,
  offset: 130,
  delay: 0,
  duration: 400,
  easing: 'ease',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom'
});

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

var smoothContent = document.getElementById('smooth-content');
var smoother = document.getElementById('smooth-wrapper') && smoothContent
  ? ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      smoothTouch: 0.1,
      effects: true
    })
  : null;
// Safari: keep the moving page on its own GPU layer so it is moved instead of
// repainted (whole zoomed page) on every scroll frame. Pixel-identical there.
// (Guarded: a page without #smooth-content used to throw here in old WebKit.)
if (smoothContent && /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg|Android/.test(navigator.userAgent)) {
  smoothContent.style.willChange = 'transform';
}

if (siteZoomed) {
  document.querySelectorAll('[data-aos]').forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom-=' + Math.round(130 * siteZoomValue),
      onEnter: function () { el.classList.add('aos-animate'); },
      onLeaveBack: function () { el.classList.remove('aos-animate'); }
    });
  });
}

document.fonts.ready.then(function () {
  initHeadingAnimations();
});

function initHeadingAnimations() {
  var animHeadings = document.querySelectorAll('[data-animate-heading]');
  if (!animHeadings.length) return;
  animHeadings.forEach(function (heading) {
    var split = SplitText.create(heading, { type: 'words, lines' });
    gsap.set(heading, { autoAlpha: 1 });
    gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: 'top 90%',
        end: 'bottom 50%',
        toggleActions: 'play none none none'
      }
    }).from(split.lines, {
      yPercent: 100,
      rotate: 4,
      autoAlpha: 0,
      transformOrigin: '0% 50% -50',
      ease: 'power2.inOut',
      duration: 1.3,
      stagger: 0.12,
      onComplete: function () { return gsap.set(split.lines, { clearProps: 'all' }); }
            });
  });
}
})();
          `}
        </Script>
      </body>
    </html>
  );
}
