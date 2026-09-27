import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, Timer, Trophy, Zap } from "lucide-react";

interface WelcomeScreenProps {
  /** Current value of the name field (controlled by the app shell). */
  nameInput: string;
  /** Validation message shown under the field, empty when valid. */
  nameError: string;
  /** Update the controlled name field. */
  onNameChange: (value: string) => void;
  /** Validate the name and start a fresh round. */
  onStart: () => void;
}

const FEATURES = [
  { icon: Timer, label: "10 timed questions" },
  { icon: Zap, label: "Instant feedback" },
  { icon: Trophy, label: "Score at the end" },
] as const;

/**
 * The welcome / start screen: brand intro, feature highlights, and the name
 * form that kicks off a round. Purely presentational — the app shell owns the
 * name draft and the start transition.
 */
export function WelcomeScreen({
  nameInput,
  nameError,
  onNameChange,
  onStart,
}: WelcomeScreenProps) {
  return (
    <section
      data-ocid="welcome.section"
      className="w-full max-w-xl animate-fade-in-up"
      aria-labelledby="welcome-title"
    >
      <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-elevated backdrop-blur-sm md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Technology Quiz
        </span>

        <h1
          id="welcome-title"
          className="mt-5 font-display text-4xl font-bold tracking-tight md:text-5xl"
        >
          Quiz<span className="text-gradient-primary">Nova</span>
        </h1>
        <p className="mt-2 font-display text-lg font-medium text-muted-foreground md:text-xl">
          Interactive Mock Test
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Test your knowledge with this interactive technology quiz. Ten
          questions, four options each, and your score the moment you finish.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2.5">
          {FEATURES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <form
          className="mt-8 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            onStart();
          }}
        >
          <Label htmlFor="player-name" className="text-sm font-semibold">
            Enter Your Name
          </Label>
          <Input
            id="player-name"
            data-ocid="welcome.input"
            value={nameInput}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Enter your name"
            autoComplete="name"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "player-name-error" : undefined}
            className="h-12 rounded-xl bg-background/60 text-base"
          />
          {nameError ? (
            <p
              id="player-name-error"
              data-ocid="welcome.error_state"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {nameError}
            </p>
          ) : null}

          <Button
            type="submit"
            data-ocid="welcome.primary_button"
            size="lg"
            className="mt-4 h-12 w-full rounded-full bg-gradient-primary text-base font-semibold text-primary-foreground shadow-elevated transition-smooth hover:shadow-lift hover:brightness-105 active:scale-[0.98]"
          >
            Start Quiz
            <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          Questions and options are reshuffled every round.
        </p>
      </div>
    </section>
  );
}
