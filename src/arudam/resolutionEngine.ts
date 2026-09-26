// Phase 53 — Arudam Resolution Engine (resolvePrasnaOutcome)
// Evaluates applicable resolution rules against the current Prasna context.
// Strictly rule-based; returns "no_conclusion" when rules are insufficient.

import { PrasnaCategory, ArudamRule } from './arudamRules';
import { TransitPlanetInfo } from '../kochara/transitCalculator';
import { RasiRuleData } from '../astrology/rasi';
import { EnhancedPlanetInfo } from '../astrology/planets';
import {
  RESOLUTION_RULES,
  PRASNA_PURPOSES,
  ResolutionRule,
  ResolutionStatus,
  TimingStatus,
  ResolutionStrength,
  PrasnaPurpose
} from './resolutionRules';

export const VALID_RESOLUTION_STATUSES: ResolutionStatus[] = [
  'fulfilled', 'likely_fulfilled', 'delayed', 'uncertain', 'not_fulfilled'
];

// ─────────────────────────────────────────────────────────────────────────────
// Output types (§53.2, §53.7, §53.19)
// ─────────────────────────────────────────────────────────────────────────────

export interface PrasnaResolution {
  /** The identified Prasna purpose */
  purpose: PrasnaPurpose;

  /** Controlled set: fulfilled | likely_fulfilled | delayed | uncertain | not_fulfilled */
  resolutionStatus: ResolutionStatus;

  /** Strength of the ruling conclusion */
  resolutionStrength: ResolutionStrength;

  /** Timing indication based on rules (§53.10) */
  timingStatus: TimingStatus;
  timingLabelEn: string;
  timingLabelTa: string;

  /** The human-readable result block in both languages */
  resolutionStatusLabelEn: string;
  resolutionStatusLabelTa: string;

  /**
   * Full, paragraph-form explanation
   * Must never fabricate certainty, timing, or outcome (§53.20, §53.13)
   */
  explanationEn: string;
  explanationTa: string;

  /**
   * Positive rules that supported the resolution
   * Negative rules that worked against it
   */
  supportingRules: ResolutionRule[];
  counterRules: ResolutionRule[];

