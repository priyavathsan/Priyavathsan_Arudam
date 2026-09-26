import React, { useState } from 'react';
import { RasiRuleData, getRasiById } from '../astrology/rasi';
import { TransitPlanetInfo } from '../kochara/transitCalculator';

export interface SouthIndianRasiChartProps {
  arudaRasi?: RasiRuleData;
  sixthRasi?: RasiRuleData;
  planets?: TransitPlanetInfo[];
  selectedRasiId?: number;
  onSelectRasi?: (rasiId: number) => void;
  onSelectPlanet?: (planet: TransitPlanetInfo) => void;
  language?: 'ta' | 'en';
  titleEn?: string;
  titleTa?: string;
  subtitleEn?: string;
  subtitleTa?: string;
  mode?: 'arudam' | 'kochara' | 'combined';
}

// Fixed South Indian chart layout coordinates (row 0..3, col 0..3)
// Standard South Indian 4x4 grid:
// Row 0: Meenam (12), Mesham (1), Rishabam (2), Mithunam (3)
// Row 1: Kumbam (11), [Center],  [Center],      Kadagam (4)
// Row 2: Makaram (10), [Center], [Center],      Simmam (5)
// Row 3: Dhanusu (9), Viruchigam (8), Thulam (7), Kanni (6)

interface ChartCellDef {
  row: number;
  col: number;
  rasiId: number;
}

const FIXED_CHART_CELLS: ChartCellDef[] = [
  // Top row
  { row: 0, col: 0, rasiId: 12 }, // Meenam
  { row: 0, col: 1, rasiId: 1 },  // Mesham
  { row: 0, col: 2, rasiId: 2 },  // Rishabam
  { row: 0, col: 3, rasiId: 3 },  // Mithunam
  // Second row
  { row: 1, col: 0, rasiId: 11 }, // Kumbam
  { row: 1, col: 3, rasiId: 4 },  // Kadagam
  // Third row
  { row: 2, col: 0, rasiId: 10 }, // Makaram
  { row: 2, col: 3, rasiId: 5 },  // Simmam
  // Bottom row
  { row: 3, col: 0, rasiId: 9 },  // Dhanusu
  { row: 3, col: 1, rasiId: 8 },  // Viruchigam
  { row: 3, col: 2, rasiId: 7 },  // Thulam
  { row: 3, col: 3, rasiId: 6 },  // Kanni
];

