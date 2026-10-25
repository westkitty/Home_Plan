# Home Plan — Apartment Workshop

A single-file, offline architectural-diorama apartment workshop with a guided, privacy-first Survey Studio and a five-area Design Lab. Explore estimated 3D perspective geometry, move furniture, edit walls/openings, annotate locations, compare room arrangements, preview finishes and manage a user-entered furnishing budget.

**Start:** Open `index.html` in a browser. No installation, account, package manager, or internet is required for the editor or Survey Studio.

## Background color settings (0.8.0)

The scene behind the apartment opens in **baby blue (`#C9E9FF`)**. To choose any other color, open the **house icon → Settings → Scene background** and use the native full-spectrum color picker. Changes update the live model backdrop immediately; **Reset** restores baby blue. The adjacent `?` explains the setting without leaving the workspace.

The choice is a **device-local appearance preference** (`homeplan-scene-background-v1` in browser storage), separate from version-4 apartment geometry, furniture colors, room finishes and project exports. It persists on the same origin when browser storage is available. In storage-restricted contexts the current session still updates; export your project JSON to back up the *layout*, not the appearance preference. The color applies to the offline Canvas painter and the optional WebGL fallback.


## Model-first interface (0.6.0)

**The apartment is the interface.** On startup, the model fills the entire browser viewport. Panels are not shown until needed, and opening them overlays the model rather than narrowing its camera. This is a deliberate reduction in *simultaneous* choices, not a removal of editing features.

The always-visible controls are six small buttons in three islands: **Home Plan** (top left, project/save/export), **Dollhouse/3D/Top** (top right, view options), and a bottom dock with **Move**, **Add**, **Build**, **Tools**. Only when an object is selected does a small **Edit** chip appear. Tap the same control again, click outside, or press **Escape** to dismiss an ordinary drawer and return to the model.

- **Move:** select/drag furniture; click the context chip's Edit button for exact position, dimensions, rotation, groups, colors and locking. Empty space orbits the apartment; two-finger gestures pan/pinch.
- **Add:** temporary searchable furniture catalog with favorites and categories. Adding an object closes the catalog and selects the new object.
- **Build:** select or manipulate walls and their endpoints. Other architectural tools are inside **Tools → Openings**.
- **Tools:** Explore, Openings, Tape, Notes, Design Lab, Scan apartment, object Inspector, and Help. No separate permanent navigation rail.
- **View selector:** Dollhouse/3D orbit/Top plan, Fit entire apartment, temporary minimap, optional zoom controls and model information. These aides stay hidden by default.
- **Home Plan menu:** editable project title, Save, Undo/Redo, Export and the Design Lab/Survey Studio entry points. The original 3-tab inspector is still available on demand, including Project imports, named arrangements and exports.
- **Keyboard:** V = Move, B = Build, A = Add, Q/E rotate selection, Ctrl+Z / Ctrl+Shift+Z undo/redo, F fit all; Escape closes the open drawer. Tools and their controls remain keyboard focusable. Reduced motion is respected.

**Responsive:** 1440, 768, 390, and 320 px real Chromium browser tests check full-bleed canvas, temporary panel access, keyboard focus restoration, catalog edits, wall/opening mode, project actions, visible Survey/Design Lab launchers, and help. The measured default control footprint is about **1.9%** on a 1440×900 viewport, **3.57%** at 768px, **6.44%** at 390px, and **8.04%** at 320px; these percentages are sums of main control bounding rectangles, not tested usability percentages. The full browser workflow test suite passes independently. Hardware performance, mobile assistive-technology parity and real file-origin persistence still require device proof.

## Architectural diorama visual finish (0.5.0)

The offline 3D-perspective Canvas scene now presents the apartment as an illustrated architectural model instead of a collection of uniformly shaded boxes. This is an **art-direction and interface upgrade of the existing editor**, not a new game, automatic reconstruction engine, or conversion to Three.js.

