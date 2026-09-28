import React from 'react';
import { X, BookOpen, Quote, Sparkles, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { Devocional } from '../types';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  devocional: Devocional;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  devocional,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#111722] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-white">
                Notas & Transcrição
              </h3>
              <p className="text-xs text-white/60">
                {devocional.titulo} • {devocional.pregador}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Scripture Quote */}
          {devocional.versiculoChave && (
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-200">
              <div className="flex items-start gap-2.5">
                <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-['Outfit'] text-sm font-medium italic leading-relaxed text-amber-100">
                  {devocional.versiculoChave}
                </p>
              </div>
            </div>
          )}

          {/* Key Principles Checklist */}
          <div>
            <h4 className="font-['Outfit'] text-sm font-bold text-white mb-3 flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span>Princípios Práticos de Oratória</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {devocional.pontosChave?.map((ponto, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{ponto}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Devotional Transcript */}
          <div>
            <h4 className="font-['Outfit'] text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Transcrição Completa da Mensagem</span>
            </h4>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-sm leading-relaxed text-white/80 whitespace-pre-line font-sans">
              {devocional.transcricaoCompleta}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
