
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
  previewBed?: any;
  previewBeds?: any[];
  placementBed?: any;
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
  // Create safe props for CanvasOverlays with required placementBed
  const overlayProps = {
    tool: props.tool,
    isCreating: props.isCreating,
    showConfirmation: props.showConfirmation,
    placementBed: props.placementBed || null, // Ensure it's never undefined
    placementBeds: props.placementBeds,
    bedConfig: props.bedConfig,
    multiCreationMode: props.multiCreationMode,
    setMultiCreationMode: props.setMultiCreationMode,
    handleConfirmPlacement: props.handleConfirmPlacement,
    handleCancelPlacement: props.handleCancelPlacement,
    hasCollision: props.hasCollision,
    isMobile: false // Will be enhanced by provider
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      <CanvasLayoutProvider {...props}>
        <CanvasViewport {...props} />
        <CanvasOverlays {...overlayProps} />
        <CanvasControls {...props} />
      </CanvasLayoutProvider>
    </div>
  );
};
