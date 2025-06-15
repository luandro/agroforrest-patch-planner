
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlantSpecies } from '../types/species.types';

interface PlantSelectionHeaderProps {
  onClose: () => void;
  isPlacing: boolean;
  selectedSpecies: PlantSpecies | null;
  selectedBedId?: string;
}

export const PlantSelectionHeader: React.FC<PlantSelectionHeaderProps> = ({
  onClose,
  isPlacing,
  selectedSpecies,
  selectedBedId
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Selecionar Plantas
          </h2>
          {isPlacing && selectedSpecies && (
            <p className="text-sm text-green-600 mt-1 font-medium">
              ✓ {selectedSpecies.commonName} selecionada
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {selectedBedId && (
        <p className="text-sm text-gray-600 mt-2">
          {isPlacing 
            ? "Clique no canteiro para plantar ou selecione outra espécie"
            : "Clique em uma espécie para começar a plantar"
          }
        </p>
      )}
    </div>
  );
};
