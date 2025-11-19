# Hook Orchestration Architecture

This document describes the 3-level hook orchestration pattern used in the canvas feature. Understanding this architecture is essential for maintaining and extending the codebase.

## Overview

The canvas feature uses a layered hook architecture that promotes:
- **Single Responsibility**: Each hook does one thing well
- **Composability**: Hooks can be combined to build complex behavior
- **Testability**: Atomic hooks are easy to test in isolation
- **Reusability**: Lower-level hooks can be shared across features

## The Three Levels

```
┌─────────────────────────────────────────┐
│  Level 3: Page Orchestrators            │
│  (usePatchCanvasOrchestrator)           │
├─────────────────────────────────────────┤
│  Level 2: Composite Orchestrators       │
│  (useCanvasStateManager,                │
│   useBedCreationOrchestrator)           │
├─────────────────────────────────────────┤
│  Level 1: Atomic Hooks                  │
│  (useBedHitTesting, useCoordinateTransforms, │
│   useBedConfiguration, useBedPreview)   │
└─────────────────────────────────────────┘
```

---

## Level 1: Atomic Hooks

**Purpose**: Single-responsibility hooks that handle one specific concern.

**Characteristics**:
- Focus on a single domain concept
- Minimal dependencies (usually just stores or React primitives)
- Return simple, focused APIs
- Highly reusable and testable

### Examples

#### `useBedHitTesting.ts`
Handles geometric hit testing for beds.

```typescript
export const useBedHitTesting = () => {
  const { beds } = useBedStore();

  const isPointInBed = useCallback((x: number, y: number, bed: Bed): boolean => {
    // Geometric calculation for point-in-shape
  }, []);

  const getBedAtWorldPoint = useCallback((worldX: number, worldY: number): Bed | null => {
    // Find bed at coordinates
  }, [beds, isPointInBed]);

  return {
    getBedAtWorldPoint,
    getBedsInArea
  };
};
```

#### `useCoordinateTransforms.ts`
Converts between canvas and world coordinate systems.

```typescript
export const useCoordinateTransforms = ({ viewport, canvasRef }) => {
  const canvasToWorld = useCallback((canvasX: number, canvasY: number) => {
    // Transform canvas coordinates to world space
  }, [viewport, canvasRef]);

  return { canvasToWorld };
};
```

#### Other Atomic Hooks
- `useBedConfiguration` - Manages bed shape/size configuration
- `useBedPreview` - Handles bed preview state during creation
- `useBedPlacement` - Manages bed placement confirmation
- `useCanvasState` - Basic canvas ref and collapse state
- `useCanvasViewport` - Viewport pan/zoom state
- `useSelectionState` - Selection rectangle state
- `usePlantHitTesting` - Plant geometric hit testing

---

## Level 2: Composite Orchestrators

**Purpose**: Combine multiple atomic hooks to create cohesive features.

**Characteristics**:
- Import and orchestrate multiple atomic hooks
- Add coordination logic between hooks
- May add local state for feature-specific needs
- Named with `*Orchestrator` or `*Manager` suffix

### Examples

#### `useBedCreationOrchestrator.ts`
Orchestrates the complete bed creation workflow.

```typescript
export const useBedCreationOrchestrator = ({ viewport, gridSize, onBedCreated }) => {
  const { tool, setTool } = useBedStore();

  // Compose atomic hooks
  const { bedConfig, updateBedConfig } = useBedConfiguration();
  const { isCreating, previewBed, startPreview, updatePreview } = useBedPreview({
    viewport, bedConfig, gridSize
  });
  const { placeBed, confirmPlacement, cancelPlacement } = useBedPlacement({
    bedConfig, onBedCreated
  });

  // Coordination logic
  const handleToolChange = useCallback((newTool: CanvasTool) => {
    if (newTool !== tool) {
      clearPreview();
      clearPlacement();
    }
    setTool(newTool);
  }, [tool, clearPreview, clearPlacement, setTool]);

  return {
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    startPreview,
    updatePreview,
    placeBed,
    handleToolChange,
    // ... more composed functionality
  };
};
```

#### `useCanvasStateManager.ts`
Central state manager combining multiple concerns.

