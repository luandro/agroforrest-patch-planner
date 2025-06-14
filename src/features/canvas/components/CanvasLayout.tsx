
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedMiniMap } from './EnhancedMiniMap';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { ViewControls } from './ViewControls';
import { CanvasContainer } from './CanvasContainer';
import { CanvasKeyboardHandler } from './CanvasKeyboardHandler';
import { DevelopmentInfo } from './DevelopmentInfo';
import { CanvasTool } from '../types/bed.types';

interface CanvasLayoutProps {
  viewport: any;
  updateViewport: any;
  beds: any[];
  selectedBedIds: string[];
  tool: string;
  setTool: any;
  bedConfig: any;
  updateBedConfig: any;
  isCreating: boolean;
  previewBed: any;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
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
  setIsCreatingBed: (creating: boolean) => void;
  gridSize?: number;
}

export const CanvasLayout: React.FC<CanvasLayoutProps> = ({
  viewport,
  updateViewport,
  beds,
  selectedBedIds,
  tool,
  setTool,
  bedConfig,
  updateBedConfig,
  isCreating,
  previewBed,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleDoubleClick,
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
  setIsCreatingBed,
  gridSize = 1
}) => {
  const isMobile = useIsMobile();
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  // Calculate canvas dimensions based on sidebar state
  const canvasStyle = {
    width: isMobile ? '100vw' : showDesktopSidebar ? 'calc(100vw - 300px)' : '100vw',
    height: 'calc(100vh - 4rem)', // Subtract header height
    position: 'fixed' as const,
    top: '4rem', // Header height
    left: 0,
    zIndex: 10
  };

  return (
    <>
      {/* Full-screen canvas container */}
      <div style={canvasStyle}>
        <CanvasContainer
          viewport={viewport}
          tool={tool}
          isCreating={isCreating}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          handlePointerUp={handlePointerUp}
          handleDoubleClick={handleDoubleClick}
          pan={pan}
          zoomTo={zoomTo}
          beds={beds}
          selectedBedIds={selectedBedIds}
          previewBed={previewBed}
          gridSize={gridSize}
        />
      </div>

      {/* Keyboard Handler */}
      <CanvasKeyboardHandler
        pan={pan}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleFitAll={handleFitAll}
        isCreating={isCreating}
        cancelCreation={cancelCreation}
        setIsCreatingBed={setIsCreatingBed}
        setTool={(tool: CanvasTool) => setTool(tool)}
        selectedBedIds={selectedBedIds}
        deleteSelected={deleteSelected}
      />

      {/* Enhanced MiniMap - always visible */}
      <EnhancedMiniMap 
        viewport={viewport} 
        beds={beds}
        onNavigate={(x, y) => updateViewport({ centerX: x, centerY: y })}
        className="fixed top-20 left-4 z-50"
      />

      {/* View Controls - always visible in top-right */}
      <ViewControls
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitAll={handleFitAll}
        bedsCount={beds.length}
        className="fixed top-20 right-4 z-50"
      />

      {/* Mobile Controls */}
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
