
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedMiniMap } from './EnhancedMiniMap';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { ViewControls } from './ViewControls';
import { CanvasContainer } from './CanvasContainer';
import { CanvasKeyboardHandler } from './CanvasKeyboardHandler';
import { DevelopmentInfo } from './DevelopmentInfo';
import { BedConfirmationPanel } from './BedConfirmationPanel';
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
  placementBed: any;
  showConfirmation: boolean;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
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
  placementBed,
  showConfirmation,
  multiCreationMode,
  setMultiCreationMode,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleDoubleClick,
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
  gridSize = 1
}) => {
  const isMobile = useIsMobile();
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  // Hide minimap when in creation mode or showing controls
  const shouldHideMiniMap = isCreating || showMobileControls || showConfirmation;

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
          placementBed={placementBed}
          gridSize={gridSize}
        />

        {/* Creation Mode Indicator */}
        {(isCreating || tool === 'create-rectangle' || tool === 'create-circle') && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
              Modo Criação • {tool === 'create-rectangle' ? 'Retângulo' : 'Círculo'}
            </div>
          </div>
        )}
      </div>

      {/* Bed Confirmation Panel */}
      {showConfirmation && placementBed && (
        <BedConfirmationPanel
          bed={placementBed}
          bedConfig={bedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationToggle={setMultiCreationMode}
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
          className={isMobile ? '' : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}
        />
      )}

      {/* Keyboard Handler */}
      <CanvasKeyboardHandler
        pan={pan}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleFitAll={handleFitAll}
        isCreating={isCreating}
        cancelCreation={cancelCreation}
        setTool={setTool}
        selectedBedIds={selectedBedIds}
        deleteSelected={deleteSelected}
      />

      {/* Enhanced MiniMap - hide during creation */}
      {!shouldHideMiniMap && (
        <EnhancedMiniMap 
          viewport={viewport} 
          beds={beds}
          onNavigate={(x, y) => updateViewport({ centerX: x, centerY: y })}
          className="fixed top-20 left-4 z-50 transition-opacity duration-200"
        />
      )}

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
