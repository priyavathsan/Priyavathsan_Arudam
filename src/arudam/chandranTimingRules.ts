// Chandran-based time-of-recovery calculation engine
// Grounded strictly in traditional Arudam Prasna Shastra rules.
// Computes estimated finding time based on dynamic Moon position,
// houses from Aruda Lagna, houses from 6th Rasi, Nakshatras, and astronomical transitions.

import * as Astronomy from 'astronomy-engine';
import { NAKSHATRAS } from '../astrology/nakshatra';
import { RASI_LIST } from '../astrology/rasi';
import { calculateLahiriAyanamsa } from '../kochara/transitCalculator';
import { ResolutionStatus } from './resolutionRules';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type TimeGranularity = 'hours' | 'days' | 'weeks' | 'months';

export type TimeCategory =
  | 'Immediate'
  | 'Soon'
  | 'Moderate Delay'
  | 'Long Delay'
  | 'Not applicable';

export type TimeCategoryTa =
  | 'உடனடி'
  | 'விரைவில்'
  | 'மிதமான தாமதம்'
  | 'நீண்ட தாமதம்'
  | 'பொருந்தாது';

export interface ChandranContext {
  moonRasi: number; // 1..12
  moonRasiNameEn?: string;
  moonRasiNameTa?: string;
  moonNakshatra?: string; // nameEn
  moonNakshatraId?: number; // 1..27
  moonNakshatraNameTa?: string;
  moonPada?: number; // 1..4
  moonLongitude?: number; // totalSiderealDegree 0..360
  moonDegreeInRasi?: number; // 0..30
  moonHouseFromArudam?: number; // 1..12
  moonHouseFromSixthRasi?: number; // 1..12
  moonPhase?: number; // 0..360 degrees
  moonPhaseNameEn?: string;
  moonPhaseNameTa?: string;
  prasnaDateTime?: Date;
  arudaRasiId: number;
  arudaRasiNameEn?: string;
  arudaRasiNameTa?: string;
  sixthRasiId: number;
  sixthRasiNameEn?: string;
  sixthRasiNameTa?: string;
  sixthLordId?: string;
  resolutionStatus: ResolutionStatus;
  questionCategory?: string; // 'lost_object' etc.
}

export interface MatchedTimingRule {
  ruleId: string;
  titleEn: string;
  titleTa: string;
  resultEn: string;
  resultTa: string;
  strength: 'primary' | 'secondary';
  priority: number;
  unit: TimeGranularity;
  timeCategory: TimeCategory;
  timeCategoryTa: TimeCategoryTa;
  explanationEn: string;
  explanationTa: string;
}

export interface AstronomicalTransitionInfo {
  nextRasiId: number;
  nextRasiNameEn: string;
  nextRasiNameTa: string;
  nextRasiDate: Date;
  nextRasiFormattedEn: string;
  nextRasiFormattedTa: string;
  hoursToNextRasi: number;
  nextNakshatraId: number;
  nextNakshatraNameEn: string;
  nextNakshatraNameTa: string;
  nextNakshatraDate: Date;
  nextNakshatraFormattedEn: string;
  nextNakshatraFormattedTa: string;
  hoursToNextNakshatra: number;
}

export interface ChandranFindingTimeResult {
  isApplicable: boolean;
  hasReliableData: boolean;
  unreliableDataReasonEn?: string;
  unreliableDataReasonTa?: string;

  // Final Output requirements per §1
  questionEn: string;
  questionTa: string;
  resolutionEn: string;
  resolutionTa: string;
  timeOfFindingEn: string;
  timeOfFindingTa: string;
  timeCategoryEn: TimeCategory;
  timeCategoryTa: TimeCategoryTa;
  moonBasisEn: string;
  moonBasisTa: string;

  // Engine structured fields per §7
  status: ResolutionStatus;
  timeValue?: number;
  timeUnit?: TimeGranularity;
  timeRangeEn: string;
  timeRangeTa: string;
  estimatedFrom?: string;
  estimatedUntil?: string;
  confidence: 'rule_based' | 'uncertain' | 'not_applicable';
  ruleId: string;

  // Transition trigger per §6
  astronomicalTransition?: AstronomicalTransitionInfo;
  traditionalTransitionInterpretationEn?: string;
  traditionalTransitionInterpretationTa?: string;

  // Rules list per §13
  matchedTimingRules: MatchedTimingRule[];
  isConflict: boolean;

  // Three-part accuracy breakdown per §17
  accuracyDistinction: {
    astronomicalFactEn: string;
    astronomicalFactTa: string;
    traditionalRuleEn: string;
    traditionalRuleTa: string;
    predictionEn: string;
    predictionTa: string;
  };

  // Why this time explanation items per §14
  whyThisTime: {
    arudaLagnaEn: string;
    arudaLagnaTa: string;
    sixthRasiEn: string;
    sixthRasiTa: string;
    chandranRasiEn: string;
    chandranRasiTa: string;
    chandranNakshatraEn: string;
    chandranNakshatraTa: string;
    chandranPada: number;
    padaNoteEn: string;
    padaNoteTa: string;
    moonFromAruda: number;
    moonFromSixthRasi: number;
    matchingRuleId: string;
    traditionalTimeUnit: string;
    traditionalTimeUnitTa: string;
    resultRangeEn: string;
    resultRangeTa: string;
  };

