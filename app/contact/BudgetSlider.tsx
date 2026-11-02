"use client";

/* Elastic range slider, adapted from Details.so vault "Elastic Range Slider" (vault:range-slider).
   Continuous from 0 to 10,000+ EUR in 50 EUR steps. Stored as a formatted string (e.g. "2,350 €", "10,000+ €"). */
import { useEffect, useId, useRef } from "react";

export const BUDGET_MIN = 0, BUDGET_MAX = 10000, BUDGET_STEP = 50, BUDGET_BIG = 500;
export const formatBudget = (n: number) => n >= BUDGET_MAX ? "10,000+ €" : `${n.toLocaleString("en-US")} €`;
const parseBudget = (v: string) => { const n = Number(v.replace(/[^0-9]/g, "")); return v && Number.isFinite(n) ? Math.min(BUDGET_MAX, n) : -1; };

export function BudgetSlider({ legend, sub, value, onChange }: {
  legend: string; sub?: string; value: string; onChange: (v: string) => void;
}) {
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const setExternal = useRef<(i: number) => void>(() => {});

  const idx = parseBudget(value);
  const chosen = idx >= 0 ? formatBudget(idx) : null;

  useEffect(() => {
    const slider = rootRef.current, control = controlRef.current, track = trackRef.current, fill = fillRef.current, thumb = thumbRef.current;
    if (!slider || !control || !track || !fill || !thumb) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
    const minimum = BUDGET_MIN, maximum = BUDGET_MAX, step = BUDGET_STEP, range = maximum - minimum;
    const snap = (n: number) => clamp(Math.round(n / step) * step, minimum, maximum);
    const toPercent = (n: number) => ((n - minimum) / range) * 100;
    const start = parseBudget(value);
    let current = start >= 0 ? start : 0;
    let targetPercent = toPercent(current), visualPercent = targetPercent, percentVelocity = 0;
    let thumbScale = 1, scaleVelocity = 0, edgeStretch = 0, stretchVelocity = 0;
    let dragging = false, pointerId: number | null = null, dragBounds: DOMRect | null = null, dragStartValue = current;
    let frame = 0, prev = performance.now();
    const grabScale = 1.34;
    const resistance = { slack: 29, reach: 198, stretch: 9 };
    const springs = {
      position: { stiffness: 702, damping: 50, mass: 0.5 },
      thumb: { stiffness: 502, damping: 14, mass: 0.7 },
      edge: { stiffness: 280, damping: 18, mass: 0.8 },
    };
    const stepSpring = (p: number, v: number, t: number, s: { stiffness: number; damping: number; mass: number }, d: number): [number, number] => {
      const a = (s.stiffness * (t - p) - s.damping * v) / s.mass;
      const nv = v + a * d;
      return [p + nv * d, nv];
    };
    const render = () => {
      const percent = clamp(visualPercent, 0, 100);
      fill.style.width = percent + "%";
      thumb.style.left = percent + "%";
      thumb.style.transform = "translate3d(-50%, -50%, 0) scaleY(" + Math.max(0.8, thumbScale) + ")";
      track.style.width = "calc(100% + " + Math.abs(edgeStretch) + "px)";
      track.style.transform = "translate3d(" + Math.min(edgeStretch, 0) + "px, 0, 0)";
    };
    const settle = () => {
      visualPercent = targetPercent; percentVelocity = 0;
      thumbScale = dragging ? grabScale : 1; scaleVelocity = 0;
      if (!dragging) { edgeStretch = 0; stretchVelocity = 0; }
      frame = 0; render();
    };
    const isMoving = () =>
      Math.abs(targetPercent - visualPercent) > 0.001 || Math.abs(percentVelocity) > 0.001 ||
      Math.abs((dragging ? grabScale : 1) - thumbScale) > 0.001 || Math.abs(scaleVelocity) > 0.001 ||
      (!dragging && (Math.abs(edgeStretch) > 0.001 || Math.abs(stretchVelocity) > 0.001));
    const animate = (time: number) => {
      const elapsed = Math.min((time - prev) / 1000, 1 / 30);
      prev = time;
      const sub = Math.max(1, Math.ceil(elapsed / (1 / 120)));
      const d = elapsed / sub;
      for (let i = 0; i < sub; i++) {
        [visualPercent, percentVelocity] = stepSpring(visualPercent, percentVelocity, targetPercent, springs.position, d);
        [thumbScale, scaleVelocity] = stepSpring(thumbScale, scaleVelocity, dragging ? grabScale : 1, springs.thumb, d);
        if (!dragging) [edgeStretch, stretchVelocity] = stepSpring(edgeStretch, stretchVelocity, 0, springs.edge, d);
      }
      render();
      if (isMoving()) frame = requestAnimationFrame(animate); else settle();
    };
    const request = () => {
      if (reduce) { settle(); return; }
      if (frame) return;
      prev = performance.now();
      frame = requestAnimationFrame(animate);
    };
    const updateValue = (next: number, commit: boolean) => {
      const snapped = snap(clamp(next, minimum, maximum));
      const changed = snapped !== current;
      current = snapped;
      targetPercent = toPercent(current);
      if (changed || commit) {
        onChangeRef.current(formatBudget(current));
      }
      request();
    };
    setExternal.current = (i: number) => { current = i; targetPercent = toPercent(i); request(); };
    const fromPointer = (e: PointerEvent) => {
      if (!dragBounds || dragBounds.width === 0) return;
      const ratio = clamp((e.clientX - dragBounds.left) / dragBounds.width, 0, 1);
      const pv = minimum + ratio * range;
      updateValue(e.shiftKey ? dragStartValue + (pv - dragStartValue) * 0.22 : pv, false);
      const dir = e.clientX < dragBounds.left ? -1 : e.clientX > dragBounds.right ? 1 : 0;
      if (!dir || reduce) { edgeStretch = 0; }
      else {
        const outside = dir < 0 ? dragBounds.left - e.clientX : e.clientX - dragBounds.right;
        const resisted = Math.max(0, outside - resistance.slack);
        edgeStretch = dir * resistance.stretch * Math.sqrt(Math.min(resisted / resistance.reach, 1));
      }
      stretchVelocity = 0;
      render();
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      try { if (control.hasPointerCapture(e.pointerId)) control.releasePointerCapture(e.pointerId); } catch { /* touch */ }
      dragging = false; pointerId = null; dragBounds = null;
      slider.classList.remove("is-active");
      request();
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging = true; pointerId = e.pointerId; dragBounds = control.getBoundingClientRect(); dragStartValue = current;
      slider.classList.add("is-active", "is-pointer-input");
      thumb.focus({ preventScroll: true });
      try { control.setPointerCapture(e.pointerId); } catch { /* touch */ }
      updateValue(minimum + clamp((e.clientX - dragBounds.left) / dragBounds.width, 0, 1) * range, true);
      request();
    };
    const move = (e: PointerEvent) => { if (dragging && e.pointerId === pointerId) fromPointer(e); };
    const key = (e: KeyboardEvent) => {
      slider.classList.remove("is-pointer-input");
      const st = e.shiftKey ? BUDGET_BIG : step;
      const map: Record<string, number> = {
        ArrowRight: current + st, ArrowUp: current + st, ArrowLeft: current - st, ArrowDown: current - st,
        PageUp: current + BUDGET_BIG * 2, PageDown: current - BUDGET_BIG * 2, Home: minimum, End: maximum,
      };
      if (!(e.key in map)) return;
      e.preventDefault();
      updateValue(map[e.key], true);
    };
    const blur = () => slider.classList.remove("is-pointer-input");
    control.addEventListener("pointerdown", down);
    control.addEventListener("pointermove", move);
    control.addEventListener("pointerup", endDrag);
    control.addEventListener("pointercancel", endDrag);
    control.addEventListener("lostpointercapture", endDrag);
    thumb.addEventListener("keydown", key);
    thumb.addEventListener("blur", blur);
    render();
    return () => {
      cancelAnimationFrame(frame);
      control.removeEventListener("pointerdown", down);
      control.removeEventListener("pointermove", move);
      control.removeEventListener("pointerup", endDrag);
      control.removeEventListener("pointercancel", endDrag);
      control.removeEventListener("lostpointercapture", endDrag);
      thumb.removeEventListener("keydown", key);
      thumb.removeEventListener("blur", blur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (idx >= 0) setExternal.current(idx); }, [idx]);

  const tickVals = Array.from({ length: 11 }, (_, i) => i * 1000);
  return (
    <fieldset className="ct-group">
      <legend className="ct-legend" id={labelId}>{legend}</legend>
      {sub && <p className="ct-legend-sub">{sub}</p>}
      <div ref={rootRef} className={`range-slider${chosen ? " is-set" : ""}`}>
        <div className="meta">
          <span className="label">{chosen ? "Your budget" : "Drag or use the arrow keys"}</span>
          <span className="value" aria-hidden="true">{chosen ?? "Not chosen"}</span>
        </div>
        <div className="control" ref={controlRef}>
          <div className="track" ref={trackRef}>
            <div className="track-clip"><div className="fill" ref={fillRef} /></div>
            <div className="ticks" aria-hidden="true">
              {tickVals.map((t) => <span key={t} style={{ left: `${(t / BUDGET_MAX) * 100}%` }} />)}
            </div>
            <div
              ref={thumbRef}
              className="thumb"
              role="slider"
              tabIndex={0}
              aria-labelledby={labelId}
              aria-valuemin={BUDGET_MIN}
              aria-valuemax={BUDGET_MAX}
              aria-valuenow={idx >= 0 ? idx : 0}
              aria-valuetext={chosen ?? "Not chosen"}
            >
              <span className="thumb-mark" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="scale" aria-hidden="true">
          <span>0 €</span><span>10,000+ €</span>
        </div>
      </div>
    </fieldset>
  );
}
