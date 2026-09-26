import React, { useState } from 'react';
import { getActivePanchangamProvider } from '../kochara/panchangamProvider';
import { TransitCalculationResult } from '../kochara/transitCalculator';
import { FullPredictionResult } from '../arudam/predictionEngine';
import { useLanguage } from '../context/LanguageContext';

export interface CalculationInfoPanelProps {
  transitResult: TransitCalculationResult;
  prediction: FullPredictionResult;
}

export const CalculationInfoPanel: React.FC<CalculationInfoPanelProps> = ({
  transitResult,
  prediction
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);

  const provider = getActivePanchangamProvider();

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-left group"
        >
          <span className="text-amber-400 text-sm">ℹ️</span>
          <div>
            <h3 className={`text-sm sm:text-base font-bold text-slate-200 group-hover:text-amber-300 transition-colors ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'கணக்கீட்டு தகவல் (Calculation Information)' : 'Calculation Information & Ephemeris'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isTamil
                ? 'நிரயண முறை • லாஹிரி அயனாம்சம் • பஞ்சாங்க வழிமுறை'
                : 'Sidereal Zodiac • Lahiri Ayanamsa • Ephemeris Source'}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Debug toggle */}
          <button
            type="button"
            onClick={() => setIsDebugOpen(!isDebugOpen)}
            className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
            title="Toggle Developer State View"
          >
            {isDebugOpen ? 'DEBUG: ON' : 'DEBUG: OFF'}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-2 space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-cosmic-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">
                {isTamil ? 'ராசி மண்டலம்:' : 'Zodiac System:'}
              </span>
              <span className="font-semibold text-slate-200">
                {provider.zodiac}
              </span>
            </div>

            <div className="p-3 bg-cosmic-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">
                {isTamil ? 'அயனாம்சம்:' : 'Ayanamsa:'}
              </span>
              <span className="font-semibold text-emerald-300 font-mono">
                {transitResult.ayanamsaFormatted}
              </span>
            </div>

            <div className="p-3 bg-cosmic-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">
                {isTamil ? 'கணித மூலம்:' : 'Ephemeris Source:'}
              </span>
              <span className="font-semibold text-indigo-300 truncate block" title={provider.ephemerisSourceEn}>
                {isTamil ? provider.ephemerisSourceTa : provider.ephemerisSourceEn}
              </span>
            </div>

            <div className="p-3 bg-cosmic-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">
                {isTamil ? 'கணிப்பு தேதி & நேரம்:' : 'Calculation Date & Time:'}
              </span>
              <span className="font-semibold text-slate-200">
                {transitResult.dateFormatted} at {transitResult.timeFormatted}
              </span>
            </div>

            <div className="p-3 bg-cosmic-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">
                {isTamil ? 'இட அமைப்பு:' : 'Location Basis:'}
              </span>
              <span className="font-semibold text-slate-200">
                Geocentric Sidereal (Tamil Nadu Standard)
              </span>
            </div>

            <div className="p-3 bg-cosmic-950/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">
                {isTamil ? 'ஆருட கணிப்பாளர்:' : 'Astrologer Attribution:'}
              </span>
              <span className="font-semibold text-amber-300">
                Priyavathsan Sridharan Iyengar
              </span>
            </div>
          </div>

          <div className="p-3 bg-cosmic-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-slate-300 block mb-0.5">
              {isTamil ? 'பஞ்சாங்க மரபு பற்றிய பாரம்பரிய குறிப்பு:' : 'Traditional Panchangam Notice:'}
            </strong>
            {isTamil ? provider.notesTa : provider.notesEn}
          </div>
        </div>
      )}

      {/* Admin / Developer Debug Panel (Phase 48) */}
      {isDebugOpen && (
        <div className="mt-4 p-4 bg-slate-950 border border-amber-500/30 rounded-xl font-mono text-[11px] text-slate-300 space-y-2 overflow-x-auto">
          <div className="text-amber-400 font-bold border-b border-slate-800 pb-1">
            === ARUDAM ENGINE INTERNAL STATE (DEBUG VIEW) ===
          </div>
          <div>Selected Number: {prediction.selectedNumber}</div>
          <div>Aruda Rasi ID: {prediction.arudaRasi.id} ({prediction.arudaRasi.englishNameOnly})</div>
          <div>6th Rasi ID: {prediction.sixthRasi.id} ({prediction.sixthRasi.englishNameOnly})</div>
          <div>6th Lord: {prediction.sixthLord.id} ({prediction.sixthLord.englishOnly})</div>
          <div>Primary Question: {prediction.primaryQuestion.category} [{prediction.primaryQuestion.strength}]</div>
          <div>Matched Rule IDs: {prediction.matchedRules.map(r => r.id).join(', ')}</div>
          <div>Transit Planets in 6th: {prediction.transitPlanetsInSixth.map(p => `${p.nameEn}@${p.degreeFormatted}`).join(', ') || 'None'}</div>
          <div>Ephemeris Provider: {provider.id}</div>
        </div>
      )}
    </section>
  );
};
