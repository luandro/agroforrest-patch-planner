
import React from 'react';
import { BedConfigPanel } from '../BedConfigPanel';
import { BedConfirmationPanel } from '../BedConfirmationPanel';
import { CanvasTool } from '../../types/bed.types';

interface ConfigurationOverlayProps {
  tool: CanvasTool;
  isCreating: boolean;
  showConfirmation: boolean;
  placementBed: any;
  beds: any[];
  bedConfig: any;
  updateBedConfig: any;
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
  isInFocusMode
}) => {
  return (
    <>
      {/* Bed Configuration Panel */}
      {isCreating && tool === 'create-rectangle' && !showConfirmation && !isInFocusMode && (
        <BedConfigPanel
          config={bedConfig}
          onConfigChange={updateBedConfig}
          hasCollision={hasCollision}
        />
      )}

      {/* Bed Confirmation Panel */}
      {showConfirmation && placementBed && !isInFocusMode && (
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
