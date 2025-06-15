
import React from 'react';
import { cn } from '@/lib/utils';
import { CanvasTool } from '../../types/bed.types';
import { MobileControls } from '../MobileControls';
import { ViewControls } from '../ViewControls';
import { SaveStatus } from './SaveStatus';

interface MobileLayoutProps {
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
  showConfirmation: boolean;
  isInFocusMode: boolean;
  viewport: any;
  beds: any[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  onOpenPlantSelection?: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
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
  showConfirmation,
  isInFocusMode,
  viewport,
  beds,
  onZoomIn,
  onZoomOut,
  onFitAll,
  onOpenPlantSelection
}) => {
  // Don't render mobile layout in focus mode
  if (isInFocusMode) {
    return (
      <div className="fixed top-20 right-4 z-30">
        <SaveStatus isSaving={isSaving} />
      </div>
    );
  }

  return (
    <>
      {/* Top Controls - Tool selection and zoom */}
      <div className="fixed top-20 left-4 z-30">
        <ViewControls
          zoom={viewport.zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onFitAll={onFitAll}
          bedsCount={beds.length}
          activeTool={activeTool}
          onToolChange={onToolChange}
          onOpenPlantSelection={onOpenPlantSelection}
          className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2"
        />
      </div>

      {/* Save Status - Top right */}
      <div className="fixed top-20 right-4 z-30">
        <SaveStatus isSaving={isSaving} />
      </div>

      {/* Context-sensitive FAB - Bottom right, only when needed */}
      <MobileControls
        activeTool={activeTool}
        onToolChange={onToolChange}
        bedConfig={bedConfig}
        onBedConfigChange={onBedConfigChange}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onDeleteSelected={onDeleteSelected}
        selectedCount={selectedCount}
        isVisible={false} // Will be controlled internally
        onToggle={() => {}}
        isSaving={isSaving}
        showConfirmation={showConfirmation}
        isInFocusMode={isInFocusMode}
      />
    </>
  );
};
