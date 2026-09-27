import "@testing-library/jest-dom/vitest";
import App from "@/App";
import { QUIZ_QUESTIONS } from "@/data/questions";
import type { QuizQuestion } from "@/types/quiz";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * QuizNova end-to-end component journeys.
 *
 * These exercise the real app shell and every quiz component together, with
 * only `Math.random` (shuffle) and the clock controlled so the round is
 * deterministic. No network or backend actor is involved: the quiz feature is
 * entirely client-side.
 */

const EMPTY_NAME_MESSAGE = "Please enter your name to start the quiz.";

/** Deterministic shuffle: `Math.random` always returns 0, so Fisher–Yates
 * produces a fixed permutation. This keeps question/option order stable. */
function makeDeterministicRandom() {
  return vi.spyOn(Math, "random").mockReturnValue(0);
}

/** Mirror of `shuffleArray` with `Math.random` pinned to 0. */
function shuffleWithZero<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = 0;
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** The question bank in the order the deterministic shuffle produces. */
function expectedShuffledQuestions(): QuizQuestion[] {
  return shuffleWithZero(QUIZ_QUESTIONS).map((question) => ({
    ...question,
    options: shuffleWithZero(question.options),
  }));
}

function startQuiz(user: ReturnType<typeof userEvent.setup>, name = "Varsha") {
  const input = screen.getByLabelText("Enter Your Name");
  return user.type(input, name).then(() => {
    return user.click(screen.getByRole("button", { name: /start quiz/i }));
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Find an answer-option button by its visible option text. An unselected
 * button's accessible name includes the leading option letter (e.g. "A CSS");
 * a selected button swaps that letter for a check icon, so its name is just the
 * option text. Match either form.
 */
function optionButton(text: string): HTMLElement {
  const escaped = escapeRegExp(text);
  return screen.getByRole("button", {
    name: new RegExp(`^(?:[A-D] )?${escaped}$`),
  });
}

describe("QuizNova", () => {
  beforeEach(() => {
    makeDeterministicRandom();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders the welcome screen on load without a blank screen", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /quiz\s*nova/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Interactive Mock Test").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(
        /test your knowledge with this interactive technology quiz/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Enter Your Name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start quiz/i }),
    ).toBeInTheDocument();
  });

  it("blocks an empty name and does not start the quiz or timer", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(EMPTY_NAME_MESSAGE);
    // Still on the welcome screen, and no timer has mounted.
    expect(screen.getByLabelText("Enter Your Name")).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("blocks a spaces-only name", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Enter Your Name"), "   ");
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(EMPTY_NAME_MESSAGE);
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("trims a valid name and starts a 10-question round with a 10:00 timer", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Enter Your Name"), "  Varsha  ");
    await user.click(screen.getByRole("button", { name: /start quiz/i }));

    // Name is trimmed and shown as the player.
    expect(screen.getByRole("heading", { name: "Varsha" })).toBeInTheDocument();
    // Timer starts at 10:00.
    expect(screen.getByRole("timer")).toHaveAccessibleName(
      "Time remaining 10:00",
    );
    // Exactly 10 questions, one at a time.
    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
    // Four options for the current question.
    const optionButtons = screen
      .getAllByRole("button")
      .filter((button) =>
        button.getAttribute("data-ocid")?.startsWith("quiz.option."),
      );
    expect(optionButtons).toHaveLength(4);
    // Navigation grid has 10 cells.
    const navigator = screen.getByRole("region", {
      name: "Question navigator",
    });
    expect(within(navigator).getAllByRole("button")).toHaveLength(10);
  });

  it("highlights a selection, persists it across navigation, and allows changing it", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startQuiz(user);

    const shuffled = expectedShuffledQuestions();
    const firstQuestion = shuffled[0];
    const firstOptionText = firstQuestion.options[0].text;

    // Select the first option of question 1.
    await user.click(optionButton(firstOptionText));
    expect(optionButton(firstOptionText)).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // Navigate forward then back; the selection persists.
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByText("Question 2 of 10")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^previous$/i }));
    expect(screen.getByText("Question 1 of 10")).toBeInTheDocument();
    expect(optionButton(firstOptionText)).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // Change the answer to a different option.
    const secondOptionText = firstQuestion.options[1].text;
    await user.click(optionButton(secondOptionText));
    expect(optionButton(secondOptionText)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(optionButton(firstOptionText)).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("marks answered questions in the navigation grid", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startQuiz(user);

    const shuffled = expectedShuffledQuestions();
    await user.click(optionButton(shuffled[0].options[0].text));

    const navigator = screen.getByRole("region", {
      name: "Question navigator",
    });
    expect(
      within(navigator).getByRole("button", { name: /question 1, answered/i }),
    ).toBeInTheDocument();
    expect(
      within(navigator).getByRole("button", {
        name: /question 2, unanswered/i,
      }),
    ).toBeInTheDocument();
  });

  it("confirms submission, and Cancel returns to the quiz with answers intact", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startQuiz(user);

    const shuffled = expectedShuffledQuestions();
    const chosenText = shuffled[0].options[0].text;
    await user.click(optionButton(chosenText));

    // Jump to the last question to reach Submit Quiz.
    const navigator = screen.getByRole("region", {
      name: "Question navigator",
    });
    await user.click(
      within(navigator).getByRole("button", { name: /question 10/i }),
    );
    await user.click(screen.getByRole("button", { name: /submit quiz/i }));

    expect(
      screen.getByText("Are you sure you want to submit the quiz?"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^cancel$/i }));

    // Back on the quiz, still on question 10, answers preserved.
    expect(screen.getByText("Question 10 of 10")).toBeInTheDocument();
    expect(
      within(navigator).getByRole("button", { name: /question 1, answered/i }),
    ).toBeInTheDocument();
  });

  it("scores the round and shows the results screen after Confirm Submit", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startQuiz(user);

    const shuffled = expectedShuffledQuestions();
    // Answer every question correctly.
    for (let index = 0; index < shuffled.length; index += 1) {
      const question = shuffled[index];
      const correctText = question.options.find(
        (option) => option.id === question.correctOptionId,
      )!.text;
      await user.click(optionButton(correctText));
      if (index < shuffled.length - 1) {
        await user.click(screen.getByRole("button", { name: /^next$/i }));
      }
    }

    await user.click(screen.getByRole("button", { name: /submit quiz/i }));
    await user.click(screen.getByRole("button", { name: /confirm submit/i }));

    // Greeting with the trimmed name.
    expect(
      screen.getByRole("heading", { name: /well done, varsha\s*! 🎉/i }),
    ).toBeInTheDocument();
    // Score out of 10 and percentage (shown in the score ring and accuracy row).
    expect(screen.getAllByText("100%").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/questions answered correctly/i),
    ).toBeInTheDocument();
    // Correct / incorrect / unanswered counts.
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByText("Unanswered")).toBeInTheDocument();
    // Performance message for a perfect score.
    expect(screen.getByText("Flawless Victory")).toBeInTheDocument();
  });

  it("lists all 10 questions in the answer review with answers and statuses", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startQuiz(user);

    const shuffled = expectedShuffledQuestions();
    // Answer question 1 correctly, question 2 incorrectly, leave the rest blank.
    const q1Correct = shuffled[0].options.find(
      (option) => option.id === shuffled[0].correctOptionId,
    )!.text;
    await user.click(optionButton(q1Correct));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    const q2Wrong = shuffled[1].options.find(
      (option) => option.id !== shuffled[1].correctOptionId,
    )!.text;
    await user.click(optionButton(q2Wrong));

    // Jump to last question and submit.
    const navigator = screen.getByRole("region", {
      name: "Question navigator",
    });
    await user.click(
      within(navigator).getByRole("button", { name: /question 10/i }),
    );
    await user.click(screen.getByRole("button", { name: /submit quiz/i }));
    await user.click(screen.getByRole("button", { name: /confirm submit/i }));

    // Review is collapsed until toggled.
    await user.click(screen.getByRole("button", { name: /show review/i }));

    const review = screen.getByRole("region", { name: "Answer Review" });
    const items = within(review).getAllByRole("listitem");
    expect(items).toHaveLength(10);

    // Question 1: correct, shows the user's answer and the correct answer.
    expect(within(items[0]).getByText("Correct")).toBeInTheDocument();
    expect(within(items[0]).getByText("Your Answer")).toBeInTheDocument();
    expect(within(items[0]).getByText("Correct Answer")).toBeInTheDocument();
    // The chosen (correct) option text appears as both the user's answer and
    // the correct answer.
    expect(within(items[0]).getAllByText(q1Correct)).toHaveLength(2);

    // Question 2: incorrect.
    expect(within(items[1]).getByText("Incorrect")).toBeInTheDocument();

    // Question 3: unanswered.
    expect(within(items[2]).getByText("Unanswered")).toBeInTheDocument();
    expect(within(items[2]).getByText("Not answered")).toBeInTheDocument();
  });

  it("retakes the quiz: clears the name, resets the timer, and does not auto-start", async () => {
    const user = userEvent.setup();
    render(<App />);
    await startQuiz(user);

    // Submit immediately with no answers.
    const navigator = screen.getByRole("region", {
      name: "Question navigator",
    });
    await user.click(
      within(navigator).getByRole("button", { name: /question 10/i }),
    );
    await user.click(screen.getByRole("button", { name: /submit quiz/i }));
    await user.click(screen.getByRole("button", { name: /confirm submit/i }));

    await user.click(screen.getByRole("button", { name: /retake quiz/i }));

    // Back on the welcome screen with an empty name field and no timer.
    const input = screen.getByLabelText("Enter Your Name");
    expect(input).toHaveValue("");
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start quiz/i }),
    ).toBeInTheDocument();
  });

  it("auto-submits when the countdown reaches 00:00 and stops after submission", async () => {
    vi.useFakeTimers();
    render(<App />);

    // `fireEvent` is synchronous, so it does not need the fake clock advanced
    // the way `userEvent` does.
    fireEvent.change(screen.getByLabelText("Enter Your Name"), {
      target: { value: "Varsha" },
    });
    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.getByRole("timer")).toHaveAccessibleName(
      "Time remaining 10:00",
    );

    // Advance the full 10-minute countdown.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600_000);
    });

    // Auto-submitted: results screen is shown, timer is gone.
    expect(
      screen.getByRole("heading", { name: /well done, varsha\s*! 🎉/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });
});
