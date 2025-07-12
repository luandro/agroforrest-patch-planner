
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';
import { OverlayContainer } from './overlays/OverlayContainer';

interface CanvasOverlaysProps {
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
  placementBed: any;
  showConfirmation: boolean;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  hasCollision?: boolean;
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
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onOpenPlantSelection?: () => void;
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  onExitFocus?: () => void;
  onSelectPlantSpecies?: (species: any) => void;
  onCancelPlantPlacement?: () => void;
  isMobile?: boolean;
  isEditingDimensions?: boolean;
  setIsEditingDimensions?: (isEditing: boolean) => void;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = (props) => {
  const isMobile = useIsMobile();

  return (
    <OverlayContainer
      {...props}
      isMobile={isMobile}
    />
  );
};
