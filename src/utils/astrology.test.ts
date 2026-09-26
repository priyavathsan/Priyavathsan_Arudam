import { describe, it, expect } from 'vitest';
import {
  calculateAruda,
  getSixthSign,
  getHouseFromAruda,
  getDirectionForSign,
  getGocharamResult,
  generateCombinedInterpretation,
  evaluateDirections
} from './astrology';

describe('Arudam & Prasna Calculation Engine Tests', () => {
  describe('calculateAruda()', () => {
    it('correctly maps 1 to Aries', () => {
      const sign = calculateAruda(1);
      expect(sign.id).toBe(1);
      expect(sign.nameEn).toBe('Aries');
    });

    it('correctly maps 8 to Scorpio', () => {
      const sign = calculateAruda(8);
      expect(sign.id).toBe(8);
      expect(sign.nameEn).toBe('Scorpio');
    });

    it('correctly maps 12 to Pisces', () => {
      const sign = calculateAruda(12);
      expect(sign.id).toBe(12);
      expect(sign.nameEn).toBe('Pisces');
    });

    it('handles all 12 numbers correctly', () => {
      const expectedSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio',
        'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ];
      for (let i = 1; i <= 12; i++) {
        expect(calculateAruda(i).nameEn).toBe(expectedSigns[i - 1]);
      }
    });
  });

  describe('getSixthSign()', () => {
    it('calculates 6th from Aries as Virgo', () => {
      const aries = calculateAruda(1);
      const sixth = getSixthSign(aries);
      expect(sixth.id).toBe(6);
      expect(sixth.nameEn).toBe('Virgo');
    });

    it('calculates 6th from Scorpio as Aries', () => {
      const scorpio = calculateAruda(8);
      const sixth = getSixthSign(scorpio);
      expect(sixth.id).toBe(1);
      expect(sixth.nameEn).toBe('Aries');
    });

    it('calculates 6th from Pisces as Leo', () => {
      const pisces = calculateAruda(12);
      const sixth = getSixthSign(pisces);
      expect(sixth.id).toBe(5);
      expect(sixth.nameEn).toBe('Leo');
    });
  });

  describe('House Calculations from Aruda Lagna', () => {
    it('verifies the example mode houses for Scorpio (8)', () => {
      const scorpio = calculateAruda(8);
      expect(scorpio.nameEn).toBe('Scorpio');

      // 6th = Aries
      expect(getSixthSign(scorpio).nameEn).toBe('Aries');

      // 2nd = Sagittarius
      expect(getHouseFromAruda(scorpio, 2).nameEn).toBe('Sagittarius');

      // 4th = Aquarius
      expect(getHouseFromAruda(scorpio, 4).nameEn).toBe('Aquarius');

      // 7th = Taurus
      expect(getHouseFromAruda(scorpio, 7).nameEn).toBe('Taurus');

      // 8th = Gemini
      expect(getHouseFromAruda(scorpio, 8).nameEn).toBe('Gemini');

      // 12th = Libra
      expect(getHouseFromAruda(scorpio, 12).nameEn).toBe('Libra');
    });
  });

  describe('Directions Engine', () => {
    it('verifies element to direction mappings', () => {
      // Aries / Leo / Sagittarius -> East
      expect(getDirectionForSign(1)).toBe('East');
      expect(getDirectionForSign(5)).toBe('East');
      expect(getDirectionForSign(9)).toBe('East');

      // Taurus / Virgo / Capricorn -> South
      expect(getDirectionForSign(2)).toBe('South');
      expect(getDirectionForSign(6)).toBe('South');
      expect(getDirectionForSign(10)).toBe('South');

      // Gemini / Libra / Aquarius -> West
      expect(getDirectionForSign(3)).toBe('West');
      expect(getDirectionForSign(7)).toBe('West');
      expect(getDirectionForSign(11)).toBe('West');

      // Cancer / Scorpio / Pisces -> North
      expect(getDirectionForSign(4)).toBe('North');
      expect(getDirectionForSign(8)).toBe('North');
      expect(getDirectionForSign(12)).toBe('North');
    });

    it('evaluates direction consistency', () => {
      const singleDir = evaluateDirections(['East']);
      expect(singleDir.primaryDirection).toBe('East');
      expect(singleDir.consistency).toBe('Weak');

      const strongDir = evaluateDirections(['East', 'East']);
      expect(strongDir.primaryDirection).toBe('East');
      expect(strongDir.consistency).toBe('Strong');

      const mixedDirs = evaluateDirections(['East', 'West']);
      expect(mixedDirs.primaryDirection).toBe('Mixed');
      expect(mixedDirs.consistency).toBe('Mixed');
    });
  });

  describe('Gocharam Interpretation', () => {
    it('returns valid planet and house interpretations', () => {
      const result = getGocharamResult('mercury', 8);
      expect(result.planetInterpretation).toContain('Documents, communication');
      expect(result.houseMeaning).toContain('Hidden, covered');
    });
  });

  describe('Combined Interpretation Example Mode (Scorpio #8, 8th House, Gemini, Mercury)', () => {
    it('produces full traditional interpretation without claiming certainty', () => {
      const result = generateCombinedInterpretation({
        arudamNumber: 8,
        selectedHouse: 8,
        selectedSignId: 3, // Gemini
        selectedPlanet: 'mercury',
        transitPlanet: 'mercury',
        transitHouse: 8
      });

      expect(result.arudaSign.nameEn).toBe('Scorpio');
      expect(result.sixthSign.nameEn).toBe('Aries');
      expect(result.missingHouse?.number).toBe(8);
      expect(result.missingSign?.nameEn).toBe('Gemini');
      expect(result.missingPlanet?.nameEn).toBe('Mercury');
      expect(result.transitPlanet?.nameEn).toBe('Mercury');
      expect(result.transitHouse?.number).toBe(8);

      // Must be traditional suggestions, avoiding absolute claims
      expect(result.traditionalClueText).toContain('Traditional interpretation suggests checking');
      expect(result.traditionalClueText).not.toContain('definitely');
      expect(result.traditionalClueText.toLowerCase()).toContain('hidden');
      expect(result.traditionalClueText.toLowerCase()).toContain('gemini');
      expect(result.traditionalClueText.toLowerCase()).toContain('mercury');
    });
  });
});
