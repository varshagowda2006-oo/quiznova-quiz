import type { QuizQuestion } from "@/types/quiz";

/**
 * Return a new array shuffled with the Fisher–Yates algorithm.
 *
 * The input array is never mutated.
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle the question order and each question's options.
 *
 * Each question keeps its own `correctOptionId`, so the correct answer stays
 * tied to its question no matter how the options are reordered.
 */
export function shuffleQuestions(
  questions: readonly QuizQuestion[],
): QuizQuestion[] {
  return shuffleArray(questions).map((question) => ({
    ...question,
    options: shuffleArray(question.options),
  }));
}
