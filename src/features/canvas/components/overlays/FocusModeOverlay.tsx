
import React from 'react';
import { FocusModeControls } from '../FocusModeControls';

interface FocusModeOverlayProps {
  isVisible: boolean;
  focusedBedId?: string | null;
  onExitFocus?: () => void;
  onOpenPlantSelection?: () => void;
  onSelectSpecies?: (species: any) => void;
  onCancelPlacement?: () => void;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({
  isVisible,
  focusedBedId,
  onExitFocus,
  onOpenPlantSelection,
  onSelectSpecies,
  onCancelPlacement
}) => {
  if (!isVisible || !focusedBedId || !onExitFocus || !onOpenPlantSelection) {
    return null;
  }

  return (
    <FocusModeControls
      focusedBedId={focusedBedId}
      onExitFocus={onExitFocus}
      onOpenPlantSelection={onOpenPlantSelection}
      onSelectSpecies={onSelectSpecies}
      onCancelPlacement={onCancelPlacement}
    />
  );
};