- **Scene materials:** patterned wood/tile/stone study floors, shaded furniture faces, upholstery seams, decorative furniture details, contact shadows, architectural slab and trim, translucent glass with window frames, highlighted opening thresholds, and legible room labels.
- **Lighting and visual feedback:** day/evening/night palettes affect the actual rendered model; context-aware selected-object outlines and handles; short 290 ms selection emphasis and fountain ripple cue. Effects are event-driven, not a continuously running animation loop. The effect is skipped under reduced-motion, document-hidden, and battery-saver conditions.
- **Interface:** consistent evergreen/ochre workshop visual system with strong focus cues. Phone viewports now use an actual full-width scene, a full-viewport scene and compact on-demand mobile tool dock; all original Save, Export, Design Lab, Survey Studio, Undo/Redo and Help actions are available from the Home Plan and Tools menus. On touch, selecting an object opens a contextual inspector sheet; mobile Survey measurement tools precede illustrations.
- **Accessibility repair:** welcome/help dialogs constrain keyboard focus and mark the background inert, Design Lab settings retain focus during re-render, and mobile Actions commands restore focus after the menu closes.
- **Adaptive scene workload:** at more than 80 placed furniture objects, the Canvas painter temporarily uses flat-shaded low-overhead presentation. This does not mutate the selected rendering-quality preference, wall geometry, saved coordinates, or budget. Existing quality presets remain available.

**Graphics proof:** `python3 tests/visual_browser.py` captures and exercises 1440, 768, 390 and 320 px layouts, real day/night pixels, selected-object differences, modal focus, mobile commands, Survey Studio and Design Lab focus. In a separate synthetic 158-object Chromium draw benchmark, the adaptive painter's median draw is about 6 ms while severe long-tail stalls above 100 ms remain possible. On the normal 13-object scene median draw cost was around 2 ms. These short, headless CPU samples are **not** a device FPS/thermal or long-session proof. See `QA_REPORT.md` for scope and caveats.

## Design Lab — 30 new interaction paths

Open **Design Lab** from **Home Plan** or **Tools → Design Lab**. Its five work areas are:

- **Inspect:** approximate room areas, metric/imperial units, two-point tape, pinned notes, north bearing, door arcs, walking-route probe, proximity risks and printable field report.
- **Arrange:** candidate room arrangement, wall alignment, centering/rotation, furniture groups, object locking/hiding, new provisional study zones, snap/grid settings.
- **Finish:** coordinated palettes, independent room-floor, wall and furniture colors, three stylized lighting presets.
- **View:** saved camera scenes, wall cut height, architectural/furniture visibility layers, and a local floor-plan image underlay with position/scale/opacity controls.
- **Budget:** user-assigned item prices, target budget, per-item costs and spreadsheet-safe shopping CSV.

Every edit is stored in the version-4 plan JSON unless the interface says otherwise. **The blueprint underlay image is memory-only**; reopen it on the next session. New study rooms are independent rectangular zones and do not fabricate wall connections. The route, estimated areas, door arcs and collision alerts are **advisory visual aids**, not verified survey geometry or certified access/egress measurements. Only user-recorded tape/laser measurements with explicit acceptance affect measured geometry.

See [FEATURE_RECON.md](FEATURE_RECON.md) for the exact baseline-minus-feature inventory (30 evidence-traceable additions), competitor sources, code owners, browser tests and remaining limitations.

## The capture workflow

Choose **Home Plan → Scan apartment** or **Tools → Scan apartment**. The Survey Studio starts by the fountain-side entrance, the sole confirmed orientation anchor from the user's walkthrough. It uses the rooms already present in the plan. Their order and adjacency remain provisional until the connecting videos and measured layout are reviewed.

