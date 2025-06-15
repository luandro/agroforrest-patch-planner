
import React from 'react';
import { MobileControls } from '../MobileControls';
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
  showConfirmation
}) => {
  return (
    <>
      {/* Mobile Controls - Properly positioned to avoid header overlap */}
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

      {/* View Controls - Fixed mobile positioning */}
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
          className={cn(
            "fixed transition-all duration-300 ease-in-out",
            // Mobile: Position away from FAB and header
            isMobile 
              ? "top-20 left-4 z-20" // Top-left on mobile, below header
              : "bottom-4 right-4 z-30", // Bottom-right on desktop
            // Desktop adjustments for sidebar
            !isMobile && (isCollapsed ? "md:right-20" : "md:right-[21rem]")
          )}
        />
      )}
    </>
  );
};
