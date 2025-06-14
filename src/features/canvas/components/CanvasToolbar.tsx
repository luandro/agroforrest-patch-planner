
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CanvasTool } from '../types/bed.types';
import { 
  Square, 
  Circle, 
  Undo,
  Redo
} from 'lucide-react';

interface CanvasToolbarProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleConfig: () => void;
  isSaving?: boolean;
  className?: string;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onToggleConfig,
  isSaving = false,
  className
}) => {
  const tools = [
    {
      id: 'pan' as CanvasTool,
      icon: '👋',
      label: 'Mover canvas',
      description: 'Arrastar para navegar'
    },
    {
      id: 'create-rectangle' as CanvasTool,
      icon: Square,
      label: 'Canteiro retangular',
      description: 'Criar canteiros retangulares'
    },
    {
      id: 'create-circle' as CanvasTool,
      icon: Circle,
      label: 'Canteiro circular',
      description: 'Criar canteiros circulares'
    },
    {
      id: 'select' as CanvasTool,
      icon: '🎯',
      label: 'Selecionar',
      description: 'Selecionar e editar canteiros'
    }
  ];

  return (
    <div className={cn(
      "absolute bottom-4 left-1/2 transform -translate-x-1/2",
      "flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200",
      className
    )}>
      {/* Tools */}
      <div className="flex gap-1">
        {tools.map((tool) => {
          const Icon = typeof tool.icon === 'string' ? null : tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <Button
              key={tool.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className={cn(
                "h-10 w-10 p-0 touch-manipulation",
                isActive && "ring-2 ring-blue-500 ring-offset-1"
              )}
              title={tool.label}
              aria-label={tool.label}
            >
              {Icon ? (
                <Icon className="w-4 h-4" />
              ) : (
                <span className="text-sm">{tool.icon}</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-gray-300" />

      {/* History Controls */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-10 w-10 p-0 touch-manipulation"
          title="Desfazer (Ctrl+Z)"
          aria-label="Desfazer"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-10 w-10 p-0 touch-manipulation"
          title="Refazer (Ctrl+Shift+Z)"
          aria-label="Refazer"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-gray-300" />

      {/* Config Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleConfig}
        className="h-10 px-3 touch-manipulation"
        title="Configurar canteiros"
      >
        ⚙️ Config
      </Button>

      {/* Save Status */}
      {isSaving && (
        <div className="flex items-center text-sm text-gray-600 ml-2">
          <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-1" />
          Salvando...
        </div>
      )}
    </div>
  );
};
