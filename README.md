<div align="center">

# 🧠 NeuroPulse — Dual N-Back

**A browser-based working memory trainer built on the Dual N-Back task.**

![Vue](https://img.shields.io/badge/Vue_3-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6F00)

<!-- Replace with the deploy URL once available -->
[**🔗 Live demo**](#) · [Features](#-features) · [Getting started](#-getting-started)

English · [Português](README.pt-BR.md)

<!-- Cover image: save it as docs/screenshots/hero.png (or .gif) -->
<img src="docs/screenshots/hero.png" alt="NeuroPulse main screen" width="800" />

</div>

---

## 📖 About

**Dual N-Back** is a cognitive exercise used in working memory research. Each round lights up a position on a 3×3 grid while a letter plays at the same time. The player has to signal when the current position and/or letter match the ones from **N rounds back**.

NeuroPulse runs entirely in the browser, with no backend. Sounds are synthesized in real time with the Web Audio API, and progress is saved locally.

## ✨ Features

- **Two simultaneous stimuli:** a position on the 3×3 grid and a spoken or played letter, each with its own response button.
- **Adjustable N level (1 to 8)**, with **automatic level-up** when session accuracy goes above 90%.
- **Configurable sessions:** 15 to 40 rounds, with 1 to 5 seconds per stimulus.
- **Three audio stimulus modes:**
  - *Harmonic* and *Pure tone*: each letter has its own musical note (C4 to C5), synthesized on the fly.
  - *Voice*: letters spoken via Speech Synthesis in 6 languages (pt-BR, en-US, es-ES, fr-FR, de-DE, it-IT), with adjustable speed.
- **Audio and visual feedback** for hits, errors and misses, or a **blind mode** with no feedback during the session.
- **Performance report** at the end of each session: hits, false positives and misses per modality.
- **Keyboard shortcuts:** `A` position · `L` letter · `M` mute · `Esc` quit.
- **Saved preferences** in `localStorage`: level, audio and feedback.

> The interface is in Brazilian Portuguese.

## 📸 Screenshots

<!--
  Put the images in docs/screenshots/ using the names below
  (or adjust the paths). PNG or GIF; ~1200px wide works well.
-->

| Settings | Session in progress |
| :---: | :---: |
| <img src="docs/screenshots/settings.png" alt="Settings screen" width="400" /> | <img src="docs/screenshots/gameplay.png" alt="Session in progress" width="400" /> |
| **Audio settings** | **Performance report** |
| <img src="docs/screenshots/audio.png" alt="Audio settings" width="400" /> | <img src="docs/screenshots/results.png" alt="Performance report" width="400" /> |

## 🛠️ Tech stack

| Layer | Tools |
| --- | --- |
| UI | Vue 3 (Composition API, `<script setup>`), Tailwind CSS v4, Lucide Icons, vue-sonner |
| Language | TypeScript |
| Audio | Web Audio API (oscillators and envelopes), Web Speech API |
| Build | Vite |

## 🏗️ Architecture

```
src/
├── App.vue                  # Switches between the three screens by game phase
├── components/
│   ├── setup/               # Settings screen (training parameters, audio studio)
│   ├── game/                # Session screen (grid, response buttons, progress)
│   ├── results/             # Performance report
│   ├── layout/              # Header and footer
│   └── ui/                  # Reusable primitives (toggle, range input)
├── composables/             # Reactive state and rules (settings, audio, session, shortcuts)
└── lib/                     # Framework-free logic
    ├── game-logic.ts        # Sequence generation and scoring (pure functions)
    ├── storage.ts           # Safe localStorage access
    └── audio/               # Audio engine and speech language data
```

The code is split into three layers. Each one only depends on the layers below it:

- **`lib/`: pure logic, no Vue.** `game-logic.ts` generates sequences with about 30% intentional matches and scores accuracy as `hits / (matches + false positives)`. The audio engine builds every feedback sound from a single `playTone` helper that takes the gain envelope as data.
- **`composables/`: state and rules.** Shared composables (`useGameSession`, `useGameSettings`, `useAudioSettings`) work as a small store without extra libraries. The round loop is explicit: `showTrial`, then `endTrial`, then the next `showTrial`. That keeps stimulus timing easy to follow, and quitting a session clears every timer.
- **`components/`: UI only.** Screens read the composables. Leaf components receive props and emit events.

The `AudioContext` is only created after a user interaction, to respect browser autoplay policies.

## 🚀 Getting started

**Requirement:** Node.js 20 or later.

```bash
git clone https://github.com/lucianonp23/neuropulse-dual-n-back.git
cd neuropulse-dual-n-back
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the build locally |
| `npm run lint` | Type-check with `tsc` |

## 🗺️ Roadmap

<!-- Edit freely; these are just suggestions -->
- [ ] Session history with a progress chart
- [ ] Unit tests for `game-logic.ts`
- [ ] PWA support for offline use

## 👤 Author

**Luciano Pena**

<!-- Fill in your links -->
[LinkedIn](#) · [GitHub](https://github.com/lucianonp23) · [Portfolio](#)
