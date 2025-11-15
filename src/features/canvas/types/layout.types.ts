import type React from 'react';
import type { CanvasViewport } from './canvas.types';
import type { Bed, BedConfig, CanvasTool } from './bed.types';
import type { PlantSpecies } from './species.types';

export type ViewportUpdate = (updates: Partial<CanvasViewport>) => void;
export type BedConfigUpdate = (updates: Partial<BedConfig>) => void;
export type ZoomToFn = (zoom: number, centerX?: number, centerY?: number) => void;

export interface CanvasPointerHandlers {
  handlePointerDown: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export interface CanvasLayoutSharedProps extends CanvasPointerHandlers {
  viewport: CanvasViewport;
  updateViewport: ViewportUpdate;
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  setTool: (tool: CanvasTool) => void;
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
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: ZoomToFn;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  deleteSelected: () => void;
  isSaving: boolean;
  cancelCreation: () => void;
  gridSize?: number;
  minZoom?: number;
  maxZoom?: number;
  onOpenPlantSelection?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  focusedBed?: Bed | null;
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
  onSelectPlantSpecies?: (species: PlantSpecies) => void;
  onCancelPlantPlacement?: () => void;
}
