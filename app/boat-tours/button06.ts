// @ts-nocheck
// Liquid Arrow Button (data-button-06) — user's reference implementation, near-verbatim.
export function button06(scope: ParentNode = document) {
  const motion = { duration: 880, curve: [0.14, 0.9, 0.16, 1], rotation: 45 };
  const ease = (progress) => {
    if (progress <= 0 || progress >= 1) return progress;
    const [x1, y1, x2, y2] = motion.curve;
    const cubic = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
    let low = 0;
    let high = 1;
    for (let i = 0; i < 12; i += 1) {
      const t = (low + high) / 2;
      if (cubic(t, x1, x2) < progress) low = t;
      else high = t;
    }
    return cubic((low + high) / 2, y1, y2);
  };

  scope.querySelectorAll("[data-button-06]").forEach((button) => {
    button.button06Cleanup?.();
    const surface = button.querySelector("[data-surface]");
    const arrow = button.querySelector("[data-arrow]");
    if (!surface || !arrow) return;

    const controller = new AbortController();
    const options = { signal: controller.signal };
    let geometry;
    let value = 0;
    let from = 0;
    let target = 0;
    let started = 0;
    let duration = 0;
    let frame = 0;
    let hovered = false;
    let focused = false;
    let pressed = false;

    const format = (number) => Number(number.toFixed(3));

    const render = () => {
      if (!geometry) return;
      const { radius, left, right, travel, pillPath } = geometry;
      const offset = travel * value;
      const distance = right + offset - left;
      const remainingConnection = Math.min(1, (1 - value) / 0.1);
      const smoothness = radius * 1.05 * remainingConnection ** 2 * (3 - 2 * remainingConnection);

      const circleX = right + offset;
      const circlePath = `M ${circleX} 0 A ${radius} ${radius} 0 0 1 ${circleX} ${radius * 2} A ${radius} ${radius} 0 0 1 ${circleX} 0 Z`;
      let path = `${pillPath} ${circlePath} `;
      arrow.style.transform = `translateX(${offset}px) rotate(${value * motion.rotation}deg)`;
      if (smoothness === 0) {
        surface.style.clipPath = `path(nonzero, "${path}")`;
        return;
      }

      const field = (x, y) => {
        const a = Math.hypot(x, y) - radius;
        const b = Math.hypot(x - distance, y) - radius;
        const blend = Math.max(smoothness - Math.abs(a - b), 0) / smoothness;
        return Math.min(a, b) - blend ** 3 * smoothness / 6;
      };

      const findTip = (insideX, outsideX) => {
        for (let step = 0; step < 16; step += 1) {
          const middleX = (insideX + outsideX) / 2;
          if (field(middleX, 0) < 0) insideX = middleX;
          else outsideX = middleX;
        }
        return (insideX + outsideX) / 2;
      };

      let upper = "";
      let lower = "";
      const samples = Math.ceil(distance) * 2;
      for (let i = 0; i <= samples; i += 1) {
        const x = distance * i / samples;
        const previousX = distance * (i - 1) / samples;
        const px = format(left + x);
        if (field(x, 0) >= 0) {
          if (upper) {
            const tipX = format(left + findTip(previousX, x));
            path += `${upper} L ${tipX} ${radius} ${lower} Z `;
          }
          upper = "";
          lower = "";
          continue;
        }
        let low = 0;
        let high = radius + smoothness / 6;
        for (let step = 0; step < 11; step += 1) {
          const y = (low + high) / 2;
          if (field(x, y) < 0) low = y;
          else high = y;
        }
        const height = (low + high) / 2;
        if (!upper) {
          const tipX = i === 0 ? px : format(left + findTip(x, previousX));
          upper = `M ${tipX} ${radius}`;
        }
        upper += ` L ${px} ${format(radius - height)}`;
        lower = `L ${px} ${format(radius + height)} ${lower}`;
      }
      if (upper) path += `${upper} ${lower} Z`;

      surface.style.clipPath = `path(nonzero, "${path}")`;
    };

    const measure = () => {
      // Layout size (not screen size) so the clip path matches under the site zoom.
      const width = button.offsetWidth;
      const height = button.offsetHeight;
      if (!width || !height) return;
      const styles = getComputedStyle(button);
      const overlap = parseFloat(styles.getPropertyValue("--overlap")) || 0;
      const travel = parseFloat(styles.getPropertyValue("--travel")) || 0;
      const radius = height / 2;
      const pillWidth = width - height + overlap;
      const left = pillWidth - radius;
      const pillPath = `M ${radius} 0 H ${left} A ${radius} ${radius} 0 0 1 ${left} ${height} H ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z`;
      geometry = { radius, left, right: width - radius, travel, pillPath };
      render();
    };

    const tick = (now) => {
      frame = 0;
      const progress = Math.min((now - started) / duration, 1);
      value = from + (target - from) * ease(progress);
      render();
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const update = () => {
      const next = hovered || focused || pressed ? 1 : 0;
      if (next === target) return;
      cancelAnimationFrame(frame);
      frame = 0;
      from = value;
      target = next;
      duration = motion.duration * Math.abs(target - from);
      if (duration < 1) {
        value = target;
        render();
        return;
      }
      started = performance.now();
      frame = requestAnimationFrame(tick);
    };

    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      hovered = true;
      update();
    }, options);
    button.addEventListener("pointerleave", () => {
      hovered = false;
      pressed = false;
      update();
    }, options);
    button.addEventListener("focus", () => {
      focused = button.matches(":focus-visible");
      update();
    }, options);
    button.addEventListener("blur", () => {
      focused = false;
      update();
    }, options);
    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      pressed = true;
      update();
    }, options);
    const release = () => {
      pressed = false;
      update();
    };
    window.addEventListener("pointerup", release, options);
    window.addEventListener("pointercancel", release, options);

    const observer = new ResizeObserver(measure);
    observer.observe(button);
    measure();
    button.button06Cleanup = () => {
      controller.abort();
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  });
}
