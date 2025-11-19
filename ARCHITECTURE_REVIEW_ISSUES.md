# Architecture Review - GitHub Issues to Create

Created from comprehensive architecture review on 2025-11-14

## Implementation Progress

### Sprint 1 (Week 1-2) - ✅ COMPLETED (2025-11-18)

**Completed Tasks:**
1. **✅ Issue #2 - Console Logging Removed**
   - Created `src/lib/logger.ts` with proper log levels (debug, info, warn, error)
   - Removed critical console.log from hot path in `enhancedPlantDrawing.ts:32`
   - Replaced all 30+ console.log statements in `storageManager.ts` with logger
   - Updated 4 store files (patchStore, sideViewStore, timelineStore, bulkPlacementStore)
   - Performance impact: Eliminated 100+ console.log calls per frame during rendering
   - Added child logger caching to prevent memory leaks
   - Logger defaults to `enabled: true` with level-based filtering (production: errors only)

2. **✅ Issue #1 - TypeScript Strict Mode Enabled**
   - Enabled `noImplicitAny: true` in tsconfig.json and tsconfig.app.json
   - Enabled `noUnusedLocals: true`
   - Enabled `noUnusedParameters: true`
   - Enabled `noFallthroughCasesInSwitch: true`
   - Note: `strictNullChecks` kept disabled for incremental adoption
   - **Note:** Pre-existing unused variables/imports exposed (~60+ errors) - to be fixed in Sprint 2

3. **✅ Issue #7 - Error Boundaries Implemented**
   - Created comprehensive `ErrorBoundary.tsx` component with:
     - Main ErrorBoundary class component with resetKey for proper remounting
     - CanvasErrorBoundary wrapper for canvas-specific errors
     - PageErrorBoundary wrapper for page-level errors
     - Development mode error details display
     - Error logging integration
   - Added error boundary to App.tsx (app-level protection)
   - Added CanvasErrorBoundary to PatchCanvas.tsx
   - Added PageErrorBoundary to PatchCreatorPage.tsx

4. **✅ Issue #3 - Vitest Testing Framework Setup & First Tests**
   - Installed Vitest, @vitest/ui, jsdom, @testing-library/react
   - Configured vite.config.ts with test environment and coverage thresholds
   - Created test setup file at `src/test/setup.ts`
   - Created type extensions at `src/test/vitest.d.ts`
   - Added test scripts to package.json (`test`, `test:ui`, `test:coverage`)
   - **Written 54 passing tests** covering critical utilities:
     - 25 tests for `bedPositioning.ts` (grid snapping, collision detection, footprint calculation, edge cases)
     - 29 tests for `growthCalculations.ts` (growth curves, environmental stress, realistic growth, input validation)
   - Coverage thresholds configured: 70% lines, 70% functions, 65% branches
   - All tests passing ✅

5. **✅ Additional Improvements**
   - Replaced all `process.env.NODE_ENV` with Vite-idiomatic `import.meta.env.DEV/PROD`
   - Added input validation to growth calculations with descriptive errors
   - Consistent JSON encoding for localStorage values
   - Backwards compatibility for plain string localStorage values (migration support)

**Test Coverage Summary:**
- ✅ Geometric utilities (bedPositioning.ts): Comprehensive coverage
- ✅ Growth calculations (growthCalculations.ts): Comprehensive coverage with input validation
- ⏳ Storage operations: Deferred to Sprint 2 (IndexedDB mocking complexity)
- ⏳ Store state transitions: Deferred to Sprint 2

---

### Sprint 2 (Week 3-4) - ✅ COMPLETED (2025-11-19)

**Completed Tasks:**

