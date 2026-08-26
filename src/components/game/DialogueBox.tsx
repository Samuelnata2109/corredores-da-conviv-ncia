import { useEffect, useState } from "react";

import { characters, type Line } from "@/lib/game-data";

export function DialogueBox({
  line,
  canAdvance,
  speaking,
  loadingVoice,
  typedKey,
}: {
  line: Line;
  canAdvance?: boolean;
  speaking?: boolean;
  loadingVoice?: boolean;
  /** muda para reiniciar o efeito de digitação */
  typedKey?: string;
}) {
  const char = characters[line.who];
  const isNarrator = line.who === "narrador";
  const [shown, setShown] = useState(line.text.length);

  useEffect(() => {
    setShown(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setShown(i);
      if (i >= line.text.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [typedKey, line.text]);

  return (
    <div className="animate-rise pointer-events-none flex items-end gap-3 sm:gap-4">
      <div
        className={`relative flex-1 rounded-2xl border-4 bg-card/95 p-5 panel-shadow backdrop-blur-sm sm:p-6 ${
          isNarrator ? "border-border" : "border-primary/60"
        }`}
      >
        <span
          className={`mb-2 block font-display text-sm font-semibold ${
            isNarrator ? "text-muted-foreground" : "text-primary"
          }`}
        >
          {char.name}
          {!isNarrator && (
            <span className="ml-2 font-body text-xs font-normal text-muted-foreground">
              {char.role}
            </span>
          )}
          {loadingVoice ? (
            <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              carregando voz…
            </span>
          ) : speaking ? (
            <span className="ml-2 text-[10px] uppercase tracking-widest text-accent">
              ♪ falando
            </span>
          ) : null}
        </span>

        <p
          className={`min-h-[4.5rem] text-[16px] leading-relaxed text-card-foreground sm:min-h-[5rem] sm:text-lg ${
            isNarrator ? "italic text-muted-foreground" : ""
          }`}
        >
          {line.text.slice(0, shown)}
        </p>

        {canAdvance ? (
          <span className="mt-2 block animate-pulse text-right text-xs tracking-widest text-primary">
            CLIQUE PARA CONTINUAR ▸
          </span>
        ) : null}
      </div>

      {char.image ? (
        <div className="hidden shrink-0 sm:block">
          <img
            src={char.image}
            alt={`Retrato de ${char.name}`}
            width={512}
            height={512}
            loading="lazy"
            className="size-36 rounded-2xl border-4 border-primary/60 object-cover object-top panel-shadow lg:size-44"
          />
          <p className="mt-1 rounded-lg border border-border bg-card/90 py-1 text-center font-display text-xs text-foreground">
            {char.name}
          </p>
        </div>
      ) : null}
    </div>
  );
}
