# Design Brief

## Direction

Aurora Arcade — a high-energy, dark-first quiz product where a citron-lime "nova" accent cuts through a deep indigo canvas.

## Tone

Premium modern tech with competitive arcade energy — confident and playful, never childish or academic.

## Differentiation

An electric lime-on-indigo identity with glowing answer states and a dotted-grid arena backdrop that makes every question feel like a live round, not a worksheet.

## Color Palette

| Token      | OKLCH       | Role                                          |
| ---------- | ----------- | --------------------------------------------- |
| background | 0.16 0.028 275 | Deep indigo canvas (dark primary)         |
| foreground | 0.96 0.01 265  | Near-white text                           |
| card       | 0.205 0.03 275 | Elevated quiz surface                     |
| primary    | 0.86 0.19 128  | Citron-lime CTA, correct answer, progress |
| accent     | 0.76 0.13 200  | Cyan-teal secondary highlights            |
| muted      | 0.26 0.03 275  | Neutral chips, secondary fills            |
| success    | 0.72 0.17 152  | Correct-answer confirmation              |
| destructive| 0.66 0.19 22   | Wrong-answer feedback                     |

## Typography

- Display: Space Grotesk — headings, question text, wordmark, score numerals
- Body: DM Sans — answer options, labels, paragraphs, buttons
- Mono: JetBrains Mono — timer, score, question counter
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl md:text-3xl font-bold tracking-tight`, label `text-xs font-semibold tracking-[0.18em] uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Layered surfaces: background → card → popover, each a step lighter, lifted by `shadow-subtle`/`shadow-elevated`/`shadow-lift` plus a lime `glow-primary` for the active answer.

## Structural Zones

| Zone    | Background        | Border      | Notes                                              |
| ------- | ----------------- | ----------- | -------------------------------------------------- |
| Header  | `bg-card/80` blur | `border-b`  | Sticky wordmark + progress bar + timer/score chips |
| Content | `bg-background`   | —           | Dotted-grid arena; centered quiz card, ambient glow orb |
| Footer  | `bg-muted/40`     | `border-t`  | Compact meta row, muted text                       |

## Spacing & Rhythm

Generous: page gutters `px-4 md:px-8`, card padding `p-6 md:p-10`, section gaps `gap-6 md:gap-8`, micro-spacing `gap-2`/`gap-3` inside chips and option rows.

## Component Patterns

- Buttons: pill (`rounded-full`), lime gradient primary with dark text, hover lift + glow, `active:scale-[0.98]`
- Cards: `rounded-3xl`, `bg-card`/`bg-gradient-surface`, `border`, `shadow-elevated`, hover raises to `shadow-lift`
- Badges: pill, `bg-muted` neutral or translucent lime for active; mono numerals for timer/score

## Motion

- Entrance: `animate-fade-in-up` staggered per option (~60ms), card `animate-scale-in`
- Hover: `transition-smooth` lift, border brightens to primary, subtle glow
- Decorative: `float-slow` ambient orb, `pulse-ring` on active timer, `pop-in` feedback icons

## Constraints

- Dark mode is the primary experience; light mode fully tuned as an alternate
- No raw hex/rgb in components — semantic tokens only
- No category/difficulty selection, no quiz history or best-score persistence
- Answer feedback must stay AA+ readable at every breakpoint

## Signature Detail

The dotted-grid arena backdrop with a floating lime glow orb and glowing selected-answer ring — spatial composition + material treatment that turns the quiz card into a stage.
