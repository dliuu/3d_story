# Owen & Yilin — 3D wedding invitation (isometric tower)

Scroll-driven 3D wedding story inspired by the [Three.js Journey](https://threejs-journey.com/) homepage: a **vertical stack of five isometric “rooms”**. The **camera stays fixed** in isometric view; **scrolling moves the whole tower** on the Y axis so each floor passes through the frame. The **right-hand HTML panel** swaps chapter copy as the active floor changes. Canvas **arrow buttons** jump floors if scrolling is awkward.

This repo is a **Vite + Three.js skeleton** with procedural fallback geometry until Blender-exported `.glb` dioramas are added. **“How we met”** (`FLOORS` **index 1**, `y = 6`) uses a detailed procedural **`LibraryScene`** (study table, Owen & Yilin, shelves, window, overhead light); optional textures go under **`public/textures/library/`**.

---

## Tech stack

| Piece | Role |
|--------|------|
| **Vite** | Dev server, build, asset pipeline (`.glb`, `.gltf`, `.hdr` included) |
| **three** | WebGL scene, orthographic isometric camera, lights, shadows |
| **gsap** | Smooth `goTo()` tweens when using floor nav dots |
| **Web Audio API** | Optional ambient track with filter/gain driven by scroll progress |

---

## Repository layout

```
owen-yilin-3d/
├── index.html                 # Split UI: loader, canvas (left), story panels, nav, progress bar
├── package.json
├── vite.config.js             # Port 3000, glsl plugin, build → dist/
├── README.md
│
├── public/
│   ├── models/                # Blender .glb dioramas (optional)
│   ├── audio/                 # e.g. ambient.mp3 (optional)
│   └── textures/library/      # Optional maps for LibraryScene (wood_desk, mcgill_red, …)
│
├── dist/                      # `npm run build` output (generated)
│
└── src/
    ├── main.js                # Entry: CSS import, Experience bootstrap, audio + RSVP UI
    ├── Experience.js          # Singleton: scene graph, resize, lighting, tick loop wiring
    │
    ├── core/
    │   ├── constants.js       # FLOOR_HEIGHT, FLOORS[], MAX_TOWER_Y (scroll range)
    │   ├── EventEmitter.js    # Minimal on/off/emit
    │   ├── AssetLoader.js     # GLTF (+ Draco), texture, HDR, audio; progress + complete
    │   ├── AudioController.js # Fetch/decode MP3; play/pause; scroll-reactive EQ/gain
    │   ├── Camera.js          # Fixed OrthographicCamera, isometric position & resize
    │   ├── Renderer.js        # WebGLRenderer: ACES, sRGB, soft shadows, purple clear
    │   ├── ScrollController.js# Wheel/touch/keys → progress; damping; getTowerY(); goTo()
    │   ├── FloorTracker.js    # Maps progress (0–1) → active floor index 0–4
    │   └── HTMLPanelController.js # .story-panel + #floor-nav sync; onNavClick hook
    │
    ├── world/
    │   ├── scenes/
    │   │   └── LibraryScene.js  # Floor 1 interior: library diorama (procedural)
    │   ├── Tower.js           # THREE.Group `tower`: GLB floors or ProceduralFloors
    │   ├── Staircase.js       # (unused in current tower build; kept for reference)
    │   └── ProceduralFloors.js# Room shells + per-floor props; imports LibraryScene for i===1
    │
    └── styles/
        └── main.css           # 60/40 split, panels, nav, loader, progress, responsive rules
```

---

## How it works (runtime)

1. **`ScrollController`** accumulates user input into a **target progress** (0–1) and **lerps** the current progress (damping **~0.06**).
2. **`Tower.setY(scroll.getTowerY())`** sets `tower.position.y = -(progress × MAX_TOWER_Y)` so the stack slides through the fixed camera frustum.
3. **`FloorTracker`** splits progress into **five equal bands** and sets **`activeFloorIndex`**.
4. **`HTMLPanelController.setActivePanel(index)`** toggles `.active` on story panels and nav dots (opacity crossfade in CSS).
5. **`Renderer.render()`** draws the scene; **`AudioController.updateWithProgress`** adjusts low-pass and gain when music is playing.
6. **`AssetLoader`**: if the manifest is empty, **`complete`** fires after a short delay so the loader overlay can dismiss. If **every** floor has a loaded `floor-{id}` GLTF in `items`, **`Experience`** can rebuild the tower from models (see below).

---

## The five floors (data)

Defined in `src/core/constants.js` (`FLOORS`): title, how they met, first date, falling in love, invitation — each with a **`y`** offset (0, 6, 12, 18, 24) and matching **`panel-0` … `panel-4`** in `index.html`.

---

## Commands

```bash
npm install          # dependencies
npm run dev          # dev server (default port 3000, may open browser)
npm run build        # production bundle → dist/
npm run preview      # serve dist/
```

---

## Adding Blender `.glb` dioramas

1. Export **glTF Binary (.glb)** with **Draco** (and transforms applied), room centered as in your Blender guide.
2. Place files under **`public/models/`**.
3. In **`src/Experience.js`**, fill **`ASSET_MANIFEST`** with entries like:

   `{ name: 'floor-title', type: 'gltf', path: '/models/title.glb' }`

   Names must match **`floor-${FLOORS[i].id}`** (e.g. `floor-how-they-met`, `floor-first-date`, …).

4. When **all five** named assets load successfully, the app **replaces** the procedural tower with the imported scenes.

---

## Adding ambient audio

Put **`ambient.mp3`** (or your file) in **`public/audio/`**. The app calls **`loadTrack('/audio/ambient.mp3')`**; playback still requires a **user gesture** (the ♪ button uses **`AudioController.toggle()`**).

---

## Tuning (quick reference)

| What | Where | Default (approx.) |
|------|--------|-------------------|
| Ortho zoom | `Camera.js` — `frustumSize` | `8` |
| Scroll sensitivity | `ScrollController.js` — `SCROLL_SPEED` | `0.0008` |
| Vertical spacing | `constants.js` — `FLOOR_HEIGHT` / `FLOORS[].y` | `6` units between floors |
| Stair lateral offset | `Staircase.js` — `x` | `3.0` |
| Camera angles | `Camera.js` — `azimuth`, `elevation` | π/4, π/5.5 |
| Scroll smoothing | `ScrollController.js` — damping | `0.06` |

---

## UI smoke test

After `npm run dev`:

- Purple canvas area (~60% width on desktop); story column ~40%.
- Five stacked rooms with stairs between; scroll moves the tower smoothly.
- Right panel and nav dots follow the active floor; nav **jumps** with GSAP.
- Bottom **progress bar** tracks scroll.
- **RSVP** uses a mailto fallback unless you set `data-rsvp-url` on the button.
- Below **768px** width, layout stacks: canvas on top, panels below.

---

## License

Private / personal project unless you add a license file.
