
import { useCallback, useRef } from 'react';

interface UseCanvasLayoutPropsParams {
  viewport: any;
  updateViewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: any;
  handleToolChange: any;
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
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  confirmPlacement: () => void;
  cancelPlacement: () => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  deleteSelected: () => void;
  isSaving: boolean;
  cancelCreation: () => void;
  fitAllBeds: () => void;
  gridSize: number;
  minZoom: number;
  maxZoom: number;
  handlePlantSelectionOpen?: () => void;
  handlePlantSpeciesSelect?: (species: any) => void;
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  focusedBed?: any;
  handleEnterFocus?: (bedId: string) => void;
  handleExitFocus?: () => void;
}

export const useCanvasLayoutProps = (params: UseCanvasLayoutPropsParams) => {
  const {
    viewport,
    updateViewport,
    beds,
    selectedBedIds,
    tool,
    handleToolChange,
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    previewBeds,
    placementBed,
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    hasCollision,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    confirmPlacement,
    cancelPlacement,
    pan,
    zoomTo,
    undo,
    redo,
    canUndo,
    canRedo,
    deleteSelected,
    isSaving,
    cancelCreation,
    fitAllBeds,
    gridSize,
    minZoom,
    maxZoom,
    handlePlantSelectionOpen,
    handlePlantSpeciesSelect,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    handleEnterFocus,
    handleExitFocus
  } = params;

  // Use refs to maintain stable references to functions
  const zoomToRef = useRef(zoomTo);
  const fitAllBedsRef = useRef(fitAllBeds);
  const viewportRef = useRef(viewport);
  
  // Update refs on each render
  zoomToRef.current = zoomTo;
  fitAllBedsRef.current = fitAllBeds;
  viewportRef.current = viewport;

  // Stable zoom handlers that don't depend on changing values
  const handleZoomIn = useCallback(() => {
    const currentZoom = viewportRef.current.zoom;
    const newZoom = Math.min(maxZoom, currentZoom * 1.2);
    zoomToRef.current(newZoom);
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    const currentZoom = viewportRef.current.zoom;
    const newZoom = Math.max(minZoom, currentZoom / 1.2);
    zoomToRef.current(newZoom);
  }, [minZoom]);

  // Stable fit all handler
  const handleFitAll = useCallback(() => {
    fitAllBedsRef.current();
  }, []);

  return {
    viewport,
    updateViewport,
    beds,
    selectedBedIds,
    tool,
    setTool: handleToolChange,
    bedConfig,
    updateBedConfig,
    isCreating,
    previewBed,
    previewBeds,
    placementBed,
    placementBeds,
    showConfirmation,
    multiCreationMode,
    setMultiCreationMode,
    hasCollision,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleConfirmPlacement: confirmPlacement,
    handleCancelPlacement: cancelPlacement,
    pan,
    zoomTo,
    handleZoomIn,
    handleZoomOut,
    handleFitAll,
    undo,
    redo,
    canUndo,
    canRedo,
    deleteSelected,
    isSaving,
    cancelCreation,
    gridSize,
    minZoom,
    maxZoom,
    onOpenPlantSelection: handlePlantSelectionOpen,
    onSelectPlantSpecies: handlePlantSpeciesSelect,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus
  };
};
