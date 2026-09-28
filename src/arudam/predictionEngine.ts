import { RasiRuleData } from '../astrology/rasi';
import { EnhancedPlanetInfo } from '../astrology/planets';
import { TransitPlanetInfo } from '../kochara/transitCalculator';
import { getTransitRuleForPlanetInHouse } from '../kochara/transitRules';
import { ClassifiedQuestion } from './questionClassifier';
import { ArudamRule } from './arudamRules';
import { PrasnaResolution, resolvePrasnaOutcome } from './resolutionEngine';
import {
  calculateChandranFindingTime,
  ChandranFindingTimeResult
} from './chandranTimingRules';

export interface LostObjectAnalysis {
  objectStatusEn: string;
  objectStatusTa: string;
  natureOfLocationEn: string;
  natureOfLocationTa: string;
  nearOrFarEn: string;
  nearOrFarTa: string;
  insideOrOutsideEn: string;
  insideOrOutsideTa: string;
  elevationEn: string;
  elevationTa: string;
  lockedStatusEn: string;
  lockedStatusTa: string;
  hiddenStatusEn: string;
  hiddenStatusTa: string;
  directionEn: string;
  directionTa: string;
  delayEn: string;
  delayTa: string;
  recoveryIndicationEn: string;
  recoveryIndicationTa: string;
  findingTimeEn?: string;
  findingTimeTa?: string;
  findingCategoryEn?: string;
  findingCategoryTa?: string;
  findingRuleId?: string;
  /** Chandran-based aliases used by tests and UI panels */
  chandranFindingTimeEn?: string;
  chandranFindingTimeTa?: string;
  timeCategoryEn?: string;
  timeCategoryTa?: string;
}

export interface MissingPersonAnalysis {
  personIndicationEn: string;
  personIndicationTa: string;
  nearOrFarEn: string;
  nearOrFarTa: string;
  directionEn: string;
  directionTa: string;
  communicationEn: string;
  communicationTa: string;
  returnIndicationEn: string;
  returnIndicationTa: string;
  delayEn: string;
  delayTa: string;
}

export interface SakunamAnalysis {
  natureEn: string;
  natureTa: string;
  favorabilityEn: string;
  favorabilityTa: string;
  connectionEn: string;
  connectionTa: string;
  ruleIndicationEn?: string;
  ruleIndicationTa?: string;
}

export interface RuleTraceStep {
  stage: string;
  stageTa: string;
  value: string;
  valueTa: string;
  detail: string;
  detailTa: string;
  /** Optional rule ID for the primary rule active in this step */
  ruleId?: string;
}

export interface FullPredictionResult {
  selectedNumber: number;
  arudaRasi: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  transitPlanetsInSixth: TransitPlanetInfo[];
  classifiedQuestions: ClassifiedQuestion[];
  primaryQuestion: ClassifiedQuestion;
  predictionEn: string;
  predictionTa: string;
  astrologicalIndicationEn: string;
  astrologicalIndicationTa: string;
  lostObjectAnalysis: LostObjectAnalysis;
  missingPersonAnalysis: MissingPersonAnalysis;
  sakunamAnalysis: SakunamAnalysis;
  /** Phase 53 — Resolution / Fulfilment layer */
  prasnaResolution: PrasnaResolution;
  /** Phase 54 — Chandran-based time-of-finding layer */
  chandranFindingTime: ChandranFindingTimeResult;
  matchedRules: ArudamRule[];
  ruleTraceSteps: RuleTraceStep[];
  calculationTraceEn: string;
  calculationTraceTa: string;
  attributedTo: string;
}

// Re-export for consumers
export type { PrasnaResolution, ChandranFindingTimeResult };
export { calculateChandranFindingTime };

