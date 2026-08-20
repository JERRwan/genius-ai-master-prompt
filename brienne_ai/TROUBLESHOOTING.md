# BRIENNE AI — Troubleshooting Guide

This guide covers the most common setup and runtime problems on Windows. Start with the smallest diagnostic that matches the symptom, and record the exact error before changing multiple settings.

## 1. General diagnostic sequence

Open PowerShell in the BRIENNE AI project directory and run:

```powershell
python --version
python -m pip --version
ollama --version
ollama list
Test-NetConnection 127.0.0.1 -Port 11434
```

The first two commands verify Python, the next two verify Ollama and local models, and the last command checks whether the local Ollama API port is reachable. If Python commands fail, activate `.venv` and retry. If the Ollama command fails, restart Ollama and reopen the terminal.

## 2. Python or virtual-environment problems

### `python` is not recognized

Install Python from the official Python website, enable **Add python.exe to PATH**, close all existing terminals, and open a new PowerShell window. On some systems, use the Python launcher instead:

```powershell
py --version
py -m venv .venv
```

### Activation is blocked by PowerShell

Use a session-only execution-policy change:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

This affects only the current PowerShell process. If activation still fails, use Command Prompt:

```bat
.venv\Scripts\activate.bat
```

### A package is installed but cannot be imported

Confirm that the virtual environment is active and that the package was installed into that environment:

```powershell
python -c "import sys; print(sys.executable)"
python -m pip show PyQt6
```

If the path does not point into `.venv`, activate the environment and reinstall:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

### Dependency installation fails

Upgrade the packaging tools, check that the project is using Python 3.11 or newer, and retry:

```powershell
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

If a voice package fails while voice features are not needed, install the remaining dependencies first and disable voice in `.env` while diagnosing the application. Do not remove a dependency permanently without checking which module imports it.

## 3. Ollama problems

### Ollama is not running

Start Ollama from the Start menu, wait a few seconds, then run:

```powershell
ollama list
Test-NetConnection 127.0.0.1 -Port 11434
```

BRIENNE AI uses the local endpoint `http://127.0.0.1:11434` by default. If the endpoint has been changed, update `OLLAMA_BASE_URL` in `.env` and restart BRIENNE AI.

### No model is installed

Download one model and verify it:

```powershell
ollama pull llama3.2:3b
ollama list
ollama run llama3.2:3b
```

Use the exact tag shown by `ollama list` in `OLLAMA_MODEL`. A model name in `.env` that differs by a tag or version suffix will be reported as unavailable.

### The model is too slow or fails to load

Choose a smaller model, close other resource-intensive applications, connect the computer to power, and check the System dashboard. Large local models need more memory and storage. If a model download is incomplete, retry the pull command and confirm that free disk space is available.

### Ollama works in a terminal but BRIENNE AI cannot connect

Check the following items:

1. Confirm that `.env` is in the project root beside `main.py`.
2. Confirm that the variable is named `OLLAMA_BASE_URL`.
3. Use `http://127.0.0.1:11434` rather than a browser URL with an extra path.
4. Restart BRIENNE AI after changing `.env`.
5. Check `data\logs` for the HTTP status and exception text.

## 4. PyQt6 interface problems

### The window does not open

Run the program from an active terminal so the exception remains visible:

```powershell
.\.venv\Scripts\Activate.ps1
python main.py
```

If the error reports a missing Qt platform plugin, reinstall PyQt6 inside the active environment:

```powershell
python -m pip install --force-reinstall PyQt6
```

If Windows scaling makes controls unreadable, use the operating system's application compatibility or display-scaling settings and then restart BRIENNE AI.

### The interface freezes during a request

Model calls and system monitoring should run outside the GUI event loop. Stop the current request if the application provides a cancel control. If the window remains unresponsive, use the emergency stop control or close the application, then inspect the logs. Avoid starting multiple local model requests simultaneously on a memory-constrained computer.

## 5. Voice problems

### No microphone is detected

Open Windows sound settings, verify that the microphone is enabled, and check Windows microphone privacy permissions. In BRIENNE AI, open Voice settings and select the correct input device. Continue with text chat if the device is unavailable.

### `PyAudio` installation fails

Confirm that the virtual environment uses a supported 64-bit Python installation, upgrade `pip`, and retry:

```powershell
python -m pip install --upgrade pip
python -m pip install PyAudio
```

If the microphone is not required, set `BRIENNE_VOICE_ENABLED=false` in `.env` and use text input while diagnosing the environment. Do not enable an online speech recognizer without clearly informing the user that network access is being used.

### Speech recognition returns poor text

Use push-to-talk in a quiet environment, move the microphone closer, select the correct input device, and speak one short request at a time. If recognition is online, verify the network status. If an offline recognizer is configured, confirm that its local model is installed and that the model path is correct.

### Text-to-speech does not speak

Check that `BRIENNE_TTS_ENABLED=true`, verify that Windows has an installed speech voice, and test a short response. Use the interrupt control if speech becomes stuck. Text chat should remain available even when TTS is disabled.

## 6. Automation and application-control problems

### An application cannot be found

Use the approved application registry to add or correct the known executable path. Do not copy an executable path directly from untrusted model output. Confirm that the application is installed and that the current Windows account can launch it manually.

### Automation clicks the wrong place

Press emergency stop, close unrelated windows, return the target application to a known state, and retry only with a narrow workflow. Avoid coordinate-based automation when an application-specific integration or keyboard shortcut is available. Do not use unattended automation for destructive, financial, messaging, or upload workflows.

### A file operation is denied

Check whether another application has the file open, whether the current user has permission, and whether the path is inside a protected Windows directory. If a permission change is proposed, review it as a high-risk action and approve it only when necessary.

### The emergency stop does not work

Use the visible stop control first. If the interface is unresponsive, stop the Python process from a separate terminal or Task Manager. Do not restart automation until the target application and any partial changes have been inspected.

## 7. Database and memory problems

### SQLite cannot be opened

Close BRIENNE AI and check that the `data` directory exists and is writable. Back up the database before repair:

```powershell
Copy-Item data\brienne.db data\brienne.db.backup
```

Check that no second process is holding the database open. If the database is corrupted, preserve the backup and consult the project maintainer before deleting or recreating it.

### Memory contains an unwanted item

Open Memory, search for the item, and delete it individually. Use **Clear all memory** only after confirming that all stored preferences and summaries can be removed. Never store passwords or authentication secrets in memory.

## 8. Log review

Logs should be stored under `data\logs` unless `BRIENNE_LOG_DIR` is changed. Review the newest log first. A useful diagnostic excerpt includes the timestamp, subsystem, operation name, non-sensitive error type, and result. Remove usernames, private paths, document content, tokens, and personal data before sharing logs.

## 9. Safe recovery order

When the cause is uncertain, use this order:

1. Stop active automation and confirm the human-override indicator is on.
2. Save or back up user data and the SQLite database.
3. Close BRIENNE AI and Ollama.
4. Reopen Ollama and verify `ollama list`.
5. Activate `.venv` and run the dependency check.
6. Start BRIENNE AI from the terminal and capture the exact error.
7. Retry only the smallest affected feature.

Avoid deleting the virtual environment, database, or model files as a first response. Those steps can remove useful evidence or user data.

## 10. Information to include in a support report

Include the operating-system version, Python version, Ollama version, model tag, BRIENNE AI version, exact error text, and a short non-sensitive log excerpt. State whether the failure affects text chat, Ollama connectivity, voice, the GUI, file operations, or automation.

Never include passwords, API keys, private keys, authentication cookies, or complete private documents in a report.

## Author

**Manus AI**
