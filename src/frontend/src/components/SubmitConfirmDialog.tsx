import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Number of questions the player has answered so far. */
  answeredCount: number;
  /** Total number of questions in the round. */
  total: number;
  /** Confirm submission and score the quiz. */
  onConfirm: () => void;
}

/**
 * Confirmation gate shown before the quiz is scored. Cancelling closes the
 * dialog and leaves every recorded answer untouched.
 */
export function SubmitConfirmDialog({
  open,
  onOpenChange,
  answeredCount,
  total,
  onConfirm,
}: SubmitConfirmDialogProps) {
  const unanswered = total - answeredCount;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-ocid="quiz.submit_dialog"
        className="rounded-3xl border-border bg-card shadow-lift sm:max-w-md"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl font-bold tracking-tight">
            Are you sure you want to submit the quiz?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            You have answered {answeredCount} of {total} questions.
            {unanswered > 0
              ? ` ${unanswered} ${unanswered === 1 ? "question" : "questions"} will be marked unanswered.`
              : " Every question has an answer."}{" "}
            Your score is calculated as soon as you confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel
            data-ocid="quiz.cancel_button"
            className="h-11 rounded-full border-border px-5 font-semibold"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="quiz.confirm_button"
            onClick={onConfirm}
            className="h-11 rounded-full bg-gradient-primary px-5 font-semibold text-primary-foreground shadow-elevated transition-smooth hover:brightness-105"
          >
            Confirm Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
