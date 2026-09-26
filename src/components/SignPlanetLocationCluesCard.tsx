import React, { useState } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { ZODIAC_SIGNS } from '../data/signs';
import { PLANETS } from '../data/planets';

interface SignPlanetLocationCluesCardProps {
  highlightSignId?: number;
  highlightPlanetId?: string;
  onSelectSign?: (signId: number) => void;
  onSelectPlanet?: (planetId: string) => void;
}

export const SignPlanetLocationCluesCard: React.FC<SignPlanetLocationCluesCardProps> = ({
  highlightSignId,
  highlightPlanetId,
  onSelectSign,
  onSelectPlanet
}) => {
  const [subTab, setSubTab] = useState<'signs' | 'planets'>('signs');

  const getDirectionBadge = (dir: string) => {
    switch (dir) {
      case 'East':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">East / கிழக்கு</span>;
      case 'South':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">South / தெற்கு</span>;
      case 'West':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">West / மேற்கு</span>;
      case 'North':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">North / வடக்கு</span>;
      default:
        return null;
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <span>Sign & Planet Location Clues</span>
            <span className="font-tamil text-amber-400 text-sm font-normal">/ ராசி & கிரக இருப்பிடக் குறிப்புகள்</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Traditional physical location clues and cardinal directions associated with the 12 signs and 9 planets.
          </p>
        </div>

        {/* Toggle between Signs and Planets */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-cosmic-900/90 p-1 rounded-xl border border-slate-700/60 no-print">
          <button
            onClick={() => setSubTab('signs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'signs'
                ? 'bg-amber-500 text-cosmic-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>12 Signs & Directions</span>
          </button>
          <button
            onClick={() => setSubTab('planets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === 'planets'
                ? 'bg-amber-500 text-cosmic-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>9 Planets Clues</span>
          </button>
        </div>
      </div>

      {/* 12 Signs View */}
      {subTab === 'signs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ZODIAC_SIGNS.map(sign => {
            const isHighlighted = highlightSignId === sign.id;

            return (
              <div
                key={sign.id}
                onClick={() => onSelectSign && onSelectSign(sign.id)}
                className={`rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isHighlighted
                    ? 'glass-panel-gold border-amber-400 shadow-glow-gold'
                    : 'glass-panel-subtle hover:bg-cosmic-800/80 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-amber-400">{sign.symbol}</span>
                      <div>
                        <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-tight">
                          {sign.nameEn}
                        </h3>
                        <span className="text-[11px] font-tamil text-slate-400">
                          {sign.nameTa}
                        </span>
                      </div>
                    </div>
                    {getDirectionBadge(sign.direction)}
                  </div>

                  <div className="text-xs text-slate-200 bg-cosmic-950/50 p-2.5 rounded-lg border border-slate-800 my-2">
                    <span className="text-amber-400 font-medium block mb-0.5">Location Clue:</span>
                    "{sign.locationClue}"
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-1 flex items-center justify-between">
                  <span>Element: <strong className="text-slate-200">{sign.element}</strong></span>
                  <span>Ruler: <strong className="text-slate-200">{sign.rulerEn}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 9 Planets View */}
      {subTab === 'planets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PLANETS.map(planet => {
            const isHighlighted = highlightPlanetId === planet.id;

            return (
              <div
                key={planet.id}
                onClick={() => onSelectPlanet && onSelectPlanet(planet.id)}
                className={`rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isHighlighted
                    ? 'glass-panel-gold border-amber-400 shadow-glow-gold'
                    : 'glass-panel-subtle hover:bg-cosmic-800/80 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-amber-400">{planet.symbol}</span>
                      <div>
                        <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-tight">
                          {planet.nameEn}
                        </h3>
                        <span className="text-[11px] font-tamil text-slate-400">
                          {planet.nameTa}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {planet.sanskritName.split(' ')[0]}
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 bg-cosmic-950/50 p-2.5 rounded-lg border border-slate-800 my-2">
                    <span className="text-amber-400 font-medium block mb-0.5">Planet Location Clue:</span>
                    "{planet.locationClue}"
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-1">
                  <span>Significations: </span>
                  <span className="text-slate-300">{planet.keywords.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
