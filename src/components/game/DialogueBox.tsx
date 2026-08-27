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
    <div className="animate-rise pointer-events-none">
      {char.image ? (
        <div className="mb-[-10px] ml-1 flex items-end gap-2">
          <img
            src={char.image}
            alt={`Retrato de ${char.name}`}
            width={512}
            height={512}
            loading="lazy"
            className="size-16 rounded-2xl border-4 border-primary/60 bg-card object-cover object-top panel-shadow sm:size-20 lg:size-24"
          />
        </div>
      ) : null}

      <div
        className={`relative rounded-2xl border-4 bg-card/95 p-5 panel-shadow backdrop-blur-sm sm:p-6 ${
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
    </div>
  );
}
