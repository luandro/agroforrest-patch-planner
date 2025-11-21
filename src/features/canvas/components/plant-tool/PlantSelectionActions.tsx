
import React, { useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeLogger } from '@/lib/logger';

interface PlantSelectionActionsProps {
  selectedCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onSelectSameSpecies?: () => void;
  onAdjustSpacing?: () => void;
}

export const PlantSelectionActions: React.FC<PlantSelectionActionsProps> = ({
  selectedCount,
  onEdit,
  onDelete,
  onSelectSameSpecies,
  onAdjustSpacing
}) => {
  // Safe wrapper for callbacks with error handling
  const safeCall = useCallback((fn: (() => void) | undefined, actionName: string) => {
    if (!fn) return;
    try {
      fn();
    } catch (error) {
      storeLogger.error(`[PlantSelectionActions] ${actionName} failed:`, error);
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        {selectedCount} planta{selectedCount > 1 ? 's' : ''} selecionada{selectedCount > 1 ? 's' : ''}
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => safeCall(onEdit, 'Edit')}
          className="flex-1 flex items-center gap-1"
        >
          <Edit className="w-3 h-3" />
          Editar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => safeCall(onDelete, 'Delete')}
          className="flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Deletar
        </Button>
      </div>

      {/* Quick Actions for Multi-Select */}
      {selectedCount > 1 && (
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => safeCall(onSelectSameSpecies, 'Select same species')}
            disabled={!onSelectSameSpecies}
          >
            Mesma Espécie
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => safeCall(onAdjustSpacing, 'Adjust spacing')}
            disabled={!onAdjustSpacing}
          >
            Ajustar Espaço
          </Button>
        </div>
      )}
    </div>
  );
};
