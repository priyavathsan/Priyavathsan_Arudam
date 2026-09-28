import React, { useState } from 'react';
import { EnhancedPlanetInfo } from '../astrology/planets';
import { RasiRuleData } from '../astrology/rasi';
import { TransitPlanetInfo } from '../kochara/transitCalculator';
import { useLanguage } from '../context/LanguageContext';
import {
  CareerDirectionInput,
  CareerQuestionType,
  CompassDirection,
  evaluateCareerDirection
} from '../arudam/careerDirectionRules';

interface CareerJobSearchDirectionProps {
  selectedNumber: number;
  arudaRasi: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  transitPlanets: TransitPlanetInfo[];
}

const CAREER_QUESTION_OPTIONS: { id: CareerQuestionType; en: string; ta: string }[] = [
  { id: 'general_job_search', en: 'General job search', ta: 'பொதுவான வேலை தேடல்' },
  { id: 'job_change', en: 'Job change', ta: 'வேலை மாற்றம்' },
  { id: 'resume_sharing', en: 'Resume sharing', ta: 'விண்ணப்ப விவரம் பகிர்தல்' },
  { id: 'job_application', en: 'Job application', ta: 'வேலைக்கு விண்ணப்பித்தல்' },
  { id: 'interview', en: 'Interview', ta: 'நேர்காணல்' },
  { id: 'job_offer', en: 'Job offer', ta: 'வேலை வாய்ப்பு' },
  { id: 'new_company_search', en: 'New company search', ta: 'புதிய நிறுவனத் தேடல்' },
  { id: 'relocation', en: 'Relocation for employment', ta: 'வேலைக்காக இடமாற்றம்' },
  { id: 'joining', en: 'Joining', ta: 'பணியில் சேருதல்' },
  { id: 'promotion', en: 'Promotion', ta: 'பதவி உயர்வு' },
  { id: 'salary_increase', en: 'Salary increase', ta: 'சம்பள உயர்வு' }
];

const COMPASS_CELLS: { direction: CompassDirection; en: string; ta: string; arrow: string }[] = [
  { direction: 'North-West', en: 'NW', ta: 'வடமேற்கு', arrow: '↖' },
  { direction: 'North', en: 'N', ta: 'வடக்கு', arrow: '↑' },
  { direction: 'North-East', en: 'NE', ta: 'வடகிழக்கு', arrow: '↗' },
  { direction: 'West', en: 'W', ta: 'மேற்கு', arrow: '←' },
  { direction: 'Center', en: 'Center', ta: 'மையம்', arrow: '•' },
  { direction: 'East', en: 'E', ta: 'கிழக்கு', arrow: '→' },
  { direction: 'South-West', en: 'SW', ta: 'தென்மேற்கு', arrow: '↙' },
  { direction: 'South', en: 'S', ta: 'தெற்கு', arrow: '↓' },
  { direction: 'South-East', en: 'SE', ta: 'தென்கிழக்கு', arrow: '↘' }
];

