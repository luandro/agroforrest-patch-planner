
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storeLogger } from '@/lib/logger';

interface PlantSelectionActionsProps {
  selectedCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const PlantSelectionActions: React.FC<PlantSelectionActionsProps> = ({
  selectedCount,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        {selectedCount} planta{selectedCount > 1 ? 's' : ''} selecionada{selectedCount > 1 ? 's' : ''}
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onEdit}
          className="flex-1 flex items-center gap-1"
        >
          <Edit className="w-3 h-3" />
          Editar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
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
            onClick={() => {
              // Note: Select same species is implemented in usePlantEditorActions
              storeLogger.debug('Select same species action triggered');
            }}
          >
            Mesma Espécie
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              // Note: Spacing adjustment requires spacing input UI (future enhancement)
              storeLogger.debug('Adjust spacing action triggered');
            }}
          >
            Ajustar Espaço
          </Button>
        </div>
      )}
    </div>
  );
};