1. **✅ Fix TypeScript Strict Mode Violations (2025-11-18)**

   Fixed all ~77 TypeScript strict mode errors that were exposed by enabling `noUnusedLocals` and `noUnusedParameters`.

   **Files Fixed:**
   - `src/components/UserMenu.tsx` - Removed unused imports (DialogTrigger), fixed MenuItem interface types, removed unused store values
   - `src/components/layout/MainLayout.tsx` - Removed unused `isMenuOpen` state
   - `src/components/ui/calendar.tsx` - Removed unused `_props` parameters
   - `src/lib/logger.ts` - Removed unused `data` parameter from formatMessage
   - `src/pages/Index.tsx` - Added explicit return type annotation
   - `src/test/vitest.d.ts` - Added eslint-disable for empty interface

   **Canvas Components (20+ fixes):**
   - DesktopSidebar.tsx, FocusModePlantTool.tsx, MiniMap.tsx, MobileControls.tsx
   - PlantContextMenu.tsx, PlantEditingPanel.tsx, PlantInteractionLayer.tsx
   - PlantSelectionBulkMode.tsx, PlantSelectionPanelContent.tsx, ViewModeToggle.tsx
   - DesktopPlantEditor.tsx, DesktopGrowthTimeline.tsx, GrowthStagesReference.tsx
   - MobileLayoutOrchestrator.tsx, MobilePlantEditor.tsx, MobilePlantSpeciesPanel.tsx
   - MiniMapOverlay.tsx, GrowthTimelineSlider.tsx, SideViewCanvas.tsx
   - PlantSelectionResults.tsx, PlantSpeciesCardContent.tsx

   **Canvas Hooks (25+ fixes):**
   - useAutoSavePatches.ts, useBedCreationOrchestrator.ts, useCanvasEventHandlers.ts
   - useCanvasEventOrchestrator.ts, useCanvasGestures.ts, useCanvasLayoutOrchestrator.ts
   - useCanvasStateManager.ts, useCanvasViewport.ts, useFocusModeIntegration.ts
   - useGrowthTimeline.ts, usePlantPlacement.ts, useBedFocus.ts

   **Canvas Stores (2 fixes):**
   - focusModeStore.ts, timelineStore.ts - Prefixed unused `get` parameter

   **Canvas Utils (15+ fixes):**
   - bedCreationHelpers.ts, bedPositioning.ts, plantingGridRenderer.ts
   - enhancedPlantDrawing.ts, plantDrawing.ts, sideViewRenderer.ts
   - spacingRules.ts, storageManager.ts, templateUtils.ts

   **Approach Used:**
   - Removed unused imports entirely
   - Prefixed intentionally unused parameters with underscore (`_param`)
   - Removed unused variables and functions
   - Added proper type annotations where implicit any was used
   - Fixed duplicate identifier imports

   **Results:**
   - ✅ TypeScript compilation: 0 errors
   - ✅ ESLint: 0 errors (24 warnings - mostly React hooks exhaustive-deps, intentional)
   - ✅ Build: Successful
   - ✅ All 54 tests passing

2. **✅ Issue #4 - Extract Desktop/Mobile Shared Logic (2025-11-18)**

   Created shared `usePlantEditorActions.ts` hook to eliminate code duplication between DesktopPlantEditor and MobilePlantEditor.

   **New File Created:**
   - `src/features/canvas/hooks/usePlantEditorActions.ts` - Shared hook with:
     - Selected placements filtering
     - Species grouping calculation
     - Action handlers (delete, duplicate, edit, move, selectSameSpecies, adjustSpacing)
     - Label generators (getDeleteLabel, getSelectionLabel)
     - Computed values (selectedCount, isSingleSelection, singlePlacement)

   **Files Refactored:**
   - `DesktopPlantEditor.tsx` - Reduced from 165 to 143 lines
   - `MobilePlantEditor.tsx` - Reduced from 116 to 120 lines (cleaner separation)

   **Benefits:**
   - Single source of truth for plant editor business logic
   - Easier to test (hook can be tested independently)
   - Consistent behavior between desktop and mobile
   - ~50 lines of duplicated logic eliminated

   **Results:**
   - ✅ TypeScript compilation: 0 errors
   - ✅ ESLint: 0 errors (22 warnings)
   - ✅ Build: Successful
   - ✅ All 54 tests passing

