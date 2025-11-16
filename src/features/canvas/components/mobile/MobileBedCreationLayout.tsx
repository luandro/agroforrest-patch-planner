
import React from 'react';
import { Bed, BedConfig, CanvasTool } from '../../types/bed.types';
import { CanvasViewport } from '../../types/canvas.types';
import { BedConfigUpdate } from '../../types/layout.types';
import { BedCreationStatusBar } from './BedCreationStatusBar';
import { BedCreationFloatingControls } from './BedCreationFloatingControls';
import { MobileBottomToolbar } from './MobileBottomToolbar';
import { MobileBedConfigSheet } from './MobileBedConfigSheet';
import { MobileDebugDrawer } from './MobileDebugDrawer';
import { MobileContextActions } from './MobileContextActions';

interface MobileBedCreationLayoutProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  bedConfig: BedConfig;
  onBedConfigChange: BedConfigUpdate;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
  isSaving: boolean;
  viewport: CanvasViewport;
  beds: Bed[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
}

export const MobileBedCreationLayout: React.FC<MobileBedCreationLayoutProps> = ({
  activeTool,
  onToolChange,
  bedConfig,
  onBedConfigChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDeleteSelected,
  selectedCount,
  isSaving,
  viewport,
  beds,
  onZoomIn,
  onZoomOut,
  onFitAll
}) => {
  const [showBedConfig, setShowBedConfig] = React.useState(false);

  const handleOpenBedConfig = () => {
    setShowBedConfig(true);
  };

  const handleCloseBedConfig = () => {
    setShowBedConfig(false);
  };

  const handleNavigateTo = (x: number, y: number) => {
    // Navigation will be handled by the minimap component
    console.log('Navigate to:', x, y);
  };

  return (
    <>
      {/* Status Bar Components */}
      <BedCreationStatusBar
        isSaving={isSaving}
        viewport={viewport}
        beds={beds}
        onNavigate={handleNavigateTo}
      />

      {/* Debug Drawer - Development only */}
      <MobileDebugDrawer />

      {/* Bottom Toolbar - Primary controls */}
      <MobileBottomToolbar
        activeTool={activeTool}
        onToolChange={onToolChange}
      />

      {/* Floating Controls */}
      <BedCreationFloatingControls
        activeTool={activeTool}
        bedConfig={bedConfig}
        viewport={viewport}
        beds={beds}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitAll={onFitAll}
        onOpenBedConfig={handleOpenBedConfig}
      />

      {/* Context Actions - Only show when needed */}
      <MobileContextActions
        canUndo={canUndo}
        canRedo={canRedo}
        selectedCount={selectedCount}
        onUndo={onUndo}
        onRedo={onRedo}
        onDeleteSelected={onDeleteSelected}
      />

      {/* Bed Configuration Bottom Sheet */}
      <MobileBedConfigSheet
        isOpen={showBedConfig}
        onClose={handleCloseBedConfig}
        tool={activeTool}
        bedConfig={bedConfig}
        onConfigChange={onBedConfigChange}
      />
    </>
  );
};
