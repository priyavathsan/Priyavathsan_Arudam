import React, { useState, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { NumberSelector } from './components/NumberSelector';
import { ArudamResult } from './components/ArudamResult';
import { SouthIndianRasiChart } from './chart/SouthIndianRasiChart';
import { KocharaDetails } from './components/KocharaDetails';
import { QuestionAnalysis } from './components/QuestionAnalysis';
import { ResolutionPanel } from './components/ResolutionPanel';
import { ChandranTimingCard } from './components/ChandranTimingCard';
import { PredictionPanel } from './components/PredictionPanel';
import { RuleTrace } from './components/RuleTrace';
import { CalculationInfoPanel } from './components/CalculationInfoPanel';
import { AstrologerProfiles } from './components/AstrologerProfiles';

// Existing preserved components
import { MissingObjectCard } from './components/MissingObjectCard';
import { HouseAnalysisCard } from './components/HouseAnalysisCard';
import { NinePlanetsCard } from './components/NinePlanetsCard';
import { SignPlanetLocationCluesCard } from './components/SignPlanetLocationCluesCard';
import { ReferenceTable } from './components/ReferenceTable';
import { PrintReport } from './components/PrintReport';

// Calculation layer
import { calculateArudaLagnam } from './arudam/arudamCalculator';
import { calculateSixthRasi } from './arudam/sixthRasiCalculator';
import { calculateTransitPositions, TransitCalculationResult } from './kochara/transitCalculator';
import { classifyClientQuestion } from './arudam/questionClassifier';
import { generateArudamPrediction } from './arudam/predictionEngine';

// Existing helpers preserved
import {
  calculateAruda,
  getSixthSign,
  getHouseFromAruda,
  generateCombinedInterpretation,
  autoDetectMissingObjectClues
} from './utils/astrology';
import { useLanguage } from './context/LanguageContext';

export const App: React.FC = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reference' | 'search'>('dashboard');

  // Core Arudam State (Default to example 5 as highlighted in user specification Phase 47, or 8)
  const [selectedNumber, setSelectedNumber] = useState<number>(5);

  // Chart Mode: Combined, Arudam, Kochara
  const [chartMode, setChartMode] = useState<'combined' | 'arudam' | 'kochara'>('combined');

  // Transit Date/Time state
  const [transitDate, setTransitDate] = useState<Date>(new Date());

  // Interactive Selected Question Category
  const [selectedCategory, setSelectedCategory] = useState<string>('lost_object');

  // Preserved interactive missing object state
  const [objectName, setObjectName] = useState<string>('Mobile phone');
  const [selectedHouseNum, setSelectedHouseNum] = useState<number>(8);
  const [selectedSignId, setSelectedSignId] = useState<number>(3); // Gemini
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('mercury');

  // Ref for scrolling to prediction on "Calculate Arudam" click
  const predictionRef = useRef<HTMLDivElement>(null);

  // 1. Aruda Lagnam Calculation
  const arudaCalc = useMemo(() => calculateArudaLagnam(selectedNumber), [selectedNumber]);

  // 2. 6th Rasi Calculation
  const sixthCalc = useMemo(() => calculateSixthRasi(arudaCalc.arudaRasi), [arudaCalc.arudaRasi]);

  // 3. Dynamic Real Kochara Transit Calculation
  const transitResult = useMemo<TransitCalculationResult>(() => {
    return calculateTransitPositions(transitDate);
  }, [transitDate]);

  // 4. Rule-Based Question Classification (Explicit, non-LLM)
  const classifiedQuestions = useMemo(() => {
    return classifyClientQuestion({
      selectedNumber,
      arudaRasi: arudaCalc.arudaRasi,
      sixthRasi: sixthCalc.sixthRasi,
      sixthLord: sixthCalc.sixthLord,
      transitPlanets: transitResult.planets
    });
  }, [selectedNumber, arudaCalc.arudaRasi, sixthCalc.sixthRasi, sixthCalc.sixthLord, transitResult.planets]);

  // 5. Central Arudam Master Prediction Engine
  const masterPrediction = useMemo(() => {
    return generateArudamPrediction({
      selectedNumber,
      arudaRasi: arudaCalc.arudaRasi,
      sixthRasi: sixthCalc.sixthRasi,
      sixthLord: sixthCalc.sixthLord,
      transitPlanets: transitResult.planets,
      classifiedQuestions,
      prasnaDateTime: transitDate
    });
  }, [selectedNumber, arudaCalc.arudaRasi, sixthCalc.sixthRasi, sixthCalc.sixthLord, transitResult.planets, classifiedQuestions, transitDate]);

  // Preserved legacy compatibility combined result
  const legacyArudaSign = useMemo(() => calculateAruda(selectedNumber), [selectedNumber]);
  const legacySixthSign = useMemo(() => getSixthSign(legacyArudaSign), [legacyArudaSign]);
  const combinedLegacyResult = useMemo(() => {
    return generateCombinedInterpretation({
      arudamNumber: selectedNumber,
      missingObjectName: objectName,
      selectedHouse: selectedHouseNum,
      selectedSignId: selectedSignId,
      selectedPlanet: selectedPlanetId,
      transitPlanet: selectedPlanetId,
      transitHouse: selectedHouseNum
    });
  }, [selectedNumber, objectName, selectedHouseNum, selectedSignId, selectedPlanetId]);

  // Handle number change
  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num);
    const newAruda = calculateAruda(num);
    const newCorrSign = getHouseFromAruda(newAruda, selectedHouseNum);
    setSelectedSignId(newCorrSign.id);

    if (objectName.trim()) {
      const detected = autoDetectMissingObjectClues(objectName);
      const houseForObj = detected.suggestedHouseNum;
      const signForObj = getHouseFromAruda(newAruda, houseForObj);
      setSelectedHouseNum(houseForObj);
      setSelectedSignId(signForObj.id);
      setSelectedPlanetId(detected.suggestedPlanetId);
    }
  };

  const handleCalculateClick = () => {
    if (predictionRef.current) {
      predictionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHouse = (houseNum: number) => {
    setSelectedHouseNum(houseNum);
    const corrSign = getHouseFromAruda(legacyArudaSign, houseNum);
    setSelectedSignId(corrSign.id);
  };

  const handleAutoAnalyze = () => {
    if (!objectName.trim()) return;
    const detected = autoDetectMissingObjectClues(objectName);
    setSelectedPlanetId(detected.suggestedPlanetId);
    setSelectedHouseNum(detected.suggestedHouseNum);
    const corrSign = getHouseFromAruda(legacyArudaSign, detected.suggestedHouseNum);
    setSelectedSignId(corrSign.id);
  };

  const handleLoadExample = () => {
    setSelectedNumber(5); // Leo example mode (Phase 47)
    setObjectName('Important document');
    setSelectedHouseNum(6); // Capricorn
    setSelectedSignId(10);
    setSelectedPlanetId('saturn');
    setActiveTab('dashboard');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-cosmic-950 text-slate-100">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadExample={handleLoadExample}
        onPrintAnalysis={handlePrint}
        onPrintReference={handlePrint}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 no-print">
        {/* Important Traditional Disclaimer */}
        <Disclaimer />

        {/* Astrologer Profiles Section */}
        {activeTab === 'dashboard' && (
          <div className="mb-6">
            <div className="mb-4">
              <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-2">
                {isTamil ? 'நன்றி' : 'Credits'}
              </span>
            </div>
            <AstrologerProfiles />
          </div>
        )}

        {/* Tab 1: Analysis Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 1. Step 1: Number Selection (1–12) */}
            <NumberSelector
              selectedNumber={selectedNumber}
              onSelectNumber={handleSelectNumber}
              onCalculateArudam={handleCalculateClick}
            />

            {/* 2. Step 2: Aruda Lagnam & 6th Rasi Calculation Result */}
            <ArudamResult
              selectedNumber={selectedNumber}
              arudaResult={arudaCalc}
              sixthResult={sixthCalc}
            />

            {/* 3. South Indian Charts Section (Phases 6, 7, 10, 28, 29) */}
            <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
                    {isTamil ? 'தென் இந்திய ராசி கட்டங்கள்' : 'South Indian Rasi Charts'}
                  </span>
                  <h3 className={`text-xl font-serif font-bold text-amber-300 ${isTamil ? 'font-tamil' : ''}`}>
                    {isTamil ? 'ஆருட & கோச்சார கட்டம்' : 'Arudam & Kochara Rasi Chart'}
                  </h3>
                </div>

                {/* Chart Mode Switcher */}
                <div className="flex items-center gap-1.5 bg-cosmic-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setChartMode('combined')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      chartMode === 'combined'
                        ? 'bg-amber-500 text-cosmic-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isTamil ? 'இணைந்த கட்டம்' : 'Combined'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('arudam')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      chartMode === 'arudam'
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isTamil ? 'ஆருடம் மட்டும்' : 'Arudam Only'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('kochara')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      chartMode === 'kochara'
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isTamil ? 'கோச்சாரம் மட்டும்' : 'Kochara Only'}
                  </button>
                </div>
              </div>

              {/* Rasi Chart */}
              <SouthIndianRasiChart
                arudaRasi={chartMode !== 'kochara' ? arudaCalc.arudaRasi : undefined}
                sixthRasi={chartMode !== 'kochara' ? sixthCalc.sixthRasi : undefined}
                planets={chartMode !== 'arudam' ? transitResult.planets : []}
                language={language}
                titleTa={
                  chartMode === 'arudam'
                    ? 'ஆருட லக்னம் & 6ஆம் ராசி கட்டம்'
                    : chartMode === 'kochara'
                    ? 'கோச்சார ராசி கட்டம்'
                    : 'ஆருடம் & கோச்சார ஒருங்கிணைந்த கட்டம்'
                }
                titleEn={
                  chartMode === 'arudam'
                    ? 'Aruda Lagna & 6th Rasi Chart'
                    : chartMode === 'kochara'
                    ? 'Kochara Transit Rasi Chart'
                    : 'Arudam & Kochara Combined Chart'
                }
              />
            </section>

            {/* 4. Step 3: Kochara Planetary Transits (Phases 8, 9, 10, 11) */}
            <KocharaDetails
              transitResult={transitResult}
              onDateChange={(newDate) => setTransitDate(newDate)}
            />

            {/* 5. Step 4: Rule-based Question Classifier (Phases 13, 14, 15) */}
            <QuestionAnalysis
              questions={classifiedQuestions}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* 6. Phase 53 — Resolution / Fulfilment Panel */}
            <ResolutionPanel resolution={masterPrediction.prasnaResolution} />

            {/* 6b. Section 15 — 🌙 Chandran மூலம் கிடைக்கும் காலம் / Chandran-Based Finding Time */}
            <ChandranTimingCard timingResult={masterPrediction.chandranFindingTime} />

            {/* 7. Step 5: Master Arudam Prediction Panel (Phases 16-19, 26, 46) */}
            <div ref={predictionRef}>
              <PredictionPanel
                prediction={masterPrediction}
                onPrint={handlePrint}
              />
            </div>

            {/* 7. Step 6: "Why this prediction?" Rule Trace Flow (Phase 25) */}
            <RuleTrace
              steps={masterPrediction.ruleTraceSteps}
              matchedRules={masterPrediction.matchedRules}
            />

            {/* 8. Preserved Interactive Missing Object Analysis Card */}
            <div className="border-t border-slate-800/80 pt-6">
              <h3 className={`text-lg font-serif font-bold text-amber-300 mb-4 flex items-center gap-2 ${isTamil ? 'font-tamil' : ''}`}>
                <span>📦</span>
                <span>{isTamil ? 'காணாமல் போன பொருள் பிரத்யேக தேடல்' : 'Interactive Missing Object Specific Search'}</span>
              </h3>
              <MissingObjectCard
                arudaSign={legacyArudaSign}
                objectName={objectName}
                setObjectName={setObjectName}
                selectedPlanetId={selectedPlanetId}
                setSelectedPlanetId={setSelectedPlanetId}
                selectedHouseNum={selectedHouseNum}
                setSelectedHouseNum={handleSelectHouse}
                selectedSignId={selectedSignId}
                setSelectedSignId={setSelectedSignId}
                onAutoAnalyze={handleAutoAnalyze}
                traditionalClueText={combinedLegacyResult.traditionalClueText}
              />
            </div>

            {/* 9. Preserved House Analysis Card */}
            <HouseAnalysisCard
              arudaSign={legacyArudaSign}
              selectedHouseNumber={selectedHouseNum}
              onSelectHouse={handleSelectHouse}
            />

            {/* 10. Preserved 9 Planets Card for 6th Sign */}
            <NinePlanetsCard
              sixthSign={legacySixthSign}
              selectedPlanetId={selectedPlanetId}
              onSelectPlanet={setSelectedPlanetId}
            />

            {/* 11. Preserved Sign & Planet Location Clues Card */}
            <SignPlanetLocationCluesCard
              highlightSignId={selectedSignId}
              highlightPlanetId={selectedPlanetId}
              onSelectSign={setSelectedSignId}
              onSelectPlanet={setSelectedPlanetId}
            />

            {/* 12. Calculation Info & Developer Debug Panel (Phases 32 & 48) */}
            <CalculationInfoPanel
              transitResult={transitResult}
              prediction={masterPrediction}
            />
          </div>
        )}

        {/* Tab 2 & 3: Reference Library & Search */}
        {(activeTab === 'reference' || activeTab === 'search') && (
          <ReferenceTable onPrintReference={handlePrint} />
        )}
      </main>

      {/* Clean Print Layout (Triggered only on browser print) */}
      <PrintReport
        selectedNumber={selectedNumber}
        arudaRasi={arudaCalc.arudaRasi}
        sixthRasi={sixthCalc.sixthRasi}
        sixthLord={sixthCalc.sixthLord}
        transitPlanets={transitResult.planets}
        prediction={masterPrediction}
        objectName={objectName}
      />

      {/* Footer with Mandatory Attribution */}
      <footer className="glass-panel border-t border-slate-800 py-6 text-center text-xs text-slate-400 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className={`font-serif font-bold text-amber-400 ${isTamil ? 'font-tamil' : ''}`}>
              {t('footer.system')}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className={`text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'பாரம்பரிய தமிழ் ஆருட பிரசன்ன கணிப்பு முறை' : 'Traditional Tamil Arudam Prasna System'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-cosmic-900/90 px-4 py-2 rounded-xl border border-amber-500/20 shadow-md">
            <span className={`text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'கணிப்பவர்:' : 'Predicted by:'}{' '}
              <strong className="text-amber-300 font-semibold">Priyavathsan Sridharan Iyengar</strong>
            </span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <a
                href="tel:+919486483808"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 transition-colors"
                title="Call +91-9486483808"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="font-mono text-[11px]">+91-9486483808</span>
              </a>
              <a
                href="https://wa.me/919486483808"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 transition-colors"
                title="WhatsApp +91-9486483808"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span className="font-mono text-[11px]">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
