# Home Plan — Current QQQ Verification Certificate

Date: 2026-10-25
Artifact: `index.html`, built from `src/`
Environment: container Linux; Node/Chromium through Playwright; local Git `main` initialized for v0.4, but remote repository and deployment not verified

## Bounded corrections and implementation evidence

| ID | Contract | Source / call path | Verification | State |
|---|---|---|---|---|
| C01 | Capture one coherent fountain-first room route | `surveyStepsForRoom()` → `HomePlanSurvey.open` → room/step navigation | Chromium Quick 26 / Full 66, fountain first, desktop/mobile | VERIFIED in browser test |
| C02 | Record photo/video privately and preserve step notes | HTML file input → `attach()` → `saveAsset()` → `bridge.transaction()` → gallery | Chromium image/video attachment, preview and note persistence within test page | VERIFIED in browser test; long-term storage unverified |
| C03 | Reject unusable evidence from coverage | Preview → `markQuality('retake')` → `surveyCoverage()` | Retake count falls, approved count restores; model + browser regression | VERIFIED |
| C04 | Record explicit, source-tagged dimensions | Numeric form → `saveMeasure()` → `plan.survey.measurements` | Decimal feet to meters, estimate not qualifying, schema migration | VERIFIED |
| C05 | Do not silently mutate the layout | `applyRoom()` / `applyWall()` explicit confirmation → `resizeWallWithJunctions()` | Measured floor zone and shared wall endpoints; separate recording does not change coordinates | VERIFIED in browser/model tests |
| C06 | Export and restore full capture package | `exportPack()` → store-only ZIP + CRC → `readZip()` → `importPack()` | Chromium download, Python stdlib ZIP CRC/byte check, fresh document restore, corrupted ZIP rejected | VERIFIED in browser test |
| C07 | Remain offline by default | `index.html` embedded HTML/CSS/JS; only lazy `loadThree()` has network URL | Chromium boot with embedded editor; static source inspection | VERIFIED for test path; physical file origin unverified |
| C08 | Avoid redraw on survey-only updates | `homePlanSurveyBridge.transaction` → `transact(...surveyOnly)` | Source branch readback and editor functional regression suite | IMPLEMENTED, focused browser performance unmeasured |
| C09 | Preserve existing editor behavior | Existing app/editor unchanged outside bounded bridge and confidence badges | Model and DOM-stub runtime tests; restored app canvas after survey closes | VERIFIED in test scope |
| C10 | Public artifact excludes private footage | Whitelisted release files, Git ignore rules | Final release file whitelist/ZIP listing | VERIFIED when packaged with manifest |

## Commands executed

- `node --check src/model.js`, `node --check src/app.js`, `node --check src/survey.js`: PASS
- `node tests/model.test.cjs`: PASS
- `node tests/survey_model.test.cjs`: PASS, including randomized collision oracle equivalence
- `node tests/runtime.test.cjs`: PASS
- `python3 build.py`: PASS, single HTML with embedded source
- `python3 tests/survey_browser.py`: PASS in actual headless Chromium DOM/Canvas with `page.set_content`

## Performance evidence

An earlier pre-optimization 260-object × 250-pass CPU benchmark was ~1,344ms (~5.37ms/pass); spatial-hash optimization runs ~125–140ms (~0.5ms/pass) in this same class of synthetic run. It does not establish overall FPS, GPU performance or mobile thermal behavior. Survey metadata transactions also avoid unnecessary 3D rebuilds. No matching GPU/mobile measurements exist.

## Risks / debts

1. **Measured accuracy:** photos and guessed walls do not establish ground-truth dimensions. Data source still provisional except explicitly input tape/laser dimensions.
2. **Physical device:** smartphone camera handoff, file-origin localStorage/IndexedDB durability and touch latency not independently checked.
3. **Renderer:** custom offline perspective engine is **not Three.js**. Optional legacy WebGL Three.js r150.1 CDN mode is unbundled and not runtime-certified.
4. **Privacy:** a private survey ZIP may contain EXIF/location metadata from captured media; user must keep it private. Public source archive must exclude all room captures.
5. **Git and deployment (v0.3 baseline):** originally no Git worktree existed. A new local Git `main` was initialized for v0.4, but public repository, remote push, CI or deployment have not been verified.

Verdict: **VERIFIED for bounded browser capture/review/export/restore route; FULL 3D/OFFLINE THREE.JS AND REAL-APARTMENT ACCURACY REMAIN INCOMPLETE.**

## 2026-10-25 — Design Lab 0.4.0 implementation and verification

