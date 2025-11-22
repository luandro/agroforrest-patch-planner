
import React from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { DesktopSidebar } from '../DesktopSidebar';
import { ViewControls } from '../ViewControls';
import { Bed, BedConfig, CanvasTool } from '../../types/bed.types';
import { CanvasViewport } from '../../types/canvas.types';
import { BedConfigUpdate } from '../../types/layout.types';
import { cn } from '@/lib/utils';

interface ControlsOverlayProps {
  viewport: CanvasViewport;
  beds: Bed[];
  selectedBedIds: string[];
  tool: CanvasTool;
  setTool: (tool: CanvasTool) => void;
  bedConfig: BedConfig;
  updateBedConfig: BedConfigUpdate;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  deleteSelected: () => void;
  isSaving: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onOpenPlantSelection?: () => void;
  isMobile: boolean;
  isInFocusMode: boolean;
  showConfirmation: boolean;
  focusedBedId?: string | null;
  isCreating: boolean;
  cancelCreation: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  viewport,
  beds,
  selectedBedIds,
  tool,
  setTool,
  bedConfig,
  updateBedConfig,
  handleZoomIn,
  handleZoomOut,
  handleFitAll,
  undo,
  redo,
  canUndo,
  canRedo,
  deleteSelected,
  isSaving,
  isCollapsed = false,
  onToggleCollapse,
  onOpenPlantSelection,
  isMobile,
  isInFocusMode,
  showConfirmation,
  focusedBedId,
  isCreating,
  cancelCreation
}) => {
  return (
    <>
      {/* Mobile Layout */}
      {isMobile && (
        <MobileLayout
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
          isSaving={isSaving}
          showConfirmation={showConfirmation}
          isInFocusMode={isInFocusMode}
          viewport={viewport}
          beds={beds}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitAll={handleFitAll}
          onOpenPlantSelection={onOpenPlantSelection}
          focusedBedId={focusedBedId || undefined}
          isCreating={isCreating}
          cancelCreation={cancelCreation}
        />
      )}

      {/* Desktop: Plant Editor when plants are selected in focus mode */}
      {!isMobile && isInFocusMode && focusedBedId && (
        <DesktopPlantEditor
          selectedPlacementIds={selectedBedIds}
          onClose={() => {}}
          focusedBedId={focusedBedId}
        />
      )}

      {/* Desktop View Controls - Simplified positioning without right sidebar */}
      {!isMobile && (!isInFocusMode || !focusedBedId) && (
        <ViewControls
          zoom={viewport.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitAll={handleFitAll}
          bedsCount={beds.length}
          activeTool={tool}
          onToolChange={setTool}
          onOpenPlantSelection={onOpenPlantSelection}
          className="fixed bottom-4 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2"
        />
      )}
    </>
  );
};
