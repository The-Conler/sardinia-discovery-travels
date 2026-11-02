// Hover-reveal arrow pill button (button-02), pure CSS.
export function LiquidArrowButton({ href, children }: { href: string; children: string }) {
  return (
    <a className="button-02" href={href} target="_blank" rel="noopener noreferrer">
      <span className="inner">{children}</span>
      <span className="circle" aria-hidden="true"><span>→</span></span>
    </a>
  );
}
