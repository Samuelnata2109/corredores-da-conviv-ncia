import type { CharacterId } from "@/lib/game-data";

/** Vozes fictícias (TTS) para cada personagem do roteiro. */
export const voices: Record<CharacterId, { voice: string; instructions: string }> = {
  narrador: {
    voice: "onyx",
    instructions:
      "Narre em português do Brasil, tom calmo, cinematográfico e um pouco misterioso, ritmo pausado.",
  },
  voce: {
    voice: "alloy",
    instructions:
      "Fale em português do Brasil como um estudante adolescente, tom sincero e ligeiramente inseguro, ritmo natural.",
  },
  gustavo: {
    voice: "ash",
    instructions:
      "Fale em português do Brasil como um adolescente atleta arrogante e debochado, voz alta e provocativa.",
  },
  mariana: {
    voice: "shimmer",
    instructions:
      "Fale em português do Brasil como uma adolescente tímida e sensível, voz baixa, suave e hesitante.",
  },
  jose: {
    voice: "echo",
    instructions:
      "Fale em português do Brasil como um adolescente humilde e reservado, voz gentil e um pouco contida.",
  },
  thiago: {
    voice: "fable",
    instructions:
      "Fale em português do Brasil como um professor de literatura acolhedor e articulado, tom firme e inspirador.",
  },
  gremio: {
    voice: "nova",
    instructions:
      "Fale em português do Brasil como um representante do grêmio estudantil, tom animado, claro e mobilizador.",
  },
};
