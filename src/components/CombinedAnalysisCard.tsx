import React from 'react';
import { Compass, CheckCircle, AlertTriangle, Printer, Copy, Check } from 'lucide-react';
import { CombinedInterpretationResult } from '../types/astrology';

interface CombinedAnalysisCardProps {
  result: CombinedInterpretationResult;
  onPrint: () => void;
}

export const CombinedAnalysisCard: React.FC<CombinedAnalysisCardProps> = ({
  result,
  onPrint
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.fullInterpretation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConsistencyBadge = (level: string) => {
    switch (level) {
      case 'Strong clue alignment':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {level}
          </span>
        );
      case 'Moderate clue alignment':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
            {level}
          </span>
        );
      case 'Single clue only':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700/60 text-slate-300 border border-slate-600">
            <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
            {level}
          </span>
        );
      case 'Mixed clues – investigate multiple locations':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            {level}
          </span>
        );
    }
  };

  const getDirectionConsistencyBadge = (consistency: string) => {
    switch (consistency) {
      case 'Strong':
        return <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">Strong</span>;
      case 'Moderate':
        return <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">Moderate</span>;
      case 'Weak':
        return <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 font-bold">Weak</span>;
      case 'Mixed':
      default:
        return <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">Mixed</span>;
    }
  };

  return (
    <section className="glass-panel-gold rounded-2xl p-5 sm:p-6 mb-6 border-2 border-amber-500/40 shadow-glow-gold relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-amber-500/20 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            Master Synthesis Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Traditional Combined Interpretation</span>
            <span className="font-tamil text-amber-300 text-base font-normal">/ ஒருங்கிணைந்த பலன்</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto no-print">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cosmic-900 hover:bg-cosmic-800 border border-slate-700 text-slate-200 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-cosmic-950 font-bold transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Grid of Unified Configuration Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-5 text-xs">
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Aruda Lagna</span>
          <span className="font-bold text-indigo-300 text-sm">{result.arudaSign.nameEn}</span>
        </div>
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">6th Sign</span>
          <span className="font-bold text-rose-300 text-sm">{result.sixthSign.nameEn}</span>
        </div>
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Target House</span>
          <span className="font-bold text-amber-300 text-sm">{result.missingHouse?.number}th House</span>
        </div>
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Sign Clue</span>
          <span className="font-bold text-cyan-300 text-sm">{result.missingSign?.nameEn}</span>
        </div>
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Significator</span>
          <span className="font-bold text-emerald-300 text-sm">{result.missingPlanet?.nameEn}</span>
        </div>
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Transit Planet</span>
          <span className="font-bold text-amber-200 text-sm">{result.transitPlanet?.nameEn}</span>
        </div>
        <div className="bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Transit House</span>
          <span className="font-bold text-purple-300 text-sm">{result.transitHouse?.number}th House</span>
        </div>
      </div>

      {/* Consistency & Direction Indicator Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Direction Engine */}
        <div className="bg-cosmic-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-300">
                Direction Engine: <strong className="text-emerald-300">{result.primaryDirection}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Consistency:</span>
                {getDirectionConsistencyBadge(result.directionConsistency)}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {result.directionConsistency === 'Mixed'
                ? 'Direction clues are mixed. Use the house/planet/location clues rather than relying on direction alone.'
                : `Indications converge towards the ${result.primaryDirection}. Prioritize search efforts in this sector of the room or property.`}
            </p>
          </div>
        </div>

        {/* Traditional Clue Consistency */}
        <div className="bg-cosmic-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-300">
                Traditional Clue Alignment
              </span>
              {getConsistencyBadge(result.clueConsistency)}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculated based on multi-parameter agreement between house placement, elemental sign axis, and planetary karakatvas.
            </p>
          </div>
        </div>
      </div>

      {/* Main Text Area with Exact Traditional Phrasing */}
      <div className="bg-cosmic-950/90 rounded-xl p-5 border border-amber-500/30">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
          Synthesized Traditional Interpretation / பாரம்பரிய வழிகாட்டல்
        </h3>
        
        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-serif whitespace-pre-line">
          {result.fullInterpretation}
        </p>

        {result.moonImmediateClue && (
          <div className="mt-4 p-3 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-xs sm:text-sm text-cyan-200 flex items-center gap-2">
            <span className="font-bold text-cyan-300">Immediate Moon Guidance:</span>
            <span>"{result.moonImmediateClue}"</span>
          </div>
        )}

        {result.longTermTransitClue && (
          <div className="mt-2.5 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200/90">
            <span className="font-semibold text-amber-300">{result.longTermTransitClue}</span>
          </div>
        )}
      </div>

      {/* Actionable Clue Breakdown */}
      <div className="mt-4 pt-3 border-t border-amber-500/20">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 block mb-2">
          Systematic Search Location Checklist:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {result.locationSuggestions.map((sug, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-cosmic-900/60 border border-slate-800 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{sug}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
