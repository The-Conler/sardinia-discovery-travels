type Panel = { tag: string; mode: "air" | "sea"; title: string; text: string; image: string };

function ModeIcon({ mode }: { mode: "air" | "sea" }) {
  const p = {
    viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor",
    strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
  };
  return mode === "sea" ? (
    <svg {...p}>
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
      <path d="M12 10v4" />
      <path d="M12 2v3" />
    </svg>
  ) : (
    <svg {...p}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

export function ArrivalPanels({ items }: { items: Panel[] }) {
  return (
    <div className="north-panels">
      {items.map((it) => (
        <article className="north-panel" key={it.title} aria-label={it.title}>
          <img src={it.image} alt="" loading="lazy" decoding="async" />
          <div className="north-panel-overlay" />
          <div className="north-panel-copy">
            <span className="north-panel-tag"><ModeIcon mode={it.mode} /> {it.tag}</span>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
