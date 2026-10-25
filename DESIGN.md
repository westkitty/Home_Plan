---
name: Home Plan — Apartment Workshop
description: Offline model-first apartment workshop with progressive controls, 3D perspective diorama, Survey Studio and Design Lab
colors:
  primary: "#f0c78a"
  primary-hover: "#ffd395"
  primary-active: "#dfb877"
  secondary: "#93d2c2"
  accent-warm: "#f5bc70"
  danger: "#f09f88"
  surface-focus: "#152b23"
  surface-glass: "rgba(23,43,35,0.94)"
  surface-panel: "#182824"
  surface-card: "#25362d"
  surface-light: "#f4f1e9"
  neutral-bg: "#111818"
  scene-sky: "#C9E9FF"
  text-primary: "#f1f1e8"
  text-muted: "#a4b9ac"
  text-dark: "#1b322b"
  border-line: "#41594c"
  border-subtle: "rgba(182,212,183,0.30)"
typography:
  display:
    fontFamily: "Georgia, serif"
    fontSize: "clamp(24px, 2.8vw, 36px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Georgia, serif"
    fontSize: "clamp(20px, 2.3vw, 31px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "11px"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "0.075em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "17px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-focus}"
    rounded: "{rounded.md}"
    padding: "9px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
  dock-item:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "8px"
    size: "46px"
  dock-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-focus}"
---

# Design System: Home Plan — Apartment Workshop

## Overview

**Creative North Star: "The Architectural Diorama Workshop"**

Home Plan presents the user's home as a handcrafted physical scale model placed on an architect's drafting desk. Rather than an intimidating, wireframe-heavy CAD suite or a garish gamified app, the environment feels tactile, focused, and calm. Translucent evergreen work surfaces overlay an illustrative perspective diorama, allowing spatial geometry to command total attention while controls remain immediately reachable on demand.

The interface adheres to an uncompromising model-first discipline: the apartment is the canvas and fills the full viewport. Interactive chrome is condensed into three compact control islands (project top-left, camera top-right, and editing dock bottom-center) occupying under 2% to 8% of the viewport area at rest. Palettes, inspectors, and tools deploy as ephemeral floating glass lenses (`backdrop-filter: blur(18px)`) that dismiss cleanly on outside taps or `Escape`, restoring unbroken contact with the space.

**Key Characteristics:**
- **Model-First Primacy**: The 3D perspective apartment diorama owns the screen; UI elements are lightweight contextual overlays, never permanent layout-stealing sidebars.
- **Architectural Workshop Tactility**: Deep studio evergreen panels, warm ochre brass indicators, and blueprint sky backdrops evoke classic physical modeling craft.
- **Honest Visual Calibration**: Unmeasured provisional assumptions and tape-verified geometric facts use distinctly separated visual weights so estimates are never mistaken for surveyed truth.
- **Progressive Disclosure**: Tools surface contextually when an object or space is active (e.g. contextual floating chips, on-demand drawers) without cluttering exploratory navigation.

## Colors

The palette balances warm workshop materials—deep studio evergreen, warm ochre brass, and paper tints—against an expansive blueprint sky background.

### Primary
- **Warm Ochre** (`#f0c78a`): The primary interaction accent. Applied to active tool dock states, primary confirmation buttons, selected object outlines, and focus rings. Evokes polished brass drafting rules and warm interior task lighting.

### Secondary
- **Sage Teal** (`#93d2c2`): Used for secondary callouts, verified survey state badges, Design Lab highlights, and measured distance markers. Provides calming, organic balance to the warm ochre.
- **Soft Ember** (`#f09f88`): The danger and collision warning accent. Reserved strictly for destructive actions (e.g., room deletions, unconfirmed clears) and spatial proximity alerts.

### Neutral
- **Studio Evergreen** (`#152b23` / `rgba(23,43,35,0.94)`): The primary surface background for all floating islands, drawers, and modal sheets. Deep, saturated, and matte.
- **Deep Workshop Base** (`#111818`): Foundation backing behind the canvas shell and outer app framing.
- **Blueprint Sky** (`#C9E9FF`): The default scene background color behind the apartment diorama. User-customizable per device, representing a sunlit drafting studio horizon.
- **Parchment White** (`#f1f1e8`): Primary text color across all evergreen surfaces, offering crisp contrast without stark digital glare.
- **Muted Sage** (`#a4b9ac`): Secondary text, captions, structural dividers, and subtle architectural coordinates.
- **Line Spruce** (`#41594c` / `rgba(182,212,183,0.30)`): Perimeter 1px border stroke framing all panels, buttons, and input fields.

### Named Rules
**The Warm Brass Accent Rule.** The primary ochre accent (`#f0c78a`) is strictly reserved for user focus, active tool states, and primary execution triggers. It must never coat static decorative backgrounds or secondary passive tiles.
**The Backdrop Independence Rule.** The scene background color (`#C9E9FF`) is an appearance preference that tints only the outdoor diorama atmosphere. It must never bleed into or alter UI panel tokens, furniture materials, or exported apartment schema data.

