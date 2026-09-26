import { RasiRuleData } from '../astrology/rasi';
import { EnhancedPlanetInfo } from '../astrology/planets';
import { TransitPlanetInfo } from '../kochara/transitCalculator';
import { PrasnaCategory, RuleStrength, CENTRAL_ARUDAM_RULES, ArudamRule } from './arudamRules';

export interface ClassifiedQuestion {
  category: PrasnaCategory;
  categoryNameEn: string;
  categoryNameTa: string;
  strength: RuleStrength;
  strengthLabelEn: string;
  strengthLabelTa: string;
  matchedRules: ArudamRule[];
  explanationEnglish: string;
  explanationTamil: string;
}

export const CATEGORY_LABELS: Record<PrasnaCategory, { en: string; ta: string }> = {
  lost_object: { en: 'Lost Object', ta: 'காணாமல் போன பொருள்' },
  missing_person: { en: 'Missing Person', ta: 'காணாமல் போன நபர்' },
  sakunam: { en: 'Sakunam / Omen', ta: 'சகுனம் / நிமித்தம்' },
  marriage: { en: 'Marriage / Relationship', ta: 'திருமணம் / உறவு' },
  finance: { en: 'Money / Finance', ta: 'பணம் / பொருளாதாரம்' },
  job: { en: 'Job / Career', ta: 'வேலை / தொழில்' },
  travel: { en: 'Travel', ta: 'பயணம்' },
  health: { en: 'Health Concern', ta: 'உடல்நலம்' },
  legal: { en: 'Legal / Dispute', ta: 'வழக்கு / தகராறு' },
  general: { en: 'General Prasna', ta: 'பொதுவான கேள்வி' }
};

export const STRENGTH_LABELS: Record<RuleStrength, { en: string; ta: string }> = {
  strong: { en: 'Strong indication', ta: 'வலுவான சுட்டு' },
  moderate: { en: 'Moderate indication', ta: 'மிதமான சுட்டு' },
  possible: { en: 'Possible indication', ta: 'சாத்தியமான சுட்டு' },
  weak: { en: 'Weak indication', ta: 'பலவீனமான சுட்டு' }
};

/**
 * Deterministic rule-based classifier that infers the client's latent Prasna inquiry
 */
