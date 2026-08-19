# GENIUS AI — Installable App Requirement

The master prompt now includes a dedicated **Installable App Experience** section. The React/Vite implementation is required to function as an installable Progressive Web App while remaining usable as a normal website.

## Required behavior

GENIUS AI should wait until the user has meaningfully interacted with the app before showing a non-blocking prompt such as:

> Install GENIUS AI on your device for faster access and an app-like experience.

The prompt should provide **Install Now**, **Not Now**, and **Dismiss** actions. It must not appear when GENIUS AI is already installed or running in standalone mode, and it must remember dismissal locally without storing private conversation data. Declining installation must never disable chat, study, research, document, or other core features.

## Platform handling

The React/Vite version must include a web app manifest, application icons, a versioned service worker, an offline fallback, install-state detection, and README instructions for installation and removal. The implementation must use the browser installation event when available rather than displaying a misleading custom prompt.

On iPhone and iPad, where an automatic installation event may not be available, the interface should provide optional **Share → Add to Home Screen** guidance. On desktop and Android, it should show the in-app install flow when supported. If installation is unavailable, the prompt should be hidden or replaced with a short explanation in Help or Settings.

The Streamlit version remains browser-based. It may provide a Help or Settings card explaining the browser's **Install** or **Add to Home Screen** option when supported, but it must not claim to be a native desktop application.

## Updated source file

Use `genius_ai_master_prompt_updated.txt` as the revised build specification. Section 47 was inserted immediately before the existing final implementation instructions so that the new requirement is included alongside the rest of the project requirements.

## Acceptance checklist

| Area | Acceptance condition |
|---|---|
| Manifest | Name, short name, description, start URL, standalone display mode, colors, and 192px/512px icons are defined. |
| Install prompt | Appears after meaningful use, is non-blocking, and has Install Now, Not Now, and Dismiss actions. |
| Installed state | Prompt is suppressed in standalone mode or after successful installation. |
| Privacy | Service-worker caching excludes private conversations and uploaded user files unless storage is explicitly enabled. |
| Accessibility | Prompt works with keyboard navigation, screen readers, and mobile layouts. |
| Platforms | Desktop, Android, and iOS behavior is documented accurately. |
| Offline | The app shell has a graceful offline fallback and does not expose sensitive cached content. |
| Documentation | README includes installation and uninstall instructions. |
| Streamlit | The browser version provides guidance only where supported and makes no native-app claim. |
| Testing | Installation, dismissal, standalone reopening, offline fallback, and privacy behavior are tested where practical. |

The installation prompt is intentionally optional and respectful: it invites the user to install GENIUS AI without interrupting normal use or implying that installation is mandatory.
