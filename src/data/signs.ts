import { ZodiacSignInfo } from '../types/astrology';

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: 1,
    nameEn: 'Aries',
    nameTa: 'மேஷம் (Mesham)',
    sanskritName: 'Mesha',
    symbol: '♈',
    direction: 'East',
    element: 'Fire',
    rulerEn: 'Mars',
    rulerTa: 'செவ்வாய்',
    locationClue: 'Near door, tools, machinery, kitchen',
    locationKeywords: ['door', 'tools', 'machinery', 'kitchen', 'entrance', 'iron', 'sharp objects', 'fire']
  },
  {
    id: 2,
    nameEn: 'Taurus',
    nameTa: 'ரிஷபம் (Rishabham)',
    sanskritName: 'Vrishabha',
    symbol: '♉',
    direction: 'South',
    element: 'Earth',
    rulerEn: 'Venus',
    rulerTa: 'சுக்கிரன்',
    locationClue: 'Money, jewellery, cupboard, storage',
    locationKeywords: ['money', 'jewellery', 'cupboard', 'storage', 'safe', 'wardrobe', 'cash', 'valuables']
  },
  {
    id: 3,
    nameEn: 'Gemini',
    nameTa: 'மிதுனம் (Mithunam)',
    sanskritName: 'Mithuna',
    symbol: '♊',
    direction: 'West',
    element: 'Air',
    rulerEn: 'Mercury',
    rulerTa: 'புதன்',
    locationClue: 'Desk, books, documents, bag, electronics',
    locationKeywords: ['desk', 'books', 'documents', 'bag', 'electronics', 'reading table', 'study', 'papers', 'mobile']
  },
  {
    id: 4,
    nameEn: 'Cancer',
    nameTa: 'கடகம் (Kadagam)',
    sanskritName: 'Karka',
    symbol: '♋',
    direction: 'North',
    element: 'Water',
    rulerEn: 'Moon',
    rulerTa: 'சந்திரன்',
    locationClue: 'Kitchen, water, bedroom, household items',
    locationKeywords: ['kitchen', 'water', 'bedroom', 'household items', 'dining area', 'vessels', 'refrigerator']
  },
  {
    id: 5,
    nameEn: 'Leo',
    nameTa: 'சிம்மம் (Simmam)',
    sanskritName: 'Simha',
    symbol: '♌',
    direction: 'East',
    element: 'Fire',
    rulerEn: 'Sun',
    rulerTa: 'சூரியன்',
    locationClue: 'High shelf, prominent place, living room',
    locationKeywords: ['high shelf', 'prominent place', 'living room', 'hall', 'altar', 'showcase', 'bright area']
  },
  {
    id: 6,
    nameEn: 'Virgo',
    nameTa: 'கன்னி (Kanni)',
    sanskritName: 'Kanya',
    symbol: '♍',
    direction: 'South',
    element: 'Earth',
    rulerEn: 'Mercury',
    rulerTa: 'புதன்',
    locationClue: 'Drawer, documents, medicines, organised storage',
    locationKeywords: ['drawer', 'documents', 'medicines', 'organised storage', 'first-aid box', 'folder', 'closet']
  },
  {
    id: 7,
    nameEn: 'Libra',
    nameTa: 'துலாம் (Thulam)',
    sanskritName: 'Tula',
    symbol: '♎',
    direction: 'West',
    element: 'Air',
    rulerEn: 'Venus',
    rulerTa: 'சுக்கிரன்',
    locationClue: 'Bedroom, dressing area, clothes, cosmetics',
    locationKeywords: ['bedroom', 'dressing area', 'clothes', 'cosmetics', 'mirror', 'wardrobe', 'bedside']
  },
  {
    id: 8,
    nameEn: 'Scorpio',
    nameTa: 'விருச்சிகம் (Viruchigam)',
    sanskritName: 'Vrishchika',
    symbol: '♏',
    direction: 'North',
    element: 'Water',
    rulerEn: 'Mars',
    rulerTa: 'செவ்வாய்',
    locationClue: 'Hidden corner, locked place, lower area',
    locationKeywords: ['hidden corner', 'locked place', 'lower area', 'underneath', 'secret box', 'drainage', 'bottom shelf']
  },
  {
    id: 9,
    nameEn: 'Sagittarius',
    nameTa: 'தனுசு (Thanusu)',
    sanskritName: 'Dhanus',
    symbol: '♐',
    direction: 'East',
    element: 'Fire',
    rulerEn: 'Jupiter',
    rulerTa: 'குரு',
    locationClue: 'Travel bag, vehicle, outdoor/large space',
    locationKeywords: ['travel bag', 'vehicle', 'outdoor/large space', 'car', 'garage', 'balcony', 'luggage', 'verandah']
  },
  {
    id: 10,
    nameEn: 'Capricorn',
    nameTa: 'மகரம் (Magaram)',
    sanskritName: 'Makara',
    symbol: '♑',
    direction: 'South',
    element: 'Earth',
    rulerEn: 'Saturn',
    rulerTa: 'சனி',
    locationClue: 'Old storage, basement, dark/corner area',
    locationKeywords: ['old storage', 'basement', 'dark/corner area', 'attic', 'junk room', 'floor level', 'heavy furniture']
  },
  {
    id: 11,
    nameEn: 'Aquarius',
    nameTa: 'கும்பம் (Kumbam)',
    sanskritName: 'Kumbha',
    symbol: '♒',
    direction: 'West',
    element: 'Air',
    rulerEn: 'Saturn',
    rulerTa: 'சனி',
    locationClue: 'Electronics, network/technology, unusual place',
    locationKeywords: ['electronics', 'network/technology', 'unusual place', 'cables', 'router', 'computer table', 'loft']
  },
  {
    id: 12,
    nameEn: 'Pisces',
    nameTa: 'மீனம் (Meenam)',
    sanskritName: 'Meena',
    symbol: '♓',
    direction: 'North',
    element: 'Water',
    rulerEn: 'Jupiter',
    rulerTa: 'குரு',
    locationClue: 'Water, bathroom, damp place, hidden/soft items',
    locationKeywords: ['water', 'bathroom', 'damp place', 'hidden/soft items', 'wash area', 'cushions', 'footwear area']
  }
];

export const getSignById = (id: number): ZodiacSignInfo => {
  const normalized = ((id - 1) % 12 + 12) % 12 + 1;
  const found = ZODIAC_SIGNS.find(s => s.id === normalized);
  return found || ZODIAC_SIGNS[0];
};

export const getSignByName = (name: string): ZodiacSignInfo | undefined => {
  const lower = name.toLowerCase().trim();
  return ZODIAC_SIGNS.find(
    s => s.nameEn.toLowerCase() === lower ||
         s.sanskritName.toLowerCase() === lower ||
         s.nameTa.toLowerCase().includes(lower)
  );
};
