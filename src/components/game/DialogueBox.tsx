import { characters, type Line } from "@/lib/game-data";

export function DialogueBox({ line, onAdvance, canAdvance }: {
  line: Line;
  onAdvance?: () => void;
  canAdvance?: boolean;
}) {
  const char = characters[line.who];
  const isNarrator = line.who === "narrador";

  return (
    <button
      type="button"
      onClick={onAdvance}
      disabled={!canAdvance}
      className="group w-full cursor-pointer text-left disabled:cursor-default"
    >
      <div className="animate-rise flex items-end gap-3 sm:gap-4">
        {char.image ? (
          <div className="relative shrink-0">
            <img
              src={char.image}
              alt={`Retrato de ${char.name}`}
              width={512}
              height={512}
              loading="lazy"
              className="size-20 rounded-2xl border-2 border-primary/50 object-cover object-top panel-shadow sm:size-28"
            />
          </div>
        ) : null}

        <div
          className={`relative flex-1 rounded-2xl border bg-card/90 p-4 panel-shadow backdrop-blur sm:p-5 ${
            isNarrator ? "border-border" : "border-primary/40"
          }`}
        >
          <span
            className={`mb-1 block font-display text-sm font-semibold ${
              isNarrator ? "text-muted-foreground" : "text-primary"
            }`}
          >
            {char.name}
            {!isNarrator && (
              <span className="ml-2 font-body text-xs font-normal text-muted-foreground">
                {char.role}
              </span>
            )}
          </span>
          <p
            className={`text-[15px] leading-relaxed text-card-foreground sm:text-base ${
              isNarrator ? "italic text-muted-foreground" : ""
            }`}
          >
            {line.text}
          </p>
          {canAdvance ? (
            <span className="mt-3 block text-right text-xs tracking-widest text-primary/80 group-hover:text-primary">
              CONTINUAR ▸
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
