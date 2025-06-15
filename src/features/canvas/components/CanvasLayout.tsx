
import React from 'react';
import { CanvasTool } from '../types/bed.types'; // <-- Import added!
import { CanvasLayoutProvider } from './CanvasLayoutProvider';
import { CanvasViewport } from './CanvasViewport';
import { CanvasOverlays } from './CanvasOverlays';

interface CanvasLayoutProps {
  viewport: any;
  updateViewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: CanvasTool;
  setTool: (tool: CanvasTool) => void;
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
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomTo: (zoom: number) => void;
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
  onOpenPlantSelection?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  // Focus mode props
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  focusedBed?: any;
  onEnterFocus?: (bedId: string) => void;
  onExitFocus?: () => void;
  onSelectPlantSpecies?: (species: any) => void;
  onCancelPlantPlacement?: () => void;
}

export const CanvasLayout: React.FC<CanvasLayoutProps> = (props) => {
  return (
    <CanvasLayoutProvider {...props}>
      <CanvasViewport {...props} />
      <CanvasOverlays {...props} />
    </CanvasLayoutProvider>
  );
};
