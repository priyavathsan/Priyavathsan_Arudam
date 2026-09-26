import {
  Direction,
  DirectionConsistency,
  ClueConsistencyLevel,
  CombinedInput,
  CombinedInterpretationResult,
  ZodiacSignInfo,
  PlanetInfo
} from '../types/astrology';
import { getSignById } from '../data/signs';
import { PLANETS, getPlanetById } from '../data/planets';
import { getHouseByNumber } from '../data/houses';
import { getArudamByNumber } from '../data/arudam';
import { getMoonImmediateClue, LONG_TERM_TRANSIT_BACKGROUND } from '../data/gocharam';

/**
 * 1. Calculate Aruda Lagna for a number (1-12)
 */
export const calculateAruda = (number: number): ZodiacSignInfo => {
  const mapping = getArudamByNumber(number);
  return getSignById(mapping.arudaSignId);
};

/**
 * 2. Calculate the 6th sign from an Aruda sign
 */
export const getSixthSign = (arudaSign: ZodiacSignInfo | number): ZodiacSignInfo => {
  const signId = typeof arudaSign === 'number' ? arudaSign : arudaSign.id;
  const sixthSignId = ((signId - 1 + 5) % 12) + 1;
  return getSignById(sixthSignId);
};

/**
 * 3. Calculate which Zodiac sign falls into a given house relative to Aruda Lagna
 */
export const getHouseFromAruda = (
  arudaSign: ZodiacSignInfo | number,
  targetHouseNumber: number
): ZodiacSignInfo => {
  const arudaId = typeof arudaSign === 'number' ? arudaSign : arudaSign.id;
  const targetSignId = ((arudaId - 1 + (targetHouseNumber - 1)) % 12) + 1;
  return getSignById(targetSignId);
};

/**
 * 4. Get location clue for a zodiac sign
 */
export const getSignLocation = (sign: ZodiacSignInfo | number): string => {
  const signObj = typeof sign === 'number' ? getSignById(sign) : sign;
  return signObj.locationClue;
};

/**
 * 5. Get location clue for a planet
 */
export const getPlanetLocation = (planet: PlanetInfo | string): string => {
  const planetObj = typeof planet === 'string' ? getPlanetById(planet) : planet;
  return planetObj ? planetObj.locationClue : '';
};

/**
 * 6. Get house meaning
 */
export const getHouseMeaning = (houseNumber: number): string => {
  const house = getHouseByNumber(houseNumber);
  return house.generalMeaning;
};

/**
 * 7. Get Gocharam transit interpretation
 */
export const getGocharamResult = (
  planetId: string,
  houseNumber: number
): { planetInterpretation: string; houseMeaning: string; combinedSummary: string } => {
  const planet = getPlanetById(planetId) || PLANETS[0];
  const house = getHouseByNumber(houseNumber);

  return {
    planetInterpretation: planet.transitInterpretation,
    houseMeaning: house.transitMeaning,
    combinedSummary: `Transit of ${planet.nameEn} (${planet.nameTa}) through the ${house.number}${getOrdinal(house.number)} house highlights ${planet.transitInterpretation.toLowerCase()} in relation to ${house.transitMeaning.toLowerCase()}`
  };
};

export const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

/**
 * 8. Direction Engine
 * Aries / Leo / Sagittarius → East
 * Taurus / Virgo / Capricorn → South
 * Gemini / Libra / Aquarius → West
 * Cancer / Scorpio / Pisces → North
 */
export const getDirectionForSign = (sign: ZodiacSignInfo | number): Direction => {
  const signObj = typeof sign === 'number' ? getSignById(sign) : sign;
  return signObj.direction;
};

