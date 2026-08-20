@echo off
setlocal

if not exist ".venv\Scripts\python.exe" (
    echo Virtual environment not found.
    echo Create it with: python -m venv .venv
    echo Install dependencies with: python -m pip install -r requirements.txt
    exit /b 1
)

if not exist ".env" if exist ".env.example" (
    copy /Y ".env.example" ".env" >nul
    echo Created .env from .env.example. Review it before continuing.
)

if not exist "main.py" (
    echo main.py was not found in the project root.
    exit /b 1
)

call ".venv\Scripts\activate.bat"
python main.py
set "EXIT_CODE=%ERRORLEVEL%"
endlocal & exit /b %EXIT_CODE%
