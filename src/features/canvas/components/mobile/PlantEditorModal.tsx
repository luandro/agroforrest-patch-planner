
import React from 'react';
import { MobilePlantEditor } from './MobilePlantEditor';

interface PlantEditorModalProps {
  isVisible: boolean;
  selectedPlacementIds: string[];
  focusedBedId: string;
  onClose: () => void;
}

export const PlantEditorModal: React.FC<PlantEditorModalProps> = ({
  isVisible,
  selectedPlacementIds,
  focusedBedId,
  onClose
}) => {
  if (!isVisible || !focusedBedId) {
    return null;
  }

  return (
    <MobilePlantEditor
      selectedPlacementIds={selectedPlacementIds}
      onClose={onClose}
      focusedBedId={focusedBedId}
    />
  );
};