- **Quick pass (26 steps):** entrance/threshold context, slow continuous room video, doors, core room measurements, and transition views. Useful for starting; not sufficient to certify a floor plan.
- **Full survey (66 steps):** additional overlapping corner photos, straight-on walls, door connections, windows, electrical outlets, major furniture, and measurement prompts. The count follows the included five provisional room zones; adding or removing rooms changes the count.
- **Each step:** a framing illustration, where to stand, what to include, why the image is needed, and instructions for safe camera movements. Use the device camera or attach existing images/video. Keep the doorway or a shared landmark in frame when changing rooms.
- **Review:** click a captured image/video to inspect it. Mark **Useful evidence** or **Needs retake**. Retake-flagged and missing files do not count as completed coverage. Mark inaccessible or absent features with an explanation; mandatory evidence remains missing rather than being falsely completed.
- **Measurements:** record inside wall-to-wall width/depth, optional ceiling height, and a specific wall length in decimal feet or meters, identifying tape/laser/estimate as the source. The app will not treat estimates as survey-ready. An overhead locator highlights the wall segment chosen for exact-length recording, including segments outside the estimated room zone. Record dimensions first; applying them to room zones or connected wall endpoints requires a separate explicit confirmation. Applying room dimensions does not automatically reshape architectural walls.
- **Missing evidence:** the precision ledger reports which required shots and measurements are missing. A progress count means coverage, **not geometrical correctness**.
- **Export/restore:** `Export survey manifest` creates JSON without photo/video bytes; `Export photos + videos ZIP` creates a **private** uncompressed ZIP with the full current layout, evidence manifest, photo/video bytes, and integrity metadata. `Restore private ZIP` verifies stored ZIP entries and CRC and asks before replacing the active layout. The import supports the packages this app exports, not arbitrary compressed ZIP archives. Exporting the ZIP is the portable backup; browser media storage is not a substitute.

**Capture safety:** Do not include apartment numbers, people, documents or street addresses where possible. Do not walk backward, climb furniture, move heavy objects, or open electrical fixtures to obtain images. Wide-angle photos have distortion; use a real tape/laser for measurements. Never treat an automatically generated-looking floor plan as a verified survey.

## Privacy and offline behavior

- Editor and capture guide are all in one HTML file with no externally loaded assets on normal startup.
- Images/video are kept locally in IndexedDB when the browser permits, otherwise in temporary page memory; the app warns if persistence is unavailable. Layout state uses browser localStorage where supported. Export private ZIPs periodically and before closing in temporary-storage mode.
- No cloud upload, tracking API, geolocation, camera streaming, or automatic publication. Opening your device's camera uses the browser/operating-system file picker, not continuous app camera access.
- A private capture ZIP contains images, footage and potentially original file metadata. **Never put survey ZIPs, original walkthrough videos, captured frames, personal layouts or addresses into a public repository.** The `.gitignore` filters common media names and types, but always review staged files manually.
- The provided source package intentionally contains no original apartment videos or extracted image frames.

## Apartment design controls

| Mode | Actions |
|---|---|
| Furnish | Select and drag furniture, resize in the inspector, Q/E rotate by 15°, duplicate or delete |
| Build | Select walls; drag wall segments/endpoints; create additional wall segments; edit exact coordinates |
| Openings | Attach doors, windows, passages or outlet markers to a selected wall; edit their location/width |
| Explore | Orbit by dragging empty space; pan using two fingers/right drag; pinch/wheel zoom |
| Camera | Dollhouse, perspective orbit or overhead |
| Project | Autosave, named arrangements, undo/redo, JSON import/export, SVG floor plan, PNG viewport |

The model is a **planning visualization**, not a building survey. Door swings, clearances, fixtures and the initial adjacency are not dimensionally verified. The original fountain-side entrance reference is user-supplied; the remaining walls, room sizes and window/opening placements are placeholders intended for correction.

## Renderers

**Offline default:** A self-contained custom Canvas perspective renderer, not Three.js. **Optional WebGL:** Project → Enable Three.js WebGL (internet) fetches the older pinned Three.js r150.1 browser build on explicit user action; it is unbundled and has not been runtime-certified. The application does not auto-fetch it. Fully offline **Three.js WebGL** and a verified current Three.js module migration remain open work, not completed features.

