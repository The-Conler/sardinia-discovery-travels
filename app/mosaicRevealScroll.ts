/* Mosaic Reveal Scroll — vanilla GSAP + ScrollTrigger.
 * gsap / ScrollTrigger are loaded globally from the CDN in app/layout.tsx,
 * so this reads them from window instead of importing a second copy. */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;
type MosaicRoot = HTMLElement & { mosaicRevealCleanup?: () => void };
import { siteZoom } from "./siteZoom";

export function mosaicRevealScroll(scope: Element | Document = document): () => void {
  const w = window as Any;
  const gsap = w.gsap;
  const ScrollTrigger = w.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return () => {};
  gsap.registerPlugin(ScrollTrigger);

  const roots: MosaicRoot[] = [];
  if (scope instanceof HTMLElement && scope.matches("[data-mosaic-reveal]")) roots.push(scope);
  scope.querySelectorAll<HTMLElement>("[data-mosaic-reveal]").forEach((r) => roots.push(r));

  const cleanups = roots.map((root) => {
    root.mosaicRevealCleanup?.();
    const camera = root.querySelector<HTMLElement>(".camera");
    const featured = root.querySelector<HTMLElement>("[data-featured]");
    const lines = root.querySelectorAll<HTMLElement>("[data-mosaic-headline] .line");
    if (!camera || !featured) return () => {};

    const context = gsap.context(() => {
      const blur = getComputedStyle(root).getPropertyValue("--mosaic-sweep-blur").trim() || "blur(6px)";
      // The site wraps every page in ScrollSmoother, which transforms
      // #smooth-content, so native sticky can't hold the camera. Always hold it
      // with a ScrollTrigger pin over the same interval (section height gives the space).
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // Screen-pixel heights so the pin length is right under the site zoom.
          end: () => `+=${root.getBoundingClientRect().height - camera.getBoundingClientRect().height}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          pin: camera,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });
      // GPU-only shrink: the collage is laid out at its final size and starts
      // scaled up around the centre so the featured photo fills the camera.
      const collage = root.querySelector<HTMLElement>("[data-collage]");
      tl.fromTo(
        collage,
        // The camera is kept unzoomed and the collage inside it is zoomed (see SITE ZOOM in globals.css).
        { scale: () => { const z = siteZoom(); return Math.max(camera.clientWidth / (featured.offsetWidth * z), camera.clientHeight / (featured.offsetHeight * z)); } },
        { scale: 1, duration: 1, ease: "power1.inOut" },
        0,
      );
      tl.fromTo(featured, { "--mosaic-shade": 0 }, { "--mosaic-shade": 0.3, duration: 0.26 }, 0.18);
      tl.fromTo(
        lines,
        { backgroundPosition: "100% 0%", filter: blur },
        { backgroundPosition: "0% 0%", filter: "blur(0px)", duration: 0.32, stagger: 0.1 },
        0.18,
      );
    }, root);

    const cleanup = () => {
      context.revert();
      if (root.mosaicRevealCleanup === cleanup) delete root.mosaicRevealCleanup;
    };
    root.mosaicRevealCleanup = cleanup;
    return cleanup;
  });

  return () => cleanups.forEach((c) => c());
}
