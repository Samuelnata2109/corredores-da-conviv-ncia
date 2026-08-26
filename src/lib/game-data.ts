import voceImg from "@/assets/voce.jpg";
import gustavoImg from "@/assets/gustavo.jpg";
import marianaImg from "@/assets/mariana.jpg";
import joseImg from "@/assets/jose.jpg";
import thiagoImg from "@/assets/thiago.jpg";
import gremioImg from "@/assets/gremio.jpg";

export type CharacterId =
  | "voce"
  | "gustavo"
  | "mariana"
  | "jose"
  | "thiago"
  | "gremio"
  | "narrador";

export const characters: Record<
  CharacterId,
  { name: string; role: string; image: string | null }
> = {
  narrador: { name: "Narração", role: "Vozes no Corredor", image: null },
  voce: { name: "Você", role: "1º ano — EEEP Guiomar Belchior Aguiar", image: voceImg },
  gustavo: { name: "Gustavo", role: "Líder do grupo de esportes", image: gustavoImg },
  mariana: { name: "Mariana", role: "Poeta tímida do caderno vermelho", image: marianaImg },
  jose: { name: "José", role: "Aluno humilde recém-chegado", image: joseImg },
  thiago: { name: "Prof. Thiago", role: "Professor de Literatura", image: thiagoImg },
  gremio: { name: "Samanta & Lucas", role: "Grêmio Estudantil", image: gremioImg },
};

export type Line = { who: CharacterId; text: string };

export type Choice = {
  id: string;
  label: string;
  hint: string;
  scores: { empatia?: number; regras?: number; confronto?: number };
};

export type Scene = {
  id: 1 | 2 | 3 | 4;
  chapter: string;
  title: string;
  place: string;
  intro: Line[];
  /** Consequências da cena anterior, por id da escolha */
  echoes?: Record<string, Line[]>;
  question: string;
  choices: Choice[];
};

