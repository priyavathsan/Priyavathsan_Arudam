import React, { useState } from 'react';
import { RuleTraceStep } from '../arudam/predictionEngine';
import { ArudamRule } from '../arudam/arudamRules';
import { useLanguage } from '../context/LanguageContext';

export interface RuleTraceProps {
  steps: RuleTraceStep[];
  matchedRules: ArudamRule[];
}

export const RuleTrace: React.FC<RuleTraceProps> = ({
  steps,
  matchedRules
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Header with Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'கணித தர்க்கம் & விதி விளக்கம்' : 'Mathematical Trace & Rule Audit'}
          </span>
          <h2 className={`text-xl sm:text-2xl font-serif font-bold text-slate-100 flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
            <span>🔍</span>
            <span>{isTamil ? 'இந்த பலன் ஏன்? (Why this prediction?)' : 'Why this prediction? (Rule Trace)'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isTamil
              ? 'உள்ளீடு முதல் இறுதி பலன் வரை ஒவ்வொரு நிலையின் ஜோதிட தர்க்கம் மற்றும் பயன்படுத்தப்பட்ட விதிகள்'
              : 'Complete audit trail from initial input to final judgment showing every astrological rule applied'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-cosmic-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          {isOpen
            ? (isTamil ? '▲ தர்க்கத்தை சுருக்குக' : '▲ Collapse Trace')
            : (isTamil ? '▼ தர்க்கத்தை காண்க' : '▼ Expand Trace')}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* Visual Step-by-Step Flowchart Pipeline */}
          <div className="relative">
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-3.5 rounded-xl bg-cosmic-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  {/* Step Sequence Badge */}
                  <div className="flex items-center gap-2 sm:w-44 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {isTamil ? step.stageTa : step.stage}
                    </span>
                  </div>

                  {/* Step Value & Detail */}
                  <div className="flex-1">
                    <div className="text-sm font-bold text-amber-300 mb-0.5">
                      {isTamil ? step.valueTa : step.value}
                    </div>
                    <div className={`text-xs text-slate-300 leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>
                      {isTamil ? step.detailTa : step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Matched Rules Cards */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className={`text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'செயல்படுத்தப்பட்ட பாரம்பரிய விதிகள்:' : 'Activated Traditional Rules:'}
            </h4>

            <div className="space-y-3">
              {matchedRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-xl bg-cosmic-950/90 border border-slate-800 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                        {rule.id}
                      </span>
                      <span className={`text-xs sm:text-sm font-bold text-slate-200 ${isTamil ? 'font-tamil' : ''}`}>
                        {isTamil ? rule.titleTa : rule.titleEn}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {rule.category}
                    </span>
                  </div>

                  <p className={`text-xs text-slate-300 leading-relaxed mb-2 ${isTamil ? 'font-tamil' : ''}`}>
                    {isTamil ? rule.predictionTa : rule.predictionEn}
                  </p>

                  <div className={`text-[11px] text-slate-400 italic bg-slate-900/50 p-2 rounded border border-slate-800/80 ${isTamil ? 'font-tamil' : ''}`}>
                    <strong className="text-slate-300 not-italic font-sans">
                      {isTamil ? 'விளக்கம்: ' : 'Rationale: '}
                    </strong>
                    {isTamil ? rule.explanationTa : rule.explanationEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
