# GENIUS AI Master Prompt

This repository contains the production-oriented master build specification for **GENIUS AI**, an original AI learning, research, and productivity platform.

> Learn. Research. Create. Achieve.

**Developer:** Jerry Wanyonyi

## Contents

| File | Purpose |
|---|---|
| `genius_ai_master_prompt_updated.txt` | Complete GENIUS AI build specification, including the installable-app/PWA requirements. |
| `genius_ai_installable_app_note.md` | Implementation guidance and acceptance checklist for the install-as-app experience. |

## Installable app requirement

The updated specification requires the React/Vite implementation to support an installable Progressive Web App experience while remaining usable as a normal website. The application should invite users to install it only after meaningful use and only when the browser supports installation.

The prompt requires a non-blocking user interface with **Install Now**, **Not Now**, and **Dismiss** actions. It also requires standalone-mode detection, a web app manifest, icons, a versioned service worker, an offline fallback, privacy-aware caching, accessibility, platform-specific guidance, and README documentation.

The installation prompt is optional. Declining it must never disable GENIUS AI's core chat, study, research, document, or workspace features.

## Scope

The master prompt describes a local-first, no-paid-API-key-required architecture with Ollama support, offline fallback tools, study mode, research mode, document analysis, voice features, coding assistance, project workspaces, privacy controls, Streamlit support, React/Vite support, Node.js support, testing, and deployment documentation.

This repository contains specifications and implementation guidance. It is not itself the complete GENIUS AI application source code.

## License

No license has been selected yet. Add a license before redistributing the specification or using it as the basis for a public software project.
