import { HIcon } from "./icons";

type Smoother = { scrollTo: (t: Element, smooth: boolean, pos: string) => void };

// Smooth scroll through ScrollSmoother when it runs (the page is moved by a
// transform, so a plain scrollIntoView would not move it).
export function scrollToEl(el: Element | null) {
  if (!el) return;
  const smoother = (window as unknown as { ScrollSmoother?: { get: () => Smoother | undefined } }).ScrollSmoother?.get();
  if (smoother) smoother.scrollTo(el, true, "top top");
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Stepper({ label, sub, value, min, max, onChange }: { label: string; sub?: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="ct-stepper">
      <div className="ct-stepper-text">
        <span className="ct-stepper-label">{label}</span>
        {sub && <span className="ct-stepper-sub">{sub}</span>}
      </div>
      <div className="ct-stepper-ctrl">
        <button type="button" className="ct-step-btn" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <HIcon name="minus" size={18} />
        </button>
        <span className="ct-step-val" aria-live="polite">{value}</span>
        <button type="button" className="ct-step-btn" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          <HIcon name="plus" size={18} />
        </button>
      </div>
    </div>
  );
}
