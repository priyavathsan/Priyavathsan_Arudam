// Phase 53 — Arudam Resolution / Fulfilment Rule Engine
// Based exclusively on traditional Arudam rulebook already present in the project.
// Do NOT add conditions not grounded in the existing rulebook.

import { PrasnaCategory } from './arudamRules';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ResolutionStatus =
  | 'fulfilled'
  | 'likely_fulfilled'
  | 'delayed'
  | 'uncertain'
  | 'not_fulfilled';

export type TimingStatus =
  | 'immediate'
  | 'soon'
  | 'delayed'
  | 'longer_delay'
  | 'no_timing_indication';

export type ResolutionStrength = 'strong' | 'moderate' | 'weak';

export type ResolutionRuleGroup = 'positive' | 'negative' | 'neutral';

export interface ResolutionRuleCondition {
  // 6th rasi element — matches existing ArudamRule logic
  sixthElement?: string | string[];
  // 6th rasi sign id
  sixthRasiId?: number | number[];
  // 6th lord planet id
  sixthLordId?: string | string[];
  // Whether any transit planet is in the 6th rasi
  transitInSixth?: string | string[];
  // Rasi nature (Chara, Sthira, Ubhaya)
  sixthNature?: 'Chara' | 'Sthira' | 'Ubhaya';
}

