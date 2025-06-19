
import React from 'react';
import { CanvasTool } from '../../types/bed.types';
import { MobileFocusModeLayout } from './MobileFocusModeLayout';
import { MobileBedCreationLayout } from './MobileBedCreationLayout';
import { PlantEditorModal } from './PlantEditorModal';
import { PlantSelectionEffect } from './PlantSelectionEffect';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';

interface MobileLayoutOrchestratorProps {
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
  focusedBedId?: string;
  isCreating: boolean;
  cancelCreation: () => void;
}

export const MobileLayoutOrchestrator: React.FC<MobileLayoutOrchestratorProps> = ({
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
  isInFocusMode,
  viewport,
  beds,
  onZoomIn,
  onZoomOut,
  onFitAll,
  onOpenPlantSelection,
  focusedBedId,
  ...rest
}) => {
  const { 
    selectedPlacementIds, 
    clearSelection
  } = usePlantPlacementStore();
  
  const [showPlantEditor, setShowPlantEditor] = React.useState(false);
  const hasSelectedPlants = selectedPlacementIds.length > 0;

  const handleClosePlantEditor = () => {
    setShowPlantEditor(false);
    clearSelection();
  };

  const handleShowPlantEditor = () => {
    setShowPlantEditor(true);
  };

  return (
    <>
      {/* Plant Selection Effect */}
      <PlantSelectionEffect
        isInFocusMode={isInFocusMode}
        hasSelectedPlants={hasSelectedPlants}
        showPlantEditor={showPlantEditor}
        onShowEditor={handleShowPlantEditor}
      />

      {/* Plant Editor Modal */}
      <PlantEditorModal
        isVisible={showPlantEditor && isInFocusMode}
        selectedPlacementIds={selectedPlacementIds}
        focusedBedId={focusedBedId || ''}
        onClose={handleClosePlantEditor}
      />

      {/* Layout Switcher */}
      {isInFocusMode ? (
        <MobileFocusModeLayout
          isSaving={isSaving}
          onOpenPlantSelection={onOpenPlantSelection}
        />
      ) : (
        <MobileBedCreationLayout
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
          isSaving={isSaving}
          viewport={viewport}
          beds={beds}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onFitAll={onFitAll}
        />
      )}
    </>
  );
};
