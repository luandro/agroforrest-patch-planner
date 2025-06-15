
import React from 'react';
import { ArrowLeft, Maximize2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FocusModePlantTool } from './FocusModePlantTool';

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
  onSelectSpecies
}) => {
  return (
    <div className="fixed top-20 left-4 z-40 space-y-4">
      {/* Exit Focus Mode */}
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExitFocus}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Sair do Modo Focado
          </Button>
          
          <div className="text-sm text-gray-600">
            Grade de plantio ativa (10cm)
          </div>
        </div>
      </div>

      {/* Plant Tool */}
      <FocusModePlantTool
        focusedBedId={focusedBedId}
        onOpenPlantSelection={onOpenPlantSelection}
        onSelectSpecies={onSelectSpecies || (() => {})}
      />
    </div>
  );
};
