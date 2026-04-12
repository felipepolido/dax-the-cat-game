# Dax the Cat

A 2D adventure game built with **Phaser 3**, created by **Daniela & Felipe** as a father-daughter project.

## About

Dax is a cartoon cat who goes on adventures! The game features hand-drawn programmatic art, dialog systems, mini-games, and a story designed for kids ages 5-7.

## Tech Stack

- **Engine:** Phaser 3 (v3.80) with Arcade Physics
- **Build:** Vite (dev server on port 8080)
- **Art:** All sprites/textures generated programmatically via HTML Canvas API (no external assets)
- **Language:** Vanilla JavaScript (ES modules)

## Getting Started

```bash
npm install
npm run dev     # starts dev server at http://localhost:8080
npm run build   # production build to dist/
```

## Game Structure

### Adventures

**Adventure 1: Fish Dinner**
- `HouseScene` — Dax wakes up in his house, talks to brother Tom
- `PlatformScene` — Side-scrolling walk through town to the river (with Tom following)
- `FishingScene` — Catch 10 fish with timed claw swipes
- `CookingScene` — Cook the fish into a meal
- `WinScene` — Adventure 1 ending

**Adventure 2: Kingdom of Fantasy**
- `DreamTransitionScene` — Dreamy transition into the fantasy world
- `FantasyScene` — Meet Silver the Dragon in a magical land
- `FlyingScene` — Fly on Silver's back through a valley (dodge obstacles)
- `WinScene` — Adventure 2 ending ("To be continued...")

### Core Scenes

| Scene | File | Purpose |
|-------|------|---------|
| `BootScene` | `src/scenes/BootScene.js` | Generates ALL textures programmatically |
| `TitleScene` | `src/scenes/TitleScene.js` | Start menu with adventure/quick-play selection |
| `HouseScene` | `src/scenes/HouseScene.js` | Interior of Dax's house |
| `PlatformScene` | `src/scenes/PlatformScene.js` | Side-scrolling platformer town |
| `FishingScene` | `src/scenes/FishingScene.js` | Fishing mini-game |
| `CookingScene` | `src/scenes/CookingScene.js` | Cooking mini-game |
| `DreamTransitionScene` | `src/scenes/DreamTransitionScene.js` | Dream sequence transition |
| `FantasyScene` | `src/scenes/FantasyScene.js` | Dragon encounter with dialog |
| `FlyingScene` | `src/scenes/FlyingScene.js` | Flying dodge mini-game |
| `WinScene` | `src/scenes/WinScene.js` | Victory screens for both adventures |

### Key Architecture

- **All textures** are in `BootScene.js` — generated via Canvas API helper functions (`generateDaxTexture()`, `generateDragonTexture()`, etc.)
- **Dialog system** uses typewriter effect, SPACE to advance, ESC/Skip button to skip
- **Scene data passing** via `scene.start('SceneName', { key: value })`
- **Game instance** exposed as `window.game` for debugging
- **HiDPI text fix** in `main.js` — patches Phaser text factory to render at native `devicePixelRatio`

## Controls

- **Arrow keys** — Move Dax (left/right/jump)
- **SPACE** — Interact / advance dialog
- **ESC** — Skip dialog sequences

## Features

- Programmatic cartoon art style (no external image files)
- Dialog system with typewriter text effect
- Tom Cat follows Dax with delayed path recording
- Bounce off Tom's head for super jumps
- Floating platforms with collectible objects
- Fishing mini-game with timing mechanics
- Cooking mini-game
- Fantasy dream world with dragon encounter
- Flying dodge mini-game on dragon's back
- Title screen with adventure selection and quick-play options
- Scene transitions with fade effects
- Forgiving gameplay designed for young children
