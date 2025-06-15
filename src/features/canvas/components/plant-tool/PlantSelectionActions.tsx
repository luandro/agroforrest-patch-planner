
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              // TODO: Select all same species
              console.log('Select same species');
            }}
          >
            Mesma Espécie
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              // TODO: Adjust spacing proportionally
              console.log('Adjust spacing');
            }}
          >
            Ajustar Espaço
          </Button>
        </div>
      )}
    </div>
  );
};
