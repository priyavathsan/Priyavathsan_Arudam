import { describe, it, expect } from 'vitest';
import { calculateArudaLagnam } from './arudamCalculator';
import { calculateSixthRasi } from './sixthRasiCalculator';
import { calculateTransitPositions } from '../kochara/transitCalculator';
import { classifyClientQuestion } from './questionClassifier';
import { generateArudamPrediction } from './predictionEngine';
import { resolvePrasnaOutcome, VALID_RESOLUTION_STATUSES } from './resolutionEngine';

describe('PHASE 38 — Comprehensive Arudam & 6th Rasi Tests (All 12 Cases)', () => {
  const testCases = [
    { input: 1, expectedArudaEn: 'Mesham / Aries', expectedArudaTa: 'மேஷம்', expectedSixthEn: 'Kanni / Virgo', expectedSixthTa: 'கன்னி' },
    { input: 2, expectedArudaEn: 'Rishabam / Taurus', expectedArudaTa: 'ரிஷபம்', expectedSixthEn: 'Thulam / Libra', expectedSixthTa: 'துலாம்' },
    { input: 3, expectedArudaEn: 'Mithunam / Gemini', expectedArudaTa: 'மிதுனம்', expectedSixthEn: 'Viruchigam / Scorpio', expectedSixthTa: 'விருச்சிகம்' },
    { input: 4, expectedArudaEn: 'Kadagam / Cancer', expectedArudaTa: 'கடகம்', expectedSixthEn: 'Dhanusu / Sagittarius', expectedSixthTa: 'தனுசு' },
    { input: 5, expectedArudaEn: 'Simmam / Leo', expectedArudaTa: 'சிம்மம்', expectedSixthEn: 'Makaram / Capricorn', expectedSixthTa: 'மகரம்' },
    { input: 6, expectedArudaEn: 'Kanni / Virgo', expectedArudaTa: 'கன்னி', expectedSixthEn: 'Kumbam / Aquarius', expectedSixthTa: 'கும்பம்' },
    { input: 7, expectedArudaEn: 'Thulam / Libra', expectedArudaTa: 'துலாம்', expectedSixthEn: 'Meenam / Pisces', expectedSixthTa: 'மீனம்' },
    { input: 8, expectedArudaEn: 'Viruchigam / Scorpio', expectedArudaTa: 'விருச்சிகம்', expectedSixthEn: 'Mesham / Aries', expectedSixthTa: 'மேஷம்' },
    { input: 9, expectedArudaEn: 'Dhanusu / Sagittarius', expectedArudaTa: 'தனுசு', expectedSixthEn: 'Rishabam / Taurus', expectedSixthTa: 'ரிஷபம்' },
    { input: 10, expectedArudaEn: 'Makaram / Capricorn', expectedArudaTa: 'மகரம்', expectedSixthEn: 'Mithunam / Gemini', expectedSixthTa: 'மிதுனம்' },
    { input: 11, expectedArudaEn: 'Kumbam / Aquarius', expectedArudaTa: 'கும்பம்', expectedSixthEn: 'Kadagam / Cancer', expectedSixthTa: 'கடகம்' },
    { input: 12, expectedArudaEn: 'Meenam / Pisces', expectedArudaTa: 'மீனம்', expectedSixthEn: 'Simmam / Leo', expectedSixthTa: 'சிம்மம்' },
  ];

  testCases.forEach(({ input, expectedArudaEn, expectedArudaTa, expectedSixthEn, expectedSixthTa }) => {
    it(`Input ${input}: Aruda = ${expectedArudaEn}, 6th = ${expectedSixthEn}`, () => {
      const arudaRes = calculateArudaLagnam(input);
      expect(arudaRes.arudaRasi.englishNameOnly).toBe(expectedArudaEn);
      expect(arudaRes.arudaRasi.tamilNameOnly).toBe(expectedArudaTa);

      const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);
      expect(sixthRes.sixthRasi.englishNameOnly).toBe(expectedSixthEn);
      expect(sixthRes.sixthRasi.tamilNameOnly).toBe(expectedSixthTa);

      // Verify counting traces exist and are non-empty
      expect(arudaRes.steps.length).toBe(input);
      expect(sixthRes.steps.length).toBe(6);
      expect(arudaRes.countingStepsTa.length).toBe(input);
      expect(sixthRes.countingStepsTa.length).toBe(6);
    });
  });

  it('Verifies dynamic transit ephemeris returns all 9 planets with valid zodiac coordinates', () => {
    const transit = calculateTransitPositions(new Date('2026-09-26T12:00:00Z'));
    expect(transit.isEphemerisAvailable).toBe(true);
    expect(transit.planets.length).toBe(9);

    const planetIds = transit.planets.map(p => p.id);
    expect(planetIds).toContain('sun');
    expect(planetIds).toContain('moon');
    expect(planetIds).toContain('mars');
    expect(planetIds).toContain('mercury');
    expect(planetIds).toContain('jupiter');
    expect(planetIds).toContain('venus');
    expect(planetIds).toContain('saturn');
    expect(planetIds).toContain('rahu');
    expect(planetIds).toContain('ketu');

    transit.planets.forEach(p => {
      expect(p.rasiId).toBeGreaterThanOrEqual(1);
      expect(p.rasiId).toBeLessThanOrEqual(12);
      expect(p.degreeInRasi).toBeGreaterThanOrEqual(0);
      expect(p.degreeInRasi).toBeLessThan(30);
      expect(p.nakshatraId).toBeGreaterThanOrEqual(1);
      expect(p.nakshatraId).toBeLessThanOrEqual(27);
      expect(p.pada).toBeGreaterThanOrEqual(1);
      expect(p.pada).toBeLessThanOrEqual(4);
    });
  });

  it('Verifies rule-based Question Classifier does not return empty and infers categories', () => {
    const arudaRes = calculateArudaLagnam(5); // Simmam
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi); // Makaram (Saturn)
    const transit = calculateTransitPositions(new Date('2026-09-26T12:00:00Z'));

    const questions = classifyClientQuestion({
      selectedNumber: 5,
      arudaRasi: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets
    });

    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].strength).toBeDefined();
    expect(questions[0].explanationEnglish).toBeDefined();
    expect(questions[0].explanationTamil).toBeDefined();
  });

  it('Verifies full Prediction Engine output produces complete structured judgment', () => {
    const arudaRes = calculateArudaLagnam(5);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);
    const transit = calculateTransitPositions(new Date('2026-09-26T12:00:00Z'));
    const questions = classifyClientQuestion({
      selectedNumber: 5,
      arudaRasi: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets
    });

    const pred = generateArudamPrediction({
      selectedNumber: 5,
      arudaRasi: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      classifiedQuestions: questions
    });

    expect(pred.arudaRasi.englishNameOnly).toBe('Simmam / Leo');
    expect(pred.sixthRasi.englishNameOnly).toBe('Makaram / Capricorn');
    expect(pred.predictionEn).toBeTruthy();
    expect(pred.predictionTa).toBeTruthy();
    expect(pred.lostObjectAnalysis.recoveryIndicationTa).toBeTruthy();
    expect(pred.missingPersonAnalysis.directionTa).toBeTruthy();
    expect(pred.sakunamAnalysis.favorabilityTa).toBeTruthy();
    // Resolution + Chandran Timing step added: trace now has 9 steps
    expect(pred.ruleTraceSteps.length).toBe(9);
    expect(pred.ruleTraceSteps.some(s => s.stage === 'CHANDRAN TIMING')).toBe(true);
    expect(pred.chandranFindingTime).toBeDefined();
    expect(pred.attributedTo).toContain('Priyavathsan Sridharan Iyengar');
    expect(pred.attributedTo).toContain('+91-9486483808');
  });
});

