
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool } from '../types/bed.types';
import {
  Square,
  Move,
  MousePointer2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Don't render on mobile - use mobile-specific components instead
  if (isMobile) {
    return null;
  }

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
      icon: MousePointer2,
      label: 'Selecionar',
      tooltip: 'Selecionar e editar canteiros'
    }
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Tool Selection */}
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
                "min-w-[48px] min-h-[48px] p-0 transition-all rounded-xl",
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

      {/* Zoom Controls */}
      {!hideZoomControls && (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="min-w-[48px] min-h-[48px] p-0 hover:bg-green-50 hover:border-green-300 rounded-xl"
            aria-label="Aumentar zoom"
            title="Aumentar zoom"
          >
            <span className="text-xl font-bold text-green-600">+</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="min-w-[48px] min-h-[48px] p-0 hover:bg-red-50 hover:border-red-300 rounded-xl"
            aria-label="Diminuir zoom"
            title="Diminuir zoom"
          >
            <span className="text-xl font-bold text-red-600">−</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onFitAll}
            disabled={bedsCount === 0}
            className="min-w-[48px] min-h-[48px] p-0 text-xs hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 rounded-xl"
            aria-label="Ajustar visualização"
            title="Ver todos os canteiros"
          >
            <span className="text-lg text-blue-600">📐</span>
          </Button>
        </div>
      )}

      {/* Zoom Level Indicator */}
      {!hideZoomControls && (
        <div className="text-xs text-gray-600 text-center px-2 py-1 bg-gray-50 rounded-lg font-mono">
          {zoom.toFixed(1)}x
        </div>
      )}
    </div>
  );
};
