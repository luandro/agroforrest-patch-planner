
import React from 'react';

interface PlantSelectionEffectProps {
  isInFocusMode: boolean;
  hasSelectedPlants: boolean;
  showPlantEditor: boolean;
  onShowEditor: () => void;
}

export const PlantSelectionEffect: React.FC<PlantSelectionEffectProps> = ({
  isInFocusMode,
  hasSelectedPlants,
  showPlantEditor,
  onShowEditor
}) => {
  React.useEffect(() => {
    if (isInFocusMode && hasSelectedPlants && !showPlantEditor) {
      const timer = setTimeout(() => {
        onShowEditor();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInFocusMode, hasSelectedPlants, showPlantEditor, onShowEditor]);

  return null;
};
