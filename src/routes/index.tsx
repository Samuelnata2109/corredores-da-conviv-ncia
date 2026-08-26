import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import terrenoImg from "@/assets/terreno.jpg";
import { ChoiceList } from "@/components/game/ChoiceList";
import { DialogueBox } from "@/components/game/DialogueBox";
import {
  characters,
  endings,
  resolveEnding,
  scenes,
  tally,
  type Choice,
  type Line,
} from "@/lib/game-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vozes no Corredor — Jogo Interativo de Literatura e Empatia" },
      {
        name: "description",
        content:
          "Roteiro interativo sobre literatura, empatia e convivência democrática na escola: escolha seus caminhos em 5 cenas e descubra qual dos 3 finais você constrói.",
      },
      { property: "og:title", content: "Vozes no Corredor — Jogo Interativo" },
      {
        property: "og:description",
        content:
          "Cinco cenas, três finais. Um jogo de escolhas sobre poesia, bullying e democracia na EEEP Guiomar Belchior Aguiar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

type Phase = "start" | "scene" | "ending";

function Game() {
  const [phase, setPhase] = useState<Phase>("start");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);

  const scene = scenes[sceneIndex]!;
  const lines: Line[] = useMemo(() => {
    const previous = picks[sceneIndex - 1];
    const echo = previous ? scene.echoes?.[previous] ?? [] : [];
    return [...echo, ...scene.intro];
  }, [scene, picks, sceneIndex]);

  const visible = lines.slice(0, lineIndex + 1);
  const showChoices = lineIndex >= lines.length - 1;
  const scores = tally(picks);

  function pick(choice: Choice) {
    const next = [...picks.slice(0, sceneIndex), choice.id];
    setPicks(next);
    if (sceneIndex === scenes.length - 1) {
      setPhase("ending");
      return;
    }
    setSceneIndex(sceneIndex + 1);
    setLineIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setPicks([]);
    setSceneIndex(0);
    setLineIndex(0);
    setPhase("start");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (phase === "start") {
    return <StartScreen onStart={() => setPhase("scene")} />;
  }

  if (phase === "ending") {
    return <EndingScreen picks={picks} onRestart={restart} />;
  }

  return (
    <main className="min-h-screen hero-surface pb-20">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <ProgressBar current={sceneIndex} picks={picks} />

        <header className="mt-6">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
            {scene.chapter}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">🎬 {scene.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{scene.place}</p>
        </header>

        <div className="mt-6 space-y-4">
          {visible.map((line, i) => (
            <DialogueBox
              key={`${sceneIndex}-${i}`}
              line={line}
              canAdvance={i === visible.length - 1 && !showChoices}
              onAdvance={() => setLineIndex((v) => Math.min(v + 1, lines.length - 1))}
            />
          ))}
        </div>

        {showChoices ? (
          <ChoiceList question={scene.question} choices={scene.choices} onPick={pick} />
        ) : null}

        <ScoreStrip scores={scores} />
      </div>
    </main>
  );
}

function ProgressBar({ current, picks }: { current: number; picks: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {scenes.map((s, i) => (
        <div key={s.id} className="flex-1">
          <div
            className={`h-1.5 rounded-full ${
              i < current ? "bg-primary" : i === current ? "bg-accent" : "bg-muted"
            }`}
          />
          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            Cena {s.id} {picks[i] ? `· ${picks[i]}` : ""}
          </p>
        </div>
      ))}
      <div className="flex-1">
        <div className="h-1.5 rounded-full bg-muted" />
        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Cena 5</p>
      </div>
    </div>
  );
}

function ScoreStrip({
  scores,
}: {
  scores: { empatia: number; regras: number; confronto: number };
}) {
  const items = [
    { label: "Empatia", value: scores.empatia, color: "bg-accent" },
    { label: "Regras", value: scores.regras, color: "bg-secondary" },
    { label: "Confronto", value: scores.confronto, color: "bg-destructive" },
  ];
  return (
    <div className="mt-10 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card/50 p-4">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${item.color} transition-all duration-500`}
              style={{ width: `${Math.min(100, (item.value / 8) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  const cast = ["mariana", "gustavo", "jose", "thiago", "gremio"] as const;
  return (
    <main className="min-h-screen hero-surface">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-border panel-shadow">
          <img
            src={terrenoImg}
            alt="Terreno abandonado ao lado da biblioteca da escola"
            width={1536}
            height={768}
            className="h-48 w-full object-cover sm:h-64"
          />
        </div>

        <p className="mt-8 font-display text-xs uppercase tracking-[0.35em] text-accent">
          Roteiro interativo
        </p>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Vozes no Corredor
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          Literatura, empatia e convivência democrática na escola. Você é estudante do 1º ano da
          EEEP Guiomar Belchior Aguiar — e um terreno abandonado está dividindo todo mundo.
        </p>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          5 cenas · 12 escolhas · 3 finais possíveis. Cada decisão acumula Empatia, Regras ou
          Confronto e muda o desfecho.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-8 rounded-xl bg-primary px-7 py-3.5 font-display text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 glow-ring"
        >
          Começar a Cena 1 ▸
        </button>

        <h2 className="mt-14 text-sm uppercase tracking-widest text-muted-foreground">Elenco</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {cast.map((id) => {
            const char = characters[id];
            return (
              <figure key={id} className="text-center">
                <img
                  src={char.image!}
                  alt={`Retrato de ${char.name}`}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="mx-auto size-20 rounded-2xl border-2 border-border object-cover object-top"
                />
                <figcaption className="mt-2">
                  <span className="block font-display text-sm text-foreground">{char.name}</span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">
                    {char.role}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function EndingScreen({ picks, onRestart }: { picks: string[]; onRestart: () => void }) {
  const ending = endings[resolveEnding(picks)];
  const scores = tally(picks);
  const tone =
    ending.tone === "good"
      ? "border-accent/60"
      : ending.tone === "neutral"
        ? "border-secondary/60"
        : "border-destructive/60";

  return (
    <main className="min-h-screen hero-surface pb-20">
      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">Cena 5</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          🎬 O Desfecho e o Novo Espaço
        </h1>

        <div className={`mt-6 rounded-2xl border-2 bg-card/80 p-6 panel-shadow ${tone}`}>
          <span className="font-display text-sm text-primary">{ending.badge}</span>
          <h2 className="mt-1 text-3xl font-bold text-foreground">{ending.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Suas escolhas: {picks.join(" → ")}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {ending.lines.map((line, i) => (
            <DialogueBox key={i} line={line} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-primary/40 bg-card/70 p-6">
          <h3 className="font-display text-lg text-primary">O que essa história ensina</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-card-foreground">{ending.moral}</p>
        </div>

        <ScoreStrip scores={scores} />

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-xl bg-primary px-6 py-3 font-display font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 glow-ring"
          >
            Jogar de novo
          </button>
          <span className="self-center text-sm text-muted-foreground">
            Existem outros dois finais — tente outro caminho.
          </span>
        </div>
      </div>
    </main>
  );
}
