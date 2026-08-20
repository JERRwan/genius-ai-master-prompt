# BRIENNE AI — Windows Installation Guide

**Version:** 1.0  
**Audience:** Windows 10/11 users, developers, and maintainers  
**Primary mode:** Local, offline-first AI through Ollama

## 1. Purpose and scope

This guide explains how to install and run BRIENNE AI as a modular Python desktop application. It covers Python, the virtual environment, Python dependencies, Ollama, a local language model, optional voice components, environment configuration, first launch, and common recovery steps.

BRIENNE AI is designed to keep its core conversation and local automation capabilities available without a paid cloud AI key. **Ollama and at least one downloaded local model are required for local AI responses.** Optional online services must be enabled deliberately by the user and are not part of the base installation.

> **Safety notice:** BRIENNE AI can interact with applications and files. Keep the human-override control enabled. Review planned actions, require confirmation for destructive or sensitive operations, and never run code or commands you do not understand.

## 2. System requirements

| Component | Minimum or recommended requirement |
|---|---|
| Operating system | Windows 10 22H2 or newer, Home or Pro, for the current Ollama Windows application [1] |
| Python | Python 3.11 or newer |
| Memory | 8 GB RAM minimum; 16 GB or more is recommended for larger local models |
| Storage | At least 4 GB for the Ollama application, plus additional storage for model files [1] |
| Graphics | CPU-only operation is possible; a compatible NVIDIA or AMD GPU can improve local inference [1] |
| Internet | Required for initial downloads only; not required for local chat after Ollama and a model are installed |
| Microphone | Optional; required only for voice input |
| Permissions | Standard user access is normally sufficient. Administrative permission may be needed for some third-party software or system changes |

Ollama's current Windows documentation states that the Windows application runs natively, exposes its local API at `http://localhost:11434`, and supports NVIDIA and AMD Radeon GPU acceleration where the required drivers are available [1]. Model storage can require substantially more space than the application itself, so check available disk space before downloading a large model.

## 3. Install Python