export const SouthIndianRasiChart: React.FC<SouthIndianRasiChartProps> = ({
  arudaRasi,
  sixthRasi,
  planets = [],
  selectedRasiId,
  onSelectRasi,
  onSelectPlanet,
  language = 'ta',
  titleEn = 'South Indian Rasi Chart',
  titleTa = 'தென் இந்திய ராசி கட்டம்',
  subtitleEn,
  subtitleTa
}) => {
  const isTamil = language === 'ta';
  const [activePlanetModal, setActivePlanetModal] = useState<TransitPlanetInfo | null>(null);

  // Group planets by Rasi ID
  const planetsByRasi: Record<number, TransitPlanetInfo[]> = {};
  for (let i = 1; i <= 12; i++) {
    planetsByRasi[i] = [];
  }
  for (const p of planets) {
    if (planetsByRasi[p.rasiId]) {
      planetsByRasi[p.rasiId].push(p);
    }
  }

  const handlePlanetClick = (e: React.MouseEvent, planet: TransitPlanetInfo) => {
    e.stopPropagation();
    setActivePlanetModal(planet);
    if (onSelectPlanet) {
      onSelectPlanet(planet);
    }
  };

  return (
    <div className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Title & Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className={`text-lg sm:text-xl font-bold text-amber-300 font-serif flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
            <span>☸</span>
            <span>{isTamil ? titleTa : titleEn}</span>
          </h3>
          {(subtitleTa || subtitleEn) && (
            <p className={`text-xs text-slate-400 mt-0.5 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? subtitleTa : subtitleEn}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/50 px-2 py-0.5 rounded-full text-indigo-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className={`font-semibold ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'ஆருட லக்னம்' : 'Aruda Lagna'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/50 px-2 py-0.5 rounded-full text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className={`font-semibold ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? '6ஆம் ராசி' : '6th Rasi'}
            </span>
          </div>

          {planets.length > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-full text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className={`font-semibold ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? 'கோச்சார கிரகங்கள்' : 'Kochara Planets'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* South Indian 4x4 Grid Container */}
      <div className="relative aspect-square max-w-xl mx-auto grid grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2 p-2 bg-cosmic-950/80 rounded-xl border-2 border-amber-500/30">
        {/* 12 Outer Rasi Cells */}
        {FIXED_CHART_CELLS.map((cell) => {
          const rasi = getRasiById(cell.rasiId);
          const isAruda = arudaRasi?.id === cell.rasiId;
          const isSixth = sixthRasi?.id === cell.rasiId;
          const isSelected = selectedRasiId === cell.rasiId;
          const cellPlanets = planetsByRasi[cell.rasiId] || [];

          // Grid placement
          const style: React.CSSProperties = {
            gridRowStart: cell.row + 1,
            gridColumnStart: cell.col + 1
          };

          return (
            <div
              key={cell.rasiId}
              style={style}
              onClick={() => onSelectRasi && onSelectRasi(cell.rasiId)}
              className={`relative rounded-lg p-1.5 sm:p-2 flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden border ${
                isAruda && isSixth
                  ? 'bg-gradient-to-br from-indigo-950/90 via-purple-950/90 to-rose-950/90 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                  : isAruda
                  ? 'bg-indigo-950/80 border-indigo-400/80 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/50'
                  : isSixth
                  ? 'bg-rose-950/80 border-rose-400/80 ring-2 ring-rose-500/40 shadow-lg shadow-rose-950/50'
                  : isSelected
                  ? 'bg-slate-800/90 border-amber-400/80'
                  : 'bg-cosmic-900/70 border-slate-800 hover:border-slate-600 hover:bg-cosmic-800/80'
              }`}
            >
              {/* Header: Rasi name & fixed number */}
              <div className="flex items-center justify-between leading-none gap-1 border-b border-white/5 pb-1">
                <span className={`text-[11px] sm:text-xs font-semibold tracking-tight truncate ${
                  isAruda ? 'text-indigo-200 font-bold' : isSixth ? 'text-rose-200 font-bold' : 'text-slate-300'
                } ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? rasi.tamilNameOnly : rasi.englishNameOnly.split(' / ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {cell.rasiId}
                </span>
              </div>

              {/* Center / Highlight Badges */}
              <div className="my-auto py-0.5 space-y-0.5">
                {isAruda && (
                  <div className="bg-indigo-500/30 border border-indigo-400/60 rounded px-1 py-0.5 text-center">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                      {isTamil ? 'ஆருட லக்னம்' : 'ARUDA LAGNA'}
                    </span>
                  </div>
                )}
                {isSixth && (
                  <div className="bg-rose-500/30 border border-rose-400/60 rounded px-1 py-0.5 text-center">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                      {isTamil ? '6ஆம் இடம்' : '6TH HOUSE'}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom: Transit Planets in this Rasi */}
              {cellPlanets.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-0.5 items-start">
                  {cellPlanets.map((p) => (
                    <button
                      key={p.id}
                      onClick={(e) => handlePlanetClick(e, p)}
                      title={`${p.nameEn} (${p.nameTa}) at ${p.degreeFormatted} - ${p.nakshatraEn} Pada ${p.pada}`}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 transition-colors whitespace-nowrap"
                    >
                      <span className="text-[11px] flex-shrink-0">{p.symbol}</span>
                      <span className={`text-[9px] sm:text-[10px] leading-tight ${isTamil ? 'font-tamil tamil-planet-name' : ''}`}>
                        {isTamil ? p.nameTa.split(' (')[0] : p.nameEn}
                      </span>
                      {p.isRetrograde && (
                        <span className="text-[8px] text-rose-400 font-bold flex-shrink-0" title="Retrograde (வக்ரம்)">
                          (வ)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Center 2x2 Cell (Merged for Traditional Emblem, Title & Summary) */}
        <div
          style={{
            gridRow: '2 / span 2',
            gridColumn: '2 / span 2'
          }}
          className="rounded-xl bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-950 border border-amber-500/40 p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden"
        >
          {/* Subtle cosmic background glow */}
          <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none"></div>

          <div className="text-xl sm:text-2xl text-amber-400 mb-1">
            ☸
          </div>

          <span className={`text-xs sm:text-sm font-bold text-amber-300 font-serif tracking-wide ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? 'ஆருட ராசி சக்கரம்' : 'Aruda Rasi Chakra'}
          </span>

          <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">
            Traditional South Indian Chart
          </span>

          {arudaRasi && sixthRasi && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 w-full space-y-1 text-left text-[11px]">
              <div className="flex items-center justify-between text-indigo-300">
                <span className={`text-[10px] ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? 'ஆருடம்:' : 'Aruda:'}
                </span>
                <span className={`font-semibold ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? arudaRasi.tamilNameOnly : arudaRasi.englishNameOnly}
                </span>
              </div>
              <div className="flex items-center justify-between text-rose-300">
                <span className={`text-[10px] ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? '6ஆம் ராசி:' : '6th Rasi:'}
                </span>
                <span className={`font-semibold ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? sixthRasi.tamilNameOnly : sixthRasi.englishNameOnly}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Planet Details Modal (Phase 11) */}
      {activePlanetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-cosmic-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setActivePlanetModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <span className="text-3xl text-amber-400">{activePlanetModal.symbol}</span>
              <div>
                <h4 className="text-lg font-bold text-amber-300 font-serif">
                  {isTamil ? `${activePlanetModal.nameTa} (${activePlanetModal.nameEn})` : `${activePlanetModal.nameEn} / ${activePlanetModal.nameTa}`}
                </h4>
                <p className="text-xs text-slate-400">
                  {activePlanetModal.sanskritName} • {activePlanetModal.element} Element
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isTamil ? 'தற்போதைய ராசி:' : 'Current Rasi:'}</span>
                <span className="font-semibold text-amber-200">{isTamil ? activePlanetModal.rasiTa : activePlanetModal.rasiEn}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isTamil ? 'பாகை / கலை:' : 'Degree / Minute:'}</span>
                <span className="font-mono text-emerald-300">{activePlanetModal.degreeFormatted}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isTamil ? 'நட்சத்திரம் / பாதம்:' : 'Nakshatra & Pada:'}</span>
                <span className="font-semibold text-indigo-300">
                  {isTamil ? activePlanetModal.nakshatraTa : activePlanetModal.nakshatraEn} (பாதம் {activePlanetModal.pada})
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{isTamil ? 'இயக்க நிலை:' : 'Motion Status:'}</span>
                <span className={`font-semibold ${activePlanetModal.isRetrograde ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isTamil ? activePlanetModal.transitStatusTa : activePlanetModal.transitStatusEn}
                </span>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setActivePlanetModal(null)}
                className="px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold"
              >
                {isTamil ? 'மூடுக' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
