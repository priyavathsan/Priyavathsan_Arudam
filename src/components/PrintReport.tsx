import React from 'react';
import { RasiRuleData } from '../astrology/rasi';
import { EnhancedPlanetInfo } from '../astrology/planets';
import { TransitPlanetInfo } from '../kochara/transitCalculator';
import { FullPredictionResult } from '../arudam/predictionEngine';

interface PrintReportProps {
  selectedNumber: number;
  arudaRasi: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  transitPlanets: TransitPlanetInfo[];
  prediction: FullPredictionResult;
  objectName?: string;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  selectedNumber,
  arudaRasi,
  sixthRasi,
  sixthLord,
  transitPlanets,
  prediction,
  objectName
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="hidden print:block print:p-6 print:bg-white print:text-black font-sans leading-relaxed">
      {/* Print Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-slate-900">
            ஆருடம் / ARUDAM PRASNA
          </h1>
          <p className="text-sm font-serif italic text-slate-700">
            Traditional Tamil Prasna Prediction System • ஆருட பிரசன்ன ஜோதிட ஆய்வு அறிக்கை
          </p>
          <div className="mt-2 text-xs font-semibold text-slate-800">
            <span>கணிப்பவர் (Predicted by): <strong>Priyavathsan Sridharan Iyengar</strong></span>
            <span className="mx-2 text-slate-400">|</span>
            <span>தொடர்புக்கு (Call & WhatsApp): <strong>+91-9486483808</strong></span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Date: {currentDate} | Time: {currentTime} | Sidereal Ephemeris (Lahiri Ayanamsa)
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-500">Selected Number</div>
          <div className="text-3xl font-mono font-bold text-slate-900">#{selectedNumber}</div>
        </div>
      </div>

      {/* Target Item (if present) */}
      {objectName && (
        <div className="mb-4 p-2 bg-slate-100 border border-slate-300 rounded text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-700">Inquiry Focus: </span>
          <span className="font-semibold text-slate-900">{objectName}</span>
        </div>
      )}

      {/* Core Aruda Summary Box */}
      <div className="grid grid-cols-4 gap-3 mb-4 border border-slate-300 p-3 rounded bg-slate-50">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-500">Aruda Lagna (1st)</div>
          <div className="font-bold text-base text-slate-900">
            {arudaRasi.tamilNameOnly}
          </div>
          <div className="text-xs text-slate-600">{arudaRasi.englishNameOnly}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold text-slate-500">6th Rasi (Obstacles/Jaya)</div>
          <div className="font-bold text-base text-slate-900">
            {sixthRasi.tamilNameOnly}
          </div>
          <div className="text-xs text-slate-600">{sixthRasi.englishNameOnly}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold text-slate-500">6th Sign Lord</div>
          <div className="font-bold text-base text-slate-900">
            {sixthLord.tamilOnly}
          </div>
          <div className="text-xs text-slate-600">{sixthLord.englishOnly}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase font-bold text-slate-500">Direction Vector</div>
          <div className="font-bold text-base text-slate-900">
            {sixthRasi.direction}
          </div>
          <div className="text-xs text-slate-600">{sixthRasi.element} Element</div>
        </div>
      </div>

      {/* Question Identification & Prediction */}
      <div className="mb-4 p-4 border-2 border-slate-900 bg-slate-50 rounded">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Likely Question & Master Prasna Judgment / ஆருட பலன்
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 border border-slate-400 rounded">
            {prediction.primaryQuestion.categoryNameTa} ({prediction.primaryQuestion.strengthLabelTa})
          </span>
        </div>

        <p className="text-xs text-slate-700 mb-2">
          <strong>கேள்வி சுட்டு: </strong>{prediction.primaryQuestion.explanationTamil}
        </p>

        <p className="text-sm text-slate-900 leading-relaxed font-serif mb-2">
          <strong>ஆருட பலன் (Tamil): </strong>{prediction.predictionTa}
        </p>

        <p className="text-xs text-slate-800 leading-relaxed font-serif">
          <strong>Prediction (English): </strong>{prediction.predictionEn}
        </p>
      </div>

