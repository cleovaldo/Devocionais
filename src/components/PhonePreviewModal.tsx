import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Heart, MessageSquare, Share2, Bookmark, Flame, Volume2, VolumeX } from 'lucide-react';
import { CorteViral, Devocional } from '../types';

interface PhonePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  corte: CorteViral | null;
  devocional: Devocional;
}

export const PhonePreviewModal: React.FC<PhonePreviewModalProps> = ({
  isOpen,
  onClose,
  corte,
  devocional,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Split transcript into words for kinetic TikTok-style subtitles
  const words = corte?.transcricao_corte.split(' ') || [];

  useEffect(() => {
    if (!isOpen || !isPlaying || words.length === 0) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, words.length]);

  if (!isOpen || !corte) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative flex flex-col items-center">
        
        {/* Close Button top-right outside phone */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:right-[-40px] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Simulated Smartphone Container */}
        <div 
          className="relative w-[340px] h-[640px] sm:w-[360px] sm:h-[680px] rounded-[44px] overflow-hidden bg-black border-[7px] border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between"
        >
          {/* Speaker Background Photo */}
          <div className="absolute inset-0 z-0">
            <img 
              src={devocional.imagemOrador} 
              alt={devocional.pregador}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            {/* Dark gradient for captions legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />
          </div>

          {/* Top Info Bar inside screen */}
          <div className="relative z-10 p-4 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
                ADEC VIRAL
              </span>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] text-amber-300 font-bold border border-white/10">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{corte.score_viral} Score</span>
              </div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          {/* Center Dynamic Word-by-Word Viral Subtitles */}
          <div className="relative z-10 px-6 text-center my-auto flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-lg border border-white/15 shadow-2xl max-w-[280px]">
              <p className="font-['Outfit'] text-lg font-black leading-tight uppercase tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                {words.slice(Math.max(0, currentWordIndex - 2), currentWordIndex + 3).map((w, idx) => {
                  const isCurrent = idx === Math.min(2, currentWordIndex);
                  return (
                    <span
                      key={idx}
                      className={`inline-block mx-1 transition-all duration-150 ${
                        isCurrent 
                          ? 'text-amber-300 scale-110 underline decoration-amber-400 decoration-4 drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]' 
                          : 'text-white/80'
                      }`}
                    >
                      {w}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="mt-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] text-white/90 font-medium">
              Gancho: "{corte.criterios.gancho_inicial.frase_de_impacto?.slice(0, 40)}..."
            </div>
          </div>

          {/* Right Action Icons (TikTok/Reels style) */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/40 text-white'} backdrop-blur-md border border-white/10`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white/90">24.5k</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white/90">1.2k</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bookmarked ? 'bg-amber-500/20 text-amber-400' : 'bg-black/40 text-white'} backdrop-blur-md border border-white/10`}>
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-amber-400' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white/90">Salvar</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white/90">Viral</span>
            </button>
          </div>

          {/* Bottom Caption & Speaker Detail inside phone */}
          <div className="relative z-10 p-4 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <h4 className="font-['Outfit'] text-sm font-bold text-white mb-1">
              @{devocional.pregador.toLowerCase().replace(/\s+/g, '')}
            </h4>
            <p className="text-xs text-white/90 font-medium line-clamp-2 mb-2">
              {corte.titulo} — {corte.legenda_curta}
            </p>
            <div className="flex flex-wrap gap-1 text-[11px] text-amber-300">
              {corte.hashtags?.slice(0, 3).map((h, i) => (
                <span key={i}>{h}</span>
              ))}
            </div>
          </div>

          {/* Phone Bottom Pill bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full" />
        </div>

      </div>
    </div>
  );
};
