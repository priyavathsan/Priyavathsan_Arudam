const zodiacSigns = [
    "மேஷம் (Aries)",       // 0
    "ரிஷபம் (Taurus)",     // 1
    "மிதுனம் (Gemini)",    // 2
    "கடகம் (Cancer)",      // 3
    "சிம்மம் (Leo)",       // 4
    "கன்னி (Virgo)",       // 5
    "துலாம் (Libra)",      // 6
    "விருச்சிகம் (Scorpio)",// 7
    "தனுசு (Sagittarius)", // 8
    "மகரம் (Capricorn)",   // 9
    "கும்பம் (Aquarius)",  // 10
    "மீனம் (Pisces)"       // 11
];

const tithiNames = [
    "அமாவாசை (Amavasya)", "பிரதமை (Prathamai)", "துவிதியை (Thuvithiyai)", "திரிதியை (Thirithiyai)", "சதுர்த்தி (Chathurthi)",
    "பஞ்சமி (Panchami)", "சஷ்டி (Shasti)", "சப்தமி (Sapthami)", "அஷ்டமி (Ashtami)", "நவமி (Navami)",
    "தசமி (Dasami)", "ஏகாதசி (Ekadasi)", "துவாதசி (Duvadasi)", "திரியோதசி (Thrayodasi)", "சதுர்த்தசி (Chathurdasi)",
    "பௌர்ணமி (Pournami)", "பிரதமை (Prathamai)", "துவிதியை (Thuvithiyai)", "திரிதியை (Thirithiyai)", "சதுர்த்தி (Chathurthi)",
    "பஞ்சமி (Panchami)", "சஷ்டி (Shasti)", "சப்தமி (Sapthami)", "அஷ்டமி (Ashtami)", "நவமி (Navami)",
    "தசமி (Dasami)", "ஏகாதசி (Ekadasi)", "துவாதசி (Duvadasi)", "திரியோதசி (Thrayodasi)", "சதுர்த்தசி (Chathurdasi)"
];

const nakshatraNames = [
    "அசுவினி (Ashwini)", "பரணி (Bharani)", "கார்த்திகை (Karthigai)", "ரோகிணி (Rohini)", "மிருகசீரிடம் (Mrigasheersham)",
    "திருவாதிரை (Thiruvathirai)", "புனர்பூசம் (Punarpoosam)", "பூசம் (Poosam)", "ஆயில்யம் (Ayilyam)",
    "மகம் (Magam)", "பூரம் (Pooram)", "உத்திரம் (Uthiram)", "அஸ்தம் (Hastham)", "சித்திரை (Chithirai)",
    "சுவாதி (Swathi)", "விசாகம் (Vishakam)", "அனுஷம் (Anusham)", "கேட்டை (Kettai)",
    "மூலம் (Moolam)", "பூராடம் (Pooradam)", "உத்திராடம் (Uthiradam)", "திருவோணம் (Thiruvonam)", "அவிட்டம் (Avittam)",
    "சதயம் (Sathayam)", "பூரட்டாதி (Poorattathi)", "உத்திரட்டாதி (Uthirattathi)", "ரேவதி (Revathi)"
];

