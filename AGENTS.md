# Project Guidance

## User Preferences

- Modern, creative, clean and professional visual design — must not look like a basic school project
- Responsive across laptop, desktop, tablet and mobile
- No assignment-template text such as 'BCA Practical', 'College Assignment', 'Submitted By' or 'Student Project'
- No README file unless required by the platform

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- QuizNova is a fully client-side React + TypeScript + Tailwind quiz with no backend involvement; App.tsx owns the QuizState contract and wires WelcomeScreen, QuizScreen and ResultsScreen.
- Design identity is 'Aurora Arcade': dark-first indigo canvas, citron-lime primary, cyan-teal accent, Space Grotesk display + DM Sans body; tokens live in index.css and tailwind.config.js.
- index.css defines --warning/--success CSS variables but tailwind.config.js colors omit them, so text-warning/text-success silently produce no CSS — map them in tailwind.config.js if used.
- Scoring maps over the shuffled questions array (not the answers array) so each question is counted exactly once and unanswered questions appear in the breakdown.
- Verified commands from src/frontend/: pnpm typecheck, pnpm fix, pnpm build. Root test gate: pnpm --dir app test (Vitest + React Testing Library).