## Typography

The type system pairs an elegant, literary serif for titles and architectural landmarks with a crisp, geometric sans-serif for high-density tools, coordinates, and measurements.

**Display Font:** Georgia, serif (fallback: serif)  
**Body Font:** Inter, ui-sans-serif, system-ui, -apple-system, sans-serif  
**Label/Mono Font:** ui-monospace, SFMono-Regular, Menlo, monospace  

**Character:** Georgia delivers editorial warmth and quiet authority for major room titles, welcome dialogues, and survey phases. Inter handles high-density technical controls, tabs, and inspector fields with zero ambiguity.

### Hierarchy
- **Display** (SemiBold 600, `clamp(24px, 2.8vw, 36px)`, line-height 1.1, letter-spacing -0.025em): Modal headers, Design Lab hero titles, and Survey Studio sequence anchors.
- **Headline** (SemiBold 600, `clamp(20px, 2.3vw, 31px)`, line-height 1.2, letter-spacing -0.02em): Section headers, survey step titles, and empty-state callouts.
- **Title** (Bold 700, `17px`, line-height 1.3): Inspector card headers, drawer category titles, and modal dialogue names.
- **Body** (Regular 400, `13px`, line-height 1.6): Contextual tips, capture instructions, room descriptions, and advisory notices. Maximum line length 65ch.
- **Label** (Bold 750, `11px`, letter-spacing 0.075em, uppercase): Field labels, dock button labels, tab titles, status pill badges, and keyboard shortcuts.

### Named Rules
**The Editorial Heading Rule.** Serif type (`Georgia`) belongs exclusively to top-level narrative milestones and modal introductions. All tool labels, numerical data, and inspector inputs must use sans-serif or monospace to preserve drafting precision.
**The Tabular Metrics Rule.** All physical dimensions, tape readings, coordinates, and budget totals must use tabular numbers (`font-variant-numeric: tabular-nums`) or monospace fonts to prevent layout jitter during live edits.

## Layout

The spatial model enforces zero screen obstruction. The diorama canvas occupies 100% of the viewport width and height (`100dvh`). Controls float in three dedicated perimeter zones:

1. **Project Island** (Top Left): Anchored at `top: 13px; left: 14px`. Houses project name, file operations, appearance settings, and global export launchers.
2. **View Island** (Top Right): Anchored at `top: 13px; right: 14px`. Houses perspective presets (Dollhouse, 3D Orbit, Top Plan), camera zoom, and minimap toggles.
3. **Action Dock** (Bottom Center): Centered at `bottom: 14px; left: 50%; transform: translateX(-50%)`. Houses the core tool modes: Move, Add, Build, and Tools.
4. **Context Selection Chip** (Bottom Floating): Centered at `bottom: 82px; left: 50%; transform: translateX(-50%)`. Surfaces immediately upon object selection with item name, Edit shortcut, and Deselect button.

### Responsive Breakpoints
- **Desktop (≥1050px)**: Floating islands maintain full padding; drawers expand up to 800px width with multi-column item grids.
- **Tablet (768px - 1049px)**: Tool shelf adapts to 4 columns; dock padding slightly tightened; inspector width clamped to 356px.
- **Mobile (<760px)**: Bottom dock switches to compact 46px square icon buttons with safe-area bottom offset; drawers occupy `width: calc(100vw - 16px)` and slide upward over the stage; keyboard shortcuts remain accessible via the mobile action drawer.

### Named Rules
**The Model-First Rule.** Interactive UI controls must occupy no more than 10% of total viewport surface area at rest. Any secondary panel or drawer opened by the user must float over the canvas rather than resizing or letterboxing the camera viewport.

## Elevation & Depth

Home Plan avoids harsh dropshadows or heavy skeuomorphic bevels, relying instead on frosted glass layering, soft ambient halos, and precise edge illumination.

Depth is conveyed through a three-plane hierarchy:
1. **Scene Plane (Z=0)**: The interactive 3D Canvas diorama with simulated contact shadows under placed furniture and architectural floor slabs.
2. **Floating Controls (Z=30)**: Compact dock buttons and status islands cast soft ambient shadows (`0 6px 25px rgba(17,37,26,0.22)`) with subtle frosted diffusion (`backdrop-filter: blur(14px)`).
3. **Modal & Drawer Overlays (Z=40-100)**: Shelves, inspectors, and full-screen studio suites cast deep atmospheric silhouettes (`0 22px 80px rgba(0,0,0,0.56)`) over a backdrop darkener (`rgba(8,21,16,0.78)`).