// Predictions based on the 6th House sign
const predictions = {
    // 6th House is Aries
    0: "ஆரோக்கியம்: தலைவலி அல்லது உடல் உஷ்ணம் சார்ந்த உபாதைகள் வரலாம். விபத்துகளில் கவனம் தேவை. \nகடன்/தொழில்: உடனடி நடவடிக்கைகளால் கடன் சுமை அதிகரிக்கலாம். வேலையில் போட்டிகள் இருக்கும், ஆனால் தைரியமாக எதிர்கொள்வீர்கள்.",

    // 6th House is Taurus
    1: "ஆரோக்கியம்: தொண்டை அல்லது தைராய்டு சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: குடும்ப தேவைக்காக அல்லது ஆடம்பரத்திற்காக கடன் வாங்கும் சூழல் உருவாகும். வேலையில் பண வரவு இருந்தாலும் செலவும் இருக்கும்.",

    // 6th House is Gemini
    2: "ஆரோக்கியம்: நரம்பு தளர்ச்சி அல்லது சுவாசக் கோளாறுகள் ஏற்படலாம். \nகடன்/தொழில்: ஆவணங்கள் அல்லது கையெழுத்து போடும் விஷயங்களில் கவனம் தேவை. தகவல் தொடர்பு துறையில் வேலை வாய்ப்பு அல்லது போட்டி இருக்கும்.",

    // 6th House is Cancer
    3: "ஆரோக்கியம்: சளி, நெஞ்சு சளி அல்லது வயிறு சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: வீடு அல்லது வாகனம் சார்ந்த கடன் சுமை இருக்கலாம். வேலை மாற்றம் அல்லது இடமாற்றம் பற்றிய சிந்தனை இருக்கும்.",

    // 6th House is Leo
    4: "ஆரோக்கியம்: இதயம், முதுகு தண்டு அல்லது பித்தம் சார்ந்த உபாதைகள் வரலாம். \nகடன்/தொழில்: கௌரவத்திற்காக அதிக செலவு செய்வீர்கள். அரசு வழியில் அல்லது மேலதிகாரிகளால் நெருக்கடி வரலாம்.",

    // 6th House is Virgo
    5: "ஆரோக்கியம்: வயிறு, ஜீரண கோளாறு அல்லது தோல் வியாதிகள் வரலாம். \nகடன்/தொழில்: கணக்கு வழக்குகளில் கவனம் தேவை. வேலையில் அதிக நுணுக்கம் தேவைப்படும். கடன் வாங்க நேரிடலாம்.",

    // 6th House is Libra
    6: "ஆரோக்கியம்: சிறுநீரகம் அல்லது இடுப்பு சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: கூட்டுத் தொழிலில் அல்லது வாழ்க்கை துணையால் செலவுகள் வரும். வியாபாரத்தில் போட்டிகள் இருக்கும்.",

    // 6th House is Scorpio
    7: "ஆரோக்கியம்: ரகசிய நோய்கள் அல்லது கழிவுப் பாதை சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: மறைமுக எதிரிகள் இருப்பார்கள். எதிர்பாராத கடன் சுமை அல்லது அவமானம் வர வாய்ப்புள்ளது.",

    // 6th House is Sagittarius
    8: "ஆரோக்கியம்: கல்லீரல் அல்லது கொழுப்பு சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: சட்ட சிக்கல்கள் அல்லது வங்கிக் கடன்கள் விஷயத்தில் எச்சரிக்கை தேவை. வேலையில் நல்ல வழிகாட்டுதல் கிடைக்கும்.",

    // 6th House is Capricorn
    9: "ஆரோக்கியம்: மூட்டு வலி, வாதம் அல்லது தோல் நோய்கள் வரலாம். \nகடன்/தொழில்: வேலைப்பளு அதிகமாக இருக்கும். உழைப்பிற்கு ஏற்ற ஊதியம் கிடைப்பதில் தாமதம் ஆகலாம். பழைய கடன்கள் தொந்தரவு செய்யும்.",

    // 6th House is Aquarius
    10: "ஆரோக்கியம்: கால்கள் அல்லது நரம்பு சுருட்டல் சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: நண்பர்கள் அல்லது சமூக தொடர்புகளால் செலவுகள் வரும். வேலையில் நீண்ட கால திட்டங்கள் அவசியம்.",

    // 6th House is Pisces
    11: "ஆரோக்கியம்: பாதங்கள் அல்லது தூக்கமின்மை சார்ந்த பிரச்சனைகள் வரலாம். \nகடன்/தொழில்: மருத்துவ செலவுகள் அல்லது வீண் விரயங்கள் ஏற்படும். வேலையில் திருப்தியின்மை இருக்கலாம்."
};

