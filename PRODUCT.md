# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Personal solo resident planning and executing their own apartment move. The user needs to capture room walkthrough evidence, verify physical dimensions, test furniture placements, and evaluate spatial clearance without needing CAD training or dealing with cloud software.

## Product Purpose
An offline, self-contained apartment workshop and architectural diorama that enables a resident to explore estimated 3D perspective geometry, verify tape and laser measurements, arrange furniture, preview finishes, and track a furnishing budget. Success means spatial clarity and confident move-in decisions with zero privacy compromises or cognitive clutter.

## Positioning
A 100% offline, privacy-first single-file workshop with honest measurement tracking and diorama perspective rendering. Unlike cloud-based 3D planners or automated LiDAR tools, Home Plan never uploads room media, never fabricates unmeasured architectural elements or outlets, and runs entirely in local browser memory without accounts or external scripts.

## Operating Context
- Environments: On-site in the physical apartment using a mobile or laptop browser to survey rooms, and at a desk planning furniture arrangements.
- Tools: Device camera for local survey photo/video capture (via OS file picker), physical tape or laser distance meters, and standard desktop/mobile browsers.
- Workflows: Entrance-anchored walkthrough survey, recording inside wall measurements, two-tap wall/room layout creation, dragging and rotating catalog furniture, comparing candidate room arrangements, and checking door swing/walking path clearances.

## Capabilities and Constraints
- Distribution: Standalone single-file HTML distribution (`index.html`), compiled locally from modular source files via `python3 build.py`.
- Connectivity & Privacy: Completely offline; zero external network requests, CDNs, cloud trackers, or analytics.
- Media Storage: Survey images and video are stored locally in IndexedDB or temporary memory; private backups export directly as uncompressed ZIP packages without server mediation.
- Rendering: Illustrated architectural diorama via an offline 2D Canvas perspective painter (with optional local WebGL fallback), keeping UI overlay overhead under 10% of viewport area.
- Measurement Integrity: Strict separation between unmeasured provisional visual estimates and user-verified tape/laser measurements.
- Schema: Versioned plan state using Schema 5 JSON with backward-compatible migration.

## Brand Commitments
- Name: Home Plan — Apartment Workshop
- Tone & Voice: Honest, evidence-traceable, calm, non-deceptive, and architectural.
- Aesthetic Anchor: Illustrated architectural diorama with an evergreen/ochre workshop visual system, warm interior illumination, and customizable scene backdrop (defaulting to baby blue `#C9E9FF`).

## Evidence on Hand
- Architecture & Source: Modular JavaScript modules in `src/` (`model.js`, `studio_model.js`, `appearance.js`, `visuals.js`, `chrome.js`, `focus.js`, `icon_ui.js`, `app.js`, `studio.js`, `survey.js`).
- Documentation: Comprehensive project specifications in `README.md`, `OPERATIONAL_STATE.md`, `FEATURE_RECON.md`, and `ICON_UX_RESEARCH.md`.
- Test Suites: Multi-tier unit and runtime tests in `tests/` (`architecture.test.cjs`, `model.test.cjs`, `runtime.test.cjs`, `appearance.test.cjs`, etc.).
- Media Privacy Boundary: Real walkthrough footage and private survey photos remain strictly quarantined on local storage and are excluded from git repository tracking.

## Product Principles
1. **The Model Is the Interface**: Viewport belongs to the apartment diorama; controls, inspectors, and menus stay compact, contextual, and unobtrusive until requested.
2. **Honesty Over Automation**: Clearly distinguish provisional visual estimates from tape-verified geometry; never fabricate outlets, dimensions, or structural joins.
3. **Absolute Local Privacy**: Keep all personal spaces, floor plans, and media strictly on the user's local device with zero cloud dependencies or telemetry.
4. **Resilient Zero-Install Portability**: Run directly from a self-contained local HTML file across devices without mandatory build tools, accounts, or network access.

## Accessibility & Inclusion
- Touch, mouse, and full keyboard navigation (V=Move, B=Build, A=Add, Q/E=Rotate, Escape=Close drawer, F=Fit).
- Respects `prefers-reduced-motion` and implements strict focus traps and restoration on modal dialogs.
- Tested responsive viewports down to 320px mobile screens with high-contrast focus cues and in-app confirmation dialogues.
