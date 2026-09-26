import React, { useState } from 'react';
import { TransitCalculationResult, TransitPlanetInfo } from '../kochara/transitCalculator';
import { useLanguage } from '../context/LanguageContext';

export interface KocharaDetailsProps {
  transitResult: TransitCalculationResult;
  onDateChange?: (date: Date) => void;
  onSelectPlanet?: (planet: TransitPlanetInfo) => void;
}

export const KocharaDetails: React.FC<KocharaDetailsProps> = ({
  transitResult,
  onDateChange,
  onSelectPlanet
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Manual date/time state
  const [manualDate, setManualDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [manualTime, setManualTime] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  );
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  const handleApplyManual = () => {
    try {
      const [year, month, day] = manualDate.split('-').map(Number);
      const [hour, minute] = manualTime.split(':').map(Number);
      const parsed = new Date(year, month - 1, day, hour, minute);
      if (!isNaN(parsed.getTime()) && onDateChange) {
        onDateChange(parsed);
      }
    } catch (e) {
      console.error('Date parsing failed', e);
    }
  };

  const handleResetToNow = () => {
    setIsManualMode(false);
    const now = new Date();
    setManualDate(now.toISOString().split('T')[0]);
    setManualTime(now.toTimeString().slice(0, 5));
    if (onDateChange) {
      onDateChange(now);
    }
  };

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
            {isTamil ? 'படி 3: தற்கால கோச்சார கிரக நிலைகள்' : 'Step 3: Current Kochara Transits'}
          </span>
          <h2 className={`text-xl sm:text-2xl font-serif font-bold text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? 'கோச்சார கிரக நிலை விவரம்' : 'Kochara Planetary Positions'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isTamil
              ? `நிரயண முறை • லாஹிரி அயனாம்சம்: ${transitResult.ayanamsaFormatted} • தேதி: ${transitResult.dateFormatted}`
              : `Sidereal Zodiac • Lahiri Ayanamsa: ${transitResult.ayanamsaFormatted} • Date: ${transitResult.dateFormatted}`}
          </p>
        </div>

        {/* Date/Time Controller (Phase 30 Requirement) */}
        <div className="flex flex-wrap items-center gap-2">
          {!isManualMode ? (
            <button
              type="button"
              onClick={() => setIsManualMode(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-cosmic-800 hover:bg-cosmic-700 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>📅</span>
              <span className={isTamil ? 'font-tamil' : ''}>
                {isTamil ? 'தேதி/நேரம் மாற்றுக' : 'Change Date/Time'}
              </span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-cosmic-950 p-2 rounded-xl border border-slate-700">
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1"
              />
              <input
                type="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={handleApplyManual}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-cosmic-950 font-bold text-xs"
              >
                {isTamil ? 'பயன்படுத்து' : 'Apply'}
              </button>
              <button
                type="button"
                onClick={handleResetToNow}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
              >
                {isTamil ? 'தற்போது' : 'Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 9 Planets Table (Phase 8 & 11) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-cosmic-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">{isTamil ? 'கிரகம்' : 'Planet'}</th>
              <th className="py-2.5 px-3">{isTamil ? 'ராசி' : 'Rasi'}</th>
              <th className="py-2.5 px-3">{isTamil ? 'பாகை/கலை' : 'Degree'}</th>
              <th className="py-2.5 px-3">{isTamil ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
              <th className="py-2.5 px-3">{isTamil ? 'பாதம்' : 'Pada'}</th>
              <th className="py-2.5 px-3">{isTamil ? 'கதி' : 'Motion'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {transitResult.planets.map((planet) => (
              <tr
                key={planet.id}
                onClick={() => onSelectPlanet && onSelectPlanet(planet)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <td className="py-2.5 px-3 flex items-center gap-2 font-medium text-slate-200">
                  <span className="text-amber-400 text-base">{planet.symbol}</span>
                  <span className={isTamil ? 'font-tamil' : ''}>
                    {isTamil ? planet.nameTa : planet.nameEn}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-indigo-300">
                  <span className={isTamil ? 'font-tamil' : ''}>
                    {isTamil ? planet.rasiTa : planet.rasiEn}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-emerald-300">
                  {planet.degreeFormatted}
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  <span className={isTamil ? 'font-tamil' : ''}>
                    {isTamil ? planet.nakshatraTa : planet.nakshatraEn}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-400">
                  {planet.pada}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      planet.isRetrograde
                        ? 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                        : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {isTamil ? planet.transitStatusTa : planet.transitStatusEn}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
