# CLAUDE.md — Dax the Cat Game

## Project Overview

A Phaser 3 game for kids (ages 5-7) with two adventures. All art is generated programmatically in `BootScene.js` using Canvas API — there are no external image assets.

## Dev Setup

```bash
npm run dev   # Vite dev server at http://localhost:8080
```

Game is exposed as `window.game` for debugging. To jump to a scene in the browser console:
```js
window.game.scene.stop('CurrentScene');
window.game.scene.start('TargetScene', { optionalData: true });
```

## Architecture

- **`src/main.js`** — Phaser config, scene registration, HiDPI text patch
- **`src/scenes/BootScene.js`** — ALL texture generation (canvas drawing functions). This is the largest file. Every sprite in the game is a function here (e.g., `generateDaxTexture()`, `generateDragonTexture()`).
- **Scene flow:** BootScene -> TitleScene -> [Adventure 1 or 2 scenes] -> WinScene
- **Physics:** Arcade physics. `collider` = blocks movement, `overlap` = pass-through with callback.
- **Dialog:** Typewriter effect system used in PlatformScene, FantasyScene, etc. SPACE advances, ESC/Skip skips.

## Key Conventions

- **No external assets.** All textures are procedurally generated in BootScene.js using Canvas 2D.
- **Scene data passing:** `this.scene.start('SceneName', { key: value })`, received in `init(data)`.
- **Text rendering:** All text uses the HiDPI patch in main.js (`setResolution(devicePixelRatio)`). Use `fontFamily: 'Arial'` with stroke for readability.
- **Keep it simple and forgiving.** No harsh death mechanics. Target audience is a 5-7 year old.
- **Tom Cat follows Dax** using a recorded position array with delay. Uses `overlap` (not `collider`) so Tom doesn't block Dax's movement. Bounce off Tom's head for super jumps.

## Scene Details

### Adventure 1: Fish Dinner
1. **HouseScene** — Dax's bedroom, dialog with Tom
2. **PlatformScene** — Side-scroller, town with cats, walk to river. Has floating platforms, collectibles, trees. Tom follows with `tomFollowDelay=40`, interpolation `0.08`. Bounce cooldown `600ms`.
3. **FishingScene** — Catch 10 fish, timing-based
4. **CookingScene** — Cook the fish
5. **WinScene** `{ adventure: 1 }` — Family dinner celebration

### Adventure 2: Kingdom of Fantasy
1. **DreamTransitionScene** — White fade dream effect
2. **FantasyScene** — Magical land, meet Silver the Dragon. Auto-encounter sequence with dialog.
3. **FlyingScene** — Vertical dodge game on dragon's back. Left/right only controls, auto-scrolling, valley terrain, progressive difficulty, ~60-90 seconds. 3 lives, forgiving.
4. **PalaceScene** — Crystal Palace throne room. Council of magical creatures.

### Adventure 3: The Crystal Palace
1. **PalaceScene** — Crystal palace interior with great table, crystal furniture. Creature leaders: Bramblethorne (gnome), Glimmer (pixie), Thunderfoot (giant), Starfang (magic wolf). Queen Aurora (Fairy Queen, blue wings/crystal dress) reveals Liliana has been kidnapped by wizard Malachar, along with the Book of All Tales (allows time travel). Balance of good/evil breaks by sunset. Dax is chosen to lead the quest.
2. **WinScene** `{ adventure: 3 }` — "To be continued..."

### TitleScene
Start menu with:
- Adventure 1: Fish Dinner (green button)
- Adventure 2: Kingdom of Fantasy (purple button)
- Adventure 3: The Crystal Palace (blue button)
- Quick Play: Fishing, Cooking, Flying (smaller buttons)

## Texture Generation (BootScene.js)

Key generator functions:
- `generateDaxTexture()` — Main cat character (orange tabby)
- `generateCatTextures()` — Town cats, Tom (brother)
- `generateDragonTexture()` — Silver the Dragon (large, detailed)
- `generateFlyingDragonTexture()` — Dragon seen from above (for flying scene)
- `generateFlyingObstacles()` — Trees, mountains, houses for flying scene
- `generateCastleTexture()` — Crystal Palace end goal
- `generateFairyQueenTexture()` — Queen Aurora (blue wings, crystal dress, crown)
- `generateGnomeTexture()` — Bramblethorne the gnome leader
- `generatePixieTexture()` — Glimmer the pixie (golden wings, green outfit)
- `generateGiantTexture()` — Thunderfoot the giant
- `generateMagicWolfTexture()` — Starfang the magic wolf (purple, glowing eyes)

Dragon drawing order matters: right ear fin is drawn BEFORE the head (so it appears behind the snout in 3/4 view).

## Pending / TODO

- [ ] **Objects on floating platforms** — Move some collectibles from ground to platforms in PlatformScene
- [ ] **Trees on path to river** — Add tree decorations along the route in PlatformScene
- [ ] **Cat dialog** — Town cats should say something when Dax passes by
- [ ] **Clean-up pass** — General polish on transitions and graphics
- [ ] **Flying scene polish** — FlyingScene exists but may need tuning/testing
- [ ] **Text rendering review** — User reported some text still looks odd in dialog windows
