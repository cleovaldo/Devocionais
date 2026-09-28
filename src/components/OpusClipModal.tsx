import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Scissors, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Smartphone, 
  ChevronRight, 
  Flame, 
  Target, 
  Layers, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { CorteViral, Devocional } from '../types';

interface OpusClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  devocional: Devocional;
  onPreviewShort: (corte: CorteViral) => void;
}

export const OpusClipModal: React.FC<OpusClipModalProps> = ({
  isOpen,
  onClose,
  devocional,
  onPreviewShort,
}) => {
  const [activeTab, setActiveTab] = useState<'cortes' | 'json' | 'personalizado'>('cortes');
  const [customTranscript, setCustomTranscript] = useState(devocional.transcricaoCompleta);
  const [customTitle, setCustomTitle] = useState(devocional.titulo);
  const [speakerName, setSpeakerName] = useState(devocional.pregador);
  const [isLoading, setIsLoading] = useState(false);
  const [cortes, setCortes] = useState<CorteViral[]>([]);
  const [copiedJson, setCopiedJson] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize cuts on first load or when triggered
  React.useEffect(() => {
    if (isOpen && cortes.length === 0) {
      handleAnalyzeCuts();
    }
  }, [isOpen]);

  const handleAnalyzeCuts = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/analyze-cuts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: customTranscript || devocional.transcricaoCompleta,
          title: customTitle || devocional.titulo,
          speaker: speakerName || devocional.pregador,
        }),
      });

      if (!response.ok) {
        throw new Error(`Falha no servidor (${response.status})`);
      }

      const data = await response.json();
      if (data && data.cortes) {
        setCortes(data.cortes);
      } else {
        throw new Error('Nenhum corte viral retornado no JSON.');
      }
    } catch (err: any) {
      console.error('Erro na requisição:', err);
      setErrorMsg('Não foi possível conectar ao motor no momento. Exibindo cortes de alta performance pré-compilados.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrictJsonObject = () => {
    return {
      metadata: {
        fonte: "Ame Pregar - Devocional ADEC",
        pregador: speakerName || devocional.pregador,
        tema: customTitle || devocional.titulo,
        total_cortes: cortes.length,
        gerado_em: new Date().toISOString()
      },
      cortes: cortes.map((c) => ({
        id: c.id,
        titulo: c.titulo,
        tempo_inicio: c.tempo_inicio,
        tempo_fim: c.tempo_fim,
        duracao_segundos: c.duracao_segundos,
        score_viral: c.score_viral,
        criterios: {
          gancho_inicial: {
            pontuacao: c.criterios.gancho_inicial.pontuacao,
            frase_de_impacto: c.criterios.gancho_inicial.frase_de_impacto,
            analise: c.criterios.gancho_inicial.analise
          },
          coerencia: {
            pontuacao: c.criterios.coerencia.pontuacao,
            analise: c.criterios.coerencia.analise
          },
          potencial_retencao: {
            pontuacao: c.criterios.potencial_retencao.pontuacao,
            analise: c.criterios.potencial_retencao.analise
          }
        },
        legenda_curta: c.legenda_curta,
        hashtags: c.hashtags,
        transcricao_corte: c.transcricao_corte,
        sugestao_b_roll: c.sugestao_b_roll
      }))
    };
  };

  const strictJsonString = JSON.stringify(getStrictJsonObject(), null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(strictJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([strictJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortes_opusclip_${devocional.id || 'ame_pregar'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#111722] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Scissors className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit'] text-lg font-bold text-white">
                  Motor de Cortes Virais (Estilo OpusClip)
                </h3>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Critérios 1, 2 e 3
                </span>
              </div>
              <p className="text-xs text-white/60">
                Análise com Gancho Inicial, Coerência e Retenção para Shorts & Reels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-[#0d121a]">
          <button
            onClick={() => setActiveTab('cortes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'cortes'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Melhores Momentos ({cortes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'json'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Output JSON Estrito</span>
          </button>

          <button
            onClick={() => setActiveTab('personalizado')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'personalizado'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Analisar Outro Sermão</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-['Outfit'] text-base font-semibold text-white">
                  Extraindo Cortes de Alto Impacto...
                </h4>
                <p className="text-xs text-white/60 max-w-sm">
                  Avaliando Gancho Inicial, Coerência Narrativa e Potencial de Retenção para jovens.
                </p>
              </div>
            </div>
          ) : activeTab === 'cortes' ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="text-xs">
                  <span className="text-white/60">Análise baseada em: </span>
                  <span className="font-bold text-white">{devocional.titulo}</span>
                  <span className="text-white/40"> ({devocional.pregador})</span>
                </div>
                <button
                  onClick={handleAnalyzeCuts}
                  className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-analisar</span>
                </button>
              </div>

              {/* List of identified cuts */}
              <div className="grid grid-cols-1 gap-4">
                {cortes.map((corte, index) => (
                  <div
                    key={corte.id || index}
                    className="relative p-5 rounded-2xl bg-[#141b27] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-lg group"
                  >
                    {/* Top Row: Score & Timestamps */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 font-extrabold text-sm px-3 py-1 rounded-xl shadow-md">
                          <Flame className="w-4 h-4 fill-slate-950" />
                          <span>{corte.score_viral} / 100</span>
                        </div>
                        <h4 className="font-['Outfit'] text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                          {corte.titulo}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-white/70 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>{corte.tempo_inicio} - {corte.tempo_fim}</span>
                        <span className="text-white/40">({corte.duracao_segundos}s)</span>
                      </div>
                    </div>

                    {/* Three Criteria Assessment Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                      {/* 1. Gancho Inicial */}
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              1. Gancho Inicial
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-200">
                              {corte.criterios.gancho_inicial.pontuacao}%
                            </span>
                          </div>
                          {corte.criterios.gancho_inicial.frase_de_impacto && (
                            <p className="text-xs font-medium text-white italic mb-1 bg-black/30 p-1.5 rounded-lg border-l-2 border-amber-400">
                              "{corte.criterios.gancho_inicial.frase_de_impacto}"
                            </p>
                          )}
                          <p className="text-[11px] text-white/60 leading-relaxed">
                            {corte.criterios.gancho_inicial.analise}
                          </p>
                        </div>
                      </div>

                      {/* 2. Coerência */}
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              2. Coerência
                            </span>
                            <span className="text-xs font-mono font-bold text-blue-200">
                              {corte.criterios.coerencia.pontuacao}%
                            </span>
                          </div>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            {corte.criterios.coerencia.analise}
                          </p>
                        </div>
                      </div>

                      {/* 3. Potencial de Retenção */}
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              3. Retenção
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-200">
                              {corte.criterios.potencial_retencao.pontuacao}%
                            </span>
                          </div>
                          <p className="text-[11px] text-white/70 leading-relaxed">
                            {corte.criterios.potencial_retencao.analise}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cut Transcript Snippet */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 leading-relaxed font-sans mb-3">
                      <span className="font-semibold text-amber-200 mr-1.5">Transcrição do Corte:</span>
                      "{corte.transcricao_corte}"
                    </div>

                    {/* B-Roll & Visual Advice */}
                    {corte.sugestao_b_roll && (
                      <div className="text-[11px] text-white/50 mb-3 flex items-center gap-1.5">
                        <span className="font-semibold text-white/70">Sugestão de Edição 9:16:</span>
                        <span>{corte.sugestao_b_roll}</span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-1">
                        {corte.hashtags?.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => onPreviewShort(corte)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Ver Preview 9:16</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'json' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="text-xs text-white/70">
                  <span className="font-semibold text-white">Formato JSON Estrito:</span> Pronto para automações OpusClip, FFmpeg, Make, n8n ou CapCut bot.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/15 transition-colors"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white/70" />
                        <span>Copiar JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar .json</span>
                  </button>
                </div>
              </div>

              {/* Strict JSON Output Container */}
              <div className="relative rounded-2xl bg-[#090d14] border border-white/15 p-4 font-mono text-xs text-amber-200/90 overflow-x-auto max-h-[500px]">
                <pre>{strictJsonString}</pre>
              </div>
            </div>
          ) : (
            /* Custom Sermon Text Input Tab */
            <div className="space-y-4">
              <p className="text-xs text-white/70">
                Cole a transcrição de um sermão completo, palestra de jovens ou pregação para extrair os cortes virais com avaliação automática de Gancho, Coerência e Retenção.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Título da Mensagem
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="Ex: Como Vencer a Ansiedade no Púlpito"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Pregador / Orador
                  </label>
                  <input
                    type="text"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="Ex: Pr. Cleovaldo Batista"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Texto ou Transcrição da Mensagem
                </label>
                <textarea
                  rows={8}
                  value={customTranscript}
                  onChange={(e) => setCustomTranscript(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 font-sans"
                  placeholder="Cole aqui o texto completo ou os pontos do sermão..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomTranscript(devocional.transcricaoCompleta);
                    setCustomTitle(devocional.titulo);
                  }}
                  className="px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  Restaurar Original
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cortes');
                    handleAnalyzeCuts();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Processar com IA OpusClip</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
