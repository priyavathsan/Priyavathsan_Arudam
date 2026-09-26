// 27 Nakshatras with Tamil and English names, Lords, and Rasi spans
export interface NakshatraInfo {
  id: number; // 1..27
  nameEn: string;
  nameTa: string;
  lordEn: string;
  lordTa: string;
  startDegree: number; // 0..360
  endDegree: number;
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { id: 1, nameEn: 'Ashwini', nameTa: 'அசுவினி', lordEn: 'Ketu', lordTa: 'கேது', startDegree: 0, endDegree: 13.3333 },
  { id: 2, nameEn: 'Bharani', nameTa: 'பரணி', lordEn: 'Venus', lordTa: 'சுக்கிரன்', startDegree: 13.3333, endDegree: 26.6667 },
  { id: 3, nameEn: 'Krittika', nameTa: 'கிருத்திகை', lordEn: 'Sun', lordTa: 'சூரியன்', startDegree: 26.6667, endDegree: 40.0 },
  { id: 4, nameEn: 'Rohini', nameTa: 'ரோகிணி', lordEn: 'Moon', lordTa: 'சந்திரன்', startDegree: 40.0, endDegree: 53.3333 },
  { id: 5, nameEn: 'Mrigashira', nameTa: 'மிருகசீரிஷம்', lordEn: 'Mars', lordTa: 'செவ்வாய்', startDegree: 53.3333, endDegree: 66.6667 },
  { id: 6, nameEn: 'Ardra', nameTa: 'திருவாதிரை', lordEn: 'Rahu', lordTa: 'ராகு', startDegree: 66.6667, endDegree: 80.0 },
  { id: 7, nameEn: 'Punarvasu', nameTa: 'புனர்பூசம்', lordEn: 'Jupiter', lordTa: 'குரு', startDegree: 80.0, endDegree: 93.3333 },
  { id: 8, nameEn: 'Pushya', nameTa: 'பூசம்', lordEn: 'Saturn', lordTa: 'சனி', startDegree: 93.3333, endDegree: 106.6667 },
  { id: 9, nameEn: 'Ashlesha', nameTa: 'ஆயில்யம்', lordEn: 'Mercury', lordTa: 'புதன்', startDegree: 106.6667, endDegree: 120.0 },
  { id: 10, nameEn: 'Magha', nameTa: 'மகம்', lordEn: 'Ketu', lordTa: 'கேது', startDegree: 120.0, endDegree: 133.3333 },
  { id: 11, nameEn: 'Purva Phalguni', nameTa: 'பூரம்', lordEn: 'Venus', lordTa: 'சுக்கிரன்', startDegree: 133.3333, endDegree: 146.6667 },
  { id: 12, nameEn: 'Uttara Phalguni', nameTa: 'உத்திரம்', lordEn: 'Sun', lordTa: 'சூரியன்', startDegree: 146.6667, endDegree: 160.0 },
  { id: 13, nameEn: 'Hasta', nameTa: 'அஸ்தம்', lordEn: 'Moon', lordTa: 'சந்திரன்', startDegree: 160.0, endDegree: 173.3333 },
  { id: 14, nameEn: 'Chitra', nameTa: 'சித்திரை', lordEn: 'Mars', lordTa: 'செவ்வாய்', startDegree: 173.3333, endDegree: 186.6667 },
  { id: 15, nameEn: 'Swati', nameTa: 'சுவாதி', lordEn: 'Rahu', lordTa: 'ராகு', startDegree: 186.6667, endDegree: 200.0 },
  { id: 16, nameEn: 'Vishakha', nameTa: 'விசாகம்', lordEn: 'Jupiter', lordTa: 'குரு', startDegree: 200.0, endDegree: 213.3333 },
  { id: 17, nameEn: 'Anuradha', nameTa: 'அனுஷம்', lordEn: 'Saturn', lordTa: 'சனி', startDegree: 213.3333, endDegree: 226.6667 },
  { id: 18, nameEn: 'Jyeshtha', nameTa: 'கேட்டை', lordEn: 'Mercury', lordTa: 'புதன்', startDegree: 226.6667, endDegree: 240.0 },
  { id: 19, nameEn: 'Mula', nameTa: 'மூலம்', lordEn: 'Ketu', lordTa: 'கேது', startDegree: 240.0, endDegree: 253.3333 },
  { id: 20, nameEn: 'Purva Ashadha', nameTa: 'பூராடம்', lordEn: 'Venus', lordTa: 'சுக்கிரன்', startDegree: 253.3333, endDegree: 266.6667 },
  { id: 21, nameEn: 'Uttara Ashadha', nameTa: 'உத்திராடம்', lordEn: 'Sun', lordTa: 'சூரியன்', startDegree: 266.6667, endDegree: 280.0 },
  { id: 22, nameEn: 'Shravana', nameTa: 'திருவோணம்', lordEn: 'Moon', lordTa: 'சந்திரன்', startDegree: 280.0, endDegree: 293.3333 },
  { id: 23, nameEn: 'Dhanishta', nameTa: 'அவிட்டம்', lordEn: 'Mars', lordTa: 'செவ்வாய்', startDegree: 293.3333, endDegree: 306.6667 },
  { id: 24, nameEn: 'Shatabhisha', nameTa: 'சதயம்', lordEn: 'Rahu', lordTa: 'ராகு', startDegree: 306.6667, endDegree: 320.0 },
  { id: 25, nameEn: 'Purva Bhadrapada', nameTa: 'பூரட்டாதி', lordEn: 'Jupiter', lordTa: 'குரு', startDegree: 320.0, endDegree: 333.3333 },
  { id: 26, nameEn: 'Uttara Bhadrapada', nameTa: 'உத்திரட்டாதி', lordEn: 'Saturn', lordTa: 'சனி', startDegree: 333.3333, endDegree: 346.6667 },
  { id: 27, nameEn: 'Revati', nameTa: 'ரேவதி', lordEn: 'Mercury', lordTa: 'புதன்', startDegree: 346.6667, endDegree: 360.0 },
];

export const getNakshatraByDegree = (degree: number): { nakshatra: NakshatraInfo; pada: number } => {
  const norm = ((degree % 360) + 360) % 360;
  const nakshatraIndex = Math.min(Math.floor(norm / (360 / 27)), 26);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const degInNakshatra = norm - nakshatra.startDegree;
  const pada = Math.min(Math.floor(degInNakshatra / (13.333333333333334 / 4)) + 1, 4);
  return { nakshatra, pada };
};
