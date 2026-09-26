# ==============================================================================
# Arudam Prasna - PowerShell Background Launcher
# ==============================================================================
# Run this script to start the development server and open it in your browser
# Usage: PowerShell -ExecutionPolicy Bypass -File launch.ps1
# ==============================================================================

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           Arudam Prasna - PowerShell Launcher                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if dependencies installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies... This may take a moment" -ForegroundColor Yellow
    npm install
    Write-Host ""
}

$port = 5173
$url = "http://localhost:$port/"

Write-Host "Starting Arudam Prasna development server..." -ForegroundColor Green
Write-Host "Server will run at: $url`n" -ForegroundColor Green

# Check if port is already in use
$portProcess = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($portProcess) {
    Write-Host "Port $port is already in use. Cleaning up..." -ForegroundColor Yellow
    Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Start dev server in background
Write-Host "Launching development server..." -ForegroundColor Green
$devProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -PassThru -WindowStyle Hidden

# Wait for server to start
Write-Host "Waiting for server to initialize (2-3 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Open browser
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process $url

Write-Host "`n✓ Server started successfully!`n" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Tips:" -ForegroundColor Cyan
Write-Host "  • Browser will open automatically at $url" -ForegroundColor Cyan
Write-Host "  • File changes auto-refresh in browser" -ForegroundColor Cyan
Write-Host "  • Process ID: $($devProcess.Id)" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "To stop the server: Press Ctrl+C in the terminal or run:" -ForegroundColor Yellow
Write-Host "  Stop-Process -Id $($devProcess.Id) -Force" -ForegroundColor Yellow
Write-Host ""

# Keep script running
$devProcess | Wait-Process
