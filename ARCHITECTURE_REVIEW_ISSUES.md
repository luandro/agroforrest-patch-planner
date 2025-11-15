# Architecture Review - GitHub Issues to Create

Created from comprehensive architecture review on 2025-11-14

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

**Week 1-2 (Sprint 1):**
1. Issue #2 - Remove console logging from hot paths ⚡️
2. Issue #1 - Enable TypeScript strict mode
3. Issue #3 - Setup Vitest and write first tests
4. Issue #7 - Add error boundaries

**Week 3-4 (Sprint 2):**
5. Issue #4 - Extract desktop/mobile shared logic
6. Issue #5 - Refactor storage manager
7. Issue #6 - Break down large components

**Week 5-6 (Sprint 3):**
8. Issue #8 - Document architecture
9. Issue #14 - Add retry logic
10. Issue #15 - Add validation

**Future:**
11-13. P2 issues as needed

---

## Notes

- All issues reference the comprehensive Architecture Review Report
- Estimated efforts are for a single developer
- Issues can be parallelized where dependencies allow
- Consider creating a project board to track progress
