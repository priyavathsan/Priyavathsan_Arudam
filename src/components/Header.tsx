import React from 'react';
import { Compass, Sparkles, Printer, BookOpen, LayoutDashboard, Search, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: 'dashboard' | 'reference' | 'search';
  setActiveTab: (tab: 'dashboard' | 'reference' | 'search') => void;
  onLoadExample: () => void;
  onPrintAnalysis: () => void;
  onPrintReference: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLoadExample,
  onPrintAnalysis,
  onPrintReference
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <header className="glass-panel border-b border-amber-500/20 sticky top-0 z-40 bg-cosmic-950/90 backdrop-blur-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo & Title & Astrologer Credit */}
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-400/40 flex items-center justify-center shadow-glow-gold shrink-0">
              <Compass className="w-7 h-7 text-amber-400 animate-[spin_60s_linear_infinite]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-wide gold-gradient-text uppercase">
                  {t('app.title')}
                </h1>
                {!isTamil && (
                  <span className="text-sm font-tamil text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    ஆருடம் / பிரசன்னம்
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <p className={`text-xs text-slate-400 hidden sm:block ${isTamil ? 'font-tamil' : ''}`}>
                  {t('app.subtitle')}
                </p>
                <span className="hidden sm:inline text-slate-600">•</span>
                <div className="flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <span className={isTamil ? 'font-tamil' : ''}>
                    {t('app.predicted_by')} <strong className="text-amber-200 font-semibold">Priyavathsan Sridharan Iyengar</strong>
                  </span>
                  <span className="text-slate-500">|</span>
                  <a
                    href="tel:+919486483808"
                    title="Call +91-9486483808"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/919486483808"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp +91-9486483808"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span className="font-mono text-emerald-300 font-semibold">+91-9486483808</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Language Toggle + Navigation Tabs + Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">

            {/* ── Language Toggle ── */}
            <button
              onClick={toggleLanguage}
              title={isTamil ? 'Switch to English' : 'தமிழில் மாற்று'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium
                         bg-gradient-to-r from-violet-600/30 to-indigo-600/30
                         hover:from-violet-600/50 hover:to-indigo-600/50
                         border border-violet-500/40 text-violet-200
                         transition-all hover:scale-105 active:scale-95 shadow-sm no-print"
            >
              <Languages className="w-4 h-4 text-violet-400" />
              <span className="hidden sm:inline">
                {isTamil ? 'English' : 'தமிழ்'}
              </span>
              {/* pill badge */}
              <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-400/40 text-[10px] font-bold tracking-wide text-violet-300">
                {isTamil ? 'EN' : 'TA'}
              </span>
            </button>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-cosmic-900 border border-slate-700/60 no-print">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-cosmic-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-cosmic-800'
                } ${isTamil ? 'font-tamil' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('header.tab.analysis')}</span>
              </button>
              <button
                onClick={() => setActiveTab('reference')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'reference'
                    ? 'bg-amber-500 text-cosmic-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-cosmic-800'
                } ${isTamil ? 'font-tamil' : ''}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('header.tab.reference')}</span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-amber-500 text-cosmic-950 shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-cosmic-800'
                } ${isTamil ? 'font-tamil' : ''}`}
              >
                <Search className="w-4 h-4" />
                <span>{t('header.tab.search')}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={onLoadExample}
                title="Load standard example (Number 8, Scorpio, Mercury 8th house)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-600/30 to-amber-700/30 hover:from-amber-600/50 hover:to-amber-700/50 border border-amber-500/40 text-amber-200 transition-all hover:scale-105 active:scale-95 shadow-sm ${isTamil ? 'font-tamil' : ''}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('header.load_example')}</span>
              </button>

              {activeTab === 'dashboard' ? (
                <button
                  onClick={onPrintAnalysis}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-cosmic-800 hover:bg-cosmic-700 border border-slate-700 text-slate-200 transition-all hover:scale-105 active:scale-95 ${isTamil ? 'font-tamil' : ''}`}
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('header.print_analysis')}</span>
                </button>
              ) : (
                <button
                  onClick={onPrintReference}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-cosmic-800 hover:bg-cosmic-700 border border-slate-700 text-slate-200 transition-all hover:scale-105 active:scale-95 ${isTamil ? 'font-tamil' : ''}`}
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('header.print_reference')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
