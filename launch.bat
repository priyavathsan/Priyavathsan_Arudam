@echo off
REM ==============================================================================
REM Quick Launcher - Minimal version 
REM Uses Windows Task Manager approach for true background execution
REM ==============================================================================

cd /d "%~dp0"

if not exist "node_modules" (
    @echo Installing dependencies...
    call npm install
)

@echo off
@echo Launching Arudam Prasna...
@echo Opening http://localhost:5173 in 3 seconds...

REM Start server completely detached
start "" cmd /c "npm run dev"

REM Wait slightly longer for Vite to start
timeout /t 3 /nobreak

REM Open browser  
start http://localhost:5173/

@echo Done! Server running in background at http://localhost:5173
