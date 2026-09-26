import { RasiRuleData, getRasiById } from '../astrology/rasi';

export interface ArudamStep {
  step: number;
  rasiId: number;
  rasiNameTa: string;
  rasiNameEn: string;
}

export interface ArudamCalculationResult {
  selectedNumber: number;
  arudaRasi: RasiRuleData;
  countingStepsTa: string[];
  countingStepsEn: string[];
  steps: ArudamStep[];
  formulaExplanationTa: string;
  formulaExplanationEn: string;
}

/**
 * Calculates Aruda Lagnam from chosen number (1–12)
 * Rule: Count from Mesham (Aries = 1) up to the chosen number.
 * Therefore: Aruda Lagnam = selected number's Rasi.
 */
export const calculateArudaLagnam = (selectedNumber: number): ArudamCalculationResult => {
  // Normalize number to 1..12
  const norm = ((selectedNumber - 1) % 12 + 12) % 12 + 1;
  const arudaRasi = getRasiById(norm);

  const steps: ArudamStep[] = [];
  const countingStepsTa: string[] = [];
  const countingStepsEn: string[] = [];

  for (let i = 1; i <= norm; i++) {
    const rasi = getRasiById(i);
    steps.push({
      step: i,
      rasiId: rasi.id,
      rasiNameTa: rasi.tamilNameOnly,
      rasiNameEn: rasi.englishNameOnly
    });
    countingStepsTa.push(`${i} → ${rasi.tamilNameOnly}`);
    countingStepsEn.push(`${i} → ${rasi.englishNameOnly}`);
  }

  const formulaExplanationTa = `தேர்ந்தெடுக்கப்பட்ட எண் = ${norm}. மேஷம் (1) முதல் வரிசையாக எண்ண: ${countingStepsTa.join(', ')}. எனவே ஆருட லக்னம் = ${arudaRasi.tamilNameOnly}.`;
  const formulaExplanationEn = `Selected Number = ${norm}. Counting sequentially from Mesham (1): ${countingStepsEn.join(', ')}. Therefore, Aruda Lagnam = ${arudaRasi.englishNameOnly}.`;

  return {
    selectedNumber: norm,
    arudaRasi,
    countingStepsTa,
    countingStepsEn,
    steps,
    formulaExplanationTa,
    formulaExplanationEn
  };
};
