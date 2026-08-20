# BRIENNE AI

> **Intelligence. Voice. Automation. Under your control.**

BRIENNE AI is a modular, local-first desktop AI assistant designed around Ollama, PyQt6, SQLite, controlled automation, offline text-to-speech, and explicit human confirmation for risky actions.

## Documentation

| Document | Purpose |
|---|---|
| [Installation Guide](INSTALLATION_GUIDE.md) | Windows setup, Python environment, Ollama, local models, voice, and first launch |
| [User Manual](USER_MANUAL.md) | Chat, voice, application control, file operations, system monitoring, memory, safety, and troubleshooting workflow |
| [Troubleshooting Guide](TROUBLESHOOTING.md) | Common installation, Ollama, voice, GUI, database, and automation failures |
| [requirements.txt](requirements.txt) | Python runtime and test dependencies |

## Quick start on Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
ollama pull llama3.2:3b
Copy-Item .env.example .env
python main.py
```

The Command Prompt equivalent is:

```bat
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
ollama pull llama3.2:3b
copy .env.example .env
python main.py
```

Ollama must be installed and running before BRIENNE AI can use local model inference. The default local endpoint is `http://127.0.0.1:11434`.

## Safety principles

BRIENNE AI must not execute arbitrary shell commands from model output. Application control should use an approved registry, structured actions, validation, and audit logging. File deletion, software installation, important settings changes, message sending, uploading, and information sharing require explicit confirmation. The emergency stop control should remain available while automation is active.

Never store passwords, private keys, API tokens, or other authentication secrets in the SQLite memory database, `.env` file, conversation logs, or issue reports.

## Project layout

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

The documentation files can be added to an existing implementation without changing application code. Update the model name in `.env` to match the model shown by `ollama list`.

## License and attribution

Add the project's chosen license and third-party attribution notices before distributing the application. Keep model licenses and usage terms separate from the BRIENNE AI source license.

## Author

**Manus AI**
