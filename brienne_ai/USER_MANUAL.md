# BRIENNE AI — User Manual

**Version:** 1.0  
**Product:** BRIENNE AI  
**Tagline:** *Intelligence. Voice. Automation. Under your control.*

## 1. Introduction

BRIENNE AI is a local-first desktop assistant for conversation, development support, system awareness, approved application control, file assistance, and defensive security analysis. Its primary language model runs through Ollama on the local computer. This design allows the assistant to remain useful without a paid cloud API key when Ollama and a downloaded model are available.

BRIENNE AI is an assistant, not an autonomous authority. It does not claim consciousness, and it must communicate the difference between a conversational answer, a recommendation, a proposed plan, an executed action, and a failed action. The user remains in control of the computer and is responsible for reviewing actions before approval.

> **Human Override: ON** should remain visible whenever automation is available. Use the emergency stop control immediately if an automated action behaves unexpectedly.

## 2. Starting the application

Start Ollama first, confirm that the selected model is installed, activate the Python virtual environment, and launch BRIENNE AI. A normal startup sequence checks the Ollama connection, detects local models, initializes SQLite memory, loads settings, checks voice services, and loads the approved application registry.

The startup screen should present clear status messages similar to:

```text
BRIENNE AI INITIALIZING...
Ollama connection: READY
Offline intelligence: AVAILABLE
Human override: ON
```

The greeting adapts to the time of day. If Ollama is unavailable or no model is installed, the interface should identify the exact problem and provide a practical remedy rather than silently failing.

## 3. Understanding the interface

The default layout is divided into navigation, conversation, system status, and action controls.

| Area | Purpose |
|---|---|
| Left sidebar | Switch between Chat, Voice, Automation, System, Projects, Memory, and Settings |
| Center workspace | Display conversation, model responses, voice state, action plans, confirmations, and results |
| Right status panel | Show CPU, memory, disk, battery, network, Ollama, model, and safety status |
| Bottom composer | Enter text, attach supported files, activate voice input, send a request, or stop automation |
| Safety indicator | Confirm that human override is enabled and identify the current safety state |

The visual theme may be dark and futuristic, but practical status information takes priority over decoration. A status that is not available should be labelled as unavailable, not represented as healthy.

## 4. Chat mode

Chat mode is the primary text interface. Type a request in the composer and select **Send**. BRIENNE AI sends the conversation context to the selected local Ollama model and displays the response. If streaming is enabled, text appears as it is generated; if streaming is unavailable, the interface displays a waiting state until the complete response is returned.

Use clear, specific requests. For example:

```text
Explain how a Python virtual environment works.

Review this function for input-validation problems.

Show me which approved applications are currently running.

Plan, but do not execute, a folder organization for these files.
```

When a request could produce an external effect, BRIENNE AI should first show a structured plan. The plan should identify the intended action, target, risk level, whether confirmation is required, and the expected result. The user can approve, reject, or revise the plan.

## 5. Ollama and model selection

Open **Settings** or the model selector to view the configured Ollama endpoint and installed models. The default local endpoint is:

```text
http://127.0.0.1:11434
```

The active model should be shown in the status panel. Choose a smaller model for faster responses on low-memory computers and a larger model when the computer has sufficient resources. Model selection affects response speed, quality, context capacity, and resource use.

| Status | Meaning | Recommended user action |
|---|---|---|
| Ollama READY | The local service responded successfully | Continue using BRIENNE AI |
| Ollama OFFLINE | The local service could not be reached | Start or restart Ollama, then retry the connection check |
| NO MODEL | Ollama is reachable but no local model is installed | Install a model with `ollama pull <model>` |
| MODEL UNAVAILABLE | The configured model is missing or cannot load | Select an installed model or pull the configured model again |
| BUSY | Ollama is processing another request | Wait for completion or cancel the current request if supported |

Do not enter cloud credentials into the local model field. An Ollama model name is a local identifier, such as `llama3.2:3b` or another tag shown by `ollama list`.

## 6. Voice mode

Voice mode provides push-to-talk, optional wake-phrase support, speech recognition, offline text-to-speech, microphone selection, a voice toggle, volume control, and an interrupt button when those services are available.

Press and hold or click the **Voice** button according to the interface instructions. The assistant should show one of the following states:

| Displayed state | Meaning |
|---|---|
| `LISTENING...` | BRIENNE AI is accepting microphone input |
| `THINKING...` | Speech was captured and the local model is preparing a response |
| `BRIENNE IS SPEAKING...` | Text-to-speech is reading the response |
| `VOICE UNAVAILABLE` | A microphone, recognizer, permission, or speech engine is not available |

