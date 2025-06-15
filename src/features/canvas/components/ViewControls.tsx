
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
    <div className={cn(
      "flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200",
      // Mobile-first responsive sizing
      "p-1.5 sm:p-2",
      // Fixed z-index to avoid conflicts
      "z-30",
      className
    )}>
      {/* Zoom Level Indicator - Better mobile sizing */}
      {!hideZoomControls && (
        <div className="text-xs text-gray-600 text-center px-2 py-1 bg-gray-50 rounded">
          {zoom.toFixed(1)}x
        </div>
      )}
      
      {/* Zoom Controls - Enhanced mobile touch targets */}
      {!hideZoomControls && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className={cn(
              "p-0 touch-manipulation hover:bg-green-50 hover:border-green-300 active:bg-green-100",
              // Larger touch targets on mobile
              "w-12 h-12 sm:w-11 sm:h-11",
              "active:scale-95"
            )}
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
          >
            <span className="text-lg font-bold text-green-600">+</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className={cn(
              "p-0 touch-manipulation hover:bg-red-50 hover:border-red-300 active:bg-red-100",
              "w-12 h-12 sm:w-11 sm:h-11",
              "active:scale-95"
            )}
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
            className={cn(
              "p-0 text-xs touch-manipulation hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100",
              "w-12 h-12 sm:w-11 sm:h-11",
              "disabled:opacity-50 active:scale-95"
            )}
            aria-label="Ajustar visualização para todos os canteiros"
            title="Ver todos os canteiros"
          >
            <span className="text-blue-600">📐</span>
          </Button>

          {/* Separator */}
          <div className="w-full h-px bg-gray-300 my-1" />
        </>
      )}
      
      {/* Tool Selection - Better mobile experience */}
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        
        return (
          <Button
            key={tool.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className={cn(
              "p-0 touch-manipulation",
              // Enhanced mobile touch targets
              "w-12 h-12 sm:w-11 sm:h-11",
              "active:scale-95",
              isActive && "ring-2 ring-blue-500 ring-offset-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
              !isActive && "hover:bg-gray-50 active:bg-gray-100"
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

      {/* Plant Selection Button - Mobile optimized */}
      {onOpenPlantSelection && (
        <>
          <div className="w-full h-px bg-gray-300 my-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPlantSelection}
            className={cn(
              "p-0 touch-manipulation hover:bg-green-50 hover:border-green-300 active:bg-green-100",
              "w-12 h-12 sm:w-11 sm:h-11",
              "active:scale-95"
            )}
            title="Selecionar plantas"
            aria-label="Abrir seleção de plantas"
          >
            <Sprout className="w-5 h-5 text-green-600" />
          </Button>
        </>
      )}
    </div>
  );
};
