// Kochara / Transit Rules for Arudam Prasna Analysis
// Evaluates how transit planets occupying or influencing the 6th Rasi or Aruda Lagna shape the outcome

export interface TransitInfluenceRule {
  id: string;
  planetId: string;
  houseFromAruda: number; // e.g. 1 (Aruda), 6 (6th Rasi), etc.
  strength: 'strong' | 'moderate' | 'possible' | 'weak';
  interpretationEn: string;
  interpretationTa: string;
  questionAffinity: string[];
}

export const TRANSIT_INFLUENCE_RULES: TransitInfluenceRule[] = [
  // Planets in 6th from Aruda
  {
    id: 'TR-6-SUN',
    planetId: 'sun',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Sun transiting the 6th from Aruda overcomes opposition through authority, administration, or official intervention.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் சூரியன் கோச்சாரத்தில் இருப்பது அதிகாரம், அரசு அல்லது மேலதிகாரிகள் மூலம் காரிய வெற்றிக்கு வழிவகுக்கும்.',
    questionAffinity: ['job', 'legal', 'finance']
  },
  {
    id: 'TR-6-MOON',
    planetId: 'moon',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Moon transiting the 6th from Aruda brings immediate fluctuations, fast-moving leads, or emotional resolution within days.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் சந்திரன் கோச்சாரத்தில் இருப்பது சில தினங்களுக்குள் விரைவான தகவல்கள் அல்லது உணர்வுபூர்வ தீர்வை குறிக்கும்.',
    questionAffinity: ['lost_object', 'missing_person', 'general']
  },
  {
    id: 'TR-6-MARS',
    planetId: 'mars',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Mars transiting the 6th from Aruda indicates aggressive search, sudden confrontation, or overcoming obstacles through courage.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் செவ்வாய் இருப்பது தீவிர முயற்சி, உடனடி நடவடிக்கை அல்லது தைரியமான அணுகுமுறையால் தடைகளை வெல்வதை குறிக்கும்.',
    questionAffinity: ['lost_object', 'legal', 'job']
  },
  {
    id: 'TR-6-MERCURY',
    planetId: 'mercury',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Mercury transiting the 6th from Aruda points toward written records, phone calls, digital tracking, and analytical resolution.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் புதன் இருப்பது ஆவணங்கள், தொலைபேசி தகவல், கணக்கீடுகள் அல்லது செய்தி மூலமாக காரியம் எளிதில் முடிவதை குறிக்கும்.',
    questionAffinity: ['lost_object', 'job', 'finance']
  },
  {
    id: 'TR-6-JUPITER',
    planetId: 'jupiter',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Jupiter transiting the 6th from Aruda brings noble assistance, wise elders, institutional support, and auspicious settlement.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் குரு இருப்பது பெரியவர்களின் வழிகாட்டல், தெய்வ அனுகூலம் மற்றும் சட்ட ரீதியான சுப சமரசத்தை சுட்டுகிறது.',
    questionAffinity: ['marriage', 'finance', 'health', 'legal']
  },
  {
    id: 'TR-6-VENUS',
    planetId: 'venus',
    houseFromAruda: 6,
    strength: 'moderate',
    interpretationEn: 'Venus transiting the 6th from Aruda indicates resolution through friendly compromise, female assistance, or domestic expenses.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் சுக்கிரன் இருப்பது பெண்வழி உதவி, சமரச பேச்சுவார்த்தை அல்லது சுப விரயங்கள் மூலம் அமைதியை சுட்டுகிறது.',
    questionAffinity: ['marriage', 'finance', 'lost_object']
  },
  {
    id: 'TR-6-SATURN',
    planetId: 'saturn',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Saturn transiting the 6th from Aruda suggests long persistence is required; obstacles will dissolve slowly through disciplined labor.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் சனி இருப்பது காலதாமதத்திற்கு பின்பே காரிய சித்தி கிடைக்கும்; தொடர் பொறுமையும் உழைப்பும் தேவை.',
    questionAffinity: ['job', 'legal', 'lost_object', 'health']
  },
  {
    id: 'TR-6-RAHU',
    planetId: 'rahu',
    houseFromAruda: 6,
    strength: 'strong',
    interpretationEn: 'Rahu transiting the 6th from Aruda crushes enemies through unconventional means, digital technology, or unexpected foreign developments.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் ராகு இருப்பது எதிர்பாராத விசித்திர நிகழ்வுகள், நவீன தொழில்நுட்பம் அல்லது மறைமுக வழிகள் மூலம் வெற்றியை சுட்டுகிறது.',
    questionAffinity: ['job', 'travel', 'lost_object']
  },
  {
    id: 'TR-6-KETU',
    planetId: 'ketu',
    houseFromAruda: 6,
    strength: 'moderate',
    interpretationEn: 'Ketu transiting the 6th from Aruda signifies silent resolution, spiritual remedies, detachment from disputes, or isolated recovery.',
    interpretationTa: 'ஆருடத்திற்கு 6-ல் கேது இருப்பது அமைதியான தீர்வு, ஆன்மீக பரிகாரம் அல்லது விரக்தி நீங்கி மன அமைதி அடைவதை குறிக்கும்.',
    questionAffinity: ['health', 'missing_person', 'general']
  }
];

export const getTransitRuleForPlanetInHouse = (planetId: string, houseFromAruda: number): TransitInfluenceRule | undefined => {
  return TRANSIT_INFLUENCE_RULES.find(r => r.planetId === planetId && r.houseFromAruda === houseFromAruda);
};
