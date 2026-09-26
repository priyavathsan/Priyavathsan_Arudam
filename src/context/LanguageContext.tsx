import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Translations ────────────────────────────────────────────────────────────
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'Arudam / Prasna',
    'app.subtitle': 'Traditional Horary Astrology',
    'app.predicted_by': 'Predicted by',
    'header.tab.analysis': 'Analysis',
    'header.tab.reference': 'Reference',
    'header.tab.search': 'Search Clues',
    'header.load_example': 'Load Example',
    'header.print_analysis': 'Print Analysis',
    'header.print_reference': 'Print Reference',

    // Disclaimer
    'disclaimer.title': 'Traditional Reference Note:',
    'disclaimer.body':
      'Traditional Arudam / Prasna interpretation. This tool is for reference and learning. It does not provide scientifically validated predictions or guarantee the location/recovery of an object.',

    // Number Selector
    'number_selector.title': 'Select Arudam Number',
    'number_selector.subtitle': 'Choose a number from 1 to 12. Aruda Lagna and the 6th sign calculate automatically.',
    'number_selector.active': 'Active Selection:',

    // Aruda Results Card
    'aruda_card.selected_number': 'Selected Number',
    'aruda_card.prasna_root': 'Prasna Root Marker',
    'aruda_card.aruda_lagna': 'Aruda Lagna',
    'aruda_card.sixth_sign': '6th Sign (Shatru/Effort)',
    'aruda_card.primary_direction': 'Primary Direction',
    'aruda_card.sixth_direction': '6th Sign Direction:',
    'aruda_card.vedic_alignment': 'Vedic Cardinal Alignment',
    'aruda_card.ruler': 'Ruler:',
    'aruda_card.rasi_flow': 'Rasi Chakra Flow (12 Houses progression)',
    'aruda_card.lagna': 'Lagna',

    // Missing Object Card
    'missing.title': 'Missing Object Analysis',
    'missing.object_label': 'What are you looking for?',
    'missing.object_placeholder': 'e.g. Mobile phone, Keys, Wallet...',
    'missing.auto_analyze': 'Auto-Analyze',
    'missing.house_label': 'House of Loss',
    'missing.planet_label': 'Ruling Planet',
    'missing.sign_label': 'Corresponding Sign',
    'missing.clue': 'Traditional Clue:',

    // Gocharam Card
    'gocharam.title': 'Gocharam / Transit Analysis',
    'gocharam.transit_planet': 'Transit Planet',
    'gocharam.transit_house': 'Transit House',

    // House Analysis Card
    'house_analysis.title': 'House Analysis',
    'house_analysis.key_houses': 'Key Missing Object Houses (2, 4, 7, 8, 12)',

    // Nine Planets Card
    'nine_planets.title': '9 Planets — 6th Sign Results',

    // Sign Planet Location Clues
    'sign_planet.title': 'Sign & Planet Location Clues',
    'sign_planet.highlight_sign': 'Highlighted Sign:',
    'sign_planet.highlight_planet': 'Highlighted Planet:',

    // Combined Analysis Card
    'combined.title': 'Combined Interpretation',
    'combined.direction': 'Primary Direction',
    'combined.consistency': 'Clue Consistency',
    'combined.location_suggestions': 'Location Suggestions',
    'combined.full_interpretation': 'Full Interpretation',
    'combined.print': 'Print',

    // Reference Table
    'reference.title': 'Reference Library',
    'reference.print': 'Print Reference',

    // Footer
    'footer.system': 'Arudam / Prasna System',
    'footer.contact': 'Contact:',

    // Elements
    'element.fire': 'Fire',
    'element.water': 'Water',
    'element.air': 'Air',
    'element.earth': 'Earth',

    // Directions
    'direction.east': 'East',
    'direction.west': 'West',
    'direction.north': 'North',
    'direction.south': 'South',
  },

  ta: {
    // Header
    'app.title': 'ஆருடம் / பிரசன்னம்',
    'app.subtitle': 'பாரம்பரிய ஹோரா ஜோதிடம்',
    'app.predicted_by': 'கணிப்பவர்',
    'header.tab.analysis': 'பகுப்பாய்வு',
    'header.tab.reference': 'குறிப்பு',
    'header.tab.search': 'சுவடு தேடல்',
    'header.load_example': 'எடுத்துக்காட்டு ஏற்று',
    'header.print_analysis': 'பகுப்பாய்வு அச்சிடு',
    'header.print_reference': 'குறிப்பு அச்சிடு',

    // Disclaimer
    'disclaimer.title': 'பாரம்பரிய குறிப்பு:',
    'disclaimer.body':
      'பாரம்பரிய ஆருட / பிரசன்ன விளக்கம். இந்த கருவி கற்றல் மற்றும் குறிப்புக்காக மட்டுமே. இது விஞ்ஞான ரீதியில் சரிபார்க்கப்பட்ட கணிப்புகளை வழங்கவோ அல்லது பொருளை கண்டுபிடிப்பதை உறுதி செய்யவோ முடியாது.',

    // Number Selector
    'number_selector.title': 'ஆருட எண் தேர்வு',
    'number_selector.subtitle': '1 முதல் 12 வரை ஒரு எண்ணை தேர்ந்தெடுக்கவும். ஆருட லக்னம் மற்றும் 6-ஆம் ராசி தானாக கணக்கிடப்படும்.',
    'number_selector.active': 'தேர்ந்தெடுக்கப்பட்டது:',

    // Aruda Results Card
    'aruda_card.selected_number': 'தேர்ந்தெடுத்த எண்',
    'aruda_card.prasna_root': 'பிரசன்ன மூல குறி',
    'aruda_card.aruda_lagna': 'ஆருட லக்னம்',
    'aruda_card.sixth_sign': '6-ஆம் பாவம் (சத்ரு/முயற்சி)',
    'aruda_card.primary_direction': 'முதன்மை திசை',
    'aruda_card.sixth_direction': '6-ஆம் ராசி திசை:',
    'aruda_card.vedic_alignment': 'வேத கார்டினல் திசைகோள்',
    'aruda_card.ruler': 'அதிபதி:',
    'aruda_card.rasi_flow': 'ராசி சக்கர பாதை (12 பாவங்கள்)',
    'aruda_card.lagna': 'லக்னம்',

    // Missing Object Card
    'missing.title': 'தொலைந்த பொருள் பகுப்பாய்வு',
    'missing.object_label': 'நீங்கள் எதை தேடுகிறீர்கள்?',
    'missing.object_placeholder': 'எ.கா. மொபைல் போன், சாவி, பணப்பை...',
    'missing.auto_analyze': 'தானியங்கி பகுப்பாய்வு',
    'missing.house_label': 'தொலைவு பாவம்',
    'missing.planet_label': 'ஆட்சி கிரகம்',
    'missing.sign_label': 'தொடர்புடைய ராசி',
    'missing.clue': 'பாரம்பரிய சுவடு:',

    // Gocharam Card
    'gocharam.title': 'கோசாரம் / கிரக பரிவர்த்தனை',
    'gocharam.transit_planet': 'பரிவர்த்தனை கிரகம்',
    'gocharam.transit_house': 'பரிவர்த்தனை பாவம்',

    // House Analysis Card
    'house_analysis.title': 'பாவ பகுப்பாய்வு',
    'house_analysis.key_houses': 'முக்கிய தொலைவு பாவங்கள் (2, 4, 7, 8, 12)',

    // Nine Planets Card
    'nine_planets.title': '9 கிரகங்கள் — 6-ஆம் ராசி பலன்கள்',

    // Sign Planet Location Clues
    'sign_planet.title': 'ராசி & கிரக இட சுவடுகள்',
    'sign_planet.highlight_sign': 'குறிப்பிட்ட ராசி:',
    'sign_planet.highlight_planet': 'குறிப்பிட்ட கிரகம்:',

    // Combined Analysis Card
    'combined.title': 'ஒருங்கிணைந்த விளக்கம்',
    'combined.direction': 'முதன்மை திசை',
    'combined.consistency': 'சுவடு ஒத்திசைவு',
    'combined.location_suggestions': 'இட பரிந்துரைகள்',
    'combined.full_interpretation': 'முழு விளக்கம்',
    'combined.print': 'அச்சிடு',

    // Reference Table
    'reference.title': 'குறிப்பு நூலகம்',
    'reference.print': 'குறிப்பு அச்சிடு',

    // Footer
    'footer.system': 'ஆருடம் / பிரசன்ன அமைப்பு',
    'footer.contact': 'தொடர்பு:',

    // Elements
    'element.fire': 'அக்னி',
    'element.water': 'ஜலம்',
    'element.air': 'வாயு',
    'element.earth': 'பூமி',

    // Directions
    'direction.east': 'கிழக்கு',
    'direction.west': 'மேற்கு',
    'direction.north': 'வடக்கு',
    'direction.south': 'தெற்கு',
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const toggleLanguage = () =>
    setLanguageState(prev => (prev === 'en' ? 'ta' : 'en'));

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const t = (key: string): string =>
    translations[language][key] ?? translations['en'][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
