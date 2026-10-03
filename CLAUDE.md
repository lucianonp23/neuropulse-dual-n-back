# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NeuroPulse Dual N-Back: a browser-only working-memory trainer (dual n-back task). It started as a Google AI Studio app (see README.md / `metadata.json`). There is no backend and there are no tests.

## Commands

- `npm install`: install dependencies
- `npm run dev`: Vite dev server on port 3000, bound to 0.0.0.0
- `npm run build`: production build to `dist/`
- `npm run lint`: type-check only (`vue-tsc --noEmit`, covers `.vue` SFCs). There is no ESLint and there are no tests.
- `npm run preview`: serve the built `dist/`. Use this (not `dev`) to test PWA behavior; the service worker is only generated in production builds.
- `npm run generate-pwa-assets`: regenerate the PNG/ICO icons in `public/` from `public/icon.svg` (config in `pwa-assets.config.ts`). Run it after changing the SVG.

Another local project may also be bound to port 3000 on IPv6; if `localhost:3000` returns an Express 404, use `http://127.0.0.1:3000`.

`GEMINI_API_KEY` (in `.env.local`) is passed to the client as `process.env.GEMINI_API_KEY` by `vite.config.ts`, but nothing in `src/` uses it, and `@google/genai` is not installed.

## Stack caveats

- The app is **Vue 3** (`<script setup lang="ts">`) with Tailwind v4 (via `@tailwindcss/vite`), `lucide-vue-next` and `vue-sonner`. There are no shadcn components and the `shadcn` package is not installed; `components.json`, the shadcn-style theme tokens in `src/index.css`, and `lib/utils.ts` (`cn`, not imported anywhere) are leftovers from the AI Studio template.
- The `@/` alias resolves to the **repo root**, not `src/`. So `@/lib/utils` is `lib/utils.ts`, and app code lives at `src/lib/*`.
- Leave the `server.hmr` / `DISABLE_HMR` block in `vite.config.ts` alone. AI Studio relies on it.
- **PWA:** `vite-plugin-pwa` in `vite.config.ts` generates the manifest and a Workbox service worker (`registerType: 'autoUpdate'`, precaches all built assets for offline use). iOS needs the extra `apple-*` tags and `apple-touch-icon` in `index.html`. The status bar is `black-translucent`, so `body` gets `env(safe-area-inset-*)` padding in `src/index.css`. Keep the `#0a0a0a` background/theme colors in sync across manifest, `index.html`, `index.css` and `pwa-assets.config.ts`.
- User-facing text (toasts, labels) is in **Brazilian Portuguese**. Keep new UI strings in pt-BR.

## Architecture

Three layers, each only depending on the ones below it:

- **`src/lib/`: framework-free logic.** No Vue imports.
  - `game-logic.ts`: types, constants (`MIN_N`/`MAX_N`, `LEVEL_UP_THRESHOLD`) and pure functions. `generateSequence(n, trials)` produces random position (0–8, 3×3 grid) and letter (A–H) pairs and injects matches about 30% of the time. `isMatch` is the single definition of an n-back match. `calculateAccuracy` scores each modality as `correct / (totalMatches + falsePositives)` and averages the two in dual mode (`dual` only affects scoring).
  - `audio/audio-service.ts`: singleton `audioService` on the Web Audio API. Stimulus modes `harmonic` and `pure` synthesize a tone per letter (`LETTER_FREQUENCIES`), and `speech` uses `speechSynthesis` with phonetic spellings from `audio/speech-languages.ts`. Feedback cues go through the private `playTone` helper (oscillator + gain envelope described as `[offset, gain]` points). `init()` must run inside a user gesture to unlock the AudioContext.
  - `storage.ts`: `loadJSON`/`saveJSON` and every localStorage key (`STORAGE_KEYS`). Always use these instead of touching `localStorage` directly.
- **`src/composables/`: reactive state and rules.** `useGameSettings`, `useAudioSettings` and `useGameSession` are app-wide singletons built with `createSharedComposable`, which runs them in a detached `effectScope` so state and watchers outlive the component that first used them. Components call these directly instead of receiving the state through props.
  - `useGameSession` owns the session. **The trial loop is explicit:** `startGame` → `showTrial(i)` (plays the letter, schedules `endTrial` after `settings.interval`) → `endTrial(i)` (counts misses, then `showTrial(i + 1)` or `finishSession`). `quitSession`/`finishSession` must clear the timers. Responses go through `respond(modality)`, which allows one answer per modality per trial and ignores answers while `currentIndex < n`. In `finishSession`, accuracy > 90% with `autoLevelUp` raises N by 1 (max 8). There is no automatic level-down.
  - `useAudioSettings` keeps a reactive mirror of `audioService.settings` (exposed read-only as `audio`). Change audio settings only through its actions so the service and the mirror stay in sync.
  - `useKeyboardShortcuts` handles `A`/`L`/`M`/`Esc` during a session.
- **`src/components/`: UI.** `App.vue` only switches between `setup/SetupView`, `game/GameView` and `results/ResultsView` by `phase` (`idle` → `playing` → `results`). Views and feature components read composables. Leaf components (`ui/*`, `ResponseButton`, `SpatialGrid`, `AccuracyGauge`, `ModalityStatsCard`, `LevelProgressBanner`) take props and emit events.
