@echo off
REM run_all.bat - create venv, install deps, start Flask and static server, open browser
cd /d %~dp0

if not exist .venv (
  python -m venv .venv
)

.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

start "Flask" .\.venv\Scripts\python.exe server.py
start "Static" .\.venv\Scripts\python.exe -m http.server 3000
start "" "http://localhost:3000/static.html"

echo Servers started. Close this window to finish.
pause
