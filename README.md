# 🔮 Arudam / Prasna (ஆருடம் / பிரசன்னம்)

> **Predicted by**: **Priyavathsan Sridharan Iyengar**  
> **Contact**: 📞 `+91-9486483808` | 💬 WhatsApp: `+91-9486483808`

A complete offline, client-side traditional **Vedic Horary Astrology (Prasna)** prediction and reference web application.

---

## ✨ Features

1. **Number Selection (1–12)**:
   - Large clickable cards for instant calculation of **Aruda Lagna** and its **6th Sign**.
   - No submit button required — calculation updates in real-time.
2. **Aruda Lagna & 6th Sign**:
   - Visual mapping from root number to Aruda Lagna and 6th sign with Tamil & English naming, elemental attributes, and zodiac rulers.
   - Interactive 12-house Rasi Chakra visual trail.
3. **9 Graha Interpretations in the 6th Sign**:
   - Complete traditional predictions for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.
   - Filtering by All, Benefics (சுபர்கள்), and Malefics (அசுபர்கள்).
4. **House Analysis (Bhavas)**:
   - Specific missing-object relevance for **2nd, 4th, 7th, 8th, and 12th** houses, plus viewable all 12 Bhavas.
   - Dynamic recalculation of corresponding signs relative to the chosen Aruda Lagna.
5. **Sign & Planet Location Clues**:
   - 12 Zodiac sign physical clues and prominent directional orientations (East, South, West, North).
   - 9 Planet specific room, surface, and container indicators.
6. **Missing Object Analysis ("What are you looking for?")**:
   - Intelligent **Auto Analyse** recognizing everyday items (*mobile phone, keys, wallet, documents, gold, laptop, clothes, etc.*).
   - Combines House + Sign + Planet + Cardinal Direction.
   - Traditional phrasing: *"Traditional interpretation suggests checking..."*
7. **Gocharam / Transit Analysis (கோச்சாரம்)**:
   - Selection of currently transiting planet (Sun to Ketu) and transit house (1 to 12).
   - **Moon Transit – Immediate Clue** highlighted card for rapid short-term guidance.
   - **Long-Term Transit Background** tracking Saturn, Jupiter, Rahu, and Ketu.
8. **Master Combined Interpretation & Direction Engine**:
   - Cardinal axis evaluation with **Direction Consistency** (*Strong, Moderate, Weak, Mixed*).
   - **Traditional Clue Alignment** indicator (*Strong, Moderate, Single, Mixed*).
   - Systematic search location checklist.
9. **Interactive Example Mode**:
   - One-click **Load Example** button loading Number #8 (Scorpio, Aries, Mercury, 8th House Gemini).
10. **Searchable Reference Library**:
    - Instant live search across all 12 Aruda mappings, 9 Grahas, 12 Bhavas, 12 Rasis, and transit rules.
11. **Clean Print & Export Support**:
    - Browser print stylesheets formatted for crisp A4 paper reports.
12. **100% Offline & Private**:
    - No backend, no external APIs, zero telemetry, fully client-side.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher) & npm

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle (optional)
npm run build

# 4. Run automated test suite
npm test
```

Once started, open your browser and navigate to:
```
http://localhost:5173/
```

---

## 🏛️ Project Architecture

```
src/
├── data/
│   ├── arudam.ts      # 1–12 Aruda Lagna & 6th sign mappings
│   ├── gocharam.ts    # Transit rules, Moon immediate clues, slow planet themes
│   ├── houses.ts      # 12 Bhavas, missing-object relevance, transit meanings
│   ├── planets.ts     # 9 Grahas, 6th sign interpretations, physical location clues
│   └── signs.ts       # 12 Rasis, cardinal directions, elements, location clues
├── types/
│   └── astrology.ts   # Comprehensive TypeScript interfaces & type definitions
├── utils/
│   ├── astrology.ts   # Calculation engine, direction evaluator, auto-analyzer
│   └── astrology.test.ts # Vitest unit test suite (12 test cases)
├── components/
│   ├── Header.tsx                 # Navigation, tabs, and action controls
│   ├── Disclaimer.tsx             # Traditional astrological reference note
│   ├── NumberSelector.tsx         # 1–12 interactive button grid
│   ├── ArudaResultsCard.tsx       # Calculated Lagna, 6th sign, and visual trail
│   ├── NinePlanetsCard.tsx        # 9 Grahas in 6th sign with filters
│   ├── HouseAnalysisCard.tsx      # 2nd, 4th, 7th, 8th, 12th Bhava analysis
│   ├── MissingObjectCard.tsx      # Query input, auto-analysis, and selectors
│   ├── SignPlanetLocationCluesCard.tsx # Signs, directions, and planet clues
│   ├── GocharamCard.tsx           # Transit analysis & Moon immediate clue card
│   ├── CombinedAnalysisCard.tsx   # Master synthesis, direction & clue consistency
│   ├── ReferenceTable.tsx         # Searchable reference table
│   └── PrintReport.tsx            # Clean A4 printable report layout
├── App.tsx                        # Root application layout & state orchestration
├── main.tsx                       # React DOM entrypoint
└── index.css                      # Tailwind styling, Vedic palette & print CSS
```

---

## 📜 Disclaimer
*This application is a traditional astrological reference and learning tool based on classical horary principles. It does not provide scientifically validated predictions or guarantee the recovery of misplaced objects.*
