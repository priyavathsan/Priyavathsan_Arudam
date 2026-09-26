# 🚀 How to Run Arudam Prasna from GitHub

Quick guide to clone and run the Arudam application from your GitHub repository.

---

## **Quick Start (5 minutes)**

### 1️⃣ Clone Repository
```bash
git clone https://github.com/priyavathsan/Priyavathsan_Arudam.git
cd Priyavathsan_Arudam
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

Browser opens automatically → `http://localhost:5173`

That's it! ✅

---

## **Alternative Launch Methods**

### Windows Batch Files (Double-Click)
```bash
# Full-featured launcher
run.bat

# Minimal, fast launcher
launch.bat
```

### PowerShell
```bash
PowerShell -ExecutionPolicy Bypass -File launch.ps1
```

---

## **Common Commands**

```bash
# Development (auto-reload on file changes)
npm run dev                    # http://localhost:5173

# Run tests
npm test                       # Run all tests
npm test -- --run             # Run once and exit
npm test -- chandranTiming.test.ts --run  # Chandran timing tests only

# Production build
npm run build                 # Creates dist/ folder

# Preview production build
npm run preview               # Test production build locally

# Stop dev server
Ctrl + C
```

---

## **What You Get**

✅ Chandran-based time-of-recovery calculations  
✅ 27 Nakshatra timing rules  
✅ Interactive South Indian Rasi chart  
✅ Full Tamil (தமிழ்) & English support  
✅ 87 passing unit tests  
✅ Dynamic Moon ephemeris calculations  
✅ 100% offline, no backend required  

---

## **System Requirements**

- **Node.js** 18+ (download from [nodejs.org](https://nodejs.org))
- **Git** (download from [git-scm.com](https://git-scm.com))
- **Internet** (one-time for npm install)
- **Browser** (Chrome, Firefox, Safari, Edge)

---

## **Troubleshooting**

### "npm command not found"
```bash
# Restart computer after installing Node.js
# OR add Node to PATH manually
```

### "Port 5173 already in use"
```bash
# Kill process using port
netstat -ano | find "5173"
taskkill /PID <ProcessID> /F
```

### Dependencies not installed
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### Git not found
```bash
# Download Git from https://git-scm.com
# Run installer and restart terminal
```

---

## **First Time Setup Checklist**

- [ ] Install Node.js
- [ ] Install Git
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Browser opens automatically
- [ ] See "Arudam Prasna" app → Success! ✅

---

**Need help?** Check [BACKGROUND_LAUNCH_GUIDE.md](BACKGROUND_LAUNCH_GUIDE.md) for more detailed options.

**Repository:** https://github.com/priyavathsan/Priyavathsan_Arudam

Happy Arudam Prasna! 🌙⭐
