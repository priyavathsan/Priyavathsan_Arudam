import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Printer } from 'lucide-react';
import { ARUDAM_MAPPINGS } from '../data/arudam';
import { ZODIAC_SIGNS } from '../data/signs';
import { PLANETS } from '../data/planets';
import { HOUSES } from '../data/houses';
import { getSignById } from '../data/signs';

interface ReferenceTableProps {
  onPrintReference: () => void;
}

export const ReferenceTable: React.FC<ReferenceTableProps> = ({ onPrintReference }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'all' | 'aruda' | 'signs' | 'planets' | 'houses' | 'gocharam'>('all');

  // Search logic across all datasets
  const searchLower = searchTerm.toLowerCase().trim();

  const filteredSigns = useMemo(() => {
    if (!searchLower) return ZODIAC_SIGNS;
    return ZODIAC_SIGNS.filter(s =>
      s.nameEn.toLowerCase().includes(searchLower) ||
      s.nameTa.toLowerCase().includes(searchLower) ||
      s.sanskritName.toLowerCase().includes(searchLower) ||
      s.direction.toLowerCase().includes(searchLower) ||
      s.locationClue.toLowerCase().includes(searchLower) ||
      s.locationKeywords.some(k => k.toLowerCase().includes(searchLower))
    );
  }, [searchLower]);

  const filteredPlanets = useMemo(() => {
    if (!searchLower) return PLANETS;
    return PLANETS.filter(p =>
      p.nameEn.toLowerCase().includes(searchLower) ||
      p.nameTa.toLowerCase().includes(searchLower) ||
      p.sixthSignInterpretation.toLowerCase().includes(searchLower) ||
      p.locationClue.toLowerCase().includes(searchLower) ||
      p.transitInterpretation.toLowerCase().includes(searchLower) ||
      p.keywords.some(k => k.toLowerCase().includes(searchLower)) ||
      p.locationKeywords.some(k => k.toLowerCase().includes(searchLower))
    );
  }, [searchLower]);

  const filteredHouses = useMemo(() => {
    if (!searchLower) return HOUSES;
    return HOUSES.filter(h =>
      h.nameEn.toLowerCase().includes(searchLower) ||
      h.nameTa.toLowerCase().includes(searchLower) ||
      h.sanskritName.toLowerCase().includes(searchLower) ||
      h.generalMeaning.toLowerCase().includes(searchLower) ||
      (h.missingObjectRelevance && h.missingObjectRelevance.toLowerCase().includes(searchLower)) ||
      h.transitMeaning.toLowerCase().includes(searchLower)
    );
  }, [searchLower]);

  const filteredArudam = useMemo(() => {
    if (!searchLower) return ARUDAM_MAPPINGS;
    return ARUDAM_MAPPINGS.filter(a => {
      const arudaSign = getSignById(a.arudaSignId);
      const sixthSign = getSignById(a.sixthSignId);
      return (
        a.number.toString().includes(searchLower) ||
        arudaSign.nameEn.toLowerCase().includes(searchLower) ||
        sixthSign.nameEn.toLowerCase().includes(searchLower) ||
        a.direction.toLowerCase().includes(searchLower)
      );
    });
  }, [searchLower]);

  return (
    <div className="space-y-6">
      {/* Top Search Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-200 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>Astrological Reference Library</span>
              <span className="font-tamil text-amber-400 text-sm font-normal">/ ஜோதிட ஆதாரக் குறிப்புகள்</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complete searchable encyclopedia for 1–12 Aruda mappings, 9 Grahas, 12 Bhavas, 12 Rasis, and Gocharam rules.
            </p>
          </div>

          <button
            onClick={onPrintReference}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-cosmic-950 font-bold text-xs sm:text-sm transition-all shadow-glow-gold self-start sm:self-auto no-print"
          >
            <Printer className="w-4 h-4" />
            <span>Print Reference</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search astrology clues... (e.g. "electronics", "kitchen", "water", "gold", "documents")'
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-cosmic-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Section Filters */}
        <div className="flex flex-wrap gap-2 text-xs no-print">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSection === 'all' ? 'bg-amber-500 text-cosmic-950 font-bold' : 'bg-cosmic-900 text-slate-300 hover:bg-cosmic-800'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveSection('aruda')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSection === 'aruda' ? 'bg-amber-500 text-cosmic-950 font-bold' : 'bg-cosmic-900 text-slate-300 hover:bg-cosmic-800'
            }`}
          >
            1–12 Aruda Map ({filteredArudam.length})
          </button>
          <button
            onClick={() => setActiveSection('signs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSection === 'signs' ? 'bg-amber-500 text-cosmic-950 font-bold' : 'bg-cosmic-900 text-slate-300 hover:bg-cosmic-800'
            }`}
          >
            12 Signs & Directions ({filteredSigns.length})
          </button>
          <button
            onClick={() => setActiveSection('planets')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSection === 'planets' ? 'bg-amber-500 text-cosmic-950 font-bold' : 'bg-cosmic-900 text-slate-300 hover:bg-cosmic-800'
            }`}
          >
            9 Planets Clues ({filteredPlanets.length})
          </button>
          <button
            onClick={() => setActiveSection('houses')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeSection === 'houses' ? 'bg-amber-500 text-cosmic-950 font-bold' : 'bg-cosmic-900 text-slate-300 hover:bg-cosmic-800'
            }`}
          >
            12 Bhavas ({filteredHouses.length})
          </button>
        </div>
      </div>

      {/* 1. Aruda Mappings Table */}
      {(activeSection === 'all' || activeSection === 'aruda') && (
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-serif font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>1–12 Arudam to Aruda Lagna & 6th Sign Reference</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cosmic-900/80 text-amber-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Number</th>
                  <th className="py-2.5 px-3">Aruda Lagna</th>
                  <th className="py-2.5 px-3">Tamil Name</th>
                  <th className="py-2.5 px-3">6th Sign</th>
                  <th className="py-2.5 px-3">6th Sign (Tamil)</th>
                  <th className="py-2.5 px-3">Cardinal Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredArudam.map(m => {
                  const aruda = getSignById(m.arudaSignId);
                  const sixth = getSignById(m.sixthSignId);
                  return (
                    <tr key={m.number} className="hover:bg-cosmic-900/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400 text-sm">#{m.number}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">
                        <span className="mr-1.5">{aruda.symbol}</span>
                        {aruda.nameEn}
                      </td>
                      <td className="py-2.5 px-3 font-tamil text-slate-300">{aruda.nameTa}</td>
                      <td className="py-2.5 px-3 font-semibold text-rose-300">
                        <span className="mr-1.5">{sixth.symbol}</span>
                        {sixth.nameEn}
                      </td>
                      <td className="py-2.5 px-3 font-tamil text-slate-300">{sixth.nameTa}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-emerald-300">{m.direction}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 2. 12 Signs & Directions Table */}
      {(activeSection === 'all' || activeSection === 'signs') && (
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-serif font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>12 Zodiac Signs, Directions & Location Clues</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSigns.map(sign => (
              <div key={sign.id} className="glass-panel-subtle rounded-xl p-3.5 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-amber-400">{sign.symbol}</span>
                    <h4 className="font-bold text-white text-sm">{sign.nameEn} ({sign.nameTa.split(' ')[0]})</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cosmic-950 text-emerald-300 border border-emerald-500/30">
                    {sign.direction}
                  </span>
                </div>
                <div className="text-xs text-slate-300 my-1 bg-cosmic-950/60 p-2 rounded border border-slate-800">
                  <strong className="text-amber-400">Clue: </strong>"{sign.locationClue}"
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                  <span>Element: {sign.element}</span>
                  <span>Ruler: {sign.rulerEn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. 9 Planets Table */}
      {(activeSection === 'all' || activeSection === 'planets') && (
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-serif font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>9 Planets Traditional Clues & Interpretations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlanets.map(planet => (
              <div key={planet.id} className="glass-panel-subtle rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-amber-400">{planet.symbol}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{planet.nameEn} ({planet.nameTa})</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{planet.sanskritName}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {planet.keywords.slice(0, 2).map((k, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-rose-400 block mb-0.5">6th-Sign Interpretation:</strong>
                  "{planet.sixthSignInterpretation}"
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-amber-400 block mb-0.5">Physical Location Clue:</strong>
                  "{planet.locationClue}"
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-indigo-400 block mb-0.5">Gocharam Transit Meaning:</strong>
                  "{planet.transitInterpretation}"
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 12 Houses Table */}
      {(activeSection === 'all' || activeSection === 'houses') && (
        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-serif font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>12 Houses (Bhavas) Meanings & Missing Object Relevance</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cosmic-900/80 text-amber-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">House</th>
                  <th className="py-2.5 px-3">Bhava Name</th>
                  <th className="py-2.5 px-3">General Meaning</th>
                  <th className="py-2.5 px-3">Missing-Object Relevance</th>
                  <th className="py-2.5 px-3">Transit Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredHouses.map(h => (
                  <tr key={h.number} className="hover:bg-cosmic-900/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400 text-sm">
                      {h.number}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{h.nameEn}</div>
                      <div className="text-[11px] font-tamil text-slate-400">{h.nameTa}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs">{h.generalMeaning}</td>
                    <td className="py-2.5 px-3 text-amber-200/90 font-medium max-w-xs">
                      {h.missingObjectRelevance ? `"${h.missingObjectRelevance}"` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs">{h.transitMeaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