export const evaluateDirections = (
  directions: Direction[]
): {
  primaryDirection: Direction | 'Mixed';
  consistency: DirectionConsistency;
  summary: string;
} => {
  const valid = directions.filter(Boolean);
  if (valid.length === 0) {
    return {
      primaryDirection: 'Mixed',
      consistency: 'Weak',
      summary: 'No direction clues available.'
    };
  }

  const counts: Record<Direction, number> = {
    East: 0,
    South: 0,
    West: 0,
    North: 0
  };

  valid.forEach(d => {
    if (counts[d] !== undefined) {
      counts[d]++;
    }
  });

  const uniqueDirs = Object.entries(counts).filter(([_, count]) => count > 0);

  if (uniqueDirs.length === 1) {
    const singleDir = uniqueDirs[0][0] as Direction;
    if (valid.length >= 2) {
      return {
        primaryDirection: singleDir,
        consistency: 'Strong',
        summary: `Strong direction alignment pointing toward the ${singleDir}. Multiple astrological factors agree on this cardinal zone.`
      };
    }
    return {
      primaryDirection: singleDir,
      consistency: 'Weak',
      summary: `Single directional clue pointing toward the ${singleDir}. Verify with location and room clues.`
    };
  }

  // Find dominant
  uniqueDirs.sort((a, b) => b[1] - a[1]);
  if (uniqueDirs[0][1] >= 2 && uniqueDirs[0][1] > uniqueDirs[1][1]) {
    const dominantDir = uniqueDirs[0][0] as Direction;
    return {
      primaryDirection: dominantDir,
      consistency: 'Moderate' as any, // moderate agreement
      summary: `Primary tendency leans toward the ${dominantDir}, but secondary indicators suggest checking adjacent areas.`
    };
  }

  return {
    primaryDirection: 'Mixed',
    consistency: 'Mixed',
    summary: 'Direction clues are mixed. Use the house/planet/location clues rather than relying on direction alone.'
  };
};

/**
 * 9. Traditional Clue Consistency Indicator
 */
export const calculateClueConsistency = (
  matchCount: number,
  isConflicting: boolean
): ClueConsistencyLevel => {
  if (isConflicting && matchCount < 2) {
    return 'Mixed clues – investigate multiple locations';
  }
  if (matchCount >= 3) {
    return 'Strong clue alignment';
  }
  if (matchCount === 2) {
    return 'Moderate clue alignment';
  }
  return 'Single clue only';
};

/**
 * 10. Auto-Analyze Missing Object Name
 * Matches common household / personal items to planetary significators and houses
 */