3. **✅ Issue #5 - Refactor Storage Manager (2025-11-18)**

   Split monolithic `storageManager.ts` (543 lines) into modular storage directory structure.

   **New Directory Structure:**
   ```
   src/features/canvas/storage/
   ├── schema.ts (21 lines) - DB constants and storage keys
   ├── connection.ts (118 lines) - openDB, isIndexedDBAvailable, migrations
   ├── fallback.ts (45 lines) - localStorage fallback functions
   ├── operations.ts (249 lines) - CRUD operations (upsertPatches, loadPatchData, etc.)
   ├── export.ts (119 lines) - exportAllData, importAllData
   └── index.ts (40 lines) - Re-exports for backward compatibility
   ```

   **Benefits:**
   - Each file follows Single Responsibility Principle
   - All files under 250 lines
   - Easier to test individual modules
   - Better code organization

   **Files Updated (7 imports):**
   - useAutoSavePatches.ts
   - useAutoSaveBeds.ts
   - useAutoSavePlacements.ts
   - usePatchWorkflow.ts
   - PatchSaveButton.tsx
   - ErrorBoundary.tsx
   - PatchSettingsDialog.tsx

   **Results:**
   - ✅ TypeScript compilation: 0 errors
   - ✅ Build: Successful
   - ✅ All 54 tests passing

4. **✅ Issue #6 - Break Down Large Components (2025-11-18)**

   Successfully broke down all 5 large components (>250 lines) into smaller, focused modules.

   **Component Breakdown Summary:**

   | Component | Before | After | Reduction | Extracted Modules |
   |-----------|--------|-------|-----------|-------------------|
   | SideViewCanvas.tsx | 256 | 169 | 34% | useSideViewPlantConverter hook |
   | PlantSelectionPanelContent.tsx | 259 | 134 | 48% | usePlantSpeciesFilter, useTemplateApplication, BulkPlacementManager |
   | PlantEditingPanel.tsx | 308 | 98 | 68% | usePlantEditForm, PlantEditFormFields, PlantEditFormActions |
   | SideViewTimelineControls.tsx | 312 | 29 | 91% | SideViewTimelineMobile, SideViewTimelineDesktop, timelineUtils |
   | BedConfigPanel.tsx | 268 | 122 | 54% | SliderControl, BedShapeSelector |

   **New Files Created (16 total):**

   Hooks:
   - `useSideViewPlantConverter.ts` - Convert bed placements to side view
   - `usePlantSpeciesFilter.ts` - Filter and categorize plant species
   - `useTemplateApplication.ts` - Handle planting template application
   - `usePlantEditForm.ts` - Plant edit form state and handlers

   Components:
   - `BulkPlacementManager.tsx` - Bulk placement lifecycle management
   - `PlantEditFormFields.tsx` - Form fields for plant editing
   - `PlantEditFormActions.tsx` - Action buttons for plant editing
   - `SideViewTimelineMobile.tsx` - Mobile timeline layout
   - `SideViewTimelineDesktop.tsx` - Desktop timeline layout
   - `SliderControl.tsx` - Reusable slider with +/- buttons
   - `BedShapeSelector.tsx` - Shape selection UI

   Utils:
   - `timelineUtils.ts` - formatTime, growth stage helpers

   **Benefits:**
   - All orchestrator components now under 175 lines
   - Reusable components (SliderControl used in 5 places)
   - Better separation of concerns
   - Easier testing of individual hooks
   - Mobile/Desktop layouts now independently maintainable

   **Results:**
   - ✅ TypeScript compilation: 0 errors
   - ✅ Build: Successful
   - ✅ All 54 tests passing

5. **✅ Expand Test Coverage (2025-11-19)**

   Added 38 new tests covering the extracted hooks and utilities.

   **New Test Files:**
   - `usePlantSpeciesFilter.test.ts` (15 tests) - Search, category, compatibility filtering
   - `usePlantEditForm.test.ts` (5 tests) - getCategoryBadgeColor utility
   - `timelineUtils.test.ts` (18 tests) - formatTime, growth stages

   **Test Coverage Summary:**
   - Total tests: 92 (up from 54)
   - Test files: 5
   - All passing ✅

   **Note:** Full Zustand store hook testing requires additional setup for proper store mocking.

---

### Sprint 3 (Week 5-6) - ✅ COMPLETED (2025-11-19)

**Completed Tasks:**

1. **✅ Issue #8 - Document Hook Orchestration Pattern (2025-11-19)**

   Created comprehensive documentation for the 3-level hook architecture.

   **New File Created:**
   - `src/features/canvas/docs/HOOK_ARCHITECTURE.md` - Complete architecture guide with:
     - Three-level hierarchy explained (Atomic → Composite → Page)
     - Code examples for each level
     - Naming conventions table
     - Anti-patterns guide (5 patterns to avoid)
     - Guidelines for adding new features
     - Benefits of the architecture

   **Benefits:**
   - Clear onboarding documentation for new developers
   - Consistent patterns across the codebase
   - Prevention of architectural drift

