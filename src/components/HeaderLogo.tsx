import React from 'react';

export const HeaderLogo: React.FC = () => {
  return (
    <div 
      className="fixed top-5 right-5 z-40 flex items-center gap-2 p-2 px-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/15"
      title="Assembleia de Deus - ADEC"
    >
      {/* SVG Emblem for Assembleia de Deus */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-slate-950 font-bold text-xs shadow-inner">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-950" fill="currentColor">
          <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4zm0 3.3l5 2.5v4.2c0 3.83-2.65 7.42-5 8.44-2.35-1.02-5-4.61-5-8.44V7.8l5-2.5zm-1 3.7v3h-3v2h3v5h2v-5h3v-2h-3V9h-2z" />
        </svg>
      </div>
      <div className="flex flex-col text-left pr-1">
        <span className="text-[11px] font-extrabold tracking-wider text-amber-200 uppercase leading-none">ADEC</span>
        <span className="text-[9px] text-white/70 font-medium leading-none mt-0.5">Assembleia de Deus</span>
      </div>
    </div>
  );
};
