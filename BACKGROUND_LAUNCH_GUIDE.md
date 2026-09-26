# 🚀 How to Run Arudam Prasna in Background

This guide covers multiple ways to run the Arudam development server without blocking your terminal or keeping a window open.

---

## **Method 1: Quick Start (Recommended for Daily Use)**

### Windows Batch File
Simply **double-click** one of these files from your project folder:
- **`run.bat`** - Full featured launcher with detailed options
- **`launch.bat`** - Minimal, fast launcher

**What happens:**
1. ✅ Server starts in background (if not installed, runs `npm install`)
2. ✅ Browser automatically opens to `http://localhost:5173`
3. ✅ You can close the terminal window after server starts
4. ✅ Changes to files auto-refresh in browser

**To stop the server:**
- Press `Ctrl+C` in the terminal, OR
- Use Task Manager → End `node.exe` process

---

## **Method 2: PowerShell Script (Advanced)**

Run this in PowerShell:

```powershell
PowerShell -ExecutionPolicy Bypass -File launch.ps1
```

**Features:**
- ✅ Checks if port 5173 is in use and cleans it up
- ✅ Auto-detects if dependencies need installing
- ✅ Shows process ID for easy termination
- ✅ Color-coded output with tips

**To use as shortcut:**
1. Create a new file `ArudamLauncher.lnk` with target:
   ```
   PowerShell -ExecutionPolicy Bypass -File "F:\Antigravity_proj\Arudam\launch.ps1"
   ```
2. Double-click the shortcut anytime

---

## **Method 3: Command Line (Direct)**

Open terminal in project folder and run:

```bash
npm run dev
```

Then manually open browser to `http://localhost:5173`

---

## **Method 4: Windows Task Scheduler (Always Running)**

For the server to **always stay running in background** on system startup:

### Steps:
1. Open **Task Scheduler** (search in Windows)
2. Click **Create Task** on the right
3. Fill in:
   - **Name:** `Arudam Prasna Server`
   - **Description:** Runs Arudam development server in background
4. Go to **Triggers** tab → Click **New**
   - Select: `At startup`
   - Click OK
5. Go to **Actions** tab → Click **New**
   - **Program:** `cmd.exe`
   - **Arguments:** `/c npm run dev`
   - **Start in:** `F:\Antigravity_proj\Arudam`
   - Click OK
6. Click **OK** to save
7. ✅ Server will start automatically when you login

**Access:** Just open browser to `http://localhost:5173` anytime

---

## **Method 5: Desktop Shortcut (One-Click Launch)**

### Create a batch shortcut:
1. Right-click on desktop → **New** → **Shortcut**
2. Paste this path:
   ```
   F:\Antigravity_proj\Arudam\run.bat
   ```
3. Click **Next**
4. Name it: `Arudam Prasna`
5. For icon, find one in `node_modules\.bin` or use a custom PNG
6. Right-click shortcut → **Properties**
   - **Run:** Select `Minimized` to start hidden
7. ✅ Double-click anytime to launch

---

## **Method 6: Windows Terminal Profiles (Terminal App)**

Add profile to `C:\Users\YourUsername\AppData\Local\Packages\Microsoft.WindowsTerminal_*/LocalState/settings.json`:

```json
{
  "guid": "{arudam-server}",
  "name": "Arudam Server",
  "commandline": "cmd.exe /k cd /d F:\\Antigravity_proj\\Arudam && npm run dev",
  "startingDirectory": "F:\\Antigravity_proj\\Arudam",
  "hidden": false
}
```

Then select "Arudam Server" from Terminal dropdown.

---

## **Method 7: npm Scripts Enhancement**

Edit `package.json` to add this script:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:background": "start /B cmd /c \"npm run dev\" && timeout /t 2 && start http://localhost:5173",
    "dev:open": "npm run dev & timeout 2 && start http://localhost:5173"
  }
}
```

Then run:
```bash
npm run dev:background
```

---

## **🐛 Troubleshooting**

### "Port 5173 already in use"
**Solution:** Kill existing process:
```bash
netstat -ano | find "5173"
taskkill /PID <ProcessID> /F
```

### Browser doesn't open automatically
**Solution:** Manually open `http://localhost:5173` in your browser

### "npm command not found"
**Solution:** Restart computer after installing Node.js, or add Node to PATH

### Server crashes after closing terminal
**Solution:** Use `launch.ps1` or Task Scheduler methods which truly run in background

---

## **📊 Comparison Table**

| Method | Ease | Persistent | Auto-Browser | Best For |
|--------|------|-----------|--------------|----------|
| `run.bat` | ⭐⭐⭐⭐⭐ | ❌ | ✅ | Daily development |
| `launch.ps1` | ⭐⭐⭐ | ❌ | ✅ | Advanced users |
| Direct npm | ⭐⭐⭐⭐ | ❌ | ❌ | Simple/learning |
| Task Scheduler | ⭐⭐ | ✅✅ | ❌ | Always-on server |
| Desktop Shortcut | ⭐⭐⭐⭐⭐ | ❌ | ✅ | One-click launch |
| Terminal Profile | ⭐⭐⭐ | ❌ | ✅ | Power users |

---

## **🎯 Recommended Setup**

For best experience:

1. **Daily development:** Double-click `run.bat` or `launch.bat`
2. **Always-on testing:** Set up Task Scheduler (Method 4)
3. **Quick access:** Create Desktop Shortcut (Method 5)
4. **Terminal lovers:** Use PowerShell script (Method 2)

---

## **🔗 Quick Reference**

```bash
# Development server
npm run dev                    # http://localhost:5173

# Production build
npm run build                  # Creates dist/ folder

# Preview production build
npm run preview               # Test production build locally

# Run tests
npm test                      # Run all tests
npm test -- --run            # Run once and exit

# Run specific tests
npm test -- chandranTiming.test.ts --run  # Chandran timing tests only
```

---

## **📝 Notes**

- The server auto-reloads when you modify `src/` files
- No need to restart for changes to take effect
- Tamil font rendering now uses **Latha font** for better display
- Planet names in chart now show full Tamil names with proper spacing

---

**Happy Arudam Prasna calculations! 🌙⭐**
