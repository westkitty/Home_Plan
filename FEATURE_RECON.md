# Home Plan — Comparable products and implemented capability ledger

Research date: 2026-10-25. Scope: features missing from Home Plan 0.3 that can be implemented honestly in a privacy-first, single-page offline editor. This is a **mechanism transfer**, not an assertion that Home Plan matches a commercial CAD suite or copied any third-party code.

## Current primary-source comparators

- [Sweet Home 3D official features](https://www.sweethome3d.com/features/): precise room/wall labels, North indicator, measurements, search/catalog, material customization, annotated/printable plans, visitor view, blueprint import.
- [Sweet Home 3D official guide](https://www.sweethome3d.com/users-guide/): image-underlay scaling, floor-plan tracing, dimension lines, floor finishing and printing.
- [RoomSketcher official features](https://www.roomsketcher.com/features/): precise measurements, area calculation, material replacement, favorites, drawing from blueprint, floor-plan customization, 3D snapshots, room information.
- [RoomSketcher Pro comparison](https://help.roomsketcher.com/hc/en-us/articles/21074497910045-Premium-vs-Pro-Feature-Comparison): blueprint, materials, measurement/area and live 3D feature differentiation.
- [HomeByMe official features](https://home.by.me/en/features/): room configuration, adaptable items, multiple material/color choices, lighting conditions and product catalog.
- [HomeByMe Pro features](https://home.by.me/en/pro-features/): alternative designs, client views, shopping list, dimensions and presentation exports.
- [SketchUp official scenes guide](https://help.sketchup.com/en/sketchup/creating-scenes): named scene views, property/visibility state and section cuts.
- [magicplan official report plan](https://help.magicplan.app/report-plan): photographic evidence, measurement-linked floor plans, annotations and reports.

## Pre-uplift assessment and implemented features

Baseline inspection found a functioning Canvas perspective editor with wall/furniture tools, movable objects, named layouts, survey capture/review/restore and JSON/SVG/PNG exports. Those pre-existing abilities **do not count** toward this ledger. The following additions are scoped to the October 25 Design Lab work.

| # | New mechanism and entry point | Comparative precedent | Code owner | Evidence | State |
|---:|---|---|---|---|---|
| 01 | Search furniture catalog by name (`Furnish` search) | Sweet Home 3D searchable catalog | `src/app.js` | Browser test filters sofa/bed | Browser verified |
| 02 | Mark furniture archetypes as favorites and filter catalog | RoomSketcher favorites | `src/app.js`, `src/studio_model.js` | Browser test favorite and filter | Browser verified |
| 03 | Calculate area for each provisional room study zone | RoomSketcher total area | `studio_model.js`, `studio.js` | Model area conversion and UI text | Browser/model verified (zone only) |
| 04 | Toggle metric/imperial dimensions | RoomSketcher measurement units | `studio.js` | Browser selects feet, correct label | Browser verified |
| 05 | Store user-specified North bearing | Sweet Home 3D compass | `studio.js` | Browser model north 45° | Browser verified |
| 06 | Overlay approximate door swing guides | Sweet Home 3D opening details | `studio_model.js`, `studio.js` | Browser toggles overlay, model warnings | Implemented; physical swing approximate |
| 07 | Try an advisory floor-grid walking route from entrance to room | RoomSketcher 3D route/Live 3D | `studio_model.js` | Route positive + blocked negative test; browser action | Browser/model verified for sketch |
| 08 | Scan furniture-wall proximity / overlap for selected threshold | RoomSketcher measurement visualizations | `studio_model.js` | Risk/warning computation and UI | Model verified; not compliance |
| 09 | Record two-point on-plan tape dimensions | Sweet Home 3D dimension lines | `studio.js` | Click twice, stored 5m example | Browser verified; plan units provisional |
| 10 | Pin and persist contextual notes at floor locations | Sweet Home 3D plan text; magicplan notes | `studio.js`, `studio_model.js` | Browser pin + JSON round-trip | Browser verified |
| 11 | Create a named rectangular study zone (without automatically drawing walls) | HomeByMe room configuration | `studio.js` | Browser adds sixth zone; model 4.2×3.3m | Browser verified |
| 12 | Lock/unlock furniture position | Professional CAD editing patterns | `studio.js`, `src/app.js` | Browser lock plus smart-arrange exclusion | Browser/model verified |
| 13 | Give furniture shared group ID for dragging as a cluster | SketchUp grouped objects concept | `studio.js`, `src/app.js` | Browser group value and source move path | Integrated; touch drag not device verified |
| 14 | Align selected furniture parallel to specified wall | RoomSketcher precision placement | `studio_model.js`, `studio.js` | Browser align; numeric geometry unit test | Browser/model verified |
| 15 | Change editor snap increment, including free positioning | Sweet Home 3D precision drawing | `studio.js` | Browser snap-off state | Browser verified |
| 16 | Hide one furniture item without deleting it | SketchUp visibility/tags | `src/app.js`, `studio.js` | Browser hide state and scene path | Browser verified |
| 17 | Apply one of five room/floor/wall palette presets | HomeByMe material presets | `studio.js`, `studio_model.js` | Browser palette state and save | Browser verified |
| 18 | Recolor floor of selected room independently | RoomSketcher material replacement | `studio.js` | Browser writes floor color | Browser verified |
| 19 | Recolor chosen wall segment independently | Sweet Home 3D wall color | `studio.js` | Browser writes wall color | Browser verified |
| 20 | Recolor selected piece of furniture | HomeByMe customizable furniture | `studio.js` | Browser writes furniture color | Browser verified |
| 21 | Switch day/evening/night ambient visualization | HomeByMe ambient light options | `studio.js` and Canvas renderer overlay | Browser state; visual render first pass | Browser state verified, not photometric |
| 22 | Save and restore named camera viewpoints | SketchUp Scenes | `studio.js` | Browser captures a named bookmark; saved JSON | Browser verified for saving |
| 23 | Lower wall cut-height for a cutaway view | SketchUp Sections | `src/app.js`, `studio.js` | Browser sets 1.5m + renderer source | Implemented; real WebGL unverified |
| 24 | Individually toggle furnishings, openings, rooms and marker layers | SketchUp tags/scene visibility | `src/app.js`, `studio.js` | Browser toggles furnishings; draw path | Browser verified |
| 25 | Load a private image floor-plan reference, adjust opacity, width and origin | Sweet Home 3D background tracing | `studio.js` | Browser x-offset edit and minimap logic | Implemented; image calibration not complete |
| 26 | Add user-entered USD price to furniture | HomeByMe shopping list | `studio.js` | Browser price 244.5 | Browser verified |
| 27 | Sum known item costs against user-entered budget | HomeByMe shopping list | `studio_model.js`, `studio.js` | Browser over-budget state | Browser verified; unknown prices excluded |
| 28 | Export shopping CSV with spreadsheet formula protection | HomeByMe shopping data | `studio_model.js`, `studio.js` | Browser download + injection test | Browser/model verified |
| 29 | Export printable, local technical sheet with room/notes/wall/budget | magicplan reporting; Sweet Home 3D print | `studio.js` | Browser downloaded HTML and inspected content | Browser verified |
| 30 | Version-four model persistence for all the above metadata | RoomSketcher project persistence pattern | `src/model.js`, `studio_model.js` | Browser JSON round-trip + v3 migration | Browser/model verified |

**Additional related behavior:** the Design Lab also offers camera presets, furniture centering/rotation, group cleanup, temporary floor-zone hiding, SVG plan export using dynamic extents, and a routed tutorial back to Survey Studio. These actions are adjacent improvements and **not** counted as separate rows merely to inflate the total.

## Limits we deliberately did not misrepresent

- **Not LiDAR or AI blueprint conversion.** Real-scene automatic metric reconstruction requires compatible sensors/models and source verification; the survey captures evidence and accepts explicit measurements instead.
- **Not a photorealistic render system or 3D model importer.** Offline mode is a custom Canvas projected environment. Optional Three.js CDN is user-initiated and unbundled, with no verified WebGL parity.
- **Not a certified egress/accessibility calculator.** The floor is a provisional set of study rectangles; simulated route and door arcs are approximate prompts to inspect physical obstacles.
- **Not a commercial product catalog.** Prices are user-supplied; unknown prices do not become $0.
- **Not persistent photographic underlay media.** The reference image is stored only in this page's memory, separate from JSON; it must be reloaded after a fresh open.
- **Not building plan authority.** Wall endpoints/adjacency remain estimates until triangulated from survey media and measured by a person.

## Verification command

`npm run check && npm run test:browser && python3 build.py`

`tests/studio_browser.py` exercises 30 interactive paths at desktop and mobile-sized widths; the model tests check mathematical correctness, migration, locked furniture and CSV safety. A Playwright viewport emulation is not a physical Android or iOS performance/thermal test.
