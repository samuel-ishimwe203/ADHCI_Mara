# run_all.ps1
# Creates a virtual environment, installs Python dependencies, starts Flask and a static HTTP server, and opens the browser.
# Run from project root: powershell -ExecutionPolicy RemoteSigned -File .\run_all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

Write-Host "Working directory: $root"

# Create venv if missing
if (-Not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment .venv..."
    python -m venv .venv
} else {
    Write-Host "Virtual environment .venv already exists."
}

$py = Join-Path $root ".venv\Scripts\python.exe"

Write-Host "Upgrading pip and installing requirements..."
& $py -m pip install --upgrade pip
& $py -m pip install -r requirements.txt

Start-Sleep -Milliseconds 300

# Start Flask server in a new process/window
Write-Host "Starting Flask server (port 5000)..."
Start-Process -FilePath $py -ArgumentList "server.py" -WorkingDirectory $root

Start-Sleep -Milliseconds 300

# Start static HTTP server (port 3000) using the venv python
Write-Host "Starting static HTTP server (port 3000)..."
Start-Process -FilePath $py -ArgumentList "-m", "http.server", "3000" -WorkingDirectory $root

Start-Sleep -Milliseconds 500

# Open browser to static page
$staticUrl = "http://localhost:3000/static.html"
Write-Host "Opening browser to $staticUrl"
Start-Process $staticUrl

Write-Host "All processes started. Check Flask logs in separate window(s)."