### Scope / authority

The current request called for research into comparable room planners, at least 20 genuinely missing capabilities, implementation, performance review, bounded forensic repairs and stage/commit/push/Pages. The active project is the prior standalone offline Home Plan with private Survey Studio. Do not confuse the now-separate research/feature implementation stage with Github remote publication; they have different proof requirements. Source comparators and the **30-row verified-vs-unverified matrix** live in `FEATURE_RECON.md`.

### Source-level changes

- New `src/studio_model.js`, `src/studio.js`, `src/studio.css`; `src/model.js` plan schema 4 migration; editor/renderer bridge and model inspector in `src/app.js`, new Design Lab shell and catalogue search/favorites; bundled `index.html` build changes.
- New `tests/studio_model.test.cjs` pure-geometry/import and budget safety checks; `tests/studio_browser.py` Chromium end-to-end actions with 30 distinct paths.
- Generated `.github/workflows/pages.yml` deploys only HTML generated from source; no personal videos, camera captures, original extracted frames, private survey ZIP or user floor-plan exports are included in public site artifact.

### Confirmed evidence on this current build

- `npm run check`: PASS for JS syntax, model, survey, studio and runtime tests. Model tests compare optimized collision decisions to a brute SAT oracle, check schema v3->v4 migration, copy locks, CSV injection and advisory grid routes.
- `python3 build.py`: PASS for a self-contained 235k-character HTML document.
- `python3 tests/studio_browser.py`: PASS; 30 user-to-action paths at desktop and mobile-sized Chromium views; JSON, CSV and report download inspection; no JavaScript page errors.
- `python3 tests/survey_browser.py`: PASS on v0.4.0; photo/video capture, preview/retake, measured geometry, private ZIP export/import and corruption rejection all passed in Chromium.
- The dynamic minimap and SVG export now include newly added zones; smart arrange excludes locked pieces from its candidate list. CSS stops favorite-star controls overrunning catalogue tiles. A false visibility default regression was corrected in `normalizeStudio()`.

### Measured / not measured

- Existing synthetic 260-item/250-pass collision model benchmark: ~135.6ms total (~0.54ms/pass) on this run. The previous release's ~1344ms (~5.37ms/pass) used the comparable brute force setup, giving ~9.9x improvement **on synthetic collision CPU work only**, not a matched device/browser FPS comparison.
- Estimated walking routes, arc/clearance warnings and study-zone area totals remain approximate; real building geometry and camera/photo reference still require physical measurements.
- User-triggered optional Three.js r150 CDN path remains unbundled and unverified. Offline default is custom Canvas perspective.
- Browser simulated mobile dimensions, not physical device capture, storage lifetime, GPU thermals or touch latency.
- Pages repository creation, remote commit, CI and deployment states remain separate from local checks and require authenticated remote evidence.

### QQQ correction ledger

| ID | Actual failure / gap | Repair | Regression proof / state |
|---|---|---|---|
| Q01 | Studio default visibility flags unexpectedly overriding their defaults | Normalize only supplied booleans, preserve defaults | Model + Chromium; VERIFIED |
| Q02 | Smart arranging could use a locked object's footprint as open space | Reject candidate collisions against fixed objects | Adversarial smart placement test; VERIFIED |
| Q03 | Newly created zones clipped out of minimap/SVG | Recompute extents from current dynamic zone/geometry set | Chromium adds sixth zone; SVG source; PARTIALLY VERIFIED (numeric extents) |
| Q04 | Catalog favorite control overflow at narrow widths | Explicit contained tile and card sizing | Screenshot at 390px; VERIFIED visually |
| Q05 | CSV notes/labels may be mistaken for spreadsheet formulae | Quote/neutralize formula-like leading characters | Unit test; VERIFIED |
| Q06 | Optimizations risk breaking survey capture and restore | Re-run v0.3 survey browser round-trip on v0.4 | Chromium full survey round-trip; VERIFIED |

### Final outcome discipline

A feature button with verified state transition is browser-verified in that scope, not proof of physical room accuracy. Publish only after real Git operations and remote workflow verification; otherwise report explicit blockers. No force push. No private media distribution.

### Matched synthetic performance proof

`node tests/performance.cjs` on this same source and container run compares 260 randomized rotated furniture footprints for 20 passes and checks the optimized pair results against the brute-force SAT oracle. Result: indexed 99.7 ms versus brute SAT 1373.9 ms including pair collection (**13.8×** relative speedup for this CPU collision check, using the same objects and runtime). This is not a whole-app FPS, GPU, browser memory or mobile heat improvement. The separate npm test microbenchmark reported ~144ms for 250 optimised passes (~0.58ms/collision pass, a different harness).

