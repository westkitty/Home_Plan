# Home Plan — Operational State

Updated: 2026-10-25

## Purpose
Interactive apartment layout editor that helps a spatially challenged resident understand and experiment with furniture, doors, windows, walls, outlet markers and room adjacency. Offline standalone HTML is mandatory.

## Verified source baseline
- Starting source was `index.html`, a 2D Canvas editor with provisional rooms/furniture and JSON/PNG export.
- Video evidence exists as two local MP4s, but original videos and extracted contact frames must not be included in public bundles.
- Entrance is by the fountain per user; locations otherwise provisional.

## New implementation
- Single-page `index.html` compiled from `src/` with no external references for the offline engine.
- Perspective camera with orbit, pan, zoom; dollhouse/3D/top presets.
- Furniture creation/move/rotate/dimension changes, selected-object inspector and collision hints.
- Wall start/end manipulation, shift and add wall via two taps; door/window/opening/outlet wall markers.
- Room focus, minimap, local autosave, named arrangements, JSON import/export with v1 migration, SVG and PNG exports.
- Optional Three.js WebGL renderer that can be activated via explicit network action, not required for offline work.

## Current evidence
- `node --check` source JavaScript: PASS.
- Model tests: PASS, including sanitization, collision geometry, v1 import migration.
- Runtime tests with synthetic DOM/Canvas: PASS for boot, orbit projection roundtrip, adding/removing/rotating furniture, moving wall endpoints, drawing walls, saving, exporting.
- Browser visual/runtime smoke: UNVERIFIED — local Chromium navigation blocked by environment (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- Optional Three.js renderer: IMPLEMENTED, UNVERIFIED — Three.js could not be bundled or fetched by the build environment.
- Device FPS/thermal/accessibility: UNVERIFIED.

## Protected invariants
- Offline editor remains functional without network.
- Opening app never silently pulls remote scripts, changes public accounts, or exports layout data.
- Architecture data must be labeled unmeasured; outlets not fabricated.
- All geometry state persists via versioned JSON and can be imported; v1 can be migrated.
- Dragging or editing a wall does not silently relocate other walls/rooms without warning.
- Raw videos and personal reference imagery not distributed in public code output.

## Known limits / next checks
- Build process requires Python for regeneration; end-user HTML does not.
- Wallpaper, cabinet detail, window orientation, door swings, outlet coordinates, dimensions and full floor topology need measurement confirmation.
- Room zone rectangles are independent visual guides; editing walls does not regenerate room polygons.
- Door clearance, accessibility routes and electrical outlets are not code-verified.
- Need on-device WebGL and touch QA, then bundle pinned Three.js runtime for *true WebGL offline* if desired.
- GitHub repository publication not yet confirmed.

## Latest bounded closure
- Fixed source-to-screen rotational consistency for arbitrary diagonal walls and rotated object geometry (offline canvas uses positive X/Z rotation; Three.js Y rotation takes the negative).
- Corrected scene rendering order so floor reference grid is behind room faces and furniture rather than drawn over everything.
- Removed prior-version language from in-app welcome.
- Final local tests are passing. See `QA_REPORT.md`. A public repository and downloadable offline Three.js WebGL runtime remain unverified/unavailable; preserve these limits in handoff.

## 2026-10-25 — Survey Studio uplift and QQQ correction

### Contract
- Preserve offline single-page apartment editor, room/wall/furniture editing, camera orbit, attachments, undo, existing schema migrations and existing public/private boundaries.
- Add a guided photo/video/measurement workflow that starts at the fountain-side entrance, records traceable local evidence, flags gaps and prevents speculative dimensions from becoming trusted architecture.
- Ship a private evidence ZIP with verified export **and import** recovery. Do not include any captured apartment media in the public project ZIP.

### Implemented and verified (current build)
- `Survey Studio` in single HTML with quick 26-step and full 66-step routes for the initial five estimated rooms. Each step includes one-camera framing, purpose, safe instruction, local file capture, notes, progress, and missing-evidence review.
- `schema:3` and v2/v1 best-effort imports; estimated vs tape/laser method tags; explicit confirmations before changing room floor zones or connected wall endpoints.
- Retake flag excludes unhelpful media from readiness coverage; hidden and missing media do not get credit. Notes and capture metadata persist in plan JSON where localStorage is available.
- Media stored in IndexedDB if available, ephemeral fallback otherwise; separate export of manifest-only JSON or privacy-confirmed ZIP. ZIP import checks local entries, CRCs, metadata, geometry and size bounds before overwriting the current plan.
- Faster broad-phase furniture collision with randomized brute SAT equivalence tests.
- Survey metadata edits skip rebuilding the 3D scene; geometry changes still rebuild and are undoable. Keyboard focus constrained to the survey/preview; mobile responsive shell visually inspected in Chromium screenshot.
- `npm run check`, `npm run build`, `python3 tests/survey_browser.py`: PASS on built `index.html` with actual Chromium DOM, file upload, image/video preview, retake, measurement application, export/restore, corruption rejection, and desktop/mobile-sized viewports.

### Evidence limits
- Browser test used Chromium `page.set_content` due file/HTTP navigation restrictions in the execution environment, not a real installed-device `file://` run.
- IndexedDB/localStorage persistence across full browser reload and real mobile camera capture remain UNVERIFIED; export private ZIP as a robust fallback.
- Offline perspective editor remains custom Canvas. Optional online legacy Three.js path is unbundled/UNVERIFIED; fully offline WebGL/Three.js remains outstanding.
- Current floorplan still illustrative. Photos/video document walls; **do not automatically derive metric-accurate geometry**. Human review/tape or laser measurements required.
- Repository publication and any release deployment remain BLOCKED/UNVERIFIED. This execution environment folder is not a Git repository, so QQQ commit/push/CI are NOT APPLICABLE here; GitHub access is a separate capability boundary.

### Next critical tasks
- Use Survey Studio to capture full room route and measurements; inspect private ZIP privately; accept corrections only after source triangulation.
- Run physical-device capture, local-storage persistence, and touchscreen regression tests; migrate and bundle modern Three.js module if full offline WebGL is required.
- Validate corrected wall topology and door/window/orientation before making home-fitting or accessibility decisions.

- The measurement step includes an all-wall overhead SVG locator with a highlighted selected wall and entrance marker, so the user can identify a physical wall without trusting initial room-zone adjacency.

## 2026-10-25 — Design Lab 0.4.0 uplift scope

- Baseline: v0.3 standalone offline editor + private Survey Studio, real apartment layout *still provisional*.
- Change owner: Three.js project engineer (preserve existing custom offline Canvas fallback); new separate Design Lab modules add ~30 browser interaction paths documented in `FEATURE_RECON.md`.
- New persisted planning metadata lives in plan `schema:4`: visible layers, notes, tape, palette, room/fixture labels, furniture groups/locks/prices/colors, camera bookmarks and budget. Legacy schema 3 imports migrate to version 4. The optional image blueprint underlay is memory-only and not included in JSON. User survey media stays in IndexedDB/private ZIP only.
- Protected user flows: open offline single HTML; orbit/dollhouse; walls, doors/windows/outlets; furniture edit/drag; local autosave and named layouts; undo/redo; JSON/SVG/PNG export; fountain-first photo/video survey, exact measurement source tag and private ZIP export/import.
- New source tests: `npm run check`, `tests/studio_browser.py`, `tests/survey_browser.py`, `python3 build.py`. Actual on-device iPhone/Android persistence and full WebGL Three.js parity remain UNVERIFIED.
- QQQ defects found and fixed: studio visibility defaults, smart placement ignoring locked furniture, dynamic viewport and SVG extents, catalog favorite star sizing and CSV formula safety. Evidence and scope in `QA_REPORT.md`.
- GitHub: `westkitty/Home-Plan` returns 404 via authenticated connector; this run must not claim public remote, pushed commit or Pages deployment without remote proof. Pages workflow prepared, but it does not manufacture a repository or enable Pages settings.
- Publication privacy fence: no user video/photo, room evidence media, private capture ZIP, real address, personal layout export or captured EXIF in public commit or Pages artifact; source-only allowlist.

### Final 0.4.0 verification note
- `npm run check` PASS; `npm run test:browser` PASS in desktop/mobile-sized Chromium for v0.4, including full private capture export/import; `python3 build.py` PASS.
- Matched same-runtime 260-object collision CPU benchmark passes SAT equivalence and measures indexed 99.7ms vs brute 1373.9ms (20 repetitions) without claiming mobile FPS.
- The Pages source-only GitHub Actions workflow was authored, but **remote repository creation, push, Pages build and live URL remain unverified** until a real authorized remote exists and provider confirms actions.

## 2026-10-25 — Architectural Diorama visual-finish 0.5.0 (current baseline)

**Purpose and scope:** Preserve the actual offline apartment editor, its five provisional rooms, furniture/walls/openings, Survey Studio evidence and private package recovery, Design Lab measurement/lighting/budget, imports/exports and versioned schema. This is a visual finishing pass on an existing apartment-planning experience, **not** a new videogame, a measured floor-plan reconstruction, or a Three.js migration.

**Implemented:** New source-only `src/visuals.js` paints shaded box faces, decorative furniture surfaces, wood/tile/stone study flooring, trimmed platform, soft grounded shadow silhouettes, window glazing and mullions, door thresholds, room labels, fountain cue and selected-object outline. Day/evening/night use distinct actual scene palettes. `src/polish.css` unifies the workshop styling. `src/chrome.js` routes the phone Actions menu to existing commands; desktop commands remain intact. Mobile CSS corrects the verified 390px→1379px scene overflow by constraining `.shell`/`.stage` and making the tool dock scrollable. Survey task inputs are brought before diagrams on narrow screens. Short selection emphasis is driven by a bounded ~290ms requestAnimationFrame sequence, throttled to ~30Hz, and skipped for reduced motion or battery saver. No continuous particle loop, external images, analytics or network requests were added.

**Performance policy:** The new Canvas painter adapts to `eco` presentation when furniture count exceeds 80, without changing the user's stored quality preference or geometry. Dense-scene mode avoids gradient/blur/contact-shadow/furniture-surface overhead and tiny face strokes. On the normal 13-object scene, a 1440x900 headless Chromium, 40-redraw sample recorded ~1.9ms median, ~6.7ms p95, with an extreme ~445ms single outlier; the older painter sampled ~1.2ms median and ~80.9ms p95 in that particular run. On a synthetic 158-object scene, 22-redraw sample new painter ~6.2ms median but >110ms p95, older painter ~48.5ms median, ~52ms p95. These run-to-run-biased data **do not prove net frame-time improvement, device FPS or long-session stability**; represent remaining extreme-tail risk, especially on overloaded/headless machines. Current design prioritizes actual event-driven interactivity and lower typical draw cost on dense scenes.

**Verified:** `npm run check` passes model, survey, Design Lab and runtime tests; `npm run test:browser` passes Chromium photo/video archive export/restore and corruption rejection, Design Lab's 30 interaction paths, and `tests/visual_browser.py` at 1440/768/390/320 widths, actual canvas changes for night lighting/selection, working mobile Save/Export/Survey/Opening tool access, Design Lab focus retention, inert welcome modal and keyboard Tab containment, menu focus restoration and no page errors. Separate visual inspection covers day/evening/night, Furnish/Build/Openings and Top Plan. Browser testing uses `page.set_content`, not a physical mobile `file://` installation; UI evidence screenshots are generated outside the repository and **never included in public release**.

**Known limits:** Offline renderer is custom perspective Canvas, **not Three.js WebGL**; the optional explicitly network-enabled legacy Three.js path remains unbundled/unverified. No actual physical-device GPU/FPS, touch precision, mobile camera, storage endurance, or iOS/Android accessibility proof. Architecture geometry remains provisional. This visual pass does not create videogame player characters, playable levels, collision physics, or combat; those were never part of the apartment editor. A synthetic high-density renderer p95 tail remains a performance risk.

**Release and privacy boundary:** Only release allowlisted HTML/source/tests/docs are public-safe; original apartment photos/video and capture ZIPs remain excluded. Local Git source root exists on `main`, but remote push/Pages deployment remains unverified. QQQ may commit only intended source if clean validation and explicit path allowlisting pass; never stage `tests/smoke.py` or private media.

## 2026-10-25 — Model-first progressive-disclosure workspace 0.6.0

**User-directed change:** The UI was too visually overwhelming and should occupy the smallest sensible on-screen area. Preserve every existing editing capability while making the apartment the dominant visible surface. Do not turn the change into a scene-engine rewrite or remove controls for the sake of a cleaner screenshot.

**Implementation:** `src/focus.css` overrides the legacy permanent grid to fill 100vw × 100dvh with the existing Canvas renderer. `src/focus.js` owns the small Home Plan/View/Move/Add/Build/Tools controls, exclusive popovers and dismiss/keyboard interactions. Existing `src/app.js`, `src/studio.js` and `src/survey.js` remain authoritative for object/room data, editing, Survey Studio, private ZIPs, saving, export and Design Lab. The original catalog, tool rail, minimap, view options, inspector and header are temporary accessible surfaces. Persistent model schema is unchanged (v4).

**Protected behavior:** Default is model-only rather than a welcome dialog; all original modes and advanced settings stay reachable. Selecting an object exposes only a contextual Edit chip; pressing Edit opens the original inspector without losing precise editing. Key paths include Undo/Redo, save/import/export, camera styles, room zoom, wall endpoints, doors/windows/outlets, furniture editing, Survey quick/full capture, private ZIP export/import and design/budget reporting. User data is not sent to a server.

**Verification:** `npm run check` PASS; `python3 tests/survey_browser.py` PASS with private media ZIP round-trip; `python3 tests/studio_browser.py` PASS for 30 Design Lab action paths; `python3 tests/visual_browser.py` PASS across 1440/768/390/320 pixel Chromium (Canvas pixels, modal focus, Survey access and illumination/selection); `python3 tests/focus_browser.py` PASS (model footprint and full menu/selection/edit/keyboard route). Focus returns to visible Home Plan or Tools control after dialog close instead of a hidden legacy button. Browser runs are separated to avoid a long combined test-run timeout.

**Default UI footprint benchmark:** main primary control rectangles occupy ~1.9% (1440px), 3.57% (768px), 6.44% (390px) and 8.04% (320px), with no persistent side panel. Values are not usability study results. Unmeasured room geometry, offline Canvas rather than true Three.js, and physical-device FPS/camera/storage testing remain open. Do not silently mark those features verified. No remote publication requested in this task; original Git history and pre-existing untracked `tests/smoke.py` are protected.

## 2026-10-25 — Icon-first architecture and contextual help (v0.7.0)

**User contract:** The apartment model remains the primary full-screen surface. Architectural and furniture controls are icon-forward like The Sims 2, but the larger tool palettes appear only when summoned. Every significant interactive command has accessible text and a tooltip pathway; each major menu has a `?` button opening a focused contextual help dialog. Detailed property labels, numeric measurements and safety/evidence warnings remain readable text.

**Implementation:** `src/icon_ui.js` and `src/icon_ui.css` add self-authored SVG pictograms for the main dock, Project actions, camera selection, Tools category controls, catalog room categories, and Design Lab/inspector tabs. The Build dock icon opens a dedicated eight-action architectural icon palette connected to current wall, draw-wall, opening/fixture and material-finishing actions. Contextual guide dialogs serve Project, Build, Tools, Views, Catalog, Inspector, Design Lab and Survey Studio. The native dialog uses browser modal focus containment and restores the originating `?` trigger. The tooltip surface handles pointer hover and keyboard focus, avoiding native duplicate title UI. The app remains dependency-free/offline; no actual apartment imagery, captured survey media or user layouts are added to the public release.

**Verification:** source/model tests `npm run check` PASS. `tests/icon_ui_browser.py` PASS at 1440/390/320 for menus, icons, help, category re-render and architectural routes. `tests/focus_browser.py` PASS independently at 1440/768/390/320 before the final compact-tooltip adjustment; the last combined invocations hit a process timeout following successful icon-suite results. Survey Studio, Design Lab and visual browser suites each passed in a previous invocation of `npm run test:browser`, before the aggregate timed out. Real phone/tablet touch and actual screen-reader output remain UNVERIFIED. See `ICON_UX_RESEARCH.md` for source citations and interaction decisions.

**Protected behavior:** keep offline model viewing/editing, provisional architecture marking, furniture CRUD, named autosave and import/export, private survey ZIP export/restore, Design Lab interactions, focus recovery and responsive full-viewport model. Avoid exposing private media in GitHub or distributable ZIP. Do not claim Pages live or public push without provider readback.

## 2026-10-25 — Baby-blue workspace backdrop and color settings (0.8.0)

**User contract:** Default the *background behind the apartment model* to soft baby blue, and provide a full-spectrum color picker inside an on-demand Settings section. Keep the model full-viewport and icon-forward; preserve furniture, walls, measurements, Survey Studio, Design Lab, imports/exports and keyboard interactions. Stage, commit, publish to exact `westkitty/Home_Plan` repository and enable GitHub Pages if credentials/capabilities permit.

**Implementation:** `src/appearance.js` owns the validated six-digit hex preference, default `#C9E9FF`, native color input, Reset and `homeplan-scene-background-v1` storage. CSS stage fallback, offline Canvas gradient, optional legacy Canvas fallback and optional Three.js background/fog/clear color use the same preference. Appearance changes request a single rAF repaint and do **not** modify plan schema or project JSON. The control is inside Project → Settings; contextual `?` help, tooltip and keyboard focus are retained.

**Validation:** `npm run check` PASS (including `tests/appearance.test.cjs`); `tests/appearance_browser.py` PASS in Chromium at 1440/390/320, verifying actual canvas pixel changes, UI help, reset, invalid stored value recovery, appearance/plan separation and simulated storage restoration. Existing `tests/focus_browser.py`, `tests/icon_ui_browser.py`, `tests/visual_browser.py`, `tests/studio_browser.py` and `tests/survey_browser.py` PASS independently. Browser tests use `set_content` and a storage shim for the new persistence test because navigation is blocked in this sandbox; physical-device/file-origin storage and WebGL color switching remain unverified.

**Publication:** Exact remote `westkitty/Home_Plan` was confirmed public, writable and empty before local change. No public GitHub or Pages success may be claimed without remote commit and site readback. Preserve pre-existing untracked `tests/smoke.py`; public source-only allowlist excludes all photos/videos and private captures.


## 2026-10-25 — Architectural workspace and touch upgrade 0.9.0

**Current requirement:** Start with a genuinely blank space; create wall outlines by drag or two-touch coordinates (rectangle, circle, ellipse, triangle, L-shape); rename/add/remove independent room zones; mark indoor/outdoor, porch/balcony and first entrance; provide kitchen/bath/water/laundry/office fixtures and floor patterns; enable nighttime exterior dimming with separate warm interior; make modals and menus tappable. Preserve all existing plan edit, save/import/export, Survey Studio privacy and Design Lab functionality.

**Implemented:** `MODEL_VERSION=5` plus validated `blankPlan()`, `makeShape()`, segmented `shapeWalls()`, shaped-zone footprint/area, room zone/flooring JSON round trips and legacy schema 4 migration. `src/app.js` adds shape drag/two-tap stage input, room creation/edit/delete and confirmation modal, entrance marker, projector scene models for new appliances, night and indoor/outdoor lighting levels. Build icon palette exposes new shapes, room zones and lighting; catalog includes Office, Appliances, Plumbing, Laundry and Outdoor. Studio Finishes offers material and zone selectors and the interior/exterior light sliders. Design Lab handles an empty plan; post-blank mobile inspector no longer blocks Project controls. Custom perspective Canvas remains the primary offline renderer.

**Privacy/preservation:** No captured media, address, personal survey exports or user layout JSON belongs in public Git source, release ZIP, or Pages artifact. `tests/smoke.py` remains untracked and untouched. No external runtime libraries needed for default offline build.

**Verification:** `npm run check` including `tests/architecture.test.cjs`: PASS. `tests/architecture_browser.py`: PASS actual Playwright tap events at 1440/390/320 including Build/help dialogs, blank confirmation, room shape drawing, editing/removal, porch/balcony, washer-dryer combo, night sliders, blank Studio tabs and circular walls. Survey Studio private ZIP export/restore and corrupt-archive rejection, Design Lab, visual viewport and original icon UX suites: PASS independently. Headless touch simulation does not prove actual Android/iOS hardware, screen reader or camera behavior; WebGL remains optional/uncertified.

**Release:** Repository authority is exact `westkitty/Home_Plan` (underscore). Publish from a local verified source commit via authenticated GitHub connector without rewriting the remote bootstrap ancestry. Verify workflow and exact live HTML hash before claiming Pages upgraded.
