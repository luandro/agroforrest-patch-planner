
import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bed } from '@/features/canvas/types/bed.types';
import { PlantPlacement } from '@/features/canvas/stores/plantPlacementStore';
import { FocusMode } from '@/features/canvas/stores/bedStore';

interface PatchCreatorHeaderProps {
  isMobile: boolean;
  focusMode: FocusMode;
  handleExitFocus: () => void;
  placements: PlantPlacement[];
  isTimelineActive: boolean;
  setTimelineActive: (active: boolean) => void;
  fps: number;
  beds: Bed[];
  selectedBedIds: string[];
  tool: string;
}

export const PatchCreatorHeader: React.FC<PatchCreatorHeaderProps> = ({
  isMobile,
  focusMode,
  handleExitFocus,
  placements,
  isTimelineActive,
  setTimelineActive,
  fps,
  beds,
  selectedBedIds,
  tool
}) => {
  if (isMobile && focusMode.isActive) {
    return null; // Header is hidden on mobile during focus mode
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 h-16">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button for focus mode */}
          {focusMode.isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitFocus}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {focusMode.isActive ? 'Modo Plantio - Canteiro Focado' : 'Criador de Canteiros'}
            </h1>
            <p className="text-sm text-gray-600 hidden sm:block">
              {focusMode.isActive 
                ? 'Plante espécies com precisão usando a grade de 10cm'
                : 'Crie e organize canteiros para seu sistema agroflorestal'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Timeline Toggle Button */}
          {placements.length > 0 && !isMobile && (
            <Button
              variant={isTimelineActive ? "default" : "outline"}
              size="sm"
              onClick={() => setTimelineActive(!isTimelineActive)}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Linha do Tempo
            </Button>
          )}
          
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 hidden md:block">
              FPS: {fps} | Canteiros: {beds.length} | Selecionados: {selectedBedIds.length} | Ferramenta: {tool}
              {focusMode.isActive && ` | Focado: ${focusMode.bedId}`}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

