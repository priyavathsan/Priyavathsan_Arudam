import React, { useState } from 'react';
import { ArudamCalculationResult } from '../arudam/arudamCalculator';
import { SixthRasiCalculationResult } from '../arudam/sixthRasiCalculator';
import { useLanguage } from '../context/LanguageContext';

export interface ArudamResultProps {
  selectedNumber: number;
  arudaResult: ArudamCalculationResult;
  sixthResult: SixthRasiCalculationResult;
}

export const ArudamResult: React.FC<ArudamResultProps> = ({
  selectedNumber,
  arudaResult,
  sixthResult
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [showCalculationDetails, setShowCalculationDetails] = useState<boolean>(true);

  const { arudaRasi } = arudaResult;
  const { sixthRasi, sixthLord } = sixthResult;

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Top Banner: Aruda Lagna and 6th Rasi Result */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'படி 2: லக்னம் மற்றும் 6-ஆம் ராசி நிர்ணயம்' : 'Step 2: Lagna & 6th Rasi Derivation'}
          </span>
          <h2 className={`text-xl sm:text-2xl font-serif font-bold text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? 'ஆருட லக்னம் & 6-ஆம் ராசி பலன்' : 'Aruda Lagnam & 6th Rasi Results'}
          </h2>
        </div>

        {/* Selected Number Pill */}
        <div className="flex items-center gap-2 bg-cosmic-950/80 border border-slate-700 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <span className="text-xs text-slate-400">
            {isTamil ? 'தேர்வு:' : 'Chosen Number:'}
          </span>
          <span className="text-base font-mono font-bold text-amber-400">
            #{selectedNumber}
          </span>
        </div>
      </div>

      {/* Main 2-Column Cards for Aruda Lagna and 6th Rasi (Phase 3 & 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        {/* Aruda Lagna Box */}
        <div className="bg-gradient-to-br from-indigo-950/80 to-cosmic-950 border-2 border-indigo-500/50 rounded-xl p-4 sm:p-5 relative shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/90 border border-indigo-500/30 px-2 py-0.5 rounded">
              {isTamil ? 'ஆருட லக்னம்' : 'Aruda Lagna (1st)'}
            </span>
            <span className="text-2xl text-indigo-300">{arudaRasi.symbol}</span>
          </div>

          <div className="text-2xl sm:text-3xl font-serif font-bold text-indigo-100 mb-1">
            {isTamil ? arudaRasi.tamilNameOnly : arudaRasi.englishNameOnly}
          </div>

          {!isTamil && (
            <div className="text-sm font-tamil text-indigo-300/80 mb-2">
              {arudaRasi.tamilNameOnly}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-indigo-900/60 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block">{isTamil ? 'திசை:' : 'Direction:'}</span>
              <span className="font-semibold text-slate-200">{arudaRasi.direction}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTamil ? 'தத்துவம்:' : 'Element:'}</span>
              <span className="font-semibold text-slate-200">{arudaRasi.element}</span>
            </div>
          </div>
        </div>

        {/* 6th Rasi Box */}
        <div className="bg-gradient-to-br from-rose-950/80 to-cosmic-950 border-2 border-rose-500/50 rounded-xl p-4 sm:p-5 relative shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-rose-400 bg-rose-950/90 border border-rose-500/30 px-2 py-0.5 rounded">
              {isTamil ? '6ஆம் ராசி' : '6th Rasi from Aruda'}
            </span>
            <span className="text-2xl text-rose-300">{sixthRasi.symbol}</span>
          </div>

          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-100 mb-1">
            {isTamil ? sixthRasi.tamilNameOnly : sixthRasi.englishNameOnly}
          </div>

          {!isTamil && (
            <div className="text-sm font-tamil text-rose-300/80 mb-2">
              {sixthRasi.tamilNameOnly}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-rose-900/60 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block">{isTamil ? 'ராசி அதிபதி:' : 'Sign Lord:'}</span>
              <span className="font-semibold text-amber-300">
                {isTamil ? sixthLord.tamilOnly : sixthLord.englishOnly}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isTamil ? 'இடத்தின் தன்மை:' : 'Location Type:'}</span>
              <span className="font-semibold text-slate-200 truncate" title={sixthRasi.locationClue}>
                {sixthRasi.locationClue.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Step-by-Step Calculation Details (Phase 5 Requirement) */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-cosmic-950/70">
        <button
          type="button"
          onClick={() => setShowCalculationDetails(!showCalculationDetails)}
          className="w-full px-4 py-3 bg-slate-800/40 hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-400">🧮</span>
            <span className={`text-sm font-semibold text-slate-200 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'கணக்கீட்டு விவரம்' : 'Calculation Details'}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              ({isTamil ? 'படி படியாக எண்ணும் முறை' : 'Step-by-step counting sequence'})
            </span>
          </div>
          <span className="text-slate-400 text-xs">
            {showCalculationDetails ? '▲ சுருக்குக' : '▼ விரிவாக்குக'}
          </span>
        </button>

        {showCalculationDetails && (
          <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80">
            {/* Step 1: Aruda Counting */}
            <div className="bg-cosmic-900/60 border border-slate-800 p-3 rounded-lg">
              <span className="font-semibold text-indigo-300 block mb-1">
                {isTamil ? '1. மேஷம் முதல் ஆருட லக்னம் கணக்கீடு:' : '1. Aruda Lagnam counting from Mesham (1):'}
              </span>
              <p className="font-mono text-slate-300 leading-relaxed text-xs">
                {isTamil ? arudaResult.formulaExplanationTa : arudaResult.formulaExplanationEn}
              </p>
            </div>

            {/* Step 2: 6th Sign Counting */}
            <div className="bg-cosmic-900/60 border border-slate-800 p-3 rounded-lg">
              <span className="font-semibold text-rose-300 block mb-1">
                {isTamil ? '2. ஆருட லக்னம் முதல் 6-ஆம் ராசி கணக்கீடு:' : '2. 6th Rasi counting from Aruda Lagnam:'}
              </span>
              <p className="font-mono text-slate-300 leading-relaxed text-xs">
                {isTamil ? sixthResult.formulaExplanationTa : sixthResult.formulaExplanationEn}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