Download Python from the [official Python website](https://www.python.org/downloads/windows/). During setup, enable **Add python.exe to PATH** before selecting the installation option.

Open a new PowerShell window and verify the installation:

```powershell
python --version
python -m pip --version
```

The first command should report Python 3.11 or a newer version. If `python` is not recognized, restart the terminal after installation. On systems where the Python launcher is enabled, the following command is also valid:

```powershell
py --version
```

## 4. Obtain the BRIENNE AI project

Place the project in a directory that the current Windows user can read and write. The expected root should contain `main.py`, `requirements.txt`, and the application packages.

A typical structure is:

```text
BRIENNE_AI/
├── main.py
├── requirements.txt
├── README.md
├── INSTALLATION_GUIDE.md
├── USER_MANUAL.md
├── TROUBLESHOOTING.md
├── .env.example
├── config/
├── core/
├── ai/
├── voice/
├── automation/
├── tools/
├── gui/
├── data/
└── tests/
```

If the project was supplied as a ZIP file, right-click it, choose **Extract All**, and work from the extracted directory. Avoid running the application from a temporary archive preview.

## 5. Create and activate a virtual environment

Python's built-in `venv` module creates an isolated environment with its own package directory, which prevents BRIENNE AI dependencies from interfering with unrelated Python projects [3]. In PowerShell, run:

```powershell
cd C:\Path\To\BRIENNE_AI
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

When activation succeeds, `(.venv)` appears at the beginning of the terminal prompt. Upgrade the packaging tools inside the environment:

```powershell
python -m pip install --upgrade pip setuptools wheel
```

If PowerShell blocks activation because of the execution policy, use a session-only policy change rather than changing the policy for the entire computer:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

The equivalent Command Prompt commands are:

```bat
cd /d C:\Path\To\BRIENNE_AI
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip setuptools wheel
```

To leave the environment later, run:

```powershell
deactivate
```

## 6. Install Python dependencies

With `(.venv)` active, install the dependencies from the project root:

```powershell
python -m pip install -r requirements.txt
```

Confirm that the principal packages are importable:

```powershell
python -c "import PyQt6, requests, psutil, pyautogui, pyttsx3, pydantic; print('BRIENNE AI dependencies are available.')"
```

If the project includes tests, run them before first launch:

```powershell
python -m pytest
```

The `requirements.txt` file in this project separates runtime dependencies from optional notes. It includes the PyQt6 desktop toolkit, Ollama HTTP communication support, SQLite-compatible application dependencies, offline text-to-speech, microphone support, controlled GUI automation, system monitoring, validation, configuration, and logging libraries.

## 7. Install Ollama

Download the Windows installer from the [official Ollama Windows page](https://ollama.com/download/windows) or follow the [official Windows documentation](https://docs.ollama.com/windows). The current Ollama documentation says that the standard installer normally installs for the current user without requiring Administrator access [1].

After installation, start Ollama from the Start menu. It normally remains available in the notification area and serves its local API at:

```text
http://127.0.0.1:11434
```

Ollama's quickstart documentation also supports starting a model directly from a terminal with `ollama run <model>` [2]. Verify the command-line installation:

```powershell
ollama --version
ollama list
```

If `ollama` is not recognized, close and reopen the terminal so that the updated PATH is loaded. If the command still cannot be found, restart Ollama from the Start menu and verify that the installation directory was added to the user PATH.

## 8. Download a local model

Choose a model that fits the computer's available memory and storage. The official Ollama library lists small model families such as Qwen, Llama, Gemma, and Phi, as well as larger models for more capable hardware [4]. Example starting points are:

| Hardware profile | Example model command | Intended use |
|---|---|---|
| Low-end computer | `ollama pull qwen3:1.7b` | Fast general conversation with lower resource use |
| Balanced computer | `ollama pull llama3.2:3b` | General assistant tasks |
| More capable computer | `ollama pull gemma3:4b` | Stronger general responses, with higher resource use |
| Coding-focused use | `ollama pull qwen2.5-coder:3b` | Local code explanation and generation |

The model names above are examples, not hard requirements. Confirm the current tag on the [Ollama model library](https://ollama.com/library) before downloading. Then verify the model:

```powershell
ollama pull llama3.2:3b
ollama list
```

Run a direct smoke test before starting BRIENNE AI:

```powershell
ollama run llama3.2:3b
```

Enter a short prompt, confirm that a response is returned, and type `/bye` to exit. This validates Ollama independently of the desktop application [2].

## 9. Configure BRIENNE AI

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and review the local settings:

```dotenv
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
BRIENNE_DB_PATH=data/brienne.db
BRIENNE_LOG_DIR=data/logs
BRIENNE_MEMORY_ENABLED=true
BRIENNE_VOICE_ENABLED=true
BRIENNE_TTS_ENABLED=true
BRIENNE_REQUIRE_CONFIRMATION=true
BRIENNE_AUTOMATION_ENABLED=true
```

Use the exact model name shown by `ollama list`. Do not place passwords, API tokens, or other authentication secrets in `.env` or in the SQLite memory database. Keep `.env` out of source control.

## 10. First launch

Ensure Ollama is running, the virtual environment is active, and the model named in `.env` is installed. Start BRIENNE AI with:

```powershell
python main.py
```

A successful startup should initialize the database, check Ollama, detect installed models, load the application registry, and show the human-override indicator. The first screen should clearly report whether Ollama is ready, whether a local model is available, and whether voice services were detected.

If the project provides the included PowerShell launcher, use:

```powershell
.\run.ps1
```

If the project provides the included batch launcher, use:

```bat
run.bat
```

For development diagnostics, run:

```powershell
python main.py --debug
```

If the application does not define a `--debug` option, omit that flag and inspect the log files in `data\logs` instead.

## 11. Optional voice setup

Voice input is optional. Text chat and offline text-to-speech should remain usable when no microphone is available. Connect a microphone, allow Windows microphone permission when prompted, and select the device in BRIENNE AI's Voice settings.

The default offline speech output uses `pyttsx3`, which relies on a speech engine installed on the operating system. If speech output fails, verify that Windows has at least one installed text-to-speech voice and test the system's accessibility or narrator voice settings.

Speech recognition may use a local recognizer or an explicitly labelled online recognizer, depending on the implementation. The interface should identify which mode is active. Do not assume that an online recognizer works without network access.

## 12. Optional model storage location

Ollama's Windows documentation explains that model files can occupy tens to hundreds of gigabytes and that the `OLLAMA_MODELS` user environment variable can be used to move model storage [1]. To change the location:

1. Open **Settings** and search for **environment variables**.
2. Select **Edit environment variables for your account**.
3. Create or edit the user variable `OLLAMA_MODELS`.
4. Set it to a folder on a drive with sufficient free space.
5. Quit and relaunch Ollama, then verify with `ollama list`.

Do not move or delete model files while Ollama is running.

## 13. Updating BRIENNE AI

Back up the `data` directory before updating if it contains important local memory or audit logs. Then pull or extract the new source, activate the virtual environment, and refresh dependencies:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade -r requirements.txt
python -m pytest
python main.py
```

Do not overwrite `.env` during an update without first preserving your local settings. Review dependency changes before using the application with file or desktop automation enabled.

## 14. Uninstallation

To remove the Python environment and local project data, close BRIENNE AI and Ollama first. From the project directory:

```powershell
deactivate
Remove-Item -Recurse -Force .venv
```

Delete the project directory only after exporting or retaining any required database and audit-log files. Ollama can be removed from **Settings → Apps → Installed apps**. If `OLLAMA_MODELS` points to a separate directory, remove that model directory separately only when you are certain it is no longer needed.

## 15. Installation checklist

| Check | Expected result |
|---|---|
| Python | `python --version` reports 3.11 or newer |
| Virtual environment | The terminal prompt begins with `(.venv)` |
| Dependencies | `python -m pip install -r requirements.txt` completes successfully |
| Ollama | `ollama --version` returns a version |
| Local model | `ollama list` shows at least one installed model |
| Ollama API | BRIENNE AI reports the local endpoint as ready |
| Database | `data/brienne.db` is created or opened successfully |
| Voice | TTS works, or the interface clearly reports that voice is unavailable |
| Safety | Human override is on and high-risk actions require confirmation |
| Application | `python main.py` opens the PyQt6 interface |

## References

[1]: https://docs.ollama.com/windows "Ollama Windows documentation"

[2]: https://docs.ollama.com/quickstart "Ollama quickstart documentation"

[3]: https://docs.python.org/3/library/venv.html "Python venv documentation"

[4]: https://ollama.com/library "Ollama model library"

[5]: https://www.python.org/downloads/windows/ "Python downloads for Windows"

## Author

**Manus AI**

This guide is based on the BRIENNE AI project specification supplied by the user. It assumes that the application source files are present in the project root and does not replace implementation-level documentation for any individual module.

---