      {/* Lost Object / Missing Person Breakdown */}
      <div className="mb-4 border border-slate-300 p-3 rounded">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Traditional Clue Matrix / பாரம்பரிய இடக் குறிப்புகள்
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div><strong>பொருளின் நிலை:</strong> {prediction.lostObjectAnalysis.objectStatusTa}</div>
          <div><strong>இடத்தின் தன்மை:</strong> {prediction.lostObjectAnalysis.natureOfLocationTa}</div>
          <div><strong>அருகில் / தொலைவில்:</strong> {prediction.lostObjectAnalysis.nearOrFarTa}</div>
          <div><strong>உள்ளே / வெளியே:</strong> {prediction.lostObjectAnalysis.insideOrOutsideTa}</div>
          <div><strong>உயரம் / கீழ்ப்பகுதி:</strong> {prediction.lostObjectAnalysis.elevationTa}</div>
          <div><strong>மீட்பு சுட்டு:</strong> {prediction.lostObjectAnalysis.recoveryIndicationTa}</div>
        </div>
      </div>

      {/* Chandran-Based Finding Time (Phase 54) */}
      <div className="mb-4 border-2 border-slate-900 bg-slate-50 p-3 rounded text-xs">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold uppercase tracking-wider text-slate-900">
            🌙 Chandran-Based Time of Finding / சந்திரன் வழியிலான கிடைக்கும் காலம்
          </span>
          <span className="px-2 py-0.5 rounded font-bold bg-slate-200 border border-slate-400">
            {prediction.chandranFindingTime.timeCategoryTa} ({prediction.chandranFindingTime.timeCategoryEn})
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <strong>கிடைக்கும் காலம் (Tamil): </strong>{prediction.chandranFindingTime.timeOfFindingTa}
          </div>
          <div>
            <strong>Finding Time (English): </strong>{prediction.chandranFindingTime.timeOfFindingEn}
          </div>
        </div>
        <div className="mt-1 text-[11px] text-slate-600">
          <strong>சந்திரன் அடிப்படை (Rule [{prediction.chandranFindingTime.ruleId}]): </strong>{prediction.chandranFindingTime.moonBasisTa}
        </div>
      </div>

      {/* Kochara Transit Positions Snapshot */}
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Current Kochara Transits (Sidereal Lahiri Ayanamsa)
        </h3>
        <table className="w-full text-left text-[10px] border border-slate-300">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="p-1">Planet</th>
              <th className="p-1">Rasi (Tamil)</th>
              <th className="p-1">Degree</th>
              <th className="p-1">Nakshatra</th>
              <th className="p-1">Pada</th>
              <th className="p-1">Motion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transitPlanets.map(p => (
              <tr key={p.id}>
                <td className="p-1 font-bold">{p.symbol} {p.nameEn} ({p.nameTa})</td>
                <td className="p-1">{p.rasiTa}</td>
                <td className="p-1 font-mono">{p.degreeFormatted}</td>
                <td className="p-1">{p.nakshatraTa}</td>
                <td className="p-1">{p.pada}</td>
                <td className="p-1">{p.transitStatusTa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activated Rules */}
      <div className="mb-4 text-[10px]">
        <h4 className="font-bold uppercase text-slate-700 mb-1">Activated Rules:</h4>
        <div className="flex flex-wrap gap-1">
          {prediction.matchedRules.map(r => (
            <span key={r.id} className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">
              [{r.id}] {r.titleTa}
            </span>
          ))}
        </div>
      </div>

      {/* Footer & Astrologer Attribution */}
      <div className="border-t border-slate-400 pt-3 flex justify-between items-center text-[10px] text-slate-600">
        <div className="italic">
          Traditional Arudam / Prasna system based on 1–12 counting and 6th sign methodology.
        </div>
        <div className="font-semibold text-slate-900 text-right">
          கணிப்பவர் Priyavathsan Sridharan Iyengar • 📞/WhatsApp: +91-9486483808
        </div>
      </div>
    </div>
  );
};
