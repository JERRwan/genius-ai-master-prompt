type AmbientFieldProps = {
  className?: string;
};

/** Decorative-only field instrument motion. It never affects layout or interaction. */
export function AmbientField({ className = "" }: AmbientFieldProps) {
  return (
    <div aria-hidden="true" className={`brienne-ambient-field ${className}`}>
      <div className="brienne-ambient-grid" />
      <div className="brienne-orbit brienne-orbit-one" />
      <div className="brienne-orbit brienne-orbit-two" />
      <div className="brienne-signal-path brienne-signal-path-one" />
      <div className="brienne-signal-path brienne-signal-path-two" />
      <div className="brienne-scanline" />
      <div className="brienne-field-glow brienne-field-glow-one" />
      <div className="brienne-field-glow brienne-field-glow-two" />
    </div>
  );
}