```typescript
export const useCanvasStateManager = (props) => {
  // Compose orchestrators and atomic hooks
  const stateOrchestrator = useCanvasStateOrchestrator(props);
  const focusMode = useFocusModeIntegration({ ... });
  const bedCreation = useBedCreationOrchestrator({ ... });

  // Local state for this manager
  const [isPlantSpeciesPanelOpen, setIsPlantSpeciesPanelOpen] = useState(false);

  // Enhanced handlers with cross-cutting logic
  const cancelCreation = useCallback(() => {
    bedCreation.cancelCreation();
    bedCreation.handleToolChange('pan');
  }, [bedCreation]);

  return {
    ...stateOrchestrator,
    ...focusMode,
    ...bedCreation,
    cancelCreation,
    isPlantSpeciesPanelOpen,
    // ... combined API
  };
};
```

#### Other Composite Orchestrators
- `useCanvasEventOrchestrator` - Coordinates all canvas pointer events
- `useCanvasLayoutOrchestrator` - Manages layout props for canvas components
- `useCanvasStateOrchestrator` - Combines viewport, selection, and tools
- `useFocusModeIntegration` - Coordinates focus mode with viewport
- `useAutoSaveOrchestrator` - Coordinates auto-save for patches, beds, plants

---

## Level 3: Page Orchestrators

**Purpose**: Top-level hooks used directly by page components.

**Characteristics**:
- Single entry point for component
- Compose Level 2 orchestrators
- Return the complete API needed by the component
- Handle page-specific concerns (routing params, page state)

### Example

#### `usePatchCanvasOrchestrator.ts`
Main orchestrator for the PatchCanvas component.

```typescript
export const usePatchCanvasOrchestrator = ({
  initialViewport,
  onViewportChange,
  onOpenPlantSelection,
  gridSize,
  minZoom,
  maxZoom,
}: PatchCanvasProps) => {
  // Basic canvas state
  const { canvasRef, isCollapsed, onToggleCollapse } = useCanvasState();

  // Unified state management (Level 2)
  const stateManager = useCanvasStateManager({
    initialViewport,
    onViewportChange,
    onOpenPlantSelection,
    gridSize,
    minZoom,
    maxZoom,
    canvasRef
  });

  // Layout orchestration (Level 2)
  const { layoutProps } = useCanvasLayoutOrchestrator({
    ...stateManager,
    gridSize,
    minZoom,
    maxZoom,
    canvasRef
  });

  return {
    canvasRef,
    isCollapsed,
    onToggleCollapse,
    layoutProps,
  };
};
```

---

## Naming Conventions

### Hook Names

| Level | Pattern | Examples |
|-------|---------|----------|
| Atomic | `use{Domain}{Action}` | `useBedHitTesting`, `useCoordinateTransforms` |
| Composite | `use{Feature}Orchestrator` or `use{Feature}Manager` | `useBedCreationOrchestrator`, `useCanvasStateManager` |
| Page | `use{Component}Orchestrator` | `usePatchCanvasOrchestrator` |

### File Organization

```
src/features/canvas/hooks/
├── # Atomic Hooks
├── useBedHitTesting.ts
├── useBedConfiguration.ts
├── useBedPreview.ts
├── useBedPlacement.ts
├── useCoordinateTransforms.ts
├── useSelectionState.ts
├── usePlantHitTesting.ts
│
├── # Composite Orchestrators
├── useBedCreationOrchestrator.ts
├── useCanvasEventOrchestrator.ts
├── useCanvasStateManager.ts
├── useCanvasStateOrchestrator.ts
├── useCanvasLayoutOrchestrator.ts
├── useFocusModeIntegration.ts
├── useAutoSaveOrchestrator.ts
│
├── # Page Orchestrators
├── usePatchCanvasOrchestrator.ts
│
├── # Tests
├── *.test.ts
```

---

## Anti-Patterns to Avoid

### 1. Skipping Levels

**Bad**: Page component directly uses atomic hooks
```typescript
// Don't do this in a page component
const { getBedAtWorldPoint } = useBedHitTesting();
const { canvasToWorld } = useCoordinateTransforms({ viewport, canvasRef });
// ... lots of coordination logic in component
```

