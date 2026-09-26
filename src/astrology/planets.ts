import { PLANETS, getPlanetById } from '../data/planets';
import { PlanetInfo } from '../types/astrology';

export interface EnhancedPlanetInfo extends PlanetInfo {
  tamilOnly: string;
  englishOnly: string;
  rulingRasis: number[]; // Rasi ids
  element: string;
  karakattvamTa: string;
  karakattvamEn: string;
  nature: 'benefic' | 'malefic' | 'neutral';
}

export const NINE_PLANETS: EnhancedPlanetInfo[] = [
  {
    ...PLANETS[0],
    tamilOnly: 'சூரியன்',
    englishOnly: 'Sun',
    rulingRasis: [5], // Simmam
    element: 'Fire',
    karakattvamTa: 'தந்தை, அரசு, தலைமை, அதிகாரம், ஆற்றல், கௌரவம்',
    karakattvamEn: 'Father, Government, Leadership, Authority, Vitality, Honor',
    nature: 'malefic'
  },
  {
    ...PLANETS[1],
    tamilOnly: 'சந்திரன்',
    englishOnly: 'Moon',
    rulingRasis: [4], // Kadagam
    element: 'Water',
    karakattvamTa: 'தாய், மனம், உணர்வுகள், நீர், உணவு, மாற்றம்',
    karakattvamEn: 'Mother, Mind, Emotions, Fluids, Food, Fluctuations',
    nature: 'benefic'
  },
  {
    ...PLANETS[2],
    tamilOnly: 'செவ்வாய்',
    englishOnly: 'Mars',
    rulingRasis: [1, 8], // Mesham, Viruchigam
    element: 'Fire',
    karakattvamTa: 'வீரம், பூமி, சகோதரர், ஆயுதங்கள், விபத்து, தைரியம்',
    karakattvamEn: 'Courage, Land, Siblings, Tools, Conflict, Surgery',
    nature: 'malefic'
  },
  {
    ...PLANETS[3],
    tamilOnly: 'புதன்',
    englishOnly: 'Mercury',
    rulingRasis: [3, 6], // Mithunam, Kanni
    element: 'Earth',
    karakattvamTa: 'கல்வி, அறிவு, பேச்சு, வியாபாரம், தகவல், ஆவணங்கள்',
    karakattvamEn: 'Education, Intellect, Speech, Commerce, Documents, Accounts',
    nature: 'benefic'
  },
  {
    ...PLANETS[4],
    tamilOnly: 'குரு',
    englishOnly: 'Jupiter',
    rulingRasis: [9, 12], // Dhanusu, Meenam
    element: 'Ether',
    karakattvamTa: 'ஞானம், குழந்தைகள், செல்வம், தர்மம், குருமார்கள், பக்தி',
    karakattvamEn: 'Wisdom, Children, Wealth, Morality, Spiritual guides, Grace',
    nature: 'benefic'
  },
  {
    ...PLANETS[5],
    tamilOnly: 'சுக்கிரன்',
    englishOnly: 'Venus',
    rulingRasis: [2, 7], // Rishabam, Thulam
    element: 'Water',
    karakattvamTa: 'களத்திரம், செல்வம், கலை, வாகனம், அழகு, ஆடம்பரம்',
    karakattvamEn: 'Spouse, Vehicles, Arts, Comforts, Luxury, Relationships',
    nature: 'benefic'
  },
  {
    ...PLANETS[6],
    tamilOnly: 'சனி',
    englishOnly: 'Saturn',
    rulingRasis: [10, 11], // Makaram, Kumbam
    element: 'Air',
    karakattvamTa: 'ஆயுள், வேலை, தாமதம், துக்கம், சேவை, பழைய பொருட்கள்',
    karakattvamEn: 'Longevity, Career, Delays, Obstacles, Labor, Old items',
    nature: 'malefic'
  },
  {
    ...PLANETS[7],
    tamilOnly: 'ராகு',
    englishOnly: 'Rahu',
    rulingRasis: [11], // Co-ruler of Kumbam
    element: 'Air',
    karakattvamTa: 'மாயை, வெளிதேசம், விசித்திரம், மின்னணுவியல், மறைவு',
    karakattvamEn: 'Illusion, Foreign lands, Mystery, Electronics, Unconventional',
    nature: 'malefic'
  },
  {
    ...PLANETS[8],
    tamilOnly: 'கேது',
    englishOnly: 'Ketu',
    rulingRasis: [8], // Co-ruler of Viruchigam
    element: 'Fire',
    karakattvamTa: 'ஞானம், மோட்சம், தனிமை, ஆன்மீகம், பிளவு, முடக்கம்',
    karakattvamEn: 'Moksha, Spirituality, Isolation, Detachment, Narrow spaces',
    nature: 'malefic'
  }
];

export const getEnhancedPlanetById = (id: string): EnhancedPlanetInfo => {
  const norm = id.toLowerCase().trim();
  const found = NINE_PLANETS.find(p => p.id === norm || p.nameEn.toLowerCase() === norm || p.nameTa.toLowerCase().includes(norm));
  return found || NINE_PLANETS[0];
};

export { PLANETS, getPlanetById };
