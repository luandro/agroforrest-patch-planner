
import { useCanvasEventOrchestrator } from './useCanvasEventOrchestrator';
import { useCanvasToolOrchestrator } from './useCanvasToolOrchestrator';
import { useBedSelectionFlow } from './useBedSelectionFlow';
import { useCanvasLayoutBuilder } from './useCanvasLayoutBuilder';

interface UseCanvasLayoutOrchestratorProps {
  // State manager outputs
  viewport: any;
  updateViewport: any;
  beds: any[];
  selectedBedIds: string[];
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  fitAllBeds: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  isSaving: boolean;
  bedStore: any;

  // Focus mode
  isInFocusMode: boolean;
  focusedBedId?: string | null;
  focusedBed?: any;
  handleEnterFocus: (bedId: string) => void;
  handleExitFocus: () => void;
  handlePlantSelectionOpen?: () => void;
  handlePlantSpeciesSelect?: (species: any) => void;

  // Bed creation
  bedConfig: any;
  updateBedConfig: any;
  isCreating: boolean;
  previewBed: any;
  previewBeds?: any[];
  placementBed: any;
  placementBeds?: any[];
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
  handleToolChange: (tool: any) => void;

  // Canvas props
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
