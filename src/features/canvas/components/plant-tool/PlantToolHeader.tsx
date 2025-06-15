
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlantToolHeaderProps {
  hasSelection: boolean;
  onClearSelection: () => void;
}

export const PlantToolHeader: React.FC<PlantToolHeaderProps> = ({
  hasSelection,
  onClearSelection
}) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-900">
        {hasSelection ? 'Plantas Selecionadas' : 'Plantar Espécies'}
      </h3>
      {hasSelection && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
