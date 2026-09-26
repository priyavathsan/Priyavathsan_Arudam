export interface MoonClue {
  house: number;
  clue: string;
  advice: string;
}

export const MOON_IMMEDIATE_CLUES: Record<number, MoonClue> = {
  4: {
    house: 4,
    clue: 'Check inside the home.',
    advice: 'Moon in the 4th house brings focus to domestic comfort, private bedrooms, cupboards, and familiar domestic resting spots.'
  },
  8: {
    house: 8,
    clue: 'Check hidden/covered areas.',
    advice: 'Moon in the 8th house suggests the item is out of plain sight, obscured by other items, enclosed in a dark compartment, or behind locks.'
  },
  9: {
    house: 9,
    clue: 'Check travel/vehicle/outside locations.',
    advice: 'Moon in the 9th house indicates transit, vehicular areas, bags used for journeys, open verandahs, or places visited outside the primary room.'
  },
  12: {
    house: 12,
    clue: 'Check outside, distant or forgotten locations.',
    advice: 'Moon in the 12th house points toward forgotten spaces, left behind in transit, distant rooms, terrace/balcony, or discarded storage.'
  }
};

export interface LongTermTransitInfo {
  planet: string;
  nameTa: string;
  symbol: string;
  theme: string;
  backgroundClue: string;
}

export const LONG_TERM_TRANSIT_BACKGROUND: LongTermTransitInfo[] = [
  {
    planet: 'Saturn',
    nameTa: 'சனி',
    symbol: '♄',
    theme: 'Delay, persistence & old storage',
    backgroundClue: 'Delay, old objects, storage, repeated effort.'
  },
  {
    planet: 'Jupiter',
    nameTa: 'குரு',
    symbol: '♃',
    theme: 'Support & recovery circumstances',
    backgroundClue: 'Support, guidance, recovery/supportive circumstances.'
  },
  {
    planet: 'Rahu',
    nameTa: 'ராகு',
    symbol: '☊',
    theme: 'Unusual paths & electronics',
    backgroundClue: 'Unusual route, technology, confusion.'
  },
  {
    planet: 'Ketu',
    nameTa: 'கேது',
    symbol: '☋',
    theme: 'Detachment & isolated corners',
    backgroundClue: 'Detachment, forgotten/corner/isolated location.'
  }
];

export const getMoonImmediateClue = (transitHouse: number): string | undefined => {
  return MOON_IMMEDIATE_CLUES[transitHouse]?.clue;
};
