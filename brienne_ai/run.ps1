$ErrorActionPreference = "Stop"

if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "Virtual environment not found. Create it with:"
    Write-Host "  python -m venv .venv"
    Write-Host "Then install dependencies with:"
    Write-Host "  python -m pip install -r requirements.txt"
    exit 1
}

if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example. Review it before continuing."
}

if (-not (Test-Path "main.py")) {
    Write-Error "main.py was not found in the project root."
    exit 1
}

& ".venv\Scripts\python.exe" "main.py"
exit $LASTEXITCODE