**Good**: Use appropriate orchestrator
```typescript
const { layoutProps } = usePatchCanvasOrchestrator(props);
```

### 2. Circular Dependencies

**Bad**: Atomic hook imports from orchestrator
```typescript
// In useBedHitTesting.ts - DON'T DO THIS
import { useBedCreationOrchestrator } from './useBedCreationOrchestrator';
```

**Good**: Higher levels import from lower levels only
```typescript
// In useBedCreationOrchestrator.ts - CORRECT
import { useBedHitTesting } from './useBedHitTesting';
```

### 3. God Orchestrators

**Bad**: Single orchestrator doing everything
```typescript
// 500+ line orchestrator with 30 responsibilities
export const useEverythingOrchestrator = () => {
  // ... too much
};
```

**Good**: Split into focused orchestrators
```typescript
const stateManager = useCanvasStateManager(props);
const layoutProps = useCanvasLayoutOrchestrator(props);
```

### 4. Prop Drilling Through Hooks

**Bad**: Passing many props down through multiple levels
```typescript
const orchestrator = useSomeOrchestrator({
  prop1, prop2, prop3, prop4, prop5, prop6, prop7, // Too many!
});
```

**Good**: Use stores for shared state, props for configuration
```typescript
// Shared state in stores
const { beds, selectedBedIds } = useBedStore();

// Only configuration as props
const orchestrator = useSomeOrchestrator({
  gridSize,
  onBedCreated,
});
```

### 5. Business Logic in Components

**Bad**: Complex logic in React components
```typescript
const MyComponent = () => {
  const { beds } = useBedStore();

  // Don't do complex logic here
  const filteredBeds = beds.filter(b => {
    // complex filtering logic
  }).map(b => {
    // complex transformation
  });
};
```

**Good**: Move logic to hooks
```typescript
// In useFilteredBeds.ts
export const useFilteredBeds = (criteria) => {
  const { beds } = useBedStore();
  return useMemo(() => {
    // Complex logic lives here
  }, [beds, criteria]);
};

// In component - clean and simple
const MyComponent = () => {
  const filteredBeds = useFilteredBeds(criteria);
};
```

---

## Adding New Features

### Step 1: Identify the Level

Ask yourself:
- Is this a single concern? → **Atomic Hook**
- Does this combine multiple concerns? → **Composite Orchestrator**
- Is this the main hook for a component? → **Page Orchestrator**

### Step 2: Follow the Pattern

1. Create the hook file with appropriate naming
2. Import dependencies (only from same or lower levels)
3. Return a focused API
4. Export from appropriate index file

### Step 3: Write Tests

- Atomic hooks: Test in isolation with mocked stores
- Orchestrators: Test integration of combined behaviors

### Example: Adding Plant Drag Feature

```typescript
// Level 1: Atomic hook for drag state
// usePlantDragState.ts
export const usePlantDragState = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  return { isDragging, dragOffset, setIsDragging, setDragOffset };
};

// Level 2: Orchestrator combining drag with other concerns
// usePlantDragOrchestrator.ts
export const usePlantDragOrchestrator = ({ viewport }) => {
  const dragState = usePlantDragState();
  const { canvasToWorld } = useCoordinateTransforms({ viewport });
  const { updatePlacement } = usePlacementStore();

  const handleDragMove = useCallback((e) => {
    const worldPos = canvasToWorld(e.clientX, e.clientY);
    // Coordination logic here
  }, [canvasToWorld, dragState]);

  return {
    ...dragState,
    handleDragMove,
  };
};
```

---

## Benefits of This Architecture

1. **Testability**: Atomic hooks can be tested in isolation
2. **Reusability**: Lower-level hooks shared across features
3. **Maintainability**: Clear boundaries between concerns
4. **Onboarding**: New developers understand the layering
5. **Refactoring**: Easy to modify one level without affecting others
6. **Performance**: Memoization boundaries are clear

---

## Related Documentation

- `context/03-canvas-engine.md` - Canvas components and rendering
- `context/05-state-and-storage.md` - Zustand stores and persistence
- `ARCHITECTURE_REVIEW_ISSUES.md` - Overall architecture decisions
