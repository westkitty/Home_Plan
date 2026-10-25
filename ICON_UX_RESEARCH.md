# Home Plan — Architectural Icon Interaction Reference

Design reference packet (2026-10-25). The examples inform interaction patterns; artwork and source assets are original, not extracted from games.

## Studied pathways

1. **The Sims 2 Build Mode** — a first-level Build icon opens architectural categories (walls, openings, flooring and other elements); categories reveal specific tools or a catalog, while tooltip names teach the meaning of compact controls. The basic guide specifies icon → panel → tools/subcategories. Source: https://strategywiki.org/wiki/The_Sims_2/Build_Mode . The original Sims design review explicitly specifies architectural tools as icons in two rows, with tooltips, and category-specific catalog choices: https://donhopkins.com/home/TheSims/TheSimsDesignDocumentDraft7-1998-10-02-DonsReview.pdf .
2. **The Sims 3** — Build and Buy are distinct mode icons, opening a shared area repurposed for tools/catalogs. Source: https://primagames.com/eguides/the-sims-3-eguide/essentials/creating-a-house/building-basics . The documented manual tells users to hover over icons to learn their functions: https://manualzz.com/doc/13734745/electronic-arts-the-sims-3-video-game-user-manual .
3. **The Sims 4** — the build catalog organizes options using a visual house diagram and object categories, while Search remains available as a fallback. Source: https://primagames.com/eguides/the-sims-4-eguide/architecture-and-design/build-mode .
4. **Sweet Home 3D** — rich floor-plan and 3D views coexist with a searchable grouped furniture catalog, context menus, and changeable display; unlike Home Plan, its permanent four-pane layout is too dense for this model-first brief. Source: https://www.sweethome3d.com/users-guide/ .
5. **House Flipper 2 Sandbox** — choosing a work tool determines what model interactions mean. Source: https://houseflipper.wiki.gg/wiki/Sandbox_mode .

## Design decisions

- **Model-first override**: retain Home Plan's full-viewport model, not the permanent large bottom dock of the Sims. Keep only Project, View and four small editing icons visible.
- **Category, then action**: Build opens eight architecture icons: Walls, Draw Wall, Door, Window, Outlet, Open Passage, Entry Door, Finishes. Each calls existing editor behavior. Furniture categories get distinct icons instead of words, with the original search field.
- **On-demand explanation**: icon buttons expose `aria-label`, tooltip text on mouse hover/keyboard focus, and menu-local `?` dialogs with action descriptions and limitations. Detailed field labels and numerical inputs remain words for safety and clarity.
- **No proprietary game assets**: use tiny self-authored stroke SVG icons; no copied game bitmaps, fonts, icon sheets, media or other external dependencies.
- **Mobile parity**: touch has no hover; the guide dialog is the reliable learning path. Every major menu offers one `?` button, plus fully accessible named icons.

## Implemented and QA scope

- `src/icon_ui.js`, `src/icon_ui.css`, `src/shell.html`, `src/focus.js`, `src/app.js` implement icon-driven palettes and contextual help. Browser checks in `tests/icon_ui_browser.py` cover 1440, 390 and 320px, menu-local help, focus, category refresh, architecture actions, and Design Lab/Survey Studio dialogs.
- Existing model and Survey/Design Lab test suites remain separate evidence. Browser emulation cannot certify physical touch ergonomics, assistive-tech screen-reader rendering, or real mobile GPU performance.
