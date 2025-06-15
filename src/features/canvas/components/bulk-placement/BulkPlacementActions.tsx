
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Grid3X3 } from 'lucide-react';
import { BulkPlacementPreview } from '../../types/bulkPlacement.types';

interface BulkPlacementActionsProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  executeBulkPlacement: () => boolean;
  cancelBulkPlacement: () => void;
  canExecute: boolean;
  isCalculating: boolean;
  preview: BulkPlacementPreview | null;
}

export const BulkPlacementActions: React.FC<BulkPlacementActionsProps> = ({
  showPreview,
  setShowPreview,
  executeBulkPlacement,
  cancelBulkPlacement,
  canExecute,
  isCalculating,
  preview,
}) => {
  return (
    <div className="space-y-2">
      <Button
        onClick={() => setShowPreview(!showPreview)}
        variant="outline"
        className="w-full"
        disabled={!preview || preview.totalCount === 0 || isCalculating}
      >
        <Eye className="w-4 h-4 mr-2" />
        {showPreview ? 'Ocultar Visualização' : 'Visualizar Arranjo'}
      </Button>

      <Button
        onClick={executeBulkPlacement}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={!canExecute || isCalculating}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Plantar Todas ({preview?.totalCount || 0})
      </Button>

      <Button
        onClick={cancelBulkPlacement}
        variant="ghost"
        className="w-full"
      >
        Cancelar
      </Button>
    </div>
  );
};
