
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

interface PlantEditorActionsProps {
  selectedCount: number;
  onEditDetails: () => void;
  onMoreOptions: () => void;
  onDelete: () => void;
}

export const PlantEditorActions: React.FC<PlantEditorActionsProps> = ({
  selectedCount,
  onEditDetails,
  onMoreOptions,
  onDelete
}) => {
  const isSingle = selectedCount === 1;

  return (
    <div className="p-4 border-t border-gray-100 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-12 flex items-center gap-2"
          onClick={onEditDetails}
        >
          <Edit className="w-5 h-5" />
          Editar Detalhes
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="h-12 flex items-center gap-2"
          onClick={onMoreOptions}
        >
          <MoreHorizontal className="w-5 h-5" />
          Mais Opções
        </Button>
      </div>

      <Button
        variant="destructive"
        size="lg"
        onClick={onDelete}
        className="w-full h-12 flex items-center gap-2"
      >
        <Trash2 className="w-5 h-5" />
        Deletar {isSingle ? 'Planta' : `${selectedCount} Plantas`}
      </Button>
    </div>
  );
};
