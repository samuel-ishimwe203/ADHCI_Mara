# ADHCI Mara Chatbot
AI chatbot for mental health support with Bible verses and mood tracking.

## Quick Run Instructions

This repository contains a Flask backend and a static frontend for local testing.

Recommended (PowerShell):

```powershell
# Run the helper which creates a venv, installs deps, starts Flask and a static server, and opens the UI
powershell -ExecutionPolicy RemoteSigned -File .\run_all.ps1
```

Or from cmd.exe, run

```
run_all.bat
```

Manual steps:

1. Create venv and install:
```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

2. Start backend:
```powershell
.\.venv\Scripts\python.exe server.py
```

3. Serve static UI (if not using Apache/XAMPP):
```powershell
python -m http.server 3000
# then open http://localhost:3000/static.html
```

Notes:
- `static.html` will call `http://localhost:5000/api/*` when opened from `localhost`. If the backend is not available, it falls back to local mock behavior.
- If PowerShell blocks scripts, run the `powershell -ExecutionPolicy RemoteSigned -File .\run_all.ps1` command above to run without changing the global policy.