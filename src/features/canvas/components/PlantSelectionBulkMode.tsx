
import React from 'react';
import { BulkPlacementPanel } from './BulkPlacementPanel';
import { useBulkPlacement } from '../hooks/useBulkPlacement';

type BulkPlacementHookReturn = ReturnType<typeof useBulkPlacement>;

interface PlantSelectionBulkModeProps {
  bulkPlacementProps: BulkPlacementHookReturn;
}

export const PlantSelectionBulkMode: React.FC<PlantSelectionBulkModeProps> = ({
  bulkPlacementProps,
}) => {
  if (!bulkPlacementProps.isActive) {
    return (
      <div className="flex-1 overflow-y-auto p-4 text-center text-gray-500">
        <p className="text-sm">
          Selecione uma espécie no modo "Individual" e clique em "Plantio em
          Massa" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="px-4 h-full overflow-y-auto">
        <BulkPlacementPanel {...bulkPlacementProps} />
      </div>
    </div>
  );
};
