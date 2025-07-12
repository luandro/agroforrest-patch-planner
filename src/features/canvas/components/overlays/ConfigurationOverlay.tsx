
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
  isEditingDimensions?: boolean;
  setIsEditingDimensions?: (isEditing: boolean) => void;
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
  isInFocusMode,
  isEditingDimensions,
  setIsEditingDimensions,
}) => {
  // Don't render any configuration overlays in focus mode
  if (isInFocusMode) {
    return null;
  }

  return (
    <>
      {/* Bed Configuration Panel for initial creation */}
      {isCreating && tool === 'create-rectangle' && !showConfirmation && !isEditingDimensions && (
        <BedConfigPanel
          config={bedConfig}
          onConfigChange={updateBedConfig}
          onClose={cancelCreation} // Or a different handler if needed for this specific close
        />
      )}

      {/* Bed Configuration Panel when editing from confirmation */}
      {showConfirmation && isEditingDimensions && placementBed && (
        <BedConfigPanel
          config={bedConfig} // Should this be derived from placementBed or bedConfig?
          onConfigChange={updateBedConfig}
          onClose={() => setIsEditingDimensions && setIsEditingDimensions(false)}
        />
      )}

      {/* Bed Confirmation Panel - only show when confirmation is needed and not editing dimensions */}
      {showConfirmation && !isEditingDimensions && placementBed && (
        <BedConfirmationPanel
          bed={placementBed}
          beds={beds}
          bedConfig={bedConfig}
          multiCreationMode={multiCreationMode}
          onMultiCreationToggle={setMultiCreationMode}
          onConfirm={handleConfirmPlacement}
          onCancel={handleCancelPlacement}
          hasCollision={hasCollision}
          isEditingDimensions={isEditingDimensions}
          setIsEditingDimensions={setIsEditingDimensions}
        />
      )}
    </>
  );
};
