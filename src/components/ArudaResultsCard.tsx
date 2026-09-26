import React from 'react';
import { Compass, Flame, Droplets, Wind, Mountain, ArrowRight } from 'lucide-react';
import { ZodiacSignInfo } from '../types/astrology';
import { ZODIAC_SIGNS } from '../data/signs';
import { useLanguage } from '../context/LanguageContext';

interface ArudaResultsCardProps {
  selectedNumber: number;
  arudaSign: ZodiacSignInfo;
  sixthSign: ZodiacSignInfo;
}

export const ArudaResultsCard: React.FC<ArudaResultsCardProps> = ({
  selectedNumber,
  arudaSign,
  sixthSign
}) => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Fire':  return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Water': return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'Air':   return <Wind className="w-4 h-4 text-cyan-300" />;
      case 'Earth': return <Mountain className="w-4 h-4 text-emerald-400" />;
      default:      return null;
    }
  };

  const elementLabel = (el: string) => {
    const map: Record<string, string> = {
      Fire: t('element.fire'), Water: t('element.water'),
      Air:  t('element.air'),  Earth: t('element.earth'),
    };
    return map[el] ?? el;
  };

  const directionLabel = (dir: string) => {
    const map: Record<string, string> = {
      East: t('direction.east'), West: t('direction.west'),
      North: t('direction.north'), South: t('direction.south'),
    };
    return map[dir] ?? dir;
  };

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
      {/* Top Main Cards: Number, Aruda Lagna, 6th Sign, Direction */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Card 1: Selected Number */}
        <div className="glass-panel-subtle rounded-xl p-4 flex flex-col justify-between border-l-4 border-l-amber-500">
          <span className={`text-xs uppercase tracking-wider text-slate-400 font-medium ${isTamil ? 'font-tamil' : ''}`}>
            {t('aruda_card.selected_number')} / எண்
          </span>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-amber-400">
              {selectedNumber}
            </span>
            <span className="text-xs text-slate-400">/ 12</span>
          </div>
          <span className={`text-xs text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
            {t('aruda_card.prasna_root')}
          </span>
        </div>

        {/* Card 2: Aruda Lagna */}
        <div className="glass-panel-subtle rounded-xl p-4 flex flex-col justify-between border-l-4 border-l-indigo-500">
          <span className={`text-xs uppercase tracking-wider text-indigo-300 font-medium ${isTamil ? 'font-tamil' : ''}`}>
            {t('aruda_card.aruda_lagna')}
          </span>
          <div className="my-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl text-indigo-400">{arudaSign.symbol}</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-white">
                {isTamil ? arudaSign.nameTa : arudaSign.nameEn}
              </span>
            </div>
            {!isTamil && (
              <div className="text-sm font-tamil text-indigo-200 mt-0.5">{arudaSign.nameTa}</div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 border-t border-slate-700/40 pt-2 mt-1">
            <div className="flex items-center gap-1">
              {getElementIcon(arudaSign.element)}
              <span>{elementLabel(arudaSign.element)}</span>
            </div>
            <span>•</span>
            <div className={isTamil ? 'font-tamil' : ''}>
              {t('aruda_card.ruler')} <strong className="text-slate-200">{arudaSign.rulerEn}</strong>
            </div>
          </div>
        </div>

        {/* Card 3: 6th Sign */}
        <div className="glass-panel-subtle rounded-xl p-4 flex flex-col justify-between border-l-4 border-l-rose-500">
          <span className={`text-xs uppercase tracking-wider text-rose-300 font-medium ${isTamil ? 'font-tamil' : ''}`}>
            {t('aruda_card.sixth_sign')}
          </span>
          <div className="my-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl text-rose-400">{sixthSign.symbol}</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-white">
                {isTamil ? sixthSign.nameTa : sixthSign.nameEn}
              </span>
            </div>
            {!isTamil && (
              <div className="text-sm font-tamil text-rose-200 mt-0.5">{sixthSign.nameTa}</div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 border-t border-slate-700/40 pt-2 mt-1">
            <div className="flex items-center gap-1">
              {getElementIcon(sixthSign.element)}
              <span>{elementLabel(sixthSign.element)}</span>
            </div>
            <span>•</span>
            <div className={isTamil ? 'font-tamil' : ''}>
              {t('aruda_card.ruler')} <strong className="text-slate-200">{sixthSign.rulerEn}</strong>
            </div>
          </div>
        </div>

        {/* Card 4: Direction */}
        <div className="glass-panel-subtle rounded-xl p-4 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <span className={`text-xs uppercase tracking-wider text-emerald-300 font-medium ${isTamil ? 'font-tamil' : ''}`}>
            {t('aruda_card.primary_direction')}
          </span>
          <div className="my-2">
            <div className="flex items-center gap-2">
              <Compass className="w-7 h-7 text-emerald-400" />
              <span className={`text-2xl sm:text-3xl font-serif font-bold text-emerald-300 ${isTamil ? 'font-tamil' : ''}`}>
                {directionLabel(arudaSign.direction)}
              </span>
            </div>
            <div className={`text-xs text-slate-400 mt-1 ${isTamil ? 'font-tamil' : ''}`}>
              {t('aruda_card.sixth_direction')} <strong className="text-slate-200">{directionLabel(sixthSign.direction)}</strong>
            </div>
          </div>
          <span className={`text-xs text-slate-400 border-t border-slate-700/40 pt-2 mt-1 ${isTamil ? 'font-tamil' : ''}`}>
            {t('aruda_card.vedic_alignment')}
          </span>
        </div>
      </div>

      {/* Visual Trail */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 font-medium mb-2 flex items-center justify-between">
          <span className={isTamil ? 'font-tamil' : ''}>{t('aruda_card.rasi_flow')}</span>
          <span className="text-amber-400">
            {t('aruda_card.lagna')}: {isTamil ? arudaSign.nameTa : arudaSign.sanskritName} → 6th: {isTamil ? sixthSign.nameTa : sixthSign.sanskritName}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {ZODIAC_SIGNS.map((sign, idx) => {
            const isLagna = sign.id === arudaSign.id;
            const isSixth = sign.id === sixthSign.id;

            return (
              <div
                key={sign.id}
                className={`flex items-center shrink-0 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                  isLagna
                    ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold shadow-sm'
                    : isSixth
                    ? 'bg-rose-600/30 border-rose-400 text-white font-bold shadow-sm'
                    : 'bg-cosmic-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className="mr-1">{sign.symbol}</span>
                <span className={isTamil ? 'font-tamil text-[10px]' : ''}>{isTamil ? sign.nameTa.split(' ')[0] : sign.sanskritName}</span>
                {isLagna && (
                  <span className={`ml-1.5 text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded-full ${isTamil ? 'font-tamil' : ''}`}>
                    {t('aruda_card.lagna')}
                  </span>
                )}
                {isSixth && (
                  <span className="ml-1.5 text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                    6th
                  </span>
                )}
                {idx < 11 && <ArrowRight className="w-3 h-3 text-slate-600 ml-1.5 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
