import React, { useState } from 'react';
import { FullPredictionResult } from '../arudam/predictionEngine';
import { useLanguage } from '../context/LanguageContext';

export interface PredictionPanelProps {
  prediction: FullPredictionResult;
  onPrint?: () => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  prediction,
  onPrint
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Category breakdown tab (lost_object, missing_person, sakunam, general)
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(
    prediction.primaryQuestion.category || 'lost_object'
  );

  const {
    primaryQuestion,
    lostObjectAnalysis,
    missingPersonAnalysis,
    sakunamAnalysis,
    matchedRules
  } = prediction;

  return (
    <section className="bg-cosmic-900/90 border-2 border-amber-500/50 rounded-2xl p-5 sm:p-7 mb-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
      {/* Decorative top badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'படி 5: பிரதான ஆருட பலன்' : 'Step 5: Master Arudam Prediction'}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-serif font-bold text-amber-300 flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
            <span>☸</span>
            <span>{isTamil ? 'ஆருட பலன்' : 'ARUDAM PREDICTION'}</span>
          </h2>
        </div>

        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span className={isTamil ? 'font-tamil' : ''}>
              {isTamil ? 'பலனை அச்சிடுக' : 'Print Prediction'}
            </span>
          </button>
        )}
      </div>

      {/* Structured Sections (Phase 26 Requirement) */}
      <div className="space-y-5 my-6">
        {/* 1. Likely Prasna */}
        <div className="bg-cosmic-950/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
            {isTamil ? '1. கேள்வியின் சாத்தியமான தன்மை (Likely Prasna)' : '1. Likely Prasna Inquiry'}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-lg sm:text-xl font-bold text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? primaryQuestion.categoryNameTa : primaryQuestion.categoryNameEn}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-semibold ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? primaryQuestion.strengthLabelTa : primaryQuestion.strengthLabelEn}
            </span>
          </div>
          <p className={`text-xs text-slate-300 mt-2 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? primaryQuestion.explanationTamil : primaryQuestion.explanationEnglish}
          </p>
        </div>

        {/* 2. Astrological Indication */}
        <div className="bg-cosmic-950/80 border border-slate-800 rounded-xl p-4">
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block mb-1">
            {isTamil ? '2. ஜோதிட சுட்டு (Astrological Indication)' : '2. Astrological Indication'}
          </span>
          <p className={`text-xs sm:text-sm text-slate-200 leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? prediction.astrologicalIndicationTa : prediction.astrologicalIndicationEn}
          </p>
        </div>

        {/* 3. Prediction */}
        <div className="bg-gradient-to-r from-amber-950/40 via-cosmic-950 to-cosmic-950 border-l-4 border-amber-400 rounded-r-xl p-4 sm:p-5">
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-1.5">
            {isTamil ? '3. ஆருட பலன் (Prediction)' : '3. Synthesized Prediction'}
          </span>
          <p className={`text-sm sm:text-base font-serif text-amber-100 leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? prediction.predictionTa : prediction.predictionEn}
          </p>
        </div>
      </div>

      {/* Category Specific Interpretation Tabs (Phases 16, 17, 18, 19) */}
      <div className="mt-7 pt-6 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className={`text-base font-bold text-slate-200 font-serif ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? 'விரிவான தலைப்பு வாரியான ஆருட விளக்கம்:' : 'Detailed Category-Specific Interpretations:'}
          </h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-cosmic-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCategoryTab('lost_object')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                activeCategoryTab === 'lost_object'
                  ? 'bg-amber-500 text-cosmic-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              } ${isTamil ? 'font-tamil' : ''}`}
            >
              {isTamil ? 'காணாமல் போன பொருள்' : 'Lost Object'}
            </button>
            <button
              onClick={() => setActiveCategoryTab('missing_person')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                activeCategoryTab === 'missing_person'
                  ? 'bg-amber-500 text-cosmic-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              } ${isTamil ? 'font-tamil' : ''}`}
            >
              {isTamil ? 'காணாமல் போன நபர்' : 'Missing Person'}
            </button>
            <button
              onClick={() => setActiveCategoryTab('sakunam')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                activeCategoryTab === 'sakunam'
                  ? 'bg-amber-500 text-cosmic-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              } ${isTamil ? 'font-tamil' : ''}`}
            >
              {isTamil ? 'சகுனம் / நிமித்தம்' : 'Sakunam / Omen'}
            </button>
          </div>
        </div>

        {/* Tab 1: Lost Object Analysis (Phase 16 & 54) */}
        {activeCategoryTab === 'lost_object' && (
          <div className="bg-cosmic-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <h4 className={`text-sm font-bold text-amber-300 mb-3 pb-2 border-b border-slate-800 flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
              <span>🔍</span>
              <span>{isTamil ? 'காணாமல் போன பொருள் — ஆருட விளக்கம்' : 'Lost Object — Arudam Interpretation'}</span>
            </h4>

            {/* §16 Structured Lost Object Prediction Summary Box */}
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-cosmic-950 to-cosmic-950 border border-amber-500/40">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
                {isTamil ? 'காணாமல் போன பொருள் சுருக்க அறிக்கை (§16):' : 'Lost Object Recovery Summary (§16):'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{isTamil ? 'கிடைக்குமா?' : 'Will it be found?'}</span>
                  <span className={`font-bold text-sm ${prediction.prasnaResolution.resolutionStatus === 'not_fulfilled' ? 'text-rose-400' : prediction.prasnaResolution.resolutionStatus === 'delayed' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isTamil
                      ? (prediction.prasnaResolution.resolutionStatus === 'not_fulfilled' ? 'தெளிவான அறிகுறி இல்லை' : prediction.prasnaResolution.resolutionStatus === 'delayed' ? 'தாமதம்' : 'ஆம் (வாய்ப்பு உள்ளது)')
                      : (prediction.prasnaResolution.resolutionStatus === 'not_fulfilled' ? 'No clear indication' : prediction.prasnaResolution.resolutionStatus === 'delayed' ? 'Delayed' : 'Yes (Likely)')}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{isTamil ? 'எப்போது கிடைக்கும்?' : 'When will it be found?'}</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {isTamil ? prediction.chandranFindingTime.timeOfFindingTa : prediction.chandranFindingTime.timeOfFindingEn}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{isTamil ? 'எந்த திசை?' : 'Which direction?'}</span>
                  <span className="font-bold text-cyan-300 text-sm">
                    {isTamil ? lostObjectAnalysis.directionTa : lostObjectAnalysis.directionEn}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{isTamil ? 'எங்கு தேட வேண்டும்?' : 'Where to search?'}</span>
                  <span className="font-bold text-slate-200 text-sm">
                    {isTamil ? lostObjectAnalysis.natureOfLocationTa : lostObjectAnalysis.natureOfLocationEn}
                  </span>
                </div>
              </div>
              <div className="mt-2.5 text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5">
                <span className="text-amber-400 font-semibold">{isTamil ? 'முக்கிய காரணம்:' : 'Primary Reason:'}</span>
                <span>
                  {isTamil
                    ? `${prediction.chandranFindingTime.moonBasisTa} | ${prediction.sixthRasi.tamilNameOnly} (${prediction.sixthRasi.element} தத்துவம்)`
                    : `${prediction.chandranFindingTime.moonBasisEn} | ${prediction.sixthRasi.englishNameOnly} (${prediction.sixthRasi.element} element)`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'பொருளின் நிலை:' : 'Object status:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.objectStatusTa : lostObjectAnalysis.objectStatusEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'இருக்கும் இடத்தின் தன்மை:' : 'Nature of location:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.natureOfLocationTa : lostObjectAnalysis.natureOfLocationEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'அருகில் / தொலைவில்:' : 'Near / Far:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.nearOrFarTa : lostObjectAnalysis.nearOrFarEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'உள்ளே / வெளியே:' : 'Inside / Outside:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.insideOrOutsideTa : lostObjectAnalysis.insideOrOutsideEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'உயரம் / கீழ்ப்பகுதி:' : 'Higher / Lower area:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.elevationTa : lostObjectAnalysis.elevationEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'பூட்டிய இடம்:' : 'Locked place:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.lockedStatusTa : lostObjectAnalysis.lockedStatusEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'மறைக்கப்பட்ட இடம்:' : 'Hidden place:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? lostObjectAnalysis.hiddenStatusTa : lostObjectAnalysis.hiddenStatusEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'திசை:' : 'Direction:'}</span>
                <span className="font-semibold text-amber-300">{isTamil ? lostObjectAnalysis.directionTa : lostObjectAnalysis.directionEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'மீட்பு சுட்டு:' : 'Recovery indication:'}</span>
                <span className="font-semibold text-emerald-300">{isTamil ? lostObjectAnalysis.recoveryIndicationTa : lostObjectAnalysis.recoveryIndicationEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? '🌙 சந்திரன் காலக் கணிப்பு:' : '🌙 Chandran Finding Time:'}</span>
                <span className="font-semibold text-amber-300 block">
                  {isTamil ? prediction.chandranFindingTime.timeOfFindingTa : prediction.chandranFindingTime.timeOfFindingEn}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  [{prediction.chandranFindingTime.ruleId}]
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Missing Person Analysis (Phase 17) */}
        {activeCategoryTab === 'missing_person' && (
          <div className="bg-cosmic-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <h4 className={`text-sm font-bold text-amber-300 mb-3 pb-2 border-b border-slate-800 flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
              <span>👤</span>
              <span>{isTamil ? 'காணாமல் போன நபர் — ஆருட விளக்கம்' : 'Missing Person — Arudam Interpretation'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'நபர் தொடர்பான சுட்டு:' : 'Person indication:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? missingPersonAnalysis.personIndicationTa : missingPersonAnalysis.personIndicationEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'அருகில் / தொலைவில்:' : 'Near / Far:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? missingPersonAnalysis.nearOrFarTa : missingPersonAnalysis.nearOrFarEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'சென்ற திசை:' : 'Direction:'}</span>
                <span className="font-semibold text-amber-300">{isTamil ? missingPersonAnalysis.directionTa : missingPersonAnalysis.directionEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'தொடர்பு / செய்தி சுட்டு:' : 'Communication indication:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? missingPersonAnalysis.communicationTa : missingPersonAnalysis.communicationEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'திரும்பி வருதல்:' : 'Return indication:'}</span>
                <span className="font-semibold text-emerald-300">{isTamil ? missingPersonAnalysis.returnIndicationTa : missingPersonAnalysis.returnIndicationEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'தாமதம்:' : 'Delay:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? missingPersonAnalysis.delayTa : missingPersonAnalysis.delayEn}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sakunam / Omen Analysis (Phase 18) */}
        {activeCategoryTab === 'sakunam' && (
          <div className="bg-cosmic-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <h4 className={`text-sm font-bold text-amber-300 mb-3 pb-2 border-b border-slate-800 flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
              <span>🦅</span>
              <span>{isTamil ? 'சகுனம் / நிமித்த ஆருடம்' : 'Sakunam / Omen Interpretation'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'நிகழ்வின் தன்மை:' : 'Nature:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? sakunamAnalysis.natureTa : sakunamAnalysis.natureEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'சுப / அசுப சுட்டு:' : 'Favorability indication:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? sakunamAnalysis.favorabilityTa : sakunamAnalysis.favorabilityEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'கேள்வியுடன் தொடர்பு:' : 'Connection with question:'}</span>
                <span className="font-semibold text-slate-200">{isTamil ? sakunamAnalysis.connectionTa : sakunamAnalysis.connectionEn}</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block mb-0.5">{isTamil ? 'அடுத்த கட்ட சுட்டு:' : 'Next-stage indication:'}</span>
                <span className="font-semibold text-emerald-300">{isTamil ? sakunamAnalysis.nextStageTa : sakunamAnalysis.nextStageEn}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supporting Rules (Phase 26 Requirement) */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-2">
          {isTamil ? 'ஆதரிக்கும் விதிகள் (Supporting Rules)' : 'Supporting Rules'}
        </span>
        <div className="flex flex-wrap gap-2">
          {matchedRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-cosmic-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2"
            >
              <span className="font-mono text-amber-400 font-semibold">{rule.id}</span>
              <span className="text-slate-400">•</span>
              <span className={`text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? rule.titleTa : rule.titleEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
