import { ZODIAC_SIGNS, getSignById, getSignByName } from '../data/signs';
import { ZodiacSignInfo } from '../types/astrology';

export interface RasiRuleData extends ZodiacSignInfo {
  index: number; // 0..11
  tamilNameOnly: string;
  englishNameOnly: string;
  lordId: string;
  bodyPartTa: string;
  bodyPartEn: string;
  natureTa: string;
  natureEn: string;
}

export const RASI_LIST: RasiRuleData[] = [
  {
    ...ZODIAC_SIGNS[0],
    index: 0,
    tamilNameOnly: 'மேஷம்',
    englishNameOnly: 'Mesham / Aries',
    lordId: 'mars',
    bodyPartTa: 'தலை, முகம்',
    bodyPartEn: 'Head, Brain',
    natureTa: 'சர ராசி, நெருப்பு, கிழக்கு',
    natureEn: 'Movable (Chara), Fire, East'
  },
  {
    ...ZODIAC_SIGNS[1],
    index: 1,
    tamilNameOnly: 'ரிஷபம்',
    englishNameOnly: 'Rishabam / Taurus',
    lordId: 'venus',
    bodyPartTa: 'கழுத்து, கண்கள்',
    bodyPartEn: 'Face, Neck, Throat',
    natureTa: 'ஸ்திர ராசி, நிலம், தெற்கு',
    natureEn: 'Fixed (Sthira), Earth, South'
  },
  {
    ...ZODIAC_SIGNS[2],
    index: 2,
    tamilNameOnly: 'மிதுனம்',
    englishNameOnly: 'Mithunam / Gemini',
    lordId: 'mercury',
    bodyPartTa: 'தோள்கள், கைகள்',
    bodyPartEn: 'Shoulders, Arms, Hands',
    natureTa: 'உபய ராசி, காற்று, மேற்கு',
    natureEn: 'Dual (Ubhaya), Air, West'
  },
  {
    ...ZODIAC_SIGNS[3],
    index: 3,
    tamilNameOnly: 'கடகம்',
    englishNameOnly: 'Kadagam / Cancer',
    lordId: 'moon',
    bodyPartTa: 'மார்பு, நுரையீரல்',
    bodyPartEn: 'Chest, Breast, Stomach',
    natureTa: 'சர ராசி, நீர், வடக்கு',
    natureEn: 'Movable (Chara), Water, North'
  },
  {
    ...ZODIAC_SIGNS[4],
    index: 4,
    tamilNameOnly: 'சிம்மம்',
    englishNameOnly: 'Simmam / Leo',
    lordId: 'sun',
    bodyPartTa: 'இதயம், முதுகுத்தண்டு',
    bodyPartEn: 'Heart, Spine',
    natureTa: 'ஸ்திர ராசி, நெருப்பு, கிழக்கு',
    natureEn: 'Fixed (Sthira), Fire, East'
  },
  {
    ...ZODIAC_SIGNS[5],
    index: 5,
    tamilNameOnly: 'கன்னி',
    englishNameOnly: 'Kanni / Virgo',
    lordId: 'mercury',
    bodyPartTa: 'வயிறு, செரிமான பகுதி',
    bodyPartEn: 'Digestive system, Intestines',
    natureTa: 'உபய ராசி, நிலம், தெற்கு',
    natureEn: 'Dual (Ubhaya), Earth, South'
  },
  {
    ...ZODIAC_SIGNS[6],
    index: 6,
    tamilNameOnly: 'துலாம்',
    englishNameOnly: 'Thulam / Libra',
    lordId: 'venus',
    bodyPartTa: 'இடுப்பு, சிறுநீரகம்',
    bodyPartEn: 'Kidneys, Lower abdomen',
    natureTa: 'சர ராசி, காற்று, மேற்கு',
    natureEn: 'Movable (Chara), Air, West'
  },
  {
    ...ZODIAC_SIGNS[7],
    index: 7,
    tamilNameOnly: 'விருச்சிகம்',
    englishNameOnly: 'Viruchigam / Scorpio',
    lordId: 'mars',
    bodyPartTa: 'மர்ம உறுப்புகள், ஆசனவாய்',
    bodyPartEn: 'Pelvis, Secret organs',
    natureTa: 'ஸ்திர ராசி, நீர், வடக்கு',
    natureEn: 'Fixed (Sthira), Water, North'
  },
  {
    ...ZODIAC_SIGNS[8],
    index: 8,
    tamilNameOnly: 'தனுசு',
    englishNameOnly: 'Dhanusu / Sagittarius',
    lordId: 'jupiter',
    bodyPartTa: 'தொடைகள், இடுப்பு தசை',
    bodyPartEn: 'Thighs, Hips',
    natureTa: 'உபய ராசி, நெருப்பு, கிழக்கு',
    natureEn: 'Dual (Ubhaya), Fire, East'
  },
  {
    ...ZODIAC_SIGNS[9],
    index: 9,
    tamilNameOnly: 'மகரம்',
    englishNameOnly: 'Makaram / Capricorn',
    lordId: 'saturn',
    bodyPartTa: 'முழங்கால்கள், மூட்டுகள்',
    bodyPartEn: 'Knees, Joints, Bones',
    natureTa: 'சர ராசி, நிலம், தெற்கு',
    natureEn: 'Movable (Chara), Earth, South'
  },
  {
    ...ZODIAC_SIGNS[10],
    index: 10,
    tamilNameOnly: 'கும்பம்',
    englishNameOnly: 'Kumbam / Aquarius',
    lordId: 'saturn',
    bodyPartTa: 'கணுக்கால், இரத்த ஓட்டம்',
    bodyPartEn: 'Ankles, Shins, Calves',
    natureTa: 'ஸ்திர ராசி, காற்று, மேற்கு',
    natureEn: 'Fixed (Sthira), Air, West'
  },
  {
    ...ZODIAC_SIGNS[11],
    index: 11,
    tamilNameOnly: 'மீனம்',
    englishNameOnly: 'Meenam / Pisces',
    lordId: 'jupiter',
    bodyPartTa: 'பாதங்கள், கால்விரல்கள்',
    bodyPartEn: 'Feet, Toes',
    natureTa: 'உபய ராசி, நீர், வடக்கு',
    natureEn: 'Dual (Ubhaya), Water, North'
  }
];

export const getRasiByIndex = (index: number): RasiRuleData => {
  const norm = ((index % 12) + 12) % 12;
  return RASI_LIST[norm];
};

export const getRasiById = (id: number): RasiRuleData => {
  const norm = (((id - 1) % 12) + 12) % 12;
  return RASI_LIST[norm];
};

export { ZODIAC_SIGNS, getSignById, getSignByName };