export const autoDetectMissingObjectClues = (
  query: string
): {
  suggestedPlanetId: string;
  suggestedHouseNum: number;
  reasoning: string;
} => {
  const q = query.toLowerCase().trim();

  // Mobile, electronics, laptop, computer, cables
  if (q.includes('phone') || q.includes('mobile') || q.includes('cell') || q.includes('laptop') || q.includes('tablet') || q.includes('gadget')) {
    return {
      suggestedPlanetId: 'mercury',
      suggestedHouseNum: 8,
      reasoning: 'Electronic communication devices and hand-held items are ruled by Mercury, frequently misplaced in covered/hidden 8th-house pockets or bags.'
    };
  }

  // Documents, papers, books, passport, id card, certificate, wallet/files
  if (q.includes('document') || q.includes('paper') || q.includes('book') || q.includes('passport') || q.includes('card') || q.includes('file') || q.includes('pen')) {
    return {
      suggestedPlanetId: 'mercury',
      suggestedHouseNum: 2,
      reasoning: 'Paperwork, certificates, and cards relate to Mercury (intellect/records) and 2nd house (stored personal possessions).'
    };
  }

  // Money, cash, wallet, purse, gold, jewellery, necklace, ring, diamond
  if (q.includes('money') || q.includes('cash') || q.includes('wallet') || q.includes('purse') || q.includes('gold') || q.includes('jewel') || q.includes('ring') || q.includes('chain')) {
    return {
      suggestedPlanetId: q.includes('gold') ? 'jupiter' : 'venus',
      suggestedHouseNum: 2,
      reasoning: 'Valuables, currency, and gold/jewellery directly resonate with 2nd house (Dhana Bhava) and Jupiter/Venus.'
    };
  }

  // Keys, tools, knife, metal items, vehicle keys, watch
  if (q.includes('key') || q.includes('tool') || q.includes('metal') || q.includes('iron') || q.includes('cutter') || q.includes('scissors')) {
    return {
      suggestedPlanetId: 'mars',
      suggestedHouseNum: 4,
      reasoning: 'Sharp metallic items, tools, and entry keys correspond to Mars, typically located near door entries or domestic cabinets (4th house).'
    };
  }

  // Clothes, dress, makeup, cosmetics, perfume, spectacles, spectacles case
  if (q.includes('cloth') || q.includes('dress') || q.includes('shirt') || q.includes('saree') || q.includes('cosmetic') || q.includes('makeup') || q.includes('perfume')) {
    return {
      suggestedPlanetId: 'venus',
      suggestedHouseNum: 4,
      reasoning: 'Apparel and beauty items fall under Venus and interior bedroom/wardrobe spaces (4th house).'
    };
  }

  // Medicines, pills, first-aid
  if (q.includes('medicine') || q.includes('pill') || q.includes('tablet') || q.includes('prescription')) {
    return {
      suggestedPlanetId: 'mercury',
      suggestedHouseNum: 8,
      reasoning: 'Medicines and health storage align with Virgo/Mercury significations in organized or hidden drawers.'
    };
  }

  // Old items, grandfather clocks, ancestral items, iron junk, shoes, footwear
  if (q.includes('old') || q.includes('shoe') || q.includes('sandal') || q.includes('boot') || q.includes('iron') || q.includes('black') || q.includes('antique')) {
    return {
      suggestedPlanetId: 'saturn',
      suggestedHouseNum: 12,
      reasoning: 'Old, long-forgotten, or lower-level footwear/iron items align with Saturn and 12th/8th house corners.'
    };
  }

  // Default fallback
  return {
    suggestedPlanetId: 'mercury',
    suggestedHouseNum: 8,
    reasoning: 'General lost items traditionally invoke the 8th house of obscured belongings and Mercury for everyday personal items.'
  };
};

/**
 * 11. Full Combined Interpretation Engine
 */