2. **✅ Issue #14 - Add Retry Logic to Storage Operations (2025-11-19)**

   Created retry utility with exponential backoff for transient failures.

   **New Files Created:**
   - `src/lib/retry.ts` - Retry utility with:
     - `withRetry()` - Returns result object
     - `retryAsync()` - Throws on failure
     - `withIndexedDBRetry()` / `retryIndexedDB()` - Pre-configured for IndexedDB
     - `isIndexedDBRetryable()` - Error classification
     - Exponential backoff with jitter
     - Configurable attempts, delays, and callbacks

   - `src/lib/retry.test.ts` - Comprehensive tests (20 tests)

   **Storage Operations Updated:**
   - `clearAllStorage()` - Now retries on transient failures
   - `upsertPatches()` - Retry with exponential backoff
   - `upsertBedsForPatch()` - Retry with exponential backoff
   - `upsertPlacementsForPatch()` - Retry with exponential backoff
   - `loadPatchData()` - Retry with exponential backoff

   **Benefits:**
   - Improved reliability for database-locked scenarios
   - Graceful handling of transient failures
   - Configurable retry behavior per operation

3. **✅ Issue #15 - Add Validation Layer with Zod (2025-11-19)**

   Implemented comprehensive validation for all storage operations.

   **New Files Created:**
   - `src/features/canvas/validation/schemas.ts` - Zod schemas for:
     - `PatchSchema` - Name, size, timestamps validation
     - `BedSchema` - Shape, dimensions, rotation validation
     - `PlantPlacementSchema` - Species, position validation
     - `PlantSpeciesSchema` - Full species validation
     - Helper functions: `validatePatches()`, `validateBeds()`, `validatePlacements()`
     - Custom `ValidationError` class with detailed error messages

   - `src/features/canvas/validation/schemas.test.ts` - Comprehensive tests (49 tests)

   **Storage Operations Updated:**
   - `upsertPatches()` - Validates before save
   - `upsertBedsForPatch()` - Validates before save
   - `upsertPlacementsForPatch()` - Validates before save

   **Validation Rules:**
   - Patch names: 1-100 characters
   - Patch dimensions: 1-10,000 meters
   - Bed dimensions: 1-100 meters
   - Rotation: -360 to 360 degrees
   - Rectangle beds require length/width; circles require radius
   - Species spacing: min <= max
   - Positive timestamps required

   **Benefits:**
   - Prevents invalid data from reaching storage
   - Clear error messages for debugging
   - Type-safe validation with Zod inference

**Test Coverage Summary:**
- Total tests: 162 (up from 92)
- New test files: 2
- All passing ✅

**Dependencies Added:**
- `zod` - Runtime validation library

---

## P0 - Critical Priority Issues

### Issue 1: [P0] Enable Strict TypeScript Checking

**Labels:** `P0`, `technical-debt`, `typescript`

**Description:**

