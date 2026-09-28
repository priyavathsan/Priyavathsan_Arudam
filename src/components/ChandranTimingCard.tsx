import React, { useState } from 'react';
import { ChandranFindingTimeResult } from '../arudam/chandranTimingRules';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Clock, ChevronDown, ChevronUp, Compass, AlertCircle, Sparkles, Orbit, CheckCircle2 } from 'lucide-react';

interface ChandranTimingCardProps {
  timingResult: ChandranFindingTimeResult;
}

export const ChandranTimingCard: React.FC<ChandranTimingCardProps> = ({ timingResult }) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // State for toggling "[Why this time?]" / "[இந்த காலக் கணிப்பு ஏன்?]"
  const [isWhyOpen, setIsWhyOpen] = useState<boolean>(false);

  const {
    isApplicable,
    hasReliableData,
    unreliableDataReasonEn,
    unreliableDataReasonTa,
    questionEn,
    questionTa,
    resolutionEn,
    resolutionTa,
    timeOfFindingEn,
    timeOfFindingTa,
    timeCategoryEn,
    timeCategoryTa,
    moonBasisEn,
    moonBasisTa,
    status,
    ruleId,
    astronomicalTransition,
    traditionalTransitionInterpretationEn,
    traditionalTransitionInterpretationTa,
    matchedTimingRules,
    isConflict,
    accuracyDistinction,
    whyThisTime,
    contextData
  } = timingResult;

  // Category badge colors
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Immediate':
      case 'Soon':
        return 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300';
      case 'Moderate Delay':
        return 'bg-amber-950/80 border-amber-500/60 text-amber-300';
      case 'Long Delay':
        return 'bg-indigo-950/80 border-indigo-500/60 text-indigo-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  // Border & glow based on resolution status
  const getCardBorderClass = () => {
    if (!hasReliableData) return 'border-amber-700/60';
    if (!isApplicable || status === 'not_fulfilled') return 'border-slate-700/80';
    if (status === 'delayed') return 'border-amber-500/60 shadow-amber-950/30';
    return 'border-cyan-500/50 shadow-cyan-950/30';
  };

  return (
    <section
      className={`bg-cosmic-900/90 border-2 ${getCardBorderClass()} rounded-2xl p-5 sm:p-7 mb-6 shadow-2xl backdrop-blur-sm relative overflow-hidden`}
      aria-label={isTamil ? 'சந்திரன் மூலம் கிடைக்கும் காலம்' : 'Chandran-Based Finding Time'}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'படி 6: சந்திரன் காலக் கணிப்பு' : 'Step 6: Chandran Timing Engine'}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-serif font-bold text-amber-300 flex items-center gap-2.5 ${isTamil ? 'font-tamil' : ''}`}>
            <Moon className="w-7 h-7 text-cyan-300 fill-cyan-400/20" />
            <span>
              {isTamil ? '🌙 சந்திரன் மூலம் கிடைக்கும் காலம்' : '🌙 Chandran-Based Finding Time'}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isTamil ? 'நிரயண சஞ்சாரம்' : 'Sidereal Moon'}</span>
          </span>
        </div>
      </div>

      {/* Case A: Missing or Unreliable Astronomical Data (§2) */}
      {!hasReliableData ? (
        <div className="my-6 p-5 bg-rose-950/40 border border-rose-600/50 rounded-xl text-rose-200 text-sm">
          <div className="flex items-center gap-2 font-bold text-rose-300 mb-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>
              {isTamil
                ? 'கிடைக்கப்பெற்ற வானியல் தரவுகளின்படி சந்திரன் அடிப்படையிலான காலக் கணிப்பை துல்லியமாக செய்ய இயலவில்லை.'
                : 'Chandran-based timing cannot be calculated reliably with the available astronomical data.'}
            </span>
          </div>
          <p className="text-xs text-rose-300/80">
            {isTamil ? unreliableDataReasonTa : unreliableDataReasonEn}
          </p>
        </div>
      ) : (
        <>
          {/* Context Astronomical Parameters Grid (§15) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-5 text-xs">
            <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">
                {isTamil ? 'சந்திரன் ராசி:' : 'Moon Rasi:'}
              </span>
              <span className="font-bold text-cyan-300 text-sm block">
                {isTamil ? contextData.moonRasiTa : contextData.moonRasiEn}
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {contextData.moonDegreeFormatted}
              </span>
            </div>

            <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">
                {isTamil ? 'நட்சத்திரம்:' : 'Nakshatra:'}
              </span>
              <span className="font-bold text-slate-200 text-sm block">
                {isTamil ? contextData.moonNakshatraTa : contextData.moonNakshatraEn}
              </span>
              <span className="text-[10px] text-slate-400">
                {isTamil ? whyThisTime.chandranNakshatraTa : whyThisTime.chandranNakshatraEn}
              </span>
            </div>

            <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">
                {isTamil ? 'பாதம்:' : 'Pada:'}
              </span>
              <span className="font-bold text-amber-300 text-sm block">
                {contextData.moonPada}
              </span>
              <span className="text-[9px] text-slate-500 block truncate" title={isTamil ? whyThisTime.padaNoteTa : whyThisTime.padaNoteEn}>
                {isTamil ? 'தகவல் மட்டுமே' : 'Informational only'}
              </span>
            </div>

            <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-1">
                {isTamil ? 'ஆருடத்திலிருந்து சந்திரன்:' : 'Moon from Aruda:'}
              </span>
              <span className="font-bold text-indigo-300 text-sm block">
                {contextData.moonHouseFromAruda} {isTamil ? 'ஆம் இடம்' : 'House'}
              </span>
              <span className="text-[10px] text-slate-500">
                {isTamil ? `${whyThisTime.arudaLagnaTa} முதல்` : `From ${whyThisTime.arudaLagnaEn}`}
              </span>
            </div>

            <div className="bg-cosmic-950/80 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px] mb-1">
                {isTamil ? '6-ஆம் ராசியிலிருந்து சந்திரன்:' : 'Moon from 6th Rasi:'}
              </span>
              <span className="font-bold text-emerald-300 text-sm block">
                {contextData.moonHouseFromSixthRasi} {isTamil ? 'ஆம் இடம்' : 'House'}
              </span>
              <span className="text-[10px] text-slate-500">
                {isTamil ? `${whyThisTime.sixthRasiTa} முதல்` : `From ${whyThisTime.sixthRasiEn}`}
              </span>
            </div>
          </div>

          {/* Case B: Resolution is not_fulfilled (§9 Suppression) */}
          {status === 'not_fulfilled' ? (
            <div className="my-5 p-5 bg-slate-900/80 border border-slate-700/80 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    {isTamil ? 'கேள்வி:' : 'Question:'}
                  </span>
                  <p className="text-sm font-semibold text-slate-200">
                    {isTamil ? questionTa : questionEn}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    {isTamil ? 'முடிவு:' : 'Resolution:'}
                  </span>
                  <p className="text-sm font-semibold text-rose-300">
                    {isTamil ? resolutionTa : resolutionEn}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 my-4" />

              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  {isTamil ? 'கிடைக்கும் காலம்:' : 'Finding time:'}
                </span>
                <p className="text-sm italic text-slate-300 font-serif">
                  {isTamil ? timeOfFindingTa : timeOfFindingEn}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {isTamil ? moonBasisTa : moonBasisEn}
                </p>
              </div>
            </div>
          ) : (
            /* Case C: Fulfilled, Likely Fulfilled, Delayed, or Uncertain (§1, §10, §15) */
            <div className="my-5 bg-gradient-to-r from-cosmic-950 via-slate-900/90 to-cosmic-950 border border-cyan-500/30 rounded-xl p-5 sm:p-6 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    {isTamil ? 'கேள்வி:' : 'Question:'}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-100">
                    {isTamil ? questionTa : questionEn}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    {isTamil ? 'முடிவு:' : 'Resolution:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${status === 'delayed' ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <span className={`text-sm sm:text-base font-bold ${status === 'delayed' ? 'text-amber-300' : 'text-emerald-300'}`}>
                      {isTamil ? resolutionTa : resolutionEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clean separator as required by §15 */}
              <div className="border-t border-slate-800 my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Time of finding */}
                <div className="sm:col-span-2">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    {isTamil ? 'கிடைக்கும் காலம் (Estimated Finding Time):' : 'Estimated Finding Time:'}
                  </span>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                    {isTamil ? timeOfFindingTa : timeOfFindingEn}
                  </p>
                </div>

                {/* Time Category badge */}
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    {isTamil ? 'கால வகை:' : 'Time Category:'}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-bold ${getCategoryBadgeClass(timeCategoryEn)}`}>
                    {isTamil ? timeCategoryTa : timeCategoryEn}
                  </span>
                </div>
              </div>

              {/* Rule identification */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Rule:</span>
                  <span className="font-mono px-2.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold">
                    {ruleId}
                  </span>
                </div>

                <div className="text-slate-400 text-xs flex-1 sm:text-right">
                  <span>{isTamil ? moonBasisTa : moonBasisEn}</span>
                </div>
              </div>

              {/* Conflict notice if applicable (§13) */}
              {isConflict && (
                <div className="mt-3 p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isTamil
                      ? 'மாறுபட்ட அறிகுறிகள் உள்ளதால் துல்லியமான காலத்தை குறுக்க முடியவில்லை.'
                      : 'Mixed indications — exact finding period cannot be narrowed reliably.'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Astronomical Moon Transition Trigger (§6) */}
          {astronomicalTransition && (
            <div className="my-5 bg-cosmic-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>
                  {isTamil
                    ? 'சந்திரனின் நகர்வு மற்றும் பெயர்ச்சி காலத் தூண்டுதல் (Moon Ingress Trigger)'
                    : 'Chandran Astronomical Motion & Ingress Trigger'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Next Nakshatra Transition */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                  <span className="text-slate-400 block mb-1">
                    {isTamil ? 'அடுத்த நட்சத்திரப் பெயர்ச்சி:' : 'Next Nakshatra Transition:'}
                  </span>
                  <span className="font-semibold text-slate-100 block">
                    {isTamil ? astronomicalTransition.nextNakshatraNameTa : astronomicalTransition.nextNakshatraNameEn}
                  </span>
                  <span className="font-mono text-cyan-300 text-[11px] block mt-0.5">
                    {isTamil ? astronomicalTransition.nextNakshatraFormattedTa : astronomicalTransition.nextNakshatraFormattedEn}
                  </span>
                </div>

                {/* Next Rasi Transition */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                  <span className="text-slate-400 block mb-1">
                    {isTamil ? 'அடுத்த ராசிப் பெயர்ச்சி:' : 'Next Rasi Transition:'}
                  </span>
                  <span className="font-semibold text-slate-100 block">
                    {isTamil ? astronomicalTransition.nextRasiNameTa : astronomicalTransition.nextRasiNameEn}
                  </span>
                  <span className="font-mono text-amber-300 text-[11px] block mt-0.5">
                    {isTamil ? astronomicalTransition.nextRasiFormattedTa : astronomicalTransition.nextRasiFormattedEn}
                  </span>
                </div>
              </div>

              {traditionalTransitionInterpretationEn && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 font-semibold">
                      {isTamil ? 'பாரம்பரிய கால விளக்கம்: ' : 'Traditional timing interpretation: '}
                    </strong>
                    <span>
                      {isTamil
                        ? traditionalTransitionInterpretationTa
                        : traditionalTransitionInterpretationEn}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Three-Part Accuracy Rule Banner (§17) */}
          <div className="my-5 bg-cosmic-950/70 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
              {isTamil ? 'மூன்று அடுக்கு துல்லியப் பகுப்பாய்வு (Accuracy Framework):' : 'Three-Tier Accuracy Framework (§17):'}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">
                  A. {isTamil ? 'வானியல் உண்மை (Astronomical Fact)' : 'Astronomical Fact'}
                </span>
                <p className="text-slate-300 text-[11px]">
                  {isTamil ? accuracyDistinction.astronomicalFactTa : accuracyDistinction.astronomicalFactEn}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">
                  B. {isTamil ? 'பாரம்பரிய விதி (Traditional Rule)' : 'Traditional Arudam Rule'}
                </span>
                <p className="text-slate-300 text-[11px]">
                  {isTamil ? accuracyDistinction.traditionalRuleTa : accuracyDistinction.traditionalRuleEn}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">
                  C. {isTamil ? 'பலன் கணிப்பு (Prasna Prediction)' : 'Traditional Prediction'}
                </span>
                <p className="text-slate-300 text-[11px]">
                  {isTamil ? accuracyDistinction.predictionTa : accuracyDistinction.predictionEn}
                </p>
              </div>
            </div>
          </div>

          {/* Multiple Matched Rules (§13) */}
          {matchedTimingRules.length > 0 && (
            <div className="my-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-2">
                {isTamil ? 'பொருந்திய சந்திரன் கால விதிகள் (Matched Timing Rules):' : 'Matched Chandran Timing Rules (§13):'}
              </span>
              <div className="flex flex-wrap gap-2">
                {matchedTimingRules.map((r) => (
                  <div
                    key={r.ruleId}
                    className="bg-cosmic-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2"
                    title={isTamil ? r.explanationTa : r.explanationEn}
                  >
                    <span className="font-mono text-cyan-400 font-semibold">{r.ruleId}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">
                      {isTamil ? r.titleTa : r.titleEn}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 font-semibold">
                      {isTamil ? r.resultTa : r.resultEn}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${r.strength === 'primary' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-400'}`}>
                      {r.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expandable "Why this time?" Explanation (§14) */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsWhyOpen(!isWhyOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-cosmic-950/80 hover:bg-cosmic-950 border border-slate-800 text-amber-300 text-sm font-semibold transition-all"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>
                  {isTamil ? '[இந்த காலக் கணிப்பு ஏன்?]' : '[Why this time?]'}
                </span>
              </span>
              {isWhyOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isWhyOpen && (
              <div className="mt-3 p-4 bg-cosmic-950 border border-slate-800 rounded-xl text-xs space-y-2 text-slate-300 font-mono">
                <p className="font-bold text-amber-400 mb-2">
                  {isTamil ? 'இந்த காலக் கணிப்பின் அடிப்படை:' : 'Basis of this timing:'}
                </p>
                <ul className="space-y-1.5 pl-2 list-none">
                  <li>• {isTamil ? `ஆருட லக்னம் = ${whyThisTime.arudaLagnaTa}` : `Aruda Lagnam = ${whyThisTime.arudaLagnaEn}`}</li>
                  <li>• {isTamil ? `6-ஆம் ராசி = ${whyThisTime.sixthRasiTa}` : `6th Rasi = ${whyThisTime.sixthRasiEn}`}</li>
                  <li>• {isTamil ? `சந்திரன் = ${whyThisTime.chandranRasiTa}` : `Chandran = ${whyThisTime.chandranRasiEn}`}</li>
                  <li>• {isTamil ? `சந்திர நட்சத்திரம் = ${whyThisTime.chandranNakshatraTa}` : `Chandran Nakshatra = ${whyThisTime.chandranNakshatraEn}`}</li>
                  <li>• {isTamil ? `சந்திர பாதம் = பாதம் ${whyThisTime.chandranPada} (${whyThisTime.padaNoteTa})` : `Chandran Pada = Pada ${whyThisTime.chandranPada} (${whyThisTime.padaNoteEn})`}</li>
                  <li>• {isTamil ? `ஆருடத்திலிருந்து சந்திரன் = ${whyThisTime.moonFromAruda}-ஆம் இடம்` : `Moon from Aruda = ${whyThisTime.moonFromAruda}`}</li>
                  <li>• {isTamil ? `6-ஆம் ராசியிலிருந்து சந்திரன் = ${whyThisTime.moonFromSixthRasi}-ஆம் இடம்` : `Moon from 6th Rasi = ${whyThisTime.moonFromSixthRasi}`}</li>
                  <li>• {isTamil ? `பொருந்திய கால விதி = ${whyThisTime.matchingRuleId}` : `Matching timing rule = ${whyThisTime.matchingRuleId}`}</li>
                  <li>• {isTamil ? `பாரம்பரிய கால அலகு = ${whyThisTime.traditionalTimeUnitTa}` : `Traditional time unit = ${whyThisTime.traditionalTimeUnit}`}</li>
                  <li>• {isTamil ? `முடிவு = ${whyThisTime.resultRangeTa}` : `Result = ${whyThisTime.resultRangeEn}`}</li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};
