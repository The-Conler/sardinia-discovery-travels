/* SITE ZOOM helper, inlined in <head> by app/layout.tsx (runs before the page paints).
 *
 * 1. Viewport sizes as px. Older WebKit (Safari before 26.4) does not scale
 *    vw / vh inside CSS zoom, while Chromium and Safari 26.4+ do. px values are
 *    scaled the same way everywhere, so the SITE ZOOM block in globals.css
 *    builds --vw / --vh / --svh / --dvh / --cqw from these px values:
 *      --ivw = window.innerWidth / 100      --ivh = window.innerHeight / 100
 *      --icw = documentElement.clientWidth / 100  (full-width containers, for cqw)
 *
 * 2. Older WebKit also returns getBoundingClientRect / getClientRects of
 *    elements inside CSS zoom divided by their zoom. GSAP ScrollTrigger and
 *    the pins measure with them, so on those engines only the results are
 *    mapped back to screen pixels ((reported + scroll) * zoom - scroll, the
 *    inverse of what the engine does). Engines that already
 *    return scaled values are detected and left untouched. */
export const SITE_ZOOM_HEAD_SCRIPT = `(function () {
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
})();`;
