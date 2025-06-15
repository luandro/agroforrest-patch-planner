
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface FocusModeControlsProps {
  focusedBedId: string;
  onExitFocus: () => void;
  onOpenPlantSelection: () => void;
  onSelectSpecies?: (species: any) => void;
}

export const FocusModeControls: React.FC<FocusModeControlsProps> = ({
  focusedBedId,
  onExitFocus,
  onOpenPlantSelection,
}) => {
  const { selectedSpecies, isPlacing } = usePlantPlacementStore();

  return (
    <div className="fixed top-20 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            Modo Plantio
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExitFocus}
            className="p-1 h-6 w-6"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Status */}
        <div className="space-y-2">
          {selectedSpecies && isPlacing ? (
            <div className="p-2 bg-green-50 rounded border border-green-200">
              <p className="text-xs text-green-700 font-medium">
                ✓ {selectedSpecies.commonName}
              </p>
              <p className="text-xs text-green-600">
                Clique no canteiro para plantar
              </p>
            </div>
          ) : (
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                Selecione uma espécie para começar
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={onOpenPlantSelection}
          className="w-full text-xs"
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          {selectedSpecies ? 'Trocar Espécie' : 'Selecionar Plantas'}
        </Button>

        {/* Instructions */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Clique em espécies para trocar</p>
          <p>• ESC ou área vazia cancela</p>
          <p>• Grade de 10cm para precisão</p>
        </div>
      </div>
    </div>
  );
};
