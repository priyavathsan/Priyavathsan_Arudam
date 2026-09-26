import { PlanetInfo } from '../types/astrology';

export const PLANETS: PlanetInfo[] = [
  {
    id: 'sun',
    nameEn: 'Sun',
    nameTa: 'சூரியன் (Suriyan)',
    sanskritName: 'Surya',
    symbol: '☉',
    keywords: ['Authority', 'Government', 'Leadership', 'Power', 'Visibility', 'High place'],
    sixthSignInterpretation: 'Competition or opposition may become visible; authority, government or work-related pressure may be highlighted.',
    locationClue: 'Light, high place, window, authority-related location',
    locationKeywords: ['light', 'high place', 'window', 'authority', 'office table', 'temple', 'bright lamp', 'roof'],
    transitInterpretation: 'Authority, visibility, work or government-related circumstances.'
  },
  {
    id: 'moon',
    nameEn: 'Moon',
    nameTa: 'சந்திரன் (Chandran)',
    sanskritName: 'Chandra',
    symbol: '☽',
    keywords: ['Mind', 'Emotions', 'Fluctuation', 'Immediate shift', 'Water', 'Purity'],
    sixthSignInterpretation: 'Emotional fluctuation, daily changes, service/work pressure and immediate circumstances.',
    locationClue: 'Water, kitchen, bed, refrigerator',
    locationKeywords: ['water', 'kitchen', 'bed', 'refrigerator', 'sink', 'silver item', 'liquid', 'milk vessel'],
    transitInterpretation: 'Immediate movement, emotional response and short-term circumstances.'
  },
  {
    id: 'mars',
    nameEn: 'Mars',
    nameTa: 'செவ்வாய் (Sevvai)',
    sanskritName: 'Mangal',
    symbol: '♂',
    keywords: ['Energy', 'Courage', 'Confrontation', 'Tools', 'Fire', 'Urgency'],
    sixthSignInterpretation: 'Competition, strong effort and ability to confront obstacles; avoid haste and anger.',
    locationClue: 'Tools, metal, kitchen, garage, machinery',
    locationKeywords: ['tools', 'metal', 'kitchen', 'garage', 'machinery', 'iron box', 'sharp tools', 'vehicle hood'],
    transitInterpretation: 'Fast movement, conflict, tools, metal, machinery; avoid haste.'
  },
  {
    id: 'mercury',
    nameEn: 'Mercury',
    nameTa: 'புதன் (Budhan)',
    sanskritName: 'Budha',
    symbol: '☿',
    keywords: ['Communication', 'Documents', 'Information', 'Electronics', 'Calculation', 'Bags'],
    sixthSignInterpretation: 'Documents, information, calculation, communication and technical/problem-solving matters.',
    locationClue: 'Table, books, documents, laptop, phone, bag',
    locationKeywords: ['table', 'books', 'documents', 'laptop', 'phone', 'bag', 'study shelf', 'pen stand', 'files'],
    transitInterpretation: 'Documents, communication, phone, laptop, information and technical clues.'
  },
  {
    id: 'jupiter',
    nameEn: 'Jupiter',
    nameTa: 'குரு (Guru)',
    sanskritName: 'Guru / Brihaspati',
    symbol: '♃',
    keywords: ['Wisdom', 'Guidance', 'Support', 'Sacred places', 'Treasures', 'Elders'],
    sixthSignInterpretation: 'Support, guidance and knowledge may help in handling opposition, service or debt-related matters.',
    locationClue: 'Puja room, library, large cupboard, documents',
    locationKeywords: ['puja room', 'library', 'large cupboard', 'documents', 'gold box', 'sacred shelf', 'locker'],
    transitInterpretation: 'Support, guidance, expansion and helpful circumstances.'
  },
  {
    id: 'venus',
    nameEn: 'Venus',
    nameTa: 'சுக்கிரன் (Sukran)',
    sanskritName: 'Shukra',
    symbol: '♀',
    keywords: ['Beauty', 'Luxury', 'Relationships', 'Clothing', 'Ornaments', 'Comfort'],
    sixthSignInterpretation: 'Relationships, adjustment, comfort and expense-related matters may be highlighted.',
    locationClue: 'Bedroom, dressing table, clothes, jewellery',
    locationKeywords: ['bedroom', 'dressing table', 'clothes', 'jewellery', 'wardrobe', 'makeup kit', 'perfume shelf', 'bed'],
    transitInterpretation: 'Relationships, clothes, jewellery, comfort and bedroom-related clues.'
  },
  {
    id: 'saturn',
    nameEn: 'Saturn',
    nameTa: 'சனி (Sani)',
    sanskritName: 'Shani',
    symbol: '♄',
    keywords: ['Persistence', 'Delay', 'Old objects', 'Storage', 'Responsibility', 'Dark corners'],
    sixthSignInterpretation: 'Long-term responsibility, delay, persistence and old/pending issues.',
    locationClue: 'Old storage, lower area, dark/unused room',
    locationKeywords: ['old storage', 'lower area', 'dark room', 'unused room', 'dusty place', 'under furniture', 'store room'],
    transitInterpretation: 'Delay, old storage, unused locations and repeated searching.'
  },
  {
    id: 'rahu',
    nameEn: 'Rahu',
    nameTa: 'ராகு (Rahu)',
    sanskritName: 'Rahu (North Node)',
    symbol: '☊',
    keywords: ['Unusual', 'Electronics', 'Clutter', 'Confusion', 'Illusion', 'Foreign'],
    sixthSignInterpretation: 'Unexpected obstacles, confusion, unusual circumstances and technology-related clues.',
    locationClue: 'Electronics, clutter, unusual/hidden place',
    locationKeywords: ['electronics', 'clutter', 'unusual place', 'hidden place', 'wiring', 'tangled items', 'loft', 'obscure bag'],
    transitInterpretation: 'Unusual location, electronics, clutter and confusing circumstances.'
  },
  {
    id: 'ketu',
    nameEn: 'Ketu',
    nameTa: 'கேது (Ketu)',
    sanskritName: 'Ketu (South Node)',
    symbol: '☋',
    keywords: ['Detachment', 'Isolated', 'Corner', 'Forgotten', 'Subtle', 'Spiritual'],
    sixthSignInterpretation: 'Detachment, indirect/hidden issues and reduced interest in unnecessary conflict.',
    locationClue: 'Corner, isolated place, old/unused place',
    locationKeywords: ['corner', 'isolated place', 'old place', 'unused place', 'nook', 'crevice', 'back of drawer', 'prayer spot'],
    transitInterpretation: 'Corner, isolated, forgotten or neglected location.'
  }
];

export const getPlanetById = (id: string): PlanetInfo | undefined => {
  return PLANETS.find(p => p.id.toLowerCase() === id.toLowerCase() || p.nameEn.toLowerCase() === id.toLowerCase());
};
