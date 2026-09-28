import { describe, expect, it } from 'vitest';
import {
  CareerDirectionInput,
  CareerDirectionRule,
  CareerQuestionType,
  CompassDirection,
  evaluateCareerDirection
} from './careerDirectionRules';

const baseInput: CareerDirectionInput = {
  arudamNumber: 5,
  arudaLagnaId: 5,
  careerHouseIds: [6, 10, 11],
  planetIds: ['sun', 'saturn'],
  gocharamPlanetIds: ['jupiter', 'saturn'],
  questionType: 'general_job_search'
};

const makeRule = (
  direction: CompassDirection,
  overrides: Partial<CareerDirectionRule> = {}
): CareerDirectionRule => ({
  id: `TEST-${direction}`,
  source: 'Test fixture only',
  role: 'primary',
  direction,
  confidence: 'moderate',
  conditions: {},
  explanationEn: 'Test indication',
  explanationTa: 'சோதனை குறிப்பு',
  ...overrides
});

describe('evaluateCareerDirection', () => {
  it.each([
    'North', 'North-East', 'East', 'South-East', 'South',
    'South-West', 'West', 'North-West', 'Center'
  ] as CompassDirection[])('returns the configured %s direction', direction => {
    const result = evaluateCareerDirection(baseInput, [makeRule(direction)]);
    expect(result.status).toBe('ready');
    expect(result.primaryDirection).toBe(direction);
  });

  it('returns unconfigured rather than guessing when there are no sourced rules', () => {
    expect(evaluateCareerDirection(baseInput).status).toBe('unconfigured');
  });

  it('reports competing primary directions instead of selecting one', () => {
    const result = evaluateCareerDirection(baseInput, [makeRule('North'), makeRule('East')]);
    expect(result.status).toBe('conflicting');
    expect(result.conflictingDirections).toEqual(['North', 'East']);
    expect(result.primaryDirection).toBeUndefined();
  });

  it('matches the conditions on Arudam number, Lagna, career question, planets, houses, and Gocharam', () => {
    const rule = makeRule('North-East', {
      conditions: {
        arudamNumbers: [5],
        arudaLagnaIds: [5],
        careerQuestionTypes: ['resume_sharing'],
        houseIds: [10],
        planetIds: ['sun'],
        gocharamPlanetIds: ['jupiter']
      }
    });
    const resumeInput = { ...baseInput, questionType: 'resume_sharing' as CareerQuestionType };
    expect(evaluateCareerDirection(resumeInput, [rule]).primaryDirection).toBe('North-East');
    expect(evaluateCareerDirection({ ...resumeInput, arudamNumber: 7 }, [rule]).status).toBe('unconfigured');
    expect(evaluateCareerDirection({ ...resumeInput, arudaLagnaId: 7 }, [rule]).status).toBe('unconfigured');
    expect(evaluateCareerDirection({ ...resumeInput, questionType: 'job_offer' }, [rule]).status).toBe('unconfigured');
    expect(evaluateCareerDirection({ ...resumeInput, planetIds: ['venus'] }, [rule]).status).toBe('unconfigured');
    expect(evaluateCareerDirection({ ...resumeInput, gocharamPlanetIds: ['mars'] }, [rule]).status).toBe('unconfigured');
  });

  it('returns a secondary indication separately from a primary direction', () => {
    const result = evaluateCareerDirection(baseInput, [
      makeRule('North-East'),
      makeRule('East', { id: 'TEST-SECONDARY', role: 'secondary' })
    ]);
    expect(result.status).toBe('ready');
    expect(result.primaryDirection).toBe('North-East');
    expect(result.secondaryDirection).toBe('East');
  });

  it('does not invent a secondary direction when none is configured', () => {
    const result = evaluateCareerDirection(baseInput, [makeRule('West')]);
    expect(result.primaryDirection).toBe('West');
    expect(result.secondaryDirection).toBeUndefined();
  });
});