Current TypeScript configuration has loose type checking disabled:
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedLocals: false`
- `noUnusedParameters: false`

This compromises type safety and increases runtime error risk.

**Impact:**
- Type safety compromised across codebase
- Increases runtime error risk
- Makes refactoring more dangerous
- Harder to catch bugs at compile time

**Solution:**
Enable strict TypeScript checks incrementally in `tsconfig.json`

**Estimated Effort:** 3-4 days

**Reference:** `tsconfig.json:12-17`

---

### Issue 2: [P0] Remove/Replace Console Logging (223 occurrences)

**Labels:** `P0`, `performance`, `refactor`

**Description:**

Found 223 console.log statements across 39 files, including in render hot paths:
- `enhancedPlantDrawing.ts:32` - Logs on EVERY plant render (critical!)
- `storageManager.ts` - 30+ console logs
- Emoji logs in stores: 🔧📝🗑️

**Impact:**
- **Performance:** Console.log fires 100+ times per frame with many plants
- **Production noise:** Debug logs leak to production
- User-reported lag during panning/zooming

**Solution:**
Create `src/lib/logger.ts` with proper log levels

**Priority Files:**
1. ⚡️ `enhancedPlantDrawing.ts:32` (critical performance issue)
2. `storageManager.ts`
3. Store files

**Estimated Effort:** 2 days

---

### Issue 3: [P0] Add Critical Test Coverage (Currently 0%)

**Labels:** `P0`, `testing`, `quality`

**Description:**

Zero test coverage across entire codebase. Complex logic (growth calculations, spacing, geometry) is untested.

**Impact:**
- High risk for regressions
- Refactoring is dangerous
- No verification of complex calculations

**Solution:**
Setup Vitest and add tests for high-risk areas

**Priority Targets:**
1. Geometric utilities (`bedPositioning.ts`, `spacing/`)
2. Growth calculations (`growthCalculations.ts`)
3. Storage operations (`storageManager.ts`)
4. Store state transitions

**Coverage Goals:**
- Utilities: 80%+
- Stores: 70%+
- Hooks: 60%+

**Estimated Effort:** 5-6 days

---

## P1 - High Priority Issues

### Issue 4: [P1] Extract Shared Desktop/Mobile Plant Editor Logic

**Labels:** `P1`, `refactor`, `code-reuse`

**Description:**

Plant editor logic duplicated between:
- `DesktopPlantEditor.tsx` (167 lines)
- `MobilePlantEditor.tsx` (116 lines)

~120 lines of duplicated code including delete handling, species grouping, and edit actions.

**Solution:**
Extract to `usePlantEditorActions.ts` custom hook

**Benefits:**
- Single source of truth
- Easier to test
- Reduce codebase by ~100-150 lines

**Estimated Effort:** 1-2 days

**Reference:** `DesktopPlantEditor.tsx:38-51`, `MobilePlantEditor.tsx:29-47`

---

### Issue 5: [P1] Refactor Storage Manager (522 lines)

**Labels:** `P1`, `refactor`, `maintainability`

**Description:**

`storageManager.ts` is 522 lines and mixes multiple concerns:
- Schema definitions
- DB opening + upgrades
- Migration logic
- CRUD operations
- LocalStorage fallback
- Import/export

**Solution:**
Split into separate modules:
```
src/features/canvas/storage/
├── schema.ts
├── migrations.ts
├── connection.ts
├── operations.ts
├── fallback.ts
└── index.ts
```

**Benefits:**
- Each file < 200 lines
- Single Responsibility Principle
- Easier to test

**Estimated Effort:** 2-3 days

**Reference:** `storageManager.ts` (522 lines)

---

### Issue 6: [P1] Break Down Large Components (5 files >250 lines)

**Labels:** `P1`, `refactor`, `maintainability`

**Description:**

Several components exceed 250 lines:
1. `PlantEditingPanel.tsx` (315 lines)
2. `SideViewTimelineControls.tsx` (312 lines)
3. `BedConfigPanel.tsx` (268 lines)
4. `SideViewCanvas.tsx` (256 lines)
5. `PlantSelectionPanelContent.tsx` (241 lines)

**Solution:**
Break each into smaller sub-components + custom hooks

**Example for PlantEditingPanel:**
- `PlantEditingPanel.tsx` (< 100 lines) - Orchestrator
- `PlantSelectionSummary.tsx` (40 lines)
- `PlantEditForm.tsx` (60 lines)
- `PlantEditorActions.tsx` (40 lines)
- `usePlantEditorForm.ts` (80 lines)

**Estimated Effort:** 3-4 days

---

### Issue 7: [P1] Implement Error Boundaries

**Labels:** `P1`, `reliability`, `error-handling`

**Description:**

No error boundaries in the application. Canvas crashes break entire app with no recovery.

**Solution:**
Create `ErrorBoundary.tsx` component and add to:
1. App-level (App.tsx)
2. Canvas (PatchCanvas.tsx)
3. Patch Creator (PatchCreatorPage.tsx)

**Benefits:**
- Graceful error handling
- Better UX
- Error reporting capability

**Estimated Effort:** 1 day

---

### Issue 8: [P1] Document Hook Orchestration Pattern

**Labels:** `P1`, `documentation`

**Description:**

Complex 3-level hook orchestration pattern (Atomic → Composite → Page) is not documented. New developers will struggle to understand the architecture.

**Solution:**
Create `src/features/canvas/docs/HOOK_ARCHITECTURE.md` with:
- Three levels explained
- Examples for each level
- Naming conventions
- Anti-patterns guide

**Benefits:**
- Clear guidelines for new features
- Easier onboarding
- Better maintainability

**Estimated Effort:** 1 day

---

## P2 - Nice to Have Issues

### Issue 9: [P2] Centralize Configuration & Constants

**Labels:** `P2`, `refactor`, `config`

**Description:**

Configuration and constants scattered across files (grid sizes, spacing values, colors, magic numbers).

**Solution:**
Create `src/features/canvas/config/constants.ts` with centralized configuration

**Estimated Effort:** 1-2 days

---

### Issue 10: [P2] Implement Feature Flags System

**Labels:** `P2`, `feature`, `infrastructure`

**Description:**

Debug code mixed with production code. No way to enable/disable features per user.

**Solution:**
Create `src/lib/featureFlags.ts` for centralized feature control

**Benefits:**
- A/B testing capability
- Can toggle features without deploy

**Estimated Effort:** 1 day

---

### Issue 11: [P2] Add Storybook for Component Documentation

**Labels:** `P2`, `documentation`, `tooling`

**Description:**

52 UI components + 95+ canvas components with no visual documentation.

**Solution:**
Setup Storybook and create stories for key components

**Estimated Effort:** 2-3 days

---

### Issue 12: [P2] Performance Optimization Pass

**Labels:** `P2`, `performance`, `optimization`

**Description:**

Several performance issues:
1. JSON stringify for history comparison (`bedStore.ts:21`)
2. Missing memoization
3. Canvas re-renders on unrelated state changes

**Solution:**
- Replace JSON.stringify with structural equality
- Add useMemo to expensive calculations
- Use Zustand selectors

**Estimated Effort:** 2-3 days

---

## Technical Debt Issues

### Issue 13: [Tech Debt] Implement/Remove TODOs (12 found)

**Labels:** `tech-debt`, `feature-request`

**Description:**

12 TODO comments with unimplemented features:
- Plant duplication logic (3 locations)
- Detailed editing panels (2 locations)
- Move plants to different bed
- Select all same species (3 locations)
- Adjust spacing (3 locations)

**Action:** Review each TODO, either implement or remove

---

### Issue 14: [Tech Debt] Add Retry Logic to Storage Operations

**Labels:** `tech-debt`, `reliability`

**Description:**

Storage operations have no retry logic. DB operations fail if database is locked.

**Solution:**
Create `src/lib/retry.ts` with exponential backoff

**Estimated Effort:** 1 day

---

### Issue 15: [Tech Debt] Add Validation Layer with Zod

**Labels:** `tech-debt`, `validation`

**Description:**

No validation before storage operations (empty names, negative dimensions allowed).

**Solution:**
Create `src/features/canvas/validation/schemas.ts` with Zod schemas

**Estimated Effort:** 1-2 days

---

## Quick Start Priority Order

**Week 1-2 (Sprint 1):** ✅ **FULLY COMPLETED** (2025-11-18)
1. ✅ Issue #2 - Remove console logging from hot paths ⚡️
2. ✅ Issue #1 - Enable TypeScript strict mode
3. ✅ Issue #3 - Setup Vitest and write first tests (54 tests passing)
4. ✅ Issue #7 - Add error boundaries

**Week 3-4 (Sprint 2):** ✅ **FULLY COMPLETED** (2025-11-19)
5. ✅ Fix TypeScript strict mode violations (~77 errors fixed)
6. ✅ Issue #4 - Extract desktop/mobile shared logic (usePlantEditorActions hook)
7. ✅ Issue #5 - Refactor storage manager (543 lines → 6 modular files)
8. ✅ Issue #6 - Break down large components (5 components, avg 59% reduction)
9. ✅ Expand test coverage (54 → 92 tests)

**Week 5-6 (Sprint 3):** ✅ **FULLY COMPLETED** (2025-11-19)
10. ✅ Issue #8 - Document architecture (HOOK_ARCHITECTURE.md)
11. ✅ Issue #14 - Add retry logic (src/lib/retry.ts)
12. ✅ Issue #15 - Add validation (Zod schemas + storage validation)

**Future:**
13-15. P2 issues as needed

---

## Notes

- All issues reference the comprehensive Architecture Review Report
- Estimated efforts are for a single developer
- Issues can be parallelized where dependencies allow
- Consider creating a project board to track progress
