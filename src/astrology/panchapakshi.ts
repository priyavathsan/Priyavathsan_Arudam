// Traditional Tamil Panchapakshi (ஐந்து பட்சிகள்) Rules & System
// Preserved & formalized for Prasna analysis

export type Pakshi = 'valluru' | 'aandhai' | 'kaagam' | 'kozhi' | 'mayil';
export type Thozhil = 'arasu' | 'oon' | 'nadai' | 'thuyil' | 'saavu';

export interface PakshiInfo {
  id: Pakshi;
  nameEn: string;
  nameTa: string;
  birdNameEn: string;
  birdNameTa: string;
  element: string;
  rulingPlanets: string[];
  auspiciousScore: number;
}

export const PAKSHIS: PakshiInfo[] = [
  {
    id: 'valluru',
    nameEn: 'Valluru (Hawk / Vulture)',
    nameTa: 'வல்லூறு',
    birdNameEn: 'Hawk',
    birdNameTa: 'வல்லூறு',
    element: 'Fire',
    rulingPlanets: ['Sun', 'Mars'],
    auspiciousScore: 90
  },
  {
    id: 'aandhai',
    nameEn: 'Aandhai (Owl)',
    nameTa: 'ஆந்தை',
    birdNameEn: 'Owl',
    birdNameTa: 'ஆந்தை',
    element: 'Water',
    rulingPlanets: ['Moon'],
    auspiciousScore: 75
  },
  {
    id: 'kaagam',
    nameEn: 'Kaagam (Crow)',
    nameTa: 'காகம்',
    birdNameEn: 'Crow',
    birdNameTa: 'காகம்',
    element: 'Earth',
    rulingPlanets: ['Mercury', 'Saturn'],
    auspiciousScore: 60
  },
  {
    id: 'kozhi',
    nameEn: 'Kozhi (Cock / Rooster)',
    nameTa: 'கோழி',
    birdNameEn: 'Rooster',
    birdNameTa: 'கோழி',
    element: 'Air',
    rulingPlanets: ['Jupiter'],
    auspiciousScore: 85
  },
  {
    id: 'mayil',
    nameEn: 'Mayil (Peacock)',
    nameTa: 'மயில்',
    birdNameEn: 'Peacock',
    birdNameTa: 'மயில்',
    element: 'Space',
    rulingPlanets: ['Venus'],
    auspiciousScore: 80
  }
];

export const THOZHIL_NAMES: Record<Thozhil, { en: string; ta: string; strength: 'strong' | 'moderate' | 'possible' | 'weak' }> = {
  arasu: { en: 'Ruling (Arasu / King)', ta: 'அரசு (ஆட்சி நிலை)', strength: 'strong' },
  oon: { en: 'Eating (Oon / Nourishment)', ta: 'ஊண் (உணவு நிலை)', strength: 'strong' },
  nadai: { en: 'Walking (Nadai / Action)', ta: 'நடை (செயல் நிலை)', strength: 'moderate' },
  thuyil: { en: 'Sleeping (Thuyil / Rest)', ta: 'துயில் (ஓய்வு நிலை)', strength: 'possible' },
  saavu: { en: 'Dying (Saavu / Inaction)', ta: 'சாவு (செயலற்ற நிலை)', strength: 'weak' }
};

// Map Nakshatra (1..27) and Paksha (Shukla/Krishna) to Ruling Bird
export const getPakshiForNakshatra = (nakshatraId: number, isShuklaPaksha = true): Pakshi => {
  // Traditional Tamil Siddhar Agathiyar Panchapakshi allocation
  const shuklaOrder: Pakshi[] = [
    'valluru', 'aandhai', 'kaagam', 'kozhi', 'mayil'
  ];
  // 5 stars per bird cycle in traditional table
  const group = Math.floor(((nakshatraId - 1) % 27) / 5.4);
  return isShuklaPaksha ? shuklaOrder[group % 5] : shuklaOrder[(group + 2) % 5];
};
