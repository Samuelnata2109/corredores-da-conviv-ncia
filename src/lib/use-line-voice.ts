import { useCallback, useEffect, useRef, useState } from "react";

import type { Line } from "@/lib/game-data";
import { voices } from "@/lib/voices";

const cache = new Map<string, string>();

function keyOf(line: Line) {
  return `${line.who}::${line.text}`;
}

async function fetchVoice(line: Line): Promise<string> {
  const key = keyOf(line);
  const cached = cache.get(key);
  if (cached) return cached;

  const profile = voices[line.who];
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: line.text.replace(/[()]/g, ""),
      voice: profile.voice,
      instructions: profile.instructions,
    }),
  });
  if (!response.ok) throw new Error(`TTS ${response.status}`);
  const url = URL.createObjectURL(await response.blob());
  cache.set(key, url);
  return url;
}

/** Toca a voz fictícia da fala atual; retorna estado de carregamento e controle de mudo. */
export function useLineVoice(line: Line | null, muted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeaking(false);
  }, []);

  useEffect(() => {
    stop();
    if (!line || muted) return;

    let cancelled = false;
    setLoading(true);

    fetchVoice(line)
      .then((url) => {
        if (cancelled) return;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setSpeaking(false);
        setSpeaking(true);
        return audio.play().catch(() => setSpeaking(false));
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stop();
    };
  }, [line?.who, line?.text, muted, stop, line]);

  return { speaking, loading, stop };
}