  /**
   * If neither enough positive nor negative rules matched,
   * this is true and the system says "no conclusion" (§53.18)
   */
  isNoConclusion: boolean;
  noConclusionReasonEn: string;
  noConclusionReasonTa: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Labels (controlled vocabulary)
// ─────────────────────────────────────────────────────────────────────────────

const RESOLUTION_STATUS_LABELS: Record<ResolutionStatus, { en: string; ta: string }> = {
  fulfilled:        { en: 'Fulfillment indicated',             ta: 'நிறைவேறும் சுட்டு உள்ளது' },
  likely_fulfilled: { en: 'Likely to be fulfilled',            ta: 'நிறைவேறும் சாத்தியம் உள்ளது' },
  delayed:          { en: 'Fulfillment after delay',           ta: 'தாமதத்திற்கு பின் நிறைவேறலாம்' },
  uncertain:        { en: 'Mixed / uncertain indication',      ta: 'கலந்த / உறுதியற்ற சுட்டு' },
  not_fulfilled:    { en: 'No clear fulfilment indication',    ta: 'நிறைவேறும் தெளிவான சுட்டு இல்லை' }
};

const TIMING_STATUS_LABELS: Record<TimingStatus, { en: string; ta: string }> = {
  immediate:          { en: 'Immediately',               ta: 'உடனடியாக' },
  soon:               { en: 'Within a short period',     ta: 'விரைவில்' },
  delayed:            { en: 'After a delay',              ta: 'தாமதத்திற்கு பிறகு' },
  longer_delay:       { en: 'After a longer delay',       ta: 'நீண்ட தாமதத்திற்கு பிறகு' },
  no_timing_indication: { en: 'No timing indication',    ta: 'கால சுட்டு இல்லை' }
};

// ─────────────────────────────────────────────────────────────────────────────
// Condition matcher — mirrors existing ArudamRule condition logic
// ─────────────────────────────────────────────────────────────────────────────

type SixthNature = 'Chara' | 'Sthira' | 'Ubhaya';

const CHARA_SIGNS = [1, 4, 7, 10];   // Aries, Cancer, Libra, Capricorn
const STHIRA_SIGNS = [2, 5, 8, 11];  // Taurus, Leo, Scorpio, Aquarius
// Ubhaya: all others — Gemini(3), Virgo(6), Sagittarius(9), Pisces(12)

function getSixthNature(sixthRasiId: number): SixthNature {
  if (CHARA_SIGNS.includes(sixthRasiId)) return 'Chara';
  if (STHIRA_SIGNS.includes(sixthRasiId)) return 'Sthira';
  return 'Ubhaya';
}

function matchesResolutionCondition(
  rule: ResolutionRule,
  sixthRasi: RasiRuleData,
  sixthLord: EnhancedPlanetInfo,
  transitPlanets: TransitPlanetInfo[]
): boolean {
  const cond = rule.condition;

  if (cond.sixthElement !== undefined) {
    const allowed = Array.isArray(cond.sixthElement) ? cond.sixthElement : [cond.sixthElement];
    if (!allowed.includes(sixthRasi.element)) return false;
  }

  if (cond.sixthRasiId !== undefined) {
    const allowed = Array.isArray(cond.sixthRasiId) ? cond.sixthRasiId : [cond.sixthRasiId];
    if (!allowed.includes(sixthRasi.id)) return false;
  }

  if (cond.sixthLordId !== undefined) {
    const allowed = Array.isArray(cond.sixthLordId) ? cond.sixthLordId : [cond.sixthLordId];
    if (!allowed.includes(sixthLord.id)) return false;
  }

  if (cond.transitInSixth !== undefined) {
    const allowed = Array.isArray(cond.transitInSixth) ? cond.transitInSixth : [cond.transitInSixth];
    const presentIds = transitPlanets.filter(p => p.rasiId === sixthRasi.id).map(p => p.id);
    if (!allowed.some(id => presentIds.includes(id))) return false;
  }

  if (cond.sixthNature !== undefined) {
    if (getSixthNature(sixthRasi.id) !== cond.sixthNature) return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolution priority weighting (§53.15)
// Strong direct rule > Specific category rule > Related planetary rule
// ─────────────────────────────────────────────────────────────────────────────

function pickDominantRule(rules: ResolutionRule[]): ResolutionRule | null {
  if (rules.length === 0) return null;
  return [...rules].sort((a, b) => b.priority - a.priority)[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Synthesize resolution status from matched rules (§53.14)
// ─────────────────────────────────────────────────────────────────────────────

function synthesizeResolutionStatus(
  positiveRules: ResolutionRule[],
  negativeRules: ResolutionRule[],
  neutralRules: ResolutionRule[]
): { status: ResolutionStatus; strength: ResolutionStrength; timing: TimingStatus } {

  const dominantPositive = pickDominantRule(positiveRules);
  const dominantNegative = pickDominantRule(negativeRules);
  const dominantNeutral  = pickDominantRule(neutralRules);

  // If both positive and negative rules apply → mixed/uncertain (§53.14)
  if (dominantPositive && dominantNegative) {
    return {
      status: 'uncertain',
      strength: 'moderate',
      timing: 'no_timing_indication'
    };
  }

  // Positive rules dominate
  if (dominantPositive) {
    return {
      status: dominantPositive.resolutionStatus,
      strength: dominantPositive.resolutionStrength,
      timing: dominantPositive.timingStatus
    };
  }

  // Negative rules dominate (explicit not_fulfilled)
  if (dominantNegative) {
    return {
      status: dominantNegative.resolutionStatus,
      strength: dominantNegative.resolutionStrength,
      timing: dominantNegative.timingStatus
    };
  }

  // Neutral rules (delayed, uncertain etc.)
  if (dominantNeutral) {
    return {
      status: dominantNeutral.resolutionStatus,
      strength: dominantNeutral.resolutionStrength,
      timing: dominantNeutral.timingStatus
    };
  }

  // Nothing matched → no conclusion
  return { status: 'uncertain', strength: 'weak', timing: 'no_timing_indication' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build explanation text (§53.4 – §53.13)
// Strictly follows rule strength; never adds certainty beyond the rule.
// ─────────────────────────────────────────────────────────────────────────────

function buildExplanation(
  purpose: PrasnaPurpose,
  status: ResolutionStatus,
  timing: TimingStatus,
  dominant: ResolutionRule | null,
  isTamil: boolean
): string {
  const statusLabel = isTamil
    ? RESOLUTION_STATUS_LABELS[status].ta
    : RESOLUTION_STATUS_LABELS[status].en;
  const timingLabel = isTamil
    ? TIMING_STATUS_LABELS[timing].ta
    : TIMING_STATUS_LABELS[timing].en;

  if (!dominant) {
    return isTamil
      ? 'இந்த ஆருடத்தில் தீர்வு குறித்து போதுமான விதிச் சுட்டுகள் இல்லை.'
      : 'The configured rules do not provide enough indication to determine the resolution of this Prasna.';
  }

  const ruleExpl = isTamil ? dominant.explanationTa : dominant.explanationEn;
  const purposeQ = isTamil ? purpose.questionTamil : purpose.questionEnglish;
  const timingClause = timing !== 'no_timing_indication'
    ? (isTamil ? `கால சுட்டு: ${timingLabel}.` : `Timing indication: ${timingLabel}.`)
    : (isTamil ? 'கால சுட்டு தற்போது கணிக்கப்படவில்லை.' : 'No specific timing indication is available from the configured rules.');

  return isTamil
    ? `கேள்வி: ${purposeQ}\n\nநிலை: ${statusLabel}\n\n${ruleExpl}\n\n${timingClause}`
    : `Question: ${purposeQ}\n\nStatus: ${statusLabel}\n\n${ruleExpl}\n\n${timingClause}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main API — resolvePrasnaOutcome (§53.6)
// ─────────────────────────────────────────────────────────────────────────────

export const resolvePrasnaOutcome = (params: {
  questionCategory: PrasnaCategory;
  arudaLagna: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  transitPlanets: TransitPlanetInfo[];
  applicableRules: ArudamRule[]; // already-matched prediction rules (for reference)
}): PrasnaResolution => {
  const { questionCategory, sixthRasi, sixthLord, transitPlanets } = params;

  const purpose: PrasnaPurpose = PRASNA_PURPOSES[questionCategory];

  // Filter resolution rules for the identified category
  const categoryRules = RESOLUTION_RULES.filter(r => r.category === questionCategory);

  // Match conditions against current Prasna context
  const matched = categoryRules.filter(r =>
    matchesResolutionCondition(r, sixthRasi, sixthLord, transitPlanets)
  );

  const positiveRules = matched.filter(r => r.group === 'positive');
  const negativeRules = matched.filter(r => r.group === 'negative');
  const neutralRules  = matched.filter(r => r.group === 'neutral');

  // No rules matched at all → no-conclusion state (§53.18)
  if (matched.length === 0) {
    return {
      purpose,
      resolutionStatus: 'uncertain',
      resolutionStrength: 'weak',
      timingStatus: 'no_timing_indication',
      timingLabelEn: TIMING_STATUS_LABELS.no_timing_indication.en,
      timingLabelTa: TIMING_STATUS_LABELS.no_timing_indication.ta,
      resolutionStatusLabelEn: 'No configured resolution rule',
      resolutionStatusLabelTa: 'தீர்வு குறித்த விதி கிடைக்கவில்லை',
      explanationEn: 'The configured rules do not provide enough indication to determine the resolution of this Prasna.',
      explanationTa: 'இந்த ஆருடத்தில் தீர்வு குறித்து போதுமான விதிச் சுட்டுகள் இல்லை.',
      supportingRules: [],
      counterRules: [],
      isNoConclusion: true,
      noConclusionReasonEn: `No resolution rule in the rulebook matched the current 6th sign (${sixthRasi.englishNameOnly}) and lord (${sixthLord.englishOnly}) for category "${questionCategory}".`,
      noConclusionReasonTa: `"${questionCategory}" வகைக்கான தீர்வு விதி 6-ஆம் ராசி (${sixthRasi.tamilNameOnly}) மற்றும் அதிபதி (${sixthLord.tamilOnly}) தொடர்பாக கிடைக்கவில்லை.`
    };
  }

  // Synthesize the conclusion
  const { status, strength, timing } = synthesizeResolutionStatus(positiveRules, negativeRules, neutralRules);

  // Pick dominant rule for explanation
  const dominantAll = matched.sort((a, b) => b.priority - a.priority)[0];

  return {
    purpose,
    resolutionStatus: status,
    resolutionStrength: strength,
    timingStatus: timing,
    timingLabelEn: TIMING_STATUS_LABELS[timing].en,
    timingLabelTa: TIMING_STATUS_LABELS[timing].ta,
    resolutionStatusLabelEn: RESOLUTION_STATUS_LABELS[status].en,
    resolutionStatusLabelTa: RESOLUTION_STATUS_LABELS[status].ta,
    explanationEn: buildExplanation(purpose, status, timing, dominantAll, false),
    explanationTa: buildExplanation(purpose, status, timing, dominantAll, true),
    supportingRules: positiveRules,
    counterRules: negativeRules,
    isNoConclusion: false,
    noConclusionReasonEn: '',
    noConclusionReasonTa: ''
  };
};