Use **Stop Speaking** or the interrupt control to end speech output. Disable the voice toggle when a private environment requires text-only interaction. If recognition uses an online service, the interface must label that mode explicitly; do not assume that online recognition works offline.

## 7. Application control

BRIENNE AI can launch or inspect applications that are included in the approved application registry. Typical examples include Microsoft Word, Visual Studio Code, Chrome, File Explorer, and Command Prompt. The registry should map friendly names to known executable paths and should not accept an arbitrary executable path directly from model output.

A safe request follows this pattern:

```text
Open Visual Studio Code.
```

The assistant should resolve the application against the registry, show the action plan where appropriate, validate the target, execute the approved launch, and report the result. If the application is not found, it should explain that it could not locate an approved installation and should not guess a command.

Closing an application, typing into an active window, or controlling a workflow may require confirmation depending on the risk policy. Never approve an action when the target window or data is ambiguous.

## 8. File assistance

File features are intended for controlled, user-approved operations. BRIENNE AI can search, preview, summarize supported documents, create folders, rename files, copy files, and move files. It must show the target paths and the planned changes before a major operation.

Deletion is high risk. A permanent delete must never be inferred from a vague request, and it must require explicit confirmation immediately before execution. When possible, use a reversible operation such as moving the item to a quarantine or recycle location rather than permanently deleting it.

| Operation | Default risk | Confirmation expectation |
|---|---:|---|
| Search or preview | Low | Usually not required |
| Read a local document | Low to medium | Required if the file is sensitive or outside the selected scope |
| Create a folder | Medium | Explain the target and purpose |
| Rename, copy, or move | Medium | Show source and destination before approval |
| Delete or overwrite | High | Explicit confirmation is mandatory |
| Upload or share | High | Explicit confirmation is mandatory, including destination and data scope |

BRIENNE AI must not store passwords, authentication tokens, or other secrets in conversation memory or audit logs.

## 9. Desktop automation

Desktop automation uses approved keyboard, mouse, and application workflows. Before sensitive or destructive automation, BRIENNE AI should explain the intended action, identify the target application, ask for confirmation, execute only after approval, and write an audit record.

Keep the emergency stop button visible. If supported by the implementation, the global shortcut `CTRL + SHIFT + ESCAPE` provides an additional emergency stop. The user should also know how to interrupt the process using the operating system if the assistant becomes unresponsive.

Do not leave automation running unattended when it can type, submit, delete, upload, send, purchase, or change important settings. Review the action log after every significant workflow.

## 10. System dashboard

The System view displays current health information without requiring the assistant to guess. It may include CPU usage, RAM usage, disk usage, battery state, network status, running applications, Ollama status, and the active AI model.

The dashboard refreshes in the background so that monitoring does not freeze the PyQt6 interface. Read the values as indicators rather than diagnoses. A high CPU or memory value may reflect a normal model load, a separate application, or a temporary task.

| Indicator | What it helps you assess |
|---|---|
| CPU | Whether the processor is under sustained load |
| RAM | Whether model inference or other applications may be memory constrained |
| Disk | Whether the system or model storage is running low |
| Battery | Whether long local inference may require external power |
| Network | Whether optional online features may be available |
| Running applications | Which processes are active and eligible for approved inspection |
| Ollama | Whether the local model service is reachable |
| Active model | Which local model will process the next chat request |

## 11. Projects and coding assistance

Projects mode helps with planning, explaining, reviewing, and documenting software work. It can discuss Python, JavaScript, HTML, CSS, PHP, SQL, Java, and C++, subject to the capabilities and limitations of the selected local model.

Ask BRIENNE AI to explain a concept, review a function, identify likely errors, propose a test plan, or describe a project structure. Use a bounded folder or file selection when sharing local project context. The assistant should not silently overwrite project files. Before changes are written, it should show a proposed patch or a clear summary of the modifications and request confirmation.

A productive workflow is:

1. State the objective and constraints.
2. Select only the project files needed for analysis.
3. Ask for a plan before asking for modifications.
4. Review the proposed change or patch.
5. Approve the specific files and operations.
6. Run tests or a manual verification step.
7. Review the audit record.

## 12. Defensive security analysis

Security analysis is limited to authorized defensive use on the local computer. It can inspect resource-intensive processes, review selected logs, identify basic configuration weaknesses, and recommend improvements.

BRIENNE AI must not provide or execute credential theft, malware, ransomware, denial-of-service, unauthorized persistence, exploitation, authentication bypass, or data-theft workflows. If a request crosses those boundaries, the assistant should decline the unsafe portion and offer a defensive alternative, such as log review, patch guidance, permission auditing, or isolation steps.

Treat security recommendations as informational until verified. Do not change firewall rules, permissions, startup settings, or other important configuration without understanding the effect and explicitly approving the change.

