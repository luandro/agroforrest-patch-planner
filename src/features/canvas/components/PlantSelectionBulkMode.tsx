
import React from 'react';
import { BulkPlacementPanel } from './BulkPlacementPanel';

interface PlantSelectionBulkModeProps {
  isBulkActive: boolean;
}

export const PlantSelectionBulkMode: React.FC<PlantSelectionBulkModeProps> = ({
  isBulkActive
}) => {
  if (!isBulkActive) {
    return null;
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="px-4 h-full overflow-y-auto">
        <BulkPlacementPanel />
      </div>
    </div>
  );
};
