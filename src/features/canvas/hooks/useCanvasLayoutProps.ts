
import { useCallback } from 'react';
import { CanvasViewport } from '../types/canvas.types';
import { CanvasTool } from '../types/bed.types';

interface UseCanvasLayoutPropsParams {
  viewport: CanvasViewport;
  updateViewport: (updates: Partial<CanvasViewport>) => void;
  beds: any[];
  selectedBedIds: string[];
  tool: CanvasTool;
  handleToolChange: (tool: CanvasTool) => void;
  bedConfig: any;
  updateBedConfig: any;
  isCreating: boolean;
  previewBed: any;
  previewBeds: any[];
  placementBed: any;
  placementBeds: any[];
  showConfirmation: boolean;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  hasCollision: boolean;
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
  fitAllBeds: (beds: any[]) => void;
  gridSize: number;
  minZoom: number;
  maxZoom: number;
  handlePlantSelectionOpen: () => void;
  handlePlantSpeciesSelect: (species: any) => void;
  isInFocusMode: boolean;
  focusedBedId: string | null;
  focusedBed: any;
  handleEnterFocus: (bedId: string) => void;
  handleExitFocus: () => void;
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

  const handleConfirmPlacement = useCallback(() => {
    confirmPlacement();
    if (!multiCreationMode) {
      handleToolChange('pan');
    }
  }, [confirmPlacement, multiCreationMode, handleToolChange]);

  const handleCancelPlacement = useCallback(() => {
    cancelPlacement();
  }, [cancelPlacement]);

  const handleZoomIn = useCallback(() => {
    zoomTo(Math.min(maxZoom, viewport.zoom * 1.2));
  }, [zoomTo, maxZoom, viewport.zoom]);

  const handleZoomOut = useCallback(() => {
    zoomTo(Math.max(minZoom, viewport.zoom / 1.2));
  }, [zoomTo, minZoom, viewport.zoom]);

  const handleFitAll = useCallback(() => {
    fitAllBeds(beds);
  }, [fitAllBeds, beds]);

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
    handleConfirmPlacement,
    handleCancelPlacement,
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
    gridSize: isInFocusMode ? 0.1 : gridSize,
    onOpenPlantSelection: handlePlantSelectionOpen,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus,
    onSelectPlantSpecies: handlePlantSpeciesSelect,
  };
};
