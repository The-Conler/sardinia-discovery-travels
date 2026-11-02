// Framed Page Transition.
//
// Every link on this site is a plain <a href>, so each navigation is a full
// document load and no client router owns it. The page scripts (ScrollSmoother,
// ScrollTrigger pins, mosaics, AOS, SplitText headings, the contact wizard)
// initialise once per document. The transition therefore uses the native
// cross-document View Transition API (@view-transition { navigation: auto } in
// globals.css). The browser waits for the next page, captures the old page,
// swaps in the new document and plays the animations below. Nothing replaces
// DOM by hand. Browsers without cross-document view transitions simply
// navigate normally.
//
// This script is inlined in <head> so the pageswap / pagereveal listeners
// exist before the first render of every document.
export const FRAMED_TRANSITION_SCRIPT = `(function () {
  var html = document.documentElement;
  var FRAME_EASE = "cubic-bezier(0.46, 0.03, 0.515, 0.955)";
  var SMALL = "(max-width: 480px)";

  function clear() {
    html.removeAttribute("data-transitioning");
    html.removeAttribute("data-vt-no-fab");
  }

  function play(target, keyframes, options) {
    options.fill = "both";
    options.pseudoElement = target;
    return html.animate(keyframes, options);
  }

  function framed() {
    play("::view-transition-old(page)", { scale: [1, 0.818] }, { duration: 790, easing: FRAME_EASE });
    play("::view-transition-old(page)", { translate: ["0 0", "0 -100%"] }, { duration: 1010, delay: 316, easing: FRAME_EASE });
    play("::view-transition-new(page)", { translate: ["0 100%", "0 0"] }, { duration: 1010, delay: 316, easing: FRAME_EASE });
    play("::view-transition-new(page)", { scale: [0.818, 1] }, { duration: 790, delay: 1023, easing: FRAME_EASE });
    play("::view-transition-new(wipe)", { opacity: [0, 0] }, { duration: 1813, easing: FRAME_EASE });
  }

  function wipe() {
    play("::view-transition-old(page)", [
      { opacity: 1, offset: 0 },
      { opacity: 1, offset: 0.4999 },
      { opacity: 0, offset: 0.5 },
      { opacity: 0, offset: 1 }
    ], { duration: 1980, easing: "linear" });
    play("::view-transition-new(page)", { opacity: [1, 1] }, { duration: 1980, easing: "linear" });
    play("::view-transition-new(wipe)", [
      { translate: "0 120%", offset: 0, easing: "cubic-bezier(0.55, 0.06, 0.675, 0.19)" },
      { translate: "0 0", offset: 0.5, easing: "cubic-bezier(0.22, 0.61, 0.355, 1)" },
      { translate: "0 -120%", offset: 1 }
    ], { duration: 1980, easing: "linear" });
  }

  // Old document: name the page, wipe and persistent chrome just before capture.
  window.addEventListener("pageswap", function (event) {
    if (event.viewTransition) html.setAttribute("data-transitioning", "out");
  });

  // New document (also fires on first load and bfcache restores).
  window.addEventListener("pagereveal", function (event) {
    var vt = event.viewTransition;
    if (!vt) { clear(); return; }
    html.setAttribute("data-transitioning", "in");
    // A page without the right social bar must not keep the old bar's group,
    // which would otherwise still carry its backdrop-filter.
    if (!document.querySelector(".floating-actions")) html.setAttribute("data-vt-no-fab", "");
    var skip = function () { vt.skipTransition(); };
    window.addEventListener("resize", skip);
    vt.ready.then(function () {
      if (window.matchMedia(SMALL).matches) wipe(); else framed();
    }).catch(function () {});
    vt.finished.catch(function () {}).then(function () {
      window.removeEventListener("resize", skip);
      clear();
    });
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted && !html.hasAttribute("data-transitioning")) clear();
  });
})();`;