export const scenes: Scene[] = [
  {
    id: 1,
    chapter: "Cena 1",
    title: "A Análise do Terreno",
    place: "Segunda-feira, 7h — corredor ao lado da biblioteca",
    intro: [
      {
        who: "narrador",
        text: "Segunda-feira, 7h da manhã. Os corredores estão cheios. Ao lado da biblioteca existe um terreno abandonado que virou motivo de disputa na escola.",
      },
      {
        who: "gustavo",
        text: "Esse terreno é extensão da quadra, tá na cara! Ou vocês querem transformar tudo em salinha de gente quietinha?",
      },
      {
        who: "narrador",
        text: "Do outro lado, Mariana aperta um caderno de poesias contra o peito. José, recém-chegado, observa em silêncio.",
      },
      {
        who: "gustavo",
        text: "Olha só, ela trouxe o caderninho de novo... esse lixo aí não vai virar quadra, viu?",
      },
      { who: "mariana", text: "(abaixa a cabeça e não responde)" },
      { who: "narrador", text: "O corredor inteiro ouviu. E todos esperam a sua reação." },
    ],
    question: "Qual é a sua atitude diante da situação?",
    choices: [
      {
        id: "1A",
        label: "Enfrentar Gustavo diretamente no meio do corredor, exigindo que ele pare com os deboches.",
        hint: "Aumenta a tensão · Ganha a simpatia de Mariana",
        scores: { confronto: 2 },
      },
      {
        id: "1B",
        label: "Ignorar a piada, puxar conversa com Mariana e José e perguntar o que eles acham do espaço.",
        hint: "Foco na empatia e na escuta",
        scores: { empatia: 2 },
      },
      {
        id: "1C",
        label: "Ir ao Grêmio Estudantil pedir uma mediação formal antes que vire briga.",
        hint: "Foco na via institucional e nas regras",
        scores: { regras: 2 },
      },
    ],
  },
  {
    id: 2,
    chapter: "Cena 2",
    title: "A Roda de Conversa",
    place: "Terceira aula — Literatura, carteiras em círculo",
    echoes: {
      "1A": [
        {
          who: "gustavo",
          text: "Engraçado como certos alunos gostam de se fazer de vítima, né? O clima da sala está elétrico.",
        },
      ],
      "1B": [
        {
          who: "mariana",
          text: "Ninguém nunca me perguntou o que eu acho... (segura o caderno com mais firmeza)",
        },
      ],
      "1C": [
        {
          who: "gremio",
          text: "Trouxemos o regimento e uma pauta impressa para organizar a discussão. Só que a turma quer falar, não quer assinar papel.",
        },
      ],
    },
    intro: [
      {
        who: "narrador",
        text: "O Professor Thiago sente a tensão no ar e abandona a aula tradicional. Arruma as carteiras em um grande círculo.",
      },
      {
        who: "thiago",
        text: "A literatura não serve só para prova. Ela serve para a gente aprender a ouvir o outro. Palavra também constrói e também machuca.",
      },
      {
        who: "thiago",
        text: "Alguém gostaria de compartilhar algo que escreveu ou que sente sobre o que vivemos aqui na escola?",
      },
      { who: "narrador", text: "Silêncio. Mariana olha para o caderno. Você percebe a chance." },
    ],
    question: "O que você faz?",
    choices: [
      {
        id: "2A",
        label: "Levantar a mão e encorajar Mariana a ler o poema do caderno em voz alta.",
        hint: "Risco: ela pode tremer — mas é a chance da voz dela surgir",
        scores: { empatia: 2 },
      },
      {
        id: "2B",
        label: "Tomar a palavra e fazer um discurso duro defendendo regras contra o bullying.",
        hint: "Firmeza, mas fala pelos outros",
        scores: { confronto: 1, regras: 1 },
      },
      {
        id: "2C",
        label: 'Propor um projeto em grupo, o "Teatro da União", para encenar histórias sobre preconceito.',
        hint: "Cooperação, porém adia o confronto real",
        scores: { empatia: 1, regras: 1 },
      },
    ],
  },
  {
    id: 3,
    chapter: "Cena 3",
    title: "A Assembleia da Escola",
    place: "Sexta-feira — auditório lotado",
    echoes: {
      "2A": [
        {
          who: "mariana",
          text: '"Eu atravesso o corredor / e ninguém escuta meus passos / sou fantasma de mim mesma / entre risos e pedaços."',
        },
        {
          who: "narrador",
          text: "O auditório fica em silêncio absoluto. Gustavo abaixa os olhos, visivelmente envergonhado.",
        },
      ],
      "2B": [
        {
          who: "narrador",
          text: "A discussão está paralisada entre dois blocos que não cedem um centímetro. Cada lado repete o próprio discurso.",
        },
      ],
      "2C": [
        {
          who: "narrador",
          text: "O teatro animou a turma, mas na assembleia os dois blocos continuam travados, cada um com seu cartaz.",
        },
      ],
    },
    intro: [
      {
        who: "narrador",
        text: "A pauta é o futuro do terreno abandonado. A professora de Português e a diretora observam de longe: querem ver como os alunos resolvem o impasse.",
      },
      { who: "gustavo", text: "QUADRA! A gente precisa de espaço pra jogar, e ponto!" },
      { who: "jose", text: "E cantinho de leitura? Tem gente que só tem paz na hora de ler..." },
      { who: "thiago", text: "A palavra está aberta. Alguém tem uma proposta para a mesa de votação?" },
    ],
    question: "Qual proposta você apresenta na mesa de votação?",
    choices: [
      {
        id: "3A",
        label: "Propor uma solução unificada: bancos de leitura, mesas de convivência/jogos e área recreativa.",
        hint: "Busca o consenso sem apagar ninguém",
        scores: { empatia: 2 },
      },
      {
        id: "3B",
        label: "Exigir votação estrita: ou 100% espaço cultural de leitura, ou 100% área de lazer esportivo.",
        hint: "Tudo ou nada — alguém sai derrotado",
        scores: { confronto: 2 },
      },
      {
        id: "3C",
        label: "Pedir adiamento para criar uma comissão mista com representantes de cada grupo.",
        hint: "Via formal, prudente e lenta",
        scores: { regras: 2 },
      },
    ],
  },
  {
    id: 4,
    chapter: "Cena 4",
    title: "O Dia da Votação — A Prova de Fogo",
    place: "Pátio, minutos antes de fechar as urnas",
    echoes: {
      "3A": [
        { who: "gremio", text: "Sua proposta unificada entrou na cédula. Agora é a escola que decide." },
      ],
      "3B": [
        { who: "gremio", text: "Registramos as duas opções fechadas. Vai sobrar mágoa para um dos lados." },
      ],
      "3C": [
        { who: "gremio", text: "A comissão mista foi criada, mas a assembleia decidiu votar hoje mesmo." },
      ],
    },
    intro: [
      { who: "narrador", text: "As urnas estão preparadas pelo Grêmio. Faltam minutos para o fim da votação." },
      { who: "gustavo", text: "Foi ele! O José rasgou nossos cartazes, tenho certeza!" },
      { who: "jose", text: "Eu não fiz nada... eu juro que não fiz nada." },
      { who: "narrador", text: "Gustavo e seus amigos cercam José no pátio. Ninguém tem prova nenhuma." },
    ],
    question: "Como você reage a essa crise antes da apuração?",
    choices: [
      {
        id: "4A",
        label: "Defender José publicamente e mostrar que acusar sem provas é o mesmo preconceito que o livro debate.",
        hint: "Coragem com empatia",
        scores: { empatia: 2 },
      },
      {
        id: "4B",
        label: "Pedir calma e propor checar os registros da escola e ouvir quem estava por perto.",
        hint: "Justiça pelo diálogo e pela apuração",
        scores: { empatia: 1, regras: 1 },
      },
      {
        id: "4C",
        label: "Focar na votação e dizer para deixarem essa briga para depois da apuração.",
        hint: "Ignora a pessoa em nome do processo",
        scores: { confronto: 2 },
      },
    ],
  },
];

