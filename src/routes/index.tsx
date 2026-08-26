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
import { endingBackground, sceneBackgrounds } from "@/lib/scene-backgrounds";
import { useLineVoice } from "@/lib/use-line-voice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vozes no Corredor — Jogo Interativo de Literatura e Empatia" },
      {
        name: "description",
        content:
          "Roteiro interativo com cenários, caixas de diálogo e vozes dos personagens: escolha seus caminhos em 5 cenas e descubra qual dos 3 finais você constrói.",
      },
      { property: "og:title", content: "Vozes no Corredor — Jogo Interativo" },
      {
        property: "og:description",
        content:
          "Cinco cenas, três finais, diálogos narrados com voz. Um jogo de escolhas sobre poesia, bullying e democracia na EEEP Guiomar Belchior Aguiar.",
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
  const [muted, setMuted] = useState(false);

  const scene = scenes[sceneIndex]!;
  const lines: Line[] = useMemo(() => {
    const previous = picks[sceneIndex - 1];
    const echo = previous ? scene.echoes?.[previous] ?? [] : [];
    return [...echo, ...scene.intro];
  }, [scene, picks, sceneIndex]);

  const current = lines[Math.min(lineIndex, lines.length - 1)]!;
  const showChoices = lineIndex >= lines.length - 1;
  const scores = tally(picks);
  const voice = useLineVoice(phase === "scene" ? current : null, muted);

  function advance() {
    if (showChoices) return;
    voice.stop();
    setLineIndex((v) => Math.min(v + 1, lines.length - 1));
  }

  function pick(choice: Choice) {
    voice.stop();
    const next = [...picks.slice(0, sceneIndex), choice.id];
    setPicks(next);
    if (sceneIndex === scenes.length - 1) {
      setPhase("ending");
      return;
    }
    setSceneIndex(sceneIndex + 1);
    setLineIndex(0);
  }

  function restart() {
    voice.stop();
    setPicks([]);
    setSceneIndex(0);
    setLineIndex(0);
    setPhase("start");
  }

  if (phase === "start") {
    return <StartScreen onStart={() => setPhase("scene")} />;
  }

  if (phase === "ending") {
    return <EndingScreen picks={picks} muted={muted} onRestart={restart} />;
  }

  return (
    <main
      className="relative min-h-screen bg-background bg-cover bg-center"
      style={{ backgroundImage: `url(${sceneBackgrounds[scene.id]})` }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Avançar diálogo"
        onClick={advance}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            advance();
          }
        }}
        className="relative flex min-h-screen flex-col justify-between bg-gradient-to-b from-background/85 via-background/25 to-background/95 focus:outline-none"
      >
        <header className="mx-auto w-full max-w-5xl px-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.3em] text-accent">
                {scene.chapter}
              </p>
              <h1 className="mt-0.5 text-xl font-bold text-foreground drop-shadow sm:text-2xl">
                {scene.title}
              </h1>
              <p className="text-xs text-muted-foreground">{scene.place}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMuted((v) => !v);
              }}
              className="rounded-lg border border-border bg-card/85 px-3 py-2 font-display text-xs text-foreground backdrop-blur"
            >
              {muted ? "🔇 Vozes off" : "🔊 Vozes on"}
            </button>
          </div>
          <ProgressBar current={sceneIndex} picks={picks} />
        </header>

        <div className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
          {showChoices ? (
            <div
              className="pointer-events-auto mb-4 rounded-2xl border border-border bg-background/85 p-4 backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <ChoiceList question={scene.question} choices={scene.choices} onPick={pick} />
            </div>
          ) : null}

          <DialogueBox
            line={current}
            typedKey={`${sceneIndex}-${lineIndex}`}
            canAdvance={!showChoices}
            speaking={voice.speaking}
            loadingVoice={voice.loading}
          />

          <ScoreStrip scores={scores} />
        </div>
      </div>
    </main>
  );
}

function ProgressBar({ current, picks }: { current: number; picks: string[] }) {
  return (
    <div className="mt-4 flex items-center gap-2">
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
    <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card/70 p-3 backdrop-blur">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
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
          5 cenas · 12 escolhas · 3 finais possíveis. Clique na tela para avançar cada fala — os
          personagens falam com vozes fictícias.
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

function EndingScreen({
  picks,
  muted,
  onRestart,
}: {
  picks: string[];
  muted: boolean;
  onRestart: () => void;
}) {
  const ending = endings[resolveEnding(picks)];
  const scores = tally(picks);
  const [index, setIndex] = useState(0);
  const done = index >= ending.lines.length - 1;
  const current = ending.lines[Math.min(index, ending.lines.length - 1)]!;
  const voice = useLineVoice(current, muted);

  const tone =
    ending.tone === "good"
      ? "border-accent/60"
      : ending.tone === "neutral"
        ? "border-secondary/60"
        : "border-destructive/60";

  return (
    <main
      className="relative min-h-screen bg-background bg-cover bg-center"
      style={{ backgroundImage: `url(${endingBackground})` }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Avançar diálogo"
        onClick={() => {
          if (!done) {
            voice.stop();
            setIndex((v) => v + 1);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !done) {
            e.preventDefault();
            setIndex((v) => v + 1);
          }
        }}
        className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-background/85 via-background/30 to-background/95 focus:outline-none"
      >
        <header className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6">
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-accent">Cena 5</p>
          <h1 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            O Desfecho e o Novo Espaço
          </h1>
          <div className={`mt-4 rounded-2xl border-2 bg-card/85 p-4 backdrop-blur ${tone}`}>
            <span className="font-display text-sm text-primary">{ending.badge}</span>
            <h2 className="text-2xl font-bold text-foreground">{ending.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Suas escolhas: {picks.join(" → ")}
            </p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
          {done ? (
            <div
              className="pointer-events-auto mb-4 rounded-2xl border border-primary/40 bg-background/90 p-5 backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg text-primary">O que essa história ensina</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-card-foreground">
                {ending.moral}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onRestart}
                  className="rounded-xl bg-primary px-6 py-3 font-display font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 glow-ring"
                >
                  Jogar de novo
                </button>
                <span className="text-sm text-muted-foreground">
                  Existem outros dois finais — tente outro caminho.
                </span>
              </div>
            </div>
          ) : null}

          <DialogueBox
            line={current}
            typedKey={`ending-${index}`}
            canAdvance={!done}
            speaking={voice.speaking}
            loadingVoice={voice.loading}
          />

          <ScoreStrip scores={scores} />
        </div>
      </div>
    </main>
  );
}
