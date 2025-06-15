
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BulkPlacementConfig, BulkPlacementPreview } from '../types/bulkPlacement.types';
import { PlantSpecies } from '../types/species.types';
import { Bed } from '../types/bed.types';
import { cn } from '@/lib/utils';
import { BulkPlacementHeader } from './bulk-placement/BulkPlacementHeader';
import { BulkPlacementConfigPanel } from './bulk-placement/BulkPlacementConfigPanel';
import { BulkPlacementPreviewResults } from './bulk-placement/BulkPlacementPreviewResults';
import { BulkPlacementActions } from './bulk-placement/BulkPlacementActions';

interface BulkPlacementPanelProps {
  className?: string;
  selectedSpecies: PlantSpecies | null;
  selectedBed: Bed | null;
  config: BulkPlacementConfig | null;
  preview: BulkPlacementPreview | null;
  showPreview: boolean;
  isCalculating: boolean;
  canExecute: boolean;
  hasConflicts: boolean;
  updateConfig: (updates: Partial<BulkPlacementConfig>) => void;
  executeBulkPlacement: () => boolean;
  cancelBulkPlacement: () => void;
  setShowPreview: (show: boolean) => void;
}

export const BulkPlacementPanel: React.FC<BulkPlacementPanelProps> = ({
  className,
  selectedSpecies,
  selectedBed,
  config,
  preview,
  showPreview,
  isCalculating,
  canExecute,
  hasConflicts,
  updateConfig,
  executeBulkPlacement,
  cancelBulkPlacement,
  setShowPreview,
}) => {
  if (!selectedSpecies || !selectedBed || !config) {
    return null;
  }

  return (
    <Card className={cn("w-full", className)}>
      <BulkPlacementHeader 
        selectedSpecies={selectedSpecies} 
        selectedBed={selectedBed} 
      />

      <CardContent className="space-y-4">
        <BulkPlacementConfigPanel 
          config={config}
          updateConfig={updateConfig}
        />

        <Separator />

        <BulkPlacementPreviewResults 
          isCalculating={isCalculating}
          preview={preview}
          hasConflicts={hasConflicts}
        />

        <Separator />

        <BulkPlacementActions
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          executeBulkPlacement={executeBulkPlacement}
          cancelBulkPlacement={cancelBulkPlacement}
          canExecute={canExecute}
          isCalculating={isCalculating}
          preview={preview}
        />
      </CardContent>
    </Card>
  );
};
