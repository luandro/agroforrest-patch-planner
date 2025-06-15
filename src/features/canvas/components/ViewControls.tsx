import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool } from '../types/bed.types';
import { 
  Square, 
  Move,
  Sprout
} from 'lucide-react';

interface ViewControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  bedsCount: number;
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  onOpenPlantSelection?: () => void;
  className?: string;
  hideZoomControls?: boolean;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitAll,
  bedsCount,
  activeTool,
  onToolChange,
  onOpenPlantSelection,
  className,
  hideZoomControls = false
}) => {
  const tools = [
    {
      id: 'pan' as CanvasTool,
      icon: Move,
      label: 'Mover',
      tooltip: 'Arrastar para navegar'
    },
    {
      id: 'create-rectangle' as CanvasTool,
      icon: Square,
      label: 'Retângulo',
      tooltip: 'Criar canteiros retangulares'
    },
    {
      id: 'select' as CanvasTool,
      icon: '🎯',
      label: 'Selecionar',
      tooltip: 'Selecionar e editar canteiros'
    }
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Tool Selection - Primary controls */}
      <div className="flex gap-1">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          
          return (
            <Button
              key={tool.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "w-12 h-12 p-0 touch-manipulation active:scale-95 transition-all",
                isActive && "bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-500 ring-offset-1",
                !isActive && "hover:bg-gray-50"
              )}
              title={tool.tooltip}
              aria-label={tool.tooltip}
            >
              {typeof tool.icon === 'string' ? (
                <span className="text-lg">{tool.icon}</span>
              ) : (
                <tool.icon className="w-5 h-5" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Zoom Controls - Secondary controls */}
      {!hideZoomControls && (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="w-12 h-12 p-0 touch-manipulation hover:bg-green-50 hover:border-green-300 active:scale-95"
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
          >
            <span className="text-lg font-bold text-green-600">+</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="w-12 h-12 p-0 touch-manipulation hover:bg-red-50 hover:border-red-300 active:scale-95"
            aria-label="Diminuir zoom"
            title="Diminuir zoom"
          >
            <span className="text-lg font-bold text-red-600">−</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onFitAll}
            disabled={bedsCount === 0}
            className="w-12 h-12 p-0 text-xs touch-manipulation hover:bg-blue-50 hover:border-blue-300 active:scale-95 disabled:opacity-50"
            aria-label="Ajustar visualização"
            title="Ver todos os canteiros"
          >
            <span className="text-blue-600">📐</span>
          </Button>
        </div>
      )}

      {/* Plant Selection Button */}
      {onOpenPlantSelection && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPlantSelection}
          className="w-12 h-12 p-0 touch-manipulation hover:bg-green-50 hover:border-green-300 active:scale-95"
          title="Selecionar plantas"
          aria-label="Abrir seleção de plantas"
        >
          <Sprout className="w-5 h-5 text-green-600" />
        </Button>
      )}

      {/* Zoom Level Indicator */}
      {!hideZoomControls && (
        <div className="text-xs text-gray-600 text-center px-2 py-1 bg-gray-50 rounded">
          {zoom.toFixed(1)}x
        </div>
      )}
    </div>
  );
};
