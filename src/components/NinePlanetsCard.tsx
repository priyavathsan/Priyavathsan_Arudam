import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ZodiacSignInfo, PlanetInfo } from '../types/astrology';
import { PLANETS } from '../data/planets';
import { useLanguage } from '../context/LanguageContext';

interface NinePlanetsCardProps {
  sixthSign: ZodiacSignInfo;
  selectedPlanetId?: string;
  onSelectPlanet?: (planetId: string) => void;
}

export const NinePlanetsCard: React.FC<NinePlanetsCardProps> = ({
  sixthSign,
  selectedPlanetId,
  onSelectPlanet
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredPlanets = PLANETS.filter(planet => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'benefics') return ['jupiter', 'venus', 'mercury', 'moon'].includes(planet.id);
    if (activeFilter === 'malefics') return ['saturn', 'mars', 'sun', 'rahu', 'ketu'].includes(planet.id);
    return true;
  });

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <span className={isTamil ? 'font-tamil' : ''}>
              {isTamil ? '9 கிரகங்கள் — 6-ஆம் ராசி பலன்கள்' : '9 Planets in 6th Sign'}
            </span>
            <span className="text-slate-400 font-sans font-normal text-sm sm:text-base">
              ({isTamil ? sixthSign.nameTa : `${sixthSign.nameEn} / ${sixthSign.nameTa}`})
            </span>
          </h2>
          <p className={`text-xs sm:text-sm text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil
              ? '6-ஆம் பாவத்தில் அல்லது அதை பார்க்கும் கிரகங்களின் முயற்சி, தடை மற்றும் கண்டுபிடிப்புக்கான பாரம்பரிய கிரக தாக்கங்கள்.'
              : 'Traditional planetary influences when placed in or aspecting the 6th house of effort, obstacles, and discovery.'}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-cosmic-900/80 p-1 rounded-xl border border-slate-700/60 no-print">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-cosmic-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            } ${isTamil ? 'font-tamil' : ''}`}
          >
            {isTamil ? 'அனைத்து 9 கிரகங்கள்' : 'All 9 Grahas'}
          </button>
          <button
            onClick={() => setActiveFilter('benefics')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'benefics'
                ? 'bg-emerald-500 text-cosmic-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            } ${isTamil ? 'font-tamil' : ''}`}
          >
            {isTamil ? 'சுபர்கள்' : 'Benefics (சுபர்கள்)'}
          </button>
          <button
            onClick={() => setActiveFilter('malefics')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'malefics'
                ? 'bg-rose-500 text-cosmic-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            } ${isTamil ? 'font-tamil' : ''}`}
          >
            {isTamil ? 'அசுபர்கள்' : 'Malefics (அசுபர்கள்)'}
          </button>
        </div>
      </div>

      {/* Grid of 9 Planets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredPlanets.map((planet: PlanetInfo) => {
          const isSelected = selectedPlanetId === planet.id;

          return (
            <div
              key={planet.id}
              onClick={() => onSelectPlanet && onSelectPlanet(planet.id)}
              className={`rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel-gold border-amber-400 shadow-glow-gold scale-[1.01]'
                  : 'glass-panel-subtle hover:bg-cosmic-800/80 hover:border-slate-600'
              }`}
            >
              <div>
                {/* Header: Symbol + Names */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg bg-cosmic-900 border border-slate-700/60 flex items-center justify-center text-xl text-amber-400 font-serif">
                      {planet.symbol}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-white text-base leading-tight">
                        {isTamil ? planet.nameTa : planet.nameEn}
                      </h3>
                      {!isTamil && (
                        <span className="text-xs font-tamil text-amber-300/80">
                          {planet.nameTa}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {planet.sanskritName.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Traditional Interpretation */}
                <div className="text-xs sm:text-[13px] text-slate-200 leading-relaxed bg-cosmic-950/40 p-2.5 rounded-lg border border-slate-800/70 mb-3">
                  <span className={`text-amber-400 font-medium ${isTamil ? 'font-tamil' : ''}`}>
                    {isTamil ? 'பாரம்பரிய விளக்கம்: ' : 'Traditional Interpretation: '}
                  </span>
                  "{planet.sixthSignInterpretation}"
                </div>
              </div>

              {/* Keywords Tags */}
              <div className="border-t border-slate-800/80 pt-2.5 mt-auto">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Key Words / முக்கிய குறிப்புகள்
                </span>
                <div className="flex flex-wrap gap-1">
                  {planet.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/50"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
