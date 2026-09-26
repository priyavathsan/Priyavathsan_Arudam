import React, { useState } from 'react';
import { Shield, Eye, Lock, Home, MapPin, CheckCircle2 } from 'lucide-react';
import { ZodiacSignInfo } from '../types/astrology';
import { HOUSES, getKeyMissingHouses } from '../data/houses';
import { getHouseFromAruda, getOrdinal } from '../utils/astrology';
import { useLanguage } from '../context/LanguageContext';

interface HouseAnalysisCardProps {
  arudaSign: ZodiacSignInfo;
  selectedHouseNumber: number;
  onSelectHouse: (houseNumber: number) => void;
}

export const HouseAnalysisCard: React.FC<HouseAnalysisCardProps> = ({
  arudaSign,
  selectedHouseNumber,
  onSelectHouse
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [viewAll, setViewAll] = useState<boolean>(false);

  const keyHouses = getKeyMissingHouses();
  const displayedHouses = viewAll ? HOUSES : keyHouses;

  const getHouseIcon = (num: number) => {
    switch (num) {
      case 2:
        return <Shield className="w-4 h-4 text-amber-400" />;
      case 4:
        return <Home className="w-4 h-4 text-emerald-400" />;
      case 7:
        return <Eye className="w-4 h-4 text-indigo-400" />;
      case 8:
        return <Lock className="w-4 h-4 text-rose-400" />;
      case 12:
        return <MapPin className="w-4 h-4 text-cyan-400" />;
      default:
        return null;
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-200 flex items-center gap-2">
            <span className={isTamil ? 'font-tamil' : ''}>
              {isTamil ? 'ஆருட லக்னம் பாவ பகுப்பாய்வு' : 'Aruda Lagna House Analysis'}
            </span>
            {!isTamil && <span className="font-tamil text-amber-400 text-sm font-normal">/ பாவ பலன் ஆய்வு</span>}
          </h2>
          <p className={`text-xs sm:text-sm text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil
              ? `${isTamil ? arudaSign.nameTa : arudaSign.nameEn} லக்னத்திலிருந்து சொத்து, உள்ளறை, வெளிப்புற, மறைந்த மற்றும் தொலைதூர இடங்களுக்கான பாரம்பரிய சுவடுகள்.`
              : `Traditional indicators for stored possessions, interior rooms, external persons, hidden corners, and distant locations relative to ${arudaSign.nameEn} Lagna.`
            }
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto no-print">
          <button
            onClick={() => setViewAll(!viewAll)}
            className={`text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-cosmic-850 hover:bg-cosmic-800 text-slate-300 font-medium transition-all ${isTamil ? 'font-tamil' : ''}`}
          >
            {viewAll
              ? (isTamil ? 'முக்கிய பாவங்கள் காட்டு (2, 4, 7, 8, 12)' : 'Show Key Houses (2, 4, 7, 8, 12)')
              : (isTamil ? 'அனைத்து 12 பாவங்களும் காண்க' : 'View All 12 Houses')
            }
          </button>
        </div>
      </div>

      {/* Houses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {displayedHouses.map(house => {
          const isSelected = selectedHouseNumber === house.number;
          const correspondingSign = getHouseFromAruda(arudaSign, house.number);

          return (
            <div
              key={house.number}
              onClick={() => onSelectHouse(house.number)}
              className={`rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'glass-panel-gold border-amber-400 shadow-glow-gold scale-[1.01]'
                  : 'glass-panel-subtle hover:bg-cosmic-800/80 hover:border-slate-600'
              }`}
            >
              <div>
                {/* Header: House Number + Sanskrit / Tamil Name */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-cosmic-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
                      {house.number}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-tight">
                        {house.number}{getOrdinal(house.number)} {isTamil ? 'பாவம்' : 'House'}
                      </h3>
                      <span className="text-[11px] font-tamil text-slate-400">
                        {house.nameTa}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selected
                    </span>
                  ) : (
                    getHouseIcon(house.number)
                  )}
                </div>

                {/* Corresponding Sign from Aruda Lagna */}
                <div className="flex items-center justify-between text-xs bg-cosmic-950/60 px-3 py-1.5 rounded-lg border border-slate-800 my-2.5">
                  <span className={`text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
                    {isTamil ? 'தொடர்புடைய ராசி:' : 'Corresponding Sign:'}
                  </span>
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <span>{correspondingSign.symbol}</span>
                    <span className={isTamil ? 'font-tamil' : ''}>{isTamil ? correspondingSign.nameTa : correspondingSign.nameEn}</span>
                    <span className="text-[10px] text-slate-400">({correspondingSign.direction})</span>
                  </span>
                </div>

                {/* General Meaning */}
                <div className="text-xs text-slate-300 mb-2">
                  <span className="text-slate-400 font-medium">General Meaning: </span>
                  {house.generalMeaning}
                </div>

                {/* Missing-object relevance (critical rule) */}
                {house.missingObjectRelevance && (
                  <div className="text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 my-2">
                    <span className="font-semibold text-amber-400 block mb-0.5">
                      Missing-Object Relevance:
                    </span>
                    "{house.missingObjectRelevance}"
                  </div>
                )}
              </div>

              {/* Transit hint footer */}
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                <span className="text-slate-400">Transit Influence: </span>
                <span className="text-slate-300">{house.transitMeaning}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
