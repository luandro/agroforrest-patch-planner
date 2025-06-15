
import React from 'react';
import { MiniMapOverlay } from './MiniMapOverlay';
import { FocusModeOverlay } from './FocusModeOverlay';
import { ControlsOverlay } from './ControlsOverlay';
import { ConfigurationOverlay } from './ConfigurationOverlay';
import { CanvasTool } from '../../types/bed.types';

interface OverlayContainerProps {
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
}

export const OverlayContainer: React.FC<OverlayContainerProps> = (props) => {
  const {
    viewport,
    beds,
    pan,
    isInFocusMode,
    focusedBedId,
    onExitFocus,
    onOpenPlantSelection,
    onSelectPlantSpecies,
    onCancelPlantPlacement,
    isMobile = false
  } = props;

  // Navigation handler for mini-map
  const handleMiniMapNavigate = (x: number, y: number) => {
    const deltaX = x - viewport.centerX;
    const deltaY = y - viewport.centerY;
    pan(deltaX, deltaY);
  };

  return (
    <>
      {/* Mini-Map Overlay */}
      <MiniMapOverlay
        viewport={viewport}
        beds={beds}
        onNavigate={handleMiniMapNavigate}
        isVisible={!isInFocusMode}
      />

      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        isVisible={isInFocusMode}
        focusedBedId={focusedBedId}
        onExitFocus={onExitFocus}
        onOpenPlantSelection={onOpenPlantSelection}
        onSelectSpecies={onSelectPlantSpecies}
        onCancelPlacement={onCancelPlantPlacement}
      />

      {/* Controls Overlay */}
      <ControlsOverlay
        {...props}
        isMobile={isMobile}
        isInFocusMode={isInFocusMode}
      />

      {/* Configuration Overlay */}
      <ConfigurationOverlay
        {...props}
        isInFocusMode={isInFocusMode}
      />
    </>
  );
};
