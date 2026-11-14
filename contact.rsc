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
})();0:{"__route":"route:/contact","__interceptionContext":null,"__layoutIds":["layout:/"],"__rootLayout":"/","__sourcePage":"/sardinia-discovery-travels/contact/page","page:/contact":"$L1","layout:/":[[[["$","link","css:/_next/static/css/index.DsmHui6r.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css"}],"$undefined"],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","link",null,{"rel":"expect","href":"#vt-wipe","blocking":"render"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}],"$L3","$L4","$L5","$L6","$L7","$L8","$L9","$La","$Lb","$Lc","$Ld","$Le"]}],"$Lf"]}]],"$L10"],"route:/contact":"$L11","__layoutFlags":{"layout:/":"s"},"__artifactCompatibility":{"schemaVersion":1,"graphVersion":"app-route-graph:318aadd87d565b98","deploymentVersion":"1fbef1bb-8a50-46f0-b65c-ab02aa632cc3","appElementsSchemaVersion":1,"rscPayloadSchemaVersion":1,"rootBoundaryId":"/","renderEpoch":null},"__renderObservation":{"schemaVersion":1,"output":{"kind":"app-rsc","mountedSlotsFingerprint":null,"renderEpoch":null,"rootBoundaryId":"/","routeId":"route:/contact"},"completeness":"partial","boundaryOutcome":{"kind":"unknown"},"requestApis":[{"kind":"connection","status":"unknown"},{"kind":"cookies","status":"unknown"},{"kind":"draftMode","status":"unknown"},{"kind":"headers","status":"unknown"},{"kind":"params","status":"unknown"},{"kind":"searchParams","status":"unknown"}],"dynamicFetches":[],"cacheTags":["/sardinia-discovery-travels/contact","_N_T_/contact","_N_T_/contact/layout","_N_T_/contact/page","_N_T_/layout"],"pathTags":["/sardinia-discovery-travels/contact"],"cacheability":"unknown","downgrade":{"target":"freshRender","reasons":[{"code":"CP_DOWNGRADE_CACHEABILITY_UNKNOWN","target":"freshRender"},{"code":"CP_DOWNGRADE_INCOMPLETE_OBSERVATION","completeness":"partial","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"connection","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"cookies","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"draftMode","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"headers","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"params","target":"freshRender"},{"code":"CP_DOWNGRADE_UNKNOWN_REQUEST_API","requestApi":"searchParams","target":"freshRender"}],"fallback":{"kind":"breakerFallback","code":"CP_PRIVATE_DYNAMIC_DOWNGRADE","mode":"renderFresh","scope":"affectedOutput","fields":{"reasonCodes":["CP_DOWNGRADE_CACHEABILITY_UNKNOWN","CP_DOWNGRADE_INCOMPLETE_OBSERVATION","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API","CP_DOWNGRADE_UNKNOWN_REQUEST_API"],"target":"freshRender"}},"isPublicCacheCandidate":false}}}
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
11:[[["$","meta",null,{"charSet":"utf-8"}],[["$","title","0",{"children":"Contact | Sardinia Discovery Travels"}],["$","meta","1",{"name":"description","content":"Tell us what you'd like to do in Sardinia, when you're coming and who's in your group. We reply with everything in one message."}],["$","meta","2",{"property":"og:title","content":"Contact | Sardinia Discovery Travels"}],["$","meta","3",{"property":"og:description","content":"Tell us what you'd like to do in Sardinia, when you're coming and who's in your group. We reply with everything in one message."}],["$","meta","4",{"property":"og:url","content":"https://sardiniadiscoverytravels.com/contact"}],["$","meta","5",{"property":"og:site_name","content":"Sardinia Discovery Travels"}],["$","meta","6",{"property":"og:type","content":"website"}],["$","meta","7",{"property":"og:locale","content":"en_US"}],["$","meta","8",{"property":"og:image","content":"https://sardiniadiscoverytravels.com/og-image.jpg"}],["$","meta","9",{"property":"og:image:width","content":"1200"}],["$","meta","10",{"property":"og:image:height","content":"630"}],["$","meta","11",{"property":"og:image:alt","content":"A motor yacht crossing clear turquoise water off the coast of Sardinia"}],["$","meta","12",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","13",{"name":"twitter:title","content":"Contact | Sardinia Discovery Travels"}],["$","meta","14",{"name":"twitter:description","content":"Tell us what you'd like to do in Sardinia, when you're coming and who's in your group. We reply with everything in one message."}],["$","meta","15",{"name":"twitter:image","content":"https://sardiniadiscoverytravels.com/og-image.jpg"}],["$","link","16",{"rel":"shortcut icon","href":"/sardinia-discovery-travels/favicon.svg"}],["$","link","17",{"rel":"icon","href":"/sardinia-discovery-travels/favicon.svg"}],["$","link","18",{"rel":"canonical","href":"https://sardiniadiscoverytravels.com/contact"}]],[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]],["$","$L16",null,{"fallback":"$17","children":["$","$L18",null,{"fallback":"$17","children":["$","$L19",null,{"providerId":"layout:/","segmentMap":{"children":["contact"]},"children":["$","$L1a",null,{"id":"layout:/","parallelSlots":"$undefined","children":["$","$L1b",null,{"resetKey":"contact","fallback":[[["$","link","css:/_next/static/css/index.DsmHui6r.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css"}],"$undefined"],[["$","$L1c",null,{}],["$","div",null,{"id":"smooth-wrapper","children":["$","div",null,{"id":"smooth-content","children":[["$","main",null,{"className":"nf-page","children":["$","section",null,{"className":"nf-hero","aria-labelledby":"nf-title","children":[["$","p",null,{"className":"nf-code","children":"Error 404"}],["$","h1",null,{"id":"nf-title","className":"nf-title","children":"We couldn't find this page"}],["$","p",null,{"className":"nf-text","children":"The link may be old or the page has moved. Start again from the home page, or tell us what you are looking for and we will point you the right way."}],["$","div",null,{"className":"nf-actions","children":[["$","a",null,{"className":"button-02 button-02--teal nf-btn","href":"/sardinia-discovery-travels/","children":[["$","span",null,{"className":"inner","children":"Home"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}],["$","a",null,{"className":"button-02 nf-btn","href":"/sardinia-discovery-travels/contact","children":[["$","span",null,{"className":"inner","children":"Contact"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}]]}]]}]}],["$","footer",null,{"id":"main-footer","className":"site-footer","aria-label":"Footer","children":[["$","div",null,{"className":"site-footer-main","children":[["$","div",null,{"className":"site-footer-left","children":[["$","img",null,{"className":"site-footer-logo","src":"/sardinia-discovery-travels/sardinia-logo.png","alt":"Sardinia Discovery Travels","loading":"lazy","decoding":"async"}],["$","nav",null,{"className":"site-footer-nav","aria-label":"Footer navigation","children":[["$","a",null,{"href":"/sardinia-discovery-travels/","children":"Explore"}],["$","a",null,{"href":"/#experiences","children":"Experiences"}],["$","a",null,{"href":"/sardinia-discovery-travels/destinations/north-sardinia","children":"North Sardinia"}],["$","a",null,{"href":"/sardinia-discovery-travels/pacchetti","children":"Packages"}],["$","a",null,{"href":"/sardinia-discovery-travels/about","children":"About"}],"$L1d"]}],"$L1e","$L1f"]}],"$L20"]}],"$L21","$L22","$L23"]}]]}]}]]],"children":"$L24"}]}]}]}]}],null,null]
25:I["9276801271d6",[],"AppRouterScrollTarget",1]
26:I["593f344dc510",[],"RedirectBoundary",1]
1d:["$","a",null,{"href":"/sardinia-discovery-travels/contact","children":"Contact"}]
1e:["$","p",null,{"children":"Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm."}]
1f:["$","div",null,{"className":"site-footer-socials","aria-label":"Social links","children":[["$","a",null,{"href":"#","children":"Instagram"}],["$","a",null,{"href":"#","children":"Facebook"}],["$","a",null,{"href":"#","children":"WhatsApp"}],["$","a",null,{"href":"/#faq","children":"FAQ"}]]}]
20:["$","div",null,{"className":"site-footer-links","aria-label":"Footer pages","children":[["$","a",null,{"href":"#","children":"Yacht Tours"}],["$","a",null,{"href":"#","children":"Blue Zone"}],["$","a",null,{"href":"#","children":"Cooking Classes"}],["$","a",null,{"href":"/sardinia-discovery-travels/off-road","children":"4x4 Off Road"}],["$","a",null,{"href":"#","children":"Private Transfers"}],["$","a",null,{"href":"/sardinia-discovery-travels/hotels","children":"Hotels"}]]}]
21:["$","div",null,{"className":"site-footer-business","aria-label":"Business and insurance information","children":[["$","p",null,{"children":"REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849"}],["$","p",null,{"children":"Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894"}]]}]
22:["$","div",null,{"className":"site-footer-bottom","children":[["$","p",null,{"children":"© 2026 Sardinia Discovery Travels"}],["$","div",null,{"children":[["$","a",null,{"href":"#","children":"Privacy Policy"}],["$","a",null,{"href":"#","children":"Terms"}],["$","a",null,{"href":"#","children":"Cookies"}]]}]]}]
23:["$","img",null,{"className":"site-footer-image","src":"https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85","alt":"Boat on turquoise water in Sardinia’s La Maddalena archipelago","loading":"lazy","decoding":"async"}]
24:["$","$L1b",null,{"resetKey":"[\"contact\"]","fallback":[[["$","link","css:/_next/static/css/index.DsmHui6r.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/index.DsmHui6r.css"}],"$undefined"],[["$","$L1c",null,{}],["$","div",null,{"id":"smooth-wrapper","children":["$","div",null,{"id":"smooth-content","children":[["$","main",null,{"className":"nf-page","children":["$","section",null,{"className":"nf-hero","aria-labelledby":"nf-title","children":[["$","p",null,{"className":"nf-code","children":"Error 404"}],["$","h1",null,{"id":"nf-title","className":"nf-title","children":"We couldn't find this page"}],["$","p",null,{"className":"nf-text","children":"The link may be old or the page has moved. Start again from the home page, or tell us what you are looking for and we will point you the right way."}],["$","div",null,{"className":"nf-actions","children":[["$","a",null,{"className":"button-02 button-02--teal nf-btn","href":"/sardinia-discovery-travels/","children":[["$","span",null,{"className":"inner","children":"Home"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}],["$","a",null,{"className":"button-02 nf-btn","href":"/sardinia-discovery-travels/contact","children":[["$","span",null,{"className":"inner","children":"Contact"}],["$","span",null,{"className":"circle","children":["$","span",null,{"aria-hidden":"true","children":"→"}]}]]}]]}]]}]}],["$","footer",null,{"id":"main-footer","className":"site-footer","aria-label":"Footer","children":[["$","div",null,{"className":"site-footer-main","children":[["$","div",null,{"className":"site-footer-left","children":[["$","img",null,{"className":"site-footer-logo","src":"/sardinia-discovery-travels/sardinia-logo.png","alt":"Sardinia Discovery Travels","loading":"lazy","decoding":"async"}],["$","nav",null,{"className":"site-footer-nav","aria-label":"Footer navigation","children":[["$","a",null,{"href":"/sardinia-discovery-travels/","children":"Explore"}],["$","a",null,{"href":"/#experiences","children":"Experiences"}],["$","a",null,{"href":"/sardinia-discovery-travels/destinations/north-sardinia","children":"North Sardinia"}],["$","a",null,{"href":"/sardinia-discovery-travels/pacchetti","children":"Packages"}],["$","a",null,{"href":"/sardinia-discovery-travels/about","children":"About"}],["$","a",null,{"href":"/sardinia-discovery-travels/contact","children":"Contact"}]]}],["$","p",null,{"children":"Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm."}],["$","div",null,{"className":"site-footer-socials","aria-label":"Social links","children":[["$","a",null,{"href":"#","children":"Instagram"}],["$","a",null,{"href":"#","children":"Facebook"}],["$","a",null,{"href":"#","children":"WhatsApp"}],["$","a",null,{"href":"/#faq","children":"FAQ"}]]}]]}],["$","div",null,{"className":"site-footer-links","aria-label":"Footer pages","children":[["$","a",null,{"href":"#","children":"Yacht Tours"}],["$","a",null,{"href":"#","children":"Blue Zone"}],["$","a",null,{"href":"#","children":"Cooking Classes"}],["$","a",null,{"href":"/sardinia-discovery-travels/off-road","children":"4x4 Off Road"}],["$","a",null,{"href":"#","children":"Private Transfers"}],["$","a",null,{"href":"/sardinia-discovery-travels/hotels","children":"Hotels"}]]}]]}],["$","div",null,{"className":"site-footer-business","aria-label":"Business and insurance information","children":[["$","p",null,{"children":"REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849"}],["$","p",null,{"children":"Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894"}]]}],["$","div",null,{"className":"site-footer-bottom","children":[["$","p",null,{"children":"© 2026 Sardinia Discovery Travels"}],["$","div",null,{"children":[["$","a",null,{"href":"#","children":"Privacy Policy"}],["$","a",null,{"href":"#","children":"Terms"}],["$","a",null,{"href":"#","children":"Cookies"}]]}]]}],["$","img",null,{"className":"site-footer-image","src":"https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85","alt":"Boat on turquoise water in Sardinia’s La Maddalena archipelago","loading":"lazy","decoding":"async"}]]}]]}]}]]],"children":["$","$L25",null,{"children":["$","$L26",null,{"children":[["$","$L19",null,{"providerId":"page:/contact","segmentMap":{"children":["__PAGE__"]},"children":["$","$L1a",null,{"id":"page:/contact"}]}],null]}]}]}]
27:I["0a9159fb64e3",[],"ContactWizard",1]
:HL["/sardinia-discovery-travels/_next/static/css/contact.D2h3X58h.css","style"     ]
1:[[["$","link","css:/_next/static/css/contact.D2h3X58h.css",{"rel":"stylesheet","precedence":"vite-rsc/importer-resources","href":"/sardinia-discovery-travels/_next/static/css/contact.D2h3X58h.css","data-rsc-css-href":"/sardinia-discovery-travels/_next/static/css/contact.D2h3X58h.css"}],"$undefined"],[["$","$L1c",null,{}],["$","div",null,{"id":"smooth-wrapper","children":["$","div",null,{"id":"smooth-content","children":[["$","main",null,{"className":"ct-page","children":["$","$L27",null,{}]}],["$","footer",null,{"id":"main-footer","className":"site-footer","aria-label":"Footer","children":[["$","div",null,{"className":"site-footer-main","children":[["$","div",null,{"className":"site-footer-left","children":[["$","img",null,{"className":"site-footer-logo","src":"/sardinia-discovery-travels/sardinia-logo.png","alt":"Sardinia Discovery Travels","loading":"lazy","decoding":"async"}],["$","nav",null,{"className":"site-footer-nav","aria-label":"Footer navigation","children":[["$","a",null,{"href":"/sardinia-discovery-travels/","children":"Explore"}],["$","a",null,{"href":"/#experiences","children":"Experiences"}],["$","a",null,{"href":"/sardinia-discovery-travels/destinations/north-sardinia","children":"North Sardinia"}],["$","a",null,{"href":"/sardinia-discovery-travels/pacchetti","children":"Packages"}],["$","a",null,{"href":"/sardinia-discovery-travels/about","children":"About"}],["$","a",null,{"href":"/sardinia-discovery-travels/contact","children":"Contact"}]]}],["$","p",null,{"children":"Tailor-made Sardinia journeys, private discoveries, and island moments shaped around your rhythm."}],["$","div",null,{"className":"site-footer-socials","aria-label":"Social links","children":[["$","a",null,{"href":"#","children":"Instagram"}],["$","a",null,{"href":"#","children":"Facebook"}],["$","a",null,{"href":"#","children":"WhatsApp"}],["$","a",null,{"href":"/#faq","children":"FAQ"}]]}]]}],["$","div",null,{"className":"site-footer-links","aria-label":"Footer pages","children":[["$","a",null,{"href":"#","children":"Yacht Tours"}],["$","a",null,{"href":"#","children":"Blue Zone"}],["$","a",null,{"href":"#","children":"Cooking Classes"}],["$","a",null,{"href":"/sardinia-discovery-travels/off-road","children":"4x4 Off Road"}],["$","a",null,{"href":"#","children":"Private Transfers"}],["$","a",null,{"href":"/sardinia-discovery-travels/hotels","children":"Hotels"}]]}]]}],["$","div",null,{"className":"site-footer-business","aria-label":"Business and insurance information","children":[["$","p",null,{"children":"REVO Speciality LiabilityXTravel Agencies N.OX00052607 | Allianz Enterprise RC N.506336849"}],["$","p",null,{"children":"Sardinia Discovery Travels di Claudio Alias | P.IVA 03012880906 | Cod.Fisc LSACLD95H16L093P | Via Giovanni XXIII 2/a, 07029 Tempio Pausania, Sassari | Bacino SUAP Tempio Pausania N.Potrocollo 4894"}]]}],["$","div",null,{"className":"site-footer-bottom","children":[["$","p",null,{"children":"© 2026 Sardinia Discovery Travels"}],["$","div",null,{"children":[["$","a",null,{"href":"#","children":"Privacy Policy"}],["$","a",null,{"href":"#","children":"Terms"}],["$","a",null,{"href":"#","children":"Cookies"}]]}]]}],["$","img",null,{"className":"site-footer-image","src":"https://images.unsplash.com/photo-1609503888208-3cea9d5877c2?auto=format&fit=crop&w=2560&q=85","alt":"Boat on turquoise water in Sardinia’s La Maddalena archipelago","loading":"lazy","decoding":"async"}]]}]]}]}]]]
