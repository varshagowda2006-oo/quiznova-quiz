import { QuizBackground } from "@/components/QuizBackground";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { QUIZ_QUESTIONS } from "@/data/questions";
import { shuffleQuestions } from "@/lib/shuffle";
import type {
  QuizAnswer,
  QuizQuestion,
  QuizResults,
  QuizState,
  QuizView,
} from "@/types/quiz";
import { Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

const EMPTY_NAME_MESSAGE = "Please enter your name to start the quiz.";

/**
 * QuizNova — a single-page quiz app with three views (welcome, quiz, results)
 * driven by app-level state.
 *
 * This shell owns the state machine: it captures the player name, shuffles a
 * fresh round, records answers, scores the round exactly once, and resets
 * everything on retake.
 */
export default function App() {
  const [view, setView] = useState<QuizView>("welcome");
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [results, setResults] = useState<QuizResults | null>(null);

  const quizState: QuizState = useMemo(
    () => ({ view, playerName, questions, currentIndex, answers, results }),
    [view, playerName, questions, currentIndex, answers, results],
  );

  const handleNameChange = useCallback((value: string) => {
    setNameInput(value);
    setNameError("");
  }, []);

  const handleStart = useCallback(() => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError(EMPTY_NAME_MESSAGE);
      return;
    }
    setNameError("");
    setPlayerName(trimmed);
    setQuestions(shuffleQuestions(QUIZ_QUESTIONS));
    setCurrentIndex(0);
    setAnswers([]);
    setResults(null);
    setView("quiz");
  }, [nameInput]);

  const handleNavigate = useCallback(
    (index: number) => {
      if (index < 0 || index >= quizState.questions.length) return;
      setCurrentIndex(index);
    },
    [quizState.questions.length],
  );

  const handleSelectAnswer = useCallback(
    (questionId: string, optionId: string) => {
      const question = quizState.questions.find(
        (item) => item.id === questionId,
      );
      if (!question) return;
      const isCorrect = question.correctOptionId === optionId;
      setAnswers((current) => {
        const next = current.filter(
          (answer) => answer.questionId !== questionId,
        );
        next.push({ questionId, selectedOptionId: optionId, isCorrect });
        return next;
      });
    },
    [quizState.questions],
  );

  const handleSubmit = useCallback(() => {
    const roundQuestions = quizState.questions;
    const answerByQuestionId = new Map(
      quizState.answers.map((answer) => [answer.questionId, answer]),
    );

    // One entry per question, in the order the questions were asked, so each
    // question is counted exactly once regardless of navigation order.
    const breakdown: QuizAnswer[] = roundQuestions.map((question) => {
      const answer = answerByQuestionId.get(question.id);
      const selectedOptionId = answer?.selectedOptionId ?? null;
      return {
        questionId: question.id,
        selectedOptionId,
        isCorrect: selectedOptionId === question.correctOptionId,
      };
    });

    const total = roundQuestions.length;
    const correct = breakdown.filter((answer) => answer.isCorrect).length;
    const incorrect = breakdown.filter(
      (answer) => !answer.isCorrect && answer.selectedOptionId !== null,
    ).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    setResults({
      playerName: quizState.playerName,
      total,
      correct,
      incorrect,
      percentage,
      answers: breakdown,
    });
    setView("results");
  }, [quizState.questions, quizState.answers, quizState.playerName]);

  const handleRestart = useCallback(() => {
    setView("welcome");
    setPlayerName("");
    setNameInput("");
    setNameError("");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setResults(null);
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <QuizBackground />

      <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Quiz<span className="text-primary">Nova</span>
            </span>
          </div>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
            Interactive Mock Test
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 md:px-8 md:py-16">
        {quizState.view === "welcome" ? (
          <WelcomeScreen
            nameInput={nameInput}
            nameError={nameError}
            onNameChange={handleNameChange}
            onStart={handleStart}
          />
        ) : null}

        {quizState.view === "quiz" ? (
          <QuizScreen
            playerName={quizState.playerName}
            questions={quizState.questions}
            currentIndex={quizState.currentIndex}
            answers={quizState.answers}
            onNavigate={handleNavigate}
            onSelectAnswer={handleSelectAnswer}
            onSubmit={handleSubmit}
          />
        ) : null}

        {quizState.view === "results" && quizState.results ? (
          <ResultsScreen
            results={quizState.results}
            questions={quizState.questions}
            onRestart={handleRestart}
          />
        ) : null}
      </main>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row md:px-8">
          <span>QuizNova · Interactive Mock Test</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="transition-smooth hover:text-foreground"
          >
            © {new Date().getFullYear()}. Built with love using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
