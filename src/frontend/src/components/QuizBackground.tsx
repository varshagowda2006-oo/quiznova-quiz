/**
 * Ambient backdrop for the QuizNova arena: a dotted grid, two soft glow orbs,
 * and a subtle vignette. Purely decorative — hidden from assistive tech.
 */
export function QuizBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-dots opacity-60" />

      <div className="absolute -left-24 top-[-10%] h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
      <div
        className="absolute -right-32 bottom-[-15%] h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[130px] animate-float-slow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,oklch(var(--background))_100%)]" />
    </div>
  );
}
