# BRIENNE AI Web Application

This directory contains the source for the BRIENNE AI public landing page and conversational web application. It uses React, TypeScript, Express, tRPC, and Drizzle ORM.

## Included capabilities

The application provides a responsive product landing page, server-side AI chat, account-owned persisted conversations, visible current-information handoffs, and browser-native voice input and speech output. The animated Field Instrument background respects each visitor's `prefers-reduced-motion` setting.

## Local development

Install the project dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Run static checks and tests before committing changes:

```bash
pnpm check
pnpm test
```

## Data and privacy

Signed-in conversation history is stored per account. Unauthenticated chat remains available but is not persisted. The browser voice controls use the Web Speech APIs available in the visitor's browser; microphone permissions remain under visitor control.

## Repository structure

| Path | Purpose |
|---|---|
| `client/` | React interface, animations, browser voice controls, and chat console |
| `server/` | tRPC API, AI chat procedure, and authorization boundaries |
| `drizzle/` | Database schema and migrations for persisted conversations |
| `shared/` | Shared types and constants |
| `todo.md` | Implementation checklist and history |
