import { HouseInfo } from '../types/astrology';

export const HOUSES: HouseInfo[] = [
  {
    number: 1,
    nameEn: '1st House (Lagna)',
    nameTa: '1-ஆம் பாவம் (லக்னம்)',
    sanskritName: 'Tanu Bhava',
    generalMeaning: 'Self, physical body, immediate presence, start of inquiry',
    transitMeaning: 'Personal state, immediate focus and current circumstances.',
    isKeyMissingHouse: false
  },
  {
    number: 2,
    nameEn: '2nd House (Dhana)',
    nameTa: '2-ஆம் பாவம் (தன பாவம்)',
    sanskritName: 'Dhana Bhava',
    generalMeaning: 'Wealth, family, speech, possessions, stored treasures',
    missingObjectRelevance: 'Object, possession, money, stored belongings.',
    transitMeaning: 'Money, possessions, family and stored belongings.',
    isKeyMissingHouse: true
  },
  {
    number: 3,
    nameEn: '3rd House (Sahaja)',
    nameTa: '3-ஆம் பாவம் (சகோதர பாவம்)',
    sanskritName: 'Sahaja Bhava',
    generalMeaning: 'Courage, communication, short trips, small belongings',
    transitMeaning: 'Movement, communication, small objects, bags, phones and documents.',
    isKeyMissingHouse: false
  },
  {
    number: 4,
    nameEn: '4th House (Sukha)',
    nameTa: '4-ஆம் பாவம் (சுக பாவம்)',
    sanskritName: 'Sukha / Matru Bhava',
    generalMeaning: 'Home, mother, vehicles, inner comfort, dwelling',
    missingObjectRelevance: 'Home, room, cupboard, furniture, interior location.',
    transitMeaning: 'Home, room, cupboard, furniture and interior location.',
    isKeyMissingHouse: true
  },
  {
    number: 5,
    nameEn: '5th House (Putra)',
    nameTa: '5-ஆம் பாவம் (புத்திர பாவம்)',
    sanskritName: 'Putra / Poorva Punya Bhava',
    generalMeaning: 'Intelligence, memory, past merit, recreation, children',
    transitMeaning: 'Memory, intelligence, children, creativity and recalling clues.',
    isKeyMissingHouse: false
  },
  {
    number: 6,
    nameEn: '6th House (Ari/Ripu)',
    nameTa: '6-ஆம் பாவம் (சத்ரு/ரோக பாவம்)',
    sanskritName: 'Shatru / Roga Bhava',
    generalMeaning: 'Obstacles, debts, disease, competitive effort, service',
    transitMeaning: 'Work, service, obstacles, competition and problem-solving.',
    isKeyMissingHouse: false
  },
  {
    number: 7,
    nameEn: '7th House (Kalatra)',
    nameTa: '7-ஆம் பாவம் (களத்திர பாவம்)',
    sanskritName: 'Kalatra / Jaya Bhava',
    generalMeaning: 'Partner, external people, opposite side, public interactions',
    missingObjectRelevance: 'Another person or external person; supplementary clue only.',
    transitMeaning: 'Another person, external person or opposite side.',
    isKeyMissingHouse: true
  },
  {
    number: 8,
    nameEn: '8th House (Ayur)',
    nameTa: '8-ஆம் பாவம் (ஆயுள்/அஷ்டம பாவம்)',
    sanskritName: 'Ayur / Randhra Bhava',
    generalMeaning: 'Secrets, transformation, deep hidden matters, obstacles',
    missingObjectRelevance: 'Hidden, covered, locked, secret or deep location.',
    transitMeaning: 'Hidden, covered, locked, secret or deep location.',
    isKeyMissingHouse: true
  },
  {
    number: 9,
    nameEn: '9th House (Bhagya)',
    nameTa: '9-ஆம் பாவம் (பாக்கிய பாவம்)',
    sanskritName: 'Bhagya / Dharma Bhava',
    generalMeaning: 'Fortune, father, higher knowledge, distant travel',
    transitMeaning: 'Travel, vehicle, distance and outside location.',
    isKeyMissingHouse: false
  },
  {
    number: 10,
    nameEn: '10th House (Karma)',
    nameTa: '10-ஆம் பாவம் (கர்ம பாவம்)',
    sanskritName: 'Karma Bhava',
    generalMeaning: 'Profession, fame, status, workplace, official actions',
    transitMeaning: 'Office, work, public or official location.',
    isKeyMissingHouse: false
  },
  {
    number: 11,
    nameEn: '11th House (Labha)',
    nameTa: '11-ஆம் பாவம் (லாப பாவம்)',
    sanskritName: 'Labha Bhava',
    generalMeaning: 'Gains, elder siblings, friends, social circles, aspirations',
    transitMeaning: 'Friends, network, group and shared spaces.',
    isKeyMissingHouse: false
  },
  {
    number: 12,
    nameEn: '12th House (Vyaya)',
    nameTa: '12-ஆம் பாவம் (விரய பாவம்)',
    sanskritName: 'Vyaya Bhava',
    generalMeaning: 'Expenses, losses, isolation, distant lands, subconscious',
    missingObjectRelevance: 'Outside, distant, inaccessible or forgotten location.',
    transitMeaning: 'Outside, distant, forgotten or inaccessible location.',
    isKeyMissingHouse: true
  }
];

export const getHouseByNumber = (num: number): HouseInfo => {
  const norm = ((num - 1) % 12 + 12) % 12 + 1;
  return HOUSES.find(h => h.number === norm) || HOUSES[0];
};

export const getKeyMissingHouses = (): HouseInfo[] => {
  return HOUSES.filter(h => h.isKeyMissingHouse);
};
