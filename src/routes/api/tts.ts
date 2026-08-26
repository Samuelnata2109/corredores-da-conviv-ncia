import { createFileRoute } from "@tanstack/react-router";

type Body = { text?: string; voice?: string; instructions?: string };

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "LOVABLE_API_KEY não configurada" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response(JSON.stringify({ error: "JSON inválido" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const text = (body.text ?? "").trim().slice(0, 1200);
        if (!text) {
          return new Response(JSON.stringify({ error: "texto vazio" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text,
            voice: body.voice || "alloy",
            instructions: body.instructions || undefined,
            response_format: "mp3",
            stream_format: "audio",
          }),
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          console.error(`TTS failed [${response.status}]: ${detail}`);
          return new Response(JSON.stringify({ error: detail || "falha na geração de voz" }), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const audio = await response.arrayBuffer();
        return new Response(audio, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
