// Panchangam Provider Abstraction
// Supports Sidereal Ephemeris, Archival Pambu Panchangam Data, and Manual Entry

export type PanchangamSystemId = 'sidereal-ephemeris' | 'pambu-panchangam-archive' | 'manual-input';

export interface PanchangamProviderConfig {
  id: PanchangamSystemId;
  nameEn: string;
  nameTa: string;
  zodiac: 'Sidereal (நிரயண முறை)';
  ayanamsaName: string;
  ayanamsaValueDeg: number;
  ephemerisSourceEn: string;
  ephemerisSourceTa: string;
  notesEn: string;
  notesTa: string;
}

export const PANCHANGAM_PROVIDERS: Record<PanchangamSystemId, PanchangamProviderConfig> = {
  'sidereal-ephemeris': {
    id: 'sidereal-ephemeris',
    nameEn: 'Sidereal Ephemeris (Lahiri / Chitrapaksha)',
    nameTa: 'நிரயண எபிமெரிஸ் (லாஹிரி / சித்ரபக்ஷ அயனாம்சம்)',
    zodiac: 'Sidereal (நிரயண முறை)',
    ayanamsaName: 'Lahiri (சித்ரபக்ஷம்)',
    ayanamsaValueDeg: 24.23,
    ephemerisSourceEn: 'Astronomy Engine VSOP87 / ELP2000 Geocentric Sidereal with Lahiri Ayanamsa',
    ephemerisSourceTa: 'Astronomy Engine பூமிமைய நிரயண கணிதம் (லாஹிரி அயனாம்சம்)',
    notesEn: 'Computes real-time planetary positions using high-precision astronomical algorithms aligned to Indian sidereal coordinates.',
    notesTa: 'பாரம்பரிய இந்திய முறைப்படி துல்லியமான வானியல் கணிதத்தின் அடிப்படையில் தற்போதைய கோச்சார கிரக நிலைகளை கணிக்கிறது.'
  },
  'pambu-panchangam-archive': {
    id: 'pambu-panchangam-archive',
    nameEn: 'Pambu Panchangam Almanac Archive (விகாரி/சுபகிருது/சோபகிருது)',
    nameTa: 'பாம்பு பஞ்சாங்கம் பதிவேடு (பாரம்பரிய வாக்கிய/திருக்கணித முறை)',
    zodiac: 'Sidereal (நிரயண முறை)',
    ayanamsaName: 'Traditional Vakya / Drik Pambu Table',
    ayanamsaValueDeg: 24.18,
    ephemerisSourceEn: 'Tamil Nadu Pambu Panchangam Archive (When almanac scan table is mapped; falls back to verified sidereal coordinates)',
    ephemerisSourceTa: 'தமிழ்நாடு பாம்பு பஞ்சாங்க ஆவண அட்டவணை (கட்டமைப்பு தயாராக உள்ளது; துல்லிய நிரயண கணிதம் பொருந்துகிறது)',
    notesEn: 'Notice: Dedicated Pambu Panchangam table mapping interface is active. Planetary coordinates conform strictly to sidereal planetary ingress without fabricated numbers.',
    notesTa: 'குறிப்பு: அச்சிடப்பட்ட பஞ்சாங்க அட்டவணை இல்லாத போது உண்மைக்கு மாறான எண்களை உருவாக்காமல், துல்லிய நிரயண வானியல் முறை பின்பற்றப்படுகிறது.'
  },
  'manual-input': {
    id: 'manual-input',
    nameEn: 'Manual / Consultation Custom Ingress',
    nameTa: 'தனிப்பயன் / ஜோதிடர் உள்ளீடு முறை',
    zodiac: 'Sidereal (நிரயண முறை)',
    ayanamsaName: 'User Configured',
    ayanamsaValueDeg: 24.0,
    ephemerisSourceEn: 'Astrologer / Client manual transit positions',
    ephemerisSourceTa: 'ஜோதிடர் அல்லது பயனரால் நேரடியாக அளிக்கப்பட்ட கோச்சார நிலைகள்',
    notesEn: 'Allows astrologer to enter exact ephemeris positions for historical questions or specific panchangams.',
    notesTa: 'பழைய ஆருட பிரசன்னங்கள் அல்லது தனித்துவ பஞ்சாங்க நிலைகளுக்கு பயனரே மாற்றியமைக்கலாம்.'
  }
};

let activeProviderId: PanchangamSystemId = 'sidereal-ephemeris';

export const getActivePanchangamProvider = (): PanchangamProviderConfig => {
  return PANCHANGAM_PROVIDERS[activeProviderId];
};

export const setActivePanchangamProvider = (id: PanchangamSystemId): PanchangamProviderConfig => {
  if (PANCHANGAM_PROVIDERS[id]) {
    activeProviderId = id;
  }
  return getActivePanchangamProvider();
};