Collision highlighting uses a spatial-hash broad phase with oriented separating-axis footprint checks. In the synthetic 260-item, 250-pass CPU-only benchmark, the new implementation took ~0.5ms per pass, compared with an earlier ~5.4ms per pass. This is **not** a browser FPS or hardware thermal benchmark. The 3D renderer is not rebuilt for note-taking, status changes or other survey-only edits.

## Files and development

- `index.html`: standalone offline deliverable.
- `src/model.js`: version-4 plan schema, furniture geometry, survey requirements and measurement/coverage logic.
- `src/studio_model.js`, `src/studio.js`, `src/studio.css`: Design Lab planning/domain logic, visual inspector, export and layout controls.
- `src/app.js`: camera, layout/editor state, renderer, input/selection feedback, imports and exports, survey and studio bridges.
- `src/visuals.js`: fully bundled, offline Canvas diorama painter with scene materials, camera-dependent face shading, lighting modes, selection cues and adaptive dense-layout fallback.
- `src/polish.css`, `src/chrome.js`: visual design system, mobile stage/nav repair, Actions menu and accessible focus restoration.
- `src/survey.js`: capture wizard, IndexedDB storage, media review, offline ZIP exporter/importer.
- `src/style.css`, `src/survey.css`, `src/shell.html`: responsive editor/survey UI.
- `build.py`: combines the above into one HTML file; requires Python only to rebuild.
- `tests/model.test.cjs`, `tests/survey_model.test.cjs`, `tests/studio_model.test.cjs`, `tests/runtime.test.cjs`: model and synthetic DOM tests.
- `tests/survey_browser.py`, `tests/studio_browser.py`, `tests/visual_browser.py`: optional Chromium/Playwright DOM + Canvas integration tests including private ZIP round-trip, 30 new editor interactions and desktop/mobile-sized viewports; require locally installed Playwright, Pillow and Chromium. Tests use `page.set_content` and do **not** prove file-origin persistence or actual mobile GPU/performance.
- `OPERATIONAL_STATE.md`, `QA_REPORT.md`, `FEATURE_RECON.md` and `PUBLISHING.md`: continuity, comparison, current proof and publication boundaries.

Run `npm run check`, `npm run build` or `python3 build.py`, and optionally `npm run test:browser`. No npm dependencies are required to **run** the shipped HTML. The browser test requires its optional Python dependencies.

## Rebuild and offline contract

From the source directory: `npm run check && npm run test:browser && python3 build.py`. The built `index.html` must match the checked-in file; `.github/workflows/pages.yml` checks determinism before publishing an isolated, source-only GitHub Pages artifact. End users can open the generated HTML directly without installing packages or internet. Optional user-initiated legacy WebGL loading is the one exception and remains unverified as an offline Three.js runtime.

## Publishing boundary

Public source can be published after manual review. Do **not** publish the original walkthrough videos, captures, private survey ZIPs, real geometry/location details, or exported user-specific layout JSON. Repository creation/publication is **not** performed by this source archive. `package.json` states `UNLICENSED`; public visibility does not automatically grant third-party reuse rights.

Pages deployment is configured with GitHub Actions when an authenticated public `westkitty/Home-Plan` repository exists and its Pages source is set to Actions. A local build, local Git commit or presence of the workflow does not establish a live site.

### Icon-first architectural workspace

The full apartment is the default interface. The corner **home** icon opens Project commands, the corner **view** icon opens camera controls, and the bottom dock uses **cursor**, **plus**, **wall** and **tool** icons. Click **wall** to reveal the architectural categories: Walls, Draw Wall, Door, Window, Outlet, Passage, Entrance and Finishes. The furniture **plus** opens icon categories and a searchable catalog. Menu-local **?** buttons explain what each group does; hover with a pointer or focus with the keyboard for contextual command descriptions. The guide works on touch screens where mouse hover is unavailable.

Architectural tool behavior is linked to the original editor; the changes do not alter saved plan formats or survey evidence storage. See `ICON_UX_RESEARCH.md` for design precedents and constraints.