export interface ResolutionRule {
  id: string;
  category: PrasnaCategory;
  purposeId: string;
  group: ResolutionRuleGroup;
  condition: ResolutionRuleCondition;
  resolutionStatus: ResolutionStatus;
  resolutionStrength: ResolutionStrength;
  timingStatus: TimingStatus;
  priority: number; // higher = evaluated first
  titleTa: string;
  titleEn: string;
  explanationTa: string;
  explanationEn: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Purpose definitions
// ─────────────────────────────────────────────────────────────────────────────

export interface PrasnaPurpose {
  id: string;
  category: PrasnaCategory;
  purposeTamil: string;
  purposeEnglish: string;
  questionTamil: string;
  questionEnglish: string;
}

export const PRASNA_PURPOSES: Record<PrasnaCategory, PrasnaPurpose> = {
  lost_object: {
    id: 'recover_lost_object',
    category: 'lost_object',
    purposeTamil: 'காணாமல் போன பொருளை மீட்பது',
    purposeEnglish: 'Recovery of the lost object',
    questionTamil: 'காணாமல் போன பொருள் கிடைக்குமா?',
    questionEnglish: 'Will the lost object be found?'
  },
  missing_person: {
    id: 'locate_missing_person',
    category: 'missing_person',
    purposeTamil: 'காணாமல் போன நபரை கண்டறிவது',
    purposeEnglish: 'Locating / contacting the missing person',
    questionTamil: 'காணாமல் போன நபர் தொடர்பாக தீர்வு கிடைக்குமா?',
    questionEnglish: 'Will the missing-person matter be resolved?'
  },
  marriage: {
    id: 'marriage_resolution',
    category: 'marriage',
    purposeTamil: 'திருமண / உறவு காரியத்தில் தீர்வு',
    purposeEnglish: 'Resolution of the marriage / relationship matter',
    questionTamil: 'திருமண காரியம் நிறைவேறுமா?',
    questionEnglish: 'Will the marriage / relationship matter be fulfilled?'
  },
  finance: {
    id: 'financial_resolution',
    category: 'finance',
    purposeTamil: 'பொருளாதார கேள்வியில் தீர்வு',
    purposeEnglish: 'Resolution of the financial matter',
    questionTamil: 'பண விவகாரம் சாதகமாக முடியுமா?',
    questionEnglish: 'Will the financial matter be resolved favorably?'
  },
  job: {
    id: 'job_resolution',
    category: 'job',
    purposeTamil: 'வேலை / தொழில் காரியத்தில் தீர்வு',
    purposeEnglish: 'Fulfillment of the job / career purpose',
    questionTamil: 'வேலை காரியம் நிறைவேறுமா?',
    questionEnglish: 'Will the job / career purpose be fulfilled?'
  },
  travel: {
    id: 'travel_resolution',
    category: 'travel',
    purposeTamil: 'பயண காரியத்தில் வெற்றி',
    purposeEnglish: 'Successful outcome of travel',
    questionTamil: 'பயண காரியம் வெற்றிகரமாக முடியுமா?',
    questionEnglish: 'Will the travel purpose be successfully fulfilled?'
  },
  health: {
    id: 'health_resolution',
    category: 'health',
    purposeTamil: 'உடல்நல மீட்சி',
    purposeEnglish: 'Recovery from the health concern',
    questionTamil: 'உடல்நல பிரச்சினை தீருமா?',
    questionEnglish: 'Will the health matter be resolved?'
  },
  legal: {
    id: 'legal_resolution',
    category: 'legal',
    purposeTamil: 'வழக்கு / தகராறில் சாதகமான முடிவு',
    purposeEnglish: 'Favorable resolution of the legal matter',
    questionTamil: 'வழக்கு / தகராறு சாதகமாக முடியுமா?',
    questionEnglish: 'Will the legal / dispute matter be resolved favorably?'
  },
  sakunam: {
    id: 'sakunam_resolution',
    category: 'sakunam',
    purposeTamil: 'சகுன / நிமித்த சுட்டுக்கு தீர்வு',
    purposeEnglish: 'Interpretation and resolution of the omen',
    questionTamil: 'சகுனம் / நிமித்தம் சுபமாக முடியுமா?',
    questionEnglish: 'Will the omen / sign indicate a favorable outcome?'
  },
  general: {
    id: 'general_prasna_resolution',
    category: 'general',
    purposeTamil: 'மனதில் உள்ள காரியத்தில் தீர்வு',
    purposeEnglish: 'Fulfillment of the purpose behind this Prasna',
    questionTamil: 'இந்த ஆருடத்தின் நோக்கம் நிறைவேறுமா?',
    questionEnglish: 'Will the purpose of this Arudam be fulfilled?'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Resolution Rule Database
// Grounded exclusively in existing CENTRAL_ARUDAM_RULES conditions.
// ─────────────────────────────────────────────────────────────────────────────

export const RESOLUTION_RULES: ResolutionRule[] = [

  // ═══════════════════════════════════════════════════════════════════
  // LOST OBJECT — Recovery rules
  // Source: AR-OBJ-EARTH, AR-OBJ-WATER, AR-OBJ-AIR, AR-OBJ-FIRE
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-LOST-OBJECT-001',
    category: 'lost_object',
    purposeId: 'recover_lost_object',
    group: 'positive',
    condition: { sixthElement: 'Earth' }, // AR-OBJ-EARTH: Taurus, Virgo, Capricorn
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 95,
    titleTa: 'நில ராசி — பொருள் கிடைக்கும் சுட்டு',
    titleEn: 'Earth Sign 6th — Recovery Indicated',
    explanationTa: '6-ஆம் ராசி நில தத்துவ ராசியாக (ரிஷபம்/கன்னி/மகரம்) அமைவதால் பொருள் நகராமல் பாதுகாப்பாக உள்ளது; மீட்கப்பட சாத்தியமுண்டு.',
    explanationEn: 'The Earth element 6th sign (Taurus/Virgo/Capricorn) indicates the object has not moved and is safely placed; recovery is strongly indicated.'
  },
  {
    id: 'RES-LOST-OBJECT-002',
    category: 'lost_object',
    purposeId: 'recover_lost_object',
    group: 'positive',
    condition: { sixthElement: 'Fire' }, // AR-OBJ-FIRE: Aries, Leo, Sagittarius
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 92,
    titleTa: 'நெருப்பு ராசி — விரைவில் பொருள் கண்டுபிடிக்கப்படும்',
    titleEn: 'Fire Sign 6th — Object Likely Found Soon',
    explanationTa: '6-ஆம் ராசி நெருப்பு ராசியாக (மேஷம்/சிம்மம்/தனுசு) அமைவதால் பொருள் வெளிப்படையான வெளிச்சமான இடத்தில் உள்ளது; விரைவில் கண்டறியப்படும்.',
    explanationEn: 'Fire element indicates the object is in a prominent, lit area. Discovery is expected relatively quickly once a direct search is made.'
  },
  {
    id: 'RES-LOST-OBJECT-003',
    category: 'lost_object',
    purposeId: 'recover_lost_object',
    group: 'positive',
    condition: { sixthElement: 'Air' }, // AR-OBJ-AIR: Gemini, Libra, Aquarius
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'moderate',
    timingStatus: 'soon',
    priority: 85,
    titleTa: 'காற்று ராசி — தேடல் பிறகு கிடைக்கலாம்',
    titleEn: 'Air Sign 6th — Recovery After Careful Search',
    explanationTa: '6-ஆம் ராசி காற்று ராசியாக (மிதுனம்/துலாம்/கும்பம்) அமைவதால் பொருள் நகர்க்கப்பட்டிருக்கலாம்; கவனமாக தேடிய பின் கிடைக்கும்.',
    explanationEn: 'Air element suggests the object may have been displaced; careful and systematic search is advised for recovery.'
  },
  {
    id: 'RES-LOST-OBJECT-004',
    category: 'lost_object',
    purposeId: 'recover_lost_object',
    group: 'neutral',
    condition: { sixthElement: 'Water' }, // AR-OBJ-WATER: Cancer, Scorpio, Pisces
    resolutionStatus: 'uncertain',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 90,
    titleTa: 'நீர் ராசி — கலந்த சுட்டு; கடினமான தேடல் தேவை',
    titleEn: 'Water Sign 6th — Mixed Indication; Thorough Search Required',
    explanationTa: '6-ஆம் ராசி நீர் ராசியாக (கடகம்/விருச்சிகம்/மீனம்) அமைவதால் பொருள் மறைவான அல்லது ஈரமான இடத்தில் சிக்கியிருக்கலாம்; மீட்பு தாமதமாகலாம்.',
    explanationEn: 'Water element indicates the object may be in a concealed or damp location; recovery is possible but may require a thorough search over time.'
  },

  // Saturn as 6th lord — delay modifier (applies across categories)
  {
    id: 'RES-LOST-OBJECT-005',
    category: 'lost_object',
    purposeId: 'recover_lost_object',
    group: 'neutral',
    condition: { sixthLordId: 'saturn' }, // From AR-OBJ-EARTH + AR-JOB-SATURN
    resolutionStatus: 'delayed',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 91,
    titleTa: 'சனி ஆட்சி — தாமதத்திற்கு பிறகு மீட்பு',
    titleEn: 'Saturn Lord — Recovery After Delay',
    explanationTa: 'சனி 6-ஆம் அதிபதியாக இருப்பதால் மீட்பு சாத்தியமாக இருந்தாலும் கணிசமான காலதாமதம் ஏற்படலாம்.',
    explanationEn: 'Saturn as 6th lord indicates recovery is possible but requires patient, persistent effort over an extended period.'
  },
  {
    id: 'RES-LOST-OBJECT-006',
    category: 'lost_object',
    purposeId: 'recover_lost_object',
    group: 'positive',
    condition: { sixthLordId: ['jupiter', 'venus', 'sun'] }, // AR-SAK-BENEFIC logic
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 93,
    titleTa: 'சுபகிரக ஆட்சி — பொருள் கிடைக்கும் வலுவான சுட்டு',
    titleEn: 'Benefic Lord — Strong Recovery Indication',
    explanationTa: 'சுபகிரகமான குரு/சுக்கிரன்/சூரியன் 6-ஆம் அதிபதியாக இருப்பதால் பொருள் மீட்கப்படுவதற்கான வலுவான சுட்டு உள்ளது.',
    explanationEn: 'A benefic planet (Jupiter/Venus/Sun) ruling the 6th provides strong indication that the lost object will be recovered.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // MISSING PERSON — Resolution rules
  // Source: AR-PRS-CHARA, AR-PRS-STHIRA, AR-PRS-UBHAYA
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-PERSON-001',
    category: 'missing_person',
    purposeId: 'locate_missing_person',
    group: 'positive',
    condition: { sixthNature: 'Sthira' }, // AR-PRS-STHIRA: Taurus, Leo, Scorpio, Aquarius
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 90,
    titleTa: 'ஸ்திர ராசி — நபர் ஒரே இடத்தில் உள்ளார்; விரைவில் தொடர்பு கிடைக்கும்',
    titleEn: 'Fixed Sign 6th — Person Stationary; Contact Expected Soon',
    explanationTa: '6-ஆம் ராசி ஸ்திர ராசியாக அமைவதால் நபர் மேலும் நகரவில்லை; விரைவில் செய்தி அல்லது தொடர்பு கிடைக்கும்.',
    explanationEn: 'Fixed signs indicate the missing person has stopped moving and is in a stable place; contact or return is expected within a short period.'
  },
  {
    id: 'RES-PERSON-002',
    category: 'missing_person',
    purposeId: 'locate_missing_person',
    group: 'positive',
    condition: { sixthNature: 'Ubhaya' }, // AR-PRS-UBHAYA: Gemini, Virgo, Sagittarius, Pisces
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'moderate',
    timingStatus: 'soon',
    priority: 82,
    titleTa: 'உபய ராசி — நபர் திரும்பி வர ஆலோசிக்கிறார்',
    titleEn: 'Dual Sign 6th — Person Considering Return',
    explanationTa: 'உபய ராசி இரட்டைத் தன்மையால் நபர் திரும்பி வருவதற்கு மனம் சாய்கிறார்; மூன்றாம் நபர் மூலம் தொடர்பு ஏற்படலாம்.',
    explanationEn: 'Dual signs indicate ambivalence leaning toward return; a third-party mediator or voluntary contact is expected.'
  },
  {
    id: 'RES-PERSON-003',
    category: 'missing_person',
    purposeId: 'locate_missing_person',
    group: 'neutral',
    condition: { sixthNature: 'Chara' }, // AR-PRS-CHARA: Aries, Cancer, Libra, Capricorn
    resolutionStatus: 'delayed',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 88,
    titleTa: 'சர ராசி — நபர் பயணத்தில் உள்ளார்; தொடர்பு தாமதமாகலாம்',
    titleEn: 'Movable Sign 6th — Person in Transit; Delayed Contact',
    explanationTa: 'சர ராசி நபர் தொடர்ந்து இடம் மாறுவதை சுட்டுவதால் நேரடி தொடர்பு சிறிது காலம் தாமதமாகலாம்.',
    explanationEn: 'Movable signs indicate the person is still in transit; contact or location confirmation may be delayed.'
  },
  {
    id: 'RES-PERSON-004',
    category: 'missing_person',
    purposeId: 'locate_missing_person',
    group: 'positive',
    condition: { sixthLordId: ['mercury', 'moon', 'jupiter'] }, // AR-PRS-STHIRA communication
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 89,
    titleTa: 'தகவல் காரக கிரக ஆட்சி — விரைவில் செய்தி கிடைக்கும்',
    titleEn: 'Communication Planet as 6th Lord — News Expected Soon',
    explanationTa: 'தகவல் காரகங்களான சந்திரன்/புதன்/குரு 6-ஆம் அதிபதியாக இருப்பதால் விரைவில் நேரடி செய்தி அல்லது தொடர்பு ஏற்படும்.',
    explanationEn: 'Mercury, Moon, or Jupiter as 6th lord strongly indicates swift communication or news from or about the missing person.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // JOB / CAREER — Fulfilment rules
  // Source: AR-JOB-SATURN, AR-JOB-SUN-JUP
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-JOB-001',
    category: 'job',
    purposeId: 'job_resolution',
    group: 'positive',
    condition: { sixthLordId: ['sun', 'jupiter'] }, // AR-JOB-SUN-JUP
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 93,
    titleTa: 'சூரியன் / குரு ஆட்சி — வேலை காரியம் நிறைவேறும்',
    titleEn: 'Sun / Jupiter Lord — Job Purpose Will Be Fulfilled',
    explanationTa: 'சூரியன் அல்லது குரு 6-ஆம் அதிபதியாக இருப்பதால் அரசு அல்லது உயர் பதவியில் காரிய வெற்றி நிச்சயம்.',
    explanationEn: 'Sun or Jupiter ruling the 6th provides a strong indication of professional success, official appointment, or institutional recognition.'
  },
  {
    id: 'RES-JOB-002',
    category: 'job',
    purposeId: 'job_resolution',
    group: 'neutral',
    condition: { sixthLordId: 'saturn' }, // AR-JOB-SATURN
    resolutionStatus: 'delayed',
    resolutionStrength: 'strong',
    timingStatus: 'delayed',
    priority: 91,
    titleTa: 'சனி ஆட்சி — கடின உழைப்பிற்கு பிறகு வெற்றி',
    titleEn: 'Saturn Lord — Fulfillment After Hard Work and Patience',
    explanationTa: 'சனி ஆட்சியில் வேலை காரியம் நிறைவேறும்; ஆனால் தாமதம் மற்றும் கடின உழைப்பு தேவை.',
    explanationEn: 'Saturn as 6th lord indicates the job purpose will eventually be fulfilled but only through sustained effort and patience — delayed, not denied.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // FINANCE — Fulfilment rules
  // Source: AR-FIN-VENUS-MERC
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-FIN-001',
    category: 'finance',
    purposeId: 'financial_resolution',
    group: 'positive',
    condition: { sixthLordId: ['venus', 'mercury'] }, // AR-FIN-VENUS-MERC
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 90,
    titleTa: 'சுக்கிரன் / புதன் ஆட்சி — பண விவகாரம் சாதகமாக முடியும்',
    titleEn: 'Venus / Mercury Lord — Financial Matter Will Be Resolved',
    explanationTa: 'வணிக காரக சுக்கிரன் அல்லது புதன் 6-ஆம் அதிபதியாக இருப்பதால் பண பரிவர்த்தனை, கடன் வசூல் அல்லது நிதி தீர்வு சாதகமாக அமையும்.',
    explanationEn: 'Venus or Mercury as 6th lord strongly indicates financial liquidity, debt settlement, or commercial resolution in the querent\'s favor.'
  },
  {
    id: 'RES-FIN-002',
    category: 'finance',
    purposeId: 'financial_resolution',
    group: 'neutral',
    condition: { sixthLordId: 'saturn' },
    resolutionStatus: 'delayed',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 85,
    titleTa: 'சனி ஆட்சி — நிதி விவகாரம் தாமதமாக தீரும்',
    titleEn: 'Saturn Lord — Financial Resolution After Delay',
    explanationTa: 'சனியின் தாக்கம் பண விவகாரத்தில் தாமதம் ஏற்படுத்துகிறது; பொறுமையுடன் காத்திருந்தால் தீர்வு கிட்டும்.',
    explanationEn: 'Saturn\'s influence creates a delay in financial resolution, but eventual settlement is indicated after a period of patient waiting.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // MARRIAGE / RELATIONSHIP — Fulfilment rules
  // Source: AR-MAR-VENUS
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-MAR-001',
    category: 'marriage',
    purposeId: 'marriage_resolution',
    group: 'positive',
    condition: { sixthLordId: ['venus', 'jupiter'] }, // AR-MAR-VENUS
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'moderate',
    timingStatus: 'soon',
    priority: 87,
    titleTa: 'சுக்கிரன் / குரு ஆட்சி — திருமண காரியம் சாதகம்',
    titleEn: 'Venus / Jupiter Lord — Marriage Matter Favorably Indicated',
    explanationTa: 'திருமண காரகங்களான சுக்கிரன் அல்லது குரு 6-ஆம் அதிபதியாக இருப்பதால் பேச்சுவார்த்தை நல்லபடியாக முடியும்.',
    explanationEn: 'Venus or Jupiter ruling the 6th indicates auspicious marriage negotiations, with elder mediation leading to a harmonious outcome.'
  },
  {
    id: 'RES-MAR-002',
    category: 'marriage',
    purposeId: 'marriage_resolution',
    group: 'neutral',
    condition: { sixthLordId: ['saturn', 'mars', 'rahu'] },
    resolutionStatus: 'uncertain',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 80,
    titleTa: 'பாப கிரக ஆட்சி — திருமண காரியத்தில் தடைகள்',
    titleEn: 'Malefic Lord — Obstacles in Marriage Matter',
    explanationTa: 'பாப கிரகங்கள் 6-ஆம் அதிபதியாக இருப்பதால் திருமண காரியத்தில் தாமதமும் தடைகளும் ஏற்படலாம்; கவனமான அணுகுமுறை தேவை.',
    explanationEn: 'Malefic lordship over the 6th introduces obstacles or delays in marriage matters; careful, patient negotiation is required.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // HEALTH — Recovery rules
  // Source: AR-HLT-MARS-SAT
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-HLT-001',
    category: 'health',
    purposeId: 'health_resolution',
    group: 'positive',
    condition: { sixthLordId: ['jupiter', 'venus', 'moon'] }, // Benefic lords → recovery
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 88,
    titleTa: 'சுபகிரக ஆட்சி — உடல்நலம் மேம்படும் சுட்டு',
    titleEn: 'Benefic Lord — Recovery Indicated',
    explanationTa: 'சுபகிரகம் 6-ஆம் அதிபதியாக இருப்பதால் ரோக நிவாரணம் மற்றும் உடல் மீட்சிக்கான நல்ல சுட்டு உள்ளது.',
    explanationEn: 'A benefic planet ruling the 6th (Rogasthana) indicates gradual but definite health recovery with proper treatment.'
  },
  {
    id: 'RES-HLT-002',
    category: 'health',
    purposeId: 'health_resolution',
    group: 'neutral',
    condition: { sixthLordId: ['mars', 'saturn'] }, // AR-HLT-MARS-SAT
    resolutionStatus: 'delayed',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 85,
    titleTa: 'செவ்வாய் / சனி ஆட்சி — முறையான பராமரிப்பு பின் குணமடைதல்',
    titleEn: 'Mars / Saturn Lord — Recovery Requires Patience and Medical Attention',
    explanationTa: 'செவ்வாய் அல்லது சனி ஆட்சியில் குணமடைதல் தாமதமாகலாம்; முறையான மருத்துவ ஆலோசனை அவசியம்.',
    explanationEn: 'Mars or Saturn as 6th lord indicates health improvement is possible but requires sustained medical care and lifestyle discipline.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL / DISPUTE — Resolution rules
  // Source: AR-LEG-MARS-JUP
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-LEG-001',
    category: 'legal',
    purposeId: 'legal_resolution',
    group: 'positive',
    condition: { sixthLordId: ['mars', 'jupiter'] }, // AR-LEG-MARS-JUP
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 89,
    titleTa: 'செவ்வாய் / குரு ஆட்சி — நியாயமான தீர்ப்பு கிடைக்கும்',
    titleEn: 'Mars / Jupiter Lord — Favorable Legal Resolution',
    explanationTa: 'நீதி காரகரான குரு மற்றும் வழக்கு காரகரான செவ்வாய் 6-ஆம் அதிபதியாக இருப்பதால் சாதகமான தீர்ப்பு அல்லது சமரசம் ஏற்படும்.',
    explanationEn: 'Jupiter and Mars as 6th lord creates strong indication of equitable legal judgment, compromise, or arbitration in the querent\'s favor.'
  },
  {
    id: 'RES-LEG-002',
    category: 'legal',
    purposeId: 'legal_resolution',
    group: 'neutral',
    condition: { sixthLordId: ['saturn', 'rahu', 'ketu'] },
    resolutionStatus: 'delayed',
    resolutionStrength: 'moderate',
    timingStatus: 'longer_delay',
    priority: 82,
    titleTa: 'சனி / ராகு / கேது ஆட்சி — வழக்கு நீடிக்கும்',
    titleEn: 'Saturn / Rahu / Ketu Lord — Prolonged Legal Matter',
    explanationTa: 'சனி, ராகு அல்லது கேது ஆட்சியில் வழக்கு நீண்டு இழுக்கலாம்; தீர்வு கிட்டும் ஆனால் காலதாமதம் ஏற்படும்.',
    explanationEn: 'Saturn, Rahu, or Ketu as 6th lord indicates a prolonged legal battle with resolution eventually achieved after significant delay.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRAVEL — Success rules
  // Source: AR-TRV-MOON-MERC
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-TRV-001',
    category: 'travel',
    purposeId: 'travel_resolution',
    group: 'positive',
    condition: { sixthLordId: ['moon', 'mercury'] }, // AR-TRV-MOON-MERC
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 88,
    titleTa: 'சந்திரன் / புதன் ஆட்சி — பயணம் வெற்றிகரமாக முடியும்',
    titleEn: 'Moon / Mercury Lord — Travel Will Be Successful',
    explanationTa: 'சஞ்சார காரகங்களான சந்திரன் மற்றும் புதன் 6-ஆம் அதிபதியாக இருப்பதால் திட்டமிட்ட பயணம் சுகமாகவும் வெற்றிகரமாகவும் அமையும்.',
    explanationEn: 'Moon or Mercury ruling the 6th strongly indicates a smooth and successful journey with favorable outcomes.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // SAKUNAM / OMEN — Interpretation rules
  // Source: AR-SAK-BENEFIC, AR-SAK-MALEFIC
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-SAK-001',
    category: 'sakunam',
    purposeId: 'sakunam_resolution',
    group: 'positive',
    condition: { sixthLordId: ['jupiter', 'venus', 'mercury'] }, // AR-SAK-BENEFIC
    resolutionStatus: 'fulfilled',
    resolutionStrength: 'strong',
    timingStatus: 'soon',
    priority: 86,
    titleTa: 'சுபகிரக ஆட்சி — சுப சகுனம்; காரியம் நிறைவேறும்',
    titleEn: 'Benefic Lord — Auspicious Omen; Purpose Will Be Fulfilled',
    explanationTa: 'சுபகிரகம் 6-ஆம் அதிபதியாக இருப்பதால் சகுனம் நல்லதொரு முடிவையே சுட்டுகிறது.',
    explanationEn: 'Benefic 6th lord transforms the omen into a protective favorable sign; the intended purpose will be fulfilled.'
  },
  {
    id: 'RES-SAK-002',
    category: 'sakunam',
    purposeId: 'sakunam_resolution',
    group: 'negative',
    condition: { sixthLordId: ['saturn', 'mars', 'rahu', 'ketu'] }, // AR-SAK-MALEFIC
    resolutionStatus: 'uncertain',
    resolutionStrength: 'moderate',
    timingStatus: 'no_timing_indication',
    priority: 84,
    titleTa: 'பாப கிரக ஆட்சி — சகுனம் எச்சரிக்கை சுட்டு',
    titleEn: 'Malefic Lord — Omen as Warning; Caution Required',
    explanationTa: 'பாப கிரகம் 6-ஆம் அதிபதியாக இருப்பதால் சகுனம் எச்சரிக்கையை வலியுறுத்துகிறது; அவசர முடிவுகளை தவிர்க்கவும்.',
    explanationEn: 'Malefic 6th lord turns the omen into a cautionary warning; the outcome is uncertain and patience with prayer is advised.'
  },

  // ═══════════════════════════════════════════════════════════════════
  // GENERAL PRASNA — Fallback resolution rules
  // Source: AR-GEN-UNIVERSAL
  // ═══════════════════════════════════════════════════════════════════

  {
    id: 'RES-GEN-001',
    category: 'general',
    purposeId: 'general_prasna_resolution',
    group: 'positive',
    condition: { sixthLordId: ['jupiter', 'venus', 'mercury', 'sun', 'moon'] },
    resolutionStatus: 'likely_fulfilled',
    resolutionStrength: 'moderate',
    timingStatus: 'soon',
    priority: 75,
    titleTa: 'சுபகிரக ஆட்சி — காரியம் நிறைவேறும் சாத்தியம்',
    titleEn: 'Benefic Lord — General Purpose Likely to Be Fulfilled',
    explanationTa: 'சுபகிரக ஆட்சியில் பொதுவான காரியம் நிறைவேறும் நல்ல சுட்டு உள்ளது.',
    explanationEn: 'Benefic rulership over the 6th indicates a generally positive outlook for the purpose behind this Prasna.'
  },
  {
    id: 'RES-GEN-002',
    category: 'general',
    purposeId: 'general_prasna_resolution',
    group: 'neutral',
    condition: { sixthLordId: ['saturn', 'mars'] },
    resolutionStatus: 'delayed',
    resolutionStrength: 'moderate',
    timingStatus: 'delayed',
    priority: 70,
    titleTa: 'பாப கிரக ஆட்சி — காரியம் தாமதமாக நிறைவேறலாம்',
    titleEn: 'Malefic Lord — Purpose May Be Fulfilled After Delay',
    explanationTa: 'பாப கிரக ஆட்சியில் காரியம் நிறைவேறும்; ஆனால் தாமதம் மற்றும் கடின உழைப்பு தேவை.',
    explanationEn: 'Malefic lordship does not deny fulfillment but introduces delays and obstacles requiring persistent effort.'
  }
];
