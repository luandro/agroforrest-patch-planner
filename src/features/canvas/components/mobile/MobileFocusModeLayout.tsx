
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';
import { GrowthTimelineSlider } from '../timeline/GrowthTimelineSlider';
import { SaveStatus } from './SaveStatus';
import { usePlantPlacementStore } from '../../stores/plantPlacementStore';

interface MobileFocusModeLayoutProps {
  isSaving: boolean;
  onOpenPlantSelection?: () => void;
}

export const MobileFocusModeLayout: React.FC<MobileFocusModeLayoutProps> = ({
  isSaving,
  onOpenPlantSelection
}) => {
  const { 
    selectedSpecies,
    undo: plantUndo,
    redo: plantRedo,
    canUndo: canUndoPlants,
    canRedo: canRedoPlants
  } = usePlantPlacementStore();
  
  const [showTimeline, setShowTimeline] = React.useState(false);

  const canUndoAction = canUndoPlants();
  const canRedoAction = canRedoPlants();

  return (
    <>
      {/* Save Status - Top right - only show when timeline is not active */}
      {!showTimeline && (
        <div className="fixed top-20 right-4 z-30">
          <SaveStatus isSaving={isSaving} />
        </div>
      )}

      {/* Minimal Focus Controls - Bottom center */}
      {!showTimeline && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
            {/* Timeline Toggle */}
            <button
              onClick={() => setShowTimeline(true)}
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
                onClick={() => plantUndo()}
                disabled={!canUndoAction}
                className="w-10 h-10 p-0"
                title="Desfazer"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => plantRedo()}
                disabled={!canRedoAction}
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
      )}

      {/* Timeline Slider */}
      <GrowthTimelineSlider
        isVisible={showTimeline}
        onClose={() => setShowTimeline(false)}
        isMinimal={true}
      />
    </>
  );
};
