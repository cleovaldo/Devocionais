import React from 'react';
import { X, Play, Clock, Sparkles } from 'lucide-react';
import { Devocional } from '../types';

interface EpisodesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  devocionais: Devocional[];
  currentId: string;
  onSelect: (devocional: Devocional) => void;
}

export const EpisodesDrawer: React.FC<EpisodesDrawerProps> = ({
  isOpen,
  onClose,
  devocionais,
  currentId,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-[#111722] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div>
            <h3 className="font-['Outfit'] text-lg font-bold text-white">
              Série Ame Pregar — Devocionais
            </h3>
            <p className="text-xs text-white/60">
              Pr. Cleovaldo Batista • ADEC
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of episodes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {devocionais.map((dev, idx) => {
            const isSelected = dev.id === currentId;
            return (
              <button
                key={dev.id}
                onClick={() => {
                  onSelect(dev);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 group ${
                  isSelected
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80 hover:bg-white/8'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white group-hover:bg-amber-400/20'
                }`}>
                  {isSelected ? <Play className="w-4 h-4 fill-slate-950 ml-0.5" /> : <span className="text-xs font-mono font-bold">0{idx + 1}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-['Outfit'] text-sm font-semibold truncate text-white group-hover:text-amber-200">
                      {dev.titulo}
                    </h4>
                    <span className="text-[10px] font-mono text-white/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dev.duracaoFormatada}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 truncate">
                    {dev.descricao}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
