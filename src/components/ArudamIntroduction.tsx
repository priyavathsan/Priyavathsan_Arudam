import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ProcessFlow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 font-semibold leading-relaxed text-amber-100">
    {children}
  </p>
);

export const ArudamIntroduction: React.FC = () => {
  const { language: appLanguage } = useLanguage();
  const [contentLanguage, setContentLanguage] = useState(appLanguage);
  const isTamil = contentLanguage === 'ta';

  useEffect(() => {
    setContentLanguage(appLanguage);
  }, [appLanguage]);

  return (
    <section
      aria-labelledby="arudam-introduction-title"
      className="glass-panel-subtle mb-4 rounded-xl border border-amber-500/20 p-4 sm:p-6"
    >
      <header className="mb-5 flex flex-col gap-3 border-b border-slate-700/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="arudam-introduction-title" className={`text-xl font-bold text-amber-200 sm:text-2xl ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil ? 'ஆரூடம் என்றால் என்ன?' : 'What is Arudam?'}
        </h2>
        <div className="flex w-fit gap-1 rounded-lg border border-slate-700 bg-cosmic-950 p-1" aria-label="Introduction language">
          <button
            type="button"
            onClick={() => setContentLanguage('en')}
            aria-pressed={!isTamil}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${!isTamil ? 'bg-amber-500 text-cosmic-950' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setContentLanguage('ta')}
            aria-pressed={isTamil}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isTamil ? 'bg-amber-500 text-cosmic-950' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            தமிழ்
          </button>
        </div>
      </header>

      <div className="space-y-7">
        {isTamil ? (
          <article lang="ta" className="font-tamil space-y-4 text-sm leading-relaxed text-slate-200 sm:text-base">
        <section className="space-y-3">
          <p><strong className="text-amber-100">ஆரூடம் (Arudam / Aarudam)</strong> என்பது ஒருவர் மனதில் இருக்கும் ஒரு குறிப்பிட்ட கேள்வி, சந்தேகம் அல்லது நோக்கத்திற்கு, அந்த நேரத்தில் தேர்ந்தெடுக்கப்படும் எண்ணை அடிப்படையாகக் கொண்டு ஜோதிட முறையில் பலன் அறியும் ஒரு பாரம்பரிய <strong className="text-amber-100">பிரசன்ன (Prasanna) ஜோதிட முறையாகும்</strong>.</p>
          <p className="font-semibold text-amber-100">எளிமையாகச் சொன்னால்:</p>
          <blockquote className="border-l-2 border-amber-400 pl-4 text-slate-100">
            <strong>“கேள்வி கேட்கும் நேரத்தில், கேட்பவர் தேர்ந்தெடுக்கும் எண்ணின் மூலம் ஆரூட ராசியை நிர்ணயித்து, அதிலிருந்து கேள்விக்கான பலனை ஆராய்வது ஆரூட முறையாகும்.”</strong>
          </blockquote>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-amber-200 sm:text-lg">ஆரூடம் எவ்வாறு நிர்ணயிக்கப்படுகிறது?</h3>
          <p>கேள்வி கேட்பவரிடம் பொதுவாக <strong className="text-amber-100">1 முதல் 12 வரை ஒரு எண்ணைத் தேர்ந்தெடுக்க</strong>ச் சொல்வார்கள்.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-amber-200 sm:text-lg">ஆரூட ராசியிலிருந்து பலன்</h3>
          <p>ஆரூட ராசி நிர்ணயிக்கப்பட்ட பிறகு, கேள்வியின் தன்மைக்கு ஏற்ப <strong className="text-amber-100">பாவங்கள், கிரகங்கள், ராசிகள், சந்திரன், நட்சத்திரம் மற்றும் தொடர்புடைய ஜோதிடக் காரணிகள்</strong> ஆராயப்படுகின்றன.</p>
          <p>இந்த இணையதளத்தில் பயன்படுத்தப்படும் ஆரூட முறையின் அடிப்படை செயல்முறை:</p>
          <ProcessFlow>கேள்வி → 1–12 எண்ணைத் தேர்வு → ஆரூட ராசி நிர்ணயம் → 6ஆம் பாவத்தை ஆராய்தல் → தொடர்புடைய கிரகங்கள் மற்றும் காரணிகளை ஆய்வு செய்தல் → பலன்</ProcessFlow>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-amber-200 sm:text-lg">ஆரூடம் எதற்காகப் பயன்படுத்தப்படுகிறது?</h3>
          <p>ஆரூடம் என்பது பொதுவான ஜாதகப் பலனைப் பார்ப்பதைவிட, <strong className="text-amber-100">ஒரு குறிப்பிட்ட நேரத்தில் கேட்கப்படும் ஒரு குறிப்பிட்ட கேள்விக்கான பலனை ஆராய்வதை</strong> மையமாகக் கொண்டது.</p>
          <p>உதாரணமாக:</p>
          <ul className="list-disc space-y-1 pl-5 marker:text-amber-400">
            <li>தொலைந்த பொருள் கிடைக்குமா?</li>
            <li>ஒரு குறிப்பிட்ட காரியம் நிறைவேறுமா?</li>
            <li>ஒரு பிரச்சினை தீருமா?</li>
            <li>எதிர்பார்க்கும் செய்தி கிடைக்குமா?</li>
            <li>ஒரு முயற்சி வெற்றி பெறுமா?</li>
            <li>காரியம் எப்போது நிறைவேறும்?</li>
          </ul>
        </section>
          </article>
        ) : (
          <article lang="en" className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
        <section className="space-y-3">
          <p><strong className="text-amber-100">Arudam (Aarudam)</strong> is a traditional <strong className="text-amber-100">Prasanna (horary astrology) method</strong> used to seek guidance about a specific question, doubt, or intention that is in a person's mind at a particular moment.</p>
          <p className="font-semibold text-amber-100">In simple terms:</p>
          <blockquote className="border-l-2 border-amber-400 pl-4 text-slate-100">
            <strong>“Arudam is a method of determining an Arudam Rasi based on a number chosen by the person asking the question, and then interpreting that Rasi and its associated astrological factors to understand the outcome of the question.”</strong>
          </blockquote>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-amber-200 sm:text-lg">How is Arudam determined?</h3>
          <p>Traditionally, the person seeking an answer is asked to <strong className="text-amber-100">choose a number from 1 to 12</strong>.</p>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-amber-200 sm:text-lg">How is the prediction made?</h3>
          <p>Once the Arudam Rasi is determined, the relevant <strong className="text-amber-100">Bhavas (houses), planets, Rasis, Moon, Nakshatra, and other prescribed astrological factors</strong> are examined according to the Arudam method being followed.</p>
          <p>For this website, the basic process is:</p>
          <ProcessFlow>Question → Choose a number from 1–12 → Determine Arudam Rasi → Examine the 6th Bhava → Analyze the relevant planets and factors → Prediction</ProcessFlow>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-bold text-amber-200 sm:text-lg">What is Arudam used for?</h3>
          <p>Arudam primarily focuses on <strong className="text-amber-100">a specific question asked at a particular moment</strong>.</p>
          <p>Examples:</p>
          <ul className="list-disc space-y-1 pl-5 marker:text-amber-400">
            <li>Will a lost object be found?</li>
            <li>Will a particular matter be fulfilled?</li>
            <li>Will a problem be resolved?</li>
            <li>Will the expected news arrive?</li>
            <li>Will a particular effort succeed?</li>
            <li>When is the matter likely to be fulfilled?</li>
          </ul>
        </section>
          </article>
        )}
      </div>
    </section>
  );
};