export type EndingId = "literocratico" | "parlamento" | "pedra";

export type Ending = {
  id: EndingId;
  badge: string;
  title: string;
  tone: "good" | "neutral" | "bad";
  lines: Line[];
  moral: string;
};

export const endings: Record<EndingId, Ending> = {
  literocratico: {
    id: "literocratico",
    badge: "🏆 Melhor final",
    title: "O Espaço Literocrático",
    tone: "good",
    lines: [
      {
        who: "narrador",
        text: "Meses depois, o terreno abandonado é inaugurado: mesas de estudo cercadas por um jardim, bancos para leitura de poesias e áreas de convivência.",
      },
      { who: "gustavo", text: "José, Mariana... me desculpem. Eu falei muita besteira sem conhecer vocês." },
      { who: "mariana", text: "Agora eu leio meus poemas aqui em voz alta. E tem gente que senta pra ouvir." },
      {
        who: "narrador",
        text: "Alunos de todos os cursos dividem o mesmo local com respeito e cooperação. A escola virou exemplo de cidadania e democracia viva.",
      },
    ],
    moral:
      "Escutar antes de decidir transforma disputa em projeto comum: é isso que sustenta a convivência democrática.",
  },
  parlamento: {
    id: "parlamento",
    badge: "⚖️ Final neutro",
    title: "O Pequeno Parlamento",
    tone: "neutral",
    lines: [
      {
        who: "narrador",
        text: "O lado do Espaço de Leitura venceu por margem mínima. A decisão foi respeitada porque seguiu as regras da maioria.",
      },
      { who: "gremio", text: "Ata assinada, resultado publicado. Tudo dentro do regimento." },
      { who: "gustavo", text: "Perdemos. Então esse lugar não é nosso. A gente nem passa por lá." },
      {
        who: "narrador",
        text: "A escola é organizada e ordeira, mas ainda faltam pontes de amizade entre os diferentes grupos.",
      },
    ],
    moral:
      "Regras garantem ordem, mas sem escuta a maioria só troca de vencedor — não cria pertencimento.",
  },
  pedra: {
    id: "pedra",
    badge: "❌ Final ruim",
    title: "A Pedra no Caminho",
    tone: "bad",
    lines: [
      { who: "narrador", text: "A votação terminou em tumulto e desacordo. As urnas foram fechadas às pressas." },
      {
        who: "narrador",
        text: "O espaço foi reformado de forma genérica pela direção, sem nenhuma participação dos alunos.",
      },
      { who: "mariana", text: "(voltou a se isolar; o caderno ficou fechado na mochila)" },
      {
        who: "narrador",
        text: "O bullying velado continua nos corredores e a oportunidade de aprender a conviver democraticamente foi perdida.",
      },
    ],
    moral:
      "Impor opinião e ignorar injustiça contra uma pessoa custa a todos: sem empatia, a democracia não passa de barulho.",
  },
};

export type Scores = { empatia: number; regras: number; confronto: number };

export function tally(choiceIds: string[]): Scores {
  const total: Scores = { empatia: 0, regras: 0, confronto: 0 };
  for (const scene of scenes) {
    for (const choice of scene.choices) {
      if (!choiceIds.includes(choice.id)) continue;
      total.empatia += choice.scores.empatia ?? 0;
      total.regras += choice.scores.regras ?? 0;
      total.confronto += choice.scores.confronto ?? 0;
    }
  }
  return total;
}

export function resolveEnding(choiceIds: string[]): EndingId {
  const s = tally(choiceIds);
  if (s.confronto >= 4) return "pedra";
  if (s.empatia >= 6 && s.confronto <= 2) return "literocratico";
  if (s.empatia > s.regras && s.confronto === 0) return "literocratico";
  return "parlamento";
}