### Local publication boundary

A new local Git `main` was initialized from the explicit source-only allowlist. All originally supplied apartment photos/video and generated captures remain outside Git, ignored or omitted. The public GitHub repository was **not found** via the connected GitHub provider, and the exposed GitHub connector offers no repository creation operation; MacBook GitHub CLI authorization could not be established due DEX coordinator saturation. Hence public push and Pages are `BLOCKED`, not executed or verified. The workflow is ready to run once an authenticated `westkitty/Home-Plan` remote exists.

## 2026-10-25 — Visual Finish 0.5.0: QQQ forensic closure evidence

### Change contract and baseline

The baseline is the committed Design Lab 0.4.0 apartment planner (`def8c1d`) with version-4 schema. The requested visual finishing pass must preserve the existing furnished apartment editor and user actions, not replace a nonexistent action game's mechanics. Prior UX audit captured the mobile overflow as an actual defect. Original video walkthroughs and local captures are protected and never enter the public source ZIP.

| ID | Correction / improvement | Production implementation | Verification result |
|---|---|---|---|
| VIS-01 | Flat, visually undifferentiated apartment | `src/visuals.js` owns actual offline painter; `PerspectiveEngine.draw()` delegates to it | Actual Chromium 1440px canvas screenshots, day/evening/night, Build and Openings modes: VERIFIED |
| VIS-02 | Little material/light depth | Box-face shading and light modes; floor wood/tile/stone patterns, shadow silhouettes, glass, trims and item surface details | Real Canvas pixels differ for day/night; screenshots inspected: VERIFIED in Chromium scope |
| VIS-03 | Imprecise visual selection cues | Selected item footprint, handles, contrast label and bounded 290ms selection pulse; wall-edit endpoints remain operable | Actual canvas pixels change when selecting furniture, model/runtime tests retained: PARTIALLY VERIFIED (pulse duration visually unmeasured) |
| VIS-04 | Phone viewport expands to 1379px and hides most tools | Responsive CSS grid constraint, scrollable rail, full-width scene, contextual inspector | Chromium 390px stage 390px; 320px stage 320px, tool rail scrollable and Openings reachable: VERIFIED |
| VIS-05 | Save/Export/Studio/Survey commands unreachable on phone | `src/chrome.js` Actions popup proxies original command owners; no duplicate state mutation | Mobile browser command path Save, Export, opening tool, Survey Studio: VERIFIED |
| VIS-06 | Keyboard focus escapes dialogs, vanishes on setting redraw or mobile commands | Inert shell + modal Tab/Escape handling, Design Lab focus restoration, mobile menu focus routing | Browser keyboard Tab/Shift+Tab loop, focus on Design Lab setting and mobile Actions destinations: VERIFIED |
| VIS-07 | Visual effects could tax crowded layouts | Adaptive >80 furniture flat-shaded path with no saved-state mutation; single event-driven painter, skipping frequent effects under reduced motion | Source inspection + Chromium multi-object benchmark: PARTIAL; dense-scene headless p95 still higher than prior renderer |
| VIS-08 | Risk of broken original editing and private capture | Retain original renderer fallback, domain/model state, survey ZIP logic and event handlers | All model/runtime, 30 Design Lab browser paths, photo/video ZIP round trip and CRC corruption tests: VERIFIED in test scope |

### Executed final checks

- `python3 build.py` rebuilds self-contained HTML without runtime network dependencies; the default app does not load a remote image or JavaScript module.
- `npm run check` includes `node --check` for `src/visuals.js`, `src/chrome.js` and all existing source modules; four Node suites PASS.
- `npm run test:browser` includes old Survey Studio, Design Lab, and new visual/viewport tests. All PASS at 1440, 768, 390 and 320px Chromium viewports; no JavaScript page errors in those runs.
- Direct Chromium capture inspected actual day/evening/night lighting, Build, Openings, Furnish and Top Plan modes. The new diorama painter affects the **canvas scene itself**, not only a CSS screenshot layer.
- `git diff --check`, deterministic rebuild comparison, source privacy review and explicit public allowlist must pass before source release and any optional local Git commit.

### Performance evidence and limits

