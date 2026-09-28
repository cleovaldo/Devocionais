import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const DEFAULT_FALLBACK_CUTS = [
  {
    id: "corte-voz-1",
    titulo: "O Erro Fatal ao Abrir um Sermão",
    tempo_inicio: "00:08",
    tempo_fim: "00:54",
    duracao_segundos: 46,
    score_viral: 97,
    criterios: {
      gancho_inicial: {
        pontuacao: 98,
        frase_de_impacto: "Se você sobe ao púlpito e a primeira frase é 'irmãos, não tive muito tempo de preparar', você já assassinou a atenção dos jovens.",
        analise: "Quebra de expectativa instantânea com uma dor real e frequente vivenciada por oradores."
      },
      coerencia: {
        pontuacao: 94,
        analise: "Demonstra o erro clássico, explica a psicologia da congregação nos primeiros segundos e prescreve o antídoto prático."
      },
      potencial_retencao: {
        pontuacao: 98,
        analise: "Gera curiosidade imediata e reflexão visceral sobre autoridade e respeito pela Palavra."
      }
    },
    legenda_curta: "A primeira frase decide se a igreja vai te ouvir ou abrir o Instagram.",
    hashtags: ["#AmePregar", "#OratóriaJovem", "#PrCleovaldoBatista", "#CortesGospel", "#PúlpitoComPoder"],
    transcricao_corte: "Se você sobe ao púlpito e a primeira frase é 'irmãos, não tive muito tempo de preparar', você já assassinou a atenção dos jovens! O jovem de hoje decide em quatro segundos se você merece o tempo dele ou se a tela do celular é mais interessante. Quando você abrir a boca, comece pelo coração da mensagem. Não peça desculpas pela sua limitação: glorifique a Cristo pela mensagem que Ele te entregou.",
    sugestao_b_roll: "Corte seco para primeiro plano, legenda dinâmica em amarelo com destaque na palavra 'ASSASSINOU', efeito sonoro de impacto nos 00:03."
  },
  {
    id: "corte-voz-2",
    titulo: "Como Modular a Voz para Não Parecer Monótono",
    tempo_inicio: "01:12",
    tempo_fim: "01:58",
    duracao_segundos: 46,
    score_viral: 93,
    criterios: {
      gancho_inicial: {
        pontuacao: 92,
        frase_de_impacto: "Gritar o tempo todo não é unção: é falta de fôlego e técnica.",
        analise: "Desmistifica uma crença popular equivocada sobre fervor e volume no púlpito."
      },
      coerencia: {
        pontuacao: 95,
        analise: "Explica a diferença entre intensidade espiritual e controle acústico da voz com começo, meio e fim harmônicos."
      },
      potencial_retencao: {
        pontuacao: 93,
        analise: "Assunto polêmico e prático para qualquer jovem pregador que fica rouco no final da ministração."
      }
    },
    legenda_curta: "Gritar não é unção. Aprenda a falar com o coração.",
    hashtags: ["#VozDePregador", "#TécnicaVocal", "#OratóriaCristã", "#AmePregar"],
    transcricao_corte: "Gritar o tempo todo não é unção: é falta de fôlego e técnica. O segredo dos grandes oradores da história não é o volume mais alto, é o contraste! É saber descer ao sussurro reverente na hora da reflexão e erguer o tom na proclamação da vitória na cruz. A sua voz é um instrumento sagrado; afine-a para servir ao Mestre.",
    sugestao_b_roll: "Ondas sonoras animadas na tela comparando 'Monotonia' vs 'Contraste Emocional', zoom gradual para foco na expressão facial."
  },
  {
    id: "corte-voz-3",
    titulo: "O Poder do Silêncio e das Pausas Dramáticas",
    tempo_inicio: "02:05",
    tempo_fim: "02:48",
    duracao_segundos: 43,
    score_viral: 91,
    criterios: {
      gancho_inicial: {
        pontuacao: 94,
        frase_de_impacto: "A frase mais poderosa que você vai dizer hoje... pode ser um silêncio de três segundos.",
        analise: "Demonstração viva do silêncio que força a mente do ouvinte a processar a verdade proclamada."
      },
      coerencia: {
        pontuacao: 93,
        analise: "Conduz o ouvinte a perceber que a pressa denuncia insegurança, enquanto a pausa reflete domínio e unção."
      },
      potencial_retencao: {
        pontuacao: 90,
        analise: "Quebra de ritmo perfeita para viralizar no Reels e Shorts por fugir do excesso de ruído atual."
      }
    },
    legenda_curta: "O silêncio no púlpito fala mais alto do que mil palavras apressadas.",
    hashtags: ["#PausasQueFalam", "#OratóriaPúlpito", "#AmePregar", "#PregaçãoExpositiva"],
    transcricao_corte: "A frase mais poderosa que você vai dizer hoje... pode ser um silêncio de três segundos. O pregador imaturo tem medo do silêncio porque acha que o esquecimento o pegou. Mas o pregador sábio usa a pausa para deixar o Espírito Santo queimar a Palavra no peito de quem ouve. Não tenha pressa de preencher o vazio com barulho.",
    sugestao_b_roll: "Momento de tela escura por 1 segundo no silêncio, seguido por texto elegante em tipografia serifada branca com dourado."
  }
];

