import { RasiRuleData, getRasiById } from '../astrology/rasi';
import { getEnhancedPlanetById, EnhancedPlanetInfo } from '../astrology/planets';

export interface SixthRasiStep {
  count: number; // 1..6
  rasiId: number;
  rasiNameTa: string;
  rasiNameEn: string;
}

export interface SixthRasiCalculationResult {
  arudaRasi: RasiRuleData;
  sixthRasi: RasiRuleData;
  sixthLord: EnhancedPlanetInfo;
  countingStepsTa: string[];
  countingStepsEn: string[];
  steps: SixthRasiStep[];
  formulaExplanationTa: string;
  formulaExplanationEn: string;
}

/**
 * Calculates the 6th Rasi from Aruda Lagnam
 * Rule: Count 6 positions starting from Aruda Lagnam as position 1.
 * Formula: sixthIndex = (arudaIndex + 5) % 12 (0-indexed)
 */
export const calculateSixthRasi = (arudaRasi: RasiRuleData): SixthRasiCalculationResult => {
  const arudaIndex = arudaRasi.index; // 0..11
  const sixthIndex = (arudaIndex + 5) % 12;
  const sixthRasi = getRasiById(sixthIndex + 1);
  const sixthLord = getEnhancedPlanetById(sixthRasi.lordId);

  const steps: SixthRasiStep[] = [];
  const countingStepsTa: string[] = [];
  const countingStepsEn: string[] = [];

  for (let c = 1; c <= 6; c++) {
    const currentRasiIndex = (arudaIndex + c - 1) % 12;
    const currentRasi = getRasiById(currentRasiIndex + 1);
    steps.push({
      count: c,
      rasiId: currentRasi.id,
      rasiNameTa: currentRasi.tamilNameOnly,
      rasiNameEn: currentRasi.englishNameOnly
    });
    countingStepsTa.push(`${c} → ${currentRasi.tamilNameOnly}`);
    countingStepsEn.push(`${c} → ${currentRasi.englishNameOnly}`);
  }

  const formulaExplanationTa = `ஆருட லக்னம் (${arudaRasi.tamilNameOnly}) முதல் 6-ஆம் ராசி வரை எண்ண: ${countingStepsTa.join(', ')}. எனவே 6-ஆம் ராசி = ${sixthRasi.tamilNameOnly} (அதிபதி: ${sixthLord.tamilOnly}).`;
  const formulaExplanationEn = `Counting 6 positions starting from Aruda Lagnam (${arudaRasi.englishNameOnly}): ${countingStepsEn.join(', ')}. Therefore, 6th Rasi = ${sixthRasi.englishNameOnly} (Lord: ${sixthLord.englishOnly}).`;

  return {
    arudaRasi,
    sixthRasi,
    sixthLord,
    countingStepsTa,
    countingStepsEn,
    steps,
    formulaExplanationTa,
    formulaExplanationEn
  };
};
