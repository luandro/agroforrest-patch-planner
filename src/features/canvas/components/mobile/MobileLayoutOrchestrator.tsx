
import React from 'react';
import { CanvasTool } from '../../types/bed.types';
import { MobileFocusModeLayout } from './MobileFocusModeLayout';
import { MobileBedCreationLayout } from './MobileBedCreationLayout';
import { MobilePlantEditor } from './MobilePlantEditor';
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

  // Show plant editor when plants are selected in focus mode
  const hasSelectedPlants = selectedPlacementIds.length > 0;
  
  React.useEffect(() => {
    if (isInFocusMode && hasSelectedPlants && !showPlantEditor) {
      const timer = setTimeout(() => {
        setShowPlantEditor(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInFocusMode, hasSelectedPlants, showPlantEditor]);

  const handleClosePlantEditor = () => {
    setShowPlantEditor(false);
    clearSelection();
  };

  // Plant editor modal for focus mode
  if (showPlantEditor && isInFocusMode && focusedBedId) {
    return (
      <MobilePlantEditor
        selectedPlacementIds={selectedPlacementIds}
        onClose={handleClosePlantEditor}
        focusedBedId={focusedBedId}
      />
    );
  }

  // Focus mode layout - Minimal controls, maximum canvas space
  if (isInFocusMode) {
    return (
      <MobileFocusModeLayout
        isSaving={isSaving}
        onOpenPlantSelection={onOpenPlantSelection}
      />
    );
  }

  // Bed creation mode - Streamlined mobile-first design
  return (
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
  );
};
