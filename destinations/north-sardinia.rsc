:HL["/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","style"     ]
2:Tb5a,(function () {
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
})();0:{"__route":"route:/destinations/north-sardinia","__interceptionContext":null,"__layoutIds":["layout:/"],"__rootLayout":"/","__sourcePage":"/sardinia-discovery-travels/destinations/north-sardinia/page","page:/destinations/north-sardinia":"$L1","layout:/":[[[["$","link","css:/_next/static/css/index.DsmHui6r.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css"}],"$undefined"],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","link",null,{"rel":"expect","href":"#vt-wipe","blocking":"render"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}],"$L3","$L4","$L5","$L6","$L7","$L8","$L9","$La","$Lb","$Lc","$Ld","$Le"]}],"$Lf"]}]],"$L10"],"route:/destinations/north-sardinia":"$L11","__layoutFlags":{"layout:/":"s"},"__artifactCompatibility":{"schemaVersion":1,"graphVersion":"app-route-graph:ab0b9914cd338754","deploymentVersion":"066b05f6-8b9a-4a21-b04c-eac3bbf05bd2","appElementsSchemaVersion":1,"rscPayloadSchemaVersion":1,"rootBoundaryId":"/","renderEpoch":null},"__renderObservation":{"schemaVersion":1,"output":{"kind":"app-rsc","mountedSlotsFingerprint":null,"renderEpoch":null,"rootBoundaryId":"/","routeId":"route:/destinations/north-sardinia"},"completeness":"partial","boundaryOutcome":{"kind":"unknown"},"requestApis":[{"kind":"connection","status":"unknown"},{"kind":"cookies","status":"unknown"},{"kind":"draftMode","status":"unknown"},{"kind":"headers","status":"unknown"},{"kind":"params","status":"unknown"},{"kind":"searchParams","status":"unknown"}],"dynamicFetches":[],"cacheTags":["/sardinia-discovery-travels/destinations/north-sardinia","_N_T_/destinations/layout","_N_T_/destinations/north-sardinia","_N_T_/destinations/north-sardinia/layout","_N_T_/destinations/north-sardinia/page","_N_T_/layout"],"pathTags":["/sardinia-discovery-travels/destinations/north-sardinia"],"cacheability":"unknown","downgrade":{"target":"freshRender","reasons":[{"code":"CP_DOWNGRADE_CACHEABILITY_UNKNOWN","target":"freshRender"},{"code":"CP_DOWNGRADE_INCOMPLETE_OBSERVATION","completeness":"partial","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"connection","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"cookies","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"draftMode","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"headers","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"params","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"searchParams","target":"freshRender"}],"fallback":{"kind":"breakerFallback","code":"CP_PRIVATE_DYNAMIC_DOWNGRADE","mode":"renderFresh","scope":"affectedOutput","fields":{"reasonCodes":["CP_DOWNGRADE_CACHEABILITY_UNKNOWN","CP_DOWNGRADE_INCOMPLETE_OBSERVATION","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API"],"target":"freshRender"}},"isPublicCacheCandidate":false}}}
13:I["8c0f216c4604",[],"Children",1]
14:I["60f387d9e0f4",[],"default",1]
16:I["593f344dc510",[],"GlobalErrorBoundary",1]
17:I["0b874ad30386",[],"default",1]
18:I["593f344dc510",[],"ErrorBoundary",1]
19:I["15c18cfaeeff",[],"LayoutSegmentProvider",1]
1a:I["8c0f216c4604",[],"Slot",1]
1b:I["593f344dc510",[],"NotFoundBoundary",1]
1c:I["fb8df7f31d30",[],"SiteHeader",1]
:HL["https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@1,400&display=swap","style"     ]
:HL["https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css","style"     ]
12:T944,(function () {
  var root = document.documentElement;
  function setUnits() {
    root.style.setProperty('--ivw', (window.innerWidth / 100) + 'px');
    root.style.setProperty('--ivh', (window.innerHeight / 100) + 'px');
    root.style.setProperty('--icw', (root.clientWidth / 100) + 'px');
  }
  setUnits();
  window.addEventListener('resize', setUnits);
  document.addEventListener('DOMContentLoaded', setUnits);

  try {
    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;zoom:0.5;visibility:hidden;pointer-events:none';
    var inner = document.createElement('div');
    inner.style.cssText = 'width:100px;height:1px';
    probe.appendChild(inner);
    root.appendChild(probe);
    var legacy = Math.abs(inner.getBoundingClientRect().width - 100) < 1;
    root.removeChild(probe);
    if (!legacy) return;
    root.setAttribute('data-legacy-zoom', '');
    var parentOf = function (n) { return n.parentElement || (n.getRootNode && n.getRootNode().host) || null; };
    var zoomOf = function (n) { var v = parseFloat(getComputedStyle(n).zoom); return v || 1; };
    // Effective zoom of el (product of the zooms on it and its ancestors).
    var zoomInfo = function (el) {
      var z = 1;
      for (var n = el; n && n.nodeType === 1; n = parentOf(n)) z *= zoomOf(n);
      return Math.abs(z - 1) < 1e-6 ? null : { z: z };
    };
    // Legacy WebKit reports (document position / effective zoom) - scroll, so
    // the screen rect is (reported + scroll) * zoom - scroll.
    var rect = Element.prototype.getBoundingClientRect;
    var fix = function (r, info) {
      var sx = window.scrollX || 0, sy = window.scrollY || 0, z = info.z;
      return new DOMRect((r.x + sx) * z - sx, (r.y + sy) * z - sy, r.width * z, r.height * z);
    };
    Element.prototype.getBoundingClientRect = function () {
      var r = rect.call(this);
      var info = zoomInfo(this);
      return info ? fix(r, info) : r;
    };
    var rects = Element.prototype.getClientRects;
    Element.prototype.getClientRects = function () {
      var list = rects.call(this);
      var info = zoomInfo(this);
      if (!info) return list;
      var out = [];
      for (var i = 0; i < list.length; i++) out.push(fix(list[i], info));
      out.item = function (i) { return out[i] || null; };
      return out;
    };
  } catch (e) {}
})();3:["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$12"}}]
4:["$","link",null,{"rel":"preconnect","href":"https://fonts.googleapis.com"}]
5:["$","link",null,{"rel":"preconnect","href":"https://fonts.gstatic.com","crossOrigin":"anonymous"}]
6:["$","link",null,{"rel":"stylesheet","href":"https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@1,400&display=swap"}]
7:["$","script",null,{"dangerouslySetInnerHTML":{"__html":"(function(){var d=document.documentElement;var keys={Tab:1,Enter:1,\" \":1,Escape:1,ArrowUp:1,ArrowDown:1,ArrowLeft:1,ArrowRight:1,Home:1,End:1};addEventListener(\"keydown\",function(e){if(keys[e.key])d.setAttribute(\"data-focus-source\",\"key\")},true);[\"pointerdown\",\"mousedown\",\"touchstart\"].forEach(function(t){addEventListener(t,function(){d.removeAttribute(\"data-focus-source\")},{capture:true,passive:true})})})();"}}]
8:["$","link",null,{"rel":"preconnect","href":"https://cdn.jsdelivr.net","crossOrigin":"anonymous"}]
9:["$","link",null,{"rel":"stylesheet","href":"https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css"}]
a:["$","script",null,{"defer":true,"src":"https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"}]
b:["$","script",null,{"defer":true,"src":"https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"}]
c:["$","script",null,{"defer":true,"src":"https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"}]
d:["$","script",null,{"defer":true,"src":"https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"}]
e:["$","script",null,{"defer":true,"src":"https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"}]
15:Td54,
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
          f:["$","body",null,{"className":"__variable_geist_013ydlh __variable_geist_mono_0bm7fsx __variable_playfair_display_0y5gggp __variable_caveat_09o25g0 antialiased","children":[["$","$L13",null,{}],["$","div",null,{"className":"vt-backdrop","aria-hidden":"true"}],["$","div",null,{"className":"vt-wipe","id":"vt-wipe","aria-hidden":"true"}],["$","$L14",null,{"id":"home-about-animations","strategy":"afterInteractive","children":"$15"}]]}]
