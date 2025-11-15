
import { useCallback } from 'react';
import type React from 'react';
import type { CanvasViewport } from '../types/canvas.types';
import type { Bed, BedConfig, CanvasTool } from '../types/bed.types';
import type { PlantSpecies } from '../types/species.types';
import type { CanvasLayoutSharedProps, ZoomToFn, ViewportUpdate, BedConfigUpdate } from '../types/layout.types';

export interface UseCanvasLayoutPropsParams {
  viewport: CanvasViewport;
  updateViewport: ViewportUpdate;
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  handleToolChange: (tool: CanvasTool) => void;
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
  handlePointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  confirmPlacement: () => void;
  cancelPlacement: () => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: ZoomToFn;
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
  handlePlantSpeciesSelect?: (species: PlantSpecies) => void;
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  focusedBed?: Bed | null;
  handleEnterFocus?: (bedId: string) => void;
  handleExitFocus?: () => void;
  onCancelPlantPlacement?: () => void;
}

export const useCanvasLayoutProps = (params: UseCanvasLayoutPropsParams): CanvasLayoutSharedProps => {
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
    handleExitFocus,
    onCancelPlantPlacement
  } = params;

  // Enhanced zoom handlers
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(maxZoom, viewport.zoom * 1.2);
    zoomTo(newZoom);
  }, [viewport.zoom, maxZoom, zoomTo]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(minZoom, viewport.zoom / 1.2);
    zoomTo(newZoom);
  }, [viewport.zoom, minZoom, zoomTo]);

  const handleFitAll = useCallback(() => {
    fitAllBeds();
  }, [fitAllBeds]);

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
    handleConfirmPlacement: confirmPlacement, // Use the corrected handler
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
    onCancelPlantPlacement,
    isInFocusMode,
    focusedBedId,
    focusedBed,
    onEnterFocus: handleEnterFocus,
    onExitFocus: handleExitFocus
  };
};
