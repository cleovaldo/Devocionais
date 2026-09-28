import React, { useState } from 'react';
import { DEVOCIONAIS } from './data/devocionais';
import { Devocional, CorteViral } from './types';
import { PlayerCard916 } from './components/PlayerCard916';
import { HeaderLogo } from './components/HeaderLogo';
import { OpusClipModal } from './components/OpusClipModal';
import { PhonePreviewModal } from './components/PhonePreviewModal';
import { TranscriptModal } from './components/TranscriptModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { EpisodesDrawer } from './components/EpisodesDrawer';
import { 
  Scissors, 
  Sparkles, 
  ListMusic, 
  Share2, 
  BookOpen, 
  Radio, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentDevocional, setCurrentDevocional] = useState<Devocional>(DEVOCIONAIS[0]);
  const [isOpusClipOpen, setIsOpusClipOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEpisodesOpen, setIsEpisodesOpen] = useState(false);
  const [previewCorte, setPreviewCorte] = useState<CorteViral | null>(null);

  const currentIndex = DEVOCIONAIS.findIndex(d => d.id === currentDevocional.id);

  const handleNextEpisode = () => {
    const nextIdx = (currentIndex + 1) % DEVOCIONAIS.length;
    setCurrentDevocional(DEVOCIONAIS[nextIdx]);
  };

  const handlePrevEpisode = () => {
    const prevIdx = (currentIndex - 1 + DEVOCIONAIS.length) % DEVOCIONAIS.length;
    setCurrentDevocional(DEVOCIONAIS[prevIdx]);
  };

  return (
    <div className="relative min-h-screen bg-[#0f141d] text-white flex flex-col justify-between overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* Background Subtle Gradient & Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-amber-500/10 via-blue-900/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-10 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Assembleia de Deus / ADEC Glass Badge in Top Right */}
      <HeaderLogo />

      {/* Top Application Bar */}
      <header className="relative z-30 w-full max-w-5xl mx-auto px-4 pt-6 pb-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-['Outfit'] text-xs font-semibold tracking-wider uppercase text-amber-200/90">
            Devocional ADEC • Oratória para Jovens
          </span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEpisodesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 transition-colors"
          >
            <ListMusic className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Episódios</span>
            <span className="text-[10px] text-white/50">({DEVOCIONAIS.length})</span>
          </button>

          <button
            onClick={() => setIsOpusClipOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-blue-500/20 hover:from-amber-500/30 hover:to-blue-500/30 border border-amber-300/30 text-xs font-semibold text-amber-200 transition-colors shadow-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-300" />
            <span>Motor OpusClip AI</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </button>
        </div>
      </header>

      {/* Main Showcase Section */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column (Desktop Only): Context, Scripture & Value Proposition */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 text-left pr-4">
            <div>
              <span className="inline-block font-['Outfit'] text-[11px] font-bold tracking-[2px] uppercase text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3">
                Homilética & Presença
              </span>
              <h2 className="font-['Outfit'] text-2xl font-bold text-white tracking-tight leading-snug">
                Capacitando uma nova geração de pregadores.
              </h2>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Mensagens curtas e práticas de oratória bíblica com o Pr. Cleovaldo Batista, com extração de cortes no formato exato para redes sociais.
              </p>
            </div>

            {/* Scripture Widget */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-300 block mb-1">
                Texto Bíblico Chave
              </span>
              <p className="text-xs italic text-white/90 leading-relaxed">
                {currentDevocional.versiculoChave}
              </p>
            </div>

            {/* Quick OpusClip Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-transparent border border-amber-400/20 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Scissors className="w-4 h-4" />
                <span>Extrator Viral OpusClip</span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Avalia Gancho Inicial, Coerência e Retenção com saída rigorosamente em JSON para automações de Reels e Shorts.
              </p>
              <button
                onClick={() => setIsOpusClipOpen(true)}
                className="w-full mt-1 py-2 px-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-amber-300 transition-colors"
              >
                <span>Abrir Extrator de Cortes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Column: The 9:16 Aspect Ratio Card Player */}
          <div className="lg:col-span-4 flex justify-center">
            <PlayerCard916
              devocional={currentDevocional}
              onOpenOpusClip={() => setIsOpusClipOpen(true)}
              onOpenTranscript={() => setIsTranscriptOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onNextEpisode={handleNextEpisode}
              onPrevEpisode={handlePrevEpisode}
              hasMultipleEpisodes={DEVOCIONAIS.length > 1}
            />
          </div>

          {/* Right Column (Desktop Only): Principles & Playlist */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 text-left pl-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit'] text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>Princípios deste Devocional</span>
              </h3>
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="text-[11px] text-amber-300 hover:underline"
              >
                Ver transcrição
              </button>
            </div>

            <div className="space-y-2.5">
              {currentDevocional.pontosChave?.map((ponto, pIdx) => (
                <div 
                  key={pIdx} 
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{ponto}</span>
                </div>
              ))}
            </div>

            {/* Quick Share action on desktop */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar Devocional no WhatsApp</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer Branding & Credits */}
      <footer className="relative z-20 w-full text-center py-4 border-t border-white/5 bg-black/20 text-white/50 text-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Ame Pregar • Pr. Cleovaldo Batista • ADEC</p>
          <p className="text-[11px] text-white/40">
            Oratória para Jovens | Motor de Inteligência Artificial Estilo OpusClip
          </p>
        </div>
      </footer>

      {/* Interactive Modals */}
      <OpusClipModal
        isOpen={isOpusClipOpen}
        onClose={() => setIsOpusClipOpen(false)}
        devocional={currentDevocional}
        onPreviewShort={(corte) => setPreviewCorte(corte)}
      />

      <PhonePreviewModal
        isOpen={previewCorte !== null}
        onClose={() => setPreviewCorte(null)}
        corte={previewCorte}
        devocional={currentDevocional}
      />

      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        devocional={currentDevocional}
      />

      <WhatsAppShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        devocional={currentDevocional}
      />

      <EpisodesDrawer
        isOpen={isEpisodesOpen}
        onClose={() => setIsEpisodesOpen(false)}
        devocionais={DEVOCIONAIS}
        currentId={currentDevocional.id}
        onSelect={(dev) => setCurrentDevocional(dev)}
      />

    </div>
  );
}