export const classifyClientQuestion = (params: {
  selectedNumber: number;
  arudaRasi: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  transitPlanets: TransitPlanetInfo[];
}): ClassifiedQuestion[] => {
  const { selectedNumber, arudaRasi, sixthRasi, sixthLord, transitPlanets } = params;

  const results: ClassifiedQuestion[] = [];
  const planetsInSixth = transitPlanets.filter(p => p.rasiId === sixthRasi.id);

  // Rule 1: Lost Object
  // Triggered strongly when:
  // - 6th sign is Earth/Water (objects stay hidden/stored)
  // - Or 6th lord is Mercury/Venus/Saturn (possession/valuables/delay)
  // - Or Moon/Mercury transits 6th sign or 2nd/4th/8th house
  const isEarthOrWater = sixthRasi.element === 'Earth' || sixthRasi.element === 'Water';
  const isPossessionLord = ['mercury', 'venus', 'saturn'].includes(sixthLord.id);
  if (isEarthOrWater || isPossessionLord || selectedNumber === 2 || selectedNumber === 8) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'lost_object' && (
      (Array.isArray(r.condition.sixthRasiId) && r.condition.sixthRasiId.includes(sixthRasi.id)) ||
      (Array.isArray(r.condition.sixthLordId) && r.condition.sixthLordId.includes(sixthLord.id))
    ));

    const strength: RuleStrength = (isEarthOrWater && isPossessionLord) ? 'strong' : 'moderate';
    results.push({
      category: 'lost_object',
      categoryNameEn: CATEGORY_LABELS.lost_object.en,
      categoryNameTa: CATEGORY_LABELS.lost_object.ta,
      strength,
      strengthLabelEn: STRENGTH_LABELS[strength].en,
      strengthLabelTa: STRENGTH_LABELS[strength].ta,
      matchedRules: matched,
      explanationEnglish: `Rule indicated by 6th Rasi ${sixthRasi.englishNameOnly} (${sixthRasi.element} element) and 6th Lord ${sixthLord.englishOnly}, reflecting stored possessions, missing valuables, or misplaced documents.`,
      explanationTamil: `6-ஆம் ராசி ${sixthRasi.tamilNameOnly} (${sixthRasi.element} தத்துவம்) மற்றும் 6-ஆம் அதிபதி ${sixthLord.tamilOnly} தொடர்பால் உடமைகள், காணாமல் போன ஆவணங்கள் அல்லது பொருட்கள் பற்றிய கேள்விக்கு வலுவான சுட்டு உள்ளது.`
    });
  }

  // Rule 2: Job / Career
  // Triggered when 6th lord is Saturn, Sun, Mars or 6th Rasi is Capricorn/Aries/Leo
  if (['saturn', 'sun', 'mars'].includes(sixthLord.id) || [1, 5, 10].includes(sixthRasi.id)) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'job' && (
      (Array.isArray(r.condition.sixthLordId) && r.condition.sixthLordId.includes(sixthLord.id)) ||
      (Array.isArray(r.condition.sixthRasiId) && r.condition.sixthRasiId.includes(sixthRasi.id))
    ));
    const strength: RuleStrength = (sixthLord.id === 'saturn' || sixthLord.id === 'sun') ? 'strong' : 'moderate';
    results.push({
      category: 'job',
      categoryNameEn: CATEGORY_LABELS.job.en,
      categoryNameTa: CATEGORY_LABELS.job.ta,
      strength,
      strengthLabelEn: STRENGTH_LABELS[strength].en,
      strengthLabelTa: STRENGTH_LABELS[strength].ta,
      matchedRules: matched,
      explanationEnglish: `Triggered by ${sixthLord.englishOnly} presiding over 6th Rasi ${sixthRasi.englishNameOnly} (house of employment, workplace competition, and professional endeavors).`,
      explanationTamil: `6-ஆம் இடமான ${sixthRasi.tamilNameOnly} (உத்தியோகம் மற்றும் போட்டி ஸ்தானம்) மற்றும் அதிபதி ${sixthLord.tamilOnly} தொடர்பால் வேலை, தொழில் அல்லது உத்தியோக மாற்றம் பற்றிய கேள்வி சுட்டப்படுகிறது.`
    });
  }

  // Rule 3: Money / Finance
  // Triggered when 6th lord is Venus, Mercury, or Jupiter, or 6th Rasi is Taurus/Virgo/Libra
  if (['venus', 'mercury', 'jupiter'].includes(sixthLord.id) || [2, 6, 7].includes(sixthRasi.id)) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'finance' && (
      (Array.isArray(r.condition.sixthLordId) && r.condition.sixthLordId.includes(sixthLord.id))
    ));
    const strength: RuleStrength = ['venus', 'mercury'].includes(sixthLord.id) ? 'strong' : 'moderate';
    results.push({
      category: 'finance',
      categoryNameEn: CATEGORY_LABELS.finance.en,
      categoryNameTa: CATEGORY_LABELS.finance.ta,
      strength,
      strengthLabelEn: STRENGTH_LABELS[strength].en,
      strengthLabelTa: STRENGTH_LABELS[strength].ta,
      matchedRules: matched,
      explanationEnglish: `Associated with ${sixthLord.englishOnly} governing economic transactions, outstanding debts, and financial settlements under ${sixthRasi.englishNameOnly}.`,
      explanationTamil: `பொருளாதாரம் மற்றும் வரவு-செலவு காரக கிரகமான ${sixthLord.tamilOnly} 6-ஆம் ராசிக்கு அதிபதியாக அமைவதால் கடன், பணம் அல்லது நிதி விவகாரங்கள் தொடர்பான கேள்வி சுட்டப்படுகிறது.`
    });
  }

  // Rule 4: Missing Person
  // Triggered when 6th sign is Movable (Aries, Cancer, Libra, Capricorn) or Moon is in transit aspect
  if ([1, 4, 7, 10].includes(sixthRasi.id) || ['moon', 'ketu'].includes(sixthLord.id)) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'missing_person' && (
      (Array.isArray(r.condition.sixthRasiId) && r.condition.sixthRasiId.includes(sixthRasi.id))
    ));
    results.push({
      category: 'missing_person',
      categoryNameEn: CATEGORY_LABELS.missing_person.en,
      categoryNameTa: CATEGORY_LABELS.missing_person.ta,
      strength: 'moderate',
      strengthLabelEn: STRENGTH_LABELS.moderate.en,
      strengthLabelTa: STRENGTH_LABELS.moderate.ta,
      matchedRules: matched,
      explanationEnglish: `6th Rasi ${sixthRasi.englishNameOnly} is a Movable sign, indicating a person traveling, absent from home, or awaiting return.`,
      explanationTamil: `6-ஆம் ராசி ${sixthRasi.tamilNameOnly} சர ராசியாக அமைவதால் இடம் பெயர்ந்த நபர், பிரிந்து சென்றவர் அல்லது பயணம் குறித்த கேள்வியின் சாத்தியக்கூறு உள்ளது.`
    });
  }

  // Rule 5: Sakunam / Omen
  // Triggered when Rahu/Ketu or Mars occupies 6th Rasi or rules it
  if (['rahu', 'ketu', 'mars'].includes(sixthLord.id) || planetsInSixth.some(p => ['rahu', 'ketu', 'mars'].includes(p.id))) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'sakunam');
    results.push({
      category: 'sakunam',
      categoryNameEn: CATEGORY_LABELS.sakunam.en,
      categoryNameTa: CATEGORY_LABELS.sakunam.ta,
      strength: 'possible',
      strengthLabelEn: STRENGTH_LABELS.possible.en,
      strengthLabelTa: STRENGTH_LABELS.possible.ta,
      matchedRules: matched,
      explanationEnglish: `Planetary node or martial presence near 6th house indicates inquiries stirred by an unusual omen, dream, or abrupt incident.`,
      explanationTamil: `நிழல் கிரகங்கள் அல்லது செவ்வாயின் தொடர்பால் திடீர் சகுனம், கனவு அல்லது நிமித்தம் தொடர்பான பிரசன்ன சிந்தனை சுட்டப்படுகிறது.`
    });
  }

  // Rule 6: Marriage / Relationship
  if (['venus', 'jupiter'].includes(sixthLord.id) || [7, 2, 4].includes(arudaRasi.id)) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'marriage');
    results.push({
      category: 'marriage',
      categoryNameEn: CATEGORY_LABELS.marriage.en,
      categoryNameTa: CATEGORY_LABELS.marriage.ta,
      strength: 'moderate',
      strengthLabelEn: STRENGTH_LABELS.moderate.en,
      strengthLabelTa: STRENGTH_LABELS.moderate.ta,
      matchedRules: matched,
      explanationEnglish: `Involvement of matrimonial significator ${sixthLord.englishOnly} points toward marital negotiation or family partnership inquiry.`,
      explanationTamil: `களத்திர மற்றும் மங்கள கிரகமான ${sixthLord.tamilOnly} தொடர்பு இருப்பதால் திருமணம், வரன் அல்லது குடும்ப உறவு பற்றிய கேள்வி சுட்டப்படுகிறது.`
    });
  }

  // Rule 7: Health Concern
  if (['saturn', 'mars', 'sun'].includes(sixthLord.id) && [6, 8, 12].includes(sixthRasi.id)) {
    const matched = CENTRAL_ARUDAM_RULES.filter(r => r.category === 'health');
    results.push({
      category: 'health',
      categoryNameEn: CATEGORY_LABELS.health.en,
      categoryNameTa: CATEGORY_LABELS.health.ta,
      strength: 'moderate',
      strengthLabelEn: STRENGTH_LABELS.moderate.en,
      strengthLabelTa: STRENGTH_LABELS.moderate.ta,
      matchedRules: matched,
      explanationEnglish: `6th house as Rogasthana activated by ${sixthLord.englishOnly} suggests health recovery or medical clarification inquiry.`,
      explanationTamil: `ரோக ஸ்தானமான 6-ஆம் இடத்தில் ${sixthLord.tamilOnly} ஆதிக்கம் இருப்பதால் உடல்நலம், மருத்துவ ஆலோசனை அல்லது நோய் நிவாரணம் பற்றிய கேள்வி சுட்டப்படுகிறது.`
    });
  }

  // Fallback: General Prasna (always present to ensure holistic traditional coverage)
  if (results.length === 0) {
    results.push({
      category: 'general',
      categoryNameEn: CATEGORY_LABELS.general.en,
      categoryNameTa: CATEGORY_LABELS.general.ta,
      strength: 'moderate',
      strengthLabelEn: STRENGTH_LABELS.moderate.en,
      strengthLabelTa: STRENGTH_LABELS.moderate.ta,
      matchedRules: CENTRAL_ARUDAM_RULES.filter(r => r.category === 'general'),
      explanationEnglish: `General life inquiry evaluated via Aruda Lagna ${arudaRasi.englishNameOnly} and 6th sign ${sixthRasi.englishNameOnly}.`,
      explanationTamil: `ஆருட லக்னம் ${arudaRasi.tamilNameOnly} மற்றும் 6-ஆம் ராசி ${sixthRasi.tamilNameOnly} அடிப்படையில் பொதுவான காரிய வெற்றி குறித்த ஆருடம்.`
    });
  }

  return results;
};
