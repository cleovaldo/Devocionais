import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { Devocional } from '../types';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  devocional: Devocional;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  devocional,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href || 'https://cleovaldo.github.io/devocional-adec/';
  const shareMessage = `🎙️ *Ame Pregar - ${devocional.pregador}*
📖 *Devocional:* "${devocional.titulo}" (${devocional.subtitulo})
💡 *ADEC:* Oratória e presença no púlpito para jovens.
🎧 Toque para ouvir o devocional completo:
${shareUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#111722] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="font-['Outfit'] text-base font-bold text-white">
              Compartilhar no WhatsApp
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-white/70">
            Envie este devocional de oratória para o grupo de jovens da igreja, pregadores da congregação ou amigos de ministério:
          </p>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-emerald-200/90 whitespace-pre-line leading-relaxed">
            {shareMessage}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir WhatsApp com Mensagem</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/15 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Mensagem Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Mensagem Formatada</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