### Shadow Vocabulary
- **Control Ambient** (`0 6px 25px rgba(17,37,26,0.22)`): Subtle grounding shadow for floating dock pills and view toggles.
- **Drawer Glow** (`0 14px 46px rgba(7,25,17,0.22)`): Diffuse atmospheric elevation for the bottom tool rail and architecture palette.
- **Modal Silhouette** (`0 26px 85px rgba(7,20,15,0.60)`): Deep structural separation for Design Lab and Survey Studio dialogs.

### Named Rules
**The Translucent Lens Rule.** Elevated drawers and panels must maintain partial optical transmission (`backdrop-filter: blur(18px)`, alpha 0.94). They must never use 100% opaque black, preserving the feeling that the user is working directly over the apartment model.

## Shapes

Forms are organic yet disciplined, pairing rounded corners with crisp 1px structural framing.

- **Micro Controls & Chips**: 6px - 8px radius (`rounded.sm`). Used for status tags, keyboard badges, and nested table cells.
- **Buttons & Inputs**: 10px radius (`rounded.md`). Used for action triggers, field inputs, and color selectors.
- **Control Islands**: 14px - 18px radius (`rounded.lg` / `rounded.xl`). Used for floating docks, header popovers, and inspector sheets.
- **Pills & Toggles**: 9999px radius (`rounded.full`). Used for mode switchers and survey progress caps.

### High-Visibility Focus Outline
Every focusable control, button, input, and slider must expose an unclipped `3px solid #edc280` outline with `2px` outline offset under `:focus-visible`.

## Components

### Primary Button
- **Shape**: Rounded rectangle (`10px` radius).
- **Primary Style**: Background `#f0c78a`, text color `#152b23`, font-weight 750, padding `9px 14px`.
- **Hover / Focus**: Background `#ffd395`, transform `translateY(-1px)`. Focus outline `3px solid #edc280` with `2px` offset.
- **Active**: Background `#dfb877`, transform `translateY(1px)`.

### Ghost & Secondary Button
- **Shape**: Rounded rectangle (`10px` radius).
- **Style**: Transparent background, border `1px solid rgba(182,212,183,0.30)`, text `#f1f1e8`, padding `9px 12px`.
- **Hover / Focus**: Background `rgba(38,70,55,0.48)`, border color `#a4b9ac`.

### Floating Dock Pill
- **Shape**: Smooth capsule (`18px` radius).
- **Style**: Background `rgba(15,38,29,0.82)`, border `1px solid rgba(204,228,201,0.25)`, backdrop blur `14px`, padding `4px`.
- **Items**: 43px - 46px height, rounded `13px`, text `#f0f3e8`. Active item takes `#f0c78a` with `#1a382d` text.

### Context Selection Chip
- **Shape**: Floating pill (`14px` radius).
- **Style**: Centered above the dock at `bottom: 82px`, background `rgba(20,52,41,0.94)`, border `1px solid rgba(185,218,190,0.48)`, padding `5px 6px 5px 13px`.
- **Action**: Direct Edit button (`#e9c58b`) and compact Deselect cross (`×`).

### Catalog Tile Card
- **Shape**: Rounded card (`9px` radius).
- **Style**: Background `#25362d`, border `1px solid #41564a`, padding `9px`, display flex with thumbnail icon (`33px` square) and title/dimensions copy.
- **Hover**: Background `#33493c`, border color `#cda773`.

### Context & Help Dialog
- **Shape**: Large modal card (`18px` radius).
- **Style**: Background `#1b3529`, border `1px solid #a1b8a2`, shadow `0 22px 80px rgba(0,0,0,0.56)`, padding `24px`.
- **Backdrop**: `rgba(4,18,12,0.64)` with `backdrop-filter: blur(3px)`.

## Do's and Don'ts

### Do:
- **Do** maintain the 3D perspective diorama as the dominant element on all viewports, ensuring floating chrome occupies <10% of screen area at rest.
- **Do** use `Georgia` exclusively for top-level narrative titles and modal welcome headers, while keeping all numerical measurements and technical controls in `Inter` or monospace.
- **Do** clearly differentiate between unverified visual estimates and tape-verified measurements using explicit tags (`AMBER = provisional`, `GREEN = verified`).
- **Do** apply `backdrop-filter: blur(18px)` and thin perimeter strokes (`1px solid var(--focus-line)`) to all floating drawers and sheets.
- **Do** enforce a high-visibility `3px solid #edc280` focus outline on every interactive element under keyboard navigation.

### Don't:
- **Don't** add permanent left or right sidebars that pin to the edge and permanently narrow the camera viewport.
- **Don't** use cold, stark wireframe aesthetics, cyan sci-fi HUDs, or neon gamified badges that break the handcrafted architectural diorama atmosphere.
- **Don't** auto-apply room or wall dimensions without explicit confirmation from the user.
- **Don't** use browser-native `confirm()` or `alert()` dialogues; always use self-contained, keyboard-trapped in-app dialogs.
- **Don't** couple the user's personal scene background color preference to exported apartment JSON geometry.
