import React from 'react';
import { Search, Sparkles, Compass } from 'lucide-react';
import { ZodiacSignInfo } from '../types/astrology';
import { PLANETS } from '../data/planets';
import { ZODIAC_SIGNS } from '../data/signs';
import { HOUSES } from '../data/houses';
import { getHouseFromAruda, getOrdinal } from '../utils/astrology';
import { useLanguage } from '../context/LanguageContext';

interface MissingObjectCardProps {
  arudaSign: ZodiacSignInfo;
  objectName: string;
  setObjectName: (name: string) => void;
  selectedPlanetId: string;
  setSelectedPlanetId: (id: string) => void;
  selectedHouseNum: number;
  setSelectedHouseNum: (num: number) => void;
  selectedSignId: number;
  setSelectedSignId: (id: number) => void;
  onAutoAnalyze: () => void;
  traditionalClueText: string;
}

export const MissingObjectCard: React.FC<MissingObjectCardProps> = ({
  arudaSign,
  objectName,
  setObjectName,
  selectedPlanetId,
  setSelectedPlanetId,
  selectedHouseNum,
  setSelectedHouseNum,
  selectedSignId,
  setSelectedSignId,
  onAutoAnalyze,
  traditionalClueText
}) => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const quickItems = [
    'Mobile phone',
    'Keys',
    'Documents / Papers',
    'Gold / Jewellery',
    'Wallet / Cash',
    'Spectacles / Watch'
  ];

  const currentSign = ZODIAC_SIGNS.find(s => s.id === selectedSignId) || getHouseFromAruda(arudaSign, selectedHouseNum);

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <span className={isTamil ? 'font-tamil' : ''}>{t('missing.title')}</span>
            {!isTamil && <span className="font-tamil text-amber-400 text-sm font-normal">/ காணாமல் போன பொருள் ஆய்வு</span>}
          </h2>
          <p className={`text-xs sm:text-sm text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil
              ? 'பாரம்பரிய பாவம், ராசி, கிரக ஆட்சி மற்றும் திசை சுவடுகளை இணைத்து இழந்த பொருளை கண்டுபிடிக்கவும்.'
              : 'Combine traditional house, sign, planetary ruler, and directional indications to locate misplaced possessions.'}
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-cosmic-900/80 rounded-xl p-4 border border-slate-700/60 mb-5">
        <label htmlFor="objectInput" className={`block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-2 ${isTamil ? 'font-tamil' : ''}`}>
          {t('missing.object_label')}
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="objectInput"
              type="text"
              value={objectName}
              onChange={e => setObjectName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onAutoAnalyze();
                }
              }}
              placeholder={t('missing.object_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cosmic-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-sm transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onAutoAnalyze}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-cosmic-950 font-bold text-sm transition-all shadow-glow-gold hover:scale-[1.02] active:scale-[0.98] shrink-0 ${isTamil ? 'font-tamil' : ''}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('missing.auto_analyze')}</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 mr-1">Quick Select:</span>
          {quickItems.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setObjectName(item);
                // Also trigger auto analyze with a microtask
                setTimeout(() => onAutoAnalyze(), 0);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-cosmic-800 hover:bg-cosmic-700 text-slate-300 border border-slate-700 hover:border-amber-500/40 transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors for House, Sign, Planet */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* House Selector */}
        <div>
          <label className={`block text-xs text-slate-400 font-medium mb-1.5 ${isTamil ? 'font-tamil' : ''}`}>
            {t('missing.house_label')} — {isTamil ? arudaSign.nameTa : arudaSign.nameEn}
          </label>
          <select
            value={selectedHouseNum}
            onChange={e => {
              const hNum = Number(e.target.value);
              setSelectedHouseNum(hNum);
              // auto align sign to this house from aruda
              const corrSign = getHouseFromAruda(arudaSign, hNum);
              setSelectedSignId(corrSign.id);
            }}
            className="w-full px-3 py-2 rounded-lg bg-cosmic-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            <option value={2}>2nd House (Object, possession, stored money)</option>
            <option value={4}>4th House (Home, interior, cupboard, furniture)</option>
            <option value={7}>7th House (Another person, external side)</option>
            <option value={8}>8th House (Hidden, covered, locked, secret)</option>
            <option value={12}>12th House (Outside, distant, forgotten location)</option>
            <optgroup label="Other Bhavas">
              {HOUSES.filter(h => ![2, 4, 7, 8, 12].includes(h.number)).map(h => (
                <option key={h.number} value={h.number}>
                  {h.number}{getOrdinal(h.number)} House ({h.generalMeaning.slice(0, 35)}...)
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Sign Selector */}
        <div>
          <label className={`block text-xs text-slate-400 font-medium mb-1.5 ${isTamil ? 'font-tamil' : ''}`}>
            {t('missing.sign_label')} ({currentSign.direction})
          </label>
          <select
            value={selectedSignId}
            onChange={e => setSelectedSignId(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-cosmic-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            {ZODIAC_SIGNS.map(sign => (
              <option key={sign.id} value={sign.id}>
                {sign.id}. {isTamil ? sign.nameTa : `${sign.nameEn} (${sign.nameTa.split(' ')[0]})`} - {sign.direction}
              </option>
            ))}
          </select>
        </div>

        {/* Planet Selector */}
        <div>
          <label className={`block text-xs text-slate-400 font-medium mb-1.5 ${isTamil ? 'font-tamil' : ''}`}>
            {t('missing.planet_label')}
          </label>
          <select
            value={selectedPlanetId}
            onChange={e => setSelectedPlanetId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-cosmic-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            {PLANETS.map(planet => (
              <option key={planet.id} value={planet.id}>
                {isTamil
                  ? `${planet.nameTa} — ${planet.keywords[0]}`
                  : `${planet.nameEn} (${planet.nameTa.split(' ')[0]}) - ${planet.keywords[0]}`
                }
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Traditional Combined Clue Output Box */}
      <div className="glass-panel-gold rounded-xl p-4 sm:p-5 border border-amber-500/40 relative">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5 ${isTamil ? 'font-tamil' : ''}`}>
            <Compass className="w-4 h-4 text-amber-400" />
            {isTamil ? 'பாரம்பரிய தொலைவு பொருள் சுவடு' : 'Traditional Synthesized Missing-Object Clue'}
          </span>
          <span className={`text-xs font-mono text-amber-400/80 bg-cosmic-950/60 px-2 py-0.5 rounded border border-amber-500/20 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil ? 'திசை:' : 'Direction:'} {currentSign.direction}
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-serif">
          {traditionalClueText}
        </p>

        <div className="text-[11px] text-amber-300/70 mt-3 pt-2.5 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-amber-300">Methodology:</span>
          <span>House {selectedHouseNum}</span>
          <span>+</span>
          <span>{currentSign.nameEn} Sign</span>
          <span>+</span>
          <span className="capitalize">{selectedPlanetId} Planet</span>
          <span>+</span>
          <span>{currentSign.direction} Cardinal Axis</span>
        </div>
      </div>
    </section>
  );
};
