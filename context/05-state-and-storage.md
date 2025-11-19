# State & Offline Storage

## Purpose
Manages long-lived UI state (menus, beds, plants, focus mode, history) and persists patch data through IndexedDB with localStorage fallback + auto-save orchestration.

## Key Files & Directories
- `src/stores/menuStore.ts` – Lightweight Zustand store for global menu open state and active menu item.
- `src/features/canvas/stores/` – Core domain stores:
  - `bedStore.ts`/`bedState.ts` – CRUD for beds, current tool, history integration, selection helpers.
  - `focusModeStore.ts`, `historyStore.ts`, `timelineStore.ts`, `sideViewStore.ts`, `bulkPlacementStore.ts`, `plantPlacementStore.ts` – Specialized slices for canvas behaviors.
  - `types.ts` – Shared interfaces for actions/state.
- `src/features/canvas/hooks/useOfflineStorage.ts` – Public API for storage lifecycle plus export/import/clear operations.
- `src/features/canvas/hooks/useAutoSave*.ts` – Debounced saving hooks for beds, plants, and patches plus orchestrator.
- `src/features/canvas/storage/` – Modular IndexedDB persistence layer:
  - `schema.ts` – DB constants, version, store names, storage keys.
  - `connection.ts` – `openDB`, `isIndexedDBAvailable`, migrations.
  - `operations.ts` – CRUD: `upsertPatches`, `loadPatchData`, `deletePatch`, etc. All operations use retry logic and validate data on save/load.
  - `fallback.ts` – localStorage fallback save/load helpers.
  - `export.ts` – `exportAllData`, `importAllData`.
  - `index.ts` – Re-exports for backward compatibility.
- `src/features/canvas/validation/` – Runtime validation layer:
  - `schemas.ts` – Zod schemas for Patch, Bed, PlantPlacement, PlantSpecies with helper functions (`validatePatches`, `validateBeds`, `validatePlacements`) and `ValidationError` class.
- `src/lib/retry.ts` – Generic retry utility with exponential backoff, jitter, and IndexedDB-specific error handling (`withRetry`, `retryAsync`, `isIndexedDBRetryable`).

## Major Functions & Responsibilities
- `useBedStore()` – Aggregates bed, focus, and history stores; auto-subscribes to `beds` changes to push undo stacks and prune focus mode placements.
- `usePlantPlacementStore` – Tracks placement objects, ensures `isDirty` flags trigger saves, and exposes helpers like `clearPlacementsForBed`.
- `useAutoSaveOrchestrator` – Coordinates initialization, per-entity debounce timings, manual saves, error tracking, beforeunload handlers, and exposes `patchesDirty/bedsDirty/plantsDirty` booleans.
- `useOfflineStorage` – Wraps orchestrator to provide `saveAll`, `exportData`, `importData`, `clearData`, `reinitialize`, and status flags consumed by UI.
- Storage module functions – Low-level persistence utilities split across modules:
  - `connection.ts`: `openDB`, schema migrations
  - `operations.ts`: `upsertPatches`, `loadPatchData`, `deletePatch`, `clearAllStorage`
  - `fallback.ts`: `saveToLocalStorageFallback`, `loadFromLocalStorageFallback`
  - `export.ts`: `exportAllData`, `importAllData`

## External Dependencies
- `zustand` + `persist` middleware for state + storage.
- `zod` for runtime schema validation of patches, beds, and placements.
- Browser IndexedDB + localStorage APIs; asynchronous operations rely on Promises with automatic retry logic.
- `react` hooks (`useEffect`, `useState`, `useRef`) for orchestrator lifecycle.

## Context Tips
- Many stores expose both base state (via `useBedState`) and composed selectors (via `useBedStore`). Pick the minimal API you need—subscribing to entire stores can cause unnecessary re-renders.
- Auto-save hooks assume they run in the browser and will warn if storage is uninitialized; guard new code accordingly.
- Changing DB schema requires bumping `DB_VERSION` in `src/features/canvas/storage/schema.ts` and handling migrations in `connection.ts`'s `onupgradeneeded`.
- Manual destructive actions should coordinate with `useOfflineStorage.clearData()` to keep IndexedDB/localStorage in sync instead of clearing stores independently.
- Storage operations automatically retry on transient IndexedDB errors (QuotaExceededError, UnknownError, TransactionInactiveError) with exponential backoff. Use `retryIndexedDB` helper for custom storage operations.
- All data is validated with Zod schemas on both save and load. Invalid data throws `ValidationError` with detailed error messages. Extend schemas in `src/features/canvas/validation/schemas.ts` when adding new fields.
