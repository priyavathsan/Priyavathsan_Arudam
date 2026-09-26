import { ArudamMapping } from '../types/astrology';
import { getSignById } from './signs';

export const ARUDAM_MAPPINGS: ArudamMapping[] = [
  { number: 1, arudaSignId: 1, sixthSignId: 6, direction: 'East' }, // Aries -> Virgo
  { number: 2, arudaSignId: 2, sixthSignId: 7, direction: 'South' }, // Taurus -> Libra
  { number: 3, arudaSignId: 3, sixthSignId: 8, direction: 'West' }, // Gemini -> Scorpio
  { number: 4, arudaSignId: 4, sixthSignId: 9, direction: 'North' }, // Cancer -> Sagittarius
  { number: 5, arudaSignId: 5, sixthSignId: 10, direction: 'East' }, // Leo -> Capricorn
  { number: 6, arudaSignId: 6, sixthSignId: 11, direction: 'South' }, // Virgo -> Aquarius
  { number: 7, arudaSignId: 7, sixthSignId: 12, direction: 'West' }, // Libra -> Pisces
  { number: 8, arudaSignId: 8, sixthSignId: 1, direction: 'North' }, // Scorpio -> Aries
  { number: 9, arudaSignId: 9, sixthSignId: 2, direction: 'East' }, // Sagittarius -> Taurus
  { number: 10, arudaSignId: 10, sixthSignId: 3, direction: 'South' }, // Capricorn -> Gemini
  { number: 11, arudaSignId: 11, sixthSignId: 4, direction: 'West' }, // Aquarius -> Cancer
  { number: 12, arudaSignId: 12, sixthSignId: 5, direction: 'North' }, // Pisces -> Leo
];

export const getArudamByNumber = (num: number): ArudamMapping => {
  const norm = ((num - 1) % 12 + 12) % 12 + 1;
  return ARUDAM_MAPPINGS.find(a => a.number === norm) || ARUDAM_MAPPINGS[0];
};

export const calculateArudaSign = (num: number) => {
  const mapping = getArudamByNumber(num);
  return {
    mapping,
    arudaSign: getSignById(mapping.arudaSignId),
    sixthSign: getSignById(mapping.sixthSignId),
  };
};
