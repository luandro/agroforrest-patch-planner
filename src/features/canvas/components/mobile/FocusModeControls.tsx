
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';
import { PlantSpecies } from '../../types/species.types';

interface FocusModeControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  selectedSpecies: PlantSpecies | null;
  onUndo: () => void;
  onRedo: () => void;
  onOpenTimeline: () => void;
  onOpenPlantSelection?: () => void;
}

export const FocusModeControls: React.FC<FocusModeControlsProps> = ({
  canUndo,
  canRedo,
  selectedSpecies,
  onUndo,
  onRedo,
  onOpenTimeline,
  onOpenPlantSelection
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
        {/* Timeline Toggle */}
        <button
          onClick={onOpenTimeline}
          className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm hover:bg-green-700 transition-colors"
          title="Linha do Tempo"
        >
          📈
        </button>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-10 h-10 p-0"
            title="Desfazer"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="w-10 h-10 p-0"
            title="Refazer"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Change Species Button */}
        {selectedSpecies && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenPlantSelection}
            className="px-3 py-1 text-sm font-medium"
            title="Trocar Espécie"
          >
            Trocar
          </Button>
        )}
      </div>
    </div>
  );
};
