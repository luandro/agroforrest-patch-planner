
import React from 'react';
import { ArrowLeft, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';

interface FocusModeControlsProps {
  focusedBedId: string;
  onExitFocus: () => void;
  onOpenPlantSelection: () => void;
  onSelectSpecies?: (species: any) => void;
  onCancelPlacement?: () => void;
}

export const FocusModeControls: React.FC<FocusModeControlsProps> = ({
  focusedBedId,
  onExitFocus,
  onOpenPlantSelection,
  onCancelPlacement,
}) => {
  const { selectedSpecies, isPlacing, getPlacementsForBed } = usePlantPlacementStore();

  // Get current bed placements for stats
  const bedPlacements = getPlacementsForBed(focusedBedId);
  const plantCount = bedPlacements.length;

  const handleCancelPlacement = () => {
    if (onCancelPlacement) {
      onCancelPlacement();
    }
  };

  return (
    <div className="fixed top-20 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs animate-fade-in">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Modo Plantio
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExitFocus}
            className="p-1 h-6 w-6 hover:bg-gray-100"
            title="Sair do modo plantio (ESC)"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Status */}
        <div className="space-y-2">
          {selectedSpecies && isPlacing ? (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  {selectedSpecies.commonName}
                </p>
              </div>
              <p className="text-xs text-green-600">
                Clique no canteiro para plantar
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelPlacement}
                className="mt-2 text-xs h-6 w-full text-green-600 hover:bg-green-100"
              >
                <X className="w-3 h-3 mr-1" />
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                Selecione uma espécie
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Escolha plantas para começar o plantio
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="p-2 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>{plantCount}</strong> planta{plantCount !== 1 ? 's' : ''} no canteiro
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onOpenPlantSelection}
          className="w-full text-sm"
          size="sm"
          variant={selectedSpecies ? "outline" : "default"}
        >
          <Plus className="w-4 h-4 mr-2" />
          {selectedSpecies ? 'Trocar Espécie' : 'Selecionar Plantas'}
        </Button>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
          <p>• <strong>Clique</strong> em espécies para trocar</p>
          <p>• <strong>ESC</strong> ou área vazia cancela</p>
          <p>• <strong>Grade 10cm</strong> para precisão</p>
        </div>
      </div>
    </div>
  );
};
