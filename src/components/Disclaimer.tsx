import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Disclaimer: React.FC = () => {
  const { t, language } = useLanguage();
  return (
    <div className="glass-panel-subtle rounded-xl p-3 sm:p-4 border border-amber-500/20 bg-amber-500/5 text-amber-200/90 text-xs sm:text-sm flex items-start gap-3 my-4">
      <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div className={language === 'ta' ? 'font-tamil' : ''}>
        <span className="font-semibold text-amber-300">{t('disclaimer.title')} </span>
        {t('disclaimer.body')}
      </div>
    </div>
  );
};