describe('PHASE 53 — Resolution / Fulfilment Engine Tests', () => {
  const transit = calculateTransitPositions(new Date('2026-09-26T12:00:00Z'));

  it('Resolution engine returns a valid ResolutionStatus for every category', () => {
    const categories = ['lost_object', 'missing_person', 'marriage', 'finance', 'job', 'travel', 'health', 'legal', 'sakunam', 'general'] as const;

    for (const cat of categories) {
      const arudaRes = calculateArudaLagnam(5);
      const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);
      const result = resolvePrasnaOutcome({
        questionCategory: cat,
        arudaLagna: arudaRes.arudaRasi,
        sixthRasi: sixthRes.sixthRasi,
        sixthLord: sixthRes.sixthLord,
        transitPlanets: transit.planets,
        applicableRules: []
      });

      expect(VALID_RESOLUTION_STATUSES).toContain(result.resolutionStatus);
      expect(result.purpose.id).toBeTruthy();
      expect(result.resolutionStatusLabelEn).toBeTruthy();
      expect(result.resolutionStatusLabelTa).toBeTruthy();
      expect(result.timingLabelEn).toBeTruthy();
      expect(result.timingLabelTa).toBeTruthy();
    }
  });

  it('Lost object with Saturn lord produces delayed or likely_fulfilled (Makaram 6th)', () => {
    const arudaRes = calculateArudaLagnam(5);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);

    const result = resolvePrasnaOutcome({
      questionCategory: 'lost_object',
      arudaLagna: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      applicableRules: []
    });

    expect(['likely_fulfilled', 'delayed', 'fulfilled']).toContain(result.resolutionStatus);
    expect(result.purpose.purposeEnglish).toContain('lost object');
    const totalRules = result.supportingRules.length + result.counterRules.length;
    expect(totalRules + (result.isNoConclusion ? 1 : 0)).toBeGreaterThan(0);
  });

  it('Lost object explanation includes timing clause in both languages', () => {
    const arudaRes = calculateArudaLagnam(5);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);

    const result = resolvePrasnaOutcome({
      questionCategory: 'lost_object',
      arudaLagna: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      applicableRules: []
    });

    expect(result.explanationEn.length).toBeGreaterThan(20);
    expect(result.explanationTa.length).toBeGreaterThan(10);
  });

  it('Missing person with Chara sign Aries (input 8) returns delayed', () => {
    // Input 8 → Viruchigam / Scorpio → 6th Mesham / Aries → Chara → lord Mars
    const arudaRes = calculateArudaLagnam(8);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);

    const result = resolvePrasnaOutcome({
      questionCategory: 'missing_person',
      arudaLagna: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      applicableRules: []
    });

    expect(result.resolutionStatus).toBe('delayed');
  });

  it('Job with Jupiter lord (Dhanusu 6th from input 4) returns fulfilled', () => {
    // Input 4 → Kadagam / Cancer → 6th Dhanusu / Sagittarius → lord Jupiter
    const arudaRes = calculateArudaLagnam(4);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);

    const result = resolvePrasnaOutcome({
      questionCategory: 'job',
      arudaLagna: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      applicableRules: []
    });

    expect(result.resolutionStatus).toBe('fulfilled');
    expect(result.resolutionStrength).toBe('strong');
  });

  it('Finance with Venus lord (Thulam 6th from input 2) returns fulfilled', () => {
    // Input 2 → Rishabam / Taurus → 6th Thulam / Libra → lord Venus
    const arudaRes = calculateArudaLagnam(2);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);

    const result = resolvePrasnaOutcome({
      questionCategory: 'finance',
      arudaLagna: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      applicableRules: []
    });

    expect(result.resolutionStatus).toBe('fulfilled');
  });

  it('Sakunam with Saturn lord returns uncertain, not absolute denial', () => {
    // Input 5 → Saturn 6th lord → RES-SAK-002 (uncertain)
    const arudaRes = calculateArudaLagnam(5);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);

    const result = resolvePrasnaOutcome({
      questionCategory: 'sakunam',
      arudaLagna: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      applicableRules: []
    });

    expect(result.resolutionStatus).toBe('uncertain');
    expect(result.explanationEn).not.toContain('will definitely never');
    expect(result.explanationEn).not.toContain('impossible');
  });

  it('Resolution is embedded in master prediction with RESOLUTION trace step', () => {
    const arudaRes = calculateArudaLagnam(5);
    const sixthRes = calculateSixthRasi(arudaRes.arudaRasi);
    const questions = classifyClientQuestion({
      selectedNumber: 5,
      arudaRasi: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets
    });

    const pred = generateArudamPrediction({
      selectedNumber: 5,
      arudaRasi: arudaRes.arudaRasi,
      sixthRasi: sixthRes.sixthRasi,
      sixthLord: sixthRes.sixthLord,
      transitPlanets: transit.planets,
      classifiedQuestions: questions
    });

    expect(pred.prasnaResolution).toBeDefined();
    expect(pred.prasnaResolution.purpose).toBeDefined();
    expect(VALID_RESOLUTION_STATUSES).toContain(pred.prasnaResolution.resolutionStatus);
    expect(pred.prasnaResolution.explanationEn.length).toBeGreaterThan(10);
    expect(pred.prasnaResolution.explanationTa.length).toBeGreaterThan(10);

    const resStep = pred.ruleTraceSteps.find(s => s.stage === 'RESOLUTION');
    expect(resStep).toBeDefined();
    expect(resStep?.value).toBeTruthy();
  });
});