## 13. Memory and privacy controls

The Memory view manages local SQLite data such as user preferences, conversation summaries, approved application locations, frequently used commands, and assistant settings. Memory is intended to improve continuity, not to become a hidden archive of everything the user says.

The user should be able to view, search, delete individual memories, clear all memory, or disable memory. Use the privacy controls before sharing the computer with another person or before collecting sensitive project context.

| Control | Result |
|---|---|
| View memory | Shows stored items and their categories |
| Search memory | Finds matching stored items |
| Delete item | Removes one selected memory |
| Clear all memory | Removes all assistant memory after confirmation |
| Disable memory | Prevents new memory entries while retaining or deleting existing items according to the chosen setting |

Do not store passwords, authentication secrets, payment data, private keys, or recovery codes in memory. Audit logs should record actions and results without copying sensitive content unnecessarily.

## 14. Safety levels and confirmations

Every external action should be classified before execution. The classification describes the action's potential impact, not the assistant's confidence.

| Level | Examples | Required behavior |
|---|---|---|
| Low risk | Answering questions, showing system status, opening an approved application | Execute only within the approved scope and report the result |
| Medium risk | Creating files, typing into an application, moving or renaming files | Explain the plan and request confirmation when the target or impact is material |
| High risk | Deleting files, installing software, changing important settings, sending messages, uploading or sharing information | Require explicit, immediate confirmation and record the result |

A confirmation should state **what** will happen, **where** it will happen, **which data** will be affected, and **what cannot be easily undone**. A vague confirmation such as “Proceed?” is insufficient for high-risk actions.

## 15. Error handling

When an operation fails, read the complete message in the center workspace and check the logs. Common messages and first responses are shown below.

| Message or symptom | First response |
|---|---|
| Ollama is not running | Start Ollama, wait a few seconds, and run the connection check again |
| No local model found | Install a model with `ollama pull <model>` and select it in Settings |
| Model unavailable | Confirm the exact tag with `ollama list`; update `.env` if necessary |
| Microphone unavailable | Check the selected input device and Windows microphone permission |
| Speech recognition failed | Repeat the request in a quieter environment or switch to text input |
| Text-to-speech failed | Test a Windows speech voice or disable TTS and continue with text chat |
| Application not found | Add the correct path through the approved registry; do not enter an unverified path |
| Automation failed | Press emergency stop, inspect the target window, and retry only after review |
| Permission denied | Stop and decide whether the operation should be performed manually or with a deliberate permission change |
| Database error | Close BRIENNE AI, back up `data`, inspect logs, and repair or recreate the local database only after preserving required data |

For installation and environment problems, consult `INSTALLATION_GUIDE.md` and `TROUBLESHOOTING.md`.

## 16. Recommended daily workflow

Start by verifying that **Human Override: ON** is visible and that the active model is the one you intend to use. Use Chat for explanations and planning. Use Voice only when the microphone and speech mode are clearly identified. Before any file or desktop action, inspect the structured plan and target paths. Approve only the minimum scope required for the task, then confirm the result and review the audit log.

At the end of a session, stop any ongoing automation, disable voice input if it is no longer needed, and close the application before moving or backing up its database. If the computer is shared, review and clear memory according to your privacy needs.

## 17. Example commands

The following examples are safe starting points:

```text
What is the current Ollama status?

Summarize this selected document without changing it.

Plan a new project structure for a Python desktop application. Do not create files yet.

Show me the approved application entry for Visual Studio Code.

What high-resource processes are currently running? Only report them; do not stop anything.
```

For actions, use explicit boundaries:

```text
Create a folder named Reports inside my selected project directory. Show me the plan first.

Move these three selected files into Reports after I confirm the source and destination.
```

Avoid ambiguous commands such as “clean everything,” “delete the old stuff,” or “send this to everyone.” These requests do not provide a safe target or scope.

## 18. Limitations

Local model quality depends on the selected model and the computer's available resources. BRIENNE AI can make mistakes, misunderstand a request, or misclassify an action. It should not be treated as a replacement for human review, professional advice, operating-system security controls, backups, or application-specific safeguards.

Offline operation means that local components can continue to work without internet access; it does not mean that every voice recognizer, external integration, documentation lookup, or online service is available offline. The interface must distinguish local availability from optional network-dependent features.

## 19. Support information to collect

When reporting a problem to a maintainer, include the operating-system version, Python version, BRIENNE AI version, Ollama version, model tag, the exact user-visible error, and the relevant non-sensitive log excerpt. Remove usernames, file paths that reveal private information, tokens, and document contents before sharing logs.

**Do not include passwords, API keys, private keys, or authentication cookies in a bug report.**

## Author

**Manus AI**

---
