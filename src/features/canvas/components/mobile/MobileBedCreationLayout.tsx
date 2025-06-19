
import React from 'react';
import { CanvasTool } from '../../types/bed.types';
import { SaveStatus } from './SaveStatus';
import { MobileBottomToolbar } from './MobileBottomToolbar';
import { MobileFloatingZoom } from './MobileFloatingZoom';
import { MobileMiniMap } from './MobileMiniMap';
import { MobileBedConfigButton } from './MobileBedConfigButton';
import { MobileBedConfigSheet } from './MobileBedConfigSheet';
import { MobileDebugDrawer } from './MobileDebugDrawer';
import { MobileContextActions } from './MobileContextActions';

interface MobileBedCreationLayoutProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  bedConfig: any;
  onBedConfigChange: any;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
  isSaving: boolean;
  viewport: any;
  beds: any[];
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
      {/* Save Status - Top right */}
      <div className="fixed top-20 right-4 z-30">
        <SaveStatus isSaving={isSaving} />
      </div>

      {/* Minimap - Top left */}
      <div className="fixed top-20 left-4 z-30">
        <MobileMiniMap
          viewport={viewport}
          beds={beds}
          onNavigate={handleNavigateTo}
        />
      </div>

      {/* Debug Drawer - Development only */}
      <MobileDebugDrawer />

      {/* Bottom Toolbar - Primary controls */}
      <MobileBottomToolbar
        activeTool={activeTool}
        onToolChange={onToolChange}
      />

      {/* Floating Zoom Controls */}
      <MobileFloatingZoom
        zoom={viewport.zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitAll={onFitAll}
        bedsCount={beds.length}
      />

      {/* Bed Configuration Button - Only show when Canteiro tool is selected */}
      {activeTool === 'create-rectangle' && (
        <MobileBedConfigButton
          onOpenConfig={handleOpenBedConfig}
          bedConfig={bedConfig}
        />
      )}

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
