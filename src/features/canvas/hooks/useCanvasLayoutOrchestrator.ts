
import { useCanvasEventOrchestrator } from './useCanvasEventOrchestrator';
import { useCanvasToolOrchestrator } from './useCanvasToolOrchestrator';
import { useBedSelectionFlow } from './useBedSelectionFlow';
import { useCanvasLayoutBuilder } from './useCanvasLayoutBuilder';
import type { CanvasViewport } from '../types/canvas.types';
import type { Bed, BedConfig, CanvasTool } from '../types/bed.types';
import type { PlantSpecies } from '../types/species.types';
import type { ZoomToFn, ViewportUpdate, BedConfigUpdate } from '../types/layout.types';

interface UseCanvasLayoutOrchestratorProps {
  viewport: CanvasViewport;
  updateViewport: ViewportUpdate;
  beds: Bed[];
  selectedBedIds: string[];
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: ZoomToFn;
  fitAllBeds: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  isSaving: boolean;
  bedStore: {
    setTool: (tool: CanvasTool) => void;
  };

  isInFocusMode: boolean;
  focusedBedId?: string | null;
  focusedBed?: Bed | null;
  handleEnterFocus: (bedId: string) => void;
  handleExitFocus: () => void;
  handlePlantSelectionOpen?: () => void;
  handlePlantSpeciesSelect?: (species: PlantSpecies) => void;

  bedConfig: BedConfig;
  updateBedConfig: BedConfigUpdate;
  isCreating: boolean;
  previewBed: Bed | null;
  previewBeds?: Bed[];
  placementBed: Bed | null;
  placementBeds?: Bed[];
  showConfirmation: boolean;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  hasCollision?: boolean;
  startPreview: (x: number, y: number) => void;
  updatePreview: (x: number, y: number) => void;
  placeBed: () => void;
  confirmPlacement: () => void;
  cancelPlacement: () => void;
  cancelCreation: () => void;
  clearPreview: () => void;
  clearPlacement: () => void;
  handleToolChange: (tool: CanvasTool) => void;

  gridSize: number;
  minZoom: number;
  maxZoom: number;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const useCanvasLayoutOrchestrator = (props: UseCanvasLayoutOrchestratorProps) => {
  const {
    viewport,
    beds,
    selectedBedIds,
    isInFocusMode,
    focusedBed,
    handleEnterFocus,
    handleExitFocus,
    isCreating,
    multiCreationMode,
    startPreview,
    updatePreview,
    placeBed,
    clearPreview,
    clearPlacement,
    handleToolChange,
    canvasRef
  } = props;

  // Tool orchestration
  const { tool } = useCanvasToolOrchestrator({
    isInFocusMode,
    handleExitFocus,
    clearPreview,
    clearPlacement,
    setTool: props.bedStore.setTool
  });

  // Bed selection management
  const { startSelection, updateSelection, finishSelection, deleteSelected } = useBedSelectionFlow({ 
    viewport, 
    canvasRef,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus
  });

  // Event orchestration
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick
  } = useCanvasEventOrchestrator({
    tool,
    isCreating,
    multiCreationMode,
    startPreview,
    updatePreview,
    placeBed,
    startSelection,
    updateSelection,
    finishSelection,
    handleToolChange,
    viewport,
    focusedBed,
    canvasRef
  });

  // Layout props building
  const layoutProps = useCanvasLayoutBuilder({
    ...props,
    tool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    deleteSelected
  });

  return {
    tool,
    layoutProps
  };
};
