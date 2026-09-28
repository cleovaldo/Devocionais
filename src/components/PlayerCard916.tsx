import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Share2, 
  Scissors, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Devocional } from '../types';
import { devotionalAudio } from '../services/audioEngine';
import { WaveformVisualizer } from './WaveformVisualizer';

interface PlayerCard916Props {
  devocional: Devocional;
  onOpenOpusClip: () => void;
  onOpenTranscript: () => void;
  onOpenShare: () => void;
  onNextEpisode: () => void;
  onPrevEpisode: () => void;
  hasMultipleEpisodes: boolean;
}

export const PlayerCard916: React.FC<PlayerCard916Props> = ({
  devocional,
  onOpenOpusClip,
  onOpenTranscript,
  onOpenShare,
  onNextEpisode,
  onPrevEpisode,
  hasMultipleEpisodes,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(devocional.duracaoSegundos || 195);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    devotionalAudio.setCallbacks(
      (time, dur) => {
        setCurrentTime(time);
        setDuration(dur);
      },
      (playing) => {
        setIsPlaying(playing);
      }
    );
  }, []);

  useEffect(() => {
    // When devotional changes, reload audio engine
    devotionalAudio.loadDevotional(devocional.duracaoSegundos, devocional.transcricaoCompleta);
    setCurrentTime(0);
    setDuration(devocional.duracaoSegundos);
  }, [devocional]);

  const handleTogglePlay = () => {
    devotionalAudio.togglePlay();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    devotionalAudio.seek(val);
    setCurrentTime(val);
  };

  const handleRewind = () => {
    const newTime = Math.max(0, currentTime - 10);
    devotionalAudio.seek(newTime);
  };

  const handleForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    devotionalAudio.seek(newTime);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    devotionalAudio.setPlaybackRate(nextSpeed);
  };

  const toggleMute = () => {
    if (isMuted) {
      devotionalAudio.setVolume(0.85);
      setIsMuted(false);
    } else {
      devotionalAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-[390px] mx-auto select-none">
      {/* 9:16 Aspect Ratio Main Card */}
      <div 
        className="relative w-full aspect-[9/16] flex flex-col justify-between p-4 py-5 rounded-[28px] overflow-hidden bg-gradient-to-b from-[#141b29] via-[#0f141d] to-[#0a0d14] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Subtle Background Ambience Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Card Header */}
        <header className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span 
              className="inline-block font-['Outfit'] text-[10px] font-bold tracking-[3px] uppercase text-[#ffd79d] bg-[#ffd79d]/10 border border-[#ffd79d]/25 px-2.5 py-1 rounded-full shadow-sm"
            >
              ADEC
            </span>

            {/* Quick episode navigation */}
            {hasMultipleEpisodes && (
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5">
                <button 
                  onClick={onPrevEpisode}
                  className="p-1 hover:text-amber-200 text-white/60 transition-colors"
                  title="Episódio Anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={onNextEpisode}
                  className="p-1 hover:text-amber-200 text-white/60 transition-colors"
                  title="Próximo Episódio"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <h1 className="font-['Outfit'] text-[30px] font-bold leading-[1.08] tracking-[-0.5px] bg-gradient-to-br from-white via-slate-100 to-[#d8e2fd] bg-clip-text text-transparent">
            Ame Pregar
          </h1>

          <p className="text-[13px] font-normal text-white/70 mb-2.5">
            {devocional.pregador}
          </p>

          <div className="inline-flex items-center gap-2 font-['Outfit'] text-[13px] font-medium text-white/90 px-2.5 py-1 bg-white/8 rounded-[10px] border-l-[3px] border-[#ffd79d]">
            <span>{devocional.subtitulo}</span>
          </div>
        </header>

        {/* 2. Speaker Image Wrapper */}
        <div className="relative w-full flex-1 max-h-[260px] min-h-[190px] rounded-[18px] overflow-hidden my-3 border border-white/15 shadow-[0_12px_25px_rgba(0,0,0,0.45)] group">
          <img 
            src={devocional.imagemOrador} 
            alt={devocional.pregador}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback to high quality curated preacher photo if URL fails
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Dark gradient fade for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f141d] via-transparent to-black/20" />

          {/* Floating Live Waveform inside image */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-white/40'}`} />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">
                {isPlaying ? 'Em reprodução' : 'Áudio devocional'}
              </span>
            </div>
            <WaveformVisualizer isPlaying={isPlaying} />
          </div>
        </div>

        {/* 3. Card Footer & Audio Controls */}
        <footer className="relative z-10 w-full flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-['Outfit'] text-[20px] font-semibold text-white leading-tight tracking-tight line-clamp-1">
              {devocional.titulo}
            </h2>
            <button
              onClick={cycleSpeed}
              className="text-[11px] font-bold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 px-2 py-0.5 rounded-md transition-colors"
              title="Velocidade de Reprodução"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Custom Sleek Audio Player Container */}
          <div className="bg-white/8 p-3 rounded-[16px] border border-white/12 shadow-inner backdrop-blur-lg flex flex-col gap-2">
            
            {/* Scrubber Range Bar */}
            <div className="flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #ffd79d 0%, #ffd79d ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
              />
              <div className="flex justify-between items-center text-[10px] font-mono text-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between px-1 pt-0.5">
              <button 
                onClick={toggleMute}
                className="p-1.5 text-white/60 hover:text-white transition-colors"
                title={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRewind}
                  className="p-1.5 text-white/70 hover:text-white transition-colors"
                  title="Voltar 10 segundos"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Primary Play Button */}
                <button
                  onClick={handleTogglePlay}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-[#ffd79d] text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,157,0.45)] hover:scale-105 active:scale-95 transition-all duration-200"
                  title={isPlaying ? 'Pausar' : 'Reproduzir Devocional'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleForward}
                  className="p-1.5 text-white/70 hover:text-white transition-colors"
                  title="Avançar 10 segundos"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={onOpenShare}
                className="p-1.5 text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 rounded-lg transition-colors"
                title="Compartilhar no WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Pills: OpusClip AI & Notes */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={onOpenOpusClip}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-300/30 text-amber-200 hover:bg-amber-400/20 text-xs font-semibold tracking-wide transition-all shadow-sm group"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Cortes OpusClip</span>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </button>

            <button
              onClick={onOpenTranscript}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/15 text-white/90 text-xs font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-white/70" />
              <span>Notas & Estudo</span>
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
