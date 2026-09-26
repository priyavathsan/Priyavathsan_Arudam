// Central Machine-Readable Arudam Prasna Rule Repository
// Based on traditional Tamil Prasna Shastra principles

export type PrasnaCategory =
  | 'lost_object'
  | 'missing_person'
  | 'sakunam'
  | 'marriage'
  | 'finance'
  | 'job'
  | 'travel'
  | 'health'
  | 'legal'
  | 'general';

export type RuleStrength = 'strong' | 'moderate' | 'possible' | 'weak';

export interface RuleCondition {
  arudaRasiId?: number | number[];
  sixthRasiId?: number | number[];
  sixthLordId?: string | string[];
  element?: string; // Fire, Earth, Air, Water
  direction?: string; // East, South, West, North
  transitPlanetInSixth?: string | string[];
  transitPlanetInAruda?: string | string[];
}

export interface ArudamRule {
  id: string;
  category: PrasnaCategory;
  condition: RuleCondition;
  strength: RuleStrength;
  priority: number; // For internal ranking, never shown as a fake score
  titleTa: string;
  titleEn: string;
  predictionTa: string;
  predictionEn: string;
  explanationTa: string;
  explanationEn: string;
}

export const CENTRAL_ARUDAM_RULES: ArudamRule[] = [
  // 1. Lost Object Rules
  {
    id: 'AR-OBJ-EARTH',
    category: 'lost_object',
    condition: { sixthRasiId: [2, 6, 10] }, // Earth signs: Taurus, Virgo, Capricorn
    strength: 'strong',
    priority: 95,
    titleTa: 'நில ராசி - பாதுகாப்பான அல்லது தரை மட்ட இடம்',
    titleEn: 'Earth Sign 6th - Stable / Floor-level Location',
    predictionTa: 'பொருள் நகராமல் பாதுகாப்பான இடத்தில் தரைமட்டத்திலோ அல்லது அலமாரி, பெட்டியிலோ வைக்கப்பட்டுள்ளது. நிச்சயம் மீட்கப்பட சாத்தியமுண்டு.',
    predictionEn: 'The object is safely resting at a lower or floor level, inside a cupboard, drawer, or heavy container. High probability of retrieval.',
    explanationTa: '6-ஆம் ராசி நில தத்துவ ராசியாக (ரிஷபம்/கன்னி/மகரம்) அமைவதால் பொருள் இடம் மாறாமல் தரையோடு அல்லது திடமான பொருட்களுக்குள் இருக்கும்.',
    explanationEn: 'Because the 6th sign is of the Earth element (Taurus/Virgo/Capricorn), the object remains stationary, grounded, or stored inside structured furniture.'
  },
  {
    id: 'AR-OBJ-WATER',
    category: 'lost_object',
    condition: { sixthRasiId: [4, 8, 12] }, // Water signs: Cancer, Scorpio, Pisces
    strength: 'strong',
    priority: 90,
    titleTa: 'நீர் ராசி - ஈரப்பதம், மறைவிடம் அல்லது குளியலறை பகுதி',
    titleEn: 'Water Sign 6th - Damp, Secret, or Drainage Area',
    predictionTa: 'பொருள் நீர்நிலைப் பகுதி, சமையலறை, வாஷ்பேசின், குளியலறை அல்லது ஆழ்ந்த மறைவான இடத்தில் சிக்கியிருக்கலாம்.',
    predictionEn: 'The object is near water sources, kitchen plumbing, washbasin, bathroom, or submerged beneath soft/damp items.',
    explanationTa: '6-ஆம் ராசி நீர் ராசியாக (கடகம்/விருச்சிகம்/மீனம்) அமைவதால் ஈரம், திரவம் அல்லது கீழ்மட்ட மறைவிடங்களை சுட்டுகிறது.',
    explanationEn: 'Because the 6th sign is of the Water element (Cancer/Scorpio/Pisces), dampness, laundry, or sunken concealed spots are indicated.'
  },
  {
    id: 'AR-OBJ-AIR',
    category: 'lost_object',
    condition: { sixthRasiId: [3, 7, 11] }, // Air signs: Gemini, Libra, Aquarius
    strength: 'moderate',
    priority: 85,
    titleTa: 'காற்று ராசி - உயரமான இடம், புத்தகப்பை அல்லது மின்னணு பொருட்கள் அருகில்',
    titleEn: 'Air Sign 6th - Elevated Place, Bookshelf, or Electronics Area',
    predictionTa: 'பொருள் மேஜை, வாசிப்பு அறை, ஆவணங்கள், பைகள், அல்லது காற்றோட்டமான மேல்மட்ட அலமாரிகளில் உள்ளது.',
    predictionEn: 'The object is on a table, inside a bag, amidst documents/books, or placed near electronic wiring or ventilation.',
    explanationTa: '6-ஆம் ராசி காற்று ராசியாக (மிதுனம்/துலாம்/கும்பம்) அமைவதால் சஞ்சாரத்தன்மை, மேல்மட்டம் அல்லது மின்னணு உபகரணங்களை சுட்டுகிறது.',
    explanationEn: 'Because the 6th sign is of the Air element (Gemini/Libra/Aquarius), mobility, desks, pouches, or technological areas are indicated.'
  },
  {
    id: 'AR-OBJ-FIRE',
    category: 'lost_object',
    condition: { sixthRasiId: [1, 5, 9] }, // Fire signs: Aries, Leo, Sagittarius
    strength: 'strong',
    priority: 92,
    titleTa: 'நெருப்பு ராசி - பிரதான வெளிச்சமான இடம், வாசற்படி அல்லது சமையல் கூடம்',
    titleEn: 'Fire Sign 6th - Bright, Entrance, or Kitchen/Metallic Area',
    predictionTa: 'பொருள் வெளிச்சம் படும் இடம், பிரதான வாசல், சமையலறை அடுப்பு பகுதி அல்லது மின்சார/உலோக உபகரணங்களுக்கு அருகில் காணப்படுகிறது.',
    predictionEn: 'The object is in a prominent well-lit area, near the entrance door, cooking zone, or close to metal/electrical appliances.',
    explanationTa: '6-ஆம் ராசி நெருப்பு ராசியாக (மேஷம்/சிம்மம்/தனுசு) அமைவதால் வெளிச்சம், உஷ்ணம் அல்லது பிரதான இடத்தை சுட்டுகிறது.',
    explanationEn: 'Because the 6th sign is of the Fire element (Aries/Leo/Sagittarius), prominent visibility, entrance, or heating points are indicated.'
  },

  // 2. Missing Person Rules
  {
    id: 'AR-PRS-CHARA',
    category: 'missing_person',
    condition: { sixthRasiId: [1, 4, 7, 10] }, // Chara (Movable) signs
    strength: 'strong',
    priority: 88,
    titleTa: 'சர ராசி - நபர் தொடர்ந்து பயணத்தில் உள்ளார்',
    titleEn: 'Movable Sign 6th - Person in Continuous Motion / Transit',
    predictionTa: 'காணாமல் போன நபர் ஓரிடத்தில் நிலையாக இல்லாமல் தொடர்ந்து பயணம் செய்து கொண்டிருக்கிறார். தூரத்து இடங்களுக்கு சென்றிருக்க வாய்ப்புள்ளது.',
    predictionEn: 'The missing person is in continuous transit, moving between different locations or traveling toward a distant destination.',
    explanationTa: '6-ஆம் ராசி சர ராசியாக அமைவதால் இயக்கம், பிரயாணம் மற்றும் தொடர் மாற்றத்தை குறிக்கிறது.',
    explanationEn: 'Movable signs indicate rapid locomotion, travel by vehicle, and changes of resting place.'
  },
  {
    id: 'AR-PRS-STHIRA',
    category: 'missing_person',
    condition: { sixthRasiId: [2, 5, 8, 11] }, // Sthira (Fixed) signs
    strength: 'strong',
    priority: 90,
    titleTa: 'ஸ்திர ராசி - நபர் பாதுகாப்பாக ஓரிடத்தில் தங்கியுள்ளார்',
    titleEn: 'Fixed Sign 6th - Person Stationed Safely in One Place',
    predictionTa: 'நபர் தொலைதூரத்திற்கு செல்லாமல் தெரிந்தவர்கள் அல்லது உறவினர்களின் இடத்தில் நிலையாக தங்கியுள்ளார். விரைவில் செய்தி கிடைக்கும்.',
    predictionEn: 'The missing person has stopped moving and is staying in one fixed, familiar residence or with an acquaintance. Contact is expected.',
    explanationTa: '6-ஆம் ராசி ஸ்திர ராசியாக அமைவதால் நபர் ஓரிடத்தை விட்டு மேலும் நகரவில்லை என்பதை தெளிவுபடுத்துகிறது.',
    explanationEn: 'Fixed signs denote immobility, shelter within a stable building, and absence of further wandering.'
  },
  {
    id: 'AR-PRS-UBHAYA',
    category: 'missing_person',
    condition: { sixthRasiId: [3, 6, 9, 12] }, // Ubhaya (Dual) signs
    strength: 'moderate',
    priority: 82,
    titleTa: 'உபய ராசி - நபர் ஊசலாட்ட மனநிலையில் உள்ளார்; திரும்புதல் சாத்தியம்',
    titleEn: 'Dual Sign 6th - Person Hesitant; Return Expected',
    predictionTa: 'நபர் தற்போதைக்கு அருகில் உள்ள பொது இடத்திலோ அல்லது நண்பர்கள் வட்டத்திலோ உள்ளார்; சுயமாகவே திரும்பி வர ஆலோசித்து வருகிறார்.',
    predictionEn: 'The person is in a dual mindset, staying near a town center or friends, and is contemplating a voluntary return.',
    explanationTa: 'உபய ராசி இரட்டைத் தன்மையை காட்டுவதால் அலைச்சல் முடிந்து திரும்பி வருவதற்கான அறிகுறிகள் உள்ளன.',
    explanationEn: 'Dual signs represent ambivalence and a high probability of turnaround or third-party mediation.'
  },

  // 3. Sakunam / Omen Rules
  {
    id: 'AR-SAK-BENEFIC',
    category: 'sakunam',
    condition: { sixthLordId: ['jupiter', 'venus', 'mercury'] },
    strength: 'strong',
    priority: 86,
    titleTa: 'சுபகிரக ஆதிக்கம் - சுப சகுனம் மற்றும் மங்களகரமான முடிவு',
    titleEn: 'Benefic Dominance - Favorable Omen and Auspicious Outcome',
    predictionTa: 'நிகழ்ந்த சகுனம் அல்லது அறிகுறி நல்லதொரு காரிய மாற்றத்தையே காட்டுகிறது. துவக்கத்தில் தடையிருந்தாலும் முடிவு மங்களகரமாக அமையும்.',
    predictionEn: 'The omen or observed event carries positive spiritual significance. Initial obstacles will yield an auspicious resolution.',
    explanationTa: '6-ஆம் அதிபதி சுபகிரகமாக (குரு/சுக்கிரன்/புதன்) இருப்பதால் அசுப சகுனத்தின் தாக்கம் நீங்கி காரிய சித்தி உண்டாகும்.',
    explanationEn: 'Benefic rulership over the 6th sign converts adversarial omens into protective outcomes.'
  },
  {
    id: 'AR-SAK-MALEFIC',
    category: 'sakunam',
    condition: { sixthLordId: ['saturn', 'mars', 'rahu', 'ketu'] },
    strength: 'moderate',
    priority: 84,
    titleTa: 'அசுபகிரக ஆதிக்கம் - எச்சரிக்கை மற்றும் விழிப்புணர்வு தேவை',
    titleEn: 'Malefic Dominance - Caution and Vigilance Advised',
    predictionTa: 'சகுனத்தின் வாயிலாக முன்னெச்சரிக்கை விடுக்கப்பட்டுள்ளது. அவசர முடிவுகளையும் வாக்குவாதங்களையும் தவிர்த்து இறைவழிபாடு செய்வது நலம்.',
    predictionEn: 'The omen serves as a protective warning. Avoid impulsive agreements, disputes, or hazardous travel until planetary calm returns.',
    explanationTa: '6-ஆம் அதிபதி பாப கிரகமாக அமைவதால் தற்காலிக விழிப்புணர்வும் சாந்தியும் அவசியமாகிறது.',
    explanationEn: 'Malefic connection alerts the querent against haste and advises prayer or calm deliberation.'
  },

  // 4. Job & Career
  {
    id: 'AR-JOB-SATURN',
    category: 'job',
    condition: { sixthLordId: ['saturn'] },
    strength: 'strong',
    priority: 91,
    titleTa: 'சனி ஆதிக்கம் - கடின உழைப்பிற்கு பிறகே உத்தியோக உயர்வு',
    titleEn: 'Saturn Rulership - Career Advancement Through Hard Work & Patience',
    predictionTa: 'வேலை அல்லது தொழிலில் தற்காலிக பணிச்சுமை காணப்படும். பொறுமையுடன் கடமையை ஆற்றினால் நீண்டகால நிலைத்தன்மை மற்றும் வெற்றி கிட்டும்.',
    predictionEn: 'Heavy workplace responsibilities or organizational delays are present. Persistence will result in long-term security.',
    explanationTa: 'உழைப்பின் காரகரான சனியின் ஆதிக்கத்தில் 6-ஆம் பாவம் வருவதால் நேர்மையான உழைப்பிற்கு கைமேல் பலன் உண்டு.',
    explanationEn: 'Saturn in the 6th signifies service, endurance, and delayed but permanent professional stability.'
  },
  {
    id: 'AR-JOB-SUN-JUP',
    category: 'job',
    condition: { sixthLordId: ['sun', 'jupiter'] },
    strength: 'strong',
    priority: 93,
    titleTa: 'சூரியன் / குரு ஆதிக்கம் - அரசு அல்லது உயர் பதவி அனுகூலம்',
    titleEn: 'Sun / Jupiter Rulership - Executive / Institutional Favor',
    predictionTa: 'மேலதிகாரிகளின் ஆதரவு, அரசு உத்தியோகம் அல்லது நிர்வாக பொறுப்புகள் சாதகமாக அமையும். கௌரவமான தீர்வு ஏற்படும்.',
    predictionEn: 'Favor from superiors, institutional sanction, or official promotion is strongly favored.',
    explanationTa: 'ஆளும் கிரகங்களான சூரியன் அல்லது குரு 6-ஆம் ராசிக்கு அதிபதியாவதால் அந்தஸ்தும் காரிய வெற்றியும் கைகூடும்.',
    explanationEn: 'Solar/Jupiterian rulership promises administrative backing and public validation.'
  },

  // 5. Money & Finance
  {
    id: 'AR-FIN-VENUS-MERC',
    category: 'finance',
    condition: { sixthLordId: ['venus', 'mercury'] },
    strength: 'strong',
    priority: 90,
    titleTa: 'புதன் / சுக்கிரன் ஆதிக்கம் - வரவு செலவு சீராகும், கொடுக்கல் வாங்கல் வெற்றி',
    titleEn: 'Mercury / Venus Rulership - Financial Liquidity and Commercial Success',
    predictionTa: 'பொருளாதார நெருக்கடிகள் தணியும்; வரவேண்டிய பாக்கிகள் வசூலாக வழியுண்டு. வியாபார கொடுக்கல் வாங்கலில் லாபம் கிட்டும்.',
    predictionEn: 'Financial strain will ease. Outstanding receivables or commercial settlements will materialize constructively.',
    explanationTa: 'தனகாரக மற்றும் வணிக கிரகங்களின் தொடர்பால் பணவரவு மற்றும் கொடுக்கல் வாங்கலில் நன்மை பயக்கும்.',
    explanationEn: 'Commercial benefic lordship facilitates debt clearance and monetary liquidity.'
  },

  // 6. Marriage & Relationships
  {
    id: 'AR-MAR-VENUS',
    category: 'marriage',
    condition: { sixthLordId: ['venus', 'jupiter'] },
    strength: 'moderate',
    priority: 87,
    titleTa: 'சுக்கிரன் / குரு தொடர்பு - சுப பேச்சுவார்த்தை மற்றும் குடும்ப இணக்கம்',
    titleEn: 'Venus / Jupiter Link - Auspicious Negotiations & Familial Harmony',
    predictionTa: 'திருமணம் அல்லது குடும்ப உறவு தொடர்பான பேச்சுவார்த்தைகளில் பெரியவர்கள் மத்தியஸ்தம் செய்து சுப முடிவை எட்டுவார்கள்.',
    predictionEn: 'Matrimonial or domestic discussions will benefit from wise elder mediation leading to harmonious agreement.',
    explanationTa: 'களத்திர காரக சுக்கிரன் மற்றும் மங்கள காரக குருவின் தொடர்பால் சுப காரிய தடைகள் விலகும்.',
    explanationEn: 'Jupiter and Venus govern matrimonial sanctity and domestic reconciliation.'
  },

  // 7. Health & Wellness
  {
    id: 'AR-HLT-MARS-SAT',
    category: 'health',
    condition: { sixthLordId: ['mars', 'saturn'] },
    strength: 'moderate',
    priority: 85,
    titleTa: 'செவ்வாய் / சனி ஆதிக்கம் - உஷ்ண அல்லது வாத சம்பந்த விழிப்புணர்வு',
    titleEn: 'Mars / Saturn Link - Diet, Rest & Physical Health Attention',
    predictionTa: 'உடல் உபாதைகள் அல்லது சோர்வு நீங்க முறையான மருத்துவ ஆலோசனையும் ஓய்வும் தேவை. பெரிய ஆபத்து ஏதுமில்லை, குணமடைதல் நிச்சயம்.',
    predictionEn: 'Fatigue, muscular strain, or heat-related discomfort requires proper rest and medication. Steady recovery is indicated.',
    explanationTa: '6-ஆம் இடம் நோய் ஸ்தானமாக அமைவதால் முறையான பராமரிப்பும் உணவு முறையும் நலம் தரும்.',
    explanationEn: 'The 6th house governs recuperation, requiring diligent diet and routine discipline.'
  },

  // 8. Legal & Disputes
  {
    id: 'AR-LEG-MARS-JUP',
    category: 'legal',
    condition: { sixthLordId: ['mars', 'jupiter'] },
    strength: 'strong',
    priority: 89,
    titleTa: 'செவ்வாய் / குரு - நியாயமான தீர்ப்பு மற்றும் சமரசம்',
    titleEn: 'Mars / Jupiter - Legal Settlement and Equitable Resolution',
    predictionTa: 'நீதிமன்ற வழக்கு அல்லது தகராறுகளில் சமரச தீர்வு அல்லது சாதகமான தீர்ப்பு கிடைக்க வாய்ப்புள்ளது. நேர்மையான வாதங்கள் பலன் தரும்.',
    predictionEn: 'Legal disputes or formal contentions are poised for equitable compromise or favorable arbitration.',
    explanationTa: 'தர்ம காரகரான குருவும் வழக்குகளின் காரகரான செவ்வாயும் இணைவதால் நியாயம் வெல்லும்.',
    explanationEn: 'Combined martial assertiveness and ethical jurisprudence yields victory.'
  },

  // 9. Travel
  {
    id: 'AR-TRV-MOON-MERC',
    category: 'travel',
    condition: { sixthLordId: ['moon', 'mercury'] },
    strength: 'strong',
    priority: 88,
    titleTa: 'சந்திரன் / புதன் - சுப பிரயாணம் மற்றும் காரிய சித்தி',
    titleEn: 'Moon / Mercury - Short Auspicious Journey with Successful Purpose',
    predictionTa: 'திட்டமிட்ட பயணம் அல்லது இடமாற்றம் நல்ல அனுபவத்தையும் காரிய வெற்றியையும் தரும். தகவல்தொடர்புகள் சாதகமாக அமையும்.',
    predictionEn: 'The planned travel or relocation will proceed smoothly, yielding constructive commercial or personal gains.',
    explanationTa: 'சஞ்சார கிரகங்களான சந்திரன் மற்றும் புதன் குறுகிய கால பயணங்களின் வெற்றியை சுட்டுகின்றன.',
    explanationEn: 'Luminaries of movement confirm peaceful and purposeful transit.'
  },

  // 10. General Prasna
  {
    id: 'AR-GEN-UNIVERSAL',
    category: 'general',
    condition: {},
    strength: 'moderate',
    priority: 50,
    titleTa: 'பொது ஆருட பலன் - ஆருட லக்னம் மற்றும் 6-ஆம் ராசி அடிப்படை',
    titleEn: 'General Prasna Principle - Aruda Lagna and 6th House Axis',
    predictionTa: 'மனதில் உள்ள காரியத்திற்கு ஆருட லக்னமும் 6-ஆம் இடமும் நற்பலன்களை சுட்டுகின்றன. தடைகள் ஒவ்வொன்றாக நீங்கி வெற்றி உண்டாகும்.',
    predictionEn: 'The Aruda Lagna and 6th house axis indicates progressive resolution of worries through conscious effort.',
    explanationTa: 'ஆருட கணிதத்தின் 6-ஆம் இடம் தடைகளை போக்கும் சத்ரு/ஜெய ஸ்தானமாக விளங்குவதால் வெற்றி சாத்தியமாகிறது.',
    explanationEn: 'The 6th house from Aruda represents the house of overcoming impediments (Jaya Bhava).'
  }
];

export const addRule = (rule: ArudamRule) => {
  CENTRAL_ARUDAM_RULES.push(rule);
};
