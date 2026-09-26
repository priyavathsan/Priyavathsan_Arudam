export type Direction = 'East' | 'South' | 'West' | 'North';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface ZodiacSignInfo {
  id: number; // 1 to 12
  nameEn: string;
  nameTa: string;
  sanskritName: string;
  symbol: string;
  direction: Direction;
  element: ElementType;
  rulerEn: string;
  rulerTa: string;
  locationClue: string;
  locationKeywords: string[];
}

export interface PlanetInfo {
  id: string; // 'sun', 'moon', etc.
  nameEn: string;
  nameTa: string;
  sanskritName: string;
  symbol: string;
  keywords: string[];
  sixthSignInterpretation: string;
  locationClue: string;
  locationKeywords: string[];
  transitInterpretation: string;
}

export interface HouseInfo {
  number: number; // 1 to 12
  nameEn: string;
  nameTa: string;
  sanskritName: string;
  generalMeaning: string;
  missingObjectRelevance?: string;
  transitMeaning: string;
  isKeyMissingHouse: boolean; // 2, 4, 7, 8, 12
}

export interface ArudamMapping {
  number: number; // 1 to 12
  arudaSignId: number;
  sixthSignId: number;
  direction: Direction;
}

export interface MissingObjectClue {
  name: string;
  suggestedPlanet: string;
  suggestedHouse: number;
  suggestedSignId: number;
  keywords: string[];
}

export interface CombinedInput {
  arudamNumber: number;
  missingObjectName?: string;
  selectedHouse?: number;
  selectedSignId?: number;
  selectedPlanet?: string;
  transitPlanet?: string;
  transitHouse?: number;
}

export type DirectionConsistency = 'Strong' | 'Weak' | 'Mixed';

export type ClueConsistencyLevel =
  | 'Strong clue alignment'
  | 'Moderate clue alignment'
  | 'Single clue only'
  | 'Mixed clues – investigate multiple locations';

export interface CombinedInterpretationResult {
  arudaSign: ZodiacSignInfo;
  sixthSign: ZodiacSignInfo;
  missingHouse?: HouseInfo;
  missingSign?: ZodiacSignInfo;
  missingPlanet?: PlanetInfo;
  transitPlanet?: PlanetInfo;
  transitHouse?: HouseInfo;
  allDirections: Direction[];
  primaryDirection: Direction | 'Mixed';
  directionConsistency: DirectionConsistency;
  clueConsistency: ClueConsistencyLevel;
  clueCount: number;
  traditionalClueText: string;
  fullInterpretation: string;
  locationSuggestions: string[];
  moonImmediateClue?: string;
  longTermTransitClue?: string;
}