app.post('/api/analyze-cuts', async (req, res) => {
  try {
    const { transcript, title, speaker } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        cortes: DEFAULT_FALLBACK_CUTS,
        source: 'curated_library',
        message: 'Utilizando cortes selecionados de alta retenção (configure GEMINI_API_KEY para análises personalizadas).'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Você é o motor de inteligência artificial de um aplicativo de edição de vídeo estilo OpusClip. Sua função é analisar vídeos longos (podcasts, palestras, lives, pregações) e extrair os melhores momentos (cortes virais/shorts).

Título do conteúdo: "${title || 'A importância da Voz'}"
Pregador / Orador: "${speaker || 'Pr. Cleovaldo Batista'}"
Texto / Transcrição da mensagem:
"""
${transcript || 'Transcrição não fornecida explicitamente; extraia os melhores cortes baseados no tema de Oratória para Jovens, A Importância da Voz, Gancho Inicial e Presença no Púlpito do Pr. Cleovaldo Batista.'}
"""

Para cada corte identificado, avalie com rigor os seguintes critérios:
1. Gancho Inicial: O corte começa com uma frase de forte impacto?
2. Coerência: A explicação ou história tem início, meio e fim claros?
3. Potencial de Retenção: O assunto é altamente interessante ou controverso?

Seu output deve ser estritamente em formato JSON para que o sistema possa ler e cortar o vídeo automaticamente. Não adicione texto explicativo fora do JSON.

Estrutura JSON obrigatória:
{
  "cortes": [
    {
      "id": "corte-1",
      "titulo": "Título magnético para o corte",
      "tempo_inicio": "00:15",
      "tempo_fim": "01:05",
      "duracao_segundos": 50,
      "score_viral": 95,
      "criterios": {
        "gancho_inicial": {
          "pontuacao": 98,
          "frase_de_impacto": "Frase de impacto inicial",
          "analise": "Justificativa da retenção nos primeiros segundos"
        },
        "coerencia": {
          "pontuacao": 92,
          "analise": "Como a narrativa fecha início, meio e fim"
        },
        "potencial_retencao": {
          "pontuacao": 94,
          "analise": "Potencial viral para público jovem no Reels/Shorts/TikTok"
        }
      },
      "legenda_curta": "Frase de destaque",
      "hashtags": ["#AmePregar", "#OratóriaJovem"],
      "transcricao_corte": "Texto do corte completo",
      "sugestao_b_roll": "Sugestão visual"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const raw = response.text || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    if (!data.cortes || !Array.isArray(data.cortes) || data.cortes.length === 0) {
      data = { cortes: DEFAULT_FALLBACK_CUTS, source: 'curated_library' };
    }

    return res.json(data);
  } catch (error: any) {
    console.error('Erro na análise de cortes:', error);
    return res.json({
      cortes: DEFAULT_FALLBACK_CUTS,
      source: 'curated_library_fallback',
      error: error?.message
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ame Pregar] Servidor ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer();
