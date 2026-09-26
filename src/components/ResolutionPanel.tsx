// Phase 53 — Arudam Resolution / Fulfilment Panel
// Dedicated UI component for displaying the resolution outcome
// Separated from location/direction per §53.9

import React from 'react';
import { PrasnaResolution } from '../arudam/resolutionEngine';
import { ResolutionStatus } from '../arudam/resolutionRules';
import { useLanguage } from '../context/LanguageContext';

interface ResolutionPanelProps {
  resolution: PrasnaResolution;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status visual config
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ResolutionStatus,
  { icon: string; border: string; bg: string; textColor: string; badge: string }
> = {
  fulfilled: {
    icon: '✅',
    border: 'border-emerald-500/60',
    bg: 'from-emerald-950/40 via-cosmic-950 to-cosmic-950',
    textColor: 'text-emerald-300',
    badge: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
  },
  likely_fulfilled: {
    icon: '✓',
    border: 'border-teal-500/60',
    bg: 'from-teal-950/40 via-cosmic-950 to-cosmic-950',
    textColor: 'text-teal-300',
    badge: 'bg-teal-950/80 border-teal-500/60 text-teal-300'
  },
  delayed: {
    icon: '⏳',
    border: 'border-amber-500/60',
    bg: 'from-amber-950/40 via-cosmic-950 to-cosmic-950',
    textColor: 'text-amber-300',
    badge: 'bg-amber-950/80 border-amber-500/60 text-amber-300'
  },
  uncertain: {
    icon: '⚖️',
    border: 'border-slate-500/60',
    bg: 'from-slate-900/40 via-cosmic-950 to-cosmic-950',
    textColor: 'text-slate-300',
    badge: 'bg-slate-800/80 border-slate-500/60 text-slate-300'
  },
  not_fulfilled: {
    icon: '⚠️',
    border: 'border-rose-500/60',
    bg: 'from-rose-950/40 via-cosmic-950 to-cosmic-950',
    textColor: 'text-rose-300',
    badge: 'bg-rose-950/80 border-rose-500/60 text-rose-300'
  }
};

export const ResolutionPanel: React.FC<ResolutionPanelProps> = ({ resolution }) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const config = STATUS_CONFIG[resolution.resolutionStatus];

  return (
    <section
      className={`border-2 ${config.border} rounded-2xl p-5 sm:p-7 mb-6 shadow-2xl backdrop-blur-sm relative overflow-hidden bg-cosmic-900/90`}
      aria-label={isTamil ? 'ஆருட நோக்கம் மற்றும் தீர்வு' : 'Arudam Resolution / Fulfilment'}
    >
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'படி 6 & 7: ஆருட நோக்கம் / தீர்வு' : 'Step 6 & 7: Prasna Purpose / Resolution'}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${config.textColor} flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
            <span>⚖️</span>
            <span>
              {isTamil
                ? 'ஆருட நோக்கம் / தீர்வு'
                : 'ARUDAM RESOLUTION / FULFILMENT'}
            </span>
          </h2>
        </div>
      </div>

      {/* Main Result Card (§53.17) */}
      <div className={`mt-6 bg-gradient-to-r ${config.bg} border ${config.border} rounded-xl p-5 sm:p-6`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Question */}
          <div>
            <span className={`text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'கேள்வி' : 'Question'}
            </span>
            <p className={`text-base font-semibold text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil
                ? resolution.purpose.questionTamil
                : resolution.purpose.questionEnglish}
            </p>
          </div>

          {/* Purpose */}
          <div>
            <span className={`text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'நோக்கம்' : 'Purpose'}
            </span>
            <p className={`text-base font-semibold text-slate-200 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil
                ? resolution.purpose.purposeTamil
                : resolution.purpose.purposeEnglish}
            </p>
          </div>

          {/* Resolution status */}
          <div>
            <span className={`text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'தீர்வு நிலை' : 'Resolution Status'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.icon}</span>
              <span className={`text-sm font-bold ${config.textColor} ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil
                  ? resolution.resolutionStatusLabelTa
                  : resolution.resolutionStatusLabelEn}
              </span>
            </div>
          </div>

          {/* Timing */}
          <div>
            <span className={`text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'கால சுட்டு' : 'Timing Indication'}
            </span>
            <span className={`text-sm font-semibold text-amber-300 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil
                ? resolution.timingLabelTa
                : resolution.timingLabelEn}
            </span>
          </div>
        </div>
      </div>

      {/* No-conclusion state (§53.18) */}
      {resolution.isNoConclusion && (
        <div className="mt-4 p-4 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-slate-400 italic">
          <span className={`block font-semibold text-slate-300 mb-1 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil
              ? 'தீர்வு குறித்து போதுமான விதிச் சுட்டுகள் இல்லை'
              : 'No Configured Resolution Rule'}
          </span>
          <span className={`${isTamil ? 'font-tamil' : ''}`}>
            {isTamil
              ? resolution.noConclusionReasonTa
              : resolution.noConclusionReasonEn}
          </span>
        </div>
      )}

      {/* Full explanation */}
      {!resolution.isNoConclusion && (
        <div className="mt-5 space-y-3">
          <span className={`text-xs uppercase tracking-wider text-slate-400 font-bold block ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? 'ஆருட தீர்வு விளக்கம்' : 'Resolution Explanation'}
          </span>
          <div className={`bg-cosmic-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-line ${isTamil ? 'font-tamil' : 'font-serif'}`}>
            {isTamil ? resolution.explanationTa : resolution.explanationEn}
          </div>
        </div>
      )}

      {/* Rule trace — supporting vs counter rules (§53.14) */}
      {(resolution.supportingRules.length > 0 || resolution.counterRules.length > 0) && (
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
            {isTamil ? 'தீர்வு விதி சுவடு' : 'Resolution Rule Trace'}
          </span>

          {/* Supporting rules */}
          {resolution.supportingRules.length > 0 && (
            <div>
              <span className={`text-xs text-emerald-400 font-semibold block mb-1.5 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? '✓ சாதகமான விதிகள்' : '✓ Supporting Rules'}
              </span>
              <div className="flex flex-wrap gap-2">
                {resolution.supportingRules.map(r => (
                  <div
                    key={r.id}
                    className="bg-emerald-950/60 border border-emerald-700/40 rounded-lg px-3 py-1.5 text-xs"
                    title={isTamil ? r.explanationTa : r.explanationEn}
                  >
                    <span className="font-mono text-emerald-400 font-semibold">{r.id}</span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span className={`text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
                      {isTamil ? r.titleTa : r.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Counter / negative rules */}
          {resolution.counterRules.length > 0 && (
            <div>
              <span className={`text-xs text-rose-400 font-semibold block mb-1.5 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? '⚠ எதிர்மறை விதிகள்' : '⚠ Counter Indications'}
              </span>
              <div className="flex flex-wrap gap-2">
                {resolution.counterRules.map(r => (
                  <div
                    key={r.id}
                    className="bg-rose-950/60 border border-rose-700/40 rounded-lg px-3 py-1.5 text-xs"
                    title={isTamil ? r.explanationTa : r.explanationEn}
                  >
                    <span className="font-mono text-rose-400 font-semibold">{r.id}</span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span className={`text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
                      {isTamil ? r.titleTa : r.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
