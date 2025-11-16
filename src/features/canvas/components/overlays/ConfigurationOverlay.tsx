
import React from 'react';
import { BedConfigPanel } from '../BedConfigPanel';
import { BedConfirmationPanel } from '../BedConfirmationPanel';
import { Bed, BedConfig, CanvasTool } from '../../types/bed.types';
import { BedConfigUpdate } from '../../types/layout.types';

interface ConfigurationOverlayProps {
  tool: CanvasTool;
  isCreating: boolean;
  showConfirmation: boolean;
  placementBed: Bed | null;
  beds: Bed[];
  bedConfig: BedConfig;
  updateBedConfig: BedConfigUpdate;
  multiCreationMode: boolean;
  setMultiCreationMode: (enabled: boolean) => void;
  hasCollision?: boolean;
  handleConfirmPlacement: () => void;
  handleCancelPlacement: () => void;
  cancelCreation: () => void;
  isInFocusMode: boolean;
}

export const ConfigurationOverlay: React.FC<ConfigurationOverlayProps> = ({
  tool,
  isCreating,
  showConfirmation,
  placementBed,
  beds,
  bedConfig,
  updateBedConfig,
  multiCreationMode,
  setMultiCreationMode,
  hasCollision,
  handleConfirmPlacement,
  handleCancelPlacement,
  cancelCreation,
  isInFocusMode
}) => {
  // Don't render any configuration overlays in focus mode
  if (isInFocusMode) {
    return null;
  }

  return (
    <>
      {/* Bed Configuration Panel - only show when creating and NOT confirming */}
      {isCreating && tool === 'create-rectangle' && !showConfirmation && (
        <BedConfigPanel
          config={bedConfig}
          onConfigChange={updateBedConfig}
          onClose={cancelCreation}
        />
      )}

      {/* Bed Confirmation Panel - only show when confirmation is needed */}
      {showConfirmation && placementBed && (
        <BedConfirmationPanel
          bed={placementBed}
          beds={beds}
          bedConfig={bedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationToggle={setMultiCreationMode}
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
          hasCollision={hasCollision}
        />
      )}
    </>
  );
};