10:null
11:[[["$","meta",null,{"charSet":"utf-8"}],[["$","title","0",{"children":"North Sardinia | Sardinia Discovery Travels"}],["$","meta","1",{"name":"description","content":"Explore Costa Smeralda, the La Maddalena Archipelago, Gallura, Alghero, Castelsardo and Stintino. Find stays, boat trips and local experiences in the north of the island."}],["$","meta","2",{"property":"og:title","content":"North Sardinia | Sardinia Discovery Travels"}],["$","meta","3",{"property":"og:description","content":"Explore Costa Smeralda, the La Maddalena Archipelago, Gallura, Alghero, Castelsardo and Stintino. Find stays, boat trips and local experiences in the north of the island."}],["$","meta","4",{"property":"og:url","content":"https://sardiniadiscoverytravels.com/destinations/north-sardinia"}],["$","meta","5",{"property":"og:site_name","content":"Sardinia Discovery Travels"}],["$","meta","6",{"property":"og:type","content":"website"}],["$","meta","7",{"property":"og:locale","content":"en_US"}],["$","meta","8",{"property":"og:image","content":"https://sardiniadiscoverytravels.com/og-image.jpg"}],["$","meta","9",{"property":"og:image:width","content":"1200"}],["$","meta","10",{"property":"og:image:height","content":"630"}],["$","meta","11",{"property":"og:image:alt","content":"A motor yacht crossing clear turquoise water off the coast of Sardinia"}],["$","meta","12",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","13",{"name":"twitter:title","content":"North Sardinia | Sardinia Discovery Travels"}],["$","meta","14",{"name":"twitter:description","content":"Explore Costa Smeralda, the La Maddalena Archipelago, Gallura, Alghero, Castelsardo and Stintino. Find stays, boat trips and local experiences in the north of the island."}],["$","meta","15",{"name":"twitter:image","content":"https://sardiniadiscoverytravels.com/og-image.jpg"}],["$","link","16",{"rel":"shortcut icon","href":"/sardinia-discovery-travels/favicon.svg"}],["$","link","17",{"rel":"icon","href":"/sardinia-discovery-travels/favicon.svg"}],["$","link","18",{"rel":"canonical","href":"https://sardiniadiscoverytravels.com/destinations/north-sardinia"}]],[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]],["$","$L16",null,{"fallback":"$17","children":["$","$L18",null,{"fallback":"$17","children":["$","$L19",null,{"providerId":"layout:/","segmentMap":{"children":["destinations","north-sardinia"]},"children":["$","$L1a",null,{"id":"layout:/","parallelSlots":"$undefined","children":["$","$L1b",null,{"resetKey":"destinations","fallback":[[["$","link","css:/_next/static/css/index.DsmHui6r.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css"}],"$undefined"],[["$","$L1c",null,{}],["$","div",null,{"id":"smooth-wrapper","children":["$","div",null,{"id":"smooth-content","children":[["$","main",null,{"className":"nf-page","children":["$","section",null,{"className":"nf-hero","aria-labelledby":"nf-title","children":[["$","p",null,{"className":"nf-code","children":"Error 404"}],["$","h1",null,{"id":"nf-title","className":"nf-title","children":"We couldn't find this page"}],["$","p",null,{"className":"nf-text","children":"The link may be old or the page has moved. Start again from the home page, or tell us what you are looking for and we will point you the right way."}],["$","div",null,{"className":"nf-actions","children":[["$","a",null,{"className":"button-02 button-02--teal nf-btn","href":"/sardinia-discovery-travels/","children":[["$","span",null,{"className":"inner","children":"Home"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}],["$","a",null,{"className":"button-02 nf-btn","href":"/sardinia-discovery-travels/contact","children":[["$","span",null,{"className":"inner","children":"Contact"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}]]}]]}]}],["$","footer",null,{"id":"main-footer","className":"site-footer","aria-label":"Footer","children":[["$","div",null,{"className":"site-footer-main","children":[["$","div",null,{"className":"site-footer-left","children":[["$","img",null,{"className":"site-footer-logo","src":"/sardinia-discovery-travels/sardinia-logo.png","alt":"Sardinia Discovery Travels","loading":"lazy","decoding":"async"}],["$","nav",null,{"className":"site-footer-nav","aria-label":"Footer navigation","children":["$L1d","$L1e","$L1f","$L20","$L21","$L22"]}],"$L23","$L24"]}],"$L25"]}],"$L26","$L27","$L28"]}]]}]}]]],"children":"$L29"}]}]}]}]}],null,null]
2a:I["9276801271d6",[],"AppRouterScrollTarget",1]
2b:I["593f344dc510",[],"RedirectBoundary",1]
1d:["$","a",null,{"href":"/sardinia-discovery-travels/","children":"Explore"}]
1e:["$","a",null,{"href":"/#experiences","children":"Experiences"}]
1f:["$","a",null,{"href":"/sardinia-discovery-travels/destinations/north-sardinia","children":"North Sardinia"}]
20:["$","a",null,{"href":"/sardinia-discovery-travels/pacchetti","children":"Packages"}]
21:["$","a",null,{"href":"/sardinia-discovery-travels/about","children":"About"}]
22:["$","a",null,{"href":"/sardinia-discovery-travels/contact","children":"Contact"}]
23:["$","p",null,{"children":"Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm."}]
24:["$","div",null,{"className":"site-footer-socials","aria-label":"Social links","children":[["$","a",null,{"href":"#","children":"Instagram"}],["$","a",null,{"href":"#","children":"Facebook"}],["$","a",null,{"href":"#","children":"WhatsApp"}],["$","a",null,{"href":"/#faq","children":"FAQ"}]]}]
25:["$","div",null,{"className":"site-footer-links","aria-label":"Footer pages","children":[["$","a",null,{"href":"#","children":"Yacht Tours"}],["$","a",null,{"href":"#","children":"Blue Zone"}],["$","a",null,{"href":"#","children":"Cooking Classes"}],["$","a",null,{"href":"/sardinia-discovery-travels/off-road","children":"4x4 Off Road"}],["$","a",null,{"href":"#","children":"Private Transfers"}],["$","a",null,{"href":"/sardinia-discovery-travels/hotels","children":"Hotels"}]]}]
26:["$","div",null,{"className":"site-footer-business","aria-label":"Business and insurance information","children":[["$","p",null,{"children":"REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849"}],["$","p",null,{"children":"Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894"}]]}]
27:["$","div",null,{"className":"site-footer-bottom","children":[["$","p",null,{"children":"© 2026 Sardinia Discovery Travels"}],["$","div",null,{"children":[["$","a",null,{"href":"#","children":"Privacy Policy"}],["$","a",null,{"href":"#","children":"Terms"}],["$","a",null,{"href":"#","children":"Cookies"}]]}]]}]
28:["$","img",null,{"className":"site-footer-image","src":"https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85","alt":"Boat on turquoise water in Sardinia’s La Maddalena archipelago","loading":"lazy","decoding":"async"}]
29:["$","$L1b",null,{"resetKey":"[\"destinations\",\"north-sardinia\"]","fallback":[[["$","link","css:/_next/static/css/index.DsmHui6r.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css"}],"$undefined"],[["$","$L1c",null,{}],["$","div",null,{"id":"smooth-wrapper","children":["$","div",null,{"id":"smooth-content","children":[["$","main",null,{"className":"nf-page","children":["$","section",null,{"className":"nf-hero","aria-labelledby":"nf-title","children":[["$","p",null,{"className":"nf-code","children":"Error 404"}],["$","h1",null,{"id":"nf-title","className":"nf-title","children":"We couldn't find this page"}],["$","p",null,{"className":"nf-text","children":"The link may be old or the page has moved. Start again from the home page, or tell us what you are looking for and we will point you the right way."}],["$","div",null,{"className":"nf-actions","children":[["$","a",null,{"className":"button-02 button-02--teal nf-btn","href":"/sardinia-discovery-travels/","children":[["$","span",null,{"className":"inner","children":"Home"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}],["$","a",null,{"className":"button-02 nf-btn","href":"/sardinia-discovery-travels/contact","children":[["$","span",null,{"className":"inner","children":"Contact"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}]]}]]}]}],["$","footer",null,{"id":"main-footer","className":"site-footer","aria-label":"Footer","children":[["$","div",null,{"className":"site-footer-main","children":[["$","div",null,{"className":"site-footer-left","children":[["$","img",null,{"className":"site-footer-logo","src":"/sardinia-discovery-travels/sardinia-logo.png","alt":"Sardinia Discovery Travels","loading":"lazy","decoding":"async"}],["$","nav",null,{"className":"site-footer-nav","aria-label":"Footer navigation","children":[["$","a",null,{"href":"/sardinia-discovery-travels/","children":"Explore"}],["$","a",null,{"href":"/#experiences","children":"Experiences"}],["$","a",null,{"href":"/sardinia-discovery-travels/destinations/north-sardinia","children":"North Sardinia"}],["$","a",null,{"href":"/sardinia-discovery-travels/pacchetti","children":"Packages"}],["$","a",null,{"href":"/sardinia-discovery-travels/about","children":"About"}],["$","a",null,{"href":"/sardinia-discovery-travels/contact","children":"Contact"}]]}],["$","p",null,{"children":"Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm."}],["$","div",null,{"className":"site-footer-socials","aria-label":"Social links","children":[["$","a",null,{"href":"#","children":"Instagram"}],["$","a",null,{"href":"#","children":"Facebook"}],["$","a",null,{"href":"#","children":"WhatsApp"}],["$","a",null,{"href":"/#faq","children":"FAQ"}]]}]]}],["$","div",null,{"className":"site-footer-links","aria-label":"Footer pages","children":[["$","a",null,{"href":"#","children":"Yacht Tours"}],["$","a",null,{"href":"#","children":"Blue Zone"}],["$","a",null,{"href":"#","children":"Cooking Classes"}],["$","a",null,{"href":"/sardinia-discovery-travels/off-road","children":"4x4 Off Road"}],["$","a",null,{"href":"#","children":"Private Transfers"}],["$","a",null,{"href":"/sardinia-discovery-travels/hotels","children":"Hotels"}]]}]]}],["$","div",null,{"className":"site-footer-business","aria-label":"Business and insurance information","children":[["$","p",null,{"children":"REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849"}],["$","p",null,{"children":"Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894"}]]}],["$","div",null,{"className":"site-footer-bottom","children":[["$","p",null,{"children":"© 2026 Sardinia Discovery Travels"}],["$","div",null,{"children":[["$","a",null,{"href":"#","children":"Privacy Policy"}],["$","a",null,{"href":"#","children":"Terms"}],["$","a",null,{"href":"#","children":"Cookies"}]]}]]}],["$","img",null,{"className":"site-footer-image","src":"https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85","alt":"Boat on turquoise water in Sardinia’s La Maddalena archipelago","loading":"lazy","decoding":"async"}]]}]]}]}]]],"children":["$","$L2a",null,{"children":["$","$L2b",null,{"children":[["$","$L19",null,{"providerId":"page:/destinations/north-sardinia","segmentMap":{"children":["__PAGE__"]},"children":["$","$L1a",null,{"id":"page:/destinations/north-sardinia"}]}],null]}]}]}]
2c:I["2de78b0c6cdc",[],"FloatingActions",1]
2e:I["fc6c8718007b",[],"ExperienceBrowser",1]
:HL["/sardinia-discovery-travels/_next/static/css/page.BB6BhPcy.css","style"     ]
2d:[["$","source",null,{"media":"(max-width: 640px)","srcSet":"/sardinia-discovery-travels/destinations/north/ns-hero-phone.webp"}],["$","img",null,{"src":"/sardinia-discovery-travels/destinations/north/ns-hero.webp","alt":"","fetchPriority":"high","decoding":"async"}]]
1:[[["$","link","css:/_next/static/css/page.BB6BhPcy.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/page.BB6BhPcy.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/page.BB6BhPcy.css"}],"$undefined"],[["$","$L1c",null,{}],["$","$L2c",null,{}],["$","div",null,{"id":"smooth-wrapper","children":["$","div",null,{"id":"smooth-content","children":[["$","main",null,{"className":"north-page","children":[["$","section",null,{"className":"north-discovery north-discovery--hero","aria-labelledby":"north-title","children":[["$","div",null,{"className":"north-hero-bg","aria-hidden":"true","children":["$","picture",null,{"children":"$2d"}]}],["$","div",null,{"className":"north-discovery-content","children":["$","$L2e",null,{"experiences":[{"title":"4×4 Tours","image":"/sardinia-discovery-travels/experiences/off-road.png","text":"Head inland for an off-road discovery of northern Sardinia."},{"title":"Boat Rentals","image":"/sardinia-discovery-travels/experiences/boat-tour.webp","text":"Choose your day at sea: yacht, catamaran, or gommone (RIB)."},{"title":"Cooking Classes","image":"/sardinia-discovery-travels/experiences/cooking-class.png","text":"Get hands-on with local recipes and share the pleasure of a Sardinian table."},{"title":"Hotels","image":"/sardinia-discovery-travels/experiences/hotel.png","text":"Find a base that suits your route, from coastal days to inland discoveries."},{"title":"Private Transfers","image":"/sardinia-discovery-travels/explore/private-transfer.png","text":"Connect your airport, ferry port, hotel, and experiences with a private transfer."},{"title":"Wine Tasting","image":"/sardinia-discovery-travels/explore/food-expierences.png","text":"Make time for local wines and the stories behind them."}],"highlights":[{"title":"La Maddalena: all inclusive luxury catamaran tour","type":"Boat tour · Catamaran","category":"Boat Rentals","image":"/sardinia-discovery-travels/destinations/north/ns-catamaran.webp","featured":true,"price":"89","unit":"per person","maxGuests":12,"perk":"Lunch included","perkIcon":"meal","detail":{"rating":"4.9","duration":"Full day · 7 hours","times":["09:00","14:30"],"summary":"Sail the La Maddalena archipelago aboard a luxury catamaran, with swim stops in turquoise bays, snorkelling and a relaxed lunch on board.","meetingPoint":"Palau harbour (Molo Vecchio)","highlights":["Spargi & Budelli islands","Pink sand beaches","Snorkelling in turquoise coves"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-catamaran.webp","/sardinia-discovery-travels/experiences/katamaran.png","/sardinia-discovery-travels/experiences/boat-tour.webp","/sardinia-discovery-travels/destinations/islands.png"],"included":["Skipper & fuel","Lunch on board","Snorkelling gear","Hotel pickup & drop off"],"itinerary":[{"time":"09:00","title":"Departure from Palau","text":"Board the catamaran and set sail toward the archipelago."},{"time":"11:00","title":"Spargi & Budelli","text":"Swim stops at pink sand bays with time to snorkel."},{"time":"13:00","title":"Lunch on board","text":"A relaxed Sardinian lunch while anchored in a quiet cove."},{"time":"16:00","title":"Return to Palau","text":"Cruise back with a final swim stop along the way."}]}},{"title":"Costa Smeralda: private yacht day charter with skipper","type":"Boat tour · Yacht","category":"Boat Rentals","image":"/sardinia-discovery-travels/destinations/north/ns-yacht.webp","featured":true,"price":"149","unit":"per person","maxGuests":8,"perk":"Drinks included","perkIcon":"drink","detail":{"rating":"4.8","duration":"Full day · 8 hours","times":["09:30"],"summary":"A private yacht day along the Costa Smeralda with your own skipper: secluded coves, swim stops and time to unwind on deck.","meetingPoint":"Porto Cervo marina","highlights":["Costa Smeralda coastline","Secluded swim bays","Golden hour cruise back"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-yacht.webp","/sardinia-discovery-travels/experiences/yacht.png","/sardinia-discovery-travels/experiences/boat-tour.webp","/sardinia-discovery-travels/destinations/islands.png"],"included":["Private skipper","Fuel & mooring","Welcome drinks","Towels & gear"],"itinerary":[{"time":"09:30","title":"Boarding at Porto Cervo","text":"Meet your skipper and settle in on board."},{"time":"12:00","title":"Coastal cruise","text":"Anchor at secluded bays along the Costa Smeralda."},{"time":"14:00","title":"Lunch stop","text":"Optional beach club lunch or a platter on board."},{"time":"17:30","title":"Return","text":"Head back into Porto Cervo at golden hour."}]}},{"title":"Gallura: guided quad & off road adventure through the inland","type":"Adventure · Quad","category":"4×4 Tours","image":"/sardinia-discovery-travels/destinations/north/ns-quad.webp","featured":true,"price":"75","unit":"per person","maxGuests":8,"perk":"Gear included","perkIcon":"gear","detail":{"rating":"4.7","duration":"Half day · 4 hours","times":["09:00","15:00"],"summary":"A guided quad adventure through the granite hills and cork forests of Gallura, with panoramic stops and all the gear included.","meetingPoint":"Tour base near Arzachena","highlights":["The granite hills of Gallura","Cork oak forests","Panoramic valley viewpoint"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-quad.webp","/sardinia-discovery-travels/experiences/quad.png","/sardinia-discovery-travels/experiences/off-road.png","/sardinia-discovery-travels/destinations/interlands.png"],"included":["Quad & fuel","Helmet & gear","Expert guide","Bottled water"],"itinerary":[{"time":"09:00","title":"Briefing & gear","text":"Safety briefing and a short practice loop."},{"time":"09:45","title":"Inland trails","text":"Ride through the granite hills and cork forests of Gallura."},{"time":"11:30","title":"Panoramic stop","text":"Break at a viewpoint over the valley."},{"time":"13:00","title":"Return to base","text":"Head back after a final stretch of trail."}]}},{"title":"Sardinian cooking class: fresh pasta and local wine tasting","type":"Food · Cooking class","category":"Cooking Classes","image":"/sardinia-discovery-travels/destinations/north/ns-cooking.webp","featured":true,"price":"65","unit":"per person","maxGuests":10,"perk":"Wine included","perkIcon":"wine","detail":{"rating":"4.9","duration":"3 hours","times":["11:00","17:00"],"summary":"A hands on Sardinian cooking class: make fresh pasta and a traditional main, then sit down to enjoy it all with local wine.","meetingPoint":"Cookery studio, central Olbia","highlights":["A local Sardinian kitchen","Handmade pasta technique","Traditional family recipes"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-cooking.webp","/sardinia-discovery-travels/experiences/cooking.png","/sardinia-discovery-travels/experiences/cooking-class.png","/sardinia-discovery-travels/explore/food-expierences.png"],"included":["All ingredients","Local wine tasting","Recipe booklet","The full meal you cook"],"itinerary":[{"time":"11:00","title":"Market & welcome","text":"Meet your host and taste a welcome glass of wine."},{"time":"11:30","title":"Fresh pasta","text":"Learn to make handmade pasta from scratch."},{"time":"12:30","title":"Cook the mains","text":"Prepare a traditional Sardinian main course."},{"time":"13:15","title":"Sit down & eat","text":"Enjoy the full meal you prepared, paired with wine."}]}},{"title":"Stintino & La Pelosa: RIB boat tour to Asinara","type":"Boat tour · RIB","category":"Boat Rentals","image":"/sardinia-discovery-travels/destinations/north/ns-pelosa.webp","featured":true,"price":"90","unit":"per person","maxGuests":10,"perk":"Snorkeling gear","perkIcon":"snorkel","detail":{"rating":"4.8","summary":"A fast RIB tour from Stintino to the Asinara national park, with crystal clear swim stops and time at La Pelosa beach.","meetingPoint":"Stintino marina","highlights":["Asinara National Park","La Pelosa beach","Crystal clear coves"],"duration":"Half day · 5 hours","times":["09:30","14:00"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-pelosa.webp","/sardinia-discovery-travels/destinations/islands.png","/sardinia-discovery-travels/explore/blue-zone.png","/sardinia-discovery-travels/experiences/boat-tour.webp"],"included":["Skipper & fuel","Snorkelling gear","Park entrance","Fresh water on board"],"itinerary":[{"time":"09:30","title":"Depart from Stintino","text":"Board the RIB and head out toward Asinara."},{"time":"11:00","title":"Asinara swim stops","text":"Anchor at clear water coves for swimming and snorkelling."},{"time":"13:30","title":"La Pelosa","text":"Finish with time at the famous shallow beach."}]}},{"title":"Gallura wine estates: guided tasting & vineyard tour","type":"Wine · Tasting","category":"Wine Tasting","image":"/sardinia-discovery-travels/destinations/north/ns-wine.webp","featured":true,"price":"59","unit":"per person","maxGuests":12,"perk":"Local products","perkIcon":"basket","detail":{"rating":"4.9","summary":"Visit a family run Vermentino estate in Gallura, walk the vineyards and taste local wines paired with Sardinian bites.","meetingPoint":"Vermentino estate near Arzachena","highlights":["Vineyard walk","The estate cellar","Local food pairings"],"duration":"3 hours","times":["11:00","16:30"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-wine.webp","/sardinia-discovery-travels/explore/food-expierences.png","/sardinia-discovery-travels/destinations/interlands.png","/sardinia-discovery-travels/experiences/cooking-class.png"],"included":["Guided vineyard walk","4 wine tastings","Local food pairings","Estate tour"],"itinerary":[{"time":"11:00","title":"Estate welcome","text":"Meet the winemaker and tour the cellar."},{"time":"11:45","title":"Vineyard walk","text":"Stroll the Vermentino vines with tasting notes."},{"time":"12:30","title":"Guided tasting","text":"Taste four wines paired with local produce."}]}},{"title":"Costa Smeralda: private transfer from Olbia Airport","type":"Transfer · Private car","category":"Private Transfers","image":"/sardinia-discovery-travels/destinations/north/ns-transfer.webp","featured":true,"price":"70","unit":"per transfer","maxGuests":4,"perk":"Luggage included","perkIcon":"luggage","detail":{"rating":"4.9","summary":"A private door to door transfer between Olbia Airport and your Costa Smeralda stay, with a professional local driver.","meetingPoint":"Olbia Airport arrivals hall","highlights":["Scenic drive to the coast","Door to door comfort"],"duration":"About 45 min","times":["On request"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-transfer.webp","/sardinia-discovery-travels/explore/private-transfer.png","/sardinia-discovery-travels/destinations/north-sardinia.png","/sardinia-discovery-travels/explore/tailor-made-tours.png"],"included":["Private vehicle","Professional driver","Meet & greet","Luggage assistance"],"itinerary":[{"time":"Step 1","title":"Airport pickup","text":"Your driver meets you in arrivals with a name sign."},{"time":"Step 2","title":"Direct transfer","text":"Travel comfortably to your accommodation."},{"time":"Step 3","title":"Drop off","text":"Arrive at your door with help for your luggage."}]}},{"title":"Boutique seaview stay near Palau","type":"Hotel · Seaview","category":"Hotels","image":"/sardinia-discovery-travels/destinations/north/ns-hotel.webp","featured":true,"price":"120","unit":"per night","maxGuests":2,"perk":"Breakfast included","perkIcon":"breakfast","detail":{"rating":"4.7","summary":"A small boutique hotel above Palau with sea view rooms, an easy base for the archipelago and the northeast coast.","meetingPoint":"Reception, Palau","highlights":["Sea view rooms","Sunset terrace","Easy base for the north"],"duration":"From 1 night","times":["Check in 15:00"],"gallery":["/sardinia-discovery-travels/destinations/north/ns-hotel.webp","/sardinia-discovery-travels/experiences/hotel.png","/sardinia-discovery-travels/destinations/east-sardinia.png","/sardinia-discovery-travels/destinations/south-sardinia.png"],"included":["Sea view room","Breakfast","Free parking","Wi-Fi"],"itinerary":[{"time":"15:00","title":"Check in","text":"Settle into your sea view room."},{"time":"19:30","title":"Sunset terrace","text":"Aperitivo overlooking the bay."},{"time":"08:00","title":"Breakfast","text":"Sardinian breakfast before your day out."}]}},{"title":"Castelsardo & the northwest coast: 4×4 day tour","type":"Adventure · 4×4","category":"4×4 Tours","image":"/sardinia-discovery-travels/experiences/escursioni.png","featured":false,"price":"95","unit":"per person","maxGuests":6,"perk":"Lunch included","perkIcon":"meal","detail":{"rating":"4.8","summary":"A full day 4×4 tour to the medieval town of Castelsardo and the wild northwest coast, with off road trails and coastal views.","meetingPoint":"Hotel pickup (northwest area)","highlights":["Castelsardo fortress town","Wild northwest coast","Off road backcountry trails"],"duration":"Full day · 8 hours","times":["09:00"],"gallery":["/sardinia-discovery-travels/experiences/escursioni.png","/sardinia-discovery-travels/destinations/west-sardinia.png","/sardinia-discovery-travels/experiences/off-road.png"],"included":["4×4 with guide","Lunch","Castelsardo visit","Hotel pickup"],"itinerary":[{"time":"09:00","title":"Pickup & briefing","text":"Meet your guide and set off along the coast."},{"time":"11:00","title":"Castelsardo","text":"Explore the medieval fortress town."},{"time":"13:00","title":"Coastal lunch","text":"Lunch with a view before the afternoon trails."},{"time":"16:00","title":"Off road return","text":"Head back through scenic backroads."}]}},{"title":"Golfo Aranci: dolphin watching boat trip","type":"Boat tour · Dolphin watching","category":"Boat Rentals","image":"/sardinia-discovery-travels/destinations/east-sardinia.png","featured":false,"price":"69","unit":"per person","maxGuests":12,"perk":"Drinks included","perkIcon":"drink","detail":{"rating":"4.7","summary":"A morning boat trip off Golfo Aranci in search of resident dolphins, with a marine guide and time for a swim stop.","meetingPoint":"Golfo Aranci port","highlights":["Resident bottlenose dolphins","Open sea views","A quiet swim bay"],"duration":"Half day · 3.5 hours","times":["09:00","13:30"],"gallery":["/sardinia-discovery-travels/destinations/east-sardinia.png","/sardinia-discovery-travels/explore/blue-zone.png","/sardinia-discovery-travels/experiences/boat-tour.webp"],"included":["Marine guide","Drinks on board","Swim stop","Hotel pickup"],"itinerary":[{"time":"09:00","title":"Depart Golfo Aranci","text":"Head out with your marine guide to the feeding grounds."},{"time":"10:00","title":"Dolphin watching","text":"Spot resident bottlenose dolphins from the deck."},{"time":"11:30","title":"Swim stop","text":"Anchor in a quiet bay for a refreshing swim."}]}}],"heading":"$L2f"}]}]]}],"$L30","$L31"]}],"$L32"]}]}]]]
33:I["8bf740acbaf4",[],"NorthDestinations",1]
34:I["f843fbe73a43",[],"BookingSteps",1]
2f:["$","div",null,{"className":"north-discovery-heading","children":[["$","h1",null,{"id":"north-title","children":"North Sardinia"}],["$","p",null,{"children":"Find your next island experience."}]]}]
30:["$","$L33",null,{"items":[{"name":"Costa Smeralda","line":"Beaches and harbours","image":"/sardinia-discovery-travels/destinations/north/nd-costa-smeralda.webp","href":"#"},{"name":"La Maddalena Archipelago","line":"Islands and boat days","image":"/sardinia-discovery-travels/destinations/north/nd-la-maddalena.webp","href":"#"},{"name":"Gallura","line":"Granite, vineyards and villages","image":"/sardinia-discovery-travels/destinations/north/nd-gallura.webp","href":"#"},{"name":"Alghero","line":"Old town and sea walls","image":"/sardinia-discovery-travels/destinations/north/nd-alghero.webp","href":"#"},{"name":"Stintino","line":"Beaches and shallow water","image":"/sardinia-discovery-travels/destinations/north/nd-stintino.webp","href":"#"}]}]
31:["$","$L34",null,{}]
32:["$","footer",null,{"id":"main-footer","className":"site-footer","aria-label":"Footer","children":[["$","div",null,{"className":"site-footer-main","children":[["$","div",null,{"className":"site-footer-left","children":[["$","img",null,{"className":"site-footer-logo","src":"/sardinia-discovery-travels/sardinia-logo.png","alt":"Sardinia Discovery Travels","loading":"lazy","decoding":"async"}],["$","nav",null,{"className":"site-footer-nav","aria-label":"Footer navigation","children":[["$","a",null,{"href":"/sardinia-discovery-travels/","children":"Explore"}],["$","a",null,{"href":"/#experiences","children":"Experiences"}],["$","a",null,{"href":"/sardinia-discovery-travels/destinations/north-sardinia","children":"North Sardinia"}],["$","a",null,{"href":"/sardinia-discovery-travels/pacchetti","children":"Packages"}],["$","a",null,{"href":"/sardinia-discovery-travels/about","children":"About"}],["$","a",null,{"href":"/sardinia-discovery-travels/contact","children":"Contact"}]]}],["$","p",null,{"children":"Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm."}],["$","div",null,{"className":"site-footer-socials","aria-label":"Social links","children":[["$","a",null,{"href":"#","children":"Instagram"}],["$","a",null,{"href":"#","children":"Facebook"}],["$","a",null,{"href":"#","children":"WhatsApp"}],["$","a",null,{"href":"/#faq","children":"FAQ"}]]}]]}],["$","div",null,{"className":"site-footer-links","aria-label":"Footer pages","children":[["$","a",null,{"href":"#","children":"Yacht Tours"}],["$","a",null,{"href":"#","children":"Blue Zone"}],["$","a",null,{"href":"#","children":"Cooking Classes"}],["$","a",null,{"href":"/sardinia-discovery-travels/off-road","children":"4x4 Off Road"}],["$","a",null,{"href":"#","children":"Private Transfers"}],["$","a",null,{"href":"/sardinia-discovery-travels/hotels","children":"Hotels"}]]}]]}],["$","div",null,{"className":"site-footer-business","aria-label":"Business and insurance information","children":[["$","p",null,{"children":"REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849"}],["$","p",null,{"children":"Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894"}]]}],["$","div",null,{"className":"site-footer-bottom","children":[["$","p",null,{"children":"© 2026 Sardinia Discovery Travels"}],["$","div",null,{"children":[["$","a",null,{"href":"#","children":"Privacy Policy"}],["$","a",null,{"href":"#","children":"Terms"}],["$","a",null,{"href":"#","children":"Cookies"}]]}]]}],["$","img",null,{"className":"site-footer-image","src":"https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85","alt":"Boat on turquoise water in Sardinia’s La Maddalena archipelago","loading":"lazy","decoding":"async"}]]}]
