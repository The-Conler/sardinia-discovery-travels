"use client";

import { useEffect, useRef } from "react";
import { thinkingOrbs } from "./thinking-orbs.js";

export function WaitingOrb({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !canvas.current) return;
    return thinkingOrbs(canvas.current);
  }, [active]);
  return (
    <span className={`pt-waiting-orb${active ? " is-active" : ""}`} aria-hidden={!active}>
      <canvas ref={canvas} data-thinking-orb data-orb-state="listening" data-orb-size="28" data-orb-speed="0.8" data-orb-theme="dark" data-orb-paused={!active} width={28} height={28} role="img" aria-label="Waiting for ride details" />
    </span>
  );
}