document.getElementById('predictBtn').addEventListener('click', function () {
    const input = document.getElementById('luckyNumber').value;
    const num = parseInt(input);

    if (isNaN(num) || num < 1 || num > 12) {
        alert("தயவுசெய்து 1 முதல் 12 வரை உள்ள எண்ணை உள்ளிடவும் (Please enter a number between 1 and 12).");
        return;
    }

    // Calculation Logic
    // User Input N corresponds to Zodiac[N-1]
    const ascendantIndex = num - 1;

    // 6th House is (AscendantIndex + 5) % 12
    const sixthHouseIndex = (ascendantIndex + 5) % 12;

    const ascendantName = zodiacSigns[ascendantIndex];
    const sixthHouseName = zodiacSigns[sixthHouseIndex];
    const predictionContent = predictions[sixthHouseIndex];

    // Update UI
    document.getElementById('displayNumber').textContent = num;
    document.getElementById('ascendant').textContent = ascendantName;
    document.getElementById('sixthHouse').textContent = sixthHouseName;
    document.getElementById('predictionText').innerText = predictionContent; // Use innerText to handle \n newlines

    const resultSection = document.getElementById('result');
    resultSection.classList.remove('hidden');

    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
});

// --- Panchangam and Navagraha Calculation Logic ---

const planets = [
    { name: "சூரியன் (Sun)", body: "Sun" },
    { name: "சந்திரன் (Moon)", body: "Moon" },
    { name: "செவ்வாய் (Mars)", body: "Mars" },
    { name: "புதன் (Mercury)", body: "Mercury" },
    { name: "குரு (Jupiter)", body: "Jupiter" },
    { name: "சுக்கிரன் (Venus)", body: "Venus" },
    { name: "சனி (Saturn)", body: "Saturn" }
    // Rahu and Ketu handled separately
];

