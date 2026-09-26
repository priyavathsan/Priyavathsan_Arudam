import React from 'react';
import { Moon, Orbit, Sparkles } from 'lucide-react';
import { PlanetInfo, HouseInfo, ZodiacSignInfo } from '../types/astrology';
import { PLANETS } from '../data/planets';
import { HOUSES } from '../data/houses';
import { MOON_IMMEDIATE_CLUES, LONG_TERM_TRANSIT_BACKGROUND } from '../data/gocharam';
import { getHouseFromAruda, getOrdinal } from '../utils/astrology';

interface GocharamCardProps {
  arudaSign: ZodiacSignInfo;
  transitPlanetId: string;
  setTransitPlanetId: (id: string) => void;
  transitHouseNum: number;
  setTransitHouseNum: (num: number) => void;
  transitPlanet: PlanetInfo;
  transitHouse: HouseInfo;
}

export const GocharamCard: React.FC<GocharamCardProps> = ({
  arudaSign,
  transitPlanetId,
  setTransitPlanetId,
  transitHouseNum,
  setTransitHouseNum,
  transitPlanet,
  transitHouse
}) => {
  const currentTransitSign = getHouseFromAruda(arudaSign, transitHouseNum);
  const moonClue = MOON_IMMEDIATE_CLUES[transitHouseNum];

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <span>கோச்சாரம் / Gocharam (Transit Analysis)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time or currently transiting planetary positions calculated from {arudaSign.nameEn} Aruda Lagna.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Transit Planet */}
        <div className="bg-cosmic-900/80 p-4 rounded-xl border border-slate-700/60">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
            A. Select Transit Planet (கோச்சார கிரகம்)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-2">
            {PLANETS.map(p => {
              const isSelected = p.id === transitPlanetId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTransitPlanetId(p.id)}
                  className={`py-2 px-1 rounded-lg text-xs font-medium flex flex-col items-center transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-cosmic-950 font-bold shadow-sm'
                      : 'bg-cosmic-950 text-slate-300 hover:bg-cosmic-800 border border-slate-800'
                  }`}
                >
                  <span className="text-base">{p.symbol}</span>
                  <span className="truncate max-w-full text-[11px]">{p.nameEn}</span>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-300 bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800 mt-2">
            <span className="text-amber-400 font-semibold">{transitPlanet.nameEn} Transit Meaning: </span>
            "{transitPlanet.transitInterpretation}"
          </div>
        </div>

        {/* Transit House */}
        <div className="bg-cosmic-900/80 p-4 rounded-xl border border-slate-700/60">
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
            B. Transit House from {arudaSign.nameEn} (1–12)
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-2">
            {HOUSES.map(h => {
              const isSelected = h.number === transitHouseNum;
              return (
                <button
                  key={h.number}
                  type="button"
                  onClick={() => setTransitHouseNum(h.number)}
                  className={`py-2 px-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'bg-cosmic-950 text-slate-300 hover:bg-cosmic-800 border border-slate-800'
                  }`}
                >
                  <span>{h.number}</span>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-300 bg-cosmic-950/70 p-2.5 rounded-lg border border-slate-800 mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-indigo-400 font-semibold">
                House {transitHouse.number} ({transitHouse.nameEn}):
              </span>
              <span className="text-[11px] text-amber-300">
                Sign: {currentTransitSign.nameEn} ({currentTransitSign.direction})
              </span>
            </div>
            "{transitHouse.transitMeaning}"
          </div>
        </div>
      </div>

      {/* Two Highlight Cards: Moon Immediate Clue & Long-Term Transit Background */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Moon Immediate Clue Card */}
        <div className="relative rounded-xl p-4 sm:p-5 border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-950/40 via-cosmic-900/80 to-slate-900 shadow-glow-indigo">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Moon className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-cyan-200 text-sm sm:text-base">
                  Moon Transit – Immediate Clue
                </h3>
                <span className="text-[11px] font-tamil text-cyan-300/80">
                  சந்திர கோச்சாரம் – உடனடி வழிகாட்டி
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Short-Term
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Moon (சந்திரன்) changes signs every 2.25 days and acts as an immediate short-term compass in traditional Prasna inquiry.
          </p>

          {moonClue ? (
            <div className="bg-cyan-900/30 border border-cyan-500/40 rounded-lg p-3">
              <div className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Active Moon Rule ({transitHouseNum}{getOrdinal(transitHouseNum)} House):
              </div>
              <div className="text-sm font-bold text-white mb-1">
                "{moonClue.clue}"
              </div>
              <div className="text-xs text-cyan-200/80">
                {moonClue.advice}
              </div>
            </div>
          ) : (
            <div className="bg-cosmic-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">
              <span className="text-slate-300 font-medium block mb-1">Key Immediate Moon Houses:</span>
              <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                <li><strong className="text-cyan-300">4th House:</strong> Check inside the home.</li>
                <li><strong className="text-cyan-300">8th House:</strong> Check hidden/covered areas.</li>
                <li><strong className="text-cyan-300">9th House:</strong> Check travel/vehicle/outside locations.</li>
                <li><strong className="text-cyan-300">12th House:</strong> Check outside, distant or forgotten locations.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Long-Term Transit Background Card */}
        <div className="relative rounded-xl p-4 sm:p-5 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-cosmic-900/80 to-slate-900">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Orbit className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-amber-200 text-sm sm:text-base">
                  Long-Term Transit Background
                </h3>
                <span className="text-[11px] font-tamil text-amber-300/80">
                  நீண்டகால கோச்சார அடிப்படை (மந்த கிரகங்கள்)
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Deep Background
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Slow-moving planets set the macro environment, underlying delays, or institutional friction:
          </p>

          <div className="space-y-2">
            {LONG_TERM_TRANSIT_BACKGROUND.map(lt => {
              const isCurrent = lt.planet.toLowerCase() === transitPlanetId.toLowerCase();

              return (
                <div
                  key={lt.planet}
                  className={`text-xs p-2 rounded-lg border flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-400 text-amber-100 font-medium'
                      : 'bg-cosmic-950/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-amber-400">{lt.symbol}</span>
                    <strong className="text-white">{lt.planet} ({lt.nameTa}):</strong>
                  </div>
                  <span className="text-[11px] text-slate-300 text-right">
                    "{lt.backgroundClue}"
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
