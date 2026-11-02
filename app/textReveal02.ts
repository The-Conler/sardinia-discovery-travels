/**
 * Text Reveal 02 — SplitText-based line/word/char reveal.
 *
 * Adapted for this project: gsap, SplitText and ScrollTrigger are loaded
 * globally from the CDN in app/layout.tsx (and registered there), so this
 * module reads those globals instead of importing from npm. Behavior is kept
 * faithful to the original helper: split the text, reveal each piece from
 * opacity 0.1, with optional threshold / scrubbed scroll triggers.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

interface RevealGlobals {
  gsap?: Any;
  SplitText?: Any;
  ScrollTrigger?: Any;
}

export function textReveal02(
  scope: Document | Element = document,
  delay = 0,
  { ignoreManual = false }: { ignoreManual?: boolean } = {},
): void {
  const w = window as unknown as RevealGlobals;
  const gsap = w.gsap;
  const SplitText = w.SplitText;
  if (!gsap || !SplitText) return;

  const CONFIG = {
    lines: { duration: 0.04, stagger: 0.03, ease: "power1.out" },
    words: { duration: 0.04, stagger: 0.03, ease: "power1.out" },
    chars: { duration: 0.04, stagger: 0.03, ease: "power1.out" },
    scrollStart: "top 85%",
    scrubStart: "top 80%",
    scrubEnd: "top 20%",
    once: true,
    markers: false,
  } as const;

  const allSplitEls = scope.querySelectorAll("[data-reveal-02]");
  const autoEls = ignoreManual
    ? [...allSplitEls]
    : [...allSplitEls].filter((el) => !el.hasAttribute("data-manual"));

  gsap.set(autoEls, { visibility: "visible" });

  allSplitEls.forEach((el) => {
    const splitType = el.getAttribute("data-reveal-02") as "lines" | "words" | "chars" | null;
    const c = splitType ? CONFIG[splitType] : undefined;
    if (!splitType || !c) return;

    let type: string;
    let linesClass: string | undefined;
    let wordsClass: string | undefined;
    let charsClass: string | undefined;
    switch (splitType) {
      case "lines":
        type = "lines";
        linesClass = "line";
        break;
      case "words":
        type = "words, lines";
        wordsClass = "word";
        linesClass = "line";
        break;
      case "chars":
        type = "chars, words, lines";
        charsClass = "char";
        wordsClass = "word";
        linesClass = "line";
        break;
      default:
        return;
    }

    if (!ignoreManual && el.hasAttribute("data-manual")) {
      SplitText.create(el, {
        type,
        autoSplit: true,
        ...(linesClass && { linesClass }),
        ...(wordsClass && { wordsClass }),
        ...(charsClass && { charsClass }),
      });
      return;
    }

    const scrollMode = el.getAttribute("data-scroll");
    const useScroll = el.hasAttribute("data-scroll");
    const useScrub = scrollMode === "scrub";

    SplitText.create(el, {
      type,
      autoSplit: true,
      ...(linesClass && { linesClass }),
      ...(wordsClass && { wordsClass }),
      ...(charsClass && { charsClass }),
      onSplit(instance: Any) {
        const data = (el as HTMLElement).dataset;
        const durationValue = parseFloat(data.duration as string);
        const staggerValue = parseFloat(data.stagger as string);
        const delayValue = parseFloat(data.delay as string);
        const duration = Number.isNaN(durationValue) ? c.duration : durationValue;
        const stagger = Number.isNaN(staggerValue) ? c.stagger : staggerValue;
        const elDelay = Number.isNaN(delayValue) ? 0 : delayValue;
        const ease = data.ease || c.ease;

        const targets = instance[splitType];
        const once = el.hasAttribute("data-once")
          ? el.getAttribute("data-once") !== "false"
          : CONFIG.once;

        const tween: Any = {
          opacity: 0.1,
          duration,
          stagger,
          delay: useScroll ? elDelay : elDelay + delay,
          immediateRender: true,
          ease,
        };

        if (useScrub) {
          tween.scrollTrigger = {
            trigger: el,
            start: CONFIG.scrubStart,
            end: CONFIG.scrubEnd,
            scrub: true,
            markers: CONFIG.markers,
            ...(once && { onLeave: (self: Any) => self.kill(false) }),
          };
        } else if (useScroll) {
          const start = scrollMode || CONFIG.scrollStart;
          tween.scrollTrigger = {
            trigger: el,
            start: `clamp(${start})`,
            markers: CONFIG.markers,
            ...(once ? { once: true } : { toggleActions: "play none none reverse" }),
          };
        }

        return gsap.from(targets, tween);
      },
    });
  });
}
