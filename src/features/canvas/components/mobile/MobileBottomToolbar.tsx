
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool } from '../../types/bed.types';
import { Move, Square, Target } from 'lucide-react';

interface MobileBottomToolbarProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  className?: string;
}

export const MobileBottomToolbar: React.FC<MobileBottomToolbarProps> = ({
  activeTool,
  onToolChange,
  className
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
      label: 'Canteiro',
      tooltip: 'Criar canteiros retangulares'
    },
    {
      id: 'select' as CanvasTool,
      icon: Target,
      label: 'Selecionar',
      tooltip: 'Selecionar e editar canteiros'
    }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-30",
      "bg-white/95 backdrop-blur-sm border-t border-gray-200",
      "p-2 pb-safe",
      className
    )}>
      <div className="flex justify-center gap-4">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          const IconComponent = tool.icon;
          
          return (
            <Button
              key={tool.id}
              variant={isActive ? 'default' : 'ghost'}
              size="lg"
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "flex-1 max-w-[100px] h-12 flex flex-col items-center justify-center gap-1",
                "touch-manipulation active:scale-95 transition-all",
                isActive && "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
                !isActive && "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
              title={tool.tooltip}
              aria-label={tool.tooltip}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{tool.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
