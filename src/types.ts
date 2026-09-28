export interface Devocional {
  id: string;
  titulo: string;
  subtitulo: string;
  pregador: string;
  categoria: string;
  duracaoFormatada: string;
  duracaoSegundos: number;
  versiculoChave: string;
  descricao: string;
  imagemOrador: string;
  transcricaoCompleta: string;
  pontosChave: string[];
}

export interface CriterioAnalise {
  pontuacao: number;
  frase_de_impacto?: string;
  analise: string;
}

export interface CorteViral {
  id: string;
  titulo: string;
  tempo_inicio: string;
  tempo_fim: string;
  duracao_segundos: number;
  score_viral: number;
  criterios: {
    gancho_inicial: CriterioAnalise;
    coerencia: CriterioAnalise;
    potencial_retencao: CriterioAnalise;
  };
  legenda_curta: string;
  hashtags: string[];
  transcricao_corte: string;
  sugestao_b_roll: string;
}

export interface AnaliseCortesResponse {
  cortes: CorteViral[];
  source?: string;
  message?: string;
  error?: string;
}
