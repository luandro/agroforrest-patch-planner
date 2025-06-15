
import React from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { DesktopSidebar } from '../DesktopSidebar';
import { ViewControls } from '../ViewControls';
import { CanvasTool } from '../../types/bed.types';
import { cn } from '@/lib/utils';

interface ControlsOverlayProps {
  viewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: CanvasTool;
  setTool: (tool: CanvasTool) => void;
  bedConfig: any;
  updateBedConfig: any;
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
  focusedBedId
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
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
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
          focusedBedId={focusedBedId || undefined}
        />
      )}

      {/* Desktop View Controls - Only show when not in focus mode or when no plants are selected */}
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
          className={cn(
            "fixed bottom-4 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2",
            isCollapsed ? "md:right-20" : "md:right-[21rem]"
          )}
        />
      )}
    </>
  );
};
