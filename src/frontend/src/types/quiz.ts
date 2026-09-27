/**
 * Shared QuizNova domain types.
 *
 * These types are the contract between the quiz data module, the app-level
 * state machine in `App.tsx`, and the quiz / results screens that consume it.
 */

/** A single answer option belonging to a question. */
export interface QuizOption {
  /** Stable identifier, unique within its question. */
  id: string;
  /** Display text for the option. */
  text: string;
}

/** A single multiple-choice question. */
export interface QuizQuestion {
  /** Stable identifier, unique across the question bank. */
  id: string;
  /** The question prompt. */
  prompt: string;
  /** The four answer options. */
  options: QuizOption[];
  /** `id` of the option that is the correct answer. */
  correctOptionId: string;
}

/** The three top-level views of the single-page app. */
export type QuizView = "welcome" | "quiz" | "results";

/** A player's answer to one question, keyed by question id. */
export interface QuizAnswer {
  questionId: string;
  /** The option the player chose, or `null` when unanswered. */
  selectedOptionId: string | null;
  /** Whether the chosen option was correct. */
  isCorrect: boolean;
}

/** Aggregate outcome shown on the results screen. */
export interface QuizResults {
  /** Player name, already trimmed. */
  playerName: string;
  /** Total number of questions in the round. */
  total: number;
  /** Number of correct answers. */
  correct: number;
  /** Number of incorrect answers. */
  incorrect: number;
  /** Percentage score, rounded to the nearest whole number. */
  percentage: number;
  /** Per-question answer breakdown, in the order the questions were asked. */
  answers: QuizAnswer[];
}

/** App-level state shared across the welcome, quiz, and results views. */
export interface QuizState {
  view: QuizView;
  /** Trimmed player name captured on the welcome screen. */
  playerName: string;
  /** The shuffled questions for the active round. */
  questions: QuizQuestion[];
  /** Index of the question currently on screen. */
  currentIndex: number;
  /** Answers recorded so far, in question order. */
  answers: QuizAnswer[];
  /** Final summary, populated when the round completes. */
  results: QuizResults | null;
}
