# Patch Creator Workflow

## Purpose
Coordinates the high-level UX for designing agroforestry patches: toggling focus mode, selecting species, showing timeline controls, and bridging between canvas state and UI chrome.

## Key Files & Directories
- `src/pages/PatchCreatorPage.tsx` – Top-level page that initializes offline storage, fetches Zustand slices via `usePatchCreatorState`, and renders layout + panels.
- `src/features/patch-creator/hooks/usePatchCreatorState.ts` – Central hook that collects viewport, tool, focus mode, placement state, and timeline toggles; exposes handlers for patch lifecycle events.
- `src/features/patch-creator/components/PatchCreatorHeader.tsx` – Sticky header showing focus breadcrumbs, timeline toggle, and dev metrics.

## Major Functions & Components
- `usePatchCreatorState` – Wraps multiple stores (`useBedStore`, `usePlantPlacementStore`, `useTimelineStore`) and offline storage, providing callbacks such as `handleSelectSpecies`, `handleCreateNewPatch`, and `handleViewportChange`.
- `PatchCreatorHeader` – React component that responds to focus mode and device type, optionally toggling timeline when placements exist.
- `PatchCreatorPage` – Applies `GrowthTimelineProvider`, `MainLayout`, `PatchCanvas`, `PlantSelectionPanel`, and `StorageDebugPanel` together and handles loading/error states for offline storage.

## External Dependencies
- Hooks from the canvas engine (`useOfflineStorage`, `usePatchCanvasOrchestrator`).
- Zustand stores for beds, focus mode, placements, and timeline status.
- `lucide-react` icons and shadcn buttons for header controls.

## Context Tips
- `usePatchCreatorState` force-sets the canvas tool to `pan` on mount and logs debug information in development; keep these side effects in mind when layering additional state.
- Storage initialization gates rendering—showing fallback UIs until `useOfflineStorage` resolves. Account for these states when injecting new UI.
- To add new header controls, extend `PatchCreatorHeaderProps` and ensure they are derived from `usePatchCreatorState` rather than duplicating store access across components.
