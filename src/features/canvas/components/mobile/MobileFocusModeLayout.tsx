
import React from 'react';
import { GrowthTimelineSlider } from '../timeline/GrowthTimelineSlider';
import { SaveStatus } from './SaveStatus';
import { FocusModeControls } from './FocusModeControls';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';

interface MobileFocusModeLayoutProps {
  isSaving: boolean;
  onOpenPlantSelection?: () => void;
}

export const MobileFocusModeLayout: React.FC<MobileFocusModeLayoutProps> = ({
  isSaving,
  onOpenPlantSelection
}) => {
  const { 
    selectedSpecies,
    undo: plantUndo,
    redo: plantRedo,
    canUndo: canUndoPlants,
    canRedo: canRedoPlants
  } = usePlantPlacementStore();
  
  const [showTimeline, setShowTimeline] = React.useState(false);

  const canUndoAction = canUndoPlants();
  const canRedoAction = canRedoPlants();

  const handleOpenTimeline = () => {
    setShowTimeline(true);
  };

  const handleCloseTimeline = () => {
    setShowTimeline(false);
  };

  return (
    <>
      {/* Save Status - Top right - only show when timeline is not active */}
      {!showTimeline && (
        <div className="fixed top-20 right-4 z-30">
          <SaveStatus isSaving={isSaving} />
        </div>
      )}

      {/* Focus Mode Controls - Bottom center */}
      {!showTimeline && (
        <FocusModeControls
          canUndo={canUndoAction}
          canRedo={canRedoAction}
          selectedSpecies={selectedSpecies}
          onUndo={() => plantUndo()}
          onRedo={() => plantRedo()}
          onOpenTimeline={handleOpenTimeline}
          onOpenPlantSelection={onOpenPlantSelection}
        />
      )}

      {/* Timeline Slider */}
      <GrowthTimelineSlider
        isVisible={showTimeline}
        onClose={handleCloseTimeline}
        isMinimal={true}
      />
    </>
  );
};
