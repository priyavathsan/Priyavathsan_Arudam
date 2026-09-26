import React from 'react';
import { ARUDAM_MAPPINGS } from '../data/arudam';
import { getSignById } from '../data/signs';
import { useLanguage } from '../context/LanguageContext';

interface NumberSelectorProps {
  selectedNumber: number;
  onSelectNumber: (num: number) => void;
  onCalculateArudam?: () => void;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({
  selectedNumber,
  onSelectNumber,
  onCalculateArudam
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 relative overflow-hidden shadow-xl backdrop-blur-sm">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Primary Question Prompt (Phase 2 Requirement) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'படி 1: எண் தேர்வு' : 'Step 1: Number Selection'}
          </span>
          <h2 className={`text-xl sm:text-2xl font-serif font-bold text-amber-200 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? '1 முதல் 12 வரை ஒரு எண்ணை தேர்வு செய்யவும்' : 'Select a number from 1 to 12'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isTamil
              ? 'கிளையண்ட் மனதில் நினைத்த எண்ணை தேர்ந்தெடுக்கவும் (மேஷம் = 1 முதல் மீனம் = 12 வரை)'
              : 'Choose the number the client has held in mind (Counting from Mesham = 1 to Meenam = 12)'}
          </p>
        </div>

        {/* Selected Number Display (Phase 2 Requirement) */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-amber-950/60 border border-amber-500/40 px-4 py-2 rounded-xl text-center shadow-inner">
            <span className={`block text-[11px] text-amber-300/80 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'தேர்ந்தெடுக்கப்பட்ட எண்' : 'Selected Number'}
            </span>
            <span className="text-2xl font-mono font-extrabold text-amber-400 leading-tight">
              {selectedNumber}
            </span>
          </div>
        </div>
      </div>

      {/* 12 Large Selectable Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5 sm:gap-3">
        {ARUDAM_MAPPINGS.map(mapping => {
          const isSelected = selectedNumber === mapping.number;
          const sign = getSignById(mapping.arudaSignId);

          return (
            <button
              key={mapping.number}
              type="button"
              onClick={() => onSelectNumber(mapping.number)}
              aria-label={`Select number ${mapping.number} - ${sign.nameEn}`}
              aria-pressed={isSelected}
              className={`group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 cursor-pointer min-h-[92px] ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-cosmic-950 shadow-glow-gold scale-105 z-10 font-bold ring-2 ring-amber-300'
                  : 'bg-cosmic-850/80 hover:bg-cosmic-800 text-slate-300 border border-slate-700/60 hover:border-amber-500/40 hover:scale-[1.02]'
              }`}
            >
              {/* Active Ping badge */}
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                </span>
              )}

              {/* Number */}
              <span className={`text-2xl font-mono font-extrabold ${isSelected ? 'text-cosmic-950' : 'text-amber-400'}`}>
                {mapping.number}
              </span>

              {/* Zodiac Symbol */}
              <span className={`text-base my-0.5 ${isSelected ? 'text-cosmic-900' : 'text-slate-400'}`}>
                {sign.symbol}
              </span>

              {/* Sign Name */}
              <span className={`text-[11px] truncate max-w-full font-medium ${isSelected ? 'text-cosmic-950 font-bold' : 'text-slate-300'} ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? sign.nameTa.split(' ')[0] : sign.nameEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Button: Calculate Arudam (Phase 2 Requirement) */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            {isTamil ? 'தேர்வு:' : 'Active selection:'}
          </span>{' '}
          <span className="text-amber-300 font-mono font-bold">#{selectedNumber}</span> →{' '}
          <span className="text-indigo-300 font-semibold">
            {isTamil ? getSignById(selectedNumber).nameTa : getSignById(selectedNumber).nameEn}
          </span>
        </div>

        <button
          type="button"
          onClick={onCalculateArudam}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-cosmic-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
        >
          <span>☸</span>
          <span className={isTamil ? 'font-tamil' : ''}>
            {isTamil ? 'ஆருடம் கணிக்கவும்' : 'Calculate Arudam'}
          </span>
        </button>
      </div>
    </section>
  );
};
