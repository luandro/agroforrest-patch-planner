
import React from 'react';
import { CanvasLayoutProvider } from './CanvasLayoutProvider';
import { CanvasViewport } from './CanvasViewport';
import { CanvasOverlays } from './CanvasOverlays';
import { CanvasControls } from './CanvasControls';
import { CanvasTool } from '../types/bed.types';

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
}

export const CanvasLayout: React.FC<CanvasLayoutProps> = (props) => {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ paddingTop: '4rem' }}>
      <CanvasLayoutProvider {...props}>
        <div className="relative w-full h-full">
          <CanvasViewport {...props} />
          <CanvasOverlays {...props} />
          <CanvasControls {...props} />
        </div>
      </CanvasLayoutProvider>
    </div>
  );
};
