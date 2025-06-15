
import React from 'react';
import { ViewControls } from './ViewControls';
import { FocusModeControls } from './FocusModeControls';
import { BedConfirmationPanel } from './BedConfirmationPanel';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { DevelopmentInfo } from './DevelopmentInfo';
import { useIsMobile } from '@/hooks/use-mobile';
import { CanvasTool } from '../types/bed.types';

interface CanvasOverlaysProps {
  showConfirmation: boolean;
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  viewport: any;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  tool: CanvasTool;
  setTool: (tool: CanvasTool) => void;
  bedConfig: any;
  updateBedConfig: any;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  deleteSelected: () => void;
  beds: any[];
  selectedBedIds: string[];
  isSaving: boolean;
  gridSize?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  placementBed?: any;
  hasCollision?: boolean;
  // Focus mode props
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  onExitFocus?: () => void;
  onOpenPlantSelection?: () => void;
  onSelectPlantSpecies?: (species: any) => void;
  onEnterFocus?: (bedId: string) => void;
  onCancelPlantPlacement?: () => void;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  showConfirmation,
  handleConfirmPlacement,
  handleCancelPlacement,
  viewport,
  handleZoomIn,
  handleZoomOut,
  handleFitAll,
  tool,
  setTool,
  bedConfig,
  updateBedConfig,
  multiCreationMode,
  setMultiCreationMode,
  undo,
  redo,
  canUndo,
  canRedo,
  deleteSelected,
  beds,
  selectedBedIds,
  isSaving,
  gridSize = 1,
  isCollapsed = false,
  onToggleCollapse,
  placementBed,
  hasCollision = false,
  // Focus mode props
  isInFocusMode = false,
  focusedBedId = null,
  onExitFocus,
  onOpenPlantSelection,
  onSelectPlantSpecies,
  onEnterFocus,
  onCancelPlantPlacement
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Bed Confirmation Panel - always positioned absolutely/fixed so never hidden at bottom */}
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
          // Fix position on desktop and mobile
          className={
            isMobile
              ? "fixed inset-x-0 bottom-0 z-[150] max-w-full"
              : "fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[340px] max-w-full"
          }
        />
      )}

      {/* Focus Mode Controls */}
      {isInFocusMode && focusedBedId && onExitFocus && (
        <FocusModeControls
          focusedBedId={focusedBedId}
          onExitFocus={onExitFocus}
          onOpenPlantSelection={onOpenPlantSelection || (() => {})}
          onSelectSpecies={onSelectPlantSpecies}
          onCancelPlacement={onCancelPlantPlacement}
        />
      )}

      {/* Only one menu: ViewControls (toolbar/FAB/undo-redo) or Sidebar, never duplicated */}

      {/* On desktop, show ViewControls on left if not in focus mode */}
      {!isMobile && !isInFocusMode && (
        <ViewControls
          zoom={viewport.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitAll={handleFitAll}
          bedsCount={beds.length}
          activeTool={tool}
          onToolChange={setTool}
          className="fixed top-28 left-4 z-40"
        />
      )}

      {/* Desktop Sidebar - only one sidebar at a time, left side */}
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
          onEnterFocus={selectedBedIds.length === 1 ? () => onEnterFocus?.(selectedBedIds[0]) : undefined}
        />
      )}

      {/* Mobile Controls (FAB and panels) - only one! */}
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
          isVisible={!showConfirmation}
          onToggle={() => {}} // handled elsewhere
          isSaving={isSaving}
          showConfirmation={showConfirmation}
          isInFocusMode={isInFocusMode}
        />
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <DevelopmentInfo
          viewport={viewport}
          beds={beds}
          selectedBedIds={selectedBedIds}
          tool={tool}
          isMobile={isMobile}
        />
      )}
    </>
  );
};