export const generateCombinedInterpretation = (
  input: CombinedInput
): CombinedInterpretationResult => {
  const arudamNum = input.arudamNumber || 1;
  const arudaSign = calculateAruda(arudamNum);
  const sixthSign = getSixthSign(arudaSign);

  // House selection
  const houseNum = input.selectedHouse || 8;
  const missingHouse = getHouseByNumber(houseNum);
  const missingSign = input.selectedSignId
    ? getSignById(input.selectedSignId)
    : getHouseFromAruda(arudaSign, houseNum);

  // Planet selection
  const missingPlanet = input.selectedPlanet
    ? getPlanetById(input.selectedPlanet)
    : PLANETS.find(p => p.id === 'mercury')!;

  // Transit selection
  const transitPlanet = input.transitPlanet
    ? getPlanetById(input.transitPlanet)
    : missingPlanet;
  const transitHouseNum = input.transitHouse || houseNum;
  const transitHouse = getHouseByNumber(transitHouseNum);

  // Gather direction clues from Aruda, 6th sign, missing sign, etc.
  const directionsToConsider: Direction[] = [
    arudaSign.direction,
    missingSign.direction
  ];

  const dirEval = evaluateDirections(directionsToConsider);

  // Location suggestions synthesized from sign, house, and planet
  const locationSuggestions: string[] = [];
  if (missingHouse.missingObjectRelevance) {
    locationSuggestions.push(`House clue: ${missingHouse.missingObjectRelevance}`);
  }
  locationSuggestions.push(`Sign clue (${missingSign.nameEn}): ${missingSign.locationClue}`);
  if (missingPlanet) {
    locationSuggestions.push(`Planet clue (${missingPlanet.nameEn}): ${missingPlanet.locationClue}`);
  }
  if (transitPlanet && transitHouse) {
    locationSuggestions.push(`Transit clue (${transitPlanet.nameEn} in House ${transitHouse.number}): ${transitPlanet.transitInterpretation}`);
  }

  // Check Moon transit immediate clue
  let moonImmediateClue: string | undefined;
  if (transitPlanet && transitPlanet.id === 'moon') {
    moonImmediateClue = getMoonImmediateClue(transitHouse.number);
  } else if (input.transitHouse && [4, 8, 9, 12].includes(input.transitHouse)) {
    // If the selected transit house has a moon relevance
    moonImmediateClue = getMoonImmediateClue(input.transitHouse);
  }

  // Long-term transit background
  let longTermTransitClue: string | undefined;
  const longTermMatch = LONG_TERM_TRANSIT_BACKGROUND.find(
    lt => lt.planet.toLowerCase() === (transitPlanet?.id.toLowerCase() || '')
  );
  if (longTermMatch) {
    longTermTransitClue = `${longTermMatch.planet} transit background: ${longTermMatch.backgroundClue}`;
  }

  // Clue count & consistency
  let clueScore = 1;
  if (missingSign.direction === arudaSign.direction) clueScore++;
  if (missingPlanet && (missingPlanet.locationKeywords.some(k => missingSign.locationKeywords.includes(k)))) clueScore++;
  if (transitHouse.number === missingHouse.number) clueScore++;

  const isConflicting = dirEval.consistency === 'Mixed';
  const clueConsistency = calculateClueConsistency(clueScore, isConflicting);

  // Compose Traditional Combined Clue
  const objectLabel = input.missingObjectName?.trim()
    ? `for the ${input.missingObjectName.trim()}`
    : 'for the misplaced item';

  const houseEmphasis = missingHouse.missingObjectRelevance
    ? `The ${missingHouse.number}${getOrdinal(missingHouse.number)}-house emphasis suggests a ${missingHouse.missingObjectRelevance.toLowerCase()}`
    : `The ${missingHouse.number}${getOrdinal(missingHouse.number)} house denotes ${missingHouse.generalMeaning.toLowerCase()}.`;

  const signPlanetClue = `${missingSign.nameEn} and ${missingPlanet ? missingPlanet.nameEn : 'the ruling significator'} add ${missingSign.locationClue.toLowerCase()}, ${missingPlanet ? missingPlanet.locationClue.toLowerCase() : ''} as traditional location indicators.`;

  const directionAdvice = dirEval.primaryDirection !== 'Mixed'
    ? `Check these areas systematically, especially toward the indicated ${dirEval.primaryDirection} direction.`
    : `Because directional clues are varied, use the house and planet indicators rather than relying on a single direction.`;

  const traditionalClueText = `Traditional interpretation suggests checking:
${houseEmphasis} ${signPlanetClue} ${directionAdvice}`;

  const fullInterpretation = `Traditional combined interpretation ${objectLabel}:
Aruda Lagna is ${arudaSign.nameEn} (${arudaSign.nameTa}) with 6th sign ${sixthSign.nameEn} (${sixthSign.nameTa}).
${houseEmphasis}
${signPlanetClue}
${transitPlanet ? `With ${transitPlanet.nameEn} currently placed in the ${transitHouse.number}${getOrdinal(transitHouse.number)} house, circumstances point toward: "${transitPlanet.transitInterpretation}".` : ''}
${directionAdvice}
${moonImmediateClue ? `\n[Moon Immediate Indicator]: ${moonImmediateClue}` : ''}`;

  return {
    arudaSign,
    sixthSign,
    missingHouse,
    missingSign,
    missingPlanet,
    transitPlanet,
    transitHouse,
    allDirections: directionsToConsider,
    primaryDirection: dirEval.primaryDirection,
    directionConsistency: dirEval.consistency,
    clueConsistency,
    clueCount: clueScore,
    traditionalClueText,
    fullInterpretation,
    locationSuggestions,
    moonImmediateClue,
    longTermTransitClue
  };
};
