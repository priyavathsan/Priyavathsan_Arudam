import * as Astronomy from 'astronomy-engine';
import { getNakshatraByDegree } from '../astrology/nakshatra';
import { RASI_LIST } from '../astrology/rasi';
import { NINE_PLANETS } from '../astrology/planets';

export interface TransitPlanetInfo {
  id: string; // 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'
  nameEn: string;
  nameTa: string;
  sanskritName: string;
  symbol: string;
  rasiId: number; // 1..12
  rasiEn: string;
  rasiTa: string;
  degreeInRasi: number; // 0..30
  degreeFormatted: string; // e.g. "14° 25'"
  totalSiderealDegree: number; // 0..360
  isRetrograde: boolean;
  nakshatraId: number; // 1..27
  nakshatraEn: string;
  nakshatraTa: string;
  pada: number; // 1..4
  element: string;
  nature: 'benefic' | 'malefic' | 'neutral';
  transitStatusEn: string;
  transitStatusTa: string;
}

export interface TransitCalculationResult {
  date: Date;
  dateFormatted: string;
  timeFormatted: string;
  ayanamsaDeg: number;
  ayanamsaFormatted: string;
  planets: TransitPlanetInfo[];
  providerNameEn: string;
  providerNameTa: string;
  isEphemerisAvailable: boolean;
}

/**
 * Computes Lahiri Ayanamsa for a given Julian Day
 */
export const calculateLahiriAyanamsa = (date: Date): number => {
  const jd = (date.getTime() / 86400000) + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  // IAU / Lahiri Standard Ayanamsa formula
  return 23.85805 + 1.39697 * T + 0.000308 * T * T;
};

/**
 * Format decimal degree into DD° MM'
 */
export const formatDegrees = (deg: number): string => {
  const normalized = ((deg % 30) + 30) % 30;
  const d = Math.floor(normalized);
  const m = Math.floor((normalized - d) * 60);
  return `${d}° ${m.toString().padStart(2, '0')}'`;
};

/**
 * Calculates high-precision sidereal planetary positions for any date/time
 */
