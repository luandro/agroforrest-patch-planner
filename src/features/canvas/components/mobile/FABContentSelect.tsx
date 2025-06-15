
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface FABContentSelectProps {
  selectedCount: number;
  onDeleteSelected: () => void;
}

export const FABContentSelect: React.FC<FABContentSelectProps> = ({
  selectedCount,
  onDeleteSelected
}) => {
  if (selectedCount > 0) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 text-center">
          Editar Canteiro Selecionado
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          className="w-full h-12 touch-manipulation"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Deletar ({selectedCount})
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-4 opacity-75">
      <div className="text-sm text-gray-600">
        Toque em um canteiro para editar
      </div>
    </div>
  );
};
