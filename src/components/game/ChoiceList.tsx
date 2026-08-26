import type { Choice } from "@/lib/game-data";

export function ChoiceList({
  question,
  choices,
  onPick,
}: {
  question: string;
  choices: Choice[];
  onPick: (choice: Choice) => void;
}) {
  return (
    <div className="animate-rise mt-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground sm:text-xl">{question}</h2>
      <div className="grid gap-3">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onPick(choice)}
            className="group rounded-xl border border-border bg-card/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card focus-visible:outline-none focus-visible:glow-ring"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-md bg-primary/15 px-2 py-1 font-display text-xs font-bold text-primary">
                {choice.id}
              </span>
              <div>
                <p className="text-[15px] font-medium leading-snug text-card-foreground">
                  {choice.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{choice.hint}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