  // Raw context values for UI display per §15
  contextData: {
    moonRasiEn: string;
    moonRasiTa: string;
    moonNakshatraEn: string;
    moonNakshatraTa: string;
    moonPada: number;
    moonHouseFromAruda: number;
    moonHouseFromSixthRasi: number;
    moonDegreeFormatted: string;
    moonPhaseNameEn: string;
    moonPhaseNameTa: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Traditional Moon House Rules From Aruda Lagna (Houses 1 to 12)
// ─────────────────────────────────────────────────────────────────────────────

export interface TraditionalHouseTimingRule {
  id: string;
  house: number;
  unit: TimeGranularity;
  timeValue: number;
  timeRangeEn: string;
  timeRangeTa: string;
  category: TimeCategory;
  categoryTa: TimeCategoryTa;
  priority: number;
  titleEn: string;
  titleTa: string;
  interpretation: {
    en: string;
    ta: string;
  };
}

export const CHANDRAN_HOUSE_ARUDA_RULES: Record<number, TraditionalHouseTimingRule> = {
  1: {
    id: 'CHANDRAN_TIME_001',
    house: 1,
    unit: 'hours',
    timeValue: 12,
    timeRangeEn: 'Within a few hours to 1 day',
    timeRangeTa: 'சில மணிநேரங்கள் முதல் 1 நாளுக்குள்',
    category: 'Immediate',
    categoryTa: 'உடனடி',
    priority: 95,
    titleEn: 'Moon 1st from Aruda (Lagna) — Immediate Vicinity',
    titleTa: 'ஆருட லக்னத்தில் சந்திரன் — உடனடி மீட்பு',
    interpretation: {
      en: 'Moon in Aruda Lagna indicates immediate proximity. The lost object is in the querent’s direct personal vicinity or immediate room; recovery is indicated within a few hours to 1 day.',
      ta: 'சந்திரன் ஆருட லக்னத்திலேயே அமைவதால் பொருள் கேள்வி கேட்டவரின் உடனடி பார்வையில் அல்லது அருகிலேயே உள்ளது; சில மணிநேரங்கள் முதல் ஒரு நாளுக்குள் கிடைக்க வாய்ப்புள்ளது.'
    }
  },
  2: {
    id: 'CHANDRAN_TIME_002',
    house: 2,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–2 days',
    timeRangeTa: '1–2 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 88,
    titleEn: 'Moon 2nd from Aruda — Domestic Treasury / Wallet',
    titleTa: 'ஆருடத்திற்கு 2-ல் சந்திரன் — பணப்பை / பெட்டியில் மீட்பு',
    interpretation: {
      en: 'Moon in the 2nd house (Dhana Bhava) indicates the item is securely placed inside a purse, wallet, drawer, or domestic vault. Recovery expected within 1–2 days.',
      ta: 'சந்திரன் 2-ஆம் இடத்தில் (தன ஸ்தானம்) இருப்பதால் பணப்பை, அலமாரி, பெட்டி அல்லது குடும்ப உறவினர் வசம் இருந்து 1–2 நாட்களுக்குள் மீட்கப்படலாம்.'
    }
  },
  3: {
    id: 'CHANDRAN_TIME_003',
    house: 3,
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 84,
    titleEn: 'Moon 3rd from Aruda — Short Transit / Quick Inquiry',
    titleTa: 'ஆருடத்திற்கு 3-ல் சந்திரன் — குறுகிய நகர்வு / தேடல் மூலம் மீட்பு',
    interpretation: {
      en: 'Moon in the 3rd house (Upachaya) represents short transit or displacement amidst commute bags or communications. Recovery within 1–3 days through active checking.',
      ta: 'சந்திரன் 3-ஆம் இடத்தில் (உபசய ஸ்தானம்) இருப்பதால் குறுகிய தூர இடமாற்றம் அல்லது பயணப் பையில் உள்ளது; விடாமுயற்சி மற்றும் தகவல் மூலம் 1–3 நாட்களுக்குள் கிடைக்கும்.'
    }
  },
  4: {
    id: 'CHANDRAN_TIME_004',
    house: 4,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–2 days',
    timeRangeTa: '1–2 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 90,
    titleEn: 'Moon 4th from Aruda — Inside Residence / Bedroom',
    titleTa: 'ஆருடத்திற்கு 4-ல் சந்திரன் — வீட்டிற்குள் / படுக்கையறையில் மீட்பு',
    interpretation: {
      en: 'Moon in the 4th house (Kendra / Domestic sanctuary) indicates the item is inside the residence, bedroom, under soft furnishings, or in a private vehicle. Recovery indicated within 1–2 days.',
      ta: 'சந்திரன் 4-ஆம் இடத்தில் (சுக கேந்திரம்) இருப்பதால் பொருள் வீட்டிற்குள், படுக்கையறை, மெத்தை அல்லது வாகனத்தில் உள்ளது; 1–2 நாட்களுக்குள் கண்டறியப்படும்.'
    }
  },
  5: {
    id: 'CHANDRAN_TIME_005',
    house: 5,
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 83,
    titleEn: 'Moon 5th from Aruda — Place of Study / Leisure',
    titleTa: 'ஆருடத்திற்கு 5-ல் சந்திரன் — படிப்பு / பொழுதுபோக்கு இடத்தில் மீட்பு',
    interpretation: {
      en: 'Moon in the 5th house indicates the item was set down during recreation, study, or kept amidst intellectual materials. Recalled and found within 2–4 days.',
      ta: 'சந்திரன் 5-ஆம் இடத்தில் (திரிகோணம்) இருப்பதால் பொழுதுபோக்கு, படிப்பு அறை அல்லது குழந்தைகள்/நண்பர்கள் வசம் விடப்பட்டு 2–4 நாட்களுக்குள் மீட்கப்படலாம்.'
    }
  },
  6: {
    id: 'CHANDRAN_TIME_006',
    house: 6,
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–5 days',
    timeRangeTa: '3–5 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 85,
    titleEn: 'Moon 6th from Aruda — Obstacle Cleared Through Effort',
    titleTa: 'ஆருடத்திற்கு 6-ல் சந்திரன் — தடைகள் நீங்கி உழைப்பால் மீட்பு',
    interpretation: {
      en: 'Moon in the 6th house (impediment axis) indicates the object is concealed by working tools, laundry, or cluttered storage. Requires persistent clearing, with recovery in 3–5 days.',
      ta: 'சந்திரன் 6-ஆம் இடத்தில் இருப்பதால் வேலை செய்யும் இடம் அல்லது குப்பைகள்/துணிகள் நடுவே மறைந்துள்ளது; தொடர் தேடலுக்குப் பின் 3–5 நாட்களுக்குள் கிடைக்கும்.'
    }
  },
  7: {
    id: 'CHANDRAN_TIME_007',
    house: 7,
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 86,
    titleEn: 'Moon 7th from Aruda — With Partner or in Opposite Room',
    titleTa: 'ஆருடத்திற்கு 7-ல் சந்திரன் — கூட்டாளி அல்லது எதிர் திசை அறையில் மீட்பு',
    interpretation: {
      en: 'Moon in the 7th house (Kendra) indicates the object is with a spouse, associate, or in an opposing room/verandah. Retrieved within 2–4 days.',
      ta: 'சந்திரன் 7-ஆம் இடத்தில் (கேந்திரம்) இருப்பதால் கூட்டாளி, வாழ்க்கைத் துணை அல்லது எதிர் திசை அறையில் உள்ளது; 2–4 நாட்களுக்குள் கைக்கு வரும்.'
    }
  },
  8: {
    id: 'CHANDRAN_TIME_008',
    house: 8,
    unit: 'days',
    timeValue: 5,
    timeRangeEn: 'Within 3–7 days',
    timeRangeTa: '3–7 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 87,
    titleEn: 'Moon 8th from Aruda — Concealed in Crevice / Dark Corner',
    titleTa: 'ஆருடத்திற்கு 8-ல் சந்திரன் — மறைவான இடுக்கில் சிக்கிய நிலை',
    interpretation: {
      en: 'Moon in the 8th house indicates concealment out of direct sight, fallen beneath furniture or trapped behind panels. Found after a moderate delay of 3–7 days.',
      ta: 'சந்திரன் 8-ஆம் இடத்தில் (மறைவு ஸ்தானம்) இருப்பதால் கண்ணில் படாத மறைவிடம், தளவாடங்கள் அடியில் அல்லது இடுக்குகளில் சிக்கியுள்ளது; 3–7 நாட்கள் தாமதத்திற்குப் பின் கிடைக்கும்.'
    }
  },
  9: {
    id: 'CHANDRAN_TIME_009',
    house: 9,
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 81,
    titleEn: 'Moon 9th from Aruda — Distant Premises / Temple / Travel Bag',
    titleTa: 'ஆருடத்திற்கு 9-ல் சந்திரன் — வழிபாட்டு இடம் அல்லது தொலைதூரப் பை',
    interpretation: {
      en: 'Moon in the 9th house indicates distance, travel bags, place of worship, or elder’s quarters. Discovered within 3–6 days upon re-tracing journeys.',
      ta: 'சந்திரன் 9-ஆம் இடத்தில் இருப்பதால் வெளி வளாகம், பயணப் பை அல்லது பெரியவர்கள்/வழிபாட்டு இடத்தில் உள்ளது; 3–6 நாட்களுக்குள் கண்டறியப்படும்.'
    }
  },
  10: {
    id: 'CHANDRAN_TIME_010',
    house: 10,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 89,
    titleEn: 'Moon 10th from Aruda — Workplace Desk / Prominent Spot',
    titleTa: 'ஆருடத்திற்கு 10-ல் சந்திரன் — பணி மேஜை / பிரதான இடத்தில் மீட்பு',
    interpretation: {
      en: 'Moon in the 10th house (Kendra / Activity center) indicates placement in a prominent office, executive desk, or official venue. Discovered quickly within 1–3 days.',
      ta: 'சந்திரன் 10-ஆம் இடத்தில் (கேந்திரம் / கர்ம ஸ்தானம்) இருப்பதால் அலுவலக மேஜை, பணி செய்யும் வெளிப்படையான இடத்தில் உள்ளது; 1–3 நாட்களுக்குள் கண்டறியப்படும்.'
    }
  },
  11: {
    id: 'CHANDRAN_TIME_011',
    house: 11,
    unit: 'days',
    timeValue: 1,
    timeRangeEn: 'Within 1–2 days',
    timeRangeTa: '1–2 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 91,
    titleEn: 'Moon 11th from Aruda — Swift Gain Through Friends',
    titleTa: 'ஆருடத்திற்கு 11-ல் சந்திரன் — நண்பர்கள் மூலம் விரைவான லாபகர மீட்பு',
    interpretation: {
      en: 'Moon in the 11th house (Labhasthana) strongly favors speedy retrieval and recovery through friends or family within 1–2 days.',
      ta: 'சந்திரன் 11-ஆம் இடத்தில் (லாப ஸ்தானம்) இருப்பதால் நன்மை மற்றும் லாபம் விரைவாக ஏற்படும்; நண்பர்கள் உதவியுடன் 1–2 நாட்களுக்குள் பொருள் மீட்கப்படும்.'
    }
  },
  12: {
    id: 'CHANDRAN_TIME_012',
    house: 12,
    unit: 'weeks',
    timeValue: 2,
    timeRangeEn: 'Within 1–2 weeks',
    timeRangeTa: '1–2 வாரங்களுக்குள்',
    category: 'Long Delay',
    categoryTa: 'நீண்ட தாமதம்',
    priority: 86,
    titleEn: 'Moon 12th from Aruda — Forgotten Quarter / Distant Storage',
    titleTa: 'ஆருடத்திற்கு 12-ல் சந்திரன் — மறந்த ஒதுக்குப்புறத்தில் நீண்ட தாமதம்',
    interpretation: {
      en: 'Moon in the 12th house signifies forgotten spaces, distant transit, terrace, or outer storage. Retrieval follows an extended delay of 1–2 weeks.',
      ta: 'சந்திரன் 12-ஆம் இடத்தில் (விரய ஸ்தானம்) இருப்பதால் மறதி, தூரத்து பிரயாண இடம் அல்லது ஒதுக்குப்புறமான மூலையில் உள்ளது; 1–2 வாரங்கள் நீண்ட தாமதத்திற்குப் பின் கிடைக்கலாம்.'
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Traditional Moon House Rules From 6th Rasi (Houses 1 to 12)
// ─────────────────────────────────────────────────────────────────────────────

export const CHANDRAN_HOUSE_SIXTH_RULES: Record<number, TraditionalHouseTimingRule> = {
  1: {
    id: 'CHANDRAN_SIXTH_001',
    house: 1,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 88,
    titleEn: 'Moon in 6th Sign Itself — Direct Transit Trigger',
    titleTa: '6-ஆம் ராசியிலேயே சந்திரன் — நேரடி கோச்சார தூண்டுதல்',
    interpretation: {
      en: 'Moon transiting directly in the 6th sign triggers rapid resolution of obstacles; fast recovery indicated within 1–3 days.',
      ta: 'சந்திரன் நேரடியாக 6-ஆம் ராசியில் சஞ்சரிப்பது தடைகளை உடைக்கும் உடனடி இயக்கத்தை தந்து 1–3 நாட்களுக்குள் பொருள் கிடைக்க வழிசெய்கிறது.'
    }
  },
  2: {
    id: 'CHANDRAN_SIXTH_002',
    house: 2,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 2–3 days',
    timeRangeTa: '2–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 78,
    titleEn: 'Moon 2nd from 6th Rasi — Stored Material Retrieved',
    titleTa: '6-ஆம் ராசிக்கு 2-ல் சந்திரன் — சேமிப்பு பொருள் மீட்கப்படுதல்',
    interpretation: {
      en: 'Moon 2nd from 6th sign points to discovery in settled container within 2–3 days.',
      ta: '6-ஆம் ராசிக்கு 2-ஆம் இடத்தில் சந்திரன் இருப்பதால் பெட்டி அல்லது சேமிப்பில் 2–3 நாட்களுக்குள் கிடைக்கும்.'
    }
  },
  3: {
    id: 'CHANDRAN_SIXTH_003',
    house: 3,
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 76,
    titleEn: 'Moon 3rd from 6th Rasi — Search Progress Supported',
    titleTa: '6-ஆம் ராசிக்கு 3-ல் சந்திரன் — தேடல் முன்னேற்றம் சாதகம்',
    interpretation: {
      en: 'Moon 3rd from 6th sign supports active investigative effort, yielding success in 2–4 days.',
      ta: '6-ஆம் ராசிக்கு 3-ல் சந்திரன் அமைவது தேடல் முயற்சிகளுக்கு ஆதரவளித்து 2–4 நாட்களுக்குள் பலன் தரும்.'
    }
  },
  4: {
    id: 'CHANDRAN_SIXTH_004',
    house: 4,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 2–3 days',
    timeRangeTa: '2–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 82,
    titleEn: 'Moon 4th from 6th Rasi — Kendra Stability',
    titleTa: '6-ஆம் ராசிக்கு 4-ல் சந்திரன் — கேந்திர நிலைத்தன்மை',
    interpretation: {
      en: 'Moon Kendra from 6th sign indicates stationary placement; recovery within 2–3 days.',
      ta: '6-ஆம் ராசிக்கு கேந்திரமான 4-ல் சந்திரன் இருப்பதால் பொருள் நிலையாக உள்ளது; 2–3 நாட்களுக்குள் மீட்கப்படும்.'
    }
  },
  5: {
    id: 'CHANDRAN_SIXTH_005',
    house: 5,
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–5 days',
    timeRangeTa: '3–5 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 75,
    titleEn: 'Moon 5th from 6th Rasi — Trikona Retrieval',
    titleTa: '6-ஆம் ராசிக்கு 5-ல் சந்திரன் — திரிகோண மீட்பு',
    interpretation: {
      en: 'Moon 5th from 6th sign brings memory recall and systematic checking in 3–5 days.',
      ta: '6-ஆம் ராசிக்கு 5-ல் சந்திரன் சிந்தனை மற்றும் நினைவாற்றல் மூலம் 3–5 நாட்களுக்குள் மீட்க வழிசெய்கிறது.'
    }
  },
  6: {
    id: 'CHANDRAN_SIXTH_006',
    house: 6,
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 74,
    titleEn: 'Moon 6th from 6th Rasi (11th from Aruda)',
    titleTa: '6-ஆம் ராசிக்கு 6-ல் சந்திரன் — முயற்சிக்கு பின் மீட்பு',
    interpretation: {
      en: 'Bhavat Bhavam position indicates obstacle resolved through steady search in 3–6 days.',
      ta: 'பாவத் பாவக அமைப்பில் 3–6 நாட்களுக்குள் விடாமுயற்சியால் பொருள் மீட்கப்படும்.'
    }
  },
  7: {
    id: 'CHANDRAN_SIXTH_007',
    house: 7,
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 80,
    titleEn: 'Moon 7th from 6th Rasi — Opposing Quadrant',
    titleTa: '6-ஆம் ராசிக்கு 7-ல் சந்திரன் — எதிர் திசை தேடல்',
    interpretation: {
      en: 'Moon opposite 6th sign draws attention to the opposite side of the room/compound in 2–4 days.',
      ta: '6-ஆம் ராசிக்கு 7-ல் சந்திரன் எதிர் திசை அறையில் 2–4 நாட்களுக்குள் பொருள் கிடைக்க வழிசெய்கிறது.'
    }
  },
  8: {
    id: 'CHANDRAN_SIXTH_008',
    house: 8,
    unit: 'days',
    timeValue: 6,
    timeRangeEn: 'Within 4–8 days',
    timeRangeTa: '4–8 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 79,
    titleEn: 'Moon 8th from 6th Rasi — Hidden Impediment',
    titleTa: '6-ஆம் ராசிக்கு 8-ல் சந்திரன் — மறைந்த தடை நிலை',
    interpretation: {
      en: 'Moon in 8th from 6th indicates deeply covered position; recovery takes 4–8 days.',
      ta: '6-ஆம் ராசிக்கு 8-ல் சந்திரன் இருப்பதால் ஆழ்ந்த மறைவிடத்தில் உள்ளது; 4–8 நாட்கள் ஆகலாம்.'
    }
  },
  9: {
    id: 'CHANDRAN_SIXTH_009',
    house: 9,
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    priority: 75,
    titleEn: 'Moon 9th from 6th Rasi — Higher / Distant Quarter',
    titleTa: '6-ஆம் ராசிக்கு 9-ல் சந்திரன் — மேல்மட்டம் அல்லது தூரப் பகுதி',
    interpretation: {
      en: 'Moon 9th from 6th sign indicates upper shelf or distant location; recovery in 3–6 days.',
      ta: '6-ஆம் ராசிக்கு 9-ல் சந்திரன் மேல் அலமாரி அல்லது சற்றே தொலைவில் 3–6 நாட்களுக்குள் கிடைக்கலாம்.'
    }
  },
  10: {
    id: 'CHANDRAN_SIXTH_010',
    house: 10,
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 81,
    titleEn: 'Moon 10th from 6th Rasi — Kendra Activity Center',
    titleTa: '6-ஆம் ராசிக்கு 10-ல் சந்திரன் — செயல் மையத்தில் மீட்பு',
    interpretation: {
      en: 'Moon 10th from 6th sign confirms prompt recovery near work surfaces in 2–4 days.',
      ta: '6-ஆம் ராசிக்கு 10-ல் சந்திரன் வேலை செய்யும் தளத்தில் 2–4 நாட்களுக்குள் கிடைக்க உதவுகிறது.'
    }
  },
  11: {
    id: 'CHANDRAN_SIXTH_011',
    house: 11,
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    priority: 85,
    titleEn: 'Moon 11th from 6th Rasi — Favorable Gain',
    titleTa: '6-ஆம் ராசிக்கு 11-ல் சந்திரன் — சாதகமான லாபம்',
    interpretation: {
      en: 'Moon in 11th from 6th sign indicates overcoming obstacles rapidly in 1–3 days.',
      ta: '6-ஆம் ராசிக்கு 11-ல் சந்திரன் தடைகளை வென்று 1–3 நாட்களுக்குள் பொருள் கிடைக்க உதவுகிறது.'
    }
  },
  12: {
    id: 'CHANDRAN_SIXTH_012',
    house: 12,
    unit: 'weeks',
    timeValue: 2,
    timeRangeEn: 'Within 1–2 weeks',
    timeRangeTa: '1–2 வாரங்களுக்குள்',
    category: 'Long Delay',
    categoryTa: 'நீண்ட தாமதம்',
    priority: 78,
    titleEn: 'Moon 12th from 6th Rasi — Substantial Delay',
    titleTa: '6-ஆம் ராசிக்கு 12-ல் சந்திரன் — கணிசமான காலதாமதம்',
    interpretation: {
      en: 'Moon in 12th from 6th sign points to prolonged search across 1–2 weeks.',
      ta: '6-ஆம் ராசிக்கு 12-ல் சந்திரன் நீண்ட தாமதத்தை ஏற்படுத்தி 1–2 வாரங்களுக்குப் பின் மீட்கப்படலாம்.'
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Documented 27 Nakshatras Timing Rules (§11)
// ─────────────────────────────────────────────────────────────────────────────

export interface NakshatraTimingRule {
  id: string;
  nakshatraId: number;
  nameEn: string;
  nameTa: string;
  lordEn: string;
  lordTa: string;
  nature: 'Laghu-Kshipra' | 'Sthira' | 'Chara' | 'Mridu' | 'Tikshna' | 'Ugra' | 'Misra';
  natureTa: string;
  unit: TimeGranularity;
  timeValue?: number;
  timeRangeEn: string;
  timeRangeTa: string;
  category: TimeCategory;
  categoryTa: TimeCategoryTa;
  ruleDocumented: boolean;
  interpretation: {
    en: string;
    ta: string;
  };
}

export const chandranNakshatraTimingRules: Record<string, NakshatraTimingRule> = {
  Ashwini: {
    id: 'CHANDRAN_NAK_001',
    nakshatraId: 1,
    nameEn: 'Ashwini',
    nameTa: 'அசுவினி',
    lordEn: 'Ketu',
    lordTa: 'கேது',
    nature: 'Laghu-Kshipra',
    natureTa: 'லகு-க்ஷிப்ரம் (துரிதம்)',
    unit: 'days',
    timeValue: 1,
    timeRangeEn: 'Within 1–2 days',
    timeRangeTa: '1–2 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Ashwini is a swift (Kshipra) star ruled by Ketu; indicates fast recovery within 1–2 days.',
      ta: 'அசுவினி துரித நட்சத்திரம்; 1–2 நாட்களுக்குள் பொருள் கிடைக்க வாய்ப்புள்ளது.'
    }
  },
  Bharani: {
    id: 'CHANDRAN_NAK_002',
    nakshatraId: 2,
    nameEn: 'Bharani',
    nameTa: 'பரணி',
    lordEn: 'Venus',
    lordTa: 'சுக்கிரன்',
    nature: 'Ugra',
    natureTa: 'உக்கிரம்',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–5 days',
    timeRangeTa: '3–5 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Bharani is an Ugra star; recovery requires hard search, expected within 3–5 days.',
      ta: 'பரணி உக்கிர நட்சத்திரம்; தீவிர தேடலுக்குப் பின் 3–5 நாட்களுக்குள் கிடைக்கலாம்.'
    }
  },
  Krittika: {
    id: 'CHANDRAN_NAK_003',
    nakshatraId: 3,
    nameEn: 'Krittika',
    nameTa: 'கிருத்திகை',
    lordEn: 'Sun',
    lordTa: 'சூரியன்',
    nature: 'Misra',
    natureTa: 'மிஸ்ரம் (கலந்தது)',
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Krittika (Fire/Sun) indicates lit or metallic area; discovery within 2–4 days.',
      ta: 'கிருத்திகை வெளிச்சம் மற்றும் நெருப்பு சார்ந்த இடம்; 2–4 நாட்களுக்குள் கண்டறியப்படும்.'
    }
  },
  Rohini: {
    id: 'CHANDRAN_NAK_004',
    nakshatraId: 4,
    nameEn: 'Rohini',
    nameTa: 'ரோகிணி',
    lordEn: 'Moon',
    lordTa: 'சந்திரன்',
    nature: 'Sthira',
    natureTa: 'ஸ்திரம் (நிலையானது)',
    unit: 'days',
    timeValue: 5,
    timeRangeEn: 'Within 3–7 days',
    timeRangeTa: '3–7 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Rohini is a fixed (Sthira) star; the item is unmoved and found in 3–7 days.',
      ta: 'ரோகிணி ஸ்திர நட்சத்திரம்; பொருள் நகராமல் இருந்து 3–7 நாட்களுக்குள் கிடைக்கும்.'
    }
  },
  Mrigashira: {
    id: 'CHANDRAN_NAK_005',
    nakshatraId: 5,
    nameEn: 'Mrigashira',
    nameTa: 'மிருகசீரிஷம்',
    lordEn: 'Mars',
    lordTa: 'செவ்வாய்',
    nature: 'Mridu',
    natureTa: 'மிருது (மென்மையானது)',
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Mrigashira is a soft star; found in comfortable or decorative spots in 2–4 days.',
      ta: 'மிருகசீரிஷம் மென்மையான நட்சத்திரம்; அலங்கார அல்லது ஓய்வு இடத்தில் 2–4 நாட்களில் கிடைக்கும்.'
    }
  },
  Ardra: {
    id: 'CHANDRAN_NAK_006',
    nakshatraId: 6,
    nameEn: 'Ardra',
    nameTa: 'திருவாதிரை',
    lordEn: 'Rahu',
    lordTa: 'ராகு',
    nature: 'Tikshna',
    natureTa: 'தீக்ஷ்ணம் (கூர்மை/மறைவு)',
    unit: 'days',
    timeValue: 5,
    timeRangeEn: 'Within 4–7 days',
    timeRangeTa: '4–7 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Ardra is a sharp star ruled by Rahu; obscured in technology/cables, found in 4–7 days.',
      ta: 'திருவாதிரை ராகு ஆதிக்கம்; மின்னணு அல்லது சிக்கலான இடத்தில் 4–7 நாட்களில் கிடைக்கும்.'
    }
  },
  Punarvasu: {
    id: 'CHANDRAN_NAK_007',
    nakshatraId: 7,
    nameEn: 'Punarvasu',
    nameTa: 'புனர்பூசம்',
    lordEn: 'Jupiter',
    lordTa: 'குரு',
    nature: 'Chara',
    natureTa: 'சரம் (நகரும் தன்மை)',
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Punarvasu represents return/renewal ruled by Jupiter; recovery favored in 1–3 days.',
      ta: 'புனர்பூசம் மீண்டும் கிடைப்பதை குறிக்கும்; குரு அனுகூலத்தால் 1–3 நாட்களில் கிடைக்கும்.'
    }
  },
  Pushya: {
    id: 'CHANDRAN_NAK_008',
    nakshatraId: 8,
    nameEn: 'Pushya',
    nameTa: 'பூசம்',
    lordEn: 'Saturn',
    lordTa: 'சனி',
    nature: 'Laghu-Kshipra',
    natureTa: 'லகு-க்ஷிப்ரம் (மிக சுபமானது)',
    unit: 'days',
    timeValue: 1,
    timeRangeEn: 'Within 1–2 days',
    timeRangeTa: '1–2 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Pushya is an auspicious swift star; recovery strongly supported within 1–2 days.',
      ta: 'பூசம் மிக சுபமான நற்பலன் தரும் நட்சத்திரம்; 1–2 நாட்களுக்குள் பொருள் மீட்கப்படும்.'
    }
  },
  Ashlesha: {
    id: 'CHANDRAN_NAK_009',
    nakshatraId: 9,
    nameEn: 'Ashlesha',
    nameTa: 'ஆயில்யம்',
    lordEn: 'Mercury',
    lordTa: 'புதன்',
    nature: 'Tikshna',
    natureTa: 'தீக்ஷ்ணம் (சுருண்ட நிலை)',
    unit: 'days',
    timeValue: 5,
    timeRangeEn: 'Within 4–7 days',
    timeRangeTa: '4–7 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Ashlesha indicates entangled or hidden items beneath coils; recovery in 4–7 days.',
      ta: 'ஆயில்யம் சுருண்டு அல்லது மூலைகளில் மறைந்திருப்பதை குறிக்கும்; 4–7 நாட்களில் கிடைக்கும்.'
    }
  },
  Magha: {
    id: 'CHANDRAN_NAK_010',
    nakshatraId: 10,
    nameEn: 'Magha',
    nameTa: 'மகம்',
    lordEn: 'Ketu',
    lordTa: 'கேது',
    nature: 'Ugra',
    natureTa: 'உக்கிரம் (பாரம்பரிய இடம்)',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–5 days',
    timeRangeTa: '3–5 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Magha indicates ancestral or heavy formal placement; recovery in 3–5 days.',
      ta: 'மகம் பெரியவர்கள் அல்லது பூர்வீகப் பொருட்கள் அருகில் இருப்பதை குறிக்கும்; 3–5 நாட்களில் கிடைக்கும்.'
    }
  },
  'Purva Phalguni': {
    id: 'CHANDRAN_NAK_011',
    nakshatraId: 11,
    nameEn: 'Purva Phalguni',
    nameTa: 'பூரம்',
    lordEn: 'Venus',
    lordTa: 'சுக்கிரன்',
    nature: 'Ugra',
    natureTa: 'உக்கிரம் / வசதி',
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Purva Phalguni is governed by Venus; item placed near wardrobes/linen in 2–4 days.',
      ta: 'பூரம் சுக்கிரன் ஆதிக்கம்; உடை அலமாரி அல்லது படுக்கையறையில் 2–4 நாட்களில் கிடைக்கும்.'
    }
  },
  'Uttara Phalguni': {
    id: 'CHANDRAN_NAK_012',
    nakshatraId: 12,
    nameEn: 'Uttara Phalguni',
    nameTa: 'உத்திரம்',
    lordEn: 'Sun',
    lordTa: 'சூரியன்',
    nature: 'Sthira',
    natureTa: 'ஸ்திரம்',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Uttara Phalguni is a fixed star; stationary recovery indicated within 3–6 days.',
      ta: 'உத்திரம் ஸ்திர நட்சத்திரம்; பொருள் இடம் மாறாமல் 3–6 நாட்களுக்குள் மீட்கப்படும்.'
    }
  },
  Hasta: {
    id: 'CHANDRAN_NAK_013',
    nakshatraId: 13,
    nameEn: 'Hasta',
    nameTa: 'அஸ்தம்',
    lordEn: 'Moon',
    lordTa: 'சந்திரன்',
    nature: 'Laghu-Kshipra',
    natureTa: 'லகு-க்ஷிப்ரம் (கைக்கு வருதல்)',
    unit: 'days',
    timeValue: 1,
    timeRangeEn: 'Within 1–2 days',
    timeRangeTa: '1–2 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Hasta represents the hand and quick grasping; recovery is swift within 1–2 days.',
      ta: 'அஸ்தம் கைவசமாவதை குறிக்கும் துரித நட்சத்திரம்; 1–2 நாட்களுக்குள் பொருள் மீண்டும் கைகூடும்.'
    }
  },
  Chitra: {
    id: 'CHANDRAN_NAK_014',
    nakshatraId: 14,
    nameEn: 'Chitra',
    nameTa: 'சித்திரை',
    lordEn: 'Mars',
    lordTa: 'செவ்வாய்',
    nature: 'Mridu',
    natureTa: 'மிருது (சிற்ப/கலை வேலைப்பாடு)',
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Chitra signifies designed or artistic locations; found within 2–4 days.',
      ta: 'சித்திரை வேலைப்பாடு அல்லது கலைநயமிக்க இடத்தில் 2–4 நாட்களில் மீட்கப்படலாம்.'
    }
  },
  Swati: {
    id: 'CHANDRAN_NAK_015',
    nakshatraId: 15,
    nameEn: 'Swati',
    nameTa: 'சுவாதி',
    lordEn: 'Rahu',
    lordTa: 'ராகு',
    nature: 'Chara',
    natureTa: 'சரம் (காற்று சஞ்சாரம்)',
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Swati is a movable air star; displaced by wind/motion, found quickly in 1–3 days.',
      ta: 'சுவாதி காற்று சஞ்சார நட்சத்திரம்; மேசையின் மேல் அல்லது நகர்வில் 1–3 நாட்களில் கிடைக்கும்.'
    }
  },
  Vishakha: {
    id: 'CHANDRAN_NAK_016',
    nakshatraId: 16,
    nameEn: 'Vishakha',
    nameTa: 'விசாகம்',
    lordEn: 'Jupiter',
    lordTa: 'குரு',
    nature: 'Misra',
    natureTa: 'மிஸ்ரம்',
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–5 days',
    timeRangeTa: '2–5 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Vishakha indicates a bifurcated area or entryway; recovery in 2–5 days.',
      ta: 'விசாகம் நுழைவாயில் அல்லது இரண்டு அறைகளுக்கு இடையே 2–5 நாட்களில் கிடைக்கும்.'
    }
  },
  Anuradha: {
    id: 'CHANDRAN_NAK_017',
    nakshatraId: 17,
    nameEn: 'Anuradha',
    nameTa: 'அனுஷம்',
    lordEn: 'Saturn',
    lordTa: 'சனி',
    nature: 'Mridu',
    natureTa: 'மிருது (நட்பு சுட்டு)',
    unit: 'days',
    timeValue: 3,
    timeRangeEn: 'Within 2–4 days',
    timeRangeTa: '2–4 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Anuradha is a soft star of friendly cooperation; retrieved in 2–4 days.',
      ta: 'அனுஷம் நட்பு நட்சத்திரம்; நண்பர்கள் அல்லது பணியாளர்கள் மூலம் 2–4 நாட்களில் கிடைக்கும்.'
    }
  },
  Jyeshtha: {
    id: 'CHANDRAN_NAK_018',
    nakshatraId: 18,
    nameEn: 'Jyeshtha',
    nameTa: 'கேட்டை',
    lordEn: 'Mercury',
    lordTa: 'புதன்',
    nature: 'Tikshna',
    natureTa: 'தீக்ஷ்ணம் (உயரமான பகுதி)',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Jyeshtha represents high or protected shelves; retrieval within 3–6 days.',
      ta: 'கேட்டை உயரமான அலமாரி அல்லது முக்கியமான இடத்தில் 3–6 நாட்களில் மீட்கப்படும்.'
    }
  },
  Mula: {
    id: 'CHANDRAN_NAK_019',
    nakshatraId: 19,
    nameEn: 'Mula',
    nameTa: 'மூலம்',
    lordEn: 'Ketu',
    lordTa: 'கேது',
    nature: 'Tikshna',
    natureTa: 'தீக்ஷ்ணம் (வேர்ப்பகுதி / தரை)',
    unit: 'days',
    timeValue: 5,
    timeRangeEn: 'Within 4–7 days',
    timeRangeTa: '4–7 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Mula points to roots, base of walls, or floor foundations; recovery in 4–7 days.',
      ta: 'மூலம் தரைமட்டம், சுவரோரம் அல்லது அடிப்பகுதியில் 4–7 நாட்களில் கண்டறியப்படும்.'
    }
  },
  'Purva Ashadha': {
    id: 'CHANDRAN_NAK_020',
    nakshatraId: 20,
    nameEn: 'Purva Ashadha',
    nameTa: 'பூராடம்',
    lordEn: 'Venus',
    lordTa: 'சுக்கிரன்',
    nature: 'Ugra',
    natureTa: 'உக்கிரம் (நீர் தொடர்பு)',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–5 days',
    timeRangeTa: '3–5 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Purva Ashadha represents water and fluids; check kitchen or bath area in 3–5 days.',
      ta: 'பூராடம் நீர் சார்ந்த பகுதி; வாஷ்பேசின் அல்லது சமையலறை பகுதியில் 3–5 நாட்களில் கிடைக்கும்.'
    }
  },
  'Uttara Ashadha': {
    id: 'CHANDRAN_NAK_021',
    nakshatraId: 21,
    nameEn: 'Uttara Ashadha',
    nameTa: 'உத்திராடம்',
    lordEn: 'Sun',
    lordTa: 'சூரியன்',
    nature: 'Sthira',
    natureTa: 'ஸ்திரம் (வெற்றி)',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Uttara Ashadha signifies victory after calm search; found in 3–6 days.',
      ta: 'உத்திராடம் ஸ்திர வெற்றி நட்சத்திரம்; முறையான தேடலில் 3–6 நாட்களில் மீட்கப்படும்.'
    }
  },
  Shravana: {
    id: 'CHANDRAN_NAK_022',
    nakshatraId: 22,
    nameEn: 'Shravana',
    nameTa: 'திருவோணம்',
    lordEn: 'Moon',
    lordTa: 'சந்திரன்',
    nature: 'Chara',
    natureTa: 'சரம் (கேட்டறிதல்)',
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Shravana is Moon’s own star of hearing and communication; news received in 1–3 days.',
      ta: 'திருவோணம் சந்திரன் சொந்த நட்சத்திரம்; செவிவழி செய்தி மூலம் 1–3 நாட்களில் கிடைக்கும்.'
    }
  },
  Dhanishta: {
    id: 'CHANDRAN_NAK_023',
    nakshatraId: 23,
    nameEn: 'Dhanishta',
    nameTa: 'அவிட்டம்',
    lordEn: 'Mars',
    lordTa: 'செவ்வாய்',
    nature: 'Chara',
    natureTa: 'சரம் (செல்வ வளம்)',
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Dhanishta is a movable star of wealth; recovery of valued goods in 1–3 days.',
      ta: 'அவிட்டம் பொன்/பொருள் சார்ந்த சுப நட்சத்திரம்; 1–3 நாட்களில் மீட்கப்படலாம்.'
    }
  },
  Shatabhisha: {
    id: 'CHANDRAN_NAK_024',
    nakshatraId: 24,
    nameEn: 'Shatabhisha',
    nameTa: 'சதயம்',
    lordEn: 'Rahu',
    lordTa: 'ராகு',
    nature: 'Chara',
    natureTa: 'சரம் (மூடிய பெட்டி)',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Shatabhisha indicates enclosed or container placement; found in 3–6 days.',
      ta: 'சதயம் மூடிய பெட்டி அல்லது திரைக்குப் பின்னால் இருந்து 3–6 நாட்களில் கிடைக்கும்.'
    }
  },
  'Purva Bhadrapada': {
    id: 'CHANDRAN_NAK_025',
    nakshatraId: 25,
    nameEn: 'Purva Bhadrapada',
    nameTa: 'பூரட்டாதி',
    lordEn: 'Jupiter',
    lordTa: 'குரு',
    nature: 'Ugra',
    natureTa: 'உக்கிரம்',
    unit: 'days',
    timeValue: 4,
    timeRangeEn: 'Within 3–6 days',
    timeRangeTa: '3–6 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Purva Bhadrapada indicates higher corner or shelf; recovery in 3–6 days.',
      ta: 'பூரட்டாதி மேல் மூலை அல்லது உயரமான இடத்தில் 3–6 நாட்களில் மீட்கப்படும்.'
    }
  },
  'Uttara Bhadrapada': {
    id: 'CHANDRAN_NAK_026',
    nakshatraId: 26,
    nameEn: 'Uttara Bhadrapada',
    nameTa: 'உத்திரட்டாதி',
    lordEn: 'Saturn',
    lordTa: 'சனி',
    nature: 'Sthira',
    natureTa: 'ஸ்திரம் (ஆழ்ந்த பாதுகாப்பு)',
    unit: 'days',
    timeValue: 6,
    timeRangeEn: 'Within 4–8 days',
    timeRangeTa: '4–8 நாட்களுக்குள்',
    category: 'Moderate Delay',
    categoryTa: 'மிதமான தாமதம்',
    ruleDocumented: true,
    interpretation: {
      en: 'Uttara Bhadrapada is a fixed star; stationary recovery indicated in 4–8 days.',
      ta: 'உத்திரட்டாதி ஸ்திர நட்சத்திரம்; ஆழமான இடத்தில் இருந்து 4–8 நாட்களில் கிடைக்கும்.'
    }
  },
  Revati: {
    id: 'CHANDRAN_NAK_027',
    nakshatraId: 27,
    nameEn: 'Revati',
    nameTa: 'ரேவதி',
    lordEn: 'Mercury',
    lordTa: 'புதன்',
    nature: 'Mridu',
    natureTa: 'மிருது (சுப நிறைவு)',
    unit: 'days',
    timeValue: 2,
    timeRangeEn: 'Within 1–3 days',
    timeRangeTa: '1–3 நாட்களுக்குள்',
    category: 'Soon',
    categoryTa: 'விரைவில்',
    ruleDocumented: true,
    interpretation: {
      en: 'Revati is the culminating soft star of wealth and safe travel; recovery in 1–3 days.',
      ta: 'ரேவதி சுப மங்கள நிறைவு நட்சத்திரம்; அமைதியாக 1–3 நாட்களுக்குள் பொருள் மீண்டும் கிடைக்கும்.'
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Moon Pada Timing Informational Helper (§12)
// ─────────────────────────────────────────────────────────────────────────────

export const getPadaTimingNote = (pada: number): { en: string; ta: string } => {
  return {
    en: `Pada ${pada}: Informational only — no documented timing rule available in the current rulebook.`,
    ta: `பாதம் ${pada}: தகவல் மட்டுமே — தற்போதைய விதிநூலில் இதற்கான தனிப்பட்ட கால விதி ஆவணப்படுத்தப்படவில்லை.`
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Astronomical Moon Transitions Calculator (§6)
// ─────────────────────────────────────────────────────────────────────────────

function getMoonSiderealLongitude(date: Date): number {
  const ayanamsa = calculateLahiriAyanamsa(date);
  const vec = Astronomy.GeoVector(Astronomy.Body.Moon, date, true);
  const ecl = Astronomy.Ecliptic(vec);
  return ((ecl.elon - ayanamsa) % 360 + 360) % 360;
}

function findNextIngressDate(startDate: Date, spanDegrees: number): Date {
  const currentLon = getMoonSiderealLongitude(startDate);
  const nextIndex = Math.floor(currentLon / spanDegrees) + 1;
  const targetLon = (nextIndex * spanDegrees) % 360;

  let t = startDate.getTime();
  // Fast secant / gradient search
  for (let i = 0; i < 8; i++) {
    const lon = getMoonSiderealLongitude(new Date(t));
    let diff = (targetLon - lon) % 360;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    if (Math.abs(diff) < 0.0001) break;
    // Mean moon speed approx 13.176 degrees/day = 0.549 deg/hr
    const speedPerMs = 13.176 / (24 * 3600 * 1000);
    t += diff / speedPerMs;
  }
  return new Date(t);
}

export const calculateNextMoonTransitions = (calculationDate: Date = new Date()): AstronomicalTransitionInfo => {
  const nakshatraSpan = 360 / 27; // 13.333333333333334
  const rasiSpan = 30;

  const nextNakDate = findNextIngressDate(calculationDate, nakshatraSpan);
  const nextRasiDate = findNextIngressDate(calculationDate, rasiSpan);

  const msToNak = Math.max(0, nextNakDate.getTime() - calculationDate.getTime());
  const msToRasi = Math.max(0, nextRasiDate.getTime() - calculationDate.getTime());

  const hoursToNextNak = parseFloat((msToNak / 3600000).toFixed(1));
  const hoursToNextRasi = parseFloat((msToRasi / 3600000).toFixed(1));

  // Target coordinates
  const targetNakLon = getMoonSiderealLongitude(new Date(nextNakDate.getTime() + 60000));
  const targetNakIndex = Math.min(Math.floor(targetNakLon / nakshatraSpan), 26);
  const targetNak = NAKSHATRAS[targetNakIndex] || NAKSHATRAS[0];

  const targetRasiLon = getMoonSiderealLongitude(new Date(nextRasiDate.getTime() + 60000));
  const targetRasiIndex = Math.min(Math.floor(targetRasiLon / 30), 11);
  const targetRasi = RASI_LIST[targetRasiIndex] || RASI_LIST[0];

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return {
    nextRasiId: targetRasi.id,
    nextRasiNameEn: targetRasi.englishNameOnly,
    nextRasiNameTa: targetRasi.tamilNameOnly,
    nextRasiDate,
    nextRasiFormattedEn: `${nextRasiDate.toLocaleString('en-IN', formatOptions)} (~${hoursToNextRasi}h)`,
    nextRasiFormattedTa: `${nextRasiDate.toLocaleString('ta-IN', formatOptions)} (~${hoursToNextRasi} மணிநேரம்)`,
    hoursToNextRasi,
    nextNakshatraId: targetNak.id,
    nextNakshatraNameEn: targetNak.nameEn,
    nextNakshatraNameTa: targetNak.nameTa,
    nextNakshatraDate: nextNakDate,
    nextNakshatraFormattedEn: `${nextNakDate.toLocaleString('en-IN', formatOptions)} (~${hoursToNextNak}h)`,
    nextNakshatraFormattedTa: `${nextNakDate.toLocaleString('ta-IN', formatOptions)} (~${hoursToNextNak} மணிநேரம்)`,
    hoursToNextNakshatra: hoursToNextNak
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Main Timing Calculation Engine: calculateChandranFindingTime (§3)
// ─────────────────────────────────────────────────────────────────────────────

export const calculateChandranFindingTime = (
  context: ChandranContext
): ChandranFindingTimeResult => {
  const {
    moonRasi,
    arudaRasiId,
    sixthRasiId,
    resolutionStatus,
    prasnaDateTime = new Date()
  } = context;

  // Question & Resolution Labels (§1)
  const questionEn = 'Lost object — Will it be found?';
  const questionTa = 'காணாமல் போன பொருள் கிடைக்குமா?';

  // Check 1: Reliability of Astronomical Data (§2)
  if (
    typeof moonRasi !== 'number' ||
    isNaN(moonRasi) ||
    moonRasi < 1 ||
    moonRasi > 12 ||
    !prasnaDateTime ||
    isNaN(prasnaDateTime.getTime())
  ) {
    return {
      isApplicable: false,
      hasReliableData: false,
      unreliableDataReasonEn: 'Chandran-based timing cannot be calculated reliably with the available astronomical data.',
      unreliableDataReasonTa: 'கிடைக்கப்பெற்ற வானியல் தரவுகளின்படி சந்திரன் அடிப்படையிலான காலக் கணிப்பை துல்லியமாக செய்ய இயலவில்லை.',
      questionEn,
      questionTa,
      resolutionEn: 'Astronomical data insufficient',
      resolutionTa: 'வானியல் தரவு போதுமானதாக இல்லை',
      timeOfFindingEn: 'Chandran-based timing cannot be calculated reliably with the available astronomical data.',
      timeOfFindingTa: 'கிடைக்கப்பெற்ற வானியல் தரவுகளின்படி சந்திரன் அடிப்படையிலான காலக் கணிப்பை துல்லியமாக செய்ய இயலவில்லை.',
      timeCategoryEn: 'Not applicable',
      timeCategoryTa: 'பொருந்தாது',
      moonBasisEn: 'Astronomical Moon ephemeris coordinates missing or incomplete.',
      moonBasisTa: 'சந்திரனின் துல்லியமான வானியல் சஞ்சார விவரங்கள் கிடைக்கவில்லை.',
      status: resolutionStatus,
      timeRangeEn: 'Data incomplete',
      timeRangeTa: 'தரவு முழுமையடையவில்லை',
      confidence: 'not_applicable',
      ruleId: 'NONE',
      matchedTimingRules: [],
      isConflict: false,
      accuracyDistinction: {
        astronomicalFactEn: 'Astronomical Moon position is not available.',
        astronomicalFactTa: 'சந்திரனின் வானியல் நிலை கிடைக்கவில்லை.',
        traditionalRuleEn: 'No traditional rule can be applied without verified ephemeris.',
        traditionalRuleTa: 'துல்லிய வானியல் தரவின்றி பாரம்பரிய விதியை செயல்படுத்த முடியாது.',
        predictionEn: 'Chandran-based timing calculation suppressed.',
        predictionTa: 'சந்திரன் காலக் கணிப்பு தவிர்க்கப்பட்டுள்ளது.'
      },
      whyThisTime: {
        arudaLagnaEn: context.arudaRasiNameEn || 'Unknown',
        arudaLagnaTa: context.arudaRasiNameTa || 'தெரியவில்லை',
        sixthRasiEn: context.sixthRasiNameEn || 'Unknown',
        sixthRasiTa: context.sixthRasiNameTa || 'தெரியவில்லை',
        chandranRasiEn: 'Unknown',
        chandranRasiTa: 'தெரியவில்லை',
        chandranNakshatraEn: 'Unknown',
        chandranNakshatraTa: 'தெரியவில்லை',
        chandranPada: 1,
        padaNoteEn: 'No data',
        padaNoteTa: 'தரவு இல்லை',
        moonFromAruda: 0,
        moonFromSixthRasi: 0,
        matchingRuleId: 'NONE',
        traditionalTimeUnit: 'none',
        traditionalTimeUnitTa: 'இல்லை',
        resultRangeEn: 'N/A',
        resultRangeTa: 'பொருந்தாது'
      },
      contextData: {
        moonRasiEn: 'Unknown',
        moonRasiTa: 'தெரியவில்லை',
        moonNakshatraEn: 'Unknown',
        moonNakshatraTa: 'தெரியவில்லை',
        moonPada: 1,
        moonHouseFromAruda: 0,
        moonHouseFromSixthRasi: 0,
        moonDegreeFormatted: '0° 00\'',
        moonPhaseNameEn: 'Unknown',
        moonPhaseNameTa: 'தெரியவில்லை'
      }
    };
  }

  // Calculate houses
  const moonHouseFromAruda = context.moonHouseFromArudam || (((moonRasi - arudaRasiId + 12) % 12) + 1);
  const moonHouseFromSixthRasi = context.moonHouseFromSixthRasi || (((moonRasi - sixthRasiId + 12) % 12) + 1);

  // Sign and Nakshatra lookups
  const moonRasiData = RASI_LIST[moonRasi - 1] || RASI_LIST[0];
  const arudaRasiData = RASI_LIST[arudaRasiId - 1] || RASI_LIST[0];
  const sixthRasiData = RASI_LIST[sixthRasiId - 1] || RASI_LIST[0];

  const moonNakshatraNameEn = context.moonNakshatra || 'Ashwini';
  const nakRuleKey = Object.keys(chandranNakshatraTimingRules).find(
    k => k.toLowerCase().replace(/\s+/g, '') === moonNakshatraNameEn.replace(/\s+/g, '').toLowerCase()
  ) || 'Ashwini';
  const nakshatraRule = chandranNakshatraTimingRules[nakRuleKey];
  const moonPada = context.moonPada || 1;

  // Moon Phase
  let moonPhaseDeg = context.moonPhase;
  if (typeof moonPhaseDeg !== 'number') {
    try {
      moonPhaseDeg = Astronomy.MoonPhase(prasnaDateTime);
    } catch {
      moonPhaseDeg = 0;
    }
  }
  const isWaxing = moonPhaseDeg < 180;
  const moonPhaseNameEn = isWaxing ? 'Shukla Paksha (Waxing / Bright Half)' : 'Krishna Paksha (Waning / Dark Half)';
  const moonPhaseNameTa = isWaxing ? 'வளர்பிறை (சுக்ல பக்ஷம்)' : 'தேய்பிறை (கிருஷ்ண பக்ஷம்)';

  // Calculate astronomical transitions
  let transitions: AstronomicalTransitionInfo | undefined;
  try {
    transitions = calculateNextMoonTransitions(prasnaDateTime);
  } catch {
    // If transitions fail, calculations proceed with current ephemeris
  }

  // Check 2: Resolution Engine Order — "not_fulfilled" suppression per §9
  if (resolutionStatus === 'not_fulfilled') {
    return {
      isApplicable: false,
      hasReliableData: true,
      questionEn,
      questionTa,
      resolutionEn: 'No clear indication that the object will be recovered now.',
      resolutionTa: 'தற்போது பொருள் கிடைக்கும் தெளிவான அறிகுறி இல்லை.',
      timeOfFindingEn: 'Not applicable based on the selected rules.',
      timeOfFindingTa: 'தற்போதைய விதிகளின்படி கணிக்க இயலாது.',
      timeCategoryEn: 'Not applicable',
      timeCategoryTa: 'பொருந்தாது',
      moonBasisEn: 'Recovery is not indicated by the resolution engine; finding time calculation is suppressed per §9.',
      moonBasisTa: 'தீர்வு விதிகளின்படி பொருள் கிடைக்கும் சுட்டு இல்லாததால் காலக் கணிப்பு விதிகளின்படி தவிர்க்கப்படுகிறது.',
      status: 'not_fulfilled',
      timeRangeEn: 'Not applicable',
      timeRangeTa: 'பொருந்தாது',
      confidence: 'not_applicable',
      ruleId: 'NOT_FULFILLED_SUPPRESSED',
      matchedTimingRules: [],
      isConflict: false,
      accuracyDistinction: {
        astronomicalFactEn: `Chandran is currently in ${moonRasiData.englishNameOnly} (${nakshatraRule.nameEn} Nakshatra, Pada ${moonPada}).`,
        astronomicalFactTa: `சந்திரன் தற்போது ${moonRasiData.tamilNameOnly} ராசியில் (${nakshatraRule.nameTa} நட்சத்திரம், பாதம் ${moonPada}) சஞ்சரிக்கிறார்.`,
        traditionalRuleEn: 'Prasna Shastra dictates that time-of-finding is only evaluated when recovery is indicated.',
        traditionalRuleTa: 'பொருள் கிடைக்கும் சுட்டு இருக்கும் போது மட்டுமே பாரம்பரிய ஆருட விதிப்படி காலம் கணிக்கப்பட வேண்டும்.',
        predictionEn: 'Finding time is not applicable.',
        predictionTa: 'கிடைக்கும் காலம் கணிக்க இயலாது.'
      },
      whyThisTime: {
        arudaLagnaEn: arudaRasiData.englishNameOnly,
        arudaLagnaTa: arudaRasiData.tamilNameOnly,
        sixthRasiEn: sixthRasiData.englishNameOnly,
        sixthRasiTa: sixthRasiData.tamilNameOnly,
        chandranRasiEn: moonRasiData.englishNameOnly,
        chandranRasiTa: moonRasiData.tamilNameOnly,
        chandranNakshatraEn: nakshatraRule.nameEn,
        chandranNakshatraTa: nakshatraRule.nameTa,
        chandranPada: moonPada,
        padaNoteEn: getPadaTimingNote(moonPada).en,
        padaNoteTa: getPadaTimingNote(moonPada).ta,
        moonFromAruda: moonHouseFromAruda,
        moonFromSixthRasi: moonHouseFromSixthRasi,
        matchingRuleId: 'NOT_FULFILLED',
        traditionalTimeUnit: 'none',
        traditionalTimeUnitTa: 'பொருந்தாது',
        resultRangeEn: 'Not applicable',
        resultRangeTa: 'பொருந்தாது'
      },
      contextData: {
        moonRasiEn: moonRasiData.englishNameOnly,
        moonRasiTa: moonRasiData.tamilNameOnly,
        moonNakshatraEn: nakshatraRule.nameEn,
        moonNakshatraTa: nakshatraRule.nameTa,
        moonPada,
        moonHouseFromAruda,
        moonHouseFromSixthRasi,
        moonDegreeFormatted: context.moonDegreeInRasi !== undefined ? `${Math.floor(context.moonDegreeInRasi)}°` : '0°',
        moonPhaseNameEn,
        moonPhaseNameTa
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Matched Timing Rules collection (§13)
  // ─────────────────────────────────────────────────────────────────────────
  const matchedTimingRules: MatchedTimingRule[] = [];

  // Primary Rule: Moon House from Aruda Lagna (Houses 1 to 12)
  const arudaRule = CHANDRAN_HOUSE_ARUDA_RULES[moonHouseFromAruda] || CHANDRAN_HOUSE_ARUDA_RULES[1];
  matchedTimingRules.push({
    ruleId: arudaRule.id,
    titleEn: arudaRule.titleEn,
    titleTa: arudaRule.titleTa,
    resultEn: arudaRule.timeRangeEn,
    resultTa: arudaRule.timeRangeTa,
    strength: 'primary',
    priority: arudaRule.priority,
    unit: arudaRule.unit,
    timeCategory: arudaRule.category,
    timeCategoryTa: arudaRule.categoryTa,
    explanationEn: arudaRule.interpretation.en,
    explanationTa: arudaRule.interpretation.ta
  });

  // Secondary Rule: Moon House from 6th Rasi (Houses 1 to 12)
  const sixthRule = CHANDRAN_HOUSE_SIXTH_RULES[moonHouseFromSixthRasi] || CHANDRAN_HOUSE_SIXTH_RULES[1];
  matchedTimingRules.push({
    ruleId: sixthRule.id,
    titleEn: sixthRule.titleEn,
    titleTa: sixthRule.titleTa,
    resultEn: sixthRule.timeRangeEn,
    resultTa: sixthRule.timeRangeTa,
    strength: 'secondary',
    priority: sixthRule.priority,
    unit: sixthRule.unit,
    timeCategory: sixthRule.category,
    timeCategoryTa: sixthRule.categoryTa,
    explanationEn: sixthRule.interpretation.en,
    explanationTa: sixthRule.interpretation.ta
  });

  // Secondary Rule 2: Nakshatra Timing Rule (§11)
  if (nakshatraRule) {
    matchedTimingRules.push({
      ruleId: nakshatraRule.id,
      titleEn: `${nakshatraRule.nameEn} Nakshatra (${nakshatraRule.nature})`,
      titleTa: `${nakshatraRule.nameTa} நட்சத்திரம் (${nakshatraRule.natureTa})`,
      resultEn: nakshatraRule.timeRangeEn,
      resultTa: nakshatraRule.timeRangeTa,
      strength: 'secondary',
      priority: 70,
      unit: nakshatraRule.unit,
      timeCategory: nakshatraRule.category,
      timeCategoryTa: nakshatraRule.categoryTa,
      explanationEn: nakshatraRule.interpretation.en,
      explanationTa: nakshatraRule.interpretation.ta
    });
  }

  // Check 3: Delayed Resolution Status (§10)
  if (resolutionStatus === 'delayed') {
    // Delayed recovery rule takes precedence
    const delayedRangeEn = 'Likely after 3–7 days';
    const delayedRangeTa = '3–7 நாட்களுக்குப் பிறகு கிடைக்கும் வாய்ப்பு';
    const delayedCategory: TimeCategory = 'Moderate Delay';
    const delayedCategoryTa: TimeCategoryTa = 'மிதமான தாமதம்';

    const delayedRuleId = 'CHANDRAN_TIME_DELAYED';
    const moonBasisEn = `Moon is in ${moonRasiData.englishNameOnly} (${moonHouseFromAruda}th from Aruda Lagna and ${moonHouseFromSixthRasi}th from 6th Rasi), producing the applicable delayed-recovery timing rule (${delayedRuleId}).`;
    const moonBasisTa = `சந்திரன் ${moonRasiData.tamilNameOnly} ராசியில் (ஆருடத்திற்கு ${moonHouseFromAruda}-ஆம் இடம், 6-ஆம் ராசிக்கு ${moonHouseFromSixthRasi}-ஆம் இடம்) அமைந்ததால், தாமதமாக மீட்பதற்கான பாரம்பரிய கால விதி (${delayedRuleId}) பயன்படுத்தப்பட்டது.`;

    return {
      isApplicable: true,
      hasReliableData: true,
      questionEn,
      questionTa,
      resolutionEn: 'Delayed recovery',
      resolutionTa: 'தாமதமாக கிடைக்கும் வாய்ப்பு',
      timeOfFindingEn: delayedRangeEn,
      timeOfFindingTa: delayedRangeTa,
      timeCategoryEn: delayedCategory,
      timeCategoryTa: delayedCategoryTa,
      moonBasisEn,
      moonBasisTa,
      status: 'delayed',
      timeValue: 5,
      timeUnit: 'days',
      timeRangeEn: delayedRangeEn,
      timeRangeTa: delayedRangeTa,
      estimatedFrom: '3 days',
      estimatedUntil: '7 days',
      confidence: 'rule_based',
      ruleId: delayedRuleId,
      astronomicalTransition: transitions,
      traditionalTransitionInterpretationEn: transitions ? `Moon ingress into ${transitions.nextRasiNameEn} in ~${transitions.hoursToNextRasi}h marks a transition phase aiding recovery.` : undefined,
      traditionalTransitionInterpretationTa: transitions ? `சந்திரன் ~${transitions.hoursToNextRasi} மணிநேரத்தில் ${transitions.nextRasiNameTa} ராசிக்கு மாறுவது மீட்புக்கு சாதகமான மாற்றத்தை ஏற்படுத்தும்.` : undefined,
      matchedTimingRules,
      isConflict: false,
      accuracyDistinction: {
        astronomicalFactEn: `Chandran is currently in ${moonRasiData.englishNameOnly} at ${context.moonDegreeInRasi !== undefined ? `${Math.floor(context.moonDegreeInRasi)}°` : '0°'}, in ${nakshatraRule.nameEn} Nakshatra (Pada ${moonPada}).`,
        astronomicalFactTa: `சந்திரன் தற்போது ${moonRasiData.tamilNameOnly} ராசியில், ${nakshatraRule.nameTa} நட்சத்திரத்தில் (பாதம் ${moonPada}) சஞ்சரிக்கிறார்.`,
        traditionalRuleEn: `This Chandran disposition aligns with delayed-recovery rule ${delayedRuleId} modulated by 6th Rasi influence.`,
        traditionalRuleTa: `இந்த சந்திரன் நிலை 6-ஆம் அதிபதியின் தாக்கத்தோடு கூடிய தாமத மீட்பு விதி ${delayedRuleId} உடன் பொருந்துகிறது.`,
        predictionEn: `Therefore the traditional method indicates recovery ${delayedRangeEn}.`,
        predictionTa: `எனவே பாரம்பரிய ஆருட முறைப்படி காணாமல் போன பொருள் ${delayedRangeTa} கிடைக்க வாய்ப்புள்ளது.`
      },
      whyThisTime: {
        arudaLagnaEn: arudaRasiData.englishNameOnly,
        arudaLagnaTa: arudaRasiData.tamilNameOnly,
        sixthRasiEn: sixthRasiData.englishNameOnly,
        sixthRasiTa: sixthRasiData.tamilNameOnly,
        chandranRasiEn: moonRasiData.englishNameOnly,
        chandranRasiTa: moonRasiData.tamilNameOnly,
        chandranNakshatraEn: nakshatraRule.nameEn,
        chandranNakshatraTa: nakshatraRule.nameTa,
        chandranPada: moonPada,
        padaNoteEn: getPadaTimingNote(moonPada).en,
        padaNoteTa: getPadaTimingNote(moonPada).ta,
        moonFromAruda: moonHouseFromAruda,
        moonFromSixthRasi: moonHouseFromSixthRasi,
        matchingRuleId: delayedRuleId,
        traditionalTimeUnit: 'days',
        traditionalTimeUnitTa: 'நாட்கள்',
        resultRangeEn: delayedRangeEn,
        resultRangeTa: delayedRangeTa
      },
      contextData: {
        moonRasiEn: moonRasiData.englishNameOnly,
        moonRasiTa: moonRasiData.tamilNameOnly,
        moonNakshatraEn: nakshatraRule.nameEn,
        moonNakshatraTa: nakshatraRule.nameTa,
        moonPada,
        moonHouseFromAruda,
        moonHouseFromSixthRasi,
        moonDegreeFormatted: context.moonDegreeInRasi !== undefined ? `${Math.floor(context.moonDegreeInRasi)}°` : '0°',
        moonPhaseNameEn,
        moonPhaseNameTa
      }
    };
  }

  // Check 4: Uncertain Resolution Status (§13 conflict handling)
  if (resolutionStatus === 'uncertain') {
    const mixedFindingEn = 'Mixed indications — exact finding period cannot be narrowed reliably.';
    const mixedFindingTa = 'மாறுபட்ட அறிகுறிகள் உள்ளதால் துல்லியமான காலத்தை குறுக்க முடியவில்லை.';

    return {
      isApplicable: true,
      hasReliableData: true,
      questionEn,
      questionTa,
      resolutionEn: 'Uncertain recovery',
      resolutionTa: 'உறுதியற்ற மீட்பு சுட்டு',
      timeOfFindingEn: mixedFindingEn,
      timeOfFindingTa: mixedFindingTa,
      timeCategoryEn: 'Moderate Delay',
      timeCategoryTa: 'மிதமான தாமதம்',
      moonBasisEn: 'Prasna resolution shows mixed positive and counter indications; exact recovery timing cannot be narrowed with certainty.',
      moonBasisTa: 'ஆருட தீர்வில் முரண்பாடான சுட்டுகள் காணப்படுவதால், காலத்தை துல்லியமாக நிர்ணயிக்க இயலவில்லை.',
      status: 'uncertain',
      timeRangeEn: mixedFindingEn,
      timeRangeTa: mixedFindingTa,
      confidence: 'uncertain',
      ruleId: 'CHANDRAN_TIME_MIXED',
      astronomicalTransition: transitions,
      matchedTimingRules,
      isConflict: true,
      accuracyDistinction: {
        astronomicalFactEn: `Chandran is currently at ${moonRasiData.englishNameOnly}, transiting ${nakshatraRule.nameEn}.`,
        astronomicalFactTa: `சந்திரன் தற்போது ${moonRasiData.tamilNameOnly} ராசியில் ${nakshatraRule.nameTa} நட்சத்திரத்தில் சஞ்சரிக்கிறார்.`,
        traditionalRuleEn: 'Multiple competing traditional rules apply with opposing timing strengths.',
        traditionalRuleTa: 'மாறுபட்ட பலன் தரும் பல பாரம்பரிய ஆருட விதிகள் ஒரே நேரத்தில் பொருந்துகின்றன.',
        predictionEn: mixedFindingEn,
        predictionTa: mixedFindingTa
      },
      whyThisTime: {
        arudaLagnaEn: arudaRasiData.englishNameOnly,
        arudaLagnaTa: arudaRasiData.tamilNameOnly,
        sixthRasiEn: sixthRasiData.englishNameOnly,
        sixthRasiTa: sixthRasiData.tamilNameOnly,
        chandranRasiEn: moonRasiData.englishNameOnly,
        chandranRasiTa: moonRasiData.tamilNameOnly,
        chandranNakshatraEn: nakshatraRule.nameEn,
        chandranNakshatraTa: nakshatraRule.nameTa,
        chandranPada: moonPada,
        padaNoteEn: getPadaTimingNote(moonPada).en,
        padaNoteTa: getPadaTimingNote(moonPada).ta,
        moonFromAruda: moonHouseFromAruda,
        moonFromSixthRasi: moonHouseFromSixthRasi,
        matchingRuleId: 'CHANDRAN_TIME_MIXED',
        traditionalTimeUnit: 'days',
        traditionalTimeUnitTa: 'நாட்கள்',
        resultRangeEn: mixedFindingEn,
        resultRangeTa: mixedFindingTa
      },
      contextData: {
        moonRasiEn: moonRasiData.englishNameOnly,
        moonRasiTa: moonRasiData.tamilNameOnly,
        moonNakshatraEn: nakshatraRule.nameEn,
        moonNakshatraTa: nakshatraRule.nameTa,
        moonPada,
        moonHouseFromAruda,
        moonHouseFromSixthRasi,
        moonDegreeFormatted: context.moonDegreeInRasi !== undefined ? `${Math.floor(context.moonDegreeInRasi)}°` : '0°',
        moonPhaseNameEn,
        moonPhaseNameTa
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Primary Resolution: Fulfilled / Likely Fulfilled
  // ─────────────────────────────────────────────────────────────────────────
  const resolutionEn = resolutionStatus === 'fulfilled' ? 'Found / Full recovery indicated' : 'Likely to be found';
  const resolutionTa = resolutionStatus === 'fulfilled' ? 'நிச்சயம் கிடைக்கும் சுட்டு உள்ளது' : 'கிடைக்கும் வாய்ப்பு உள்ளது';

  // Dominant Primary rule is from Aruda Lagna house
  const dominantRule = arudaRule;
  const timeOfFindingEn = dominantRule.timeRangeEn;
  const timeOfFindingTa = dominantRule.timeRangeTa;
  const timeCategoryEn = dominantRule.category;
  const timeCategoryTa = dominantRule.categoryTa;

  const moonBasisEn = `Moon is in ${moonRasiData.englishNameOnly} (${moonHouseFromAruda}${getOrdinalEn(moonHouseFromAruda)} house from Aruda Lagna and ${moonHouseFromSixthRasi}${getOrdinalEn(moonHouseFromSixthRasi)} from 6th Rasi), matching rule ${dominantRule.id}: ${dominantRule.titleEn}.`;
  const moonBasisTa = `சந்திரன் ${moonRasiData.tamilNameOnly} ராசியில் (ஆருட லக்னத்திற்கு ${moonHouseFromAruda}-ஆம் இடம், 6-ஆம் ராசிக்கு ${moonHouseFromSixthRasi}-ஆம் இடம்) அமைந்ததால், விதி ${dominantRule.id} (${dominantRule.titleTa}) பயன்படுத்தப்பட்டது.`;

  // Transition trigger interpretation (§6)
  let traditionalTransitionEn: string | undefined;
  let traditionalTransitionTa: string | undefined;
  if (transitions) {
    if (transitions.hoursToNextNakshatra <= 24) {
      traditionalTransitionEn = `Moon transits into ${transitions.nextNakshatraNameEn} within ~${transitions.hoursToNextNakshatra} hours, providing an imminent traditional timing trigger.`;
      traditionalTransitionTa = `சந்திரன் அடுத்த ~${transitions.hoursToNextNakshatra} மணிநேரத்தில் ${transitions.nextNakshatraNameTa} நட்சத்திரத்திற்கு பெயர்ச்சி அடைவது உடனடி காலத் தூண்டுதலாக அமைகிறது.`;
    } else {
      traditionalTransitionEn = `Next major planetary ingress is Moon entering ${transitions.nextRasiNameEn} in ~${transitions.hoursToNextRasi} hours (${transitions.nextRasiFormattedEn}).`;
      traditionalTransitionTa = `சந்திரனின் அடுத்த ராசி பெயர்ச்சி: ${transitions.nextRasiNameTa} ராசிக்கு இன்னும் ~${transitions.hoursToNextRasi} மணிநேரத்தில் நிகழும் (${transitions.nextRasiFormattedTa}).`;
    }
  }

  return {
    isApplicable: true,
    hasReliableData: true,
    questionEn,
    questionTa,
    resolutionEn,
    resolutionTa,
    timeOfFindingEn,
    timeOfFindingTa,
    timeCategoryEn,
    timeCategoryTa,
    moonBasisEn,
    moonBasisTa,
    status: resolutionStatus,
    timeValue: dominantRule.timeValue,
    timeUnit: dominantRule.unit,
    timeRangeEn: dominantRule.timeRangeEn,
    timeRangeTa: dominantRule.timeRangeTa,
    confidence: 'rule_based',
    ruleId: dominantRule.id,
    astronomicalTransition: transitions,
    traditionalTransitionInterpretationEn: traditionalTransitionEn,
    traditionalTransitionInterpretationTa: traditionalTransitionTa,
    matchedTimingRules,
    isConflict: false,
    accuracyDistinction: {
      astronomicalFactEn: `Chandran is currently at ${context.moonDegreeInRasi !== undefined ? `${Math.floor(context.moonDegreeInRasi)}°` : '0°'} in ${moonRasiData.englishNameOnly}, transiting ${nakshatraRule.nameEn} (Pada ${moonPada}) in ${moonPhaseNameEn}.`,
      astronomicalFactTa: `சந்திரன் தற்போது ${moonRasiData.tamilNameOnly} ராசியில், ${nakshatraRule.nameTa} நட்சத்திரம் (பாதம் ${moonPada}) மற்றும் ${moonPhaseNameTa} நிலையில் சஞ்சரிக்கிறார்.`,
      traditionalRuleEn: `This Chandran position matches rule ${dominantRule.id} (${dominantRule.titleEn}).`,
      traditionalRuleTa: `இந்த சந்திரன் நிலை விதி ${dominantRule.id} (${dominantRule.titleTa}) உடன் பொருந்துகிறது.`,
      predictionEn: `Therefore the traditional Prasna method indicates recovery ${timeOfFindingEn} (${timeCategoryEn}).`,
      predictionTa: `எனவே பாரம்பரிய ஆருட முறைப்படி காணாமல் போன பொருள் ${timeOfFindingTa} (${timeCategoryTa}) கிடைக்க வாய்ப்புள்ளது.`
    },
    whyThisTime: {
      arudaLagnaEn: arudaRasiData.englishNameOnly,
      arudaLagnaTa: arudaRasiData.tamilNameOnly,
      sixthRasiEn: sixthRasiData.englishNameOnly,
      sixthRasiTa: sixthRasiData.tamilNameOnly,
      chandranRasiEn: moonRasiData.englishNameOnly,
      chandranRasiTa: moonRasiData.tamilNameOnly,
      chandranNakshatraEn: nakshatraRule.nameEn,
      chandranNakshatraTa: nakshatraRule.nameTa,
      chandranPada: moonPada,
      padaNoteEn: getPadaTimingNote(moonPada).en,
      padaNoteTa: getPadaTimingNote(moonPada).ta,
      moonFromAruda: moonHouseFromAruda,
      moonFromSixthRasi: moonHouseFromSixthRasi,
      matchingRuleId: dominantRule.id,
      traditionalTimeUnit: dominantRule.unit,
      traditionalTimeUnitTa: dominantRule.unit === 'hours' ? 'மணிநேரங்கள்' : dominantRule.unit === 'days' ? 'நாட்கள்' : 'வாரங்கள்',
      resultRangeEn: dominantRule.timeRangeEn,
      resultRangeTa: dominantRule.timeRangeTa
    },
    contextData: {
      moonRasiEn: moonRasiData.englishNameOnly,
      moonRasiTa: moonRasiData.tamilNameOnly,
      moonNakshatraEn: nakshatraRule.nameEn,
      moonNakshatraTa: nakshatraRule.nameTa,
      moonPada,
      moonHouseFromAruda,
      moonHouseFromSixthRasi,
      moonDegreeFormatted: context.moonDegreeInRasi !== undefined ? `${Math.floor(context.moonDegreeInRasi)}°` : '0°',
      moonPhaseNameEn,
      moonPhaseNameTa
    }
  };
};

function getOrdinalEn(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Export aliases for test compatibility
// ─────────────────────────────────────────────────────────────────────────────

export const CHANDRAN_ARUDA_RULES: Record<number, TraditionalHouseTimingRule & { houseFromAruda: number }> =
  Object.fromEntries(
    Object.entries(CHANDRAN_HOUSE_ARUDA_RULES).map(([k, v]) => [
      Number(k),
      { ...v, houseFromAruda: v.house }
    ])
  );

export const CHANDRAN_SIXTH_RULES: Record<number, TraditionalHouseTimingRule & { houseFromSixth: number }> =
  Object.fromEntries(
    Object.entries(CHANDRAN_HOUSE_SIXTH_RULES).map(([k, v]) => [
      Number(k),
      { ...v, houseFromSixth: v.house }
    ])
  );