export const calculateTransitPositions = (calculationDate: Date = new Date()): TransitCalculationResult => {
  try {
    const ayanamsa = calculateLahiriAyanamsa(calculationDate);
    const ayanamsaD = Math.floor(ayanamsa);
    const ayanamsaM = Math.floor((ayanamsa - ayanamsaD) * 60);
    const ayanamsaFormatted = `${ayanamsaD}° ${ayanamsaM}' (Lahiri)`;

    // 1-hour delta for retrograde calculation
    const deltaDate = new Date(calculationDate.getTime() + 3600000);

    const bodies: { id: string; body: Astronomy.Body }[] = [
      { id: 'sun', body: Astronomy.Body.Sun },
      { id: 'moon', body: Astronomy.Body.Moon },
      { id: 'mars', body: Astronomy.Body.Mars },
      { id: 'mercury', body: Astronomy.Body.Mercury },
      { id: 'jupiter', body: Astronomy.Body.Jupiter },
      { id: 'venus', body: Astronomy.Body.Venus },
      { id: 'saturn', body: Astronomy.Body.Saturn }
    ];

    const planets: TransitPlanetInfo[] = [];

    // Calculate the 7 major physical planets
    for (const item of bodies) {
      const vec = Astronomy.GeoVector(item.body, calculationDate, true);
      const ecl = Astronomy.Ecliptic(vec);
      const tropLon = ecl.elon;

      // Retrograde check via 1 hour motion
      const vecDelta = Astronomy.GeoVector(item.body, deltaDate, true);
      const eclDelta = Astronomy.Ecliptic(vecDelta);
      let diff = eclDelta.elon - tropLon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const isRetrograde = item.id !== 'sun' && item.id !== 'moon' && diff < 0;

      // Convert to sidereal
      const sidLon = ((tropLon - ayanamsa) % 360 + 360) % 360;
      const rasiIndex = Math.min(Math.floor(sidLon / 30), 11);
      const rasiId = rasiIndex + 1;
      const degreeInRasi = sidLon % 30;

      const rasiInfo = RASI_LIST[rasiIndex];
      const planetData = NINE_PLANETS.find(p => p.id === item.id) || NINE_PLANETS[0];
      const { nakshatra, pada } = getNakshatraByDegree(sidLon);

      planets.push({
        id: item.id,
        nameEn: planetData.englishOnly,
        nameTa: planetData.tamilOnly,
        sanskritName: planetData.sanskritName,
        symbol: planetData.symbol,
        rasiId,
        rasiEn: rasiInfo.englishNameOnly,
        rasiTa: rasiInfo.tamilNameOnly,
        degreeInRasi,
        degreeFormatted: formatDegrees(degreeInRasi),
        totalSiderealDegree: sidLon,
        isRetrograde,
        nakshatraId: nakshatra.id,
        nakshatraEn: nakshatra.nameEn,
        nakshatraTa: nakshatra.nameTa,
        pada,
        element: planetData.element,
        nature: planetData.nature,
        transitStatusEn: isRetrograde ? 'Retrograde (வக்ரம்)' : 'Direct (நேர்கதி)',
        transitStatusTa: isRetrograde ? 'வக்ர கதி' : 'நேர்கதி'
      });
    }

    // Lunar Nodes (Rahu and Ketu) - Mean Node
    const jd = (calculationDate.getTime() / 86400000) + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;
    let omega = (125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360;
    if (omega < 0) omega += 360;

    // Rahu sidereal longitude
    const rahuSid = ((omega - ayanamsa) % 360 + 360) % 360;
    const rahuRasiIndex = Math.min(Math.floor(rahuSid / 30), 11);
    const rahuRasiId = rahuRasiIndex + 1;
    const rahuDegInRasi = rahuSid % 30;
    const rahuRasi = RASI_LIST[rahuRasiIndex];
    const rahuNak = getNakshatraByDegree(rahuSid);
    const rahuData = NINE_PLANETS.find(p => p.id === 'rahu')!;

    planets.push({
      id: 'rahu',
      nameEn: rahuData.englishOnly,
      nameTa: rahuData.tamilOnly,
      sanskritName: rahuData.sanskritName,
      symbol: rahuData.symbol,
      rasiId: rahuRasiId,
      rasiEn: rahuRasi.englishNameOnly,
      rasiTa: rahuRasi.tamilNameOnly,
      degreeInRasi: rahuDegInRasi,
      degreeFormatted: formatDegrees(rahuDegInRasi),
      totalSiderealDegree: rahuSid,
      isRetrograde: true, // Always retrograde in mean motion
      nakshatraId: rahuNak.nakshatra.id,
      nakshatraEn: rahuNak.nakshatra.nameEn,
      nakshatraTa: rahuNak.nakshatra.nameTa,
      pada: rahuNak.pada,
      element: rahuData.element,
      nature: rahuData.nature,
      transitStatusEn: 'Retrograde (இயற்கை வக்ரம்)',
      transitStatusTa: 'இயற்கை வக்ர கதி'
    });

    // Ketu is exactly 180 degrees opposite to Rahu
    const ketuSid = (rahuSid + 180) % 360;
    const ketuRasiIndex = Math.min(Math.floor(ketuSid / 30), 11);
    const ketuRasiId = ketuRasiIndex + 1;
    const ketuDegInRasi = ketuSid % 30;
    const ketuRasi = RASI_LIST[ketuRasiIndex];
    const ketuNak = getNakshatraByDegree(ketuSid);
    const ketuData = NINE_PLANETS.find(p => p.id === 'ketu')!;

    planets.push({
      id: 'ketu',
      nameEn: ketuData.englishOnly,
      nameTa: ketuData.tamilOnly,
      sanskritName: ketuData.sanskritName,
      symbol: ketuData.symbol,
      rasiId: ketuRasiId,
      rasiEn: ketuRasi.englishNameOnly,
      rasiTa: ketuRasi.tamilNameOnly,
      degreeInRasi: ketuDegInRasi,
      degreeFormatted: formatDegrees(ketuDegInRasi),
      totalSiderealDegree: ketuSid,
      isRetrograde: true,
      nakshatraId: ketuNak.nakshatra.id,
      nakshatraEn: ketuNak.nakshatra.nameEn,
      nakshatraTa: ketuNak.nakshatra.nameTa,
      pada: ketuNak.pada,
      element: ketuData.element,
      nature: ketuData.nature,
      transitStatusEn: 'Retrograde (இயற்கை வக்ரம்)',
      transitStatusTa: 'இயற்கை வக்ர கதி'
    });

    return {
      date: calculationDate,
      dateFormatted: calculationDate.toLocaleDateString('en-GB'),
      timeFormatted: calculationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ayanamsaDeg: ayanamsa,
      ayanamsaFormatted,
      planets,
      providerNameEn: 'Sidereal Ephemeris (Lahiri / Chitrapaksha)',
      providerNameTa: 'நிரயண எபிமெரிஸ் (லாஹிரி முறை)',
      isEphemerisAvailable: true
    };
  } catch (err) {
    console.error('Ephemeris calculation error:', err);
    return {
      date: calculationDate,
      dateFormatted: calculationDate.toLocaleDateString('en-GB'),
      timeFormatted: calculationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ayanamsaDeg: 24.23,
      ayanamsaFormatted: '24° 14\' (Fallback)',
      planets: [],
      providerNameEn: 'Calculation data unavailable',
      providerNameTa: 'கணக்கீட்டு தரவு கிடைக்கவில்லை',
      isEphemerisAvailable: false
    };
  }
};