Stress draw samples were collected headlessly in identical 1440x900 Chromium contexts, using the existing bridge and matching generated geometry. A synthetic 158-item test yielded an adaptive new-renderer median ~6.2ms and p95 ~113ms, versus old renderer ~48.5ms median / ~52ms p95 in the same session. Normal 13-item plan yielded new median ~1.9ms and p95 ~6.7ms, with an extreme ~445ms outlier; old median ~1.2ms, p95 ~81ms. These short CPU measurements are sensitive to JIT, browser scheduling and headless machine load; **do not claim sustained 60 FPS or a net p95 uplift**. The high-density tail risk is open. Selection pulse is a brief event, not a perpetual render loop.

### Evidence and delivery status

- Recreated screenshots/live interaction: VERIFIED in headless Chromium via `set_content`; real file-origin browser storage and mobile hardware: UNVERIFIED.
- Five-room layout is still an illustrative starting point, not a certified architectural model.
- Offline actual renderer is Canvas perspective with custom paints; optional legacy Three.js CDN/WebGL remains unverified.
- No new commercial/licensed external assets; procedural styling only; original captures are private.
- GitHub remote, GitHub Pages, on-device GPU thermals/long-session performance: NOT VERIFIED. The absence of a remote is not a failed local renderer test.

## Model-first cockpit 0.6.0 — evidence addendum (2026-10-25)

- `npm run check`: PASS, syntax and four Node test suites; no new model/schema changes.
- `tests/survey_browser.py`: PASS, real Chromium photo/video upload, retake and private CRC-checked ZIP export/restore.
- `tests/studio_browser.py`: PASS, all 30 interaction paths and user-facing project/catalog routes in desktop and mobile emulation.
- `tests/visual_browser.py`: PASS at 1440, 768, 390, 320px. Canvas fully covers viewport; all permanent dashboard surfaces hidden; changing light and selected furniture changes Canvas pixels; on-demand help, view, Studio and Survey actions exercised.
- `tests/focus_browser.py`: PASS at all four widths. Project, Tools, View and Catalog popovers open/close via visible buttons and Escape, return keyboard focus, allow measured furniture edits and reveal all original mode buttons. Details, minimap, zoom and floor info are optional overlays; no off-screen desktop grid on mobile.
- Repaired dialog return focus: closing Studio/Survey/Help from an on-demand menu restores focus to the visible compact launcher instead of a legacy drawer button that may become hidden during transitions.
- Default control footprint (main six control rectangles): 1.9% at 1440×900, 3.57% at 768×900, 6.44% at 390×844 and 8.04% at 320×640. This is **only a layout measurement**, not an a11y/UX performance score.
- Real Android touch, screen reader accessibility, 60-FPS sustained frame pacing, Three.js WebGL and actual survey geometry remain **unverified**. No private user media in public release.

## 2026-10-25 — Icon-first architecture pass

- UI contract: default Canvas remains full viewport; tool text is subordinate to recognizable icons in the global dock and on-demand menus. All icon-only controls have programmatic names and custom descriptive tooltips. Contextual `?` dialogs appear in eight menu contexts.
- Tests: `npm run check` passed. Independent `tests/icon_ui_browser.py` passed 1440/390/320 including Build action routes and in-studio/in-survey help. Existing model-first focus sweep passed 1440/768/390/320 before final tooltip suppression tweak; Survey, Studio and visual browser suites passed sequentially in a combined invocation that later timed out. Do not represent that aggregate timeout as a full pass.
- Visual QA: inspected phone build palette and contextual help dialog screenshots; complete model still visible behind Build palette and help modal is legible at 390px.
- Known gaps: physical handset touch target tests, screen reader announcements, complete on-device GPU performance, provider push and Pages deploy are not established.

## 2026-10-25 — Scene appearance 0.8.0 QA

- **Default:** `#C9E9FF` behind the apartment; no persistent settings panel in the model-first viewport.
- **Control:** Project → Settings → native color input; arbitrary valid six-digit RGB hex, reset, tooltip and contextual guide.
- **Persistence:** independent device-local key; rejects malformed values; browser storage can be unavailable in opaque-origin environments without breaking the editor.
- **Pixel proof:** Chromium screenshot and `getImageData` comparison confirm the scene itself changes at 1440/390/320 widths; background color is not a decorative CSS-only overlay.
- **Zero-loss:** version-4 project JSON unchanged by appearance edits. Model/unit, focus, icon, visual, Design Lab and Survey Studio browser suites passed separately; original private photo/video ZIP export/restore remains intact.
- **Limits:** browser persistence exercised with a deterministic localStorage shim because this runner blocks navigable origins. The underlying storage API path is covered by the Node unit test; true cross-reload HTTP/file origin, actual touch device, optional Three.js/WebGL color update and live GitHub Pages deployment require separate provider/device proof.
