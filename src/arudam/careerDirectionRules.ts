export type CompassDirection =
  | 'North'
  | 'North-East'
  | 'East'
  | 'South-East'
  | 'South'
  | 'South-West'
  | 'West'
  | 'North-West'
  | 'Center';

export type CareerQuestionType =
  | 'general_job_search'
  | 'job_change'
  | 'resume_sharing'
  | 'job_application'
  | 'interview'
  | 'job_offer'
  | 'new_company_search'
  | 'relocation'
  | 'joining'
  | 'promotion'
  | 'salary_increase';

export type CareerDirectionRole = 'primary' | 'secondary';
export type CareerDirectionConfidence = 'strong' | 'moderate' | 'possible';

export interface CareerDirectionInput {
  arudamNumber: number;
  arudaLagnaId: number;
  careerHouseIds: number[];
  planetIds: string[];
  gocharamPlanetIds: string[];
  questionType: CareerQuestionType;
}

export interface CareerDirectionConditions {
  arudamNumbers?: number[];
  arudaLagnaIds?: number[];
  careerQuestionTypes?: CareerQuestionType[];
  houseIds?: number[];
  planetIds?: string[];
  gocharamPlanetIds?: string[];
}

export interface CareerDirectionRule {
  id: string;
  source: string;
  role: CareerDirectionRole;
  direction: CompassDirection;
  confidence: CareerDirectionConfidence;
  conditions: CareerDirectionConditions;
  explanationEn: string;
  explanationTa: string;
}

export interface CareerDirectionResult {
  status: 'unconfigured' | 'ready' | 'conflicting' | 'incomplete';
  primaryDirection?: CompassDirection;
  secondaryDirection?: CompassDirection;
  confidence?: CareerDirectionConfidence;
  matchedRules: CareerDirectionRule[];
  conflictingDirections: CompassDirection[];
}

// Populate only with career-direction rules that include an identifiable traditional source.
export const CAREER_DIRECTION_RULES: CareerDirectionRule[] = [];

const intersects = <T,>(values: T[], expected?: T[]): boolean =>
  !expected || expected.some(value => values.includes(value));

const matchesRule = (rule: CareerDirectionRule, input: CareerDirectionInput): boolean => {
  const { conditions } = rule;

  return (
    intersects([input.arudamNumber], conditions.arudamNumbers) &&
    intersects([input.arudaLagnaId], conditions.arudaLagnaIds) &&
    intersects([input.questionType], conditions.careerQuestionTypes) &&
    intersects(input.careerHouseIds, conditions.houseIds) &&
    intersects(input.planetIds, conditions.planetIds) &&
    intersects(input.gocharamPlanetIds, conditions.gocharamPlanetIds)
  );
};

const CONFIDENCE_ORDER: Record<CareerDirectionConfidence, number> = {
  possible: 1,
  moderate: 2,
  strong: 3
};

export const evaluateCareerDirection = (
  input: CareerDirectionInput,
  rules: CareerDirectionRule[] = CAREER_DIRECTION_RULES
): CareerDirectionResult => {
  const matchedRules = rules.filter(rule => matchesRule(rule, input));
  if (matchedRules.length === 0) {
    return { status: 'unconfigured', matchedRules: [], conflictingDirections: [] };
  }

  const primaryRules = matchedRules.filter(rule => rule.role === 'primary');
  const secondaryRules = matchedRules.filter(rule => rule.role === 'secondary');
  const primaryDirections = [...new Set(primaryRules.map(rule => rule.direction))];
  const secondaryDirections = [...new Set(secondaryRules.map(rule => rule.direction))];
  const conflictingDirections = [...new Set([...primaryDirections, ...secondaryDirections])];

  if (primaryDirections.length > 1 || secondaryDirections.length > 1) {
    return { status: 'conflicting', matchedRules, conflictingDirections };
  }

  if (primaryDirections.length === 0) {
    return { status: 'incomplete', matchedRules, conflictingDirections };
  }

  const primaryDirection = primaryDirections[0];
  const secondaryDirection = secondaryDirections[0] === primaryDirection
    ? undefined
    : secondaryDirections[0];
  const confidence = primaryRules
    .filter(rule => rule.direction === primaryDirection)
    .map(rule => rule.confidence)
    .sort((left, right) => CONFIDENCE_ORDER[right] - CONFIDENCE_ORDER[left])[0];

  return {
    status: 'ready',
    primaryDirection,
    secondaryDirection,
    confidence,
    matchedRules,
    conflictingDirections: []
  };
};