export const CareerJobSearchDirection: React.FC<CareerJobSearchDirectionProps> = ({
  selectedNumber,
  arudaRasi,
  sixthRasi,
  sixthLord,
  transitPlanets
}) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [questionType, setQuestionType] = useState<CareerQuestionType>('general_job_search');
  const [referenceLocation, setReferenceLocation] = useState('');

  const input: CareerDirectionInput = {
    arudamNumber: selectedNumber,
    arudaLagnaId: arudaRasi.id,
    careerHouseIds: [6, 10, 11],
    planetIds: [sixthLord.id],
    gocharamPlanetIds: transitPlanets.map(planet => planet.id),
    questionType
  };
  const result = evaluateCareerDirection(input);
  const selectedQuestion = CAREER_QUESTION_OPTIONS.find(option => option.id === questionType)!;
  const directionLabel = (direction: CompassDirection) => {
    if (direction === 'Center') return isTamil ? 'மையம் / அதே பகுதி' : 'Center / Same Region';
    return isTamil ? COMPASS_CELLS.find(cell => cell.direction === direction)?.ta ?? direction : direction;
  };

  return (
    <section className="bg-cosmic-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl backdrop-blur-sm">
      <header className="mb-5 border-b border-slate-800 pb-4">
        <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase block mb-1">
          {isTamil ? 'தொழில் ஆரூடம்' : 'Career Arudam'}
        </span>
        <h2 className={`text-xl sm:text-2xl font-serif font-bold text-amber-300 ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil ? 'வேலை தேடும் திசை' : 'Job Search Direction'}
        </h2>
        <p className={`mt-1 text-sm text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil
            ? 'பாரம்பரிய திசை விதிகள் ஆதாரத்துடன் உள்ளிடப்பட்டால் மட்டுமே திசை காட்டப்படும்.'
            : 'A direction is shown only when source-backed traditional rules are configured.'}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className={`block text-sm font-medium text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil ? 'தொழில் கேள்வி வகை' : 'Career question type'}
          <select
            value={questionType}
            onChange={event => setQuestionType(event.target.value as CareerQuestionType)}
            className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-cosmic-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {CAREER_QUESTION_OPTIONS.map(option => (
              <option key={option.id} value={option.id}>{isTamil ? option.ta : option.en}</option>
            ))}
          </select>
        </label>

        <label className={`block text-sm font-medium text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil ? 'தற்போதைய / குறிப்பிடும் இடம் (விருப்பத்தேர்வு)' : 'Current / Reference Location (optional)'}
          <input
            type="text"
            value={referenceLocation}
            onChange={event => setReferenceLocation(event.target.value)}
            placeholder={isTamil ? 'எ.கா. பெங்களூரு, கர்நாடகா, இந்தியா' : 'e.g. Bengaluru, Karnataka, India'}
            autoComplete="address-level2"
            className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-cosmic-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-800 bg-cosmic-950/70 p-3">
              <p className="text-slate-400">{isTamil ? 'கேள்வி' : 'Question'}</p>
              <p className={`mt-1 font-medium text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? selectedQuestion.ta : selectedQuestion.en}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-cosmic-950/70 p-3">
              <p className="text-slate-400">{isTamil ? 'குறிப்பிடும் இடம்' : 'Reference Location'}</p>
              <p className="mt-1 font-medium text-slate-100">{referenceLocation.trim() || (isTamil ? 'குறிப்பிடப்படவில்லை' : 'Not provided')}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-cosmic-950/70 p-3">
              <p className="text-slate-400">{isTamil ? 'ஆரூட எண்' : 'Arudam Number'}</p>
              <p className="mt-1 font-mono font-bold text-amber-300">{selectedNumber}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-cosmic-950/70 p-3">
              <p className="text-slate-400">{isTamil ? 'ஆரூட லக்னம் / 6ஆம் ராசி' : 'Aruda Lagna / 6th Sign'}</p>
              <p className={`mt-1 font-medium text-slate-100 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? arudaRasi.tamilNameOnly : arudaRasi.englishNameOnly}
                {' / '}
                {isTamil ? sixthRasi.tamilNameOnly : sixthRasi.englishNameOnly}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4">
            <h3 className={`font-semibold text-amber-200 ${isTamil ? 'font-tamil' : ''}`}>
              {isTamil ? 'பாரம்பரிய திசை குறிப்பு' : 'Traditional Directional Indication'}
            </h3>
            {result.status === 'ready' ? (
              <div className="mt-3 space-y-2 text-sm">
                <p><span className="text-slate-400">{isTamil ? 'முதன்மை:' : 'Primary:'}</span> <strong className="text-amber-200">{directionLabel(result.primaryDirection!)}</strong></p>
                {result.secondaryDirection && <p><span className="text-slate-400">{isTamil ? 'இரண்டாம் நிலை:' : 'Secondary:'}</span> <strong className="text-amber-200">{directionLabel(result.secondaryDirection)}</strong></p>}
                {result.confidence && <p><span className="text-slate-400">{isTamil ? 'விதி வலிமை:' : 'Rule strength:'}</span> {result.confidence}</p>}
                <p className={isTamil ? 'font-tamil' : ''}>
                  {isTamil
                    ? `இந்த அமைப்பின் ஆதாரமுள்ள பாரம்பரிய விதிகளின்படி ${directionLabel(result.primaryDirection!)} திசை ஆராய்வதற்கு ஒரு பாரம்பரியக் குறிப்பாக உள்ளது.`
                    : `Based on the traditional directional rules used by this system, ${directionLabel(result.primaryDirection!)} is indicated as a direction to explore.`}
                </p>
                <p className={`text-xs text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
                  {isTamil
                    ? 'இது வேலை உறுதியளிப்பதில்லை; வேலை வாய்ப்புகளை வேறு திசைகளில் புறக்கணிக்க வேண்டாம்.'
                    : 'This is not a guarantee of employment. Do not ignore a suitable opportunity in another direction.'}
                </p>
              </div>
            ) : result.status === 'conflicting' ? (
              <p className={`mt-2 text-sm text-amber-100 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil ? 'முரண்படும் திசைக் குறிப்புகள்:' : 'Conflicting directional indications:'}{' '}
                {result.conflictingDirections.map(directionLabel).join(', ')}
              </p>
            ) : (
              <p className={`mt-2 text-sm text-slate-300 ${isTamil ? 'font-tamil' : ''}`}>
                {isTamil
                  ? 'இந்த திட்டத்தில் தொழில் திசைக்கான ஆதாரத்துடன் கூடிய பாரம்பரிய விதிகள் இன்னும் சேர்க்கப்படவில்லை. எனவே திசை கணிக்கப்படவில்லை.'
                  : 'No source-backed traditional career-direction rules are configured in this project yet, so no direction is predicted.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            role="img"
            aria-label={isTamil ? 'திசைகாட்டி' : 'Directional compass'}
            className="grid aspect-square w-full max-w-[300px] grid-cols-3 grid-rows-3 gap-2"
          >
            {COMPASS_CELLS.map(cell => {
              const isPrimary = result.primaryDirection === cell.direction;
              const isSecondary = result.secondaryDirection === cell.direction;
              const isConflict = result.conflictingDirections.includes(cell.direction);
              return (
                <div
                  key={cell.direction}
                  aria-label={`${cell.direction}${isPrimary ? ', primary' : ''}${isSecondary ? ', secondary' : ''}${isConflict ? ', conflicting' : ''}`}
                  className={`flex flex-col items-center justify-center rounded-lg border text-center ${
                    isPrimary
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : isSecondary
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                      : isConflict
                      ? 'border-rose-400 bg-rose-500/15 text-rose-200'
                      : 'border-slate-800 bg-cosmic-950/60 text-slate-500'
                  }`}
                >
                  <span className="text-xl leading-none">{cell.arrow}</span>
                  <span className={`mt-1 text-xs font-semibold ${isTamil ? 'font-tamil' : ''}`}>
                    {isTamil ? cell.ta : cell.en}
                  </span>
                </div>
              );
            })}
          </div>
          <p className={`max-w-sm text-center text-xs text-slate-400 ${isTamil ? 'font-tamil' : ''}`}>
            {isTamil
              ? 'திசை என்பது பாரம்பரியக் குறிப்பாக மட்டுமே கருதப்பட வேண்டும்; வேலைத் தேடலைக் கட்டுப்படுத்தும் விதியாக அல்ல.'
              : 'Treat direction as an additional traditional consideration, not a restriction on your job search.'}
          </p>
        </div>
      </div>

      <details className="mt-5 rounded-lg border border-slate-800 bg-cosmic-950/50 p-4">
        <summary className={`cursor-pointer font-semibold text-slate-200 ${isTamil ? 'font-tamil' : ''}`}>
          {isTamil ? 'இந்த திசை ஏன்?' : 'Why this direction?'}
        </summary>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>{isTamil ? 'ஆரூட எண்' : 'Arudam Number'}: {selectedNumber}</p>
          <p>{isTamil ? 'ஆரூட லக்னம்' : 'Aruda Lagna'}: {isTamil ? arudaRasi.tamilNameOnly : arudaRasi.englishNameOnly}</p>
          <p>{isTamil ? 'தொழில் பாவங்கள்' : 'Career Houses'}: 6, 10, 11</p>
          <p>{isTamil ? 'கிரகக் குறிப்புகள்' : 'Planetary Clues'}: {[sixthLord.id, ...transitPlanets.map(planet => planet.id)].join(', ')}</p>
          {result.matchedRules.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {result.matchedRules.map(rule => (
                <li key={rule.id}>
                  {rule.id} · {rule.source}: {isTamil ? rule.explanationTa : rule.explanationEn}
                </li>
              ))}
            </ul>
          ) : (
            <p className={isTamil ? 'font-tamil' : ''}>
              {isTamil
                ? 'தற்போது பயன்படுத்தக்கூடிய ஆதார விதிகள் இல்லை; திசை முடிவு வழங்கப்படவில்லை.'
                : 'No applicable sourced directional rules are available; no direction was selected.'}
            </p>
          )}
        </div>
      </details>
    </section>
  );
};