export const generateArudamPrediction = (params: {
  selectedNumber: number;
  arudaRasi: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  transitPlanets: TransitPlanetInfo[];
  classifiedQuestions: ClassifiedQuestion[];
  prasnaDateTime?: Date;
}): FullPredictionResult => {
  const { selectedNumber, arudaRasi, sixthRasi, sixthLord, transitPlanets, classifiedQuestions, prasnaDateTime = new Date() } = params;

  // Transit planets currently in 6th sign
  const transitPlanetsInSixth = transitPlanets.filter(p => p.rasiId === sixthRasi.id);

  // Primary question classification
  const primaryQuestion = classifiedQuestions[0] || {
    category: 'general',
    categoryNameEn: 'General Prasna',
    categoryNameTa: 'பொதுவான கேள்வி',
    strength: 'moderate',
    strengthLabelEn: 'Moderate indication',
    strengthLabelTa: 'மிதமான சுட்டு',
    matchedRules: [],
    explanationEnglish: 'General traditional inquiry',
    explanationTamil: 'பாரம்பரிய பொது ஆருடம்'
  };

  // Matched Rules
  const matchedRules: ArudamRule[] = [];
  for (const q of classifiedQuestions) {
    for (const r of q.matchedRules) {
      if (!matchedRules.some(m => m.id === r.id)) {
        matchedRules.push(r);
      }
    }
  }

  // Include transit rules for any planets in 6th Rasi
  for (const tp of transitPlanetsInSixth) {
    const trRule = getTransitRuleForPlanetInHouse(tp.id, 6);
    if (trRule) {
      matchedRules.push({
        id: trRule.id,
        category: primaryQuestion.category,
        condition: { transitPlanetInSixth: tp.id },
        strength: trRule.strength,
        priority: 88,
        titleEn: `Transit ${tp.nameEn} in 6th House`,
        titleTa: `6-ஆம் வீட்டில் கோச்சார ${tp.nameTa}`,
        predictionEn: trRule.interpretationEn,
        predictionTa: trRule.interpretationTa,
        explanationEn: `Current transit position of ${tp.nameEn} directly influences the 6th Rasi from Aruda Lagna.`,
        explanationTa: `ஆருட லக்னத்திற்கு 6-ஆம் ராசியில் தற்போதைய கோச்சார ${tp.nameTa} சஞ்சாரம் செய்வதால் இந்த பலன் உருவாகிறது.`
      });
    }
  }

  // Synthesize Astrological Indication
  const astrologicalIndicationEn = `Aruda Lagna is ${arudaRasi.englishNameOnly} (${arudaRasi.natureEn}). The 6th Rasi from Aruda is ${sixthRasi.englishNameOnly} ruled by ${sixthLord.englishOnly} (${sixthLord.element} element). ${
    transitPlanetsInSixth.length > 0
      ? `Transit planet(s) in 6th: ${transitPlanetsInSixth.map(p => p.nameEn).join(', ')}.`
      : `No major physical transit planet occupies the 6th Rasi currently; disposition is guided by ruler ${sixthLord.englishOnly}.`
  }`;

  const astrologicalIndicationTa = `ஆருட லக்னம்: ${arudaRasi.tamilNameOnly} (${arudaRasi.natureTa}). ஆருடத்திற்கு 6-ஆம் ராசி: ${sixthRasi.tamilNameOnly} (அதிபதி: ${sixthLord.tamilOnly}). ${
    transitPlanetsInSixth.length > 0
      ? `6-ஆம் ராசியில் உள்ள கோச்சார கிரகங்கள்: ${transitPlanetsInSixth.map(p => p.nameTa).join(', ')}.`
      : `தற்போது 6-ஆம் ராசியில் நேரடி கோச்சார கிரகங்கள் இல்லை; 6-ஆம் அதிபதியான ${sixthLord.tamilOnly} வழிகாட்டலின்படி பலன் நிர்ணயிக்கப்படுகிறது.`
  }`;

  // Synthesize Comprehensive Arudam Prediction
  const leadRule = matchedRules[0];
  const predictionEn = leadRule
    ? `${leadRule.predictionEn} Traditional Prasna rules indicate ${primaryQuestion.strengthLabelEn.toLowerCase()} regarding ${primaryQuestion.categoryNameEn}. Direction indicated is ${sixthRasi.direction}, associated with ${sixthRasi.locationClue}.`
    : `Traditional Prasna principles for Aruda Lagna ${arudaRasi.englishNameOnly} and 6th sign ${sixthRasi.englishNameOnly} promise positive resolution through steady effort and mindful action. Direction indicated: ${sixthRasi.direction}.`;

  const predictionTa = leadRule
    ? `${leadRule.predictionTa} ஆருட சாஸ்திர விதிகளின்படி ${primaryQuestion.categoryNameTa} குறித்து ${primaryQuestion.strengthLabelTa} நிலவுகிறது. சுட்டிக்காட்டப்படும் திசை: ${sixthRasi.direction} (${sixthRasi.locationClue}).`
    : `ஆருட லக்னம் ${arudaRasi.tamilNameOnly} மற்றும் 6-ஆம் ராசி ${sixthRasi.tamilNameOnly} அமைப்பினால், தடைகள் நீங்கி காரியம் வெற்றி பெற அமைதியான முயற்சியும் வழிகாட்டலும் நற்பலன் தரும். திசை: ${sixthRasi.direction}.`;

  // Phase 16: Lost Object Analysis
  const isEarth = sixthRasi.element === 'Earth';
  const isWater = sixthRasi.element === 'Water';
  const isFire = sixthRasi.element === 'Fire';
  const isAir = sixthRasi.element === 'Air';

  const lostObjectAnalysis: LostObjectAnalysis = {
    objectStatusEn: isEarth ? 'Safe and stationary; not destroyed or stolen' : isWater ? 'Covered or resting amidst soft/damp items' : isFire ? 'Placed in a prominent or metallic/warm area' : 'Resting on an elevated surface or in transit bag',
    objectStatusTa: isEarth ? 'பொருள் பாதுகாப்பாகவும் நிலையாகவும் உள்ளது; களவு போகவில்லை' : isWater ? 'துணிகள், திரவங்கள் அல்லது மென்மையான பொருட்களுக்கு அடியில் உள்ளது' : isFire ? 'வெளிச்சமான இடம் அல்லது உலோக/சூடான பகுதியில் உள்ளது' : 'மேஜை, பை அல்லது காற்று படும் மேலிடத்தில் உள்ளது',
    natureOfLocationEn: sixthRasi.locationClue,
    natureOfLocationTa: `${sixthRasi.tamilNameOnly} ராசிக்குரிய இடம்: ${sixthRasi.locationClue}`,
    nearOrFarEn: [1, 2, 4, 5, 8].includes(sixthRasi.id) ? 'Near (Within familiar premises or immediate building)' : 'Moderate distance (During transit, travel, or secondary location)',
    nearOrFarTa: [1, 2, 4, 5, 8].includes(sixthRasi.id) ? 'அருகில் (வீடு அல்லது அலுவலக வளாகத்திற்குள்ளேயே)' : 'சற்றே தொலைவில் (பயணத்தில் அல்லது வேறு அறையில்)',
    insideOrOutsideEn: isEarth || isWater ? 'Inside (Interior cupboard, room, or enclosed container)' : 'Inside / semi-open (Near doors, windows, or entrance)',
    insideOrOutsideTa: isEarth || isWater ? 'உள்ளே (அறைக்குள், அலமாரியில் அல்லது மூடிய பெட்டியில்)' : 'உள்ளே / வாயில் பகுதி (ஜன்னல், வாசல் அல்லது பால்கனி அருகில்)',
    elevationEn: isAir || isFire ? 'Higher area (Desk top, shelf, mantelpiece, or prominent spot)' : 'Lower area (Floor level, bottom shelf, or beneath other articles)',
    elevationTa: isAir || isFire ? 'உயரமான பகுதி (மேஜை மேல்மட்டம், அலமாரி மேல் பகுதி)' : 'கீழ்ப்பகுதி (தரை மட்டம், கீழ் அலமாரி, அல்லது பொருட்களுக்கு அடியில்)',
    lockedStatusEn: isEarth || sixthLord.id === 'saturn' ? 'Likely locked, enclosed, or tucked behind other articles' : 'Open or readily accessible once clutter is cleared',
    lockedStatusTa: isEarth || sixthLord.id === 'saturn' ? 'பூட்டிய அல்லது மற்ற பொருட்களுக்கு பின்னால் மறைந்த நிலை' : 'திறந்த நிலை அல்லது எளிதில் கண்ணில் படக்கூடிய நிலை',
    hiddenStatusEn: sixthRasi.id === 8 || isWater ? 'Concealed from direct eye level; search behind lower dividers' : 'In plain sight but overlooked due to familiarity or distraction',
    hiddenStatusTa: sixthRasi.id === 8 || isWater ? 'நேரடி பார்வையில் படாமல் மறைந்திருக்கிறது; அடியில் தேடவும்' : 'தெளிவான இடத்திலேயே கவனக்குறைவால் பார்க்காமல் விடப்பட்டுள்ளது',
    directionEn: `${sixthRasi.direction} direction from the place of inquiry`,
    directionTa: `கேள்வி கேட்ட இடத்திலிருந்து ${sixthRasi.direction} திசை`,
    delayEn: sixthLord.id === 'saturn' ? 'Moderate delay; requires thorough, patient re-checking' : 'Minimal delay; quick discovery within a short period',
    delayTa: sixthLord.id === 'saturn' ? 'சிறிது காலதாமதம்; பொறுமையுடன் மீண்டும் தேட வேண்டும்' : 'குறைந்த காலதாமதம்; விரைவில் கண்டுபிடிக்க வாய்ப்புள்ளது',
    recoveryIndicationEn: ['jupiter', 'venus', 'mercury', 'sun'].includes(sixthLord.id) ? 'Strong recovery indication (High probability of retrieval)' : 'Moderate recovery indication (Recovery after thorough search)',
    recoveryIndicationTa: ['jupiter', 'venus', 'mercury', 'sun'].includes(sixthLord.id) ? 'வலுவான மீட்பு சுட்டு (நிச்சயம் மீண்டும் கிடைக்க வாய்ப்புள்ளது)' : 'மிதமான மீட்பு சுட்டு (விடாமுயற்சிக்கு பின் கிடைக்கும்)'
  };

  // Phase 17: Missing Person Analysis
  const isChara = [1, 4, 7, 10].includes(sixthRasi.id);
  const isSthira = [2, 5, 8, 11].includes(sixthRasi.id);

  const missingPersonAnalysis: MissingPersonAnalysis = {
    personIndicationEn: isSthira ? 'Stationed safely with friends or at a stable shelter' : isChara ? 'In active transit, commuting or moving between places' : 'Near town center or temporary public dwelling',
    personIndicationTa: isSthira ? 'நண்பர்கள் அல்லது உறவினர்களுடன் பாதுகாப்பாக தங்கியுள்ளார்' : isChara ? 'தொடர்ந்து பிரயாணத்தில் அல்லது நகர்வில் உள்ளார்' : 'அருகிலுள்ள பொது இடத்தில் அல்லது தற்காலிக விடுதியில் உள்ளார்',
    nearOrFarEn: isSthira ? 'Relatively close (Within the same district or known circle)' : 'Distant location (Intercity or distinct region)',
    nearOrFarTa: isSthira ? 'அருகில் (அதே ஊர் அல்லது தெரிந்த வட்டத்திற்குள்)' : 'தொலைவில் (வெளியூர் அல்லது புதிய பகுதி)',
    directionEn: `${sixthRasi.direction} quadrant`,
    directionTa: `${sixthRasi.direction} திசை நோக்கிய பகுதி`,
    communicationEn: ['mercury', 'moon', 'jupiter'].includes(sixthLord.id) ? 'Direct phone call, message, or mediator news expected soon' : 'News through third-party enquiry or institutional channels',
    communicationTa: ['mercury', 'moon', 'jupiter'].includes(sixthLord.id) ? 'விரைவில் தொலைபேசி செய்தி அல்லது நேரடி தகவல் வரும்' : 'மூன்றாம் நபர் மூலமாக செய்தி அறிய வரும்',
    returnIndicationEn: isSthira || ['jupiter', 'venus'].includes(sixthLord.id) ? 'Favorable return indication; reconciliation supported' : 'Return after resolving domestic or personal anxiety',
    returnIndicationTa: isSthira || ['jupiter', 'venus'].includes(sixthLord.id) ? 'சாதகமான திரும்புதல் சுட்டு; சமாதானம் ஏற்படும்' : 'மனக்குழப்பம் தீர்ந்த பின் தாமதமாக திரும்புவார்',
    delayEn: sixthLord.id === 'saturn' ? 'Delay of several days; patience advised' : 'Swift resolution expected shortly',
    delayTa: sixthLord.id === 'saturn' ? 'சில நாட்கள் காலதாமதம்; பதட்டமின்றி இருக்கவும்' : 'விரைவில் தகவல் அல்லது தொடர்பு கிடைக்கும்'
  };

  // Phase 53: Resolution / Fulfilment
  const prasnaResolution: PrasnaResolution = resolvePrasnaOutcome({
    questionCategory: primaryQuestion.category,
    arudaLagna: arudaRasi,
    sixthRasi,
    sixthLord,
    transitPlanets,
    applicableRules: matchedRules
  });

  // Phase 54: Chandran-Based Time-of-Finding Layer
  const moonPlanet = transitPlanets.find(p => p.id === 'moon');
  const moonRasiId = moonPlanet ? moonPlanet.rasiId : 1;
  const moonHouseFromArudam = (((moonRasiId - arudaRasi.id + 12) % 12) + 1);
  const moonHouseFromSixthRasi = (((moonRasiId - sixthRasi.id + 12) % 12) + 1);

  const chandranFindingTime: ChandranFindingTimeResult = calculateChandranFindingTime({
    moonRasi: moonRasiId,
    moonRasiNameEn: moonPlanet?.rasiEn,
    moonRasiNameTa: moonPlanet?.rasiTa,
    moonNakshatra: moonPlanet?.nakshatraEn,
    moonNakshatraId: moonPlanet?.nakshatraId,
    moonNakshatraNameTa: moonPlanet?.nakshatraTa,
    moonPada: moonPlanet?.pada,
    moonLongitude: moonPlanet?.totalSiderealDegree,
    moonDegreeInRasi: moonPlanet?.degreeInRasi,
    moonHouseFromArudam,
    moonHouseFromSixthRasi,
    prasnaDateTime,
    arudaRasiId: arudaRasi.id,
    arudaRasiNameEn: arudaRasi.englishNameOnly,
    arudaRasiNameTa: arudaRasi.tamilNameOnly,
    sixthRasiId: sixthRasi.id,
    sixthRasiNameEn: sixthRasi.englishNameOnly,
    sixthRasiNameTa: sixthRasi.tamilNameOnly,
    sixthLordId: sixthLord.id,
    resolutionStatus: prasnaResolution.resolutionStatus,
    questionCategory: primaryQuestion.category
  });

  // Embed finding time into LostObjectAnalysis
  lostObjectAnalysis.findingTimeEn = chandranFindingTime.timeOfFindingEn;
  lostObjectAnalysis.findingTimeTa = chandranFindingTime.timeOfFindingTa;
  lostObjectAnalysis.findingCategoryEn = chandranFindingTime.timeCategoryEn;
  lostObjectAnalysis.findingCategoryTa = chandranFindingTime.timeCategoryTa;
  lostObjectAnalysis.findingRuleId = chandranFindingTime.ruleId;
  // Chandran-specific aliases for direct field access in tests and panels
  lostObjectAnalysis.chandranFindingTimeEn = chandranFindingTime.timeOfFindingEn;
  lostObjectAnalysis.chandranFindingTimeTa = chandranFindingTime.timeOfFindingTa;
  lostObjectAnalysis.timeCategoryEn = chandranFindingTime.timeCategoryEn;
  lostObjectAnalysis.timeCategoryTa = chandranFindingTime.timeCategoryTa;

  // Phase 18: Sakunam / Omen Analysis
  const sakunamRule = matchedRules.find(rule => rule.category === 'sakunam');
  const sakunamAnalysis: SakunamAnalysis = {
    natureEn: ['jupiter', 'venus', 'mercury'].includes(sixthLord.id) ? 'Auspicious omen (Subha Nimitham) signifying blessing' : 'Cautionary omen (Asubha / Warning Nimitham) advising care',
    natureTa: ['jupiter', 'venus', 'mercury'].includes(sixthLord.id) ? 'சுப சகுனம் (மங்களகரமான அறிகுறி)' : 'எச்சரிக்கை சகுனம் (விழிப்புணர்வுக்கான அறிகுறி)',
    favorabilityEn: ['jupiter', 'venus', 'mercury'].includes(sixthLord.id) ? 'Favorable indication for proceeding with prayer' : 'Avoid haste or signing hasty documents today',
    favorabilityTa: ['jupiter', 'venus', 'mercury'].includes(sixthLord.id) ? 'காரியத்தில் தாராளமாக முன்னேறலாம்; தெய்வ அனுகூலம் உண்டு' : 'அவசர முடிவுகள், உடன்படிக்கைகளை தள்ளிப்போடுவது நலம்',
    connectionEn: `Directly tied to the matter ruled by ${sixthLord.englishOnly} (${sixthLord.karakattvamEn})`,
    connectionTa: `${sixthLord.tamilOnly} கிரகத்தின் காரகத்துவமான (${sixthLord.karakattvamTa}) காரியத்தோடு தொடர்புடையது`,
    ruleIndicationEn: sakunamRule?.predictionEn,
    ruleIndicationTa: sakunamRule?.predictionTa
  };

  // Phase 25: Rule Trace ("Why this prediction?" / "இந்த பலன் ஏன்?")
  const ruleTraceSteps: RuleTraceStep[] = [
    {
      stage: 'INPUT',
      stageTa: 'உள்ளீடு',
      value: `Number ${selectedNumber}`,
      valueTa: `எண் ${selectedNumber}`,
      detail: `Client selected number ${selectedNumber} between 1 and 12`,
      detailTa: `பயனர் 1 முதல் 12 வரை தேர்ந்தெடுத்த எண்: ${selectedNumber}`
    },
    {
      stage: 'ARUDA LAGNAM',
      stageTa: 'ஆருட லக்னம்',
      value: arudaRasi.englishNameOnly,
      valueTa: arudaRasi.tamilNameOnly,
      detail: `Counted from Mesham (1) to ${selectedNumber} = ${arudaRasi.englishNameOnly}`,
      detailTa: `மேஷம் (1) முதல் வரிசையாக ${selectedNumber} வரை எண்ண: ${arudaRasi.tamilNameOnly}`
    },
    {
      stage: '6TH RASI',
      stageTa: '6-ஆம் ராசி',
      value: sixthRasi.englishNameOnly,
      valueTa: sixthRasi.tamilNameOnly,
      detail: `Counted 6 signs from Aruda Lagna (${arudaRasi.englishNameOnly}) = ${sixthRasi.englishNameOnly} (Lord: ${sixthLord.englishOnly})`,
      detailTa: `ஆருட லக்னம் (${arudaRasi.tamilNameOnly}) முதல் 6-ஆம் இடம்: ${sixthRasi.tamilNameOnly} (அதிபதி: ${sixthLord.tamilOnly})`
    },
    {
      stage: 'KOCHARA PLANETS',
      stageTa: 'கோச்சார கிரகங்கள்',
      value: transitPlanetsInSixth.length > 0 ? transitPlanetsInSixth.map(p => p.nameEn).join(', ') : 'No transit planets in 6th',
      valueTa: transitPlanetsInSixth.length > 0 ? transitPlanetsInSixth.map(p => p.nameTa).join(', ') : '6-ஆம் ராசியில் நேரடி கிரகங்கள் இல்லை',
      detail: transitPlanetsInSixth.length > 0
        ? `Transit planets directly in ${sixthRasi.englishNameOnly}: ${transitPlanetsInSixth.map(p => `${p.nameEn} at ${p.degreeFormatted}`).join(', ')}`
        : `Disposition guided by lord ${sixthLord.englishOnly}, element ${sixthRasi.element}, direction ${sixthRasi.direction}`,
      detailTa: transitPlanetsInSixth.length > 0
        ? `${sixthRasi.tamilNameOnly} ராசியில் உள்ள கோச்சார கிரகங்கள்: ${transitPlanetsInSixth.map(p => `${p.nameTa} (${p.degreeFormatted})`).join(', ')}`
        : `6-ஆம் அதிபதி ${sixthLord.tamilOnly}, தத்துவம் ${sixthRasi.element}, திசை ${sixthRasi.direction} அடிப்படையில் பலன் கணிக்கப்படுகிறது`
    },
    {
      stage: 'MATCHED RULES',
      stageTa: 'பொருந்திய விதிகள்',
      value: matchedRules.map(r => r.id).join(', ') || 'AR-GEN-UNIVERSAL',
      valueTa: matchedRules.map(r => r.id).join(', ') || 'AR-GEN-UNIVERSAL',
      detail: `${matchedRules.length} traditional rule(s) activated based on 6th sign attributes and lord`,
      detailTa: `6-ஆம் ராசி மற்றும் அதிபதியின் அடிப்படையில் ${matchedRules.length} பாரம்பரிய விதிகள் செயல்படுத்தப்பட்டன`
    },
    {
      stage: 'QUESTION CATEGORY',
      stageTa: 'கேள்வியின் தன்மை',
      value: `${primaryQuestion.categoryNameEn} (${primaryQuestion.strengthLabelEn})`,
      valueTa: `${primaryQuestion.categoryNameTa} (${primaryQuestion.strengthLabelTa})`,
      detail: primaryQuestion.explanationEnglish,
      detailTa: primaryQuestion.explanationTamil
    },
    {
      stage: 'RESOLUTION',
      stageTa: 'தீர்வு / நிறைவேற்றம்',
      value: prasnaResolution.resolutionStatusLabelEn,
      valueTa: prasnaResolution.resolutionStatusLabelTa,
      detail: prasnaResolution.isNoConclusion
        ? prasnaResolution.noConclusionReasonEn
        : `${prasnaResolution.resolutionStatusLabelEn} | Timing: ${prasnaResolution.timingLabelEn} | Rules: ${prasnaResolution.supportingRules.map(r => r.id).join(', ') || 'none'}`,
      detailTa: prasnaResolution.isNoConclusion
        ? prasnaResolution.noConclusionReasonTa
        : `${prasnaResolution.resolutionStatusLabelTa} | கால சுட்டு: ${prasnaResolution.timingLabelTa} | விதிகள்: ${prasnaResolution.supportingRules.map(r => r.id).join(', ') || 'இல்லை'}`
    },
    {
      stage: 'CHANDRAN TIMING',
      stageTa: 'சந்திரன் காலக் கணிப்பு',
      value: chandranFindingTime.timeOfFindingEn,
      valueTa: chandranFindingTime.timeOfFindingTa,
      ruleId: chandranFindingTime.ruleId,
      detail: chandranFindingTime.isApplicable
        ? `${chandranFindingTime.timeOfFindingEn} (${chandranFindingTime.timeCategoryEn}) | Rule: ${chandranFindingTime.ruleId} | Moon: ${chandranFindingTime.contextData.moonRasiEn} (${chandranFindingTime.contextData.moonHouseFromAruda}th from Aruda)`
        : `${chandranFindingTime.timeOfFindingEn} | ${chandranFindingTime.moonBasisEn}`,
      detailTa: chandranFindingTime.isApplicable
        ? `${chandranFindingTime.timeOfFindingTa} (${chandranFindingTime.timeCategoryTa}) | விதி: ${chandranFindingTime.ruleId} | சந்திரன்: ${chandranFindingTime.contextData.moonRasiTa} (ஆருடத்திற்கு ${chandranFindingTime.contextData.moonHouseFromAruda}-ஆம் இடம்)`
        : `${chandranFindingTime.timeOfFindingTa} | ${chandranFindingTime.moonBasisTa}`
    },
    {
      stage: 'PREDICTION',
      stageTa: 'ஆருட பலன்',
      value: 'Synthesized Traditional Judgment',
      valueTa: 'பாரம்பரிய ஆருட முடிவு',
      detail: predictionEn,
      detailTa: predictionTa
    }
  ];

  const calculationTraceEn = `Input Number: ${selectedNumber} → Aruda Lagna: ${arudaRasi.englishNameOnly} → 6th Rasi: ${sixthRasi.englishNameOnly} (Lord: ${sixthLord.englishOnly}) → Direction: ${sixthRasi.direction} → Primary Indication: ${primaryQuestion.categoryNameEn} (${primaryQuestion.strengthLabelEn}) → Finding Time: ${chandranFindingTime.timeOfFindingEn}`;
  const calculationTraceTa = `தேர்ந்தெடுத்த எண்: ${selectedNumber} → ஆருட லக்னம்: ${arudaRasi.tamilNameOnly} → 6-ஆம் ராசி: ${sixthRasi.tamilNameOnly} (அதிபதி: ${sixthLord.tamilOnly}) → திசை: ${sixthRasi.direction} → பிரதான கேள்வி சுட்டு: ${primaryQuestion.categoryNameTa} (${primaryQuestion.strengthLabelTa}) → கிடைக்கும் காலம்: ${chandranFindingTime.timeOfFindingTa}`;

  return {
    selectedNumber,
    arudaRasi,
    sixthRasi,
    sixthLord,
    transitPlanetsInSixth,
    classifiedQuestions,
    primaryQuestion,
    predictionEn,
    predictionTa,
    astrologicalIndicationEn,
    astrologicalIndicationTa,
    lostObjectAnalysis,
    missingPersonAnalysis,
    sakunamAnalysis,
    prasnaResolution,
    chandranFindingTime,
    matchedRules,
    ruleTraceSteps,
    calculationTraceEn,
    calculationTraceTa,
    attributedTo: 'கணிப்பவர் Priyavathsan Sridharan Iyengar | +91-9486483808 | https://wa.me/919486483808'
  };
};