function calculatePanchangam() {
    if (typeof Astronomy === 'undefined') {
        console.error("Astronomy library not loaded.");
        document.getElementById('tithi').textContent = "Error loading data";
        document.getElementById('nakshatra').textContent = "Error loading data";
        return;
    }

    const date = new Date();
    const time = Astronomy.MakeTime(date);

    // Lahiri Ayanamsa Approximation for ~2025
    // Ayanamsa is increasing approx 50 arcseconds per year.
    // Base 2000 was ~23.85 degrees. 2025 is ~25 years later.
    // 25 * 50 / 3600 = ~0.35 degrees.
    // 23.85 + 0.35 = ~24.2 degrees.
    const AYANAMSA_DEG = 24.2;

    // 1. Calculate Tithi
    // Tithi depends on the angle between Moon and Sun (Synodic month). 
    // It is independent of Ayanamsa because subtraction cancels it out.
    // Tithi = (MoonLong - SunLong) / 12
    const sunPos = Astronomy.Ecliptic(Astronomy.Body.Sun, time);
    const moonPos = Astronomy.Ecliptic(Astronomy.Body.Moon, time);

    let diff = moonPos.elon - sunPos.elon;
    if (diff < 0) diff += 360;

    const tithiIndex = Math.floor(diff / 12);
    // Adjust index to match tithiNames array (0=Amavasya, 15=Pournami)
    // tithiNames: 0=Amavasya, 1=Prathamai... 15=Pournami, 16=Prathamai...
    // Tithi 0-12 deg = Shukla Prathamai (1)? No.
    // 0 deg = Amavasya point. 0-12 is Shukla Prathamai.
    // Wait, usually Amavasya is the *end* of the month or the moment?
    // Let's standardise: 
    // 0-12: Shukla Prathamai
    // ...
    // 168-180: Pournami
    // 180-192: Krishna Prathamai
    // ...
    // 348-360: Amavasya
    // My array `tithiNames` starts with "Amavasya". 
    // Usually Tithi 1 is Prathamai. 30 is Amavasya.
    // Let's map carefully.
    // If diff is 0-12, it is Shukla Prathamai.
    // My array index 1 is Prathamai.
    // So Array Index = Math.floor(diff / 12) + 1?
    // Let's check array: 0: Amavasya, 1: Prathamai... 15: Pournami.
    // If diff is 0-12 (Shukla Prathamai), index should be 1.
    // If diff is 180-192 (Krishna Prathamai), index should be 16.
    // If diff is 348-360 (Amavasya), index should be 0 (or 30 -> 0).

    // Let's refine the array mapping.
    // Shukla Paksha (Waxing): 1 to 15 (Prathamai to Pournami).
    // Krishna Paksha (Waning): 1 to 15 (Prathamai to Amavasya).
    // Let's use a logic:
    // Tithi Number (1-30) = Math.floor(diff / 12) + 1.
    // If Tithi <= 15: Shukla Paksha. (15 is Pournami)
    // If Tithi > 15: Krishna Paksha. (30 is Amavasya)
    // However, my array `tithiNames` has 30 items.
    // Item 0: Amavasya. Item 15: Pournami.
    // Logic:
    // If Tithi 30 (Amavasya) -> Index 0.
    // If Tithi 15 (Pournami) -> Index 15.
    // If Tithi 1 (Shukla Prathamai) -> Index 1.
    // If Tithi 16 (Krishna Prathamai) -> Index 16.

    let tithiVal = Math.floor(diff / 12) + 1; // 1 to 30
    let finalTithiIndex = tithiVal;
    if (tithiVal === 30) finalTithiIndex = 0; // Amavasya at 0 index

    document.getElementById('tithi').textContent = tithiNames[finalTithiIndex] || "Unknown";

    // 2. Calculate Nakshatra
    // Nakshatra depends on Sidereal Moon Longitude.
    let moonSidereal = (moonPos.elon - AYANAMSA_DEG + 360) % 360;
    const nakshatraIndex = Math.floor(moonSidereal / 13.333333);
    document.getElementById('nakshatra').textContent = nakshatraNames[nakshatraIndex] || "Unknown";

    // 3. Calculate Navagraha Positions
    const grid = document.getElementById('navagraha-grid');
    grid.innerHTML = ''; // Clear existing

    // Add main planets
    planets.forEach(p => {
        const pos = Astronomy.Ecliptic(Astronomy.Body[p.body], time);
        const siderealLong = (pos.elon - AYANAMSA_DEG + 360) % 360;
        const rasiIndex = Math.floor(siderealLong / 30);
        addPlanetToGrid(p.name, zodiacSigns[rasiIndex], grid);
    });

    // 4. Calculate Rahu and Ketu (Mean Lunar Node)
    // Formula for Mean Ascending Node (Rahu)
    // T = Centuries since J2000.0 given JD
    // JD for J2000.0 = 2451545.0
    // time.tt is Terrestrial Time Day.
    const jd = time.tt;
    const T = (jd - 2451545.0) / 36525.0;

    // Mean Longitude of Node
    // Omega = 125.04452 - 1934.136261 * T
    let meanNode = 125.04452 - 1934.136261 * T;

    // Normalize to 0-360
    meanNode = (meanNode % 360 + 360) % 360;

    // Tropical Rahu (True or Mean? This is Mean)
    const tropicalRahu = meanNode;

    // Sidereal Rahu
    const siderealRahu = (tropicalRahu - AYANAMSA_DEG + 360) % 360;
    const rahuIndex = Math.floor(siderealRahu / 30);

    // Ketu is opposite to Rahu (180 degrees difference)
    const siderealKetu = (siderealRahu + 180) % 360;
    const ketuIndex = Math.floor(siderealKetu / 30);

    addPlanetToGrid("ராகு (Rahu)", zodiacSigns[rahuIndex], grid);
    addPlanetToGrid("கேது (Ketu)", zodiacSigns[ketuIndex], grid);
}

function addPlanetToGrid(name, rasi, container) {
    const div = document.createElement('div');
    div.className = 'planet-item';
    div.innerHTML = `
        <span class="planet-name">${name}</span>
        <span class="planet-sign">${rasi}</span>
    `;
    container.appendChild(div);
}

// Initialize on Load
window.addEventListener('load', calculatePanchangam);

