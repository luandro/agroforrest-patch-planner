
import React from 'react';
import { ViewControls } from './ViewControls';
import { FocusModeControls } from './FocusModeControls';
import { BedConfirmationPanel } from './BedConfirmationPanel';
import { MobileControls } from './MobileControls';
import { DesktopSidebar } from './DesktopSidebar';
import { DevelopmentInfo } from './DevelopmentInfo';
import { useIsMobile } from '@/hooks/use-mobile';

interface CanvasOverlaysProps {
  showConfirmation: boolean;
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  viewport: any;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFitAll: () => void;
  tool: string;
  setTool: (tool: any) => void;
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
  // Focus mode props
  isInFocusMode?: boolean;
  focusedBedId?: string | null;
  onExitFocus?: () => void;
  onOpenPlantSelection?: () => void;
  onSelectPlantSpecies?: (species: any) => void;
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
  // Focus mode props
  isInFocusMode = false,
  focusedBedId = null,
  onExitFocus,
  onOpenPlantSelection,
  onSelectPlantSpecies
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Bed Confirmation Panel */}
      {showConfirmation && (
        <BedConfirmationPanel
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
        />
      )}

      {/* Focus Mode Controls */}
      {isInFocusMode && focusedBedId && onExitFocus && (
        <FocusModeControls
          focusedBedId={focusedBedId}
          onExitFocus={onExitFocus}
          onOpenPlantSelection={onOpenPlantSelection || (() => {})}
          onSelectSpecies={onSelectPlantSpecies}
        />
      )}

      {/* View Controls - positioned to not conflict with focus mode */}
      {!isInFocusMode && (
        <ViewControls
          zoom={viewport.zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitAll={handleFitAll}
        />
      )}

      {/* Mobile Controls */}
      {isMobile && !isInFocusMode && (
        <MobileControls
          tool={tool}
          setTool={setTool}
          bedConfig={bedConfig}
          updateBedConfig={updateBedConfig}
          multiCreationMode={multiCreationMode}
          setMultiCreationMode={setMultiCreationMode}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          deleteSelected={deleteSelected}
          selectedBedIds={selectedBedIds}
          isSaving={isSaving}
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && !isInFocusMode && (
        <DesktopSidebar
          tool={tool}
          setTool={setTool}
          bedConfig={bedConfig}
          updateBedConfig={updateBedConfig}
          multiCreationMode={multiCreationMode}
          setMultiCreationMode={setMultiCreationMode}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          deleteSelected={deleteSelected}
          beds={beds}
          selectedBedIds={selectedBedIds}
          isSaving={isSaving}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <DevelopmentInfo
          viewport={viewport}
          beds={beds}
          selectedBedIds={selectedBedIds}
          tool={tool}
          gridSize={gridSize}
        />
      )}
    </>
  );
};
