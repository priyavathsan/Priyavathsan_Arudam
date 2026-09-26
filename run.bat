@echo off
REM ==============================================================================
REM Arudam Prasna App - Background Launcher
REM ==============================================================================
REM This script starts the Arudam development server in the background and 
REM automatically opens it in your default browser
REM ==============================================================================

cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           Arudam Prasna - Background Server Launcher           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies... This may take a moment
    call npm install
    echo.
)

REM Kill any existing process on port 5173 (optional - uncomment if needed)
REM netstat -ano | find "5173" >nul
REM if %errorlevel%==0 (
REM     echo Cleaning up existing server on port 5173...
REM     for /f "tokens=5" %%a in ('netstat -ano ^| find "5173"') do taskkill /PID %%a /F
REM )

echo Starting Arudam Prasna development server...
echo Server will run at: http://localhost:5173/
echo.

REM Start dev server in a hidden window
start "" /B node_modules\.bin\vite.cmd

REM Wait for server to start (adjust timeout if needed)
echo Waiting for server to initialize...
timeout /t 3 /nobreak

REM Open browser to localhost:5173
echo Opening browser...
start http://localhost:5173/

echo.
echo ✓ Server started in background!
echo.
echo To stop the server:
echo   1. Press Ctrl+C in this terminal, OR
echo   2. Use Task Manager to end "node.exe" process
echo.
echo Notes:
echo   - Changes to files will auto-refresh in the browser
echo   - Look for console messages at: http://localhost:5173
echo   - Keep this terminal window open while developing
echo.
pause
