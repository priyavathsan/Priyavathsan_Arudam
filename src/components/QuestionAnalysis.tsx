import React from 'react';
import { ClassifiedQuestion } from '../arudam/questionClassifier';
import { useLanguage } from '../context/LanguageContext';

export interface QuestionAnalysisProps {
  questions: ClassifiedQuestion[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const QuestionAnalysis: React.FC<QuestionAnalysisProps> = ({
  questions,
  selectedCategory,
  onSelectCategory
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const getBadgeStyle = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300';
      case 'moderate':
        return 'bg-indigo-950/80 border-indigo-500/60 text-indigo-300';
      case 'possible':
        return 'bg-amber-950/80 border-amber-500/60 text-amber-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Header */}
      <div className="mb-5 border-b border-slate-800 pb-4">
        <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
          {isTamil ? 'படி 4: கேள்வியின் தன்மை நிர்ணயம்' : 'Step 4: Question Identification'}
        </span>
        <h2 className={`text-xl sm:text-2xl font-serif font-bold text-amber-300 ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil
            ? 'இந்த நபர் என்ன கேள்வியுடன் என்னிடம் வந்திருக்கிறார்?'
            : 'What question is this client likely carrying in their mind?'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isTamil
            ? 'ஆருட லக்னம் மற்றும் 6-ஆம் ராசி விதிகளின் அடிப்படையில் கண்டறியப்பட்ட சாத்தியக்கூறுகள் (விதி சார்ந்த பகுப்பாய்வு; யூகம் அல்ல)'
            : 'Rule-based inference derived from Aruda Lagna and 6th House axis (Explicit traditional rules, never arbitrary)'}
        </p>
      </div>

      {/* Inferred Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q) => {
          const isSelected = selectedCategory === q.category;

          return (
            <div
              key={q.category}
              onClick={() => onSelectCategory && onSelectCategory(q.category)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-cosmic-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                  : 'bg-cosmic-950/70 border-slate-800 hover:border-slate-700 hover:bg-cosmic-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className={`text-base font-bold text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil ? q.categoryNameTa : q.categoryNameEn}
                </h3>
                <span
                  className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(
                    q.strength
                  )} ${isTamil ? 'font-tamil' : ''}`}
                >
                  {isTamil ? q.strengthLabelTa : q.strengthLabelEn}
                </span>
              </div>

              <p className={`text-xs text-slate-300 leading-relaxed mb-3 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? q.explanationTamil : q.explanationEnglish}
              </p>

              {/* Matched rule IDs */}
              {q.matchedRules.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isTamil ? 'விதிகள்:' : 'Rules:'}
                  </span>
                  {q.matchedRules.map((r) => (
                    <span
                      key={r.id}
                      className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-300/80 border border-slate-700"
                    >
                      {r.id}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
