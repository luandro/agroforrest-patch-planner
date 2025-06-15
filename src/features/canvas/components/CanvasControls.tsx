
import React, { useState } from 'react';
import { EnhancedMiniMap } from './EnhancedMiniMap';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { ViewControls } from './ViewControls';
import { DevelopmentInfo } from './DevelopmentInfo';
import { CanvasTool } from '../types/bed.types';

interface CanvasControlsProps {
  viewport: any;
  updateViewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: CanvasTool;
  setTool: (tool: CanvasTool) => void;
  bedConfig: any;
  updateBedConfig: any;
  isCreating: boolean;
  showConfirmation: boolean;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  deleteSelected: () => void;
  isSaving: boolean;
  isMobile?: boolean;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  viewport,
  updateViewport,
  beds,
  selectedBedIds,
  tool,
  setTool,
  bedConfig,
  updateBedConfig,
  isCreating,
  showConfirmation,
  handleZoomIn,
  handleZoomOut,
  handleFitAll,
  undo,
  redo,
  canUndo,
  canRedo,
  deleteSelected,
  isSaving,
  isMobile = false
}) => {
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  // Hide minimap when in creation mode or showing controls
  const shouldHideMiniMap = isCreating || showMobileControls || showConfirmation;

  return (
    <>
      {/* Enhanced MiniMap - hide during creation */}
      {!shouldHideMiniMap && (
        <EnhancedMiniMap 
          viewport={viewport} 
          beds={beds}
          onNavigate={(x, y) => updateViewport({ centerX: x, centerY: y })}
          className="fixed top-20 left-4 z-50 transition-opacity duration-200"
        />
      )}

      {/* View Controls with Tool Selection - always visible in top-right */}
      <ViewControls
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitAll={handleFitAll}
        bedsCount={beds.length}
        activeTool={tool}
        onToolChange={setTool}
        className="fixed top-20 right-4 z-50"
      />

      {/* Mobile Controls - Updated for context-sensitive FAB */}
      {isMobile && (
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
          isVisible={showMobileControls}
          onToggle={setShowMobileControls}
          isSaving={isSaving}
          showConfirmation={showConfirmation}
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
          isCollapsed={!showDesktopSidebar}
          onToggleCollapse={setShowDesktopSidebar}
          isSaving={isSaving}
          beds={beds}
          viewport={viewport}
        />
      )}

      {/* Development Info */}
      <DevelopmentInfo
        viewport={viewport}
        tool={tool}
        beds={beds}
        selectedBedIds={selectedBedIds}
        isMobile={isMobile}
      />
    </>
  );
};
