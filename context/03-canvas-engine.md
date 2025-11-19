# Patch Canvas Engine

## Purpose
Renders and manages the interactive agroforestry canvas: bed creation, plant placement, focus mode, minimap/timeline overlays, and template-assisted workflows.

## Key Files & Directories
- `src/features/canvas/components/` – React components for the canvas surface (`PatchCanvas`, `CanvasLayout`, `CanvasControls`, `PlantSelectionPanel`, minimap, bulk placement panels, timeline overlays, etc.).
- `src/features/canvas/hooks/` – Extensive hook suite orchestrating gestures, pointer events, selection, layout, rendering, templates, and offline persistence (e.g., `usePatchCanvasOrchestrator`, `useCanvasRenderer`, `usePlantSelectionFlow`).
- `src/features/canvas/stores/` – Zustand stores for beds, focus mode, history, plant placements, timeline, bulk placement state, etc.
- `src/features/canvas/utils/` – Canvas rendering helpers (`gridRenderer`, `bedRenderer`, `plantRenderer`, `renderOrchestrator`), math utilities, template helpers, storage helpers, and animation schedulers.
- `src/features/canvas/data/` – Species library, growth curves, planting templates used by selection panels and growth timeline provider.
- `src/features/canvas/providers/GrowthTimelineProvider.tsx` – Supplies seasonal/timeline context to the canvas header and overlays.
- `src/features/canvas/docs/HOOK_ARCHITECTURE.md` – Comprehensive documentation of the 3-level hook orchestration pattern (Atomic → Composite → Page), naming conventions, data flow, and anti-patterns.

## Notable Functions & Components
- `PatchCanvas` + `usePatchCanvasOrchestrator` – Entry point that wires refs, collapse state, and layout props for the canvas surface.
- `CanvasLayout`/`CanvasLayoutProvider` – Split-screen layout that combines toolbar, minimap, overlays, and `<canvas>` element.
- `PlantSelectionPanel` and sub-components – Filter/search UI for species with tabs for bulk vs. individual placement.
- `StorageDebugPanel`, `DevelopmentInfo` – Optional diagnostics gated by `NODE_ENV`.
- Utility renderers such as `renderOrchestrator`, `gridRenderer`, `bedRenderer`, `plantRenderer`, and `growthCalculations` centralize drawing math and should be edited instead of duplicating logic.

## External Dependencies
- `zustand` and `zustand/middleware` for state synchronization.
- Browser Canvas APIs, `requestAnimationFrame`, and pointer events; no third-party canvas library is used.
- IndexedDB/localStorage access via `src/features/canvas/storage/` modules for offline persistence.
- `date-fns` in timeline/growth helpers, `lucide-react` icons inside UI chrome.

## Context Tips
- Hooks are composed hierarchically: orchestrators call lower-level hooks (gestures → viewport → renderer). Touch the orchestrator when altering cross-cutting behavior. See `HOOK_ARCHITECTURE.md` for the complete 3-level pattern (Atomic → Composite → Page).
- Many hooks assume a browser environment (direct `window`/`document` access). Guard custom code if you ever introduce SSR/testing harnesses.
- Rendering utilities expect bed dimensions in meters and convert to canvas pixels through shared grid math (`gridMath.ts`). Keep these helpers authoritative to avoid misaligned visuals.
- When adding new overlays or modes, extend the relevant Zustand stores (`focusModeStore`, `timelineStore`, etc.) and register event handlers inside `useCanvasEventOrchestrator` to stay consistent.
- Follow hook naming conventions: `use<Entity><Action>` for atomics (e.g., `useViewportZoom`), `use<Domain><Feature>` for composites (e.g., `useCanvasRenderer`), `use<Page>Orchestrator` for page-level (e.g., `usePatchCanvasOrchestrator`).
