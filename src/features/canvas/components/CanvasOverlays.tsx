
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';
import { BedConfigPanel } from './BedConfigPanel';
import { BedConfirmationPanel } from './BedConfirmationPanel';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { ViewControls } from './ViewControls';
import { FocusModeControls } from './FocusModeControls';
import { EnhancedMiniMap } from './EnhancedMiniMap';

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
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  viewport,
  beds,
  selectedBedIds,
  tool,
  setTool,
  bedConfig,
  updateBedConfig,
  isCreating,
  showConfirmation,
  multiCreationMode,
  setMultiCreationMode,
  hasCollision,
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
  isCollapsed = false,
  onToggleCollapse,
  onOpenPlantSelection,
  isInFocusMode = false,
  focusedBedId,
  onExitFocus,
  onSelectPlantSpecies,
  onCancelPlantPlacement,
  isMobile = false,
  placementBed
}) => {
  // Navigation handler for mini-map
  const handleMiniMapNavigate = (x: number, y: number) => {
    // Update viewport to center on clicked position
    const newViewport = {
      ...viewport,
      centerX: x,
      centerY: y
    };
    
    // Use the pan function to smoothly navigate
    const deltaX = x - viewport.centerX;
    const deltaY = y - viewport.centerY;
    pan(deltaX, deltaY);
  };

  return (
    <>
      {/* Enhanced Mini-Map - Always visible except in focus mode */}
      {!isInFocusMode && (
        <EnhancedMiniMap
          viewport={viewport}
          beds={beds}
          onNavigate={handleMiniMapNavigate}
          className="fixed bottom-4 left-4 z-30"
        />
      )}

      {/* Focus Mode Controls */}
      {isInFocusMode && focusedBedId && onExitFocus && onOpenPlantSelection && (
        <FocusModeControls
          focusedBedId={focusedBedId}
          onExitFocus={onExitFocus}
          onOpenPlantSelection={onOpenPlantSelection}
          onSelectSpecies={onSelectPlantSpecies}
          onCancelPlacement={onCancelPlantPlacement}
        />
      )}

      {/* Mobile Controls */}
      {isMobile && !isInFocusMode && (
        <MobileControls
          activeTool={tool}
          onToolChange={setTool}
          bedConfig={bedConfig}
          onBedConfigChange={updateBedConfig}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo()}
          canRedo={canRedo()}
          onDeleteSelected={deleteSelected}
          selectedCount={selectedBedIds.length}
          isVisible={true}
          onToggle={() => {}}
          isSaving={isSaving}
          showConfirmation={showConfirmation}
          isInFocusMode={isInFocusMode}
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && !isInFocusMode && (
        <DesktopSidebar
          activeTool={tool}
          onToolChange={setTool}
          bedConfig={bedConfig}
          onBedConfigChange={updateBedConfig}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo()}
          canRedo={canRedo()}
          onDeleteSelected={deleteSelected}
          selectedCount={selectedBedIds.length}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse || (() => {})}
          isSaving={isSaving}
          beds={beds}
          viewport={viewport}
          isInFocusMode={isInFocusMode}
        />
      )}

      {/* View Controls - Bottom Right */}
      {!isInFocusMode && (
        <ViewControls
          zoom={viewport.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitAll={handleFitAll}
          bedsCount={beds.length}
          activeTool={tool}
          onToolChange={setTool}
          onOpenPlantSelection={onOpenPlantSelection}
          className="fixed bottom-4 right-4 z-30"
        />
      )}

      {/* Bed Configuration Panel - Mobile Bottom Sheet / Desktop Modal */}
      {isCreating && tool === 'create-rectangle' && !showConfirmation && (
        <BedConfigPanel
          config={bedConfig}
          onConfigChange={updateBedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationModeChange={setMultiCreationMode}
          onCancel={cancelCreation}
          hasCollision={hasCollision}
        />
      )}

      {/* Bed Confirmation Panel */}
      {showConfirmation && placementBed && (
        <BedConfirmationPanel
          bed={placementBed}
          beds={beds}
          bedConfig={bedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationToggle={setMultiCreationMode}
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
          hasCollision={hasCollision}
        />
      )}
    </>
